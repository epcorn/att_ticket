import { BrevoClient } from "@getbrevo/brevo";
import { convertToIndianTime } from "../utils/helperFunctions.js";
import dotenv from "dotenv";
dotenv.config();

const getBrevoClient = () => {
  const apiKey = process.env.BREVO_KEY_V3;
  if (!apiKey) {
    throw new Error("BREVO_KEY_V3 is missing from environment variables");
  }
  return new BrevoClient({ apiKey });
};
// Initialize client once using the environment variable
const brevo = getBrevoClient();

export const emailService = {
  async ticketRaised(data, assinedBy = "EPCORN") {
    const {
      contract: {
        number,
        billToName,
        billToAddress,
        shipToName,
        shipToAddress,
        billToEmails = [],
        shipToEmails = [],
      } = {},
      complainMode,
      scheduledDate,
      scheduledTime,
      ticketNo,
      issue: { location, treatment, details } = {},
      createdAt,
      createdBy: { username } = {},
    } = data || {};

    const { data: raisedDate, time: raisedTime } =
      convertToIndianTime(createdAt);
    const sendEmailTo =
      billToEmails[0] || shipToEmails[0] || process.env.NO_REPLY_EMAIL;

    try {
      const result = await brevo.transactionalEmails
        .sendTransacEmail({
          sender: {
            name: "EPCORN",
            email: process.env.NO_REPLY_EMAIL,
          },
          to: [{ email: sendEmailTo }],
          templateId: 10,
          params: {
            contractNo: number,
            billToName,
            billToAddress,
            shipToName,
            shipToAddress,
            complainMode,
            scheduledDate,
            scheduledTime,
            location,
            treatment,
            details,
            ticketNo,
            createdBy: username,
            raisedDate,
            raisedTime,
            assinedBy,
          },
        })
        .catch((err) => console.error("mail send failed", err));

      return result;
    } catch (error) {
      console.error("Error sending ticket raised email:", error);
      throw new Error(`Failed to send raised email: ${error?.message}`);
    }
  },

  async ticketClosed(data, closedBy = "EPCORN") {
    const {
      contract: {
        number,
        shipToAddress,
        billToEmails = [],
        shipToEmails = [],
      } = {},
      ticketNo,
      scheduledDate,
      issue: { problem } = {},
    } = data || {};

    const sendEmailTo =
      billToEmails[0] || shipToEmails[0] || process.env.NO_REPLY_EMAIL;

    try {
      const result = await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          name: "EPCORN",
          email: process.env.NO_REPLY_EMAIL,
        },
        to: [{ email: sendEmailTo }],
        templateId: 12,
        params: {
          contractNo: number,
          shipToAddress,
          scheduledDate,
          problem,
          ticketNo,
          closedBy,
        },
      });

      return result;
    } catch (error) {
      console.error("Error sending ticket closed email:", error);
      throw new Error(`Failed to send closed email: ${error.message}`);
    }
  },

  async ticketRescheduled(data, assinedBy = "EPCORN") {
    const {
      contract: {
        number,
        billToName,
        billToAddress,
        shipToName,
        shipToAddress,
        billToEmails = [],
        shipToEmails = [],
      } = {},
      complainMode,
      scheduledDate,
      scheduledTime,
      ticketNo,
      issue: { problem, location, details } = {},
      createdAt,
      createdBy: { username } = {},
    } = data || {};

    const { data: raisedDate, time: raisedTime } =
      convertToIndianTime(createdAt);
    const sendEmailTo =
      billToEmails?.[0]?.trim() ||
      shipToEmails?.[0]?.trim() ||
      "noreply.epcorn@gmail.com";
    console.log("email:", sendEmailTo);
    try {
      const result = await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          name: "EPCORN",
          email: process.env.NO_REPLY_EMAIL,
        },
        to: [{ email: sendEmailTo }],
        templateId: 14,
        params: {
          contractNo: number,
          billToName,
          billToAddress,
          shipToName,
          shipToAddress,
          complainMode,
          scheduledDate,
          scheduledTime,
          problem,
          location,
          details,
          ticketNo,
          username,
          raisedDate,
          raisedTime,
          assinedBy,
        },
      });

      return result;
    } catch (error) {
      console.error("Error sending ticket rescheduled email:", error);
      throw new Error(`Failed to send rescheduled email: ${error.message}`);
    }
  },
};

