import { TheatreModel, ScreenModel, ClassModel, SeatModel } from '../entities/model';

export const createTheatre = async (
  theatreName: string,
  theatreLocation: string
) => {
  const theatre = await TheatreModel.create({
    theatreName,
    theatreLocation,
  });

  return theatre;
};

export const createScreen = async (
  screenNumber: number,
  theatreName: string
) => {
  const theatre = await TheatreModel.findOne({ theatreName });
  if (!theatre) {
    throw new Error(`Theatre with name ${theatreName} not found.`);
  }

  const screen = await ScreenModel.create({
    screenNumber,
    theatre: theatre._id,
  });

  return screen;
};

export const createClass = async (
  className: string,
  screenNumber: number,
  cost: number,
  numberOfSeats: number,
  theatreName: string,
  status: string,
  date1: Date,
  showtime: string
) => {
  const theatre = await TheatreModel.findOne({ theatreName });
  if (!theatre) {
    throw new Error(`Theatre with name ${theatreName} not found.`);
  }

  const screen = await ScreenModel.findOne({
    screenNumber,
    theatre: theatre._id,
  });
  if (!screen) {
    throw new Error(`Screen with number ${screenNumber} not found in theatre ${theatreName}.`);
  }

  const newClass = await ClassModel.create({
    className,
    screen: screen._id,
    cost,
    numberOfSeats,
    theatre: theatre._id,
    status,
    date1,
    showtime,
  });

  return newClass;
};

export const createSeat = async (
  className: string,
  seatNumber: string,
  screenNumber: number,
  theatreName: string,
  status: string,
  date1: Date,
  showtime: string
) => {
  const theatre = await TheatreModel.findOne({ theatreName });
  if (!theatre) {
    throw new Error(`Theatre with name ${theatreName} not found.`);
  }

  const screen = await ScreenModel.findOne({
    screenNumber,
    theatre: theatre._id,
  });
  if (!screen) {
    throw new Error(`Screen with number ${screenNumber} not found in theatre ${theatreName}.`);
  }

  const classDetail = await ClassModel.findOne({
    className,
    screen: screen._id,
    theatre: theatre._id,
    status,
    date1,
    showtime,
  });
  if (!classDetail) {
    throw new Error(`Class with name ${className}, status ${status}, date ${date1}, and showtime ${showtime} not found.`);
  }

  const seat = await SeatModel.create({
    className: classDetail._id,
    seatNumber,
    screen: screen._id,
    theatre: theatre._id,
    status,
    date1,
    showtime,
  });

  return seat;
};