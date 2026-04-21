import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <>
      <Navbar />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;