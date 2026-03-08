const express = require('express');
const router = express.Router();
const erpnextClient = require('../services/erpnextClient');
const grokService = require('../services/grokService');
const leadParser = require('../services/leadParser');

// Create lead from natural language prompt
router.post('/create-from-prompt', async (req, res) => {
    try {
        const { prompt, conversationHistory } = req.body;

        if (!prompt) {
            return res.status(400).json({ 
                success: false, 
                error: 'Prompt is required' 
            });
        }

        console.log('📝 Processing prompt:', prompt);

        // Step 1: Extract lead info using Grok AI
        const extractedData = await grokService.extractLeadInfo(prompt, conversationHistory);
        console.log('🤖 Grok extracted:', extractedData);

        // Step 2: Validate and parse the data
        const validatedData = leadParser.parseAndValidate(extractedData);
        console.log('✅ Validated data:', validatedData);

        // Step 3: Create lead in ERPNext
        const lead = await erpnextClient.createLead(validatedData);
        console.log('🎉 Lead created:', lead.name);

        return res.json({
            success: true,
            type: 'lead_created',
            lead_name: lead.name,
            message: `✅ Lead '${lead.lead_name}' created successfully!`,
            lead_data: lead
        });

    } catch (error) {
        console.error('❌ Error creating lead:', error);
        return res.status(500).json({
            success: false,
            type: 'error',
            error: error.message,
            message: `❌ Error: ${error.message}`
        });
    }
});

// Get all leads
router.get('/', async (req, res) => {
    try {
        const leads = await erpnextClient.getLeads();
        res.json({ success: true, leads });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single lead
router.get('/:id', async (req, res) => {
    try {
        const lead = await erpnextClient.getLead(req.params.id);
        res.json({ success: true, lead });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;