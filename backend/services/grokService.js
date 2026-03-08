// const axios = require('axios');

// class GrokService {
//     constructor() {
//         this.apiKey = process.env.GROK_API_KEY;
        
//         // IMPORTANT: Grok uses specific model namesa
//         this.model = 'grok-vision-beta';  // Fixed model name
        
//         this.apiUrl = 'https://api.x.ai/v1/chat/completions';
        
//         // Verify API key exists
//         if (!this.apiKey) {
//             console.error('❌ GROK_API_KEY not found in environment variables');
//             throw new Error('Grok API key not configured');
//         }
        
//         console.log('✅ Grok Service initialized');
//         console.log('📝 Model:', this.model);
//         console.log('🔑 API Key:', this.apiKey.substring(0, 10) + '...');
//     }

//     // Determine if user wants to create a lead or just chat
//     determineIntent(prompt) {
//         const createKeywords = [
//             'create', 'add', 'new lead', 'contact from',
//             'received inquiry', 'got a call', 'met someone',
//             'lead:', 'lead for'
//         ];

//         const promptLower = prompt.toLowerCase();
        
//         for (const keyword of createKeywords) {
//             if (promptLower.includes(keyword)) {
//                 console.log('🎯 Intent detected: CREATE_LEAD');
//                 return 'create_lead';
//             }
//         }

//         console.log('💬 Intent detected: CONVERSATION');
//         return 'conversation';
//     }

//     // Extract lead information from natural language
//     async extractLeadInfo(prompt, conversationHistory = null) {
//         console.log('\n🤖 Calling Grok AI to extract lead info...');
//         console.log('📝 Prompt:', prompt);

//         const systemPrompt = `You are an AI assistant for ERPNext CRM. Extract lead information from natural language.

// Extract these fields from the user's message:
// - lead_name: Full name of person/company (REQUIRED)
// - company_name: Company name (if mentioned)
// - email_id: Email address
// - mobile_no: Phone number
// - source: Lead source (Website, Phone Call, Email, Referral, Campaign, Walk In)
// - industry: Industry/sector
// - territory: Location/city/country
// - notes: Additional context

// CRITICAL RULES:
// 1. Return ONLY valid JSON, no markdown code blocks, no explanations
// 2. Only include fields that are mentioned or can be inferred
// 3. Use null for missing fields
// 4. Infer source from context (e.g., "called us" = "Phone Call", "website form" = "Website")
// 5. Format phone numbers with country codes if possible
// 6. The lead_name field is REQUIRED - always extract it

// EXAMPLE INPUT: "John Smith from Acme Corp called about ERP, email john@acme.com, phone +1-555-0123"

// EXAMPLE OUTPUT:
// {
//     "lead_name": "John Smith",
//     "company_name": "Acme Corp",
//     "email_id": "john@acme.com",
//     "mobile_no": "+1-555-0123",
//     "source": "Phone Call",
//     "industry": null,
//     "territory": null,
//     "notes": "Called about ERP"
// }

// Remember: Return ONLY the JSON object, nothing else.`;

//         const messages = [
//             { role: 'system', content: systemPrompt },
//             { role: 'user', content: prompt }
//         ];

//         try {
//             const response = await this.callGrokAPI(messages, 0.1);
//             console.log('✅ Grok API response received');
//             console.log('📄 Raw response:', response);

//             // Parse JSON from response
//             let content = response.trim();
            
//             // Remove markdown code blocks if present
//             if (content.includes('```json')) {
//                 content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
//             } else if (content.includes('```')) {
//                 content = content.replace(/```\n?/g, '');
//             }

//             content = content.trim();
//             console.log('🔍 Cleaned content:', content);

//             const parsed = JSON.parse(content);
//             console.log('✅ Successfully parsed JSON:', parsed);
            
//             return parsed;

//         } catch (error) {
//             console.error('❌ Error in extractLeadInfo:', error.message);
            
//             if (error.response) {
//                 console.error('📊 Response status:', error.response.status);
//                 console.error('📄 Response data:', JSON.stringify(error.response.data, null, 2));
//             }
            
//             throw new Error('Failed to parse AI response. Please try rephrasing your request.');
//         }
//     }

//     // General chat
//     async chat(message, conversationHistory = null) {
//         console.log('\n💬 Chat mode activated');
//         console.log('📝 Message:', message);

//         const systemPrompt = `You are a helpful AI assistant for ERPNext CRM.

// You help users:
// - Create leads from natural language descriptions
// - Answer questions about CRM and lead management
// - Provide guidance on how to use the system

// Be friendly, concise, and helpful. If the user seems to be describing a lead, 
// encourage them to provide all the details so you can create it.`;

//         const messages = [
//             { role: 'system', content: systemPrompt }
//         ];

//         if (conversationHistory && Array.isArray(conversationHistory)) {
//             messages.push(...conversationHistory);
//         }

//         messages.push({ role: 'user', content: message });

//         try {
//             const response = await this.callGrokAPI(messages, 0.7);
//             console.log('✅ Chat response received');
//             return response;
//         } catch (error) {
//             console.error('❌ Chat error:', error.message);
//             throw error;
//         }
//     }

//     // Call Grok API
//     async callGrokAPI(messages, temperature = 0.3) {
//         console.log('\n🌐 Making Grok API request...');
//         console.log('🔗 URL:', this.apiUrl);
//         console.log('🤖 Model:', this.model);
//         console.log('🌡️ Temperature:', temperature);
//         console.log('💬 Messages count:', messages.length);

//         const requestBody = {
//             model: this.model,
//             messages: messages,
//             temperature: temperature,
//             stream: false
//         };

//         const headers = {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${this.apiKey}`
//         };

//         console.log('📤 Request headers:', {
//             'Content-Type': headers['Content-Type'],
//             'Authorization': `Bearer ${this.apiKey.substring(0, 10)}...`
//         });

//         console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

//         try {
//             const response = await axios.post(
//                 this.apiUrl,
//                 requestBody,
//                 {
//                     headers: headers,
//                     timeout: 60000  // 60 second timeout
//                 }
//             );

//             console.log('✅ API call successful');
//             console.log('📊 Response status:', response.status);
//             console.log('📄 Response data:', JSON.stringify(response.data, null, 2));

//             if (!response.data.choices || !response.data.choices[0]) {
//                 throw new Error('Invalid response format from Grok API');
//             }

//             const content = response.data.choices[0].message.content;
//             console.log('✅ Extracted content:', content);

//             return content;

//         } catch (error) {
//             console.error('\n❌ Grok API Error Details:');
//             console.error('Error message:', error.message);

//             if (error.response) {
//                 console.error('📊 HTTP Status:', error.response.status);
//                 console.error('📊 Status Text:', error.response.statusText);
//                 console.error('📄 Response Headers:', error.response.headers);
//                 console.error('📄 Response Data:', JSON.stringify(error.response.data, null, 2));

//                 // Specific error handling
//                 if (error.response.status === 401) {
//                     throw new Error('Invalid Grok API key. Please check your GROK_API_KEY in .env file');
//                 } else if (error.response.status === 404) {
//                     throw new Error(`Model "${this.model}" not found. Please verify the model name is correct`);
//                 } else if (error.response.status === 429) {
//                     throw new Error('Grok API rate limit exceeded. Please wait and try again');
//                 } else if (error.response.status >= 500) {
//                     throw new Error('Grok API server error. Please try again later');
//                 }

//                 throw new Error(`Grok API error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
//             } else if (error.request) {
//                 console.error('📡 No response received from Grok API');
//                 console.error('Request details:', error.request);
//                 throw new Error('No response from Grok API. Please check your internet connection');
//             } else {
//                 console.error('⚙️ Error setting up request:', error.message);
//                 throw new Error(`Failed to connect to Grok AI: ${error.message}`);
//             }
//         }
//     }

//     // Test API connection
//     async testConnection() {
//         console.log('\n🧪 Testing Grok API connection...');

//         try {
//             const testMessages = [
//                 { role: 'user', content: 'Hello, can you respond with just the word "success"?' }
//             ];

//             const response = await this.callGrokAPI(testMessages, 0.1);
//             console.log('✅ Connection test successful!');
//             console.log('📄 Test response:', response);
//             return true;
//         } catch (error) {
//             console.error('❌ Connection test failed:', error.message);
//             return false;
//         }
//     }
// }

// module.exports = new GrokService();
//Mock
// class GrokService {
//     constructor() {
//         console.log('✅ Mock AI Service initialized (for testing)');
//         this.useMock = true;
//     }

//     determineIntent(prompt) {
//         const createKeywords = [
//             'create', 'add', 'new lead', 'contact from',
//             'received inquiry', 'got a call', 'met someone',
//             'lead:', 'lead for'
//         ];

//         const promptLower = prompt.toLowerCase();
        
//         for (const keyword of createKeywords) {
//             if (promptLower.includes(keyword)) {
//                 console.log('🎯 Intent detected: CREATE_LEAD');
//                 return 'create_lead';
//             }
//         }

//         console.log('💬 Intent detected: CONVERSATION');
//         return 'conversation';
//     }
//     async extractLeadInfo(prompt, conversationHistory = null) {
//     console.log('\n🤖 Using MOCK AI to extract lead info...');
//     console.log('📝 Prompt:', prompt);

//     // Mock response with only supported fields
//     const mockResponse = {
//         "lead_name": "John Smith",
//         "company_name": "Acme Corporation",
//         "email_id": "john.smith@acme.com",
//         "mobile_no": "+1-555-0123",
//         "source": "Phone Call",  // Will be mapped to utm_source
//         "notes": "Interested in ERP system. This is a test lead created with mock AI."
//         // Removed: industry, territory (need valid references)
//     };

//     console.log('✅ Mock response generated:', mockResponse);
    
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     return mockResponse;
//     }

//     async chat(message, conversationHistory = null) {
//         console.log('\n💬 Mock chat mode');
        
//         // Mock conversational response
//         const responses = [
//             "I'm a mock AI for testing. I can help you create leads!",
//             "Try saying: 'Create a lead for Sarah Johnson from TechCorp'",
//             "The lead creation system is working! You can test it now."
//         ];
        
//         const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
//         await new Promise(resolve => setTimeout(resolve, 300));
        
//         return randomResponse;
//     }

//     async testConnection() {
//         console.log('✅ Mock service is always connected!');
//         return true;
//     }
// }

// module.exports = new GrokService();

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