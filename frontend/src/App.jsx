```jsx
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Sales from "./pages/Sales";

export default function App() {
  return (
    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* PRODUCTS */}
      <Route
        path="/products"
        element={<Products />}
      />

      {/* CATEGORIES */}
      <Route
        path="/categories"
        element={<Categories />}
      />

      {/* SUPPLIERS */}
      <Route
        path="/suppliers"
        element={<Suppliers />}
      />

      {/* SALES */}
      <Route
        path="/sales"
        element={<Sales />}
      />

      {/* UNKNOWN */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}
```

**Nakuyeho `Protected`** kugira ngo gukanda pages bigende nta token.

---

### 2. Koresha `NavLink` muri Sidebar/Navbar

Muri `components/Navbar.jsx` cyangwa Sidebar yawe, ntukoreshe:

```jsx
<a href="/products">Products</a>
```

Koresha:

```jsx
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/dashboard", { replace: true });
  };

  return (
    <nav className="navbar">

      <NavLink to="/dashboard">
        Dashboard
      </NavLink>

      <NavLink to="/products">
        Products
      </NavLink>

      <NavLink to="/categories">
        Categories
      </NavLink>

      <NavLink to="/suppliers">
        Suppliers
      </NavLink>

      <NavLink to="/sales">
        Sales
      </NavLink>

      <button onClick={logout}>
        Logout
      </button>

    </nav>
  );
}
```
