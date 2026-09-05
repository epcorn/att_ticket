import express from "express";
import { attLogin, getContracts } from "../controllers/contractController.js";

const contractRoutes = express.Router();

contractRoutes.post("/login", attLogin);
contractRoutes.get("/", getContracts);

export default contractRoutes;
