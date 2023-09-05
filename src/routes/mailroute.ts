import { Router } from "express";
import { testpasser } from "../controllers/mailcontroller";

export const router: Router = Router();

router.post("/", testpasser.sendingmail);
