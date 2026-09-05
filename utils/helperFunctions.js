import jwt from "jsonwebtoken";

export const createToken = (user) => {
  const token = jwt.sign(
    {
      userId: user._id,
      name: user.username,
      rights: user.rights,
      active: user.active,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2d" },
  );

  return token;
};
