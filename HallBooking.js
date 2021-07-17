require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uniqid = require("uniqid");

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Running on the port ${port}`));

let rooms = [];
let roomNo = 100;
let bookings = [];
let date = /^(0[1-9] |1[0-2])\/0[1-9]|1\d|2\d|3\[01]\/(19 | 20)\d{2}$/;
let Time = /^(0[0-9]|1\d|2[0-3])\:(00)/;

app.get("/", (req, res) => {
  res.json({ message: "Starting Page" });
});

app.get("/getAllRooms", (req, res) => {
  res.json({ message: rooms });
});

app.get("/getAllBoking", (req, res) => {
  res.json({ message: bookings });
});

app.post("/createRoom", (req, res) => {
  let room = {};
  room.id = uniqid();
  room.roomNo = roomNo;
  room.bookings = [];
  if (req.body.noSeats) {
    room.noSeats = req.body.noSeats;
  } else {
    res.status(400).json({ message: "Please specify the no of seats " });
  }
  if (req.body.amenties) {
    room.amenties = req.body.amenties;
  } else {
    res.status(400).json({ message: "Please specify amenties " });
  }
  if (req.body.price) {
    room.price = req.body.price;
  } else {
    res.status(400).json({ message: "Please specify cost/hour " });
  }
  rooms.push(room);
  roomNo++;
  res.status(200).json({ message: "Room created Successfully" });
});

app.post("/createBooking", (req, res) => {
  let Booking = {};
  Booking.id = uniqid();
  if (req.body.customerName) {
    Booking.customerName = req.body.customerName;
  } else {
    res.status(400).json({ message: "Customer name needed" });
  }
  if (req.body.date) {
    if (date.test(req.body.date)) {
      Booking.date = req.body.date;
    } else {
      res.status(400).json({ message: "Date in format of MM/DD/YYYY" });
    }
  } else {
    res.status(400).json({ message: "Date is must" });
  }

  if (req.body.startTime) {
    if (Time.test(req.body.startTime)) {
      Booking.startTime = req.body.startTime;
    } else {
      res.status(400).json({
        output:
          "Please specify time in hh:min(24-hr format) where minutes should be 00 only",
      });
    }
  } else {
    res
      .status(400)
      .json({ output: "Please specify Starting time for booking." });
  }

  if (req.body.endTime) {
    if (Time.test(req.body.endTime)) {
      Booking.endTime = req.body.endTime;
    } else {
      res.status(400).json({
        output:
          "Please specify time in hh:min(24-hr format) where minutes should be 00 only",
      });
    }
  } else {
    res.status(400).json({ output: "Please specify Ending time for booking." });
  }

  const availableRooms = rooms.filter((room) => {
    if (room.bookings.length == 0) {
      return true;
    } else {
      room.bookings.filter((book) => {
        if (book.date == req.body.date) {
          if (
            parseInt(book.startTime.substring(0, 1)) >
              parseInt(req.body.startTime.substring(0, 1)) &&
            parseInt(book.startTime.substring(0, 1)) >
              parseInt(req.body.endTime.substring(0, 1))
          ) {
            if (
              parseInt(book.startTime.substring(0, 1)) <
                parseInt(req.body.startTime.substring(0, 1)) &&
              parseInt(book.startTime.substring(0, 1)) <
                parseInt(req.body.endTime.substring(0, 1))
            ) {
              return true;
            }
          }
        } else {
          return true;
        }
      });
    }
  });
  if (availableRooms.length == 0) {
    res
      .status(400)
      .json({ output: "No Available Rooms on Selected Date and Time" });
  } else {
    roomRec = availableRooms[0];
    let count = 0;
    rooms.forEach((element) => {
      if (element.roomNo == roomRec.roomNo) {
        rooms[count].bookings.push({
          custName: req.body.custName,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          date: req.body.date,
        });
      }
      count++;
    });
    let bookingRec = req.body;
    bookingRec.roomNo = roomRec.roomNo;
    bookingRec.cost =
      parseInt(roomRec.price) *
      (parseInt(bookingRec.endTime.substring(0, 1)) -
        parseInt(bookingRec.startTime.substring(0, 1)));

    bookings.push(bookingRec);
    res.status(200).json({ output: "Room Booking Successfully" });
  }
});
