require('dotenv').config();
const axios = require('axios');

async function getLeadMeta() {
    const baseURL = process.env.ERPNEXT_URL;
    const apiKey = process.env.ERPNEXT_API_KEY;
    const apiSecret = process.env.ERPNEXT_API_SECRET;

    try {
        const response = await axios.get(`${baseURL}/api/resource/DocType/Lead`, {
            headers: {
                'Authorization': `token ${apiKey}:${apiSecret}`
            }
        });

        console.log('📋 Lead DocType Fields:\n');
        
        const fields = response.data.data.fields;
        
        fields.forEach(field => {
            if (!field.hidden && field.fieldtype !== 'Section Break' && field.fieldtype !== 'Column Break') {
                console.log(`${field.fieldname}`);
                console.log(`  Type: ${field.fieldtype}`);
                console.log(`  Label: ${field.label}`);
                if (field.reqd) console.log(`  Required: Yes`);
                console.log('');
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

getLeadMeta();