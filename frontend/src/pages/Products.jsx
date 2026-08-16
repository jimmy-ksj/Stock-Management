import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import {
  Package,
  Plus,
  Search,
  Trash2,
  Boxes,
  AlertTriangle,
  DollarSign,
  X,
  RefreshCw,
} from "lucide-react";

export default function Products() {
  const [data, setData] = useState([]);
  const [cats, setCats] = useState([]);
  const [sup, setSup] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [f, setF] = useState({
    product_name: "",
    category_id: "",
    supplier_id: "",
    quantity: 0,
    price: 0,
  });

  /* =====================================================
     LOAD DATA
  ===================================================== */

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsRes, categoriesRes, suppliersRes] =
        await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/suppliers"),
        ]);

      setData(Array.isArray(productsRes.data) ? productsRes.data : []);
      setCats(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      setSup(Array.isArray(suppliersRes.data) ? suppliersRes.data : []);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =====================================================
     FORM
  ===================================================== */

  const resetForm = () => {
    setF({
      product_name: "",
      category_id: "",
      supplier_id: "",
      quantity: 0,
      price: 0,
    });
  };

  const add = async (e) => {
    e.preventDefault();

    if (!f.product_name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!f.category_id) {
      alert("Please select a category.");
      return;
    }

    if (!f.supplier_id) {
      alert("Please select a supplier.");
      return;
    }

    if (Number(f.quantity) < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    if (Number(f.price) < 0) {
      alert("Price cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/products", {
        ...f,
        quantity: Number(f.quantity),
        price: Number(f.price),
      });

      resetForm();
      setShowForm(false);

      await load();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to add product."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const del = async (id) => {
    const product = data.find((item) => item.id === id);

    const confirmed = window.confirm(
      `Delete "${product?.product_name || "this product"}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`);

      await load();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return data;

    return data.filter((p) => {
      return (
        String(p.product_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(p.category_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(p.supplier_name || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [data, search]);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalProducts = data.length;

  const totalQuantity = data.reduce(
    (sum, p) => sum + Number(p.quantity || 0),
    0
  );

  const lowStock = data.filter(
    (p) => Number(p.quantity || 0) < 5
  ).length;

  const stockValue = data.reduce(
    (sum, p) =>
      sum +
      Number(p.quantity || 0) *
        Number(p.price || 0),
    0
  );

  const money = (value) =>
    Number(value || 0).toLocaleString("en-US");

  return (
    <div className="products-page">

      {/* =================================================
          INTERNAL CSS
      ================================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .products-page {
          min-height: 100vh;
          width: 100%;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          color: #17231f;
        }

        /* ================= HEADER ================= */

        .products-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .header-icon {
          width: 48px;
          height: 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          color: #059669;
          background: #ecfdf5;

          border: 1px solid #d1fae5;
        }

        .products-title {
          margin: 0;
          font-size: 30px;
          font-weight: 850;
          letter-spacing: -1px;
          color: #13201c;
        }

        .products-subtitle {
          margin: 5px 0 0;
          color: #7b8985;
          font-size: 13px;
        }

        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          padding: 12px 17px;

          border: 0;
          border-radius: 11px;

          color: white;
          background: #059669;

          font-size: 12px;
          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 8px 20px rgba(5,150,105,.20);

          transition: .2s ease;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          background: #047857;
          box-shadow:
            0 12px 25px rgba(5,150,105,.27);
        }

        /* ================= STATS ================= */

        .stats {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 15px;

          margin-bottom: 20px;
        }

        .stat {
          position: relative;
          overflow: hidden;

          padding: 17px;

          border: 1px solid #e7eeeb;
          border-radius: 15px;

          background: white;

          box-shadow:
            0 5px 20px rgba(20,40,35,.045);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-icon {
          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;
        }

        .stat:nth-child(1) .stat-icon {
          color: #059669;
          background: #ecfdf5;
        }

        .stat:nth-child(2) .stat-icon {
          color: #2563eb;
          background: #eff6ff;
        }

        .stat:nth-child(3) .stat-icon {
          color: #d97706;
          background: #fffbeb;
        }

        .stat:nth-child(4) .stat-icon {
          color: #7c3aed;
          background: #f5f3ff;
        }

        .stat-label {
          display: block;

          margin-top: 14px;

          color: #7d8b87;

          font-size: 10px;
          font-weight: 650;
        }

        .stat-value {
          display: block;

          margin-top: 4px;

          color: #17231f;

          font-size: 22px;
          font-weight: 850;

          letter-spacing: -.5px;
        }

        /* ================= FORM ================= */

        .form-panel {
          margin-bottom: 20px;

          padding: 20px;

          border: 1px solid #e7eeeb;
          border-radius: 16px;

          background: white;

          box-shadow:
            0 5px 20px rgba(20,40,35,.045);
        }

        .form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 17px;
        }

        .form-header h2 {
          margin: 0;

          font-size: 15px;
          font-weight: 800;
        }

        .form-header p {
          margin: 4px 0 0;

          color: #8a9793;

          font-size: 10px;
        }

        .close-form {
          width: 31px;
          height: 31px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #e5ebe8;
          border-radius: 8px;

          background: white;
          color: #71817c;

          cursor: pointer;
        }

        .close-form:hover {
          background: #f5f7f6;
        }

        .form-grid {
          display: grid;

          grid-template-columns:
            1.4fr
            1fr
            1fr
            .8fr
            1fr
            auto;

          gap: 10px;
        }

        .input-group {
          position: relative;
        }

        .input,
        .select {
          width: 100%;

          height: 43px;

          padding: 0 12px;

          border: 1px solid #e1e9e5;
          border-radius: 9px;

          outline: none;

          background: #fbfcfc;
          color: #26352f;

          font-size: 11px;

          transition: .2s ease;
        }

        .input:focus,
        .select:focus {
          border-color: #34d399;

          background: white;

          box-shadow:
            0 0 0 3px rgba(52,211,153,.10);
        }

        .submit-btn {
          height: 43px;

          padding: 0 17px;

          border: 0;
          border-radius: 9px;

          background: #059669;
          color: white;

          font-size: 11px;
          font-weight: 800;

          cursor: pointer;
        }

        .submit-btn:hover {
          background: #047857;
        }

        .submit-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        /* ================= TABLE PANEL ================= */

        .table-panel {
          overflow: hidden;

          border: 1px solid #e7eeeb;
          border-radius: 16px;

          background: white;

          box-shadow:
            0 5px 20px rgba(20,40,35,.045);
        }

        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          padding: 17px 19px;

          border-bottom: 1px solid #edf1ef;
        }

        .table-title {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .table-title-icon {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #059669;
          background: #ecfdf5;
        }

        .table-title h2 {
          margin: 0;

          font-size: 14px;
          font-weight: 800;
        }

        .table-title span {
          display: block;

          margin-top: 2px;

          color: #9aa7a3;

          font-size: 9px;
        }

        .search-box {
          width: 230px;
          height: 38px;

          display: flex;
          align-items: center;
          gap: 8px;

          padding: 0 11px;

          border: 1px solid #e1e9e5;
          border-radius: 9px;

          background: #fbfcfc;
        }

        .search-box svg {
          color: #9aa8a4;
          flex-shrink: 0;
        }

        .search-box input {
          width: 100%;

          border: 0;
          outline: none;

          background: transparent;

          font-size: 10px;
          color: #26352f;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;

          border-collapse: collapse;

          min-width: 800px;
        }

        th {
          padding: 13px 17px;

          text-align: left;

          background: #fafcfb;

          color: #82908b;

          border-bottom: 1px solid #edf1ef;

          font-size: 9px;
          font-weight: 800;

          text-transform: uppercase;
          letter-spacing: .5px;
        }

        td {
          padding: 14px 17px;

          border-bottom: 1px solid #f0f3f2;

          color: #44534e;

          font-size: 11px;
        }

        tbody tr {
          transition: .15s ease;
        }

        tbody tr:hover {
          background: #fbfefc;
        }

        .product-name {
          display: flex;
          align-items: center;
          gap: 9px;

          color: #26352f;
          font-weight: 750;
        }

        .product-mini-icon {
          width: 31px;
          height: 31px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          color: #059669;
          background: #ecfdf5;
        }

        .category-badge {
          display: inline-flex;

          padding: 5px 8px;

          border-radius: 6px;

          color: #596862;
          background: #f3f6f5;

          font-size: 9px;
          font-weight: 650;
        }

        .supplier {
          color: #687772;
        }

        .quantity {
          font-weight: 800;
          color: #33423d;
        }

        .low {
          display: inline-flex;

          padding: 5px 8px;

          border-radius: 6px;

          color: #dc2626;
          background: #fef2f2;

          font-size: 9px;
          font-weight: 800;
        }

        .price {
          color: #17231f;
          font-weight: 750;
        }

        .delete-btn {
          width: 32px;
          height: 32px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #fee2e2;
          border-radius: 8px;

          color: #dc2626;
          background: #fffafa;

          cursor: pointer;

          transition: .2s ease;
        }

        .delete-btn:hover {
          color: white;
          background: #dc2626;
          border-color: #dc2626;
        }

        /* ================= STATES ================= */

        .loading,
        .empty,
        .error {
          padding: 55px 20px;

          text-align: center;
        }

        .loading svg {
          animation: spin 1s linear infinite;
        }

        .empty-icon {
          width: 50px;
          height: 50px;

          margin: auto;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          color: #059669;
          background: #ecfdf5;
        }

        .empty h3,
        .error h3 {
          margin: 12px 0 5px;

          font-size: 14px;
        }

        .empty p,
        .error p {
          margin: 0;

          color: #8a9793;

          font-size: 10px;
        }

        .error {
          color: #dc2626;
        }

        .error button {
          margin-top: 12px;

          padding: 9px 13px;

          border: 0;
          border-radius: 8px;

          background: #dc2626;
          color: white;

          font-size: 10px;
          font-weight: 750;

          cursor: pointer;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1150px) {
          .stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .form-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .submit-btn {
            width: 100%;
          }
        }

        @media (max-width: 700px) {
          .products-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .add-btn {
            width: 100%;
            justify-content: center;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .table-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }
        }

      `}</style>

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="products-header">

        <div className="header-info">

          <div className="header-icon">
            <Package size={23} />
          </div>

          <div>
            <h1 className="products-title">
              Products
            </h1>

            <p className="products-subtitle">
              Manage your inventory products and stock levels.
            </p>
          </div>

        </div>

        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={17} />

          {showForm
            ? "Close Form"
            : "Add Product"}
        </button>

      </header>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="stats">

        <div className="stat">

          <div className="stat-top">
            <div className="stat-icon">
              <Package size={18} />
            </div>
          </div>

          <span className="stat-label">
            Total Products
          </span>

          <strong className="stat-value">
            {totalProducts}
          </strong>

        </div>

        <div className="stat">

          <div className="stat-top">
            <div className="stat-icon">
              <Boxes size={18} />
            </div>
          </div>

          <span className="stat-label">
            Total Items
          </span>

          <strong className="stat-value">
            {totalQuantity.toLocaleString()}
          </strong>

        </div>

        <div className="stat">

          <div className="stat-top">
            <div className="stat-icon">
              <AlertTriangle size={18} />
            </div>
          </div>

          <span className="stat-label">
            Low Stock
          </span>

          <strong className="stat-value">
            {lowStock}
          </strong>

        </div>

        <div className="stat">

          <div className="stat-top">
            <div className="stat-icon">
              <DollarSign size={18} />
            </div>
          </div>

          <span className="stat-label">
            Stock Value
          </span>

          <strong className="stat-value">
            {money(stockValue)} RWF
          </strong>

        </div>

      </section>

      {/* =================================================
          ADD PRODUCT FORM
      ================================================= */}

      {showForm && (
        <section className="form-panel">

          <div className="form-header">

            <div>
              <h2>
                Add New Product
              </h2>

              <p>
                Enter product information below.
              </p>
            </div>

            <button
              type="button"
              className="close-form"
              onClick={() => setShowForm(false)}
            >
              <X size={15} />
            </button>

          </div>

          <form
            className="form-grid"
            onSubmit={add}
          >

            <input
              className="input"
              required
              placeholder="Product name"
              value={f.product_name}
              onChange={(e) =>
                setF({
                  ...f,
                  product_name: e.target.value,
                })
              }
            />

            <select
              className="select"
              required
              value={f.category_id}
              onChange={(e) =>
                setF({
                  ...f,
                  category_id: e.target.value,
                })
              }
            >
              <option value="">
                Select category
              </option>

              {cats.map((x) => (
                <option
                  value={x.id}
                  key={x.id}
                >
                  {x.category_name}
                </option>
              ))}
            </select>

            <select
              className="select"
              required
              value={f.supplier_id}
              onChange={(e) =>
                setF({
                  ...f,
                  supplier_id: e.target.value,
                })
              }
            >
              <option value="">
                Select supplier
              </option>

              {sup.map((x) => (
                <option
                  value={x.id}
                  key={x.id}
                >
                  {x.supplier_name}
                </option>
              ))}
            </select>

            <input
              className="input"
              type="number"
              min="0"
              placeholder="Quantity"
              value={f.quantity}
              onChange={(e) =>
                setF({
                  ...f,
                  quantity: e.target.value,
                })
              }
            />

            <input
              className="input"
              type="number"
              min="0"
              placeholder="Price (RWF)"
              value={f.price}
              onChange={(e) =>
                setF({
                  ...f,
                  price: e.target.value,
                })
              }
            />

            <button
              className="submit-btn"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Adding..."
                : "Add Product"}
            </button>

          </form>

        </section>
      )}

      {/* =================================================
          PRODUCTS TABLE
      ================================================= */}

      <section className="table-panel">

        <div className="table-header">

          <div className="table-title">

            <div className="table-title-icon">
              <Boxes size={17} />
            </div>

            <div>
              <h2>
                Product Inventory
              </h2>

              <span>
                {filteredProducts.length} products displayed
              </span>
            </div>

          </div>

          <div className="search-box">

            <Search size={15} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        {/* ERROR */}

        {error ? (
          <div className="error">

            <AlertTriangle size={25} />

            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

            <button onClick={load}>
              Try Again
            </button>

          </div>
        ) : loading ? (

          /* LOADING */

          <div className="loading">
            <RefreshCw size={25} />

            <p>
              Loading products...
            </p>
          </div>

        ) : filteredProducts.length === 0 ? (

          /* EMPTY */

          <div className="empty">

            <div className="empty-icon">
              <Package size={24} />
            </div>

            <h3>
              {search
                ? "No products found"
                : "No products yet"}
            </h3>

            <p>
              {search
                ? "Try another search keyword."
                : "Add your first product to start managing inventory."}
            </p>

          </div>

        ) : (

          <div className="table-wrap">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map((p) => (

                  <tr key={p.id}>

                    <td>
                      #{p.id}
                    </td>

                    <td>

                      <div className="product-name">

                        <div className="product-mini-icon">
                          <Package size={15} />
                        </div>

                        {p.product_name}

                      </div>

                    </td>

                    <td>
                      <span className="category-badge">
                        {p.category_name || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span className="supplier">
                        {p.supplier_name || "N/A"}
                      </span>
                    </td>

                    <td>

                      {Number(p.quantity) < 5 ? (
                        <span className="low">
                          {p.quantity} Low
                        </span>
                      ) : (
                        <span className="quantity">
                          {p.quantity}
                        </span>
                      )}

                    </td>

                    <td>
                      <span className="price">
                        {money(p.price)} RWF
                      </span>
                    </td>

                    <td>

                      <button
                        type="button"
                        className="delete-btn"
                        title="Delete product"
                        onClick={() => del(p.id)}
                      >
                        <Trash2 size={15} />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}
