import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import reportRoutes from "./routes/report.route.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'; // ✅ Correct Clerk import
import path from "path"

const app = express();
dotenv.config();
const PORT = process.env.PORT;
const __dirname=path.resolve();

// Middleware ordering is important!
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS setup - enhanced security
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Force API responses to JSON for /api routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    req.headers['accept'] = 'application/json';
    res.setHeader('Content-Type', 'application/json');
  }
  next();
});

// ✅ Protect this route with Clerk middleware
app.use("/api/report", ClerkExpressRequireAuth(), reportRoutes);
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}

// Error handling middleware (should be after routes)
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler (should be last)
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on: " + PORT);
  connectDB();
});
