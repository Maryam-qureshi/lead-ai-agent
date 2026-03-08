require('dotenv').config();
const axios = require('axios');

async function checkSources() {
    const baseURL = process.env.ERPNEXT_URL;
    const apiKey = process.env.ERPNEXT_API_KEY;
    const apiSecret = process.env.ERPNEXT_API_SECRET;

    const headers = {
        'Authorization': `token ${apiKey}:${apiSecret}`
    };

    console.log('Checking valid UTM Sources...\n');

    try {
        const response = await axios.get(`${baseURL}/api/resource/UTM Source`, { 
            headers,
            params: {
                fields: JSON.stringify(['name']),
                limit_page_length: 100
            }
        });
        
        console.log('✅ Valid UTM Sources:');
        response.data.data.forEach(s => console.log(`  - ${s.name}`));
        
        if (response.data.data.length === 0) {
            console.log('  (No UTM Sources found - you may need to create them)');
        }
    } catch (e) {
        console.log('❌ Error:', e.message);
        console.log('💡 You might need to create UTM Sources first');
    }
}

checkSources();