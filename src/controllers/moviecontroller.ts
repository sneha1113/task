import { Response, Request } from 'express';
import {
  createMovie,
  createShowtime,
  listMovies,
  getMovieShowtimes,
  getAvailableClasses,
  getSeats,
  updateSeats,
  updateClass,
} from '../services/movies';

const newMovie = async (req: Request, res: Response) => {
  const { movieName, theatreName, releaseDate } = req.body;

  const dateParts = releaseDate.split("/");
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[0]);
  const date = new Date(year, month, day);

  try {
    await createMovie(movieName, theatreName, date);
    res.status(200).json({ message: "successful" });
  } catch (error:any) {
    res.status(500).send({ error: `Failed to create movie: ${error.message}` });
  }
};

const newShowtime = async (req: Request, res: Response) => {
  const { movie, theatre, screenNumber, showtiming, dateString } = req.body;

  const dateParts = dateString.split("/");
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[0]);
  const date = new Date(year, month, day);

  try {
    await createShowtime(movie, theatre, screenNumber, showtiming, date);
    res.status(200).json({ message: "successful" });
  } catch (error:any) {
    res.status(500).send({ error: `Failed to create showtime: ${error.message}` });
  }
};

const getAllMovies = async (req: Request, res: Response) => {
  try {
    const movies = await listMovies();
    res.send(movies);
  } catch (error:any) {
    res.status(500).send({ error: `Failed to fetch movies: ${error.message}` });
  }
};

const movieShowtimes = async (req: Request, res: Response) => {
  const movieName: string = req.params.movie;
  let date  = req.query.date  as any;
  const dateParts = date.split("/");
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[0]);
  date = new Date(Date.UTC(year, month, day, 18, 30, 0, 0));
  date = date.toISOString().replace("Z", "+00:00");
  try {
    const movies = await getMovieShowtimes(movieName, date);
    res.send(movies);
  } catch (error:any) {
    res.status(500).send({ error: `Failed to fetch movie showtimes: ${error.message}` });
  }
};

const movieClass = async (req: Request, res: Response) => {
  const theatreName: string = req.params.theatre;
  const movieName: string = req.params.movie;
  let date  = req.query.date  as any;
  const dateParts = date.split("/");
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[0]);
  date = new Date(Date.UTC(year, month, day, 18, 30, 0, 0));
  date = date.toISOString().replace("Z", "+00:00");
 
  const showtime = req.query.showtime as unknown as string;

  try {
    const movies = await getAvailableClasses(theatreName, movieName, showtime, date);
    res.send(movies);
  } catch (error:any) {
    res.status(500).send({ error: `Failed to fetch available classes: ${error.message}` });
  }
};

const movieSeats = async (req: Request, res: Response) => {
  const theatreName: string = req.params.theatre;
  const movieName: string = req.params.movie;
  let date  = req.query.date  as any;
  const showtime = req.query.showtime as unknown as string;
  const className = req.query.className as unknown as string;

  const dateParts = date.split("/");
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[0]);
  date = new Date(Date.UTC(year, month, day, 18, 30, 0, 0));
  date = date.toISOString().replace("Z", "+00:00");

  try {
    const movies = await getSeats(theatreName, movieName, showtime, date, className);
    res.send(movies);
  } catch (error:any) {
    res.status(500).send({ error: `Failed to fetch available seats: ${error.message}` });
  }
};

const updatemovieSeats = async (req: Request, res: Response) => {
  const theatreName: string = req.params.theatre;
  const movieName: string = req.params.movie;
  let date  = req.query.date  as any;
  const dateParts = date.split("/");
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[0]);
  date = new Date(Date.UTC(year, month, day, 18, 30, 0, 0));
  date = date.toISOString().replace("Z", "+00:00");
  const showtime = req.query.showtime as unknown as string;
  const className = req.body.className as unknown as string;
  const seats = req.body.seats;

  try {
    const movies = await updateSeats(theatreName, movieName, showtime, date, className, seats);
    res.send(movies);
  } catch (error:any) {
    res.status(500).send({ error: `Failed to update seats: ${error.message}` });
  }
};

const updatemovieClass = async (req: Request, res: Response) => {
  const theatreName: string = req.params.theatre;
  const movieName: string = req.params.movie;
  let date  = req.query.date  as any;
  const dateParts = date.split("/");
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[0]);
  date = new Date(Date.UTC(year, month, day, 18, 30, 0, 0));
  date = date.toISOString().replace("Z", "+00:00");

  const showtime = req.query.showtime as unknown as string;
  const className = req.body.className as string;
  const numberOfSeatsBooked = req.body.numberOfSeatsBooked;

  try {
    const movies = await updateClass(theatreName, movieName, showtime, date, className, numberOfSeatsBooked);
    res.send(movies);
  } catch (error:any) {
    res.status(500).send({ error: `Failed to update class: ${error.message}` });
  }
};

export const testpasser = {
  newMovie,
  newShowtime,
  getAllMovies,
  movieShowtimes,
  movieClass,
  movieSeats,
  updatemovieSeats,
  updatemovieClass,
};
