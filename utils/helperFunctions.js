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

export const sendEmail = async ({
  attachment,
  ccList,
  dynamicData,
  emailList,
  templateId,
}) => {
  try {
    let apiInstance = new brevo.TransactionalEmailsApi();
    let apiKey = apiInstance.authentications["apiKey"];
    apiKey.apiKey = process.env.BREVO_KEY;
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "EPCORN",
      email: process.env.NO_REPLY_EMAIL,
    };
    sendSmtpEmail.to = emailList;

    if (ccList && ccList.length > 0) {
      sendSmtpEmail.cc = ccList;
    }

    sendSmtpEmail.params = dynamicData;
    sendSmtpEmail.templateId = templateId;
    if (attachment) sendSmtpEmail.attachment = attachment;
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(result);
    return true;
  } catch (error) {
    console.error("Brevo API Status Code:", error.response?.statusCode);
    console.error(
      "Brevo Error Body:",
      JSON.stringify(error.response?.body, null, 2),
    );
    return false;
  }
};




