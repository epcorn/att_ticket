import express from "express";
import {
  createTicket,
  getAllJobs,
  getTickets,
  updateTicket,
} from "../controllers/ticketController.js";

const ticketRoutes = express.Router();

ticketRoutes.post("/create", createTicket);
ticketRoutes.patch("/update/:id", updateTicket);
ticketRoutes.get("/getAllTickets", getTickets);
ticketRoutes.get("/allJobs", getAllJobs);

export default ticketRoutes;
