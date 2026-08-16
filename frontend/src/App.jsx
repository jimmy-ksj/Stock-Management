import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Sales from "./pages/Sales";

/* Protected pages */
function Protected({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>

      {/* WEBSITE HOME → DASHBOARD */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* DASHBOARD - PUBLIC */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* PRODUCTS */}
      <Route
        path="/products"
        element={
          <Protected>
            <Products />
          </Protected>
        }
      />

      {/* CATEGORIES */}
      <Route
        path="/categories"
        element={
          <Protected>
            <Categories />
          </Protected>
        }
      />

      {/* SUPPLIERS */}
      <Route
        path="/suppliers"
        element={
          <Protected>
            <Suppliers />
          </Protected>
        }
      />

      {/* SALES */}
      <Route
        path="/sales"
        element={
          <Protected>
            <Sales />
          </Protected>
        }
      />

      {/* UNKNOWN URL */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}
