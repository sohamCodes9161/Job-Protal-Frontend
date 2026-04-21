import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import JobDetailsSkeleton from "../components/JobDetailsSkeleton";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, token } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 Fetch job details
  const fetchJob = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await API.get(`/jobs/${id}`);

      setJob(res.data.job || res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  // 🔥 Apply handler
  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await API.post(
        `/jobs/${id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplied(true);
      setMessage("Application submitted successfully!");
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Application failed");
    }
  };

  if (loading) return <JobDetailsSkeleton />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="job-details-container">

      <div className="job-details-card">

        {/* HEADER */}
        <h2>{job.title}</h2>

        <p className="job-meta">
          {job.company} • {job.location}
        </p>

        {/* META INFO */}
        <div className="job-meta-box">
          <p><strong>💰 Salary:</strong> ₹{job.salary}</p>
          <p><strong>⏱ Type:</strong> {job.jobType}</p>
          <p>
            <strong>📅 Posted:</strong>{" "}
            {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* DESCRIPTION */}
        <div className="job-section">
          <h4>Description</h4>
          <p>{job.description}</p>
        </div>

        {/* APPLY BUTTON */}
        <button
          className="apply-btn"
          onClick={handleApply}
          disabled={applied}
        >
          {applied ? "Already Applied" : "Apply Now"}
        </button>

        {/* MESSAGE */}
        {message && <p style={{ marginTop: "10px" }}>{message}</p>}

      </div>
    </div>
  );
};

export default JobDetails;