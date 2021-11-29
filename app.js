const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const axios = require("axios");
// const { createClient } = require("redis");

// (async () => {
//   const client = createClient();

//   client.on("error", (err) => console.log("Redis Client Error", err));

//   await client.connect();

//   await client.set("key", "value");
//   const value = await client.get("key");
//   console.log(value);
// })();

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

app.get("/pay", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/response", async (req, res) => {
  const { transaction_id } = req.query;
  console.log(transaction_id);
  // URL with transaction ID of which will be used to confirm transaction status
  const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;

  // Network call to confirm transaction status
  const response = await axios({
    url,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `${process.env.FLUTTERWAVE_V3_SECRET_KEY}`,
    },
  });

  console.log(response.data.data);
});

app.use("/api", userRoute_VersionOne);

app.listen(PORT, async (req, res) => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.iij5r.mongodb.net/userWalletApp`,
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
