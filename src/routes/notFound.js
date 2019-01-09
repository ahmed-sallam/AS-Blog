// Importing modules and libraries
const router = require("express").Router();

router.get("*", (req, res) => {
  res.status(404).json({ msg: "Not Found!" });
});

// Exporting 404 router
module.exports = router;
