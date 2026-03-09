'use client';

import { useState } from 'react';
import ChatSidebar from '@/components/ChatSidebar';
import { MessageSquare } from 'lucide-react';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🤖 ERP AI Lead Agent
          </h1>
          <p className="text-gray-600 mt-2">
            Create leads in ERPNext using natural language
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
            <MessageSquare className="w-16 h-16 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900">
            AI-Powered Lead Creation
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simply describe your lead in natural language, and our AI will automatically create it in ERPNext.
          </p>

          <button
            onClick={() => setIsChatOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Open AI Assistant
          </button>

          {/* Features */}
          <div className="grid md:grid-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Smart Extraction</h3>
              <p className="text-gray-600">
                AI automatically extracts name, email, phone, company, and more from your description
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Instant Creation</h3>
              <p className="text-gray-600">
                Leads are created in ERPNext in seconds with all the right information
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Natural Language</h3>
              <p className="text-gray-600">
                Just describe the lead as you would to a colleague - no forms required
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all flex items-center justify-center"
      >
        <MessageSquare className="w-7 h-7" />
      </button>

      {/* Chat Sidebar */}
      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  );
}