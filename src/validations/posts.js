// Importing modules and libraries
const validator = require("validator");
const isObjEmpty = require("./isObjEmpty.js");

// Validate inputs data for post route
const validatePostInputs = ({ category = "", title = "", body = "" }) => {
  let errors = {};

  if (validator.isEmpty(category)) {
    errors.category = "category field is required!";
  }
  if (validator.isEmpty(title)) {
    errors.title = "Post title is required!";
  }
  if (validator.isEmpty(body)) {
    errors.body = "post body can not be empty!";
  }

  return {
    errors,
    isValid: isObjEmpty(errors)
  };
};

module.exports = { validatePostInputs };
