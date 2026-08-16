```jsx id="salespro"
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  const [form, setForm] = useState({
    product_id: "",
    quantity_sold: 1,
  });

  const [productSearch, setProductSearch] = useState("");
  const [salesSearch, setSalesSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [selling, setSelling] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const load = async () => {
    try {
      setLoading(true);

      const [productsRes, salesRes] = await Promise.all([
        api.get("/products"),
        api.get("/sales"),
      ]);

      setProducts(
        Array.isArray(productsRes.data)
          ? productsRes.data
          : []
      );

      setSales(
        Array.isArray(salesRes.data)
          ? salesRes.data
          : []
      );
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to load sales data.",
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

  const sell = async (e) => {
    e.preventDefault();

    if (!form.product_id) {
      setMessage({
        type: "error",
        text: "Please select a product.",
      });
      return;
    }

    if (Number(form.quantity_sold) < 1) {
      setMessage({
        type: "error",
        text: "Quantity must be at least 1.",
      });
      return;
    }

    try {
      setSelling(true);

      await api.post("/sales", {
        product_id: Number(form.product_id),
        quantity_sold: Number(form.quantity_sold),
      });

      setForm({
        product_id: "",
        quantity_sold: 1,
      });

      setProductSearch("");

      setMessage({
        type: "success",
        text: "Sale completed successfully.",
      });

      await load();
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Sale failed. Please try again.",
      });
    } finally {
      setSelling(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.product_name
        ?.toLowerCase()
        .includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) =>
      sale.product_name
        ?.toLowerCase()
        .includes(salesSearch.toLowerCase())
    );
  }, [sales, salesSearch]);

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + Number(sale.total_price || 0),
    0
  );

  const totalUnits = sales.reduce(
    (sum, sale) => sum + Number(sale.quantity_sold || 0),
    0
  );

  return (
    <>
      <style>{`
        .sales-page {
          width: 100%;
          color: #eaf2ed;
        }

        /* HEADER */

        .sales-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .sales-title {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .sales-icon {
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

        .sales-header h1 {
          margin: 0;

          color: #fff;

          font-size: 29px;
          font-weight: 800;

          letter-spacing: -.8px;
        }

        .sales-header p {
          margin: 5px 0 0;

          color: #75827b;

          font-size: 13px;
        }

        /* SUMMARY */

        .summary-grid {
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

        .summary-symbol {
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

        /* SALE FORM */

        .sale-panel {
          margin-bottom: 20px;

          padding: 21px;

          border-radius: 18px;

          border: 1px solid rgba(255,255,255,.07);

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

        .sale-form {
          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            160px
            180px;

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

        .product-select,
        .quantity-input {
          width: 100%;
          height: 49px;

          padding: 0 14px;

          border-radius: 11px;

          outline: none;

          border: 1px solid rgba(255,255,255,.08);

          background: rgba(0,0,0,.2);

          color: #fff;

          font-size: 13px;

          transition: .25s ease;
        }

        .product-select:focus,
        .quantity-input:focus {
          border-color: rgba(0,255,136,.45);

          box-shadow:
            0 0 0 3px rgba(0,255,136,.06);
        }

        .product-select option {
          background: #0b110e;
          color: white;
        }

        .quantity-input {
          text-align: center;
        }

        .sell-button {
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

        .sell-button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 13px 30px rgba(0,255,136,.22);
        }

        .sell-button:disabled {
          opacity: .55;

          cursor: not-allowed;
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

          border: 1px solid rgba(0,255,136,.15);
        }

        .message.error {
          color: #ff9b9b;

          background: rgba(255,50,50,.055);

          border: 1px solid rgba(255,70,70,.16);
        }

        /* TABLE PANEL */

        .sales-table-panel {
          overflow: hidden;

          border-radius: 18px;

          border: 1px solid rgba(255,255,255,.07);

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

          border-bottom: 1px solid rgba(255,255,255,.06);
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

          width: 240px;
        }

        .search-icon {
          position: absolute;

          left: 13px;
          top: 50%;

          transform: translateY(-50%);

          color: #5d6962;
        }

        .sales-search {
          width: 100%;

          height: 38px;

          padding: 0 12px 0 37px;

          border-radius: 10px;

          border: 1px solid rgba(255,255,255,.07);

          outline: none;

          color: #fff;

          background: rgba(255,255,255,.025);

          font-size: 12px;
        }

        .sales-search:focus {
          border-color: rgba(0,255,136,.35);
        }

        .table-wrap {
          width: 100%;

          overflow-x: auto;
        }

        .sales-table {
          width: 100%;

          min-width: 720px;

          border-collapse: collapse;
        }

        .sales-table th {
          padding: 14px 20px;

          text-align: left;

          color: #69766f;

          background: rgba(255,255,255,.018);

          border-bottom:
            1px solid rgba(255,255,255,.06);

          font-size: 10px;

          text-transform: uppercase;

          letter-spacing: .8px;

          font-weight: 700;
        }

        .sales-table td {
          padding: 16px 20px;

          color: #c9d3cd;

          border-bottom:
            1px solid rgba(255,255,255,.045);

          font-size: 13px;
        }

        .sales-table tbody tr {
          transition: .2s ease;
        }

        .sales-table tbody tr:hover {
          background: rgba(0,255,136,.025);
        }

        .sales-table tbody tr:last-child td {
          border-bottom: none;
        }

        .sale-id {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          min-width: 36px;

          height: 26px;

          padding: 0 8px;

          border-radius: 8px;

          color: #00e67d;

          background: rgba(0,255,136,.07);

          border: 1px solid rgba(0,255,136,.11);

          font-size: 11px;

          font-weight: 700;
        }

        .product-name {
          display: flex;

          align-items: center;

          gap: 9px;

          color: #edf4ef;

          font-weight: 600;
        }

        .product-dot {
          width: 8px;
          height: 8px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #00ff88;

          box-shadow:
            0 0 9px rgba(0,255,136,.45);
        }

        .qty-badge {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          min-width: 35px;

          height: 27px;

          padding: 0 9px;

          border-radius: 8px;

          color: #b8c7bf;

          background: rgba(255,255,255,.045);

          border: 1px solid rgba(255,255,255,.06);

          font-weight: 700;
        }

        .total-price {
          color: #00ff88;

          font-weight: 800;
        }

        .date-text {
          color: #7c8982;

          font-size: 12px;
        }

        /* STATES */

        .loading-state,
        .empty-state {
          padding: 60px 20px;

          text-align: center;

          color: #66736c;

          font-size: 13px;
        }

        .spinner {
          width: 28px;
          height: 28px;

          margin: 0 auto 12px;

          border-radius: 50%;

          border:
            2px solid rgba(0,255,136,.12);

          border-top-color: #00ff88;

          animation:
            salesSpin .7s linear infinite;
        }

        @keyframes salesSpin {
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

        @media (max-width: 900px) {
          .summary-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .sale-form {
            grid-template-columns: 1fr 140px;
          }

          .sell-button {
            grid-column: span 2;
          }
        }

        @media (max-width: 700px) {
          .sales-header {
            align-items: flex-start;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .sale-form {
            grid-template-columns: 1fr;
          }

          .sell-button {
            grid-column: auto;
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
          .sales-header h1 {
            font-size: 23px;
          }

          .sales-icon {
            width: 45px;
            height: 45px;

            font-size: 20px;
          }

          .summary-card {
            padding: 17px;
          }

          .sale-panel {
            padding: 16px;
          }
        }
      `}</style>

      <Layout>
        <div className="sales-page">

          {/* HEADER */}

          <header className="sales-header">

            <div className="sales-title">

              <div className="sales-icon">
                💰
              </div>

              <div>
                <h1>Sales</h1>

                <p>
                  Record and monitor your stock-out
                  transactions.
                </p>
              </div>

            </div>

          </header>

          {/* SUMMARY */}

          <div className="summary-grid">

            <div className="summary-card">

              <div className="summary-top">
                <span className="summary-label">
                  Total Sales
                </span>

                <span className="summary-symbol">
                  🧾
                </span>
              </div>

              <div className="summary-value">
                {sales.length}
              </div>

            </div>

            <div className="summary-card">

              <div className="summary-top">
                <span className="summary-label">
                  Units Sold
                </span>

                <span className="summary-symbol">
                  📦
                </span>
              </div>

              <div className="summary-value">
                {totalUnits.toLocaleString()}
              </div>

            </div>

            <div className="summary-card">

              <div className="summary-top">
                <span className="summary-label">
                  Total Revenue
                </span>

                <span className="summary-symbol">
                  💵
                </span>
              </div>

              <div className="summary-value green">
                {totalRevenue.toLocaleString()} RWF
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

          {/* SALE FORM */}

          <div className="sale-panel">

            <div className="panel-heading">

              <span className="panel-heading-icon">
                ＋
              </span>

              <div>
                <h3>Record New Sale</h3>

                <p>
                  Select a product and enter the
                  quantity sold.
                </p>
              </div>

            </div>

            <form
              className="sale-form"
              onSubmit={sell}
            >

              <div className="field">

                <label>
                  PRODUCT
                </label>

                <select
                  className="product-select"
                  name="product_id"
                  required
                  value={form.product_id}
                  onChange={handleChange}
                >
                  <option value="">
                    Select product
                  </option>

                  {filteredProducts.map((product) => (
                    <option
                      value={product.id}
                      key={product.id}
                    >
                      {product.product_name}
                      {" — Stock: "}
                      {product.quantity}
                    </option>
                  ))}
                </select>

              </div>

              <div className="field">

                <label>
                  QUANTITY
                </label>

                <input
                  className="quantity-input"
                  type="number"
                  name="quantity_sold"
                  min="1"
                  value={form.quantity_sold}
                  onChange={handleChange}
                  required
                />

              </div>

              <button
                className="sell-button"
                type="submit"
                disabled={selling || loading}
              >
                {selling
                  ? "Processing..."
                  : "✓ Complete Sale"}
              </button>

            </form>

          </div>

          {/* SALES TABLE */}

          <div className="sales-table-panel">

            <div className="table-toolbar">

              <div className="table-title">

                <span className="table-title-icon">
                  ◈
                </span>

                <div>
                  <h3>
                    Sales History
                  </h3>

                  <span>
                    {filteredSales.length}
                    {" "}
                    transactions displayed
                  </span>
                </div>

              </div>

              <div className="search-box">

                <span className="search-icon">
                  ⌕
                </span>

                <input
                  className="sales-search"
                  value={salesSearch}
                  onChange={(e) =>
                    setSalesSearch(e.target.value)
                  }
                  placeholder="Search product..."
                />

              </div>

            </div>

            <div className="table-wrap">

              {loading ? (
                <div className="loading-state">

                  <div className="spinner"></div>

                  Loading sales...

                </div>
              ) : filteredSales.length === 0 ? (
                <div className="empty-state">

                  <div className="empty-icon">
                    🧾
                  </div>

                  {salesSearch
                    ? "No sales match your search."
                    : "No sales recorded yet."}

                </div>
              ) : (
                <table className="sales-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredSales.map((sale) => (
                      <tr key={sale.id}>

                        <td>
                          <span className="sale-id">
                            #{sale.id}
                          </span>
                        </td>

                        <td>
                          <div className="product-name">

                            <span className="product-dot"></span>

                            {sale.product_name}

                          </div>
                        </td>

                        <td>
                          <span className="qty-badge">
                            {Number(
                              sale.quantity_sold
                            ).toLocaleString()}
                          </span>
                        </td>

                        <td>
                          <span className="total-price">
                            {Number(
                              sale.total_price || 0
                            ).toLocaleString()}
                            {" RWF"}
                          </span>
                        </td>

                        <td>
                          <span className="date-text">
                            {sale.sold_at
                              ? new Date(
                                  sale.sold_at
                                ).toLocaleString()
                              : "-"}
                          </span>
                        </td>

                      </tr>
                    ))}

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
