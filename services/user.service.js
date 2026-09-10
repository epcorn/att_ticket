import User from "../models/userModel.js";
import { createToken } from "../utils/helperFunctions.js";
import bcrypt from "bcryptjs";

export const userService = {
  login: async (creds) => {
    const { username, password } = creds;
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      const error = new Error("User not found");
      error.status = 401;
      throw error;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("password incorrect");
      error.status = 401;
      throw error;
    }
    const token = createToken(user);

    user.password = undefined;
    return { user, token };
  },
  signup: async (creds) => {
    const { username, password, rights } = creds;

    const user = await User.create({
      username,
      password,
      rights,
    });

    user.password = undefined;

    return user;
  },
  getAllUsers: async () => {
    const users = await User.find({});
    if (!users) {
      const error = new Error("Users not found");
      error.status = 404;
      throw error;
    }
    return users;
  },
  updateUser: async (creds, id) => {
    if (!creds.password || creds.password.trim() === "") {
      delete creds.password;
    }
    const user = await User.findByIdAndUpdate(id, creds, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      const error = new Error("User not available");
      error.status = 404;
      throw error;
    }

    return user;
  },
};
