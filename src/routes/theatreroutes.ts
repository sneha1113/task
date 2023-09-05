import { Router } from "express";
import { testpasser } from "../controllers/theatrecontroller";

export const router: Router = Router();

router.post("/", testpasser.newTheatre);

router.post("/class", testpasser.newClass);

router.post("/screen", testpasser.newScreen);

router.post("/seats", testpasser.newSeats);