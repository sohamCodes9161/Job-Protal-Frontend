import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* Left */}
      <div className="navbar-left">
        <Link to="/" className="logo">JobPortal</Link>
      </div>

      {/* Right */}
      <div className="navbar-right">

        {/* Guest */}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {/* Normal User */}
        {user && (
          <>
            {/* Common for ALL users */}
            <Link to="/">Jobs</Link>
            <Link to="/applications">Applications</Link>
            <Link to="/profile">Profile</Link>

            {/* Admin extras */}
            {user.role === "admin" && (
              <>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/jobs">Manage Jobs</Link>
                <Link to="/admin/jobs/create">Create Job</Link>
              </>
            )}

            <button onClick={handleLogout}>Logout</button>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;