```jsx
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Categories() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories");
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();

    const categoryName = name.trim();

    if (!categoryName) return;

    try {
      setAdding(true);
      setError("");

      await api.post("/categories", {
        category_name: categoryName,
      });

      setName("");
      await load();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to add category."
      );
    } finally {
      setAdding(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return data.filter((item) =>
      item.category_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <>
      <style>{`
        .categories-page {
          width: 100%;
          color: #e9f1ec;
        }

        .categories-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .header-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          font-size: 23px;
          background: linear-gradient(
            135deg,
            rgba(0,255,136,.18),
            rgba(0,255,136,.04)
          );
          border: 1px solid rgba(0,255,136,.16);
          box-shadow: 0 0 25px rgba(0,255,136,.06);
        }

        .categories-header h1 {
          margin: 0;
          font-size: 29px;
          font-weight: 800;
          letter-spacing: -.8px;
          color: #fff;
        }

        .categories-header p {
          margin: 5px 0 0;
          color: #75827b;
          font-size: 13px;
        }

        .category-count {
          min-width: 105px;
          padding: 12px 17px;
          text-align: center;
          border-radius: 13px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.07);
        }

        .category-count strong {
          display: block;
          color: #00ff88;
          font-size: 20px;
          line-height: 1;
        }

        .category-count span {
          display: block;
          margin-top: 5px;
          color: #68756e;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .7px;
        }

        .category-form {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding: 18px;
          border-radius: 17px;
          border: 1px solid rgba(255,255,255,.07);
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.045),
              rgba(255,255,255,.018)
            );
          box-shadow: 0 15px 45px rgba(0,0,0,.16);
        }

        .category-input-wrapper {
          position: relative;
          flex: 1;
        }

        .category-input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #647169;
          pointer-events: none;
        }

        .category-input {
          width: 100%;
          height: 49px;
          padding: 0 15px 0 44px;
          border-radius: 12px;
          outline: none;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(0,0,0,.18);
          color: #fff;
          font-size: 13px;
          transition: .25s ease;
        }

        .category-input::placeholder {
          color: #56635c;
        }

        .category-input:focus {
          border-color: rgba(0,255,136,.45);
          box-shadow: 0 0 0 3px rgba(0,255,136,.06);
        }

        .add-button {
          height: 49px;
          padding: 0 22px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          color: #021109;
          font-weight: 800;
          font-size: 13px;
          background: linear-gradient(
            135deg,
            #00ff88,
            #00ce70
          );
          box-shadow: 0 8px 25px rgba(0,255,136,.12);
          transition: .25s ease;
          white-space: nowrap;
        }

        .add-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,255,136,.22);
        }

        .add-button:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .table-panel {
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(8,13,11,.72);
          box-shadow: 0 20px 55px rgba(0,0,0,.18);
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
        }

        .table-title h3 {
          margin: 0;
          color: #eaf2ed;
          font-size: 14px;
          font-weight: 700;
        }

        .table-title span {
          color: #59665f;
          font-size: 11px;
        }

        .search-box {
          position: relative;
          width: 230px;
        }

        .search-box span {
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
          border: 1px solid rgba(255,255,255,.07);
          outline: none;
          color: #fff;
          background: rgba(255,255,255,.025);
          font-size: 12px;
        }

        .search-input:focus {
          border-color: rgba(0,255,136,.35);
        }

        .table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .category-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 550px;
        }

        .category-table th {
          padding: 14px 20px;
          text-align: left;
          color: #69766f;
          background: rgba(255,255,255,.018);
          border-bottom: 1px solid rgba(255,255,255,.06);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .8px;
          font-weight: 700;
        }

        .category-table td {
          padding: 16px 20px;
          color: #c9d3cd;
          border-bottom: 1px solid rgba(255,255,255,.045);
          font-size: 13px;
        }

        .category-table tbody tr {
          transition: .2s ease;
        }

        .category-table tbody tr:hover {
          background: rgba(0,255,136,.025);
        }

        .category-table tbody tr:last-child td {
          border-bottom: none;
        }

        .id-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 34px;
          height: 26px;
          padding: 0 8px;
          border-radius: 8px;
          color: #00e67d;
          background: rgba(0,255,136,.07);
          border: 1px solid rgba(0,255,136,.11);
          font-size: 11px;
          font-weight: 700;
        }

        .category-name {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #edf4ef;
          font-weight: 600;
        }

        .category-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00ff88;
          box-shadow: 0 0 9px rgba(0,255,136,.45);
        }

        .loading-state,
        .empty-state {
          padding: 55px 20px;
          text-align: center;
          color: #66736c;
          font-size: 13px;
        }

        .loading-spinner {
          width: 27px;
          height: 27px;
          margin: 0 auto 12px;
          border-radius: 50%;
          border: 2px solid rgba(0,255,136,.12);
          border-top-color: #00ff88;
          animation: categorySpin .7s linear infinite;
        }

        @keyframes categorySpin {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-icon {
          font-size: 32px;
          margin-bottom: 10px;
          opacity: .55;
        }

        .error-box {
          margin-bottom: 18px;
          padding: 13px 15px;
          border-radius: 11px;
          color: #ff9b9b;
          background: rgba(255,50,50,.06);
          border: 1px solid rgba(255,70,70,.16);
          font-size: 12px;
        }

        @media (max-width: 700px) {
          .categories-header {
            align-items: flex-start;
          }

          .category-count {
            min-width: 80px;
          }

          .category-form {
            flex-direction: column;
          }

          .category-input-wrapper,
          .add-button {
            width: 100%;
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
          .categories-header h1 {
            font-size: 23px;
          }

          .header-icon {
            width: 45px;
            height: 45px;
          }

          .category-count {
            display: none;
          }

          .category-form {
            padding: 14px;
          }
        }
      `}</style>

      <Layout>
        <div className="categories-page">

          {/* HEADER */}
          <header className="categories-header">
            <div className="header-title">
              <div className="header-icon">
                🗂️
              </div>

              <div>
                <h1>Categories</h1>
                <p>
                  Organize and manage your product categories.
                </p>
              </div>
            </div>

            <div className="category-count">
              <strong>{data.length}</strong>
              <span>Total Categories</span>
            </div>
          </header>

          {/* ERROR */}
          {error && (
            <div className="error-box">
              ⚠️ {error}
            </div>
          )}

          {/* ADD CATEGORY */}
          <form
            className="category-form"
            onSubmit={add}
          >
            <div className="category-input-wrapper">
              <span className="category-input-icon">
                ＋
              </span>

              <input
                className="category-input"
                required
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter new category name..."
              />
            </div>

            <button
              className="add-button"
              type="submit"
              disabled={adding}
            >
              {adding ? "Adding..." : "＋ Add Category"}
            </button>
          </form>

          {/* TABLE */}
          <div className="table-panel">

            <div className="table-toolbar">

              <div className="table-title">
                <span className="table-title-icon">
                  ◈
                </span>

                <div>
                  <h3>Category List</h3>
                  <span>
                    {filteredCategories.length} categories
                    displayed
                  </span>
                </div>
              </div>

              <div className="search-box">
                <span>⌕</span>

                <input
                  className="search-input"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search categories..."
                />
              </div>

            </div>

            <div className="table-wrap">

              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  Loading categories...
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    🗂️
                  </div>

                  {search
                    ? "No category matches your search."
                    : "No categories found. Add your first category."}
                </div>
              ) : (
                <table className="category-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Category Name</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCategories.map((item) => (
                      <tr key={item.id}>

                        <td>
                          <span className="id-badge">
                            #{item.id}
                          </span>
                        </td>

                        <td>
                          <div className="category-name">
                            <span className="category-dot"></span>
                            {item.category_name}
                          </div>
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
