// Importing modules and libraries
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../../models/User");
const {
  validateRegisterInputs,
  validateLoginInputs
} = require("../../validations/users");

// Get Env variables
require("dotenv").config();
const secretOrKey = process.env.SECRET_OR_KEY;

// @route       api/users/register
// @method      POST
// @access      Public
// Description  Adding new user
router.post("/register", async (req, res) => {
  let { errors, isValid } = validateRegisterInputs(req.body);
  if (!isValid) return res.status(400).json(errors);
  try {
    // Check if the username is exist
    let user = await User.findOne({ username: req.body.username });
    if (user) {
      errors.username = "username already exist";
      return res.status(400).json(errors);
    }
    // Check if the Email is exist
    user = await User.findOne({ email: req.body.email });
    if (user) {
      errors.email = "email already exist";
      return res.status(400).json(errors);
    }
    let newUser = new User({
      username: req.body.username,
      email: req.body.email
    });
    // Generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    newUser.password = hash;
    // Save the new user in the database
    let generatedUser = await newUser.save();
    res.json({
      id: generatedUser._id,
      date: generatedUser.date,
      username: generatedUser.username,
      email: generatedUser.email
    });
  } catch (error) {
    res.status(500).json({ msg: "Unknown Server Error" });
  }
});

// @route       api/users/login
// @method      POST
// @access      Public
// Description  Login
router.post("/login", async (req, res) => {
  let { errors, isValid } = validateLoginInputs(req.body);
  if (!isValid) return res.status(400).json(errors);
  let username = req.body.username || "";
  let email = req.body.email || "";
  try {
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      errors.username =
        "user not found, please re-check your username or email";
      return res.status(400).json(errors);
    }
    // Compare passwords
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      errors.password = "wrong password!";
      return res.status(400).json(errors);
    }
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      date: user.date
    };
    const token = await jwt.sign(payload, secretOrKey, { expiresIn: 3600 });
    res.json({ msg: "Success", token: `Bearer ${token}` });
  } catch (error) {
    res.status(500).json({ msg: "Unknown Server Error" });
  }
});

// @route       api/users/delete/userId
// @method      delete
// @access      Private
// Description  Delete user
router.delete(
  "/delete/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await User.findOneAndDelete({ _id: req.params.userId });
      res.json({ msg: "success" });
    } catch (error) {
      // When user doesn't exist it return error
      res.status(400).json({ msg: "user not found!" });
    }
  }
);

// Exporting users router
module.exports = router;
