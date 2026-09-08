import brevo from "@getbrevo/brevo";
import { convertToIndianTime } from "../utils/helperFunctions";

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
      },
      complainMode,
      scheduledDate,
      scheduledTime,
      ticketNo,
      issue: { location, treatment, details } = {},
      createdAt,
      createdBy,
    } = data;

    const { data: raisedDate, time: raisedTime } =
      convertToIndianTime(createdAt);
    const sendEmailTo =
      billToEmails[0] || shipToEmails[0] || process.env.NO_REPLY_EMAIL;

    try {
      const defaultClient = brevo.ApiClient.instance;
      const apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = process.env.BREVO_KEY_V3;

      const apiInstance = new brevo.TransactionalEmailsApi();

      const sendSmtpEmail = new brevo.SendSmtpEmail();

      sendSmtpEmail.sender = {
        name: "EPCORN",
        email: process.env.NO_REPLY_EMAIL,
      };
      sendSmtpEmail.to = [{ email: sendEmailTo }];
      sendSmtpEmail.templateId = 10;

      sendSmtpEmail.params = {
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
        createdBy,
        raisedDate,
        raisedTime,
        assinedBy,
      };

      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      return result;
    } catch (error) {
      console.error("error in ticket raise email ", error);
      throw new Error(`Failed to send raised email: ${error.message}`);
    }
  },
};
