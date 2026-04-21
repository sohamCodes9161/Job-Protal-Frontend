import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ApplicationSkeleton from "../components/ApplicationSkeleton";

const Applications = () => {
  const { token } = useContext(AuthContext);

  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 🔥 NEW

  const fetchApplications = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await API.get("/jobs/getmyapplications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data.applications || []);
    } catch (err) {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // 🔥 FILTER LOGIC
  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  if (loading) {
    return (
      <div className="applications-list">
        {[...Array(5)].map((_, i) => (
          <ApplicationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="applications-container">
      <h2>My Applications</h2>

      {/* 🔥 FILTER BAR */}
      <div className="filter-bar">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>

        <button
          className={filter === "reviewed" ? "active" : ""}
          onClick={() => setFilter("reviewed")}
        >
          Reviewed
        </button>

        <button
          className={filter === "accepted" ? "active" : ""}
          onClick={() => setFilter("accepted")}
        >
          Accepted
        </button>

        <button
          className={filter === "rejected" ? "active" : ""}
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </button>
      </div>

      <div className="applications-list">
        {filteredApplications.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            No applications found for this filter.
          </p>
        ) : (
          filteredApplications.map((app) => (
            <div key={app._id} className="application-card">
              <h3>{app.job?.title}</h3>
              <p>{app.job?.company}</p>

              <span className={`status-badge ${app.status}`}>
                {app.status}
              </span>

              <p className="date">
                Applied on:{" "}
                {new Date(app.createdAt).toLocaleDateString()}
              </p>

              <Link to={`/jobs/${app.job?._id}`}>
                <button>View Job</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Applications;