import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { token, setUser } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [file, setFile] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Profile
  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(res.data.user);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  // 🔹 Sync form
  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || "",
        email: userData.email || "",
      });
    }
  }, [userData]);

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Save profile
  const handleSave = async () => {
    try {
      const res = await API.put(`/users/${userData.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Profile updated");

      await fetchProfile(); // ✅ sync fresh data
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // 🔹 Cancel edit
  const handleCancel = () => {
    setForm({
      name: userData.name,
      email: userData.email,
    });
    setIsEditing(false);
  };

  // 🔹 File select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF allowed");
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Max size 2MB");
      return;
    }

    setFile(selectedFile);
  };

  // 🔹 Upload resume
  const handleUpload = async () => {
    if (!file) {
      toast.error("Select a file first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", file);

      await API.post("/users/upload-resume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Resume uploaded");

      await fetchProfile(); // refresh
      setFile(null);
    } catch {
      toast.error("Upload failed");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-card">

        {/* Name */}
        <div className="form-group">
          <label>Name</label>
          {isEditing ? (
            <input name="name" value={form.name} onChange={handleChange} />
          ) : (
            <p>{userData.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          {isEditing ? (
            <input name="email" value={form.email} onChange={handleChange} />
          ) : (
            <p>{userData.email}</p>
          )}
        </div>

        <p><strong>Role:</strong> {userData.role}</p>

        {/* Resume */}
        <div className="resume-section">
          <h4>Resume</h4>

          {userData?.resume?.url ? (
            <a
              href={`https://docs.google.com/gview?url=${userData.resume.url}&embedded=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-btn"
            >
              View Resume
            </a>
          ) : (
            <p>No resume uploaded</p>
          )}

          {/* Upload */}
          <div className="upload-section">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Resume</button>
          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;