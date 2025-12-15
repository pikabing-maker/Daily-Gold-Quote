import React from 'react';
import { Quote } from '../types';
import { Quote as QuoteIcon } from 'lucide-react';

interface QuoteCardProps {
  quote: Quote | null;
  loading: boolean;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="h-4 w-64 bg-dark-700 rounded border border-gold-900/30"></div>
        <div className="h-4 w-48 bg-dark-700 rounded border border-gold-900/30"></div>
        <div className="h-4 w-32 bg-dark-700 rounded border border-gold-900/30"></div>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="relative z-10 max-w-2xl mx-auto text-center px-6 py-12">
      <QuoteIcon className="w-12 h-12 text-gold-500 mx-auto mb-8 opacity-40" />
      
      <blockquote className="relative">
        <p className="font-serif text-3xl md:text-5xl text-gold-100 leading-tight mb-10 drop-shadow-lg tracking-wide whitespace-pre-line">
          {quote.content}
        </p>
        <footer className="flex flex-col items-center space-y-3">
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-600 to-transparent mb-4 opacity-50"></div>
            <cite className="font-display text-xl text-gold-400 not-italic tracking-wider uppercase font-bold text-shadow-gold">
            {quote.author}
            </cite>
            {quote.context && (
                <span className="font-serif text-sm text-gold-200/60 italic mt-2 max-w-md leading-relaxed">
                    {quote.context}
                </span>
            )}
        </footer>
      </blockquote>
    </div>
  );
};

export default QuoteCard;