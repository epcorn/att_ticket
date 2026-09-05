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
