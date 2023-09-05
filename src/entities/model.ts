import mongoose, { Date, Document, Schema } from 'mongoose';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true, 
  },
  password: String,
});

export const UserModel = mongoose.model<IUser>('User', userSchema);


interface ITheatre extends Document {
  theatreName: string;
  theatreLocation: string;
}

const theatreSchema = new Schema<ITheatre>({
  theatreName: String,
  theatreLocation: String,
});

theatreSchema.index({ theatreName: 1, theatreLocation: 1 }, { unique: true });

export const TheatreModel = mongoose.model<ITheatre>('Theatre', theatreSchema);


interface IMovie extends Document {
  movieName: string;
  theatre: mongoose.Types.ObjectId;
  releaseDate: Date;
}

const movieSchema = new Schema<IMovie>({
  movieName: String,
  theatre: {
    type: Schema.Types.ObjectId,
    ref: 'Theatre',
  },
  releaseDate: Date,
});

movieSchema.index({ movieName: 1, theatreName: 1, releaseDate: 1 }, { unique: true });

export const MovieModel = mongoose.model<IMovie>('Movie', movieSchema);


interface IShowtime extends Document {
  movie: mongoose.Types.ObjectId;
  theatre: mongoose.Types.ObjectId;
  screenNumber: number;
  showtime: string;
  date1: Date;
}

const showtimeSchema = new Schema<IShowtime>({
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
  },
  theatre: {
    type: Schema.Types.ObjectId,
    ref: 'Theatre',
  },
  screenNumber: Number,
  showtime: String,
  date1: Date
});

showtimeSchema.index(
  { movie: 1, theatre: 1, screenNumber: 1, showtime: 1, date1: 1 },
  { unique: true }
);

export const ShowtimeModel = mongoose.model<IShowtime>('Showtime', showtimeSchema);


interface IScreen extends Document {
  screenNumber: number;
  theatre: mongoose.Types.ObjectId;
}

const screenSchema = new Schema<IScreen>({
  screenNumber: Number,
  theatre: {
    type: Schema.Types.ObjectId,
    ref: 'Theatre', 
  },
});

screenSchema.index({ screenNumber: 1, theatre: 1 }, { unique: true });

export const ScreenModel = mongoose.model<IScreen>('Screen', screenSchema);


interface IClass extends Document {
  className: string;
  screen: mongoose.Types.ObjectId;
  cost: number;
  numberOfSeats: number;
  theatre: mongoose.Types.ObjectId;
  status: string;
  date1 : Date;
  showtime : string
}

const classSchema = new Schema<IClass>({
  className: String,
  screen: {
    type: Schema.Types.ObjectId,
    ref: 'Screen', 
  },
  cost: Number,
  numberOfSeats: Number,
  theatre: {
    type: Schema.Types.ObjectId,
    ref: 'Theatre',
  },
  status : String,
  date1 : Date,
  showtime : String
});

classSchema.index({ className: 1, screen: 1, theatre: 1, date1: 1, showtime: 1 }, { unique: true });

export const ClassModel = mongoose.model<IClass>('Class', classSchema);


interface ISeat extends Document {
  className: mongoose.Types.ObjectId;
  screen : mongoose.Types.ObjectId;
  seatNumber: string;
  theatre: mongoose.Types.ObjectId;
  status : string;
  date1 : Date;
  showtime: string
}

const seatSchema = new Schema<ISeat>({
  className: {
    type: Schema.Types.ObjectId,
    ref: 'Class', 
  },
  screen: {
    type: Schema.Types.ObjectId,
    ref: 'Screen', 
  },
  seatNumber: String,
  theatre: {
    type: Schema.Types.ObjectId,
    ref: 'Theatre', 
  },
  status : String,
  date1 : Date,
  showtime:String
});

seatSchema.index({ className: 1, screen: 1, theatre: 1, seatNumber: 1, date1: 1, showtime: 1 }, { unique: true });

export const SeatModel = mongoose.model<ISeat>('Seat', seatSchema);


interface ITicketBooking extends Document {
  theatre: mongoose.Types.ObjectId;
  movie: mongoose.Types.ObjectId;
  screen: mongoose.Types.ObjectId;
  className: mongoose.Types.ObjectId;
  seats: mongoose.Types.ObjectId[];
  cost: number;
  theatreLocation: string;
  numberOfSeatsBooked: number;
  showtime: mongoose.Types.ObjectId;
  date1: Date;
  user: mongoose.Types.ObjectId;
  qrCode: string | null; 
}


const ticketBookingSchema = new Schema<ITicketBooking>({
  theatre: {
    type: Schema.Types.ObjectId,
    ref: 'Theatre',
  },
  movie : {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
  },
  screen: {
    type: Schema.Types.ObjectId,
    ref: 'Screen',
  },
  className: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
  },
  seats: [{ type: Schema.Types.ObjectId, ref: 'Seat' }], 
  showtime: {
    type: Schema.Types.ObjectId,
    ref: 'Showtime',
  },
  cost: Number,
  theatreLocation: String,
  numberOfSeatsBooked: Number,
  date1: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  qrCode: String 
});

export const TicketBookingModel = mongoose.model<ITicketBooking>('TicketBooking', ticketBookingSchema);