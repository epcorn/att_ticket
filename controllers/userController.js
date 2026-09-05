import { contractService } from "../services/contract.service.js";
import { userService } from "../services/user.service.js";

export const login = async (req, res, next) => {
  try {
    const { user, token } = await userService.login(req.body);
    // await contractService.login();
    res.cookie("attToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const user = await userService.signup(req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
