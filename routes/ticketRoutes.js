import express from "express";
import {
  createTicket,
  getAllJobs,
  getTickets,
} from "../controllers/ticketController.js";

const ticketRoutes = express.Router();

ticketRoutes.post("/create", createTicket);
ticketRoutes.get("/getAllTickets", getTickets);
ticketRoutes.get("/allJobs", getAllJobs);

export default ticketRoutes;
