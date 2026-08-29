import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
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

app.get("/", (req, res) => {
  res.json({
    message: "Mann Zariya API is running",
  });
});

export default app;