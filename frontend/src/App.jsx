```jsx
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Sales from "./pages/Sales";

/*
  Protected Route

  Pages that need authentication:
  Products
  Categories
  Suppliers
  Sales
*/
function Protected({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/*
  Public Login Route

  If user is already logged in,
  don't show Login again.
*/
function LoginRoute() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}

export default function App() {
  return (
    <Routes>

      {/* =====================================================
          HOME
          Website opens directly on Dashboard
      ===================================================== */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* =====================================================
          LOGIN
      ===================================================== */}
      <Route
        path="/login"
        element={<LoginRoute />}
      />

      {/* =====================================================
          DASHBOARD
          Public route
      ===================================================== */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* =====================================================
          PRODUCTS
      ===================================================== */}
      <Route
        path="/products"
        element={
          <Protected>
            <Products />
          </Protected>
        }
      />

      {/* =====================================================
          CATEGORIES
      ===================================================== */}
      <Route
        path="/categories"
        element={
          <Protected>
            <Categories />
          </Protected>
        }
      />

      {/* =====================================================
          SUPPLIERS
      ===================================================== */}
      <Route
        path="/suppliers"
        element={
          <Protected>
            <Suppliers />
          </Protected>
        }
      />

      {/* =====================================================
          SALES
      ===================================================== */}
      <Route
        path="/sales"
        element={
          <Protected>
            <Sales />
          </Protected>
        }
      />

      {/* =====================================================
          UNKNOWN ROUTES
      ===================================================== */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}
```
