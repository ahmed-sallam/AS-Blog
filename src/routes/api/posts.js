// Importing modules and libraries
const router = require("express").Router();
const passport = require("passport");
const User = require("../../models/User");
const Tag = require("../../models/Tag");
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const { validatePostInputs } = require("../../validations/posts");

// @route       api/posts/new
// @method      POST
// @access      Private
// Description  Adding new post
router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let { errors, isValid } = validatePostInputs(req.body);
    if (!isValid) return res.status(400).json(errors);
    try {
      let post = new Post({
        user: req.user.id,
        title: req.body.title,
        body: req.body.body
      });
      await Category.findOne({ _id: req.body.category });
      post.category = req.body.category;
      if (req.body.tags) {
        let tags = req.body.tags.split(",");
        post.tags = tags;
        let tagsId = tags.map(t => ({
          _id: t
        }));
        await Tag.find({ $or: [...tagsId] });
      }
      let generatedPost = await post.save();
      res.json(generatedPost);
    } catch (error) {
      if (error.model.modelName) {
        switch (error.model.modelName) {
          case "categories":
            return res.status(400).json({ category: "category not found!" });
          case "tags":
            return res.status(400).json({ tags: "some tags not found!" });
          default:
            return res.status(400).json({ post: "Post not found!" });
        }
      }
      return res.status(500).json({ msg: "Unknown Server Error" });
    }
  }
);

// @route       api/posts/get/postId
// @method      GET
// @access      Public
// Description  Get post by its id
router.get("/get/:postId", async (req, res) => {
  try {
    let post = await Post.findOne({ _id: req.params.postId });
    res.json(post);
  } catch (error) {
    if (error.model.modelName) {
      return res.status(400).json({ post: "Post not found!" });
    }
    return res.status(500).json({ msg: "Unknown Server Error" });
  }
});

// @route       api/posts/get-all
// @method      GET
// @access      Public
// Description  Get all posts
router.get("/get-all", async (req, res) => {
  try {
    let posts = await Post.find({});
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: "Unknown Server Error" });
  }
});

// @route       api/posts/delete/postId
// @method      DELETE
// @access      Private
// Description  Delete post by its id.
router.delete(
  "/delete/:postId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Post.findOneAndDelete({ _id: req.params.postId });
      res.json({ msg: "Success" });
    } catch (error) {
      if (error.model.modelName) {
        return res.status(400).json({ post: "Post not found!" });
      }
      return res.status(500).json({ msg: "Unknown Server Error" });
    }
  }
);

// @route       api/posts/edit/postId
// @method      PUT
// @access      Private
// Description  Edit post by its id.
router.put(
  "/edit/:postId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let { errors, isValid } = validatePostInputs(req.body);
    if (!isValid) return res.status(400).json(errors);
    try {
      let updatedPost = {
        title: req.body.title,
        body: req.body.body
      };
      await Category.findOne({ _id: req.body.category });
      updatedPost.category = req.body.category;
      if (req.body.tags) {
        let tags = req.body.tags.split(",");
        updatedPost.tags = tags;
        let tagsId = tags.map(t => ({
          _id: t
        }));
        await Tag.find({ $or: [...tagsId] });
      }
      await Post.findOneAndUpdate({ _id: req.params.postId }, updatedPost);
      res.json({ msg: "Success" });
    } catch (error) {
      if (error.model.modelName) {
        switch (error.model.modelName) {
          case "categories":
            return res.status(400).json({ category: "category not found!" });
          case "tags":
            return res.status(400).json({ tags: "some tags not found!" });
          default:
            return res.status(400).json({ post: "Post not found!" });
        }
      }
      return res.status(500).json({ msg: "Unknown Server Error" });
    }
  }
);

// Exporting posts router
module.exports = router;
