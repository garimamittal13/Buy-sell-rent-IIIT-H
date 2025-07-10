const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
    const { conversation } = req.body; // Get full conversation history

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: conversation.map(msg => ({
                    parts: [{ text: msg.content }],
                    role: msg.role === "user" ? "user" : "model", // Map roles correctly
                })),
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const reply = response.data.candidates[0]?.content?.parts[0]?.text || "I'm not sure how to respond.";
        
        res.json({ reply });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Failed to get chatbot response" });
    }
});

module.exports = router;
