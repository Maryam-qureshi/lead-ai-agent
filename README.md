# ERP AI Agent 🤖

An AI-powered assistant that converts natural language into **ERPNext CRM actions**.
Users can describe leads in plain English, and the system automatically extracts structured data and creates leads in ERPNext.

Example:

> "Create a lead for John Smith from Acme Corp, email [john@acme.com](mailto:john@acme.com), phone +1-555-0123"

The AI extracts the details and sends them to ERPNext as a new **Lead**.

---

# 🚀 Features

* Natural language lead creation
* AI-powered information extraction
* Automatic ERPNext lead creation
* Conversation/chat mode with AI
* Node.js backend API
* Integration with ERPNext REST API

---

# 🏗️ Project Architecture

```
User Prompt
     │
     ▼
Node.js Backend (Express)
     │
     ▼
AI Service (LLM API)
     │
Extract Lead Fields
     │
     ▼
ERPNext REST API
     │
     ▼
Lead Created in ERPNext
```

---

# 📂 Project Structure

```
erp-ai-agent
│
├── backend
│   ├── routes
│   │   └── leads.js
│   │
│   ├── services
│   │   ├── grokService.js
│   │   └── erpnextClient.js
│   │
│   ├── server.js
│   └── package.json
│
├── .env
└── README.md
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone the repository

```
git clone https://github.com/YOUR_USERNAME/erp-ai-agent.git
cd erp-ai-agent/backend
```

---

## 2️⃣ Install dependencies

```
npm install
```

---

## 3️⃣ Configure environment variables

Create a `.env` file:

```
PORT=3001

ERP_NEXT_URL=http://localhost:8080
ERP_NEXT_API_KEY=your_api_key
ERP_NEXT_API_SECRET=your_api_secret

AI_API_KEY=your_ai_api_key
```

⚠️ Do NOT commit `.env` to GitHub.

---

## 4️⃣ Run the server

```
npm run dev
```

Server will start:

```
http://localhost:3001
```

---

# 📡 API Endpoint

### Create Lead from Natural Language

POST

```
/api/leads
```

Example request:

```json
{
  "prompt": "Create a lead for John Smith from Acme Corp, email john@acme.com, phone +1-555-0123"
}
```

Example response:

```json
{
  "lead_name": "John Smith",
  "company_name": "Acme Corp",
  "email_id": "john@acme.com",
  "mobile_no": "+1-555-0123",
  "source": "Phone Call"
}
```

---

# 🧠 AI Extraction Example

Input:

```
John Smith from Acme Corp called about ERP, email john@acme.com
```

Extracted JSON:

```json
{
  "lead_name": "John Smith",
  "company_name": "Acme Corp",
  "email_id": "john@acme.com",
  "source": "Phone Call"
}
```

---

# 🛠 Technologies Used

* Node.js
* Express.js
* ERPNext REST API
* Axios
* AI LLM API (Gemini / Grok / etc.)

---

# 🔐 Environment Variables

```
PORT
ERP_NEXT_URL
ERP_NEXT_API_KEY
ERP_NEXT_API_SECRET
AI_API_KEY
```


