require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Challenge = require('./models/Challenge');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techquest';
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// API Routes
// Helper to seed from AI
async function seedFromAI(level, category = "Java & Spring Boot", count = 5) {
    console.log(`Organic Growth: Seeding ${count} more ${level} questions...`);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate ${count} professional technical interview questions for a ${level} level developer specialized in ${category}. Output valid JSON array. Return ONLY JSON.`;

    try {
        const result = await model.generateContent(prompt);
        const text = (await result.response).text();
        const newChallenges = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
        for (const chall of newChallenges) {
            await Challenge.findOneAndUpdate({ id: chall.id }, chall, { upsert: true });
        }
        console.log(`Seeded ${newChallenges.length} new items.`);
    } catch (err) {
        console.error("Organic seeding failed:", err.message);
    }
}

app.get('/api/challenges', async (req, res) => {
    const { level, count = 20, exclude = "" } = req.query;
    const excludedIds = exclude ? exclude.split(',') : [];

    console.log(`Fetch request: level=${level}, count=${count}, excluding=${excludedIds.length} IDs`);

    try {
        const matchStage = {
            level: level.toLowerCase(),
            status: { $in: ['approved', null, undefined] } // Allow approved or legacy missing status
        };

        if (excludedIds.length > 0) {
            matchStage.id = { $nin: excludedIds }; // "Not In" filter
        }

        let challenges = await Challenge.aggregate([
            { $match: matchStage },
            { $sample: { size: Math.min(parseInt(count), 50) } }
        ]);

        console.log(`Found ${challenges.length} unique challenges for ${level}`);

        // Organic Growth: Check the TOTAL pool for this level
        const totalCount = await Challenge.countDocuments({ level: level.toLowerCase() });
        if (totalCount < 100) {
            console.log(`Pool for ${level} is ${totalCount}/100. Expanding...`);
            seedFromAI(level);
        }

        res.json(challenges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/status', async (req, res) => {
    try {
        const count = await Challenge.countDocuments();
        const sample = await Challenge.findOne();
        res.json({
            status: 'online',
            totalChallenges: count,
            database: mongoose.connection.name,
            sample: sample ? { level: sample.level, title: sample.title } : 'null'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADMIN ROUTES

// Login / Verify passcode
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true, message: "Welcome back, Admin." });
    } else {
        res.status(401).json({ success: false, message: "Incorrent passcode." });
    }
});

// Community Contribution Route
app.post('/api/challenges/contribute', async (req, res) => {
    try {
        const { title, description, level, category, type } = req.body;

        // Basic validation
        if (!title || !description || !level) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newChallenge = new Challenge({
            id: `user-contrib-${Date.now()}`,
            title,
            description,
            level: level.toLowerCase(),
            status: 'pending', // NEW contributions start as pending
            category: category || "General",
            type: type || "explanation",
            concepts: [], // Users don't provide these, AI or admin will fill later
            learningContent: "Awaiting community or AI review."
        });

        await newChallenge.save();
        res.status(201).json({ message: "Contribution received! Thank you for helping the community.", challenge: newChallenge });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin-only (or internal) route to trigger AI seeding
app.post('/api/admin/seed', async (req, res) => {
    const { level, category, count = 5 } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        Generate ${count} professional technical interview questions for a ${level} level developer specialized in ${category}.
        The output MUST be a valid JSON array of objects matching this structure:
        {
          "id": string (unique),
          "category": string,
          "level": string ("junior", "intermediate", or "senior"),
          "title": string,
          "description": string,
          "type": "explanation" | "refactor",
          "initialCode": string (optional),
          "expectedCode": string (optional),
          "concepts": string[],
          "learningContent": string
        }
        Return ONLY the JSON.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const newChallenges = JSON.parse(jsonString);

        // Bulk insert and ignore duplicates
        for (const chall of newChallenges) {
            try {
                await Challenge.findOneAndUpdate({ id: chall.id }, chall, { upsert: true });
            } catch (e) {
                console.error("Duplicate ID skipped");
            }
        }

        res.json({ message: `Successfully seeded ${newChallenges.length} challenges` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
