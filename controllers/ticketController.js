import { ticketServices } from "../services/ticket.service.js";

export const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketServices.create(req.body, req.user);
    res
      .status(200)
      .json({ success: true, ticket, msg: "ticket created successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {

    // const ticket = await ticketServices.updateTicket(req.body, req.params.id);
    console.log(req.body);
    res
      .status(200)
      .json({ success: true,  msg: "ticket updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    const { tickets, totalTickets, filtered } =
      await ticketServices.getAllTickets(req);
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
