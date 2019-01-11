// Importing modules and libraries
const router = require("express").Router();
const passport = require("passport");
const Tag = require("../../models/Tag");
const { validateTagInputs } = require("../../validations/tags");

// @route       api/tags/new
// @method      POST
// @access      Private
// Description  Adding new tag
router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let { errors, isValid } = validateTagInputs(req.body);
    if (!isValid) return res.status(400).json(errors);
    try {
      let newTag = new Tag({
        name: req.body.name
      });
      if (req.body.description) newTag.description = req.body.description;
      let generatedTag = await newTag.save();
      res.json(generatedTag);
    } catch (error) {
      res.status(500).json({ msg: "Unknown Server Error" });
    }
  }
);

// @route       api/tags/get/tagId
// @method      GET
// @access      Public
// Description  Get tag by its id
router.get("/get/:tagId", async (req, res) => {
  try {
    let tag = await Tag.findOne({ _id: req.params.tagId });
    res.json(tag);
  } catch (error) {
    if (error.model.modelName) {
      return res.status(400).json({ tag: "Tag not found!" });
    }
    return res.status(500).json({ msg: "Unknown Server Error" });
  }
});

// @route       api/tags/get-all
// @method      GET
// @access      Public
// Description  Get all tags
router.get("/get-all", async (req, res) => {
  try {
    let tags = await Tag.find({});
    res.json(tags);
  } catch (error) {
    res.status(500).json({ msg: "Unknown Server Error" });
  }
});

// @route       api/tags/edit/tagId
// @method      PUT
// @access      Private
// Description  Edit tag by its id.
router.put(
  "/edit/:tagId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let { errors, isValid } = validateTagInputs(req.body);
    if (!isValid) return res.status(400).json(errors);
    let updatedTag = { name: req.body.name };
    if (req.body.description) updatedTag.description = req.body.description;
    try {
      await Tag.findOneAndUpdate({ _id: req.params.tagId }, updatedTag);
      res.json({ msg: "success" });
    } catch (error) {
      if (error.model.modelName) {
        return res.status(400).json({ tag: "Tag not found!" });
      }
      return res.status(500).json({ msg: "Unknown Server Error" });
    }
  }
);

// @route       api/tags/delete/tagId
// @method      DELETE
// @access      Private
// Description  Delete tag by its id.
router.delete(
  "/delete/:tagId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Tag.findOneAndDelete({ _id: req.params.tagId });
      res.json({ msg: "Success" });
    } catch (error) {
      if (error.model.modelName) {
        return res.status(400).json({ tag: "Tag not found!" });
      }
      return res.status(500).json({ msg: "Unknown Server Error" });
    }
  }
);

// Exporting tags router
module.exports = router;
