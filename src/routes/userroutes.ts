import { Router } from "express";
import { testpasser } from "../controllers/usercontroller";

export const router: Router = Router();

router.post("/signup", testpasser.newUser);

router.post("/login", testpasser.loginUser);