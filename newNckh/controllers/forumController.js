const { poolPromise, sql } = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Lấy danh sách bài viết
const getAllPosts = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM forum_posts ORDER BY created_at DESC');
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).send({ error: 'Error fetching posts' });
    }
};

// Lấy danh sách bài viết đã được duyệt
const getAllApprovedPosts = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM forum_posts WHERE is_approved = 1 ORDER BY created_at DESC');
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).send({ error: 'Error fetching posts' });
    }
};

// Lấy chi tiết bài viết
const getPostById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM forum_posts WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).send({ error: 'Post not found' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error("❌ LỖI SQL:", err);
        res.status(500).send({ error: 'Error fetching post' });
    }
};

// Tạo bài viết mới
const createPost = async (req, res) => {
    const { title, content, author_id } = req.body;
    const image = req.file ? req.file.filename : null;
    try {
        console.log("📥 Dữ liệu nhận được:", req.body);

        const pool = await poolPromise;
        const result = await pool.request()
            .input('title', sql.NVarChar, title)
            .input('content', sql.NVarChar, content)
            .input('author_id', sql.Int, author_id)
            .input('image', sql.NVarChar, image)
            .input('is_approved', sql.Bit, 0)
            .query('INSERT INTO forum_posts (title, content, author_id, image, created_at, is_approved) VALUES (@title, @content, @author_id, @image, GETDATE(), @is_approved)');

        console.log("✅ Kết quả truy vấn:", result);
        res.status(201).send({ message: 'Post created successfully and is pending approval' });
    } catch (err) {
        console.error("❌ LỖI SQL:", err);
        res.status(500).send({ error: 'Error creating post' });
    }
};

// Cập nhật bài viết
const updatePost = async (req, res) => {
    const { title, content } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('title', sql.NVarChar, title)
            .input('content', sql.NVarChar, content)
            .query('UPDATE forum_posts SET title = @title, content = @content WHERE id = @id');
        res.status(200).send({ message: 'Post updated successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error updating post' });
    }
};

// Duyệt bài viết
const approvePost = async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('is_approved', sql.Bit, 1)
            .query('UPDATE forum_posts SET is_approved = @is_approved WHERE id = @id');
        res.status(200).send({ message: 'Post approved successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error approving post' });
    }
};

// Xóa bài viết
const deletePost = async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM forum_posts WHERE id = @id');
        res.status(200).send({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error deleting post' });
    }
};

// Thêm bình luận vào bài viết
const addComment = async (req, res) => {
    const { content, author_id } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('post_id', sql.Int, req.params.id)
            .input('content', sql.NVarChar, content)
            .input('author_id', sql.Int, author_id)
            .query('INSERT INTO forum_comments (post_id, content, author_id, created_at) VALUES (@post_id, @content, @author_id, GETDATE())');
        res.status(201).send({ message: 'Comment added successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error adding comment' });
    }
};

// Sửa bình luận
const editComment = async (req, res) => {
    const { content } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, req.params.commentId)
            .input('content', sql.NVarChar, content)
            .input('is_edited', sql.Bit, 1)
            .query('UPDATE forum_comments SET content = @content, is_edited = @is_edited WHERE id = @id');
        res.status(200).send({ message: 'Comment edited successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error editing comment' });
    }
};

// Xóa bình luận
const deleteComment = async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, req.params.commentId)
            .query('DELETE FROM forum_comments WHERE id = @id');
        res.status(200).send({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error deleting comment' });
    }
};

// Lấy bình luận của bài viết
const getCommentsByPostId = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('post_id', sql.Int, req.params.id)
            .query('SELECT * FROM forum_comments WHERE post_id = @post_id ORDER BY created_at DESC');

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("❌ LỖI SQL:", err);
        res.status(500).send({ error: 'Error fetching comments' });
    }
};

module.exports = { getAllPosts, getAllApprovedPosts, getPostById, createPost, updatePost, deletePost, addComment, getCommentsByPostId, editComment, deleteComment, approvePost, upload };
