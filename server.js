// Importing modules and libraries
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const passport = require("passport");

const usersRoute = require("./src/routes/api/users");
const categoriesRoute = require("./src/routes/api/categories");
const notFoundRoute = require("./src/routes/notFound");

// Get Env variables
dotenv.config();
const port = process.env.PORT;
const dbUri = process.env.DB_URI;

// Create The app
const app = express();

// Use Middleware
app.use(helmet());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routing
app.use("/api/users", usersRoute);
app.use("/api/cats", categoriesRoute);
app.use("*", notFoundRoute);

// Passport Config
require("./src/passport")(passport);

// Connect MongoDB
mongoose.connect(
  dbUri,
  { useNewUrlParser: true },
  err => {
    if (err) console.log(err);
    console.log("MongoDB connected correctly..");
  }
);

// Start the server and have it listen on port....
app.listen(port, () => console.log(`Server is listening on port: ${port}`));
