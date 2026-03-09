'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ChatSidebar({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: '👋 Hi! I\'m your AI assistant. I can help you create leads in ERPNext.\n\nTry saying: "Create a lead for John Smith from Acme Corp, email john@acme.com, phone +1-555-0123"',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call backend API
      const response = await axios.post(`${API_URL}/api/leads/create-from-prompt`, {
        prompt: input,
        conversationHistory: messages.slice(-5).map(m => ({
          role: m.role === 'ai' ? 'assistant' : 'user',
          content: m.content
        }))
      });

      const aiMessage = {
        role: 'ai',
        content: response.data.message,
        leadData: response.data.lead_data,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage = {
        role: 'ai',
        content: `❌ Error: ${error.response?.data?.message || error.message}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">🤖 AI Assistant</h3>
          <p className="text-sm opacity-90 mt-1">Powered by Grok AI</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-2 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'ai' 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}>
              {message.role === 'ai' ? 'AI' : 'You'}
            </div>

            <div className={`max-w-[75%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`rounded-2xl px-4 py-3 ${
                message.role === 'ai'
                  ? 'bg-white border border-gray-200'
                  : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {/* Lead Preview Card */}
                {message.leadData && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">📋 Lead Created</h4>
                    <div className="text-sm space-y-1 text-blue-800">
                      <p><strong>Name:</strong> {message.leadData.lead_name}</p>
                      {message.leadData.company_name && (
                        <p><strong>Company:</strong> {message.leadData.company_name}</p>
                      )}
                      {message.leadData.email_id && (
                        <p><strong>Email:</strong> {message.leadData.email_id}</p>
                      )}
                      {message.leadData.mobile_no && (
                        <p><strong>Phone:</strong> {message.leadData.mobile_no}</p>
                      )}
                    </div>
                    <a
                      href={`http://localhost:8080/app/lead/${message.leadData.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      View in ERPNext →
                    </a>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
              AI
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the lead..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}