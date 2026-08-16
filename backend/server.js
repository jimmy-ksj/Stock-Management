import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* =========================================================
   CONFIGURATION
========================================================= */

const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  console.error("❌ JWT_SECRET is missing in environment variables");
  process.exit(1);
}

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* =========================================================
   DATABASE
========================================================= */

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});

db.on("error", (err) => {
  console.error("❌ MySQL Error:", err.message);
});

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function sendError(res, status, message, error = null) {
  console.error("❌", message, error?.message || "");

  return res.status(status).json({
    success: false,
    message,
  });
}

function isValidId(id) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
}

/* =========================================================
   AUTHENTICATION MIDDLEWARE
========================================================= */

function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const token = header.startsWith("Bearer ")
      ? header.substring(7)
      : header;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return sendError(res, 500, "Authentication error", error);
  }
}

/* =========================================================
   ADMIN MIDDLEWARE
========================================================= */

function adminOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
}

/* =========================================================
   ROOT / HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Stock Management API Running",
    status: "online",
    database: process.env.DB_NAME || "unknown",
  });
});

app.get("/api/health", (req, res) => {
  db.query("SELECT 1 AS db_status", (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        api: "online",
        database: "offline",
      });
    }

    res.json({
      success: true,
      api: "online",
      database: "online",
    });
  });
});

/* =========================================================
   REGISTER
========================================================= */

app.post("/api/register", async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      role = "staff",
    } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    const cleanName = String(fullname).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name is too short",
      });
    }

    if (!cleanEmail.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    if (cleanPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    const allowedRoles = ["admin", "staff"];

    const userRole = allowedRoles.includes(role)
      ? role
      : "staff";

    db.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [cleanEmail],
      async (err, rows) => {
        if (err) {
          return sendError(
            res,
            500,
            "Failed to check existing user",
            err
          );
        }

        if (rows.length > 0) {
          return res.status(409).json({
            success: false,
            message: "Email already exists",
          });
        }

        try {
          const hashedPassword = await bcrypt.hash(
            cleanPassword,
            10
          );

          db.query(
            `INSERT INTO users
            (fullname, email, password, role)
            VALUES (?, ?, ?, ?)`,
            [
              cleanName,
              cleanEmail,
              hashedPassword,
              userRole,
            ],
            (insertError, result) => {
              if (insertError) {
                return sendError(
                  res,
                  500,
                  "Failed to create account",
                  insertError
                );
              }

              return res.status(201).json({
                success: true,
                message: "Registered successfully",
                user: {
                  id: result.insertId,
                  fullname: cleanName,
                  email: cleanEmail,
                  role: userRole,
                },
              });
            }
          );
        } catch (hashError) {
          return sendError(
            res,
            500,
            "Password encryption failed",
            hashError
          );
        }
      }
    );
  } catch (error) {
    return sendError(res, 500, "Registration failed", error);
  }
});

/* =========================================================
   LOGIN
========================================================= */

app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    db.query(
      "SELECT id, fullname, email, password, role FROM users WHERE email = ? LIMIT 1",
      [cleanEmail],
      async (err, rows) => {
        if (err) {
          return sendError(
            res,
            500,
            "Database error during login",
            err
          );
        }

        if (rows.length === 0) {
          return res.status(401).json({
            success: false,
            message: "Invalid email or password",
          });
        }

        const user = rows[0];

        try {
          const passwordMatch = await bcrypt.compare(
            String(password),
            user.password
          );

          if (!passwordMatch) {
            return res.status(401).json({
              success: false,
              message: "Invalid email or password",
            });
          }

          const token = jwt.sign(
            {
              id: user.id,
              fullname: user.fullname,
              email: user.email,
              role: user.role,
            },
            SECRET,
            {
              expiresIn: "1d",
            }
          );

          return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
              id: user.id,
              fullname: user.fullname,
              email: user.email,
              role: user.role,
            },
          });
        } catch (compareError) {
          return sendError(
            res,
            500,
            "Password verification failed",
            compareError
          );
        }
      }
    );
  } catch (error) {
    return sendError(res, 500, "Login failed", error);
  }
});

/* =========================================================
   CURRENT USER
========================================================= */

app.get("/api/me", auth, (req, res) => {
  db.query(
    "SELECT id, fullname, email, role FROM users WHERE id = ? LIMIT 1",
    [req.user.id],
    (err, rows) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to load user",
          err
        );
      }

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user: rows[0],
      });
    }
  );
});

/* =========================================================
   DASHBOARD
========================================================= */

