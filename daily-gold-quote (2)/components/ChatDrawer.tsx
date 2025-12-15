import React, { useEffect, useRef, useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { ChatMessage, Quote } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isSending: boolean;
  quote: Quote | null;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ 
  isOpen, 
  onClose, 
  messages, 
  onSendMessage, 
  isSending,
  quote 
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-dark-900/95 border-l border-gold-900/30 shadow-2xl z-50 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        
        {/* Header */}
        <div className="p-5 border-b border-gold-900/30 flex items-center justify-between bg-dark-900">
          <div className="flex items-center space-x-2 text-gold-100">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <h2 className="font-display font-bold text-lg tracking-widest text-gold-200 uppercase">智慧对话</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gold-900/20 rounded-full text-gold-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quote Context Preview */}
        {quote && (
          <div className="px-5 py-4 bg-dark-800/50 border-b border-gold-900/20 text-xs text-gold-400 font-serif italic truncate">
            引用: "{quote.content}"
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
          {messages.length === 0 && (
            <div className="text-center text-gold-500/40 mt-16 font-serif text-sm space-y-3">
              <p>关于这句话，你有什么想探讨的吗？</p>
              <p className="text-xs">"这句话的深意是什么？"</p>
              <p className="text-xs">"如何将其应用到生活中？"</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-lg backdrop-blur-md ${
                  msg.role === 'user' 
                    ? 'bg-gold-600/20 text-gold-50 border border-gold-500/30 rounded-br-none' 
                    : 'bg-dark-800/80 text-gold-100 border border-gold-900/20 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-dark-800/80 text-gold-500 border border-gold-900/20 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-5 border-t border-gold-900/30 bg-dark-900">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的想法..."
              className="flex-1 bg-dark-800 border border-gold-900/40 rounded-full px-5 py-3 text-sm text-gold-100 placeholder-gold-700/50 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all"
              disabled={isSending}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isSending}
              className="p-3 bg-gold-600 text-white rounded-full hover:bg-gold-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-gold-900/50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </>
  );
};

export default ChatDrawer;