import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";

import userRouter from "./routes/userRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import contractRoutes from "./routes/contractRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
import { uploader } from "./controllers/contractController.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Red console error formatting
const originalConsoleError = console.error;
console.error = function (...args) {
  originalConsoleError("\x1b[31m" + args.join(" ") + "\x1b[0m");
};
console.log(__dirname);
// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

export { cloudinary };

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3001",
        "https://att-ticket.onrender.com",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

// API Routes
app.use("/api/user", userRouter);
app.use("/api/contracts", authenticateUser, contractRoutes);
app.use("/api/ticket", authenticateUser, ticketRoutes);
app.post("/api/upload", authenticateUser, uploader);

if (process.env.NODE_ENV === "production") {
  // Serve static assets first
  app.use(express.static(path.join(__dirname, "client", "dist")));

  // Fallback for React Router (Express 5 regex route)
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

// Error Handling Middleware
app.use(errorMiddleware);

// Database Connection & Server Listener
const MONGOURI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.MONGO_LOCAL;

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    const conn = await mongoose.connect(MONGOURI);
    console.log("DB connected successfully:", conn.connection.host);
    app.listen(PORT, () => {
      console.log(`Server connected to port ${PORT}`);
    });
  } catch (err) {
    console.error("Error in DB connect:", err);
    process.exit(1);
  }
};

startServer();
