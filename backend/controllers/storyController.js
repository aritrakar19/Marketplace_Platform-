const Story = require('../models/Story');

exports.createStory = async (req, res) => {
  try {
    const { image, caption } = req.body;
    
    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required for a story' });
    }

    const story = new Story({
      userId: req.user._id,
      role: req.user.role,
      image,
      caption
    });

    await story.save();
    
    await story.populate('userId', 'name fullName brandName profileImage');

    res.status(201).json({ success: true, data: story });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getActiveStories = async (req, res) => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() } })
      .populate('userId', 'name fullName brandName profileImage role')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: stories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    
    if (story.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this story' });
    }
    
    await story.deleteOne();
    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.markStoryAsViewed = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    
    // Don't track creator's own views
    if (story.userId.toString() === req.user._id.toString()) {
      return res.json({ success: true, message: 'Own view' });
    }
    
    // Check if user already viewed
    const alreadyViewed = story.viewers.some(v => v.userId.toString() === req.user._id.toString());
    if (!alreadyViewed) {
      story.viewers.push({ userId: req.user._id });
      await story.save();
    }
    
    res.json({ success: true, message: 'Story marked as viewed' });
  } catch (error) {
    console.error('Error viewing story:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.reactToStory = async (req, res) => {
  try {
    const { emoji } = req.body;
    if (!emoji) {
      return res.status(400).json({ success: false, message: 'Emoji is required' });
    }
    
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    
    // Remove existing reaction from this user if any
    story.reactions = story.reactions.filter(r => r.userId.toString() !== req.user._id.toString());
    
    story.reactions.push({ userId: req.user._id, emoji });
    await story.save();
    
    res.json({ success: true, message: 'Reacted to story' });
  } catch (error) {
    console.error('Error reacting to story:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
