import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());

const db=mysql.createConnection({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME
});
db.connect(err=>console.log(err ? "❌ MySQL connection failed: "+err.message : "✅ MySQL Connected"));

const SECRET=process.env.JWT_SECRET;

function auth(req,res,next){
  const h=req.headers.authorization;
  if(!h) return res.status(401).json({message:"No token"});
  const token=h.startsWith("Bearer ") ? h.slice(7) : h;
  jwt.verify(token,SECRET,(err,user)=>{
    if(err) return res.status(403).json({message:"Invalid token"});
    req.user=user; next();
  });
}

app.get("/",(req,res)=>res.json({message:"Stock Management API Running"}));

app.post("/api/register",async(req,res)=>{
  const {fullname,email,password,role="staff"}=req.body;
  if(!fullname||!email||!password) return res.status(400).json({message:"All fields are required"});
  db.query("SELECT id FROM users WHERE email=?",[email],async(err,r)=>{
    if(err)return res.status(500).json(err);
    if(r.length)return res.status(409).json({message:"Email already exists"});
    const hash=await bcrypt.hash(password,10);
    db.query("INSERT INTO users(fullname,email,password,role) VALUES(?,?,?,?)",[fullname,email,hash,role],e=>{
      if(e)return res.status(500).json(e);
      res.json({message:"Registered successfully"});
    });
  });
});

app.post("/api/login",(req,res)=>{
  const {email,password}=req.body;
  db.query("SELECT * FROM users WHERE email=?",[email],async(err,r)=>{
    if(err)return res.status(500).json(err);
    if(!r.length)return res.status(401).json({message:"Invalid credentials"});
    const u=r[0];
    if(!(await bcrypt.compare(password,u.password)))return res.status(401).json({message:"Invalid credentials"});
    const token=jwt.sign({id:u.id,role:u.role,fullname:u.fullname},SECRET,{expiresIn:"1d"});
    res.json({token,user:{id:u.id,fullname:u.fullname,email:u.email,role:u.role}});
  });
});

app.get("/api/dashboard",auth,(req,res)=>{
  const q={
    products:"SELECT COUNT(*) total FROM products",
    categories:"SELECT COUNT(*) total FROM categories",
    suppliers:"SELECT COUNT(*) total FROM suppliers",
    users:"SELECT COUNT(*) total FROM users",
    stock:"SELECT COALESCE(SUM(quantity),0) total FROM products",
    sales:"SELECT COALESCE(SUM(total_price),0) total FROM sales"
  };
  const out={}; const keys=Object.keys(q); let i=0;
  const next=()=>{ if(i===keys.length)return res.json(out); const k=keys[i++];
    db.query(q[k],(e,r)=>{if(e)return res.status(500).json(e);out[k]=r[0].total;next();});
  }; next();
});

app.get("/api/products",auth,(req,res)=>{
  const sql=`SELECT p.*,c.category_name,s.supplier_name FROM products p
  LEFT JOIN categories c ON p.category_id=c.id
  LEFT JOIN suppliers s ON p.supplier_id=s.id ORDER BY p.id DESC`;
  db.query(sql,(e,r)=>e?res.status(500).json(e):res.json(r));
});
app.post("/api/products",auth,(req,res)=>{
  const {product_name,category_id,supplier_id,quantity=0,price=0}=req.body;
  db.query("INSERT INTO products(product_name,category_id,supplier_id,quantity,price) VALUES(?,?,?,?,?)",
    [product_name,category_id,supplier_id,quantity,price],(e,r)=>e?res.status(500).json(e):res.json({message:"Product added",id:r.insertId}));
});
app.put("/api/products/:id",auth,(req,res)=>{
  const {product_name,category_id,supplier_id,quantity,price}=req.body;
  db.query("UPDATE products SET product_name=?,category_id=?,supplier_id=?,quantity=?,price=? WHERE id=?",
    [product_name,category_id,supplier_id,quantity,price,req.params.id],(e)=>e?res.status(500).json(e):res.json({message:"Product updated"}));
});
app.delete("/api/products/:id",auth,(req,res)=>{
  db.query("DELETE FROM products WHERE id=?",[req.params.id],e=>e?res.status(500).json(e):res.json({message:"Product deleted"}));
});

app.get("/api/categories",auth,(req,res)=>db.query("SELECT * FROM categories ORDER BY id DESC",(e,r)=>e?res.status(500).json(e):res.json(r)));
app.post("/api/categories",auth,(req,res)=>db.query("INSERT INTO categories(category_name) VALUES(?)",[req.body.category_name],(e,r)=>e?res.status(500).json(e):res.json({message:"Category added",id:r.insertId})));
app.put("/api/categories/:id",auth,(req,res)=>db.query("UPDATE categories SET category_name=? WHERE id=?",[req.body.category_name,req.params.id],e=>e?res.status(500).json(e):res.json({message:"Category updated"})));
app.delete("/api/categories/:id",auth,(req,res)=>db.query("DELETE FROM categories WHERE id=?",[req.params.id],e=>e?res.status(500).json(e):res.json({message:"Category deleted"})));

app.get("/api/suppliers",auth,(req,res)=>db.query("SELECT * FROM suppliers ORDER BY id DESC",(e,r)=>e?res.status(500).json(e):res.json(r)));
app.post("/api/suppliers",auth,(req,res)=>{const {supplier_name,phone,address}=req.body;db.query("INSERT INTO suppliers(supplier_name,phone,address) VALUES(?,?,?)",[supplier_name,phone,address],(e,r)=>e?res.status(500).json(e):res.json({message:"Supplier added",id:r.insertId}))});
app.put("/api/suppliers/:id",auth,(req,res)=>{const {supplier_name,phone,address}=req.body;db.query("UPDATE suppliers SET supplier_name=?,phone=?,address=? WHERE id=?",[supplier_name,phone,address,req.params.id],e=>e?res.status(500).json(e):res.json({message:"Supplier updated"}))});
app.delete("/api/suppliers/:id",auth,(req,res)=>db.query("DELETE FROM suppliers WHERE id=?",[req.params.id],e=>e?res.status(500).json(e):res.json({message:"Supplier deleted"})));

app.get("/api/sales",auth,(req,res)=>{
  const sql=`SELECT s.*,p.product_name FROM sales s LEFT JOIN products p ON s.product_id=p.id ORDER BY s.id DESC`;
  db.query(sql,(e,r)=>e?res.status(500).json(e):res.json(r));
});
app.post("/api/sales",auth,(req,res)=>{
  const {product_id,quantity_sold}=req.body;
  db.query("SELECT * FROM products WHERE id=?",[product_id],(e,r)=>{
    if(e)return res.status(500).json(e); if(!r.length)return res.status(404).json({message:"Product not found"});
    const p=r[0], qty=Number(quantity_sold);
    if(qty<=0||qty>p.quantity)return res.status(400).json({message:"Insufficient stock"});
    const total=qty*Number(p.price);
    db.query("INSERT INTO sales(product_id,quantity_sold,total_price) VALUES(?,?,?)",[product_id,qty,total],e2=>{
      if(e2)return res.status(500).json(e2);
      db.query("UPDATE products SET quantity=quantity-? WHERE id=?",[qty,product_id],e3=>e3?res.status(500).json(e3):res.json({message:"Sale completed",total_price:total}));
    });
  });
});

app.listen(process.env.PORT||5000,()=>console.log(`✅ Server Running On Port ${process.env.PORT||5000}`));
