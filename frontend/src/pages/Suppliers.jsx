```jsx
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState({
    supplier_name: "",
    phone: "",
    address: "",
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const response = await api.get("/suppliers");

      setSuppliers(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to load suppliers.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setMessage({
      type: "",
      text: "",
    });
  };

  const addSupplier = async (e) => {
    e.preventDefault();

    if (!form.supplier_name.trim()) {
      setMessage({
        type: "error",
        text: "Supplier name is required.",
      });
      return;
    }

    try {
      setAdding(true);
      setMessage({ type: "", text: "" });

      await api.post("/suppliers", {
        supplier_name: form.supplier_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      setForm({
        supplier_name: "",
        phone: "",
        address: "",
      });

      setMessage({
        type: "success",
        text: "Supplier added successfully.",
      });

      await load();
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to add supplier.",
      });
    } finally {
      setAdding(false);
    }
  };

  const filteredSuppliers = useMemo(() => {
    const keyword = search.toLowerCase();

    return suppliers.filter((supplier) => {
      return (
        supplier.supplier_name
          ?.toLowerCase()
          .includes(keyword) ||
        supplier.phone
          ?.toLowerCase()
          .includes(keyword) ||
        supplier.address
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [suppliers, search]);

  return (
    <>
      <style>{`
        .suppliers-page {
          width: 100%;
          color: #eaf2ed;
        }

        /* HEADER */

        .suppliers-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .suppliers-title {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .suppliers-icon {
          width: 54px;
          height: 54px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 16px;

          font-size: 24px;

          background:
            linear-gradient(
              135deg,
              rgba(0,255,136,.18),
              rgba(0,255,136,.035)
            );

          border: 1px solid rgba(0,255,136,.16);

          box-shadow:
            0 0 25px rgba(0,255,136,.06);
        }

        .suppliers-header h1 {
          margin: 0;

          color: #fff;

          font-size: 29px;
          font-weight: 800;

          letter-spacing: -.8px;
        }

        .suppliers-header p {
          margin: 5px 0 0;

          color: #75827b;

          font-size: 13px;
        }

        /* SUMMARY */

        .supplier-summary {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 16px;

          margin-bottom: 20px;
        }

        .summary-card {
          position: relative;

          overflow: hidden;

          padding: 20px;

          border-radius: 17px;

          border: 1px solid rgba(255,255,255,.07);

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.045),
              rgba(255,255,255,.015)
            );

          box-shadow:
            0 15px 40px rgba(0,0,0,.15);
        }

        .summary-card::after {
          content: "";

          position: absolute;

          width: 100px;
          height: 100px;

          right: -45px;
          bottom: -45px;

          border-radius: 50%;

          background: rgba(0,255,136,.06);
        }

        .summary-top {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 14px;
        }

        .summary-label {
          color: #68766f;

          font-size: 11px;

          text-transform: uppercase;

          letter-spacing: .7px;
        }

        .summary-icon {
          width: 32px;
          height: 32px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 9px;

          color: #00ff88;

          background: rgba(0,255,136,.07);

          border: 1px solid rgba(0,255,136,.1);
        }

        .summary-value {
          color: #fff;

          font-size: 25px;

          font-weight: 800;

          letter-spacing: -.6px;
        }

        .summary-value.green {
          color: #00ff88;
        }

        /* MESSAGE */

        .message {
          margin-bottom: 18px;

          padding: 13px 15px;

          border-radius: 11px;

          font-size: 12px;
        }

        .message.success {
          color: #6dffb0;

          background: rgba(0,255,136,.055);

          border:
            1px solid rgba(0,255,136,.15);
        }

        .message.error {
          color: #ff9b9b;

          background: rgba(255,50,50,.055);

          border:
            1px solid rgba(255,70,70,.16);
        }

        /* FORM */

        .supplier-form-panel {
          margin-bottom: 20px;

          padding: 21px;

          border-radius: 18px;

          border:
            1px solid rgba(255,255,255,.07);

          background:
            linear-gradient(
              135deg,
              rgba(0,255,136,.045),
              rgba(255,255,255,.018)
            );

          box-shadow:
            0 20px 55px rgba(0,0,0,.18);
        }

        .panel-heading {
          display: flex;

          align-items: center;

          gap: 10px;

          margin-bottom: 18px;
        }

        .panel-heading-icon {
          color: #00ff88;

          font-size: 17px;
        }

        .panel-heading h3 {
          margin: 0;

          color: #eaf2ed;

          font-size: 14px;

          font-weight: 700;
        }

        .panel-heading p {
          margin: 3px 0 0;

          color: #59665f;

          font-size: 11px;
        }

        .supplier-form {
          display: grid;

          grid-template-columns:
            1.2fr
            1fr
            1fr
            160px;

          gap: 12px;

          align-items: end;
        }

        .field label {
          display: block;

          margin-bottom: 8px;

          color: #8c9992;

          font-size: 11px;

          font-weight: 600;
        }

        .input-wrapper {
          position: relative;
        }

        .field-icon {
          position: absolute;

          left: 14px;
          top: 50%;

          transform: translateY(-50%);

          color: #5f6c65;

          pointer-events: none;
        }

        .supplier-input {
          width: 100%;

          height: 49px;

          padding: 0 13px 0 42px;

          border-radius: 11px;

          outline: none;

          border:
            1px solid rgba(255,255,255,.08);

          background: rgba(0,0,0,.2);

          color: #fff;

          font-size: 13px;

          transition: .25s ease;
        }

        .supplier-input::placeholder {
          color: #536059;
        }

        .supplier-input:focus {
          border-color:
            rgba(0,255,136,.45);

          box-shadow:
            0 0 0 3px rgba(0,255,136,.06);
        }

        .add-button {
          height: 49px;

          border: none;

          border-radius: 11px;

          cursor: pointer;

          color: #021109;

          font-size: 13px;

          font-weight: 800;

          background:
            linear-gradient(
              135deg,
              #00ff88,
              #00cf72
            );

          box-shadow:
            0 9px 25px rgba(0,255,136,.12);

          transition: .25s ease;
        }

        .add-button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 13px 30px rgba(0,255,136,.22);
        }

        .add-button:disabled {
          opacity: .55;

          cursor: not-allowed;
        }

        /* TABLE */

        .supplier-table-panel {
          overflow: hidden;

          border-radius: 18px;

          border:
            1px solid rgba(255,255,255,.07);

          background:
            rgba(8,13,11,.72);

          box-shadow:
            0 20px 55px rgba(0,0,0,.18);
        }

        .table-toolbar {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;

          padding: 18px 20px;

          border-bottom:
            1px solid rgba(255,255,255,.06);
        }

        .table-title {
          display: flex;

          align-items: center;

          gap: 10px;
        }

        .table-title-icon {
          color: #00ff88;

          font-size: 17px;
        }

        .table-title h3 {
          margin: 0;

          color: #eaf2ed;

          font-size: 14px;
        }

        .table-title span {
          display: block;

          margin-top: 3px;

          color: #59665f;

          font-size: 11px;
        }

        .search-box {
          position: relative;

          width: 250px;
        }

        .search-icon {
          position: absolute;

          left: 13px;
          top: 50%;

          transform: translateY(-50%);

          color: #5d6962;
        }

        .search-input {
          width: 100%;

          height: 38px;

          padding: 0 12px 0 37px;

          border-radius: 10px;

          border:
            1px solid rgba(255,255,255,.07);

          outline: none;

          color: #fff;

          background:
            rgba(255,255,255,.025);

          font-size: 12px;
        }

        .search-input:focus {
          border-color:
            rgba(0,255,136,.35);
        }

        .table-wrap {
          width: 100%;

          overflow-x: auto;
        }

        .supplier-table {
          width: 100%;

          min-width: 720px;

          border-collapse: collapse;
        }

        .supplier-table th {
          padding: 14px 20px;

          text-align: left;

          color: #69766f;

          background:
            rgba(255,255,255,.018);

          border-bottom:
            1px solid rgba(255,255,255,.06);

          font-size: 10px;

          text-transform: uppercase;

          letter-spacing: .8px;

          font-weight: 700;
        }

        .supplier-table td {
          padding: 16px 20px;

          color: #c9d3cd;

          border-bottom:
            1px solid rgba(255,255,255,.045);

          font-size: 13px;
        }

        .supplier-table tbody tr {
          transition: .2s ease;
        }

        .supplier-table tbody tr:hover {
          background:
            rgba(0,255,136,.025);
        }

        .supplier-table tbody tr:last-child td {
          border-bottom: none;
        }

        .id-badge {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          min-width: 36px;

          height: 26px;

          padding: 0 8px;

          border-radius: 8px;

          color: #00e67d;

          background:
            rgba(0,255,136,.07);

          border:
            1px solid rgba(0,255,136,.11);

          font-size: 11px;

          font-weight: 700;
        }

        .supplier-name {
          display: flex;

          align-items: center;

          gap: 10px;

          color: #edf4ef;

          font-weight: 600;
        }

        .supplier-avatar {
          width: 32px;
          height: 32px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 9px;

          color: #00ff88;

          background:
            rgba(0,255,136,.07);

          border:
            1px solid rgba(0,255,136,.11);

          font-size: 14px;
        }

        .phone-cell {
          color: #9aa69f;

          font-size: 12px;
        }

        .address-cell {
          color: #87948d;

          font-size: 12px;
        }

        .loading-state,
        .empty-state {
          padding: 60px 20px;

          text-align: center;

          color: #66736c;

          font-size: 13px;
        }

        .loading-spinner {
          width: 28px;
          height: 28px;

          margin: 0 auto 12px;

          border-radius: 50%;

          border:
            2px solid rgba(0,255,136,.12);

          border-top-color: #00ff88;

          animation:
            supplierSpin .7s linear infinite;
        }

        @keyframes supplierSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-icon {
          font-size: 32px;

          margin-bottom: 10px;

          opacity: .5;
        }

        /* RESPONSIVE */

        @media (max-width: 1000px) {
          .supplier-form {
            grid-template-columns:
              1fr
              1fr;
          }

          .add-button {
            width: 100%;
          }
        }

        @media (max-width: 700px) {
          .supplier-summary {
            grid-template-columns: 1fr;
          }

          .supplier-form {
            grid-template-columns: 1fr;
          }

          .table-toolbar {
            align-items: flex-start;

            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .suppliers-header h1 {
            font-size: 23px;
          }

          .suppliers-icon {
            width: 45px;
            height: 45px;

            font-size: 20px;
          }

          .supplier-form-panel {
            padding: 16px;
          }

          .summary-card {
            padding: 17px;
          }
        }
      `}</style>

      <Layout>
        <div className="suppliers-page">

          {/* HEADER */}

          <header className="suppliers-header">

            <div className="suppliers-title">

              <div className="suppliers-icon">
                🚚
              </div>

              <div>
                <h1>Suppliers</h1>

                <p>
                  Manage and organize your business
                  suppliers.
                </p>
              </div>

            </div>

          </header>

          {/* SUMMARY */}

          <div className="supplier-summary">

            <div className="summary-card">

              <div className="summary-top">

                <span className="summary-label">
                  Total Suppliers
                </span>

                <span className="summary-icon">
                  👥
                </span>

              </div>

              <div className="summary-value">
                {suppliers.length}
              </div>

            </div>

            <div className="summary-card">

              <div className="summary-top">

                <span className="summary-label">
                  Active Records
                </span>

                <span className="summary-icon">
                  ✓
                </span>

              </div>

              <div className="summary-value green">
                {suppliers.length}
              </div>

            </div>

            <div className="summary-card">

              <div className="summary-top">

                <span className="summary-label">
                  Search Results
                </span>

                <span className="summary-icon">
                  ⌕
                </span>

              </div>

              <div className="summary-value">
                {filteredSuppliers.length}
              </div>

            </div>

          </div>

          {/* MESSAGE */}

          {message.text && (
            <div
              className={`message ${message.type}`}
            >
              {message.type === "success"
                ? "✓ "
                : "⚠️ "}

              {message.text}
            </div>
          )}

          {/* ADD SUPPLIER */}

          <div className="supplier-form-panel">

            <div className="panel-heading">

              <span className="panel-heading-icon">
                ＋
              </span>

              <div>

                <h3>
                  Add New Supplier
                </h3>

                <p>
                  Enter supplier contact
                  information below.
                </p>

              </div>

            </div>

            <form
              className="supplier-form"
              onSubmit={addSupplier}
            >

              <div className="field">

                <label>
                  SUPPLIER NAME
                </label>

                <div className="input-wrapper">

                  <span className="field-icon">
                    👤
                  </span>

                  <input
                    className="supplier-input"
                    name="supplier_name"
                    required
                    value={form.supplier_name}
                    onChange={handleChange}
                    placeholder="Enter supplier name"
                  />

                </div>

              </div>

              <div className="field">

                <label>
                  PHONE
                </label>

                <div className="input-wrapper">

                  <span className="field-icon">
                    ☎
                  </span>

                  <input
                    className="supplier-input"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />

                </div>

              </div>

              <div className="field">

                <label>
                  ADDRESS
                </label>

                <div className="input-wrapper">

                  <span className="field-icon">
                    📍
                  </span>

                  <input
                    className="supplier-input"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />

                </div>

              </div>

              <button
                className="add-button"
                type="submit"
                disabled={adding}
              >
                {adding
                  ? "Adding..."
                  : "＋ Add Supplier"}
              </button>

            </form>

          </div>

          {/* TABLE */}

          <div className="supplier-table-panel">

            <div className="table-toolbar">

              <div className="table-title">

                <span className="table-title-icon">
                  ◈
                </span>

                <div>

                  <h3>
                    Supplier Directory
                  </h3>

                  <span>
                    {filteredSuppliers.length}
                    {" "}
                    suppliers displayed
                  </span>

                </div>

              </div>

              <div className="search-box">

                <span className="search-icon">
                  ⌕
                </span>

                <input
                  className="search-input"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search suppliers..."
                />

              </div>

            </div>

            <div className="table-wrap">

              {loading ? (
                <div className="loading-state">

                  <div className="loading-spinner"></div>

                  Loading suppliers...

                </div>
              ) : filteredSuppliers.length === 0 ? (
                <div className="empty-state">

                  <div className="empty-icon">
                    🚚
                  </div>

                  {search
                    ? "No suppliers match your search."
                    : "No suppliers found. Add your first supplier."}

                </div>
              ) : (
                <table className="supplier-table">

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>Supplier</th>
                      <th>Phone</th>
                      <th>Address</th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredSuppliers.map(
                      (supplier) => (
                        <tr key={supplier.id}>

                          <td>
                            <span className="id-badge">
                              #{supplier.id}
                            </span>
                          </td>

                          <td>

                            <div className="supplier-name">

                              <span className="supplier-avatar">
                                👤
                              </span>

                              {supplier.supplier_name}

                            </div>

                          </td>

                          <td>
                            <span className="phone-cell">
                              {supplier.phone || "—"}
                            </span>
                          </td>

                          <td>
                            <span className="address-cell">
                              {supplier.address || "—"}
                            </span>
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>
              )}

            </div>

          </div>

        </div>
      </Layout>
    </>
  );
}
```
