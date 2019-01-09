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

// @route       api/users/test
// @method      GET
// @access      Public
// Description  Test users route
router.get("/test", (req, res) => {
  res.send("<h1>Test Users Route</h1>");
});

// @route       api/users/register
// @method      POST
// @access      Public
// Description  Adding new user
router.post("/register", (req, res) => {
  let { errors, isValid } = validateRegisterInputs(req.body);
  if (!isValid) return res.status(400).json(errors);
  // Check if the username is exist
  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      errors.username = "username already exist";
      return res.status(400).json(errors);
    }
    // Check if the Email is exist
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        errors.email = "email already exist";
        return res.status(400).json(errors);
      }

      let newUser = new User({
        username: req.body.username,
        email: req.body.email
      });
      // Generate hashed password
      const hashPassword = async () => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        newUser.password = hash;
        // Save the new user in the database
        newUser.save(err => {
          if (err) return res.status(400).json({ msg: err.message });
          res.json({ msg: "Success" });
        });
      };
      hashPassword();
    });
  });
});

// @route       api/users/login
// @method      POST
// @access      Public
// Description  Login
router.post("/login", (req, res) => {
  let { errors, isValid } = validateLoginInputs(req.body);
  if (!isValid) return res.status(400).json(errors);
  let username = req.body.username || "";
  let email = req.body.email || "";
  User.findOne({
    $or: [{ username }, { email }]
  })
    .then(user => {
      if (!user) {
        errors.username =
          "user not found, please re-check your username and password";
        return res.status(400).json(errors);
      }
      // Compare passwords
      const compare = async () => {
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
        jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({ msg: "Success", token: `Bearer ${token}` });
        });
      };
      compare();
    })
    .catch(err => console.log(err));
});

// @route       api/users/delete/userId
// @method      delete
// @access      Private
// Description  Delete user
router.delete(
  "/delete/:userId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.deleteOne({ _id: req.params.userId }, (err, data) => {
      if (err) return res.status(400).json({ msg: "user not found" });
      res.json({ msg: "success" });
    });
  }
);

// Exporting users router
module.exports = router;
