import { Ticket } from "../models/ticketModel.js";
import { emailService } from "./email.service.js";
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
      const result = await emailService.ticketRescheduled(ticket);
      console.log("results:", result);
      return ticket;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  cancelTicket: async (data, req) => {
    try {
      const ticket = await Ticket.findOneAndUpdate(
        { _id: req.params.id, status: { $ne: "Closed" } },
        { $set: { status: "Canceled" } },
        { returnDocument: "after" },
      );
      return ticket;
    } catch (error) {
      throw error;
    }
  },

  getAllTickets: async (req) => {
    try {
      const {
        order,
        startIndex,
        limit,
        createdBy,
        contractNo,
        ticketNo,
        status,
      } = req.query;

      const filter = {};
      if (createdBy)
        filter["createdBy.username"] = { $regex: createdBy, $options: "i" };
      if (contractNo) filter["contract.number"] = contractNo;
      if (ticketNo) filter.ticketNo = ticketNo;
      if (status) filter.status = status;

      const [totalTickets, filtered] = await Promise.all([
        Ticket.countDocuments({}),
        Ticket.find(filter)
          .sort({ createdAt: order === "asc" ? 1 : -1 })
          .skip(parseInt(startIndex) || 0)
          .limit(parseInt(limit) || 20)
          .populate("history")
          .lean(),
      ]);

      return { totalTickets, filtered };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getAllJobs: async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const [assignedJobs, statusCount] = await Promise.all([
        Ticket.find({ status: "Assigned" }),
        Ticket.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      ]);

      const todayJobs = [];
      const tomorrowJobs = [];

      assignedJobs.forEach((job) => {
        if (job.scheduledDate) {
          const jobDate = new Date(job.scheduledDate);
          jobDate.setHours(0, 0, 0, 0);

          if (jobDate.getTime() === today.getTime()) {
            todayJobs.push(job);
          } else if (jobDate.getTime() === tomorrow.getTime()) {
            tomorrowJobs.push(job);
          }
        }
      });
      const counts = statusCount.reduce(
        (acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        },
        { Open: 0, Assigned: 0, Closed: 0, Canceled: 0 },
      );

      return { todayJobs, tomorrowJobs, counts };
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  getRaisedCount: async () => {
    try {
      const ticket = await Ticket.aggregate([
        {
          $match: { status: { $ne: "Canceled" } },
        },
        {
          $group: {
            _id: "$contract.number",
            count: { $sum: 1 },
          },
        },
      ]);
      return ticket;
    } catch (error) {
      throw error;
    }
  },
};
