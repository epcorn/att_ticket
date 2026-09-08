import { cloudinary } from "../server.js";
import { contractService } from "../services/contract.service.js";
import fs from "fs";

export const attLogin = async (req, res, next) => {
  try {
    const user = await contractService.login();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getContracts = async (req, res, next) => {
  try {
    const contracts = await contractService.getContracts();
    res.status(200).json(contracts);
  } catch (error) {
    next(error);
  }
};

export const uploader = async (req, res, next) => {
  try {
    let imageLinks = "";
    if (req.files) {
      let images = [];
      if (req.files.images.length > 0) images = req.files.images;
      else images.push(req.files.images);

      for (let i = 0; i < images.length; i++) {
        console.log(images[i].tempFilePath);
        const result = await cloudinary.uploader.upload(
          images[i].tempFilePath,
          {
            use_filename: true,
            folder: "att-ticket",
            quality: 50,
            resource_type: "auto",
          },
        );

        imageLinks = result.secure_url;

        if (fs.existsSync(images[i].tempFilePath)) {
          fs.unlinkSync(images[i].tempFilePath);
        }
      }
      return res
        .status(200)
        .json({ message: "Image uploaded Successfully!", link: imageLinks });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "image upload faild" });
  }
};
