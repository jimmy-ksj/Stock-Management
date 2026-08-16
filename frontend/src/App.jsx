import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Sales from "./pages/Sales";

/* =========================================================
   SYSTEM LAYOUT
   Navbar igaragara kuri pages zose uretse Login
========================================================= */

function SystemLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>

      {/* =====================================================
          HOME
          Website → Dashboard
      ===================================================== */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* =====================================================
          LOGIN
      ===================================================== */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* =====================================================
          DASHBOARD
      ===================================================== */}
      <Route
        path="/dashboard"
        element={
          <SystemLayout>
            <Dashboard />
          </SystemLayout>
        }
      />

      {/* =====================================================
          PRODUCTS
      ===================================================== */}
      <Route
        path="/products"
        element={
          <SystemLayout>
            <Products />
          </SystemLayout>
        }
      />

      {/* =====================================================
          CATEGORIES
      ===================================================== */}
      <Route
        path="/categories"
        element={
          <SystemLayout>
            <Categories />
          </SystemLayout>
        }
      />

      {/* =====================================================
          SUPPLIERS
      ===================================================== */}
      <Route
        path="/suppliers"
        element={
          <SystemLayout>
            <Suppliers />
          </SystemLayout>
        }
      />

      {/* =====================================================
          SALES
      ===================================================== */}
      <Route
        path="/sales"
        element={
          <SystemLayout>
            <Sales />
          </SystemLayout>
        }
      />

      {/* =====================================================
          UNKNOWN URL
          URL itazwi → Dashboard
      ===================================================== */}
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}
