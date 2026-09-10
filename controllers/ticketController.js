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
  const body = req.body.data;
  try {
    let ticket;
    const shouldAssign =
      body.agent && body.scheduledDate && body.status === "Open";

    if (body.status === "Closed") {
      try {
        ticket = await ticketServices.closeTicket(body, req);
      } catch (error) {
        next(error);
      }
    }
    if (body.status === "Canceled") {
      try {
        ticket = await ticketServices.cancelTicket(body, req);
      } catch (error) {
        next(error);
      }
    }
    if (shouldAssign) {
      body.status = "Assigned";
      ticket = await ticketServices.assignTicket(body, req);
    }
    if (body.key === "reschedule") {
      ticket = await ticketServices.reschedule(body, req);
    }
    res.status(200).json({
      success: true,
      ticket,
      msg: `ticket ${body?.status || body.key} successfully`,
    });
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
      // tickets,
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
    const jobs = await ticketServices.getAllJobs();
    res.status(200).json({ ...jobs });
  } catch (error) {
    next(error);
  }
};

export const getRaisedCount = async (req, res, next) => {
  try {
    const counts = await ticketServices.getRaisedCount();
    res.status(200).json(counts);
  } catch (error) {
    next(error);
  }
};
