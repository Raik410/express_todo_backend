import express, { Request, Response, NextFunction } from "express";

const router = express.Router();
import pool from "../db/db";
import * as userControllers from "../controllers/personControllers";
import {
  checkValidationResult,
  validatePersonLogin,
  validatePersonRegister,
} from "../validations/personValidations";

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rows } = await pool.query("SELECT * FROM person");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/register",
  validatePersonRegister,
  checkValidationResult,
  userControllers.registerUser,
);

router.post(
  "/login",
  validatePersonLogin,
  checkValidationResult,
  userControllers.loginUser,
);

export default router;
