import { UserModel, ShowtimeModel, ClassModel, ScreenModel, SeatModel, TicketBookingModel, MovieModel } from '../entities/model';
import * as qrcode from 'qrcode';


export const createBooking = async (
  date1 : Date,
  movieName: string,
  showtime: string,
  className: string,
  seatNumbers: string[],
  cost: number,
  theatreLocation: string,
  numberOfSeatsBooked: number,
  email: string,
) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error(`User with email ${email} not found.`);
  }

  const movie = await MovieModel.findOne({ movieName });
  if (!movie) {
    throw  new Error(`Movie with name ${movieName} not found.`);
  }

  const showtimeDoc = await ShowtimeModel.findOne({
    movie: movie._id,
    showtime,
  });

  if (!showtimeDoc) {
    throw new Error(`Showtime not found for movie ${movieName} and showtime ${showtime}.`);
  }

  const screen = await ScreenModel.findOne({
    screenNumber: showtimeDoc.screenNumber,
    theatre: showtimeDoc.theatre,
  });

  if (!screen) {
    throw new Error(`Screen with number ${showtimeDoc.screenNumber} not found.`);
  }

  const classDetail = await ClassModel.findOne({
    className,
    screen: screen._id,
    showtime: showtime,
  });

  if (!classDetail) {
    throw new Error(`Class ${className} not found for showtime ${showtime}.`);
  }

  const seats = await SeatModel.find({
    seatNumber: { $in: seatNumbers },
    className: classDetail._id,
    screen: screen._id,
    theatre: showtimeDoc.theatre,
    showtime: showtime,
  });

  if (seats.length !== seatNumbers.length) {
    throw new Error('Some seats could not be found or are already booked.');
  }

  const qrContent = JSON.stringify({
    theatre: showtimeDoc.theatre,
   
  });


  const qrCodeBuffer = await qrcode.toBuffer(qrContent);


  const qrCodeBase64 = qrCodeBuffer.toString('base64');

  const booking = await TicketBookingModel.create({
    theatre: showtimeDoc.theatre,
    movie: movie._id,
    screen: screen._id, 
    className: classDetail._id,
    seats: seats.map((seat) => seat._id),
    showtime: showtimeDoc._id,
    cost,
    theatreLocation,
    numberOfSeatsBooked,
    date1: date1,
    user: user._id,
    qrCode: qrCodeBase64, 
  });

  return booking;
};

export const getBookingsByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error(`User with email ${email} not found.`);
  }

  const bookings = await TicketBookingModel.find({ user: user._id })
    .populate([
      {
        path: 'theatre',
        select: 'theatreName theatreLocation',
      },
      {
        path: 'screen',
        select: 'screenNumber',
      },
      {
        path: 'className',
        select: 'className cost numberOfSeats',
      },
      {
        path: 'showtime',
        select: 'movie theatre screenNumber showtime date1 time',
        populate: [
          {
            path: 'movie',
            select: 'movieName',
          },
          {
            path: 'theatre',
            select: 'theatreName',
          },
        ],
      },
    ])
    .populate({
      path: 'seats', 
      select: 'seatNumber', 
    });

  const bookingsWithQR = bookings.map((booking) => {
    const bookingWithQR = booking.toJSON();
    bookingWithQR.qrCode = bookingWithQR.qrCode
      ? `data:image/png;base64,${bookingWithQR.qrCode}`
      : null; 
    return bookingWithQR;
  });

  return bookingsWithQR;
};
