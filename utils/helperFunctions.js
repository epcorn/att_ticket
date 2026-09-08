import jwt from "jsonwebtoken";
import { cloudinary } from "../server.js";

export const uploadeImages = async ({ filepath }) => {
  try {
    if (!filepath) {
      const error = new Error("No file path provided for upload");
      error.statusCode = 400;
      throw error;
    }

    const resp = await cloudinary.uploader.upload(filepath, {
      use_filename: true,
      folder: "att_ticketnest",
      quality: 50,
      resource_type: "auto",
    });

    return resp.secure_url;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = `Cloudinary Upload Failed: ${error.message}`;
    }
    throw error;
  }
};

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

export function convertToIndianTime(createdAt) {
  const date = new Date(createdAt);

  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formattedDateTime = formatter.format(date);
  const [formattedDate, formattedTime] = formattedDateTime.split(", ");

  return {
    date: formattedDate,
    time: formattedTime,
  };
}
