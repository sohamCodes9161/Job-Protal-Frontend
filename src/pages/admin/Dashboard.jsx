import { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { token } = useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get("/jobs/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data.stats);
    } catch (err) {
      console.log(err.response);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      {/* 🔥 Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <p>{stats.totalJobs}</p>
        </div>

        <div className="stat-card">
          <h3>Total Applicants</h3>
          <p>{stats.totalApplicants}</p>
        </div>
      </div>

      {/* 🔥 Recent Jobs */}
      <div className="recent-jobs">
        <h3>Recent Jobs</h3>

        {stats.recentJobs.length === 0 ? (
          <p>No recent jobs</p>
        ) : (
          stats.recentJobs.map((job) => (
            <div key={job._id} className="job-row">
              <div>
                <h4>{job.title}</h4>
                <p>{job.company}</p>
              </div>

              <span>
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;