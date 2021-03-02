const express = require('express');
const router = express.Router();
const Blog = require('../model/Blog');

/**
 * Get list of all blogs, that are not deleted
 */
router.get('/', async (req, res) => {
    try {

        const data = await Blog.find({ isDeleted: false }).sort({ modifiedDate: -1 }).exec();
        res.status(200).json({
            success: true,
            data: data,
            meta: {
                moreData: false,
                items: data.length,
                totalItems: data.length
            }
        });
    } catch (exception) {
        console.error(exception);
        res.status(404).json(createErrorResp("BlogNotRetrieved", exception.message));
    }
});

/**
 * Add a new blog to the list of available categories
 */
router.post('/', async (req, res) => {
    try {
        req.username = "101" //logged in user need to replace with token
        let blogPost = new Blog(req.body);
       // blogPost.modifiedBy = req.user.username;
        blogPost.modifiedBy = req.username;
        const data = await blogPost.save();
        res.status(201).json({
            success: true,
            data: data
        });
    } catch (exception) {
        console.error(exception);
        res.status(400).json(createErrorResp("BlogNotSaved", exception.message));
    }
});

/**
 * Fetch details about a blog  using the blogId
 */
router.get('/:id', async (req, res) => {
    try {
        const blogData = await Blog.findById(req.params.id).exec();
        if (blogData) {
            res.status(200).json({
                success: true,
                data: blogData
            });
        } else {
            res.status(404).json(createErrorResp("BlogNotRetrieved", "Blog not found"));
        }
    } catch (exception) {
        console.error(exception);
        res.status(500).json(createErrorResp("BlogNotRetrieved", exception.message));
    }
});

/**
 * Updated details on a blog using blogId
 */
router.patch('/:id', async (req, res) => {
    try {
        req.username = "101" //logged in user need to replace with token
        let blogReqObject = {
            modifiedDate: Date.now(),
            // modifiedBy: req.user.username
            modifiedBy: req.username
        };
        if (req.body.blogTitle) { blogReqObject.blogTitle = req.body.blogTitle; }
        if (req.body.author) { blogReqObject.author = req.body.author; }
        if (req.body.description) { blogReqObject.description = req.body.description; }
        if (req.body.backgroundImageUrl) { blogReqObject.backgroundImageUrl = req.body.backgroundImageUrl; }

        const data = await Blog.findOneAndUpdate({ _id: req.params.id }, { $set: blogReqObject }, { new: true, upsert: false, useFindAndModify: false }).exec();
        if (data) {
            res.status(200).json({
                success: true,
                data: data
            });
        } else {
            res.status(404).json(createErrorResp("BlogNotRetrieved", "Blog not found"));
        }
    } catch (exception) {
        console.error(exception);
        res.status(500).json(createErrorResp("BlogNotUpdated", exception.message));
    }
});

/**
 * Mark a Blog as deleted by setting isDeleted: true
 */
router.delete('/:id', async (req, res) => {
    try {
        req.username = "101" //logged in user need to replace with token
        const blogData = await Blog.findOneAndUpdate({ _id: req.params.id }, { $set: { isDeleted: true, modifiedBy: req.username, modifiedDate: Date.now() } }, { new: true, upsert: false, useFindAndModify: false }).exec();
        if (blogData) {
            res.status(200).json({
                success: true,
                data: blogData
            });
        } else {
            res.status(404).json(createErrorResp("BlogNotRetrieved", "Blog not found"));
        }
    } catch (exception) {
        console.error(exception);
        res.status(500).json(createErrorResp("BlogNotUpdated", exception.message));
    }
});

function createErrorResp(errorType, errorDesc) {
    return {
        success: false,
        meta: {
            error: errorType,
            message: errorDesc
        }
    }
}

module.exports = router;