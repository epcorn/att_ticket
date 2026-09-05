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
};
