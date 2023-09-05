import { Response, Request } from 'express';
import { createTheatre, createClass, createScreen, createSeat } from '../services/theatre';

const newTheatre = async (req: Request, res: Response) => {
  const { theatreName, theatreLocation } = req.body;
  try {
    await createTheatre(theatreName, theatreLocation);
    res.send({ message: "successful" });
  } catch (error : any) {
    res.status(500).send({ error: `Failed to create theatre: ${error.message}` });
  }
};

const newClass = async (req: Request, res: Response) => {
  const { className, screenNumber, cost, numberOfSeats, theatreName, status, dateString, showtime } = req.body;
  let date  = req.query.date  as any;
  const dateParts = date.split("/");
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[0]);
  date = new Date(Date.UTC(year, month, day, 18, 30, 0, 0));
  date = date.toISOString().replace("Z", "+00:00");
  try {
    await createClass(className, screenNumber, cost, numberOfSeats, theatreName, status, date, showtime);
    res.send({ message: "successful" });
  } catch (error : any) {
    res.status(500).send({ error: `Failed to create class: ${error.message}` });
  }
};

const newScreen = async (req: Request, res: Response) => {
  const { screenNumber, theatreName } = req.body;
  try {
    await createScreen(screenNumber, theatreName);
    res.send({ message: "successful" });
  } catch (error : any) {
    res.status(500).send({ error: `Failed to create screen: ${error.message}` });
  }
};

const newSeats = async (req: Request, res: Response) => {
  const { className, seatNumber, screenNumber, theatreName, status, dateString, showtime } = req.body;
  let date  = req.query.date  as any;
  const dateParts = date.split("/");
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[0]);
  date = new Date(Date.UTC(year, month, day, 18, 30, 0, 0));
  date = date.toISOString().replace("Z", "+00:00");
  
  try {
    await createSeat(className, seatNumber, screenNumber, theatreName, status, date, showtime);
    res.send({ message: "successful" });
  } catch (error : any) {
    res.status(500).send({ error: `Failed to create seat: ${error.message}` });
  }
};

export const testpasser = {
  newTheatre,
  newClass,
  newScreen,
  newSeats
};
