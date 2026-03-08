require('dotenv').config();
const grokService = require('./services/grokService');

async function test() {
    console.log('🧪 Testing Groq AI...\n');
    
    // Test 1: Connection
    console.log('Test 1: API Connection');
    const connected = await grokService.testConnection();
    console.log('');
    
    if (connected) {
        // Test 2: Lead extraction
        console.log('Test 2: Lead Extraction');
        try {
            const result = await grokService.extractLeadInfo(
                'Create a lead for Sarah Wilson from TechCorp Inc, email sarah@techcorp.com, phone +1-415-555-7890, she called about ERP'
            );
            console.log('✅ Extraction successful!');
            console.log('Extracted:', JSON.stringify(result, null, 2));
        } catch (error) {
            console.error('❌ Extraction failed:', error.message);
        }
    }
}

test();