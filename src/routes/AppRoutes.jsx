import { Routes, Route } from "react-router-dom";

import EditJob from "../pages/admin/EditJob";
// Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import Jobs from "../pages/Jobs";
import JobDetails from "../pages/JobDetails";
import Profile from "../pages/Profile";
import Applications from "../pages/Applications";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import AdminJobs from "../pages/admin/Jobs";
import CreateJob from "../pages/admin/CreateJob";
import Applicants from "../pages/admin/Applicants"; // ✅ ADD THIS

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Routes WITH Navbar/Layout */}
      <Route element={<MainLayout />}>

        {/* Public */}
        <Route path="/" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/applications" element={<Applications />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/jobs/create" element={<CreateJob />} />

          {/* ✅ NEW ROUTE */}
          <Route
            path="/admin/jobs/:id/applicants"
            element={<Applicants />}
          />
        </Route>

      </Route>
       <Route path="/admin/jobs/:id/edit" element={<EditJob />} />
      {/* Routes WITHOUT Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

    </Routes>
  );
};

export default AppRoutes;