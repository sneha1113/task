require("dotenv").config({ path: "./.env" })

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const MONGO_URL = process.env.MONGO_URL;


const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 5000;

export const config = {
  mongo: {
    username: USERNAME,
    password: PASSWORD,
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
  },
};