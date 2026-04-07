const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { firebaseUid, name, email, role, category } = req.body;

    // Validate required fields
    if (!firebaseUid || !name || !email || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Check if user already exists based on firebaseUid
    let user = await User.findOne({ firebaseUid });

    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Create user in MongoDB
    user = await User.create({
      firebaseUid,
      name,
      email,
      role,
      category
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // req.user.firebaseUid is attached by verifyFirebaseToken middleware
    const user = await User.findOne({ firebaseUid: req.user.firebaseUid });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in database' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.firebaseUid });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, fullName, displayName, category, subCategory, bio, location, followers, engagementRate, portfolio, instagram, youtube, twitter, tiktok, profileImage } = req.body;

    user.name = name || user.name;
    user.profileImage = profileImage || user.profileImage;
    user.fullName = fullName || user.fullName;
    user.displayName = displayName || user.displayName;
    user.category = category || user.category;
    user.subCategory = subCategory || user.subCategory;
    user.bio = bio || user.bio;
    user.location = location || user.location;
    user.followers = followers || user.followers;
    user.engagementRate = engagementRate || user.engagementRate;
    user.portfolio = portfolio || user.portfolio;
    user.socialMedia = {
      instagram: instagram || user.socialMedia?.instagram || '',
      youtube: youtube || user.socialMedia?.youtube || '',
      twitter: twitter || user.socialMedia?.twitter || '',
      tiktok: tiktok || user.socialMedia?.tiktok || ''
    };

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during profile update' });
  }
};

// @desc    Get all talents from MongoDB
// @route   GET /api/talents
// @access  Private
const getAllTalents = async (req, res) => {
  try {
    const talents = await User.find({ role: 'talent' });
    res.status(200).json({ success: true, data: talents });
  } catch (error) {
    console.error('Fetch talents error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching talents' });
  }
};

// @desc    Get a single talent by ID
// @route   GET /api/talents/:id
// @access  Private
const getTalentById = async (req, res) => {
  try {
    const talent = await User.findOne({ _id: req.params.id, role: 'talent' });
    if (!talent) {
      return res.status(404).json({ success: false, message: 'Talent not found' });
    }
    res.status(200).json({ success: true, data: talent });
  } catch (error) {
    console.error('Fetch talent by ID error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching talent details' });
  }
};

// @desc    Get all brands from MongoDB
// @route   GET /api/brands
// @access  Private
const getAllBrands = async (req, res) => {
  try {
    const brands = await User.find({ role: 'brand' });
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    console.error('Fetch brands error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching brands' });
  }
};

module.exports = {
  registerUser,
  getUserProfile,
  updateUserProfile,
  getAllTalents,
  getTalentById,
  getAllBrands
};
