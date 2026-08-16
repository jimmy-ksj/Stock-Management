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
        Array.isArray(response.data) ? response.data : []
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
    const keyword = search.toLowerCase().trim();

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

        /* ================================
           SUPPLIERS PAGE
        ================================= */

        .suppliers-page {
          width: 100%;
          min-height: 100%;
          color: #e9f1ec;
          padding-bottom: 30px;
        }

        /* ================================
           HEADER
        ================================= */

        .supplier-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .supplier-heading {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .supplier-heading-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 23px;

          background: rgba(0, 255, 136, 0.08);
          border: 1px solid rgba(0, 255, 136, 0.14);

          box-shadow:
            0 0 25px rgba(0, 255, 136, 0.05);
        }

        .supplier-heading h1 {
          margin: 0;
          color: #ffffff;
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .supplier-heading p {
          margin: 5px 0 0;
          color: #718078;
          font-size: 12px;
        }

        /* ================================
           TOP BUTTON
        ================================= */

        .top-add-btn {
          border: 0;
          outline: 0;
          cursor: pointer;

          height: 42px;
          padding: 0 18px;

          border-radius: 10px;

          color: #04140c;
          background: #00ff88;

          font-size: 12px;
          font-weight: 800;

          box-shadow:
            0 8px 25px rgba(0, 255, 136, 0.12);

          transition: 0.25s ease;
        }

        .top-add-btn:hover {
          transform: translateY(-2px);

          box-shadow:
            0 12px 30px rgba(0, 255, 136, 0.2);
        }

        /* ================================
           STAT CARDS
        ================================= */

        .supplier-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .supplier-stat {
          position: relative;
          overflow: hidden;

          min-height: 105px;
          padding: 18px;

          border-radius: 15px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.045),
              rgba(255,255,255,0.012)
            );

          border: 1px solid rgba(255,255,255,0.065);

          box-shadow:
            0 10px 30px rgba(0,0,0,0.13);

          transition: 0.25s ease;
        }

        .supplier-stat:hover {
          transform: translateY(-2px);

          border-color:
            rgba(0,255,136,0.14);
        }

        .supplier-stat::before {
          content: "";

          position: absolute;

          width: 90px;
          height: 90px;

          right: -40px;
          bottom: -40px;

          border-radius: 50%;

          background:
            rgba(0,255,136,0.055);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 13px;
        }

        .stat-title {
          color: #6e7b74;

          font-size: 10px;
          font-weight: 700;

          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .stat-icon {
          width: 31px;
          height: 31px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #00ff88;

          background:
            rgba(0,255,136,0.07);

          border:
            1px solid rgba(0,255,136,0.1);

          font-size: 14px;
        }

        .stat-value {
          color: #ffffff;

          font-size: 24px;
          font-weight: 800;

          letter-spacing: -0.5px;
        }

        .stat-value.green {
          color: #00ff88;
        }

        /* ================================
           MESSAGE
        ================================= */

        .supplier-message {
          padding: 12px 14px;
          margin-bottom: 18px;

          border-radius: 10px;

          font-size: 12px;
          font-weight: 600;
        }

        .supplier-message.success {
          color: #6dffad;

          background:
            rgba(0,255,136,0.055);

          border:
            1px solid rgba(0,255,136,0.14);
        }

        .supplier-message.error {
          color: #ff9a9a;

          background:
            rgba(255,50,50,0.055);

          border:
            1px solid rgba(255,60,60,0.14);
        }

        /* ================================
           ADD FORM
        ================================= */

        .supplier-form-card {
          padding: 20px;
          margin-bottom: 20px;

          border-radius: 15px;

          background:
            rgba(8,13,11,0.72);

          border:
            1px solid rgba(255,255,255,0.065);

          box-shadow:
            0 15px 40px rgba(0,0,0,0.14);
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 18px;
        }

        .form-header-icon {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #00ff88;

          background:
            rgba(0,255,136,0.07);

          border:
            1px solid rgba(0,255,136,0.1);
        }

        .form-header h3 {
          margin: 0;

          color: #e9f1ec;

          font-size: 14px;
          font-weight: 700;
        }

        .form-header p {
          margin: 3px 0 0;

          color: #59665f;

          font-size: 11px;
        }

        .supplier-form {
          display: grid;

          grid-template-columns:
            1.2fr 1fr 1fr 150px;

          gap: 12px;

          align-items: end;
        }

        .form-field label {
          display: block;

          margin-bottom: 7px;

          color: #7d8a83;

          font-size: 10px;
          font-weight: 700;

          letter-spacing: 0.6px;
        }

        .input-container {
          position: relative;
        }

        .input-symbol {
          position: absolute;

          left: 13px;
          top: 50%;

          transform: translateY(-50%);

          color: #59665f;

          font-size: 13px;

          pointer-events: none;
        }

        .supplier-input {
          width: 100%;
          height: 45px;

          box-sizing: border-box;

          padding: 0 12px 0 38px;

          outline: none;

          border-radius: 9px;

          color: #f4f8f5;

          background:
            rgba(0,0,0,0.2);

          border:
            1px solid rgba(255,255,255,0.07);

          font-size: 12px;

          transition: 0.2s ease;
        }

        .supplier-input::placeholder {
          color: #4f5b55;
        }

        .supplier-input:focus {
          border-color:
            rgba(0,255,136,0.35);

          box-shadow:
            0 0 0 3px rgba(0,255,136,0.045);
        }

        .submit-supplier {
          height: 45px;

          border: 0;
          outline: 0;

          border-radius: 9px;

          cursor: pointer;

          color: #031209;

          background:
            linear-gradient(
              135deg,
              #00ff88,
              #00d875
            );

          font-size: 12px;
          font-weight: 800;

          transition: 0.25s ease;
        }

        .submit-supplier:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 10px 25px rgba(0,255,136,0.16);
        }

        .submit-supplier:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* ================================
           TABLE CARD
        ================================= */

        .supplier-table-card {
          overflow: hidden;

          border-radius: 15px;

          background:
            rgba(8,13,11,0.78);

          border:
            1px solid rgba(255,255,255,0.065);

          box-shadow:
            0 15px 45px rgba(0,0,0,0.16);
        }

        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          padding: 17px 19px;

          border-bottom:
            1px solid rgba(255,255,255,0.055);
        }

        .table-heading {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .table-heading-icon {
          color: #00ff88;
          font-size: 16px;
        }

        .table-heading h3 {
          margin: 0;

          color: #e8f0eb;

          font-size: 13px;
          font-weight: 700;
        }

        .table-heading p {
          margin: 3px 0 0;

          color: #58655e;

          font-size: 10px;
        }

        /* ================================
           SEARCH
        ================================= */

        .supplier-search {
          position: relative;
          width: 245px;
        }

        .supplier-search span {
          position: absolute;

          left: 12px;
          top: 50%;

          transform: translateY(-50%);

          color: #5a6760;
        }

        .supplier-search input {
          width: 100%;
          height: 37px;

          box-sizing: border-box;

          padding: 0 11px 0 35px;

          outline: none;

          border-radius: 9px;

          color: #ffffff;

          background:
            rgba(255,255,255,0.025);

          border:
            1px solid rgba(255,255,255,0.07);

          font-size: 11px;
        }

        .supplier-search input:focus {
          border-color:
            rgba(0,255,136,0.3);
        }

        /* ================================
           TABLE
        ================================= */

        .supplier-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .supplier-table {
          width: 100%;
          min-width: 700px;

          border-collapse: collapse;
        }

        .supplier-table th {
          padding: 13px 19px;

          text-align: left;

          color: #65726b;

          background:
            rgba(255,255,255,0.016);

          border-bottom:
            1px solid rgba(255,255,255,0.05);

          font-size: 9px;
          font-weight: 700;

          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .supplier-table td {
          padding: 14px 19px;

          color: #c8d1cc;

          border-bottom:
            1px solid rgba(255,255,255,0.04);

          font-size: 12px;
        }

        .supplier-table tbody tr {
          transition: 0.18s ease;
        }

        .supplier-table tbody tr:hover {
          background:
            rgba(0,255,136,0.025);
        }

        .supplier-table tbody tr:last-child td {
          border-bottom: 0;
        }

        /* ================================
           ID
        ================================= */

        .supplier-id {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          min-width: 34px;
          height: 24px;

          padding: 0 7px;

          border-radius: 7px;

          color: #00e681;

          background:
            rgba(0,255,136,0.06);

          border:
            1px solid rgba(0,255,136,0.1);

          font-size: 10px;
          font-weight: 700;
        }

        /* ================================
           SUPPLIER NAME
        ================================= */

        .supplier-person {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .supplier-avatar {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 9px;

          color: #00ff88;

          background:
            rgba(0,255,136,0.065);

          border:
            1px solid rgba(0,255,136,0.1);

          font-size: 12px;
          font-weight: 800;
        }

        .supplier-person-name {
          color: #e8efea;
          font-weight: 600;
        }

        .supplier-person-sub {
          margin-top: 2px;

          color: #536058;

          font-size: 9px;
        }

        .supplier-phone {
          color: #9aa69f;
        }

        .supplier-address {
          color: #849089;
        }

        /* ================================
           STATES
        ================================= */

        .supplier-state {
          padding: 55px 20px;

          text-align: center;

          color: #66736c;

          font-size: 12px;
        }

        .loading-circle {
          width: 27px;
          height: 27px;

          margin: 0 auto 12px;

          border-radius: 50%;

          border:
            2px solid rgba(0,255,136,0.1);

          border-top-color:
            #00ff88;

          animation:
            supplierLoading 0.7s linear infinite;
        }

        @keyframes supplierLoading {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-symbol {
          width: 48px;
          height: 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin: 0 auto 12px;

          border-radius: 14px;

          color: #00ff88;

          background:
            rgba(0,255,136,0.05);

          border:
            1px solid rgba(0,255,136,0.08);

          font-size: 20px;
        }

        /* ================================
           RESPONSIVE
        ================================= */

        @media (max-width: 1050px) {
          .supplier-form {
            grid-template-columns: 1fr 1fr;
          }

          .submit-supplier {
            width: 100%;
          }
        }

        @media (max-width: 750px) {
          .supplier-stats {
            grid-template-columns: 1fr;
          }

          .supplier-header {
            align-items: flex-start;
          }

          .top-add-btn {
            display: none;
          }

          .supplier-form {
            grid-template-columns: 1fr;
          }

          .table-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .supplier-search {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .supplier-heading h1 {
            font-size: 22px;
          }

          .supplier-heading-icon {
            width: 44px;
            height: 44px;
            font-size: 19px;
          }

          .supplier-form-card {
            padding: 15px;
          }

          .supplier-table th,
          .supplier-table td {
            padding-left: 13px;
            padding-right: 13px;
          }
        }

      `}</style>

      <Layout>
        <div className="suppliers-page">

          {/* HEADER */}
          <div className="supplier-header">

            <div className="supplier-heading">

              <div className="supplier-heading-icon">
                🚚
              </div>

              <div>
                <h1>Suppliers</h1>

                <p>
                  Manage your suppliers and contact information
                </p>
              </div>

            </div>

            <button
              className="top-add-btn"
              onClick={() =>
                document
                  .querySelector(".supplier-form-card")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              + Add Supplier
            </button>

          </div>

          {/* STATISTICS */}
          <div className="supplier-stats">

            <div className="supplier-stat">

              <div className="stat-top">
                <span className="stat-title">
                  Total Suppliers
                </span>

                <span className="stat-icon">
                  👥
                </span>
              </div>

              <div className="stat-value">
                {suppliers.length}
              </div>

            </div>

            <div className="supplier-stat">

              <div className="stat-top">
                <span className="stat-title">
                  Active Records
                </span>

                <span className="stat-icon">
                  ✓
                </span>
              </div>

              <div className="stat-value green">
                {suppliers.length}
              </div>

            </div>

            <div className="supplier-stat">

              <div className="stat-top">
                <span className="stat-title">
                  Search Results
                </span>

                <span className="stat-icon">
                  ⌕
                </span>
              </div>

              <div className="stat-value">
                {filteredSuppliers.length}
              </div>

            </div>

          </div>

          {/* MESSAGE */}
          {message.text && (
            <div
              className={`supplier-message ${message.type}`}
            >
              {message.type === "success"
                ? "✓ "
                : "⚠️ "}

              {message.text}
            </div>
          )}

          {/* ADD SUPPLIER */}
          <div className="supplier-form-card">

            <div className="form-header">

              <div className="form-header-icon">
                +
              </div>

              <div>
                <h3>Add New Supplier</h3>

                <p>
                  Enter supplier details to create a new record
                </p>
              </div>

            </div>

            <form
              className="supplier-form"
              onSubmit={addSupplier}
            >

              {/* NAME */}
              <div className="form-field">

                <label>SUPPLIER NAME</label>

                <div className="input-container">

                  <span className="input-symbol">
                    👤
                  </span>

                  <input
                    className="supplier-input"
                    name="supplier_name"
                    value={form.supplier_name}
                    onChange={handleChange}
                    placeholder="Supplier name"
                    required
                  />

                </div>

              </div>

              {/* PHONE */}
              <div className="form-field">

                <label>PHONE NUMBER</label>

                <div className="input-container">

                  <span className="input-symbol">
                    ☎
                  </span>

                  <input
                    className="supplier-input"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />

                </div>

              </div>

              {/* ADDRESS */}
              <div className="form-field">

                <label>ADDRESS</label>

                <div className="input-container">

                  <span className="input-symbol">
                    📍
                  </span>

                  <input
                    className="supplier-input"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Supplier address"
                  />

                </div>

              </div>

              {/* BUTTON */}
              <button
                className="submit-supplier"
                type="submit"
                disabled={adding}
              >
                {adding
                  ? "Adding..."
                  : "+ Add Supplier"}
              </button>

            </form>

          </div>

          {/* SUPPLIER TABLE */}
          <div className="supplier-table-card">

            <div className="table-header">

              <div className="table-heading">

                <span className="table-heading-icon">
                  ◈
                </span>

                <div>

                  <h3>Supplier Directory</h3>

                  <p>
                    {filteredSuppliers.length} suppliers displayed
                  </p>

                </div>

              </div>

              <div className="supplier-search">

                <span>⌕</span>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search suppliers..."
                />

              </div>

            </div>

            <div className="supplier-table-wrapper">

              {loading ? (
                <div className="supplier-state">

                  <div className="loading-circle"></div>

                  Loading suppliers...

                </div>
              ) : filteredSuppliers.length === 0 ? (
                <div className="supplier-state">

                  <div className="empty-symbol">
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

                    {filteredSuppliers.map((supplier) => {

                      const initials =
                        supplier.supplier_name
                          ?.split(" ")
                          .map((word) => word[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase() || "SU";

                      return (
                        <tr key={supplier.id}>

                          <td>
                            <span className="supplier-id">
                              #{supplier.id}
                            </span>
                          </td>

                          <td>

                            <div className="supplier-person">

                              <div className="supplier-avatar">
                                {initials}
                              </div>

                              <div>

                                <div className="supplier-person-name">
                                  {supplier.supplier_name}
                                </div>

                                <div className="supplier-person-sub">
                                  Supplier
                                </div>

                              </div>

                            </div>

                          </td>

                          <td>
                            <span className="supplier-phone">
                              {supplier.phone || "—"}
                            </span>
                          </td>

                          <td>
                            <span className="supplier-address">
                              {supplier.address || "—"}
                            </span>
                          </td>

                        </tr>
                      );
                    })}

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
