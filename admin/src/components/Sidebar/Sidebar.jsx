import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <p className="admin-sidebar-eyebrow">
          MANN ZARIYA
        </p>

        <h2>Admin</h2>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/products/new"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          Add Product
        </NavLink>
      </nav>

      <div className="admin-sidebar-footer">
        <button
          className="admin-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;