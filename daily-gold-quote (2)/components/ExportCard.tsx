import React from 'react';
import { Quote } from '../types';

interface ExportCardProps {
  quote: Quote | null;
  id: string;
}

const ExportCard: React.FC<ExportCardProps> = ({ quote, id }) => {
  if (!quote) return null;

  return (
    <div 
        id={id}
        // Changed: Removed opacity-0. Moved to left-[-9999px] to hide from viewport but keep in DOM for html2canvas.
        className="fixed top-0 left-[-9999px] w-[1080px] h-[1920px] bg-[#0a0a0a] flex flex-col items-center justify-center p-24 text-center pointer-events-none z-[-1]"
        style={{ 
            fontSmooth: 'always',
            backgroundImage: 'radial-gradient(circle at 50% 100%, #1c1917 0%, #050505 60%)'
        }}
    >
        {/* Border Decor */}
        <div className="absolute top-16 left-16 right-16 bottom-16 border border-gold-700/30"></div>
        <div className="absolute top-20 left-20 right-20 bottom-20 border border-gold-500/20"></div>

        {/* Content */}
        <div className="flex flex-col items-center justify-between h-full py-40 z-10">
            
            {/* Header */}
            <div className="text-gold-500/80 font-display tracking-[0.5em] text-4xl uppercase">
                每日金句
            </div>

            {/* Quote Body */}
            <div className="flex flex-col items-center flex-1 justify-center">
                 {/* Decorative Quote Mark */}
                <div className="font-serif text-[240px] leading-none text-gold-600/10 mb-[-60px]">
                    “
                </div>
                
                <p className="font-serif text-6xl text-gold-50 leading-relaxed max-w-4xl px-8 relative z-10 whitespace-pre-line drop-shadow-2xl">
                    {quote.content}
                </p>

                <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-gold-600 to-transparent mt-20 mb-10 opacity-70"></div>

                <p className="font-display text-4xl text-gold-400 uppercase tracking-widest font-bold">
                    {quote.author}
                </p>
                {quote.context && (
                    <p className="font-serif text-2xl text-gold-600/80 italic mt-8 max-w-3xl leading-relaxed">
                        {quote.context}
                    </p>
                )}
            </div>

             {/* Footer */}
            <div className="flex flex-col items-center space-y-4">
                <div className="text-gold-500/60 font-display tracking-widest text-2xl">
                    {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="text-gold-700/40 text-lg font-sans">
                    Daily Gold Quote
                </div>
            </div>
        </div>
        
        {/* Faint Background Texture Effect using simple CSS */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    </div>
  );
};

export default ExportCard;