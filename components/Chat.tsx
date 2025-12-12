import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot, AlertCircle, RefreshCcw } from 'lucide-react';
import { Message, UserAssessment } from '../types';
import { sendMessageToGemini, initializeChatSession } from '../services/geminiService';
import { INITIAL_GREETING } from '../utils/constants';

interface ChatProps {
  assessment: UserAssessment;
}

const Chat: React.FC<ChatProps> = ({ assessment }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session on mount
  useEffect(() => {
    initializeChatSession(assessment);
    
    // Add initial greeting
    setMessages([{
      id: 'init-1',
      role: 'model',
      text: INITIAL_GREETING,
      timestamp: new Date()
    }]);
  }, [assessment]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Create a placeholder for the AI response
    const aiMsgId = (Date.now() + 1).toString();
    const aiMsgPlaceholder: Message = {
      id: aiMsgId,
      role: 'model',
      text: '', // Start empty for streaming
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMsgPlaceholder]);

    try {
      const stream = await sendMessageToGemini(userMsg.text);
      
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMsgId ? { ...msg, text: fullText } : msg
          )
        );
      }
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, text: "I'm having trouble connecting right now. Please try again.", isError: true } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">SpineCare Assistant</h1>
            <p className="text-xs text-slate-500">Biopsychosocial Model • AI Support</p>
          </div>
        </div>
        
        {/* Context Summary Pill */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs text-slate-600">
           <span>Pain: {assessment.painIntensity}/10</span>
           <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
           <span>Fear: {assessment.fearAvoidance}/10</span>
           <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
           <span>Stress: {assessment.stressLevel}/10</span>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white ${msg.role === 'user' ? 'bg-slate-700' : 'bg-teal-600'}`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            
            <div 
              className={`rounded-2xl px-5 py-3 text-sm md:text-base leading-relaxed shadow-sm max-w-[85%] 
                ${msg.role === 'user' 
                  ? 'bg-slate-800 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                } ${msg.isError ? 'border-red-300 bg-red-50 text-red-800' : ''}`}
            >
              {msg.role === 'model' ? (
                <div className="prose prose-sm prose-slate max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-teal-600 flex-shrink-0 flex items-center justify-center text-white">
                <Bot size={14} />
             </div>
             <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about exercises, pain management strategies, or share how you feel..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none shadow-inner text-base"
            rows={1}
            style={{ minHeight: '52px', maxHeight: '120px' }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <RefreshCcw size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          AI can make mistakes. This is for educational purposes only and not medical advice.
        </p>
      </footer>
    </div>
  );
};

export default Chat;