// Importing modules and libraries
const validator = require("validator");
const isObjEmpty = require("./isObjEmpty.js");

// Validate inputs data for register route
const validateCategoryInputs = ({ name = "" }) => {
  let errors = {};

  if (validator.isEmpty(name)) {
    errors.name = "Category name is required!";
  }

  return {
    errors,
    isValid: isObjEmpty(errors)
  };
};

module.exports = { validateCategoryInputs };
