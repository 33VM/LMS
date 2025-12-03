import React, { useState } from 'react';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import { askLibrarian } from '../services/geminiService';
import { Book, Student, Transaction } from '../types';
import ReactMarkdown from 'react-markdown';

interface AILibrarianProps {
  books: Book[];
  students: Student[];
  transactions: Transaction[];
}

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export const AILibrarian: React.FC<AILibrarianProps> = ({ books, students, transactions }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: 'Hello! I am Athena, your AI Librarian assistant. I can help you find books, analyze library data, or suggest reading materials. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user' as const, content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    const response = await askLibrarian(query, { books, students, transactions });
    
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-indigo-600 p-4 flex items-center gap-3 text-white">
        <Sparkles size={24} className="text-yellow-300" />
        <div>
          <h2 className="font-bold text-lg">AI Librarian Assistant</h2>
          <p className="text-xs text-indigo-200">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
              ${msg.role === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
              {msg.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
              ${msg.role === 'ai' ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Bot size={18} />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-indigo-500 bg-slate-50 focus:bg-white transition-colors"
            placeholder="Ask about books, overdue items, or recommendations..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !query.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
