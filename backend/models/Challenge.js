const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    level: { type: String, enum: ['junior', 'intermediate', 'senior'], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['explanation', 'refactor'], required: true },
    initialCode: { type: String },
    expectedCode: { type: String },
    concepts: [{ type: String }],
    learningContent: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
