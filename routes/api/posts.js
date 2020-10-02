const express = require('express')
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

const Post = require('../../models/Post')
const User = require('../../models/User')
const Profile = require('../../models/Profile')

const router = express.Router()

// @route  POST api/posts
// @desc   Create a new post
// @access Private
router.post(
  "/", 
  [
    auth,
    check('text', 'Text is Required')
      .not()
      .isEmpty()
  ], 
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select('-password')

      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      })

      const post = await newPost.save()

      res.json(post)
      
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
)

// @route  GET api/posts
// @desc   GET all posts
// @access Private
router.get("/", auth, async(req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ errors: [{ msg: 'Server Error' }] })
  }
})

// @route  GET api/posts/:post_id
// @desc   GET single post
// @access Private
router.get("/:post_id", auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    if(!post) {
      return res.status(404).json({ msg: "Post Not Found!" })
    }
    res.json(post)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    return res.status(500).json({ errors: [{ msg: 'Server Error' }] })
  }
})

// @route  DELETE api/posts/:post_id
// @desc   DELETE single post
// @access Private
router.delete("/:post_id", auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    if(!post) {
      return res.status(404).json({ msg: "Post Not Found!" })
    }

    // Check if logged-in user is same as post user
    if(post.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "User not Authorized to Delete the Post" })
    }

    await post.remove()

    res.json({ msg: "Post Deleted!" })
    
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    return res.status(500).json({ errors: [{ msg: 'Server Error' }] })
  }
})

// @route  PUT api/posts/:post_id/like
// @desc   Add like to post
// @access Private
router.put("/:post_id/like", auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    if(!post) {
      return res.status(404).json({ msg: "Post Not Found!" })
    }

    // Check if Post is already liked
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: "Post already liked!" })
    }

    post.likes.unshift({ user: req.user.id })
    await post.save()

    res.json(post.likes)

  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    return res.status(500).json({ errors: [{ msg: 'Server Error' }] })
  }
})

// @route  PUT api/posts/:post_id/unlike
// @desc   Remove like from post
// @access Private
router.put("/:post_id/unlike", auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    if(!post) {
      return res.status(404).json({ msg: "Post Not Found!" })
    }

    // Check if Post is not liked
    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: "Post not liked yet to unlike!" })
    }

    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
    if(removeIndex < 0) {
      return res.status(400).json({ msg: "No User Like Found!"})
    }

    post.likes.splice(removeIndex, 1)

    await post.save()

    res.json(post.likes)

  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    return res.status(500).json({ errors: [{ msg: 'Server Error' }] })
  }
})

module.exports = router