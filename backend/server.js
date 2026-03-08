const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Import routes
const leadRoutes = require('./routes/leads');
const chatRoutes = require('./routes/chat');

// Use routes
app.use('/api/leads', leadRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'ERP AI Agent Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 ERPNext URL: ${process.env.ERPNEXT_URL}`);
    console.log(`🤖 Grok AI: ${process.env.GROK_MODEL}`);
});