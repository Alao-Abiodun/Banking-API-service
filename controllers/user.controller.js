const User = require("../models/user.model");
const Response = require("../lib/response");
// const client = require("../middleware/redis");
const Error = require("../lib/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const redis = require("redis");

dotenv.config();

const client = redis.createClient({ port: 6379 });
client.on("error", (error) => console.error(error));

const { TOKEN } = process.env;

// GET ALL USERS IN THE SYSTEM
exports.fetchUsers = async (req, res) => {
  try {
    //   let userList = await client.get("users");
    //   if (userList) {
    //     Response(res).success({ data: JSON.parse(userList) }, 200, {
    //       meta_data: "from cache",
    //     });
    //   } else {
    //     const users = await User.find({});
    //     client.set("users", JSON.stringify(users));
    //     Response(res).success({ users }, 200, { meta_data: "from server" });
    //   }

    const users = await User.find({});
    Response(res).success({ users }, 200);
  } catch (error) {
    console.log(error);
    Response(res).error(error.message, error.code);
  }
};

// GET THE COUNT OF USERS
exports.userCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    // let userCount = await client.get("");
    Response(res).success({ userCount }, 200);
  } catch (error) {
    Response(res).error(error.message, error.code);
  }
};

exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!(firstname && lastname && email && password)) {
      throw Error("All field is required", "BAD REQUEST", 401);
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      throw Error("User already exists", "BAD REQUEST", 401);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashPassword,
    });
    const token = await jwt.sign(
      { _id: newUser._id, email: newUser.email },
      TOKEN,
      { expiresIn: "2h" }
    );
    newUser.token = token;
    Response(res).success({ newUser, token }, 201);
  } catch (error) {
    console.log(error);
    Response(res).error(error.message, error.code);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw Error("Please fill in the required field", "BAD REQUEST", 401);
    }

    const existingUser = await User.findOne({ email });
    if (
      existingUser &&
      (await bcrypt.compare(password, existingUser.password))
    ) {
      const token = await jwt.sign(
        { _id: existingUser._id, email: existingUser.email },
        TOKEN,
        { expiresIn: "2h" }
      );
      existingUser.token = token;
      return Response(res).success({ existingUser, token }, 200);
    }
    throw Error("Invalid Credentials", "BAD REQUEST", 401);
  } catch (error) {
    console.log(error);
    Response(res).error(error.message, error.code);
  }
};
