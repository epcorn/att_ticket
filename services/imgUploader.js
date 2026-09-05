import { uploadeImages } from "../helper/helperFunc.js";

export const uploader = async (imgs) => {
  try {
    if (!imgs) {
      return [];
    }
    let images = Array.isArray(imgs) ? imgs : [imgs];

    let imageLinks = [];
    for (let i = 0; i < images.length; i++) {
      if (!images[i].tempFilePath) {
        const pathError = new Error(
          `Temporary path missing for image index ${i}`,
        );
        pathError.statusCode = 400;
        throw pathError;
      }
      const secureUrl = await uploadeImages({
        filepath: images[i].tempFilePath,
      });
      imageLinks.push(secureUrl);
    }
    return imageLinks;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};