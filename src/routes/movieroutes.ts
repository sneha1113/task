import { Router } from "express";
import { testpasser } from "../controllers/moviecontroller";

export const router: Router = Router();

router.post("/", testpasser.newMovie);

router.post("/showtime", testpasser.newShowtime);

router.get("/", testpasser.getAllMovies);

router.get("/:movie", testpasser.movieShowtimes);

router.get("/:movie/:theatre/class", testpasser.movieClass);

router.get("/:movie/:theatre/class/seats", testpasser.movieSeats);

router.patch("/:movie/:theatre/class/seats", testpasser.updatemovieSeats);

router.patch("/:movie/:theatre/class", testpasser.updatemovieClass);