import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

import userRouter from "./routes/userRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import contractRoutes from "./routes/contractRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
import { uploader } from "./controllers/contractController.js";

const app = express();

//red colnsole error
const originalConsoleError = console.error;
console.error = function (...args) {
  originalConsoleError("\x1b[31m" + args.join(" ") + "\x1b[0m");
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

export { cloudinary };

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
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

app.get("/", (req, res, next) => {
  try {
    res.send("hii");
  } catch (error) {
    next(error);
  }
});

app.use("/api/user", userRouter);
app.use("/api/contracts", authenticateUser, contractRoutes);
app.use("/api/ticket", authenticateUser, ticketRoutes);
app.post("/api/upload", authenticateUser, uploader);

app.use(errorMiddleware);

app.listen(5001, () => {
  mongoose
    .connect("mongodb://localhost:27017/att_ticket", {})
    .then((conn) => console.log("db connected success", conn.connection.host))
    .catch((err) => console.error("error in db connect", err));
  console.log("server conneted to port 5001");
});
