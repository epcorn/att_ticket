import { Ticket } from "../models/ticketModel.js";

export const ticketServices = {
  create: async (data) => {
    try {
      const issuedTicket = await Ticket.create(data);
      if (!issuedTicket) {
        const error = new Error("");
        error.statusCode = 400;
        throw error;
      }
      return issuedTicket;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 400;
      throw error;
    }
  },
  getAllTickets: async (req) => {
    try {
      const startIdx = parseInt(req.query.startIdx) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const sort = req.query.order === "asc" ? 1 : -1;

      const [tickets, totalTickets, filtered] = await Promise.all([
        Ticket.find({}),
        Ticket.countDocuments({}),
        Ticket.find({
          ...(req.query.contract && {
            "createdBy.username": {
              $regex: new RegExp(req.query.createdBy, "i"),
            },
          }),
          ...(req.query.contract && { "contract.number": req.query.contract }),
          ...(req.query.ticketNo && { ticketNo: req.query.ticketNo }),
        })
          .lean()
          .populate("history")
          .sort({ createdAt: sort })
          .skip(startIdx)
          .limit(limit),
      ]);
      return { tickets, totalTickets, filtered };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getAllJobs: async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tommorrow = new Date(today);
      tommorrow.setDate(today.getDate() + 1);
      const dayAfterTomm = new Date(tommorrow).setDate(tommorrow.getDate() + 1);
      const assignedJobs = await Ticket.find({
        status: "Assigned",
        scheduledDate: { $gte: today, $lt: dayAfterTomm },
      });

      const todayJobs = [];
      const tommorrowJobs = [];

      assignedJobs.forEach((job) => {
        const jobTime = new Date(job.scheduledDate).setHours(0, 0, 0, 0);
        if (jobTime === today.getTime()) {
          todayJobs.push(job);
        } else if (jobTime === tommorrow.getTime()) {
          tommorrowJobs.push(job);
        }
      });
      return { todayJobs, tommorrowJobs };
    } catch (error) {
      throw error;
    }
  },
};