app.get("/api/dashboard", auth, (req, res) => {
  const queries = {
    products: "SELECT COUNT(*) AS total FROM products",

    categories:
      "SELECT COUNT(*) AS total FROM categories",

    suppliers:
      "SELECT COUNT(*) AS total FROM suppliers",

    users:
      "SELECT COUNT(*) AS total FROM users",

    stock:
      "SELECT COALESCE(SUM(quantity), 0) AS total FROM products",

    sales:
      "SELECT COALESCE(SUM(total_price), 0) AS total FROM sales",

    totalSales:
      "SELECT COUNT(*) AS total FROM sales",
  };

  const result = {};
  const keys = Object.keys(queries);

  let index = 0;

  function executeNext() {
    if (index >= keys.length) {
      return res.json({
        success: true,
        data: result,

        // Compatibility with frontend
        products: result.products,
        categories: result.categories,
        suppliers: result.suppliers,
        users: result.users,
        stock: result.stock,
        sales: result.sales,
        totalSales: result.totalSales,
      });
    }

    const key = keys[index++];
    const query = queries[key];

    db.query(query, (err, rows) => {
      if (err) {
        return sendError(
          res,
          500,
          `Dashboard ${key} query failed`,
          err
        );
      }

      result[key] = Number(rows[0].total || 0);

      executeNext();
    });
  }

  executeNext();
});

/* =========================================================
   PRODUCTS
========================================================= */

app.get("/api/products", auth, (req, res) => {
  const sql = `
    SELECT
      p.*,
      c.category_name,
      s.supplier_name
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.id
    LEFT JOIN suppliers s
      ON p.supplier_id = s.id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      return sendError(
        res,
        500,
        "Failed to load products",
        err
      );
    }

    res.json(rows);
  });
});

app.post("/api/products", auth, (req, res) => {
  const {
    product_name,
    category_id,
    supplier_id,
    quantity = 0,
    price = 0,
  } = req.body;

  if (!product_name) {
    return res.status(400).json({
      success: false,
      message: "Product name is required",
    });
  }

  const qty = Number(quantity);
  const productPrice = Number(price);

  if (qty < 0 || productPrice < 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity and price cannot be negative",
    });
  }

  const sql = `
    INSERT INTO products
    (product_name, category_id, supplier_id, quantity, price)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      String(product_name).trim(),
      category_id || null,
      supplier_id || null,
      qty,
      productPrice,
    ],
    (err, result) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to add product",
          err
        );
      }

      res.status(201).json({
        success: true,
        message: "Product added successfully",
        id: result.insertId,
      });
    }
  );
});

