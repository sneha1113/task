import { Response, Request } from "express";
const nodemailer = require("nodemailer");

const sendingmail = async (req: Request, res: Response) => {
  const {
    gmail,
    theatreName,
    theatreLocation,
    screenNumber,
    className,
    cost,
    numberOfSeats,
    showtime,
    movieName,
    seatNumber,
  } = req.body;
  const MAIL_USER = "travelasone11@gmail.com";
  const MAIL_PASS = "kemngzkyqsocdimb";
  const MAIL_FROM = "travelasone11@gmail.com";

  const transport = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
  
  const emailContent = `
    <div className="email" style="
        border: 1px solid black;
        padding: 10px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
    ">
        <h2>TICKET RECEIPT!</h2>
        <p>Theatre Name: ${theatreName}</p>
        <p>Theatre Location: ${theatreLocation}</p>
        <p>Screen Number: ${screenNumber}</p>
        <p>Class Name: ${className}</p>
        <p>Class Cost: ${cost}</p>
        <p>Number of Seats: ${numberOfSeats}</p>
        <p>Showtime: ${showtime}</p>
        <p>Movie Name: ${movieName}</p>
        <p>Seat Number: ${seatNumber}</p>
    </div>
  `;

  await transport.sendMail({
    from: MAIL_FROM,
    to: gmail,
    subject: "TICKET RECEIPT",
    html: emailContent,
  });
  
  res.header("Access-Control-Allow-Origin", "*");
  return res.send("Mail Successfully sent");
};

export const testpasser = {
  sendingmail,
};
