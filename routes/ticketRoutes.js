import express from "express";
import {
  createTicket,
  getAllJobs,
  getRaisedCount,
  getTickets,
  updateTicket,
} from "../controllers/ticketController.js";

const ticketRoutes = express.Router();

ticketRoutes.post("/create", createTicket);
ticketRoutes.patch("/update/:id", updateTicket);
ticketRoutes.get("/allJobs", getAllJobs);
ticketRoutes.get("/raisedCounts", getRaisedCount);
ticketRoutes.get("/getAllTickets", getTickets);

export default ticketRoutes;
