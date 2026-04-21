import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const EditJob = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    jobType: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Fetch job by id
  const fetchJob = async () => {
    try {
      const res = await API.get(`/jobs/${id}`);

      const job = res.data.job;

      setForm({
        title: job.title,
        description: job.description,
        company: job.company,
        location: job.location,
        salary: job.salary,
        jobType: job.jobType,
      });
    } catch (err) {
      toast.error("Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

  // 🔹 Handle change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/jobs/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Job updated");
      navigate("/admin/jobs");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <p>Loading job...</p>;

  return (
    <div className="form-container">
      <h2>Edit Job</h2>

      <form className="job-form" onSubmit={handleSubmit}>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
        />

        <input
          name="salary"
          value={form.salary}
          onChange={handleChange}
          placeholder="Salary"
        />

        <input
          name="jobType"
          value={form.jobType}
          onChange={handleChange}
          placeholder="Job Type"
        />

        <button type="submit">Update Job</button>
      </form>
    </div>
  );
};

export default EditJob;