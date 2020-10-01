const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route  GET api/profile/me
// @desc   Get Current User Profile
// @access Private
router.get("/me", auth, async(req, res) => {
  try {
    const profile = await Profile
      .findOne({ user: req.user.id })
      .populate('user', [ 'name', 'avatar' ])

    if(!profile) {
      return res.status(400).json({ msg: 'Profile not Found for the User' })
    }

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ errors: [{ msg: "Server Error" }] }) 
  }
})

// @route  POST api/profile
// @desc   Add | Create | Update user's profile
// @access Private
router.post(
  "/", 
  [ 
    auth,
    check('status', 'Status is Required')
      .not()
      .isEmpty(),
    check('skills', 'Skills is Required')
      .not()
      .isEmpty()
  ], 
  async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { 
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body 

    // Build Profile Object
    const profileFields = {}
    profileFields.user = req.user.id
    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    if(bio) profileFields.bio = bio
    if(status) profileFields.status = status
    if(githubusername) profileFields.githubusername = githubusername
    if(skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim())
    }

    // Build Social Object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube
    if(facebook) profileFields.social.facebook = facebook
    if(instagram) profileFields.social.instagram = instagram
    if(twitter) profileFields.social.twitter = twitter
    if(linkedin) profileFields.social.linkedin = linkedin
    
    try {
      let profile = await Profile.findOne({ user: req.user.id })
      // If profile => Update
      if(profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id }, 
          { $set: profileFields },
          { new: true }
        )

        return res.json(profile)
      }
      // Else => Add New
      profile = new Profile(profileFields)
      await profile.save()

      return res.json(profile)
    } catch (err) {
      console.error(err.message)
      return res.status(500).json({ errors: [{ msg: "Server Error" }] }) 
    }
  }
)

// @route  GET api/profile
// @desc   Get all profiles
// @access Public
router.get("/", async(req, res) => {
  try {
    const profiles = await Profile.find().populate('user', [ 'name', 'avatar' ])
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ errors: [{ msg: "Server Error" }] })  
  }
})

// @route  GET api/profile/user/:user_id
// @desc   Get a user's profile
// @access Public
router.get("/user/:user_id", async(req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', [ 'name', 'avatar' ])
    if(!profile) {
      return res.status(400).json({ msg: "Profile Not Found" })
    }

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if(err.kind === 'ObjectId') {
      return res.status(400).json({ msg: "Profile Not Found" })
    }
    return res.status(500).json({ errors: [{ msg: "Server Error" }] })  
  }
})

module.exports = router