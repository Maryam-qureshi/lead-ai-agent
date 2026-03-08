
const axios = require('axios');

class GrokService {
    constructor() {
        this.apiKey = process.env.GROK_API_KEY;
        
        // GROQ API Configuration (not Grok/X.AI)
        this.model = 'llama-3.1-8b-instant';  // Groq model
        this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';  // Groq endpoint
        
        if (!this.apiKey) {
            console.error('❌ GROK_API_KEY not found');
            throw new Error('API key not configured');
        }
        
        console.log('✅ Groq Service initialized');
        console.log('📝 Model:', this.model);
        console.log('🔑 API Key:', this.apiKey.substring(0, 10) + '...');
    }

    determineIntent(prompt) {
        const createKeywords = [
            'create', 'add', 'new lead', 'contact from',
            'received inquiry', 'got a call', 'met someone',
            'lead:', 'lead for'
        ];

        const promptLower = prompt.toLowerCase();
        
        for (const keyword of createKeywords) {
            if (promptLower.includes(keyword)) {
                console.log('🎯 Intent detected: CREATE_LEAD');
                return 'create_lead';
            }
        }

        console.log('💬 Intent detected: CONVERSATION');
        return 'conversation';
    }

    async extractLeadInfo(prompt, conversationHistory = null) {
        console.log('\n🤖 Calling Groq AI to extract lead info...');

        const systemPrompt = `Extract lead information from natural language and return ONLY valid JSON.

Extract these fields:
- lead_name (REQUIRED)
- company_name
- email_id
- mobile_no
- source (Website, Phone Call, Email, Referral, Campaign, Walk In)
- industry
- territory
- notes

Return ONLY the JSON object, no markdown, no explanations.

Example:
{
    "lead_name": "John Smith",
    "company_name": "Acme Corp",
    "email_id": "john@acme.com",
    "mobile_no": "+1-555-0123",
    "source": "Phone Call",
    "industry": "Technology",
    "territory": "United States",
    "notes": "Interested in ERP"
}`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
        ];

        try {
            const response = await this.callGroqAPI(messages, 0.1);
            console.log('✅ Groq API response received');

            // Parse JSON from response
            let content = response.trim();
            
            // Remove markdown if present
            if (content.includes('```json')) {
                content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            } else if (content.includes('```')) {
                content = content.replace(/```\n?/g, '');
            }

            const parsed = JSON.parse(content.trim());
            console.log('✅ Parsed:', parsed);
            
            return parsed;

        } catch (error) {
            console.error('❌ Error:', error.message);
            throw new Error('Failed to parse AI response');
        }
    }

    async chat(message, conversationHistory = null) {
        const systemPrompt = `You are a helpful AI assistant for ERPNext CRM. Help users create leads and answer questions about CRM. Be friendly and concise.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ];

        return await this.callGroqAPI(messages, 0.7);
    }

    async callGroqAPI(messages, temperature = 0.3) {
        console.log('\n🌐 Calling Groq API...');

        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: this.model,
                    messages: messages,
                    temperature: temperature
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    timeout: 60000
                }
            );

            console.log('✅ API call successful');
            return response.data.choices[0].message.content;

        } catch (error) {
            console.error('❌ API Error:', error.response?.data || error.message);
            throw new Error(`API error: ${error.message}`);
        }
    }

    async testConnection() {
        console.log('🧪 Testing Groq API...');
        try {
            const response = await this.callGroqAPI([
                { role: 'user', content: 'Say "success"' }
            ], 0.1);
            console.log('✅ Test successful:', response);
            return true;
        } catch (error) {
            console.error('❌ Test failed:', error.message);
            return false;
        }
    }
}

module.exports = new GrokService();