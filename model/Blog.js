const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    blogTitle: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    modifiedBy: {
        type: Date,
        required: false,
        default: Date.now()
    },
    backgroundImageUrl: {
        type: String,
        required: false
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    },
    modifiedDate: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

module.exports = mongoose.model('Blog', blogSchema);