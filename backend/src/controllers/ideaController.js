const Idea = require('../models/Idea');

// @desc    Create new idea
// @route   POST /api/ideas
// @access  Private
const createIdea = async (req, res) => {
  try {
    const { title, problemStatement, category, difficultyScore, marketPotential, expiryHours } = req.body;

    let expiryTime;
    if (expiryHours !== undefined && expiryHours !== null && expiryHours !== '') {
      expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + parseInt(expiryHours, 10));
    }

    const idea = await Idea.create({
      title,
      problemStatement,
      category,
      difficultyScore,
      marketPotential,
      expiryTime,
      userId: req.user._id,
    });

    res.status(201).json(idea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

async function archiveExpiredIdeas() {
  const now = new Date();
  await Idea.updateMany(
    { expiryTime: { $lte: now }, isArchived: false },
    { isArchived: true },
  );
}

// @desc    Get all active ideas
// @route   GET /api/ideas
// @access  Public
const getIdeas = async (req, res) => {
  try {
    await archiveExpiredIdeas();
    const ideas = await Idea.find({ visibilityStatus: 'active', isArchived: false }).sort({ createdAt: -1 });
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's ideas (active + hidden)
// @route   GET /api/ideas/mine
// @access  Private
const getMyIdeas = async (req, res) => {
  try {
    await archiveExpiredIdeas();
    const ideas = await Idea.find({ userId: req.user._id, isArchived: false }).sort({ createdAt: -1 });
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single idea (increment views)
// @route   GET /api/ideas/:id
// @access  Public
const getIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Increment views
    idea.views += 1;
    await idea.save();

    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update idea
// @route   PUT /api/ideas/:id
// @access  Private
const updateIdea = async (req, res) => {
  try {
    let idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Check if owner
    if (idea.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this idea' });
    }

    const { title, problemStatement, category, difficultyScore, marketPotential } = req.body;

    idea = await Idea.findByIdAndUpdate(req.params.id, {
      title,
      problemStatement,
      category,
      difficultyScore,
      marketPotential,
    }, { new: true, runValidators: true });

    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete idea
// @route   DELETE /api/ideas/:id
// @access  Private
const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Check if owner
    if (idea.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this idea' });
    }

    await idea.deleteOne();

    res.status(200).json({ message: 'Idea removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle visibility
// @route   PATCH /api/ideas/:id/visibility
// @access  Private
const toggleVisibility = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Check if owner
    if (idea.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    idea.visibilityStatus = idea.visibilityStatus === 'active' ? 'hidden' : 'active';
    await idea.save();

    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upvote idea
// @route   POST /api/ideas/:id/upvote
// @access  Private
const upvoteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Optional: Prevent multiple upvotes
    if (idea.upvotedBy.includes(req.user._id)) {
      // Remove upvote (toggle behavior) or just return error
      // Let's implement toggle behavior
      idea.upvotedBy = idea.upvotedBy.filter(id => id.toString() !== req.user._id.toString());
      idea.upvotes -= 1;
    } else {
      idea.upvotedBy.push(req.user._id);
      idea.upvotes += 1;
    }

    await idea.save();

    res.status(200).json({ upvotes: idea.upvotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending ideas
// @route   GET /api/ideas/trending
// @access  Public
const getTrendingIdeas = async (req, res) => {
  try {
    await archiveExpiredIdeas();
    const ideas = await Idea.find({ visibilityStatus: 'active', isArchived: false });
    
    // Sort by virtual ideaScore
    const trending = ideas.sort((a, b) => b.ideaScore - a.ideaScore);

    res.status(200).json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get archived ideas
// @route   GET /api/ideas/archived
// @access  Public
const getArchivedIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ isArchived: true }).sort({ createdAt: -1 });
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's archived ideas
// @route   GET /api/ideas/archived/mine
// @access  Private
const getMyArchivedIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ userId: req.user._id, isArchived: true }).sort({ createdAt: -1 });
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIdea,
  getIdeas,
  getMyIdeas,
  getIdea,
  updateIdea,
  deleteIdea,
  toggleVisibility,
  upvoteIdea,
  getTrendingIdeas,
  getArchivedIdeas,
  getMyArchivedIdeas,
};
