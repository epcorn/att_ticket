import { ticketServices } from "../services/ticket.service.js";

export const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketServices.create(req.body);
    res
      .status(200)
      .json({ success: true, ticket, msg: "ticket created successfully" });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    const { tickets, totalTickets,filtered } = await ticketServices.getAllTickets(req);
    res.status(200).json({
      success: true,
      tickets,
      totalTickets,
      filtered,
      msg: "tickets fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const { todayJobs, tommorrowJobs } = await ticketServices.getAllJobs();
    res.status(200).json({ todayJobs, tommorrowJobs });
  } catch (error) {
    next(error);
  }
};
