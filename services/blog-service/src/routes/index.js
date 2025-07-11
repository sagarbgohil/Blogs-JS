const express = require('express');
const { createBlog, getBlogs, likeBlog, addComment } = require('../controllers/blogController');

const router = express.Router();

router.post('/', createBlog);
router.get('/', getBlogs);
router.post('/:id/like', likeBlog);
router.post('/:id/comment', addComment);

module.exports = router;
