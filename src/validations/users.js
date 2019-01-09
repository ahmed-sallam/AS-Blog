// Importing modules and libraries
const validator = require("validator");
const isObjEmpty = require("./isObjEmpty.js");

// Validate inputs data for register route
const validateRegisterInputs = ({
  username = "",
  email = "",
  password = "",
  password2 = ""
}) => {
  let errors = {};

  if (validator.isEmpty(username)) {
    errors.username = "username filed is required!";
  }
  if (validator.isEmpty(email)) {
    errors.email = "email filed is required!";
  } else if (!validator.isEmail(email)) {
    errors.email = "please enter valid email!";
  }
  if (validator.isEmpty(password)) {
    errors.password = "password filed is required!";
  } else if (!validator.isLength(password, { min: 6 })) {
    errors.password = "password should be more than 6 char!";
  }
  if (validator.isEmpty(password2)) {
    errors.password2 = "password2 filed is required!";
  } else if (!validator.equals(password, password2)) {
    errors.password2 = "Passwords don't matches!";
  }

  return {
    errors,
    isValid: isObjEmpty(errors)
  };
};

// Validate inputs data for login route
const validateLoginInputs = ({ username = "", email = "", password = "" }) => {
  let errors = {};

  if (validator.isEmpty(username) && validator.isEmpty(email)) {
    errors.username = "please login with username or email!";
  }

  if (validator.isEmpty(password)) {
    errors.password = "password filed is required!";
  }

  return {
    errors,
    isValid: isObjEmpty(errors)
  };
};

module.exports = { validateRegisterInputs, validateLoginInputs };
