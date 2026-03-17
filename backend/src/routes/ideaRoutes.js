const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/ideaController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createIdea)
  .get(getIdeas);

router.get('/trending', getTrendingIdeas);
router.get('/archived', getArchivedIdeas);
router.get('/archived/mine', protect, getMyArchivedIdeas);
router.get('/mine', protect, getMyIdeas);

router.route('/:id')
  .get(getIdea)
  .put(protect, updateIdea)
  .delete(protect, deleteIdea);

router.patch('/:id/visibility', protect, toggleVisibility);
router.post('/:id/upvote', protect, upvoteIdea);

module.exports = router;
