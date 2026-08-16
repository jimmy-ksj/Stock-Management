```jsx
import { NavLink, useNavigate } from "react-router-dom";
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
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/products",
      name: "Products",
      icon: Package,
    },
    {
      path: "/categories",
      name: "Categories",
      icon: Tags,
    },
    {
      path: "/suppliers",
      name: "Suppliers",
      icon: Truck,
    },
    {
      path: "/sales",
      name: "Sales",
      icon: ShoppingCart,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });
  };

  return (
    <aside className="sidebar">

      {/* BRAND */}
      <div className="brand">
        <span className="brand-icon">📦</span>
        Stock<span>Pro</span>
      </div>

      {/* MENU */}
      <nav className="sidebar-nav">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </nav>

      {/* LOGOUT */}
      <button
        type="button"
        className="logout"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>

    </aside>
  );
}
```
