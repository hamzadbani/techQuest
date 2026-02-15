const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    category: { type: String, default: 'Engineering' },
    readTime: { type: Number, required: true }, // in minutes
    publishedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['draft', 'published'], default: 'published' }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
