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
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories");

      setData(
        Array.isArray(response.data)
          ? response.data
          : []
      );
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

    if (!categoryName) {
      setError("Category name is required.");
      return;
    }

    try {
      setAdding(true);
      setError("");
      setSuccess("");

      await api.post("/categories", {
        category_name: categoryName,
      });

      setName("");

      setSuccess("Category added successfully.");

      await load();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
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
    <Layout>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          padding: "5px 0 40px",
          color: "#e8f1ec",
          boxSizing: "border-box",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                minWidth: "56px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, rgba(0,255,136,.20), rgba(0,255,136,.04))",
                border:
                  "1px solid rgba(0,255,136,.20)",
                boxShadow:
                  "0 0 30px rgba(0,255,136,.08)",
                fontSize: "25px",
              }}
            >
              🗂️
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontSize: "30px",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                }}
              >
                Categories
              </h1>

              <p
                style={{
                  margin: "7px 0 0",
                  color: "#718079",
                  fontSize: "13px",
                }}
              >
                Organize and manage your product categories.
              </p>
            </div>
          </div>

          {/* COUNT */}

          <div
            style={{
              minWidth: "115px",
              padding: "14px 18px",
              textAlign: "center",
              borderRadius: "15px",
              background:
                "linear-gradient(145deg, rgba(255,255,255,.05), rgba(255,255,255,.015))",
              border:
                "1px solid rgba(255,255,255,.08)",
              boxShadow:
                "0 12px 35px rgba(0,0,0,.15)",
            }}
          >
            <div
              style={{
                color: "#00ff88",
                fontSize: "23px",
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {data.length}
            </div>

            <div
              style={{
                marginTop: "6px",
                color: "#66736c",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Total Categories
            </div>
          </div>
        </div>

        {/* ALERTS */}

        {error && (
          <div
            style={{
              marginBottom: "18px",
              padding: "13px 16px",
              borderRadius: "11px",
              background: "rgba(255,60,60,.07)",
              border:
                "1px solid rgba(255,80,80,.17)",
              color: "#ff9d9d",
              fontSize: "12px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div
            style={{
              marginBottom: "18px",
              padding: "13px 16px",
              borderRadius: "11px",
              background: "rgba(0,255,136,.06)",
              border:
                "1px solid rgba(0,255,136,.16)",
              color: "#5dffab",
              fontSize: "12px",
            }}
          >
            ✓ {success}
          </div>
        )}

        {/* ADD CATEGORY */}

        <form
          onSubmit={add}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "20px",
            marginBottom: "22px",
            borderRadius: "18px",
            background:
              "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.015))",
            border:
              "1px solid rgba(255,255,255,.075)",
            boxShadow:
              "0 18px 50px rgba(0,0,0,.16)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              flex: 1,
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#65736b",
                fontSize: "18px",
              }}
            >
              ＋
            </span>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Enter new category name..."
              style={{
                width: "100%",
                height: "50px",
                boxSizing: "border-box",
                padding: "0 15px 0 44px",
                borderRadius: "12px",
                outline: "none",
                border:
                  "1px solid rgba(255,255,255,.09)",
                background: "rgba(0,0,0,.25)",
                color: "#ffffff",
                fontSize: "13px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={adding}
            style={{
              height: "50px",
              padding: "0 24px",
              border: "none",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #00ff88, #00cf72)",
              color: "#001d0d",
              fontWeight: 800,
              fontSize: "13px",
              cursor: adding
                ? "not-allowed"
                : "pointer",
              opacity: adding ? 0.55 : 1,
              boxShadow:
                "0 8px 25px rgba(0,255,136,.13)",
              whiteSpace: "nowrap",
            }}
          >
            {adding
              ? "Adding..."
              : "＋ Add Category"}
          </button>
        </form>

        {/* TABLE PANEL */}

        <div
          style={{
            overflow: "hidden",
            borderRadius: "18px",
            background: "rgba(7,12,10,.76)",
            border:
              "1px solid rgba(255,255,255,.075)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,.20)",
          }}
        >

          {/* TABLE HEADER */}

          <div
            style={{
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              borderBottom:
                "1px solid rgba(255,255,255,.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "11px",
              }}
            >
              <span
                style={{
                  color: "#00ff88",
                  fontSize: "18px",
                }}
              >
                ◈
              </span>

              <div>
                <div
                  style={{
                    color: "#eaf2ed",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  Category List
                </div>

                <div
                  style={{
                    marginTop: "3px",
                    color: "#59665f",
                    fontSize: "11px",
                  }}
                >
                  {filteredCategories.length} categories
                  displayed
                </div>
              </div>
            </div>

            {/* SEARCH */}

            <div
              style={{
                width: "240px",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#5d6962",
                  fontSize: "16px",
                }}
              >
                ⌕
              </span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search categories..."
                style={{
                  width: "100%",
                  height: "39px",
                  boxSizing: "border-box",
                  padding: "0 12px 0 37px",
                  borderRadius: "10px",
                  border:
                    "1px solid rgba(255,255,255,.07)",
                  outline: "none",
                  background:
                    "rgba(255,255,255,.025)",
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              />
            </div>
          </div>

          {/* TABLE */}

          <div
            style={{
              width: "100%",
              overflowX: "auto",
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: "65px 20px",
                  textAlign: "center",
                  color: "#68756e",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    margin: "0 auto 13px",
                    borderRadius: "50%",
                    border:
                      "2px solid rgba(0,255,136,.12)",
                    borderTopColor: "#00ff88",
                    animation:
                      "spin 0.7s linear infinite",
                  }}
                />

                Loading categories...
              </div>
            ) : filteredCategories.length === 0 ? (
              <div
                style={{
                  padding: "65px 20px",
                  textAlign: "center",
                  color: "#68756e",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{
                    fontSize: "35px",
                    marginBottom: "10px",
                  }}
                >
                  🗂️
                </div>

                {search
                  ? "No category matches your search."
                  : "No categories found. Add your first category."}
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  minWidth: "550px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        color: "#69766f",
                        background:
                          "rgba(255,255,255,.018)",
                        borderBottom:
                          "1px solid rgba(255,255,255,.06)",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      ID
                    </th>

                    <th
                      style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        color: "#69766f",
                        background:
                          "rgba(255,255,255,.018)",
                        borderBottom:
                          "1px solid rgba(255,255,255,.06)",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      Category Name
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map(
                    (item) => (
                      <tr key={item.id}>
                        <td
                          style={{
                            padding: "16px 20px",
                            borderBottom:
                              "1px solid rgba(255,255,255,.045)",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: "36px",
                              height: "27px",
                              padding: "0 8px",
                              borderRadius: "8px",
                              color: "#00e67d",
                              background:
                                "rgba(0,255,136,.07)",
                              border:
                                "1px solid rgba(0,255,136,.11)",
                              fontSize: "11px",
                              fontWeight: 700,
                            }}
                          >
                            #{item.id}
                          </span>
                        </td>

                        <td
                          style={{
                            padding: "16px 20px",
                            borderBottom:
                              "1px solid rgba(255,255,255,.045)",
                            color: "#edf4ef",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "11px",
                            }}
                          >
                            <span
                              style={{
                                width: "9px",
                                height: "9px",
                                borderRadius: "50%",
                                background:
                                  "#00ff88",
                                boxShadow:
                                  "0 0 10px rgba(0,255,136,.45)",
                              }}
                            />

                            {item.category_name}
                          </div>
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

      {/* animation */}
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </Layout>
  );
}
