import {
  NavLink,
  useNavigate,
} from "react-router-dom";

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

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

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

      {/* LOGO */}
      <div className="brand">

        <div className="brand-icon">
          <Boxes size={24} />
        </div>

        <div>
          <div className="brand-name">
            Stock<span>Pro</span>
          </div>

          <div className="brand-subtitle">
            Management System
          </div>
        </div>

      </div>

      {/* MENU */}
      <div className="menu-label">
        MAIN MENU
      </div>

      <nav className="sidebar-nav">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">
                <Icon size={19} />
              </span>

              <span className="sidebar-text">
                {item.label}
              </span>

              <ChevronRight
                className="sidebar-arrow"
                size={16}
              />

            </NavLink>
          );
        })}

      </nav>

      {/* USER */}
      <div className="sidebar-spacer" />

      <div className="user-card">

        <div className="user-avatar">
          {user?.fullname
            ? user.fullname.charAt(0).toUpperCase()
            : "A"}
        </div>

        <div className="user-details">

          <strong>
            {user?.fullname || "Administrator"}
          </strong>

          <span>
            {user?.role || "Admin"}
          </span>

        </div>

      </div>

      {/* LOGOUT */}
      <button
        type="button"
        className="logout-button"
        onClick={logout}
      >
        <LogOut size={18} />

        <span>
          Logout
        </span>
      </button>

      <div className="version">
        StockPro v1.0.0
      </div>

    </aside>
  );
}
