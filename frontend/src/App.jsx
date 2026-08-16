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

      {/* DEFAULT */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}
