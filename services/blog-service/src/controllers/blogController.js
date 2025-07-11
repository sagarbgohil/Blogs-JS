const Blog = require('../models/Blog');

async function createBlog(req, res) {
    // Create a new blog
}

async function getBlogs(req, res) {
    // Get all blogs
}

async function likeBlog(req, res) {
    // Increment likes on a blog
}

async function addComment(req, res) {
    // Add a comment to a blog
}

module.exports = { createBlog, getBlogs, likeBlog, addComment };
