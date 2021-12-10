const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const axios = require("axios");

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// user routes
const userRoute_VersionOne = require("./routes/index");

const { PORT, DB_USERNAME, DB_PASSWORD } = process.env;

app.get("/", (req, res) => {
  res.send("The main entry application");
});

app.use("/api", userRoute_VersionOne);

app.listen(PORT, async (req, res) => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.iij5r.mongodb.net/bankingAPI_Service`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Database is connected");
  } catch (error) {
    console.log(`Database Not Connected`);
  }
  console.log(`The app is running on PORT ${PORT}`);
});

module.exports = app;
