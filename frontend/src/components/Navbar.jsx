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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="sidebar">

      <div className="brand">
         Stock<span>Pro</span>
      </div>

      <nav>

        <NavLink to="/dashboard">
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/products">
          <Package size={18} />
          Products
        </NavLink>

        <NavLink to="/categories">
          <Tags size={18} />
          Categories
        </NavLink>

        <NavLink to="/suppliers">
          <Truck size={18} />
          Suppliers
        </NavLink>

        <NavLink to="/sales">
          <ShoppingCart size={18} />
          Sales
        </NavLink>

      </nav>

      <button
        type="button"
        className="logout"
        onClick={logout}
      >
        <LogOut size={18} />
        Logout
      </button>

    </aside>
  );
}
