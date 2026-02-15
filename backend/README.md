# TechQuest Backend

This is the Node.js backend for the TechQuest interview platform. It handles secure AI challenge generation and persists all questions in MongoDB.

## Prerequisites
- Node.js installed
- MongoDB installed and running locally (or a MongoDB Atlas URI)

## Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file based on your credentials:
   ```env
   MONGODB_URI=mongodb://admin:admin@localhost:27017/techquest?authSource=admin
   GEMINI_API_KEY=your_key_here
   PORT=5000
   ```
4. **Start the Server**: `npm run dev`

## Features
- `GET /api/challenges`: Fetches randomized questions from MongoDB.
- **Organic Growth**: If a level has few questions, the backend automatically triggers AI to generate and save more to the DB in the background.
