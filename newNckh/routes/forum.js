const express = require('express');
const router = express.Router();
const { getAllApprovedPosts, getPostById, createPost, updatePost, deletePost, addComment, getCommentsByPostId, editComment, deleteComment, approvePost, upload } = require('../controllers/forumController');

// Route to get all approved posts
router.get('/posts', getAllApprovedPosts);

// Route to get a post by ID
router.get('/posts/:id', getPostById);

// Route to create a new post
router.post('/posts', upload.single('image'), createPost);

// Route to update a post by ID
router.put('/posts/:id', updatePost);

// Route to delete a post by ID
router.delete('/posts/:id', deletePost);

// Route to add a comment to a post
router.post('/posts/:id/comments', addComment);

// Route to get comments for a specific post
router.get('/posts/:id/comments', getCommentsByPostId);

// Route to edit a comment
router.put('/comments/:commentId', editComment);

// Route to delete a comment
router.delete('/comments/:commentId', deleteComment);

// Route to approve a post
router.put('/posts/:id/approve', approvePost);

module.exports = router;
