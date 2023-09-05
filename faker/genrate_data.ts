import { ClassModel, MovieModel, ScreenModel, SeatModel, ShowtimeModel, TheatreModel } from '../src/entities/model';
import mongoose from 'mongoose';
import { config } from '../config/config';

const theatreNames = [
  'Cineplex Central'
];

const movieTheatreMappings = [
  { movieName: 'Avengers: Endgame', theatreName: 'Cineplex Central', screenNumber: 1, showtime: '10:00am', dateString: '2023-09-01' },
  { movieName: 'Avengers: Endgame', theatreName: 'Cineplex Central', screenNumber: 1, showtime: '12:00pm', dateString: '2023-09-02' },
  { movieName: 'Avengers: Endgame', theatreName: 'Cineplex Central', screenNumber: 2, showtime: '3:00pm', dateString: '2023-09-03' },
  { movieName: 'Avengers: Endgame', theatreName: 'Cineplex Central', screenNumber: 2, showtime: '7:40pm', dateString: '2023-09-04' },
]


const numScreensPerTheatre = 5;

const dateRangeStart = new Date('2023-09-01');
const dateRangeEnd = new Date('2023-09-07');

const getRandomElement = (array: any[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const getRandomDate = (from: Date, to: Date) => {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  const randomTime = Math.random() * (toTime - fromTime) + fromTime;
  return new Date(randomTime);
};

async function connectToMongoDB() {
  mongoose.set('debug', true);
  console.log(config);

  try {
    await mongoose.connect(String(config.mongo.url), {
      retryWrites: true,
      w: 'majority',
    });
    console.log(`Connected to MongoDB`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function insertUniqueData(model: any, data: any) {
  try {
    const document = await model.create(data);
    return document;
  } catch (error : any) {
    if (error.code === 11000) {
      console.log(`Data already exists, skipping: ${data}`);
    } else {
      console.error('Error inserting data:', error);
    }
  }
}

async function generateScreens() {
    const screens = [];
  
    for (const theatreName of theatreNames) {
      const theatre = await TheatreModel.findOne({ theatreName: theatreName }); 
      if (theatre) {
        for (let i = 1; i <= numScreensPerTheatre; i++) {
        
          const existingScreen = await ScreenModel.findOne({ screenNumber: i, theatre: theatre._id });
          if (!existingScreen) {
            const screenData = {
              screenNumber: i,
              theatre: theatre._id,
            };
  
            const screen = await insertUniqueData(ScreenModel, screenData);
            screens.push(screen);
            await generateClasses(screen._id);
          } else {
            console.log(`Screen already exists for theater: ${theatreName}, screenNumber: ${i}`);
          }
        }
      } else {
        console.error(`Theatre not found for name: ${theatreName}`);
      }
    }
  }
  
  
async function generateClasses(screenId: mongoose.Types.ObjectId) {
  const classes = [];
  const classNames = ['platinum', 'silver', 'gold'];

  for (const className of classNames) {
    try {
      const theatres = await TheatreModel.find();
      const theatreId = getRandomElement(theatres)._id;
      const showtime = getRandomElement(['10:00am', '12:00pm', '3:00pm', '7:40pm']);
      const classData = {
        className,
        screen: screenId,
        cost: className === 'platinum' ? 300 : className === 'silver' ? 200 : 250,
        numberOfSeats: Math.floor(Math.random() * (130 - 70 + 1)) + 70,
        theatre: theatreId,
        status: getRandomElement(['Available', 'Filled']),
        date1: getRandomDate(dateRangeStart, dateRangeEnd).toLocaleDateString('en-US'),
        showtime,
      };

      classes.push(classData);
      await insertUniqueData(ClassModel, classData);
      await generateSeats(classData, screenId);
    } catch (error) {
      console.error('Error generating class:', error);
    }
  }
}

async function generateSeats(classData: any, screenId: mongoose.Types.ObjectId) {
  const seats = [];
  const numSeats = classData.numberOfSeats;
  const theatreId = classData.theatre;
  const showtime = classData.showtime;
  const classid = await ClassModel.findOne({
    className: classData.className, 
    screen: screenId,
    theatre: theatreId,
  });
  if (!classid) {
    console.error(`Class not found for ID: ${classData.className}, Screen: ${screenId}, Theatre: ${theatreId}`);
    return;
  }
  for (let j = 1; j <= numSeats; j++) {
    const seatNumber = String.fromCharCode(65 + Math.floor((j - 1) / 26)) + ((j - 1) % 26 + 1).toString().padStart(2, '0');
    const seatData = {
      className: classid._id,
      seatNumber,
      screen: screenId,
      theatre: theatreId,
      status: getRandomElement(['Available', 'Filled']),
      date1: classData.date1,
      showtime,
    };

    seats.push(seatData);
    await insertUniqueData(SeatModel, seatData);
  }
}

async function createShowtime(movieName : any, theatreName : any) {
  try {
    const movie = await MovieModel.findOne({ movieName });
    if (!movie) {
      console.error(`Movie not found for name: ${movieName}`);
      return;
    }

    const theatre = await TheatreModel.findOne({ theatreName });
    if (!theatre) {
      console.error(`Theatre not found for name: ${theatreName}`);
      return;
    }

    const classes = await ClassModel.find({
      theatre: theatre._id
    });

    if (!classes || classes.length === 0) {
      console.error(`No classes found for ${theatreName}, Movie ${movieName}`);
      return;
    }

    for (const classItem of classes) {
      const screen = await ScreenModel.findById(classItem.screen);
      if (!screen) {
        console.error(`Screen not found for ID: ${classItem.screen}`);
        continue;
      }

      const showtimeData = {
        movie: movie._id,
        theatre: theatre._id,
        screenNumber: screen.screenNumber,
        showtime: classItem.showtime,
        date1: classItem.date1,
      };


      await insertUniqueData(ShowtimeModel, showtimeData);
    }
  } catch (error) {
    console.error('Error creating showtime:', error);
  }
}




async function generateData() {
  await generateScreens();
 
  for (const mapping of movieTheatreMappings) {
    await createShowtime(mapping.movieName, mapping.theatreName);
  }

  console.log('Data generation completed.');
}

async function startServer() {
  await connectToMongoDB();
  await generateData();
}

startServer();