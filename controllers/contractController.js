import { contractService } from "../services/contract.service.js";

export const attLogin = async (req, res, next) => {
  try {
    const user = await contractService.login();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getContracts = async (req, res, next) => {
  try {
    const contracts = await contractService.getContracts();
    res.status(200).json(contracts);
  } catch (error) {
    next(error);
  }
};
