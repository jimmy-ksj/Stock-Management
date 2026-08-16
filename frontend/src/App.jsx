```jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Sales from "./pages/Sales";
import Navbar from "./components/Navbar";

/*
|--------------------------------------------------------------------------
| Layout
|--------------------------------------------------------------------------
| Navbar igaragara kuri pages za system.
| Login yo nta Navbar igira.
*/

function Layout({ children }) {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app-layout">
      {!isLoginPage && <Navbar />}

      <main className={!isLoginPage ? "main-content" : ""}>
        {children}
      </main>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| App
|--------------------------------------------------------------------------
*/

export default function App() {
  return (
    <Routes>

      {/* =====================================================
          HOME
          Website ifunguka kuri Dashboard
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
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />

      {/* =====================================================
          DASHBOARD
      ===================================================== */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      {/* =====================================================
          PRODUCTS
      ===================================================== */}
      <Route
        path="/products"
        element={
          <Layout>
            <Products />
          </Layout>
        }
      />

      {/* =====================================================
          CATEGORIES
      ===================================================== */}
      <Route
        path="/categories"
        element={
          <Layout>
            <Categories />
          </Layout>
        }
      />

      {/* =====================================================
          SUPPLIERS
      ===================================================== */}
      <Route
        path="/suppliers"
        element={
          <Layout>
            <Suppliers />
          </Layout>
        }
      />

      {/* =====================================================
          SALES
      ===================================================== */}
      <Route
        path="/sales"
        element={
          <Layout>
            <Sales />
          </Layout>
        }
      />

      {/* =====================================================
          UNKNOWN URL
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
```
