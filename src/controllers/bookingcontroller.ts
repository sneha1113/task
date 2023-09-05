import { Response, Request } from 'express';
import { createBooking, getBookingsByEmail } from '../services/booking';

const newBooking = async (req: Request, res: Response) => {
  const {
    date1,
    movie,
    showtime,
    className,
    seatNumbers,
    cost,
    theatreLocation,
    numberOfSeatsBooked,
    email
  } = req.body;

  let date  = date1 as any;
  const dateParts = date.split("/");
  const year = parseInt(dateParts[2]);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[0]);
  date = new Date(Date.UTC(year, month, day, 18, 30, 0, 0));
  date = date.toISOString().replace("Z", "+00:00");

  try {
    await createBooking(
      date,
      movie,
      showtime,
      className,
      seatNumbers,
      cost,
      theatreLocation,
      numberOfSeatsBooked,
      email
    );

    res.send({ message: "successful" });
  } catch (error:any) {
    res.status(500).send({ error: `Failed to create booking: ${error.message}` });
  }
};

const getbookingdetails = async (req: Request, res: Response) => {
  const email = req.query.email as unknown as string;

  try {
    const details = await getBookingsByEmail(email);
    res.send(details);
  } catch (error:any) {
    res.status(500).send({ error: `Failed to fetch booking details: ${error.message}` });
  }
};

export const testpasser = {
  newBooking,
  getbookingdetails
};