app.put("/api/products/:id", auth, (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  const {
    product_name,
    category_id,
    supplier_id,
    quantity,
    price,
  } = req.body;

  if (!product_name) {
    return res.status(400).json({
      success: false,
      message: "Product name is required",
    });
  }

  const sql = `
    UPDATE products
    SET
      product_name = ?,
      category_id = ?,
      supplier_id = ?,
      quantity = ?,
      price = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      String(product_name).trim(),
      category_id || null,
      supplier_id || null,
      Number(quantity) || 0,
      Number(price) || 0,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to update product",
          err
        );
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        message: "Product updated successfully",
      });
    }
  );
});

app.delete("/api/products/:id", auth, (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  db.query(
    "DELETE FROM products WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to delete product",
          err
        );
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    }
  );
});

/* =========================================================
   CATEGORIES
========================================================= */

app.get("/api/categories", auth, (req, res) => {
  db.query(
    "SELECT * FROM categories ORDER BY id DESC",
    (err, rows) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to load categories",
          err
        );
      }

      res.json(rows);
    }
  );
});

app.post("/api/categories", auth, (req, res) => {
  const categoryName = String(
    req.body.category_name || ""
  ).trim();

  if (!categoryName) {
    return res.status(400).json({
      success: false,
      message: "Category name is required",
    });
  }

  db.query(
    "INSERT INTO categories(category_name) VALUES(?)",
    [categoryName],
    (err, result) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to add category",
          err
        );
      }

      res.status(201).json({
        success: true,
        message: "Category added successfully",
        id: result.insertId,
      });
    }
  );
});

app.put("/api/categories/:id", auth, (req, res) => {
  const categoryName = String(
    req.body.category_name || ""
  ).trim();

  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  if (!categoryName) {
    return res.status(400).json({
      success: false,
      message: "Category name is required",
    });
  }

  db.query(
    "UPDATE categories SET category_name=? WHERE id=?",
    [categoryName, req.params.id],
    (err, result) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to update category",
          err
        );
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.json({
        success: true,
        message: "Category updated successfully",
      });
    }
  );
});

app.delete("/api/categories/:id", auth, (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  db.query(
    "DELETE FROM categories WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to delete category",
          err
        );
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.json({
        success: true,
        message: "Category deleted successfully",
      });
    }
  );
});

/* =========================================================
   SUPPLIERS
========================================================= */

app.get("/api/suppliers", auth, (req, res) => {
  db.query(
    "SELECT * FROM suppliers ORDER BY id DESC",
    (err, rows) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to load suppliers",
          err
        );
      }

      res.json(rows);
    }
  );
});

app.post("/api/suppliers", auth, (req, res) => {
  const {
    supplier_name,
    phone,
    address,
  } = req.body;

  if (!supplier_name) {
    return res.status(400).json({
      success: false,
      message: "Supplier name is required",
    });
  }

  db.query(
    `
      INSERT INTO suppliers
      (supplier_name, phone, address)
      VALUES (?, ?, ?)
    `,
    [
      String(supplier_name).trim(),
      phone || null,
      address || null,
    ],
    (err, result) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to add supplier",
          err
        );
      }

      res.status(201).json({
        success: true,
        message: "Supplier added successfully",
        id: result.insertId,
      });
    }
  );
});

app.put("/api/suppliers/:id", auth, (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid supplier ID",
    });
  }

  const {
    supplier_name,
    phone,
    address,
  } = req.body;

  if (!supplier_name) {
    return res.status(400).json({
      success: false,
      message: "Supplier name is required",
    });
  }

  db.query(
    `
      UPDATE suppliers
      SET
        supplier_name=?,
        phone=?,
        address=?
      WHERE id=?
    `,
    [
      String(supplier_name).trim(),
      phone || null,
      address || null,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to update supplier",
          err
        );
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "Supplier not found",
        });
      }

      res.json({
        success: true,
        message: "Supplier updated successfully",
      });
    }
  );
});

app.delete("/api/suppliers/:id", auth, (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid supplier ID",
    });
  }

  db.query(
    "DELETE FROM suppliers WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to delete supplier",
          err
        );
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "Supplier not found",
        });
      }

      res.json({
        success: true,
        message: "Supplier deleted successfully",
      });
    }
  );
});

/* =========================================================
   SALES
========================================================= */

app.get("/api/sales", auth, (req, res) => {
  const sql = `
    SELECT
      s.*,
      p.product_name,
      p.price
    FROM sales s
    LEFT JOIN products p
      ON s.product_id = p.id
    ORDER BY s.id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      return sendError(
        res,
        500,
        "Failed to load sales",
        err
      );
    }

    res.json(rows);
  });
});

app.post("/api/sales", auth, (req, res) => {
  const {
    product_id,
    quantity_sold,
  } = req.body;

  if (!isValidId(product_id)) {
    return res.status(400).json({
      success: false,
      message: "Valid product ID is required",
    });
  }

  const qty = Number(quantity_sold);

  if (!Number.isFinite(qty) || qty <= 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity sold must be greater than 0",
    });
  }

  db.query(
    "SELECT id, product_name, quantity, price FROM products WHERE id=? LIMIT 1",
    [product_id],
    (err, rows) => {
      if (err) {
        return sendError(
          res,
          500,
          "Failed to find product",
          err
        );
      }

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const product = rows[0];
      const currentStock = Number(product.quantity);
      const price = Number(product.price);

      if (qty > currentStock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${currentStock}`,
        });
      }

      const total = qty * price;

      db.beginTransaction((transactionError) => {
        if (transactionError) {
          return sendError(
            res,
            500,
            "Could not start sale transaction",
            transactionError
          );
        }

        db.query(
          `
            INSERT INTO sales
            (product_id, quantity_sold, total_price)
            VALUES (?, ?, ?)
          `,
          [product_id, qty, total],
          (saleError) => {
            if (saleError) {
              return db.rollback(() => {
                sendError(
                  res,
                  500,
                  "Failed to record sale",
                  saleError
                );
              });
            }

            db.query(
              `
                UPDATE products
                SET quantity = quantity - ?
                WHERE id = ?
              `,
              [qty, product_id],
              (stockError) => {
                if (stockError) {
                  return db.rollback(() => {
                    sendError(
                      res,
                      500,
                      "Failed to update stock",
                      stockError
                    );
                  });
                }

                db.commit((commitError) => {
                  if (commitError) {
                    return db.rollback(() => {
                      sendError(
                        res,
                        500,
                        "Failed to complete sale",
                        commitError
                      );
                    });
                  }

                  res.status(201).json({
                    success: true,
                    message: "Sale completed successfully",
                    sale: {
                      product_id,
                      product_name: product.product_name,
                      quantity_sold: qty,
                      unit_price: price,
                      total_price: total,
                    },
                  });
                });
              }
            );
          }
        );
      });
    }
  );
});

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log("========================================");
  console.log("🚀 STOCK MANAGEMENT API");
  console.log("========================================");
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("========================================");
});
