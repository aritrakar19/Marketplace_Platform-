const FeedPost = require('../models/FeedPost');

exports.createPost = async (req, res) => {
  try {
    const { caption, images } = req.body;

    if (!caption && (!images || images.length === 0)) {
      return res.status(400).json({ success: false, message: 'Post must contain text or images' });
    }

    const post = new FeedPost({
      userId: req.user._id,
      role: req.user.role,
      caption,
      images: images || []
    });

    await post.save();
    await post.populate('userId', 'name fullName brandName profileImage role');

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await FeedPost.find()
      .populate('userId', 'name fullName brandName profileImage role')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getProfilePosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await FeedPost.find({ userId })
      .populate('userId', 'name fullName brandName profileImage role')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching profile posts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await FeedPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    res.json({ success: true, message: 'Post removed' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
