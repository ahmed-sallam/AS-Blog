// Importing modules and libraries
const router = require("express").Router();
const passport = require("passport");
const User = require("../../models/User");
const Category = require("../../models/Category");
const { validateCategoryInputs } = require("../../validations/categories");

// @route       api/cats/new
// @method      POST
// @access      Private
// Description  Adding new category
router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let { errors, isValid } = validateCategoryInputs(req.body);
    if (!isValid) return res.status(400).json(errors);
    try {
      let cat = await Category.findOne({ name: req.body.name });
      if (cat) {
        errors.name = "The category is already exist!";
        return res.status(400).json(errors);
      }
      let newCategory = new Category({
        name: req.body.name,
        description: req.body.description
      });
      if (req.body.parentCategory)
        newCategory.parentCategory = req.body.parentCategory;
      let generatedCat = await newCategory.save();
      res.json({
        id: generatedCat._id,
        name: generatedCat.name,
        description: generatedCat.description,
        parentCategory: generatedCat.parentCategory
      });
    } catch (error) {
      res.status(500).json({ msg: "Unknown Server Error" });
    }
  }
);

// @route       api/cats/get/catId
// @method      GET
// @access      Public
// Description  Get category by its Id
router.get("/get/:catId", async (req, res) => {
  try {
    let cat = await Category.findById(req.params.catId);
    res.json(cat);
  } catch (error) {
    res.status(400).json({ msg: "Category not found!" });
  }
});

// @route       api/cats/get-all
// @method      GET
// @access      Public
// Description  Get all categories
router.get("/get-all", async (req, res) => {
  try {
    let cats = await Category.find();
    res.json(cats);
  } catch (error) {
    res.status(500).json({ msg: "Unknown Server Error" });
  }
});

// @route       api/cats/delete/:catId
// @method      DELETE
// @access      Private
// Description  Delete category by its Id.
router.delete(
  "/delete/:catId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Category.deleteMany({
        $or: [{ _id: req.params.catId }, { parentCategory: req.params.catId }]
      });
      res.json({ msg: "success" });
    } catch (error) {
      res.status(400).json({ msg: "Category not found" });
    }
  }
);

// @route       api/cats/edit/:catId
// @method      PUT
// @access      Private
// Description  Edit category by its Id.
router.put(
  "/edit/:catId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let { errors, isValid } = validateCategoryInputs(req.body);
    if (!isValid) return res.status(400).json(errors);
    let updatedCat = { name: req.body.name };
    if (req.body.description) updatedCat.description = req.body.description;
    if (req.body.parentCategory)
      updatedCat.parentCategory = req.body.parentCategory;
    try {
      await Category.findOneAndUpdate({ _id: req.params.catId }, updatedCat);
      res.json({ msg: "Success" });
    } catch (error) {
      res.status(400).json({ msg: "Category not found!" });
    }
  }
);

// Exporting categories router
module.exports = router;
