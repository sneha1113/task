import { Router } from "express";
import { testpasser } from "../controllers/bookingcontroller";

export const router: Router = Router();

router.post("/", testpasser.newBooking);

router.get("/", testpasser.getbookingdetails);