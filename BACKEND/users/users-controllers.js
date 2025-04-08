const express = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json({ users: users.map((u) => u.toObject({ getters: true })) });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users." });
  }
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Invalid inputs passed, please check your data." });
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signing up failed, please try agai later." });
  }

  if (existingUser) {
    return res
      .status(422)
      .json({ message: "Could not create user, email already exists." });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Could not create a user, please try again later." });
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
  } catch (err) {
    return res.status(500).json({ message: "Error creating user" });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res.status(500).json({ message: "Error creating user" });
  }

  res
    .status(201)
    .json({ userId: newUser.id, email: newUser.email, token: token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Invalid inputs passed, please check your data." });
  }

  let loggedUser;
  try {
    loggedUser = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Logging failed, please try it later." });
  }

  if (!loggedUser) {
    return res
      .status(403)
      .json({ message: "Invalid credentials, could not log you in." });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, loggedUser.password);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Could not login a user, please try again later." });
  }

  if (!isValidPassword) {
    return res
      .status(403)
      .json({ message: "Invalid credentials, could not log you in." });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: loggedUser.id, email: loggedUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Logging in failed, please try again later." });
  }

  res.json({ userId: loggedUser.id, email: loggedUser.email, token: token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
