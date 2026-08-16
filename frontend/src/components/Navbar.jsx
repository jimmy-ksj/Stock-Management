import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  ShoppingCart,
  LogOut,
  Boxes,
  ChevronRight,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/products",
      label: "Products",
      icon: Package,
    },
    {
      path: "/categories",
      label: "Categories",
      icon: Tags,
    },
    {
      path: "/suppliers",
      label: "Suppliers",
      icon: Truck,
    },
    {
      path: "/sales",
      label: "Sales",
      icon: ShoppingCart,
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="sidebar">

      {/* =========================
          BRAND
      ========================= */}
      <div className="sidebar-brand">

        <div className="brand-logo">
          <Boxes size={23} strokeWidth={2.5} />
        </div>

        <div className="brand-content">
          <h2>
            Stock<span>Pro</span>
          </h2>

          <p>Management System</p>
        </div>

      </div>

      {/* =========================
          MENU TITLE
      ========================= */}
      <div className="menu-title">
        MAIN MENU
      </div>

      {/* =========================
          NAVIGATION
      ========================= */}
      <nav className="sidebar-nav">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="link-icon">
                <Icon size={19} strokeWidth={2} />
              </span>

              <span className="link-text">
                {item.label}
              </span>

              <ChevronRight
                className="link-arrow"
                size={16}
              />
            </NavLink>
          );
        })}

      </nav>

      {/* =========================
          USER CARD
      ========================= */}
      <div className="sidebar-user">

        <div className="user-avatar">
          {user?.fullname
            ? user.fullname.charAt(0).toUpperCase()
            : "A"}
        </div>

        <div className="user-info">
          <strong>
            {user?.fullname || "Administrator"}
          </strong>

          <span>
            {user?.role || "Admin"}
          </span>
        </div>

      </div>

      {/* =========================
          LOGOUT
      ========================= */}
      <button
        type="button"
        className="logout"
        onClick={logout}
      >
        <span className="logout-icon">
          <LogOut size={18} />
        </span>

        <span>
          Logout
        </span>
      </button>

      {/* =========================
          VERSION
      ========================= */}
      <div className="sidebar-version">
        StockPro v1.0.0
      </div>

    </aside>
  );
}
