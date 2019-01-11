// Importing modules and libraries
const validator = require("validator");
const isObjEmpty = require("./isObjEmpty.js");

// Validate inputs data for tag route
const validateTagInputs = ({ name = "" }) => {
  let errors = {};

  if (validator.isEmpty(name)) {
    errors.name = "Tag name is required!";
  }

  return {
    errors,
    isValid: isObjEmpty(errors)
  };
};

module.exports = { validateTagInputs };
