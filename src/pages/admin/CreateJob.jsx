import { useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
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

  const [message, setMessage] = useState("");

  // handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");

      const res = await API.post("/jobs", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Job created successfully!");

      // redirect after success
      setTimeout(() => {
        navigate("/admin/jobs");
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create job");
    }
  };

  return (
    <div className="form-container">
      <h2>Create Job</h2>

      <form className="job-form" onSubmit={handleSubmit}>

        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <input
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
        />

        <input
          name="jobType"
          placeholder="Job Type"
          value={form.jobType}
          onChange={handleChange}
        />

        <button type="submit">Create Job</button>

      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateJob;