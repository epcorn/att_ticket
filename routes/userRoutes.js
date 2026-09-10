import express from "express";
import {
  getAllUsers,
  login,
  signup,
  updateUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.patch("/update/:id", updateUser);

export default userRouter;
