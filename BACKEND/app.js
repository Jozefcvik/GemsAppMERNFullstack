const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// MongoDB connection URL
const dbURL = `${process.env.DB_URL}/${process.env.DB_NAME}`; // Local MongoDB URL

const app = express();

const gemsRoutes = require("./gems/gems-routes.js");

const usersRoutes = require("./users/users-routes.js");

// Middleware to parse JSON requests
app.use(bodyParser.json());

// CORS Backend Frontend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", `${process.env.FRONTEND_URL}`); // it's only for browsers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE"
  );
  next();
});

app.use("/api/gems", gemsRoutes);
app.use("/api/users", usersRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

// Connect to MongoDB using Mongoose
mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.BACKEND_PORT, () => {
      console.log(`Server is running on ${process.env.BACKEND_URL}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
