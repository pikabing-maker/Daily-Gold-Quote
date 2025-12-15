import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, MessageCircle, Download, Loader2 } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import QuoteCard from './components/QuoteCard';
import ChatDrawer from './components/ChatDrawer';
import ExportCard from './components/ExportCard';
import { fetchDailyQuote, sendChatMessage } from './services/geminiService';
import { downloadQuoteAsImage } from './utils/downloadUtils';
import { Quote, ChatMessage } from './types';

function App() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  
  const EXPORT_ID = 'quote-export-container';

  const loadQuote = useCallback(async () => {
    setLoading(true);
    // Reset chat when getting new quote
    setMessages([]);
    const newQuote = await fetchDailyQuote();
    setQuote(newQuote);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const handleSendMessage = async (text: string) => {
    if (!quote) return;
    
    setIsSendingChat(true);
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);

    const responseText = await sendChatMessage(quote, messages, text);
    
    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    setMessages(prev => [...prev, botMsg]);
    setIsSendingChat(false);
  };

  const handleDownload = () => {
    if(!quote) return;
    const filename = `daily-quote-${new Date().toISOString().split('T')[0]}.png`;
    downloadQuoteAsImage(EXPORT_ID, filename);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-gold-500 selection:text-black">
      
      {/* Background Visuals */}
      <ParticleBackground />

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center justify-center min-h-[80vh]">
        
        {/* Quote Display */}
        <div className="flex-1 flex flex-col justify-center w-full">
            <QuoteCard quote={quote} loading={loading} />
        </div>

        {/* Action Bar */}
        <div className="mt-12 mb-8 flex items-center justify-center space-x-8">
          
          <Tooltip text="更新金句">
            <button 
                onClick={loadQuote}
                disabled={loading}
                className="group relative p-4 bg-dark-800/40 backdrop-blur-md border border-gold-500/20 rounded-full shadow-lg hover:shadow-gold-500/10 hover:border-gold-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-30"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
                ) : (
                    <RefreshCw className="w-6 h-6 text-gold-400 group-hover:text-gold-200 group-hover:rotate-180 transition-all duration-700" />
                )}
            </button>
          </Tooltip>

          <Tooltip text="深度讨论">
            <button 
                onClick={() => setChatOpen(true)}
                disabled={loading}
                className="group relative p-4 bg-dark-800/40 backdrop-blur-md border border-gold-500/20 rounded-full shadow-lg hover:shadow-gold-500/10 hover:border-gold-500/40 hover:scale-105 transition-all duration-300"
            >
                <MessageCircle className="w-6 h-6 text-gold-400 group-hover:text-gold-200 transition-colors" />
                {messages.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500/80 rounded-full border border-dark-800"></span>
                )}
            </button>
          </Tooltip>

          <Tooltip text="保存图片">
            <button 
                onClick={handleDownload}
                disabled={loading}
                className="group relative p-4 bg-gold-600/80 backdrop-blur-sm text-white rounded-full shadow-lg shadow-gold-900/30 hover:shadow-gold-500/20 hover:bg-gold-500 hover:scale-105 transition-all duration-300"
            >
                <Download className="w-6 h-6" />
            </button>
          </Tooltip>

        </div>
      </main>

      {/* Footer / Attribution */}
      <footer className="relative z-10 py-6 text-gold-500/30 text-xs font-serif italic tracking-widest">
        DAILY INSPIRATION • AI GENERATED
      </footer>

      {/* Overlays and Off-screen renders */}
      <ChatDrawer 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        messages={messages}
        onSendMessage={handleSendMessage}
        isSending={isSendingChat}
        quote={quote}
      />
      
      <ExportCard quote={quote} id={EXPORT_ID} />
    </div>
  );
}

// Simple Tooltip helper
const Tooltip = ({ children, text }: { children?: React.ReactNode, text: string }) => (
    <div className="relative group/tooltip flex flex-col items-center">
        {children}
        <div className="absolute -top-10 opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/tooltip:translate-y-0 bg-dark-800 border border-gold-900/50 text-gold-200 text-xs px-3 py-1.5 rounded pointer-events-none whitespace-nowrap font-sans tracking-wide shadow-xl">
            {text}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-dark-800 border-r border-b border-gold-900/50 rotate-45"></div>
        </div>
    </div>
);

export default App;