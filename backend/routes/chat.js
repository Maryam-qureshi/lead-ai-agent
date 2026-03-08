const express = require('express');
const router = express.Router();
const grokService = require('../services/grokService');

// Chat with AI
router.post('/message', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;

        if (!message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Message is required' 
            });
        }

        const response = await grokService.chat(message, conversationHistory);

        res.json({
            success: true,
            response
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;