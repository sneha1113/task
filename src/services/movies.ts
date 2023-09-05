
import { MovieModel, ShowtimeModel, ClassModel, SeatModel, TheatreModel } from '../entities/model';

export const createMovie = async (
  movieName: string,
  theatreName: string,
  releaseDate: Date,
) => {
  const theatre = await TheatreModel.findOne({ theatreName });
  if (!theatre) {
    throw new Error(`Theatre with name ${theatreName} not found.`);
  }

  const movie = await MovieModel.create({
    movieName,
    theatre: theatre._id,
    releaseDate,
  });

  return movie;
};

export const createShowtime = async (
  movieName: string,
  theatreName: string,
  screenNumber: number,
  showtime: string,
  date1: Date
) => {
  const theatre = await TheatreModel.findOne({ theatreName });
  if (!theatre) {
    throw new Error(`Theatre with name ${theatreName} not found.`);
  }

  const movie = await MovieModel.findOne({ movieName });
  if (!movie) {
    throw new Error(`Movie with name ${movieName} not found.`);
  }

  const showtiming= await ShowtimeModel.create({
    movie: movie._id,
    theatre: theatre._id,
    screenNumber,
    showtime,
    date1
  });

  return showtiming;
};

export const listMovies = async () => {
  const movies = await MovieModel.find({}, 'movieName releaseDate');

  return movies;
};

export const getMovieShowtimes = async (movieName: string, date1: Date) => {
  const movie = await MovieModel.findOne({ movieName });
  if (!movie) {
    throw new Error(`Movie with name ${movieName} not found.`);
  }

  const showtimes = await ShowtimeModel.find({
    movie: movie._id,
    date1,
  })
    .populate({
      path: 'movie',
      select: 'movieName',
    })
    .populate({
      path: 'theatre',
      select: 'theatreName theatreLocation',
    })
    .select('showtime');

  console.log(showtimes,"dei")
  return showtimes;
};

export const getAvailableClasses = async (
  theatreName: string,
  movieName: string,
  showtime: string,
  date1: Date
) => {
  const theatre = await TheatreModel.findOne({ theatreName });
  if (!theatre) {
    throw new Error(`Theatre with name ${theatreName} not found.`);
  }

  const movie = await MovieModel.findOne({ movieName });
  if (!movie) {
    throw new Error(`Movie with name ${movieName} not found.`);
  }

  const showtimeDoc = await ShowtimeModel.findOne({
    date1,
    showtime,
    movie: movie._id,
    theatre: theatre._id,
  });

  if (!showtimeDoc) {
    return null;
  }

  const availableClasses = await ClassModel.find({
    date1,
    showtime,
    theatre: showtimeDoc.theatre,
  });

  return availableClasses.map((classDetail) => ({
    className: classDetail.className,
    status: classDetail.status,
    numberOfSeats: classDetail.numberOfSeats,
  }));
};

export const getSeats = async (
  theatreName: string,
  movieName: string,
  showtime: string,
  date1: Date,
  className: string
) => {
  const theatre = await TheatreModel.findOne({ theatreName });
  if (!theatre) {
    throw new Error(`Theatre with name ${theatreName} not found.`);
  }

  const movie = await MovieModel.findOne({ movieName });
  if (!movie) {
    throw new Error(`Movie with name ${movieName} not found.`);
  }

  const showtimeDoc = await ShowtimeModel.findOne({
    date1,
    showtime,
    movie: movie._id,
    theatre: theatre._id,
  });

  if (!showtimeDoc) {
    return null;
  }

  const classDetail = await ClassModel.findOne({
    date1,
    showtime,
    className,
    theatre: showtimeDoc.theatre,
  });

  if (!classDetail) {
    return null;
  }

  const seats = await SeatModel.find({
    date1,
    showtime,
    className: classDetail._id,
  });

  return seats.map((seat) => ({
    seatNumber: seat.seatNumber,
    seatStatus: seat.status,
  }));
};


export const updateSeats = async (
  theatreName: string,
  movieName: string,
  showtime: string,
  date1: Date,
  className: string,
  seatsArray: string[] 
) => {
  const theatre = await TheatreModel.findOne({ theatreName });
  if (!theatre) {
    throw new Error(`Theatre with name ${theatreName} not found.`);
  }

  const movie = await MovieModel.findOne({ movieName });
  if (!movie) {
    throw new Error(`Movie with name ${movieName} not found.`);
  }

  const showtimeDoc = await ShowtimeModel.findOne({
    date1,
    showtime,
    movie: movie._id,
    theatre: theatre._id,
  });

  if (!showtimeDoc) {
    throw new Error(`Showtime not found.`);
  }

  const classDetail = await ClassModel.findOne({
    date1,
    showtime,
    className,
    theatre: showtimeDoc.theatre,
  });

  if (!classDetail) {
    throw new Error(`Class not found.`);
  }

  await SeatModel.updateMany(
    {
      date1,
      showtime,
      className: classDetail._id,
      seatNumber: { $in: seatsArray }, 
    },
    {
      $set: {
        status: 'filled',
      },
    }
  );

  return 'Seats updated successfully.';
};

export const updateClass = async (
  theatreName: string,
  movieName: string,
  showtime: string,
  date1: Date,
  className: string,
  numberOfSeatsBooked: number
) => {
  const theatre = await TheatreModel.findOne({ theatreName });
  if (!theatre) {
    throw new Error(`Theatre with name ${theatreName} not found.`);
  }

  const movie = await MovieModel.findOne({ movieName });
  if (!movie) {
    throw new Error(`Movie with name ${movieName} not found.`);
  }

  const showtimeDoc = await ShowtimeModel.findOne({
    date1,
    showtime,
    movie: movie._id,
    theatre: theatre._id,
  });

  if (!showtimeDoc) {
    throw new Error(`Showtime not found.`);
  }

  const classDetail = await ClassModel.findOne({
    date1,
    showtime,
    className,
    theatre: showtimeDoc.theatre,
  });

  if (!classDetail) {
    throw new Error(`Class not found.`);
  }

  if (classDetail.numberOfSeats < numberOfSeatsBooked) {
    throw new Error(`Not enough seats available in class ${className}.`);
  }

  classDetail.numberOfSeats -= numberOfSeatsBooked;

  if (classDetail.numberOfSeats === 0) {
    classDetail.status = 'housefull';
  }

  await classDetail.save();

  return 'Class updated successfully.';
};