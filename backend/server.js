// Import required packages
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import OtpRouter from "./Routes/OtpRoute.js";
import userRouter from "./Routes/UserRoute.js";
import DashboardRouter from "./Routes/DashboardRoute.js";
import Auth from "./Middleware/Auth.js";
import petRouter from "./Routes/PetRoute.js";
import AdoptFormRoute from "./Routes/AdoptFormRoute.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();

app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the OTP routes without authentication
app.use("/api/otp", OtpRouter);

// Use the user routes without authentication
app.use("/api/users", userRouter);

// Require authentication for subsequent routes
app.use(Auth);

// Use the dashboard routes with authentication
app.use("/api/dashboard", DashboardRouter);

// Use the pet routes with authentication
app.use("/api/pets", petRouter);

// Use the adopt form routes with authentication
app.use("/api/form", AdoptFormRoute);

// Create Route for the home page
app.get("/", (req, res) => {
  res.send("Server is Ready");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
    const PORT = process.env.PORT || 9000;
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });
