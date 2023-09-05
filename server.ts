require("dotenv").config({ path: "./.env" });
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config/config';
import { router as userroute } from './src/routes/userroutes';
import { router as theatreroute } from './src/routes/theatreroutes';
import { router as movieroute } from './src/routes/movieroutes';
import { router as bookingroute } from './src/routes/bookingroute';
import { router as mailroute } from './src/routes/mailroute';
const app = express();
app.use(cors());

async function connectToMongoDB() {
  mongoose.set('debug', true);
  console.log(config);

  try {
    await mongoose.connect(String(config.mongo.url), {
      retryWrites: true,
      w: 'majority'
    });
    console.log(`Connected to MongoDB`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function startServer() {
  await connectToMongoDB();

  app.use(express.json({ limit: '100mb' }));

  app.use('/', userroute);
  app.use('/theatre', theatreroute);
  app.use('/movie', movieroute);
  app.use('/booking', bookingroute);
  app.use('/mail', mailroute);
  http.createServer(app).listen(config.server.port, () =>
    console.log(`Server is running on port ${config.server.port}`)
  );
}

startServer();
