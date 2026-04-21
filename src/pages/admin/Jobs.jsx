import { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AdminJobs = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  // 🔹 Fetch jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await API.get("/jobs/my-jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(res.data.jobs || []);
    } catch (err) {
      console.log(err.response);
      setMessage("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchJobs();
  }, [token]);

  // 🔹 Delete job
  const handleDelete = async (id) => {
    try {
      await API.delete(`/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs((prev) => prev.filter((job) => job._id !== id));
      toast.success("Job deleted successfully");
    } catch (err) {
      console.log(err.response);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <h2>Manage Jobs</h2>

      {message && <p>{message}</p>}

      <div className="applications-list">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <h3>No jobs yet</h3>
            <p>Create your first job to get started</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="job-card">

              <div className="job-header">
                <h3>{job.title}</h3>
                <span className="job-type">{job.jobType}</span>
              </div>

              <p className="company">{job.company}</p>
              <p className="location">{job.location}</p>

              <div className="job-footer">
                <span className="salary">{job.salary}</span>

                <div className="actions">
                  <button
                    onClick={() =>
                      navigate(`/admin/jobs/${job._id}/applicants`)
                    }
                  >
                    Applicants
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => setSelectedJob(job)}
                  >
                    Delete
                  </button>

                  <button onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}>
                    Edit Job
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* 🔥 Modal (rendered once, outside map) */}
      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Job</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedJob.title}</strong>?
            </p>

            <div className="modal-actions">
              <button onClick={() => setSelectedJob(null)}>
                Cancel
              </button>

              <button
                onClick={() => {
                  handleDelete(selectedJob._id);
                  setSelectedJob(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;