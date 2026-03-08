const axios = require('axios');

class ERPNextClient {
    constructor() {
        this.baseURL = process.env.ERPNEXT_URL;
        this.apiKey = process.env.ERPNEXT_API_KEY;
        this.apiSecret = process.env.ERPNEXT_API_SECRET;
        
        // Create axios instance with auth
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Authorization': `token ${this.apiKey}:${this.apiSecret}`,  // FIXED: Added "this."
                'Content-Type': 'application/json'
            }
        });
    }

    async createLead(leadData) {
        try {
            // Map our field names to ERPNext field names
            const erpnextLead = {};

            // Full Name (REQUIRED)
            if (leadData.lead_name) {
                erpnextLead.lead_name = String(leadData.lead_name);
            }

            // Company Name
            if (leadData.company_name) {
                erpnextLead.company_name = String(leadData.company_name);
            }

            // Email
            if (leadData.email_id) {
                erpnextLead.email_id = String(leadData.email_id);
            }

            // Mobile
            if (leadData.mobile_no) {
                erpnextLead.mobile_no = String(leadData.mobile_no);
            }

            // SOURCE: Map to utm_source with valid values
            if (leadData.source) {
                // Map common sources to ERPNext's existing UTM Sources
                const sourceMapping = {
                    'phone call': 'Cold Calling',
                    'phone': 'Cold Calling',
                    'call': 'Cold Calling',
                    'email': 'Mass Mailing',
                    'website': 'Campaign',
                    'web': 'Campaign',
                    'form': 'Campaign',
                    'referral': 'Reference',
                    'reference': 'Reference',
                    'walk in': 'Walk In',
                    'walkin': 'Walk In',
                    'campaign': 'Campaign',
                    'advertisement': 'Advertisement',
                    'ad': 'Advertisement',
                    'existing customer': 'Existing Customer'
                };

                const sourceLower = String(leadData.source).toLowerCase();
                erpnextLead.utm_source = sourceMapping[sourceLower] || 'Walk In';  // Default to Walk In
            }

            console.log('📤 Sending to ERPNext:', JSON.stringify(erpnextLead, null, 2));
            
            const response = await this.client.post('/api/resource/Lead', erpnextLead);
            
            console.log('✅ ERPNext response:', response.data);
            
            // If we have notes, add them as a comment
            if (leadData.notes && response.data.data.name) {
                await this.addComment(response.data.data.name, leadData.notes);
            }
            
            return response.data.data;
            
        } catch (error) {
            console.error('❌ ERPNext API Error:', error.response?.data || error.message);
            
            if (error.response?.data) {
                console.error('Full error:', JSON.stringify(error.response.data, null, 2));
            }
            
            throw new Error(`Failed to create lead: ${error.response?.data?.exc_type || error.message}`);
        }
    }

    // Add a comment/note to a lead
    async addComment(leadName, comment) {
        try {
            await this.client.post('/api/resource/Comment', {
                comment_type: 'Comment',
                reference_doctype: 'Lead',
                reference_name: leadName,
                content: comment
            });
            console.log('✅ Comment added to lead');
        } catch (error) {
            console.error('⚠️ Failed to add comment:', error.message);
            // Don't throw - lead was created successfully
        }
    }

    async getLeads(filters = {}, fields = ['*']) {
        try {
            const response = await this.client.get('/api/resource/Lead', {
                params: {
                    fields: JSON.stringify(fields),
                    filters: JSON.stringify(filters)
                }
            });
            return response.data.data;
        } catch (error) {
            throw new Error(`Failed to fetch leads: ${error.message}`);
        }
    }

    async getLead(leadName) {
        try {
            const response = await this.client.get(`/api/resource/Lead/${leadName}`);
            return response.data.data;
        } catch (error) {
            throw new Error(`Failed to fetch lead: ${error.message}`);
        }
    }

    async updateLead(leadName, data) {
        try {
            const response = await this.client.put(`/api/resource/Lead/${leadName}`, data);
            return response.data.data;
        } catch (error) {
            throw new Error(`Failed to update lead: ${error.message}`);
        }
    }

    async deleteLead(leadName) {
        try {
            await this.client.delete(`/api/resource/Lead/${leadName}`);
            return { success: true, message: 'Lead deleted' };
        } catch (error) {
            throw new Error(`Failed to delete lead: ${error.message}`);
        }
    }
}

module.exports = new ERPNextClient();