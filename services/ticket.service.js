import { Ticket } from "../models/ticketModel.js";
import { ticketHistoryService } from "./ticketHistory.service.js";

export const ticketServices = {
  create: async (data, user) => {
    try {
      const issuedTicket = await Ticket.create({
        ...data,
        createdBy: { id: user._id, username: user.username },
      });

      if (!issuedTicket) {
        const error = new Error("");
        error.statusCode = 400;
        throw error;
      }
      await ticketHistoryService.createTicketHistory(
        issuedTicket.ticketNo,
        user,
      );
      return issuedTicket;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 400;
      throw error;
    }
  },

  closeTicket: async (data, req) => {
    try {
      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        { $set: { status: "Closed" } },
        { returnDocument: "after", runValidators: true },
      )
        .populate({ path: "history", select: "changes" })
        .lean();

      return ticket;
    } catch (error) {
      throw error;
    }
  },

  assignTicket: async (data, req) => {
    try {
      await ticketHistoryService.createTicketHistoryEntry(
        data.ticketNo,
        "Open",
        "Assigned",
        req.user,
      );
      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        { $set: { ...data } },
        { returnDocument: "after", runValidators: true },
      );

      return ticket;
    } catch (error) {
      throw error;
    }
  },

  reschedule: async (data, req) => {
    try {
      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            scheduledDate: data.scheduledDate,
            scheduledTime: data.scheduledTime,
          },
        },
        { returnDocument: "after", runValidators: true },
      )
        .populate({ path: "history", select: "changes" })
        .lean();

      await ticketHistoryService.ticketHistoryRechedule(
        ticket.history._id,
        data.message,
        req.user,
        {
          scheduledDate: data.scheduledDate,
          scheduledTime: data.scheduledTime,
        },
      );
      return ticket;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  cancelTicket: async (data, ticketId) => {},

  getAllTickets: async (req) => {
    try {
      const startIdx = parseInt(req.query.startIdx) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const sort = req.query.order === "asc" ? 1 : -1;

      const [tickets, totalTickets, filtered] = await Promise.all([
        Ticket.find({}),
        Ticket.countDocuments({}),
        Ticket.find({
          ...(req.query.createdBy && {
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
