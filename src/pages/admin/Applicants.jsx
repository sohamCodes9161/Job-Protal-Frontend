import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";


const Applicants = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);

    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplicants = async () => {
        try {
            const res = await API.get(`/jobs/${id}/applicants`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Applicants:", res.data);

            setApplicants(res.data.applications || []);
        } catch (err) {
            console.log(err.response);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, []);
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
            </div>
        );
    }
    const updateStatus = async (applicationId, status) => {
        try {
            await API.put(
                `/jobs/${applicationId}/update`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // instant UI update
            setApplicants((prev) =>
                prev.map((app) =>
                    app._id === applicationId ? { ...app, status } : app
                )
            );

        } catch (err) {
            console.log(err.response);
            toast.error("Failed to update status");
        }
    };
    return (
        <div className="applications-container">
            <h2>Applicants</h2>

            {applicants.length === 0 ? (
                <p>No applicants yet</p>
            ) : (
                applicants.map((app) => (
                    <div key={app._id} className="application-card">
                        <h3>{app.user?.name}</h3>
                        <p>{app.user?.email}</p>
                        <span className={`status-badge ${app.status}`}>
                            {app.status}
                        </span>
                        {app.status === "pending" && (
                            <div className="actions">
                                <button onClick={() => updateStatus(app._id, "accepted")}>
                                    Accept
                                </button>

                                <button onClick={() => updateStatus(app._id, "rejected")}>
                                    Reject
                                </button>
                            </div>
                        )}


                        {app.user?.resume?.url && (
                            <a
                                href={`https://docs.google.com/gview?url=${app.user.resume.url}&embedded=true`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button>View Resume</button>
                            </a>
                        )}

                    </div>
                ))
            )}
        </div>
    );
};

export default Applicants;