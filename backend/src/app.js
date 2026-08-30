import express from "express";
import cors from "cors";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import { authenticateAdmin } from "./middleware/authMiddleware.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  process.env.ADMIN_DASHBOARD_URL,
  process.env.ADMIN_DASHBOARD_URL_2
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

app.use("/api/products", productRoutes);

app.use(
  "/api/admin/products",
  authenticateAdmin,
  adminProductRoutes
);

app.get("/", (req, res) => {
  res.json({
    message: "Mann Zariya API is running",
  });
});

export default app;