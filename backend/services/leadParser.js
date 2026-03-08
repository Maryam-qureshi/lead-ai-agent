class LeadParser {
    parseAndValidate(aiResponse) {
        const validated = {};

        // REQUIRED: Lead Name
        if (!aiResponse.lead_name) {
            throw new Error('Lead name is required');
        }
        validated.lead_name = String(aiResponse.lead_name).trim();

        // OPTIONAL: Company Name
        if (aiResponse.company_name) {
            validated.company_name = String(aiResponse.company_name).trim();
        }

        // OPTIONAL: Email (with validation)
        if (aiResponse.email_id) {
            const email = this.validateEmail(aiResponse.email_id);
            if (email) {
                validated.email_id = email;
            }
        }

        // OPTIONAL: Mobile Number
        if (aiResponse.mobile_no) {
            validated.mobile_no = String(aiResponse.mobile_no).trim();
        }

        // OPTIONAL: Source
        if (aiResponse.source) {
            validated.source = this.normalizeSource(aiResponse.source);
        }

        // OPTIONAL: Industry
        if (aiResponse.industry) {
            validated.industry = String(aiResponse.industry).trim();
        }

        // OPTIONAL: Territory
        if (aiResponse.territory) {
            validated.territory = String(aiResponse.territory).trim();
        }

        // OPTIONAL: Notes
        if (aiResponse.notes) {
            validated.notes = String(aiResponse.notes).trim();
        }

        // Make sure no fields are undefined or null strings
        Object.keys(validated).forEach(key => {
            if (validated[key] === null || validated[key] === undefined || validated[key] === 'null') {
                delete validated[key];
            }
        });

        console.log('✅ Final validated data:', validated);
        return validated;
    }

    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const cleaned = String(email).trim();
        
        if (emailRegex.test(cleaned)) {
            return cleaned;
        }
        
        console.warn('⚠️ Invalid email format:', email);
        return null;
    }

    normalizeSource(source) {
        const sourceMapping = {
            'phone call': 'Phone Call',
            'phone': 'Phone Call',
            'call': 'Phone Call',
            'email': 'Email',
            'website': 'Website',
            'web': 'Website',
            'form': 'Website',
            'referral': 'Referral',
            'reference': 'Referral',
            'walk in': 'Walk In',
            'walkin': 'Walk In',
            'campaign': 'Campaign',
            'advertisement': 'Campaign',
            'ad': 'Campaign'
        };

        const sourceLower = String(source).toLowerCase().trim();
        return sourceMapping[sourceLower] || String(source).trim();
    }
}

module.exports = new LeadParser();