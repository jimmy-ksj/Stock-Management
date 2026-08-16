```jsx
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
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="sidebar">

      {/* =================================================
          BRAND
      ================================================= */}
      <div className="brand">
        <span className="brand-icon">📦</span>

        <span className="brand-text">
          Stock
          <span className="brand-highlight">
            Pro
          </span>
        </span>
      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}
      <nav className="sidebar-nav">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <Icon size={19} />

              <span>
                {item.label}
              </span>
            </NavLink>
          );
        })}

      </nav>

      {/* =================================================
          LOGOUT
      ================================================= */}
      <div className="sidebar-bottom">

        <button
          type="button"
          className="logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
}
```
