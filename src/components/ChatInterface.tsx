import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Download, FileText, Code, Image, Settings, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onExport: (format: 'csv' | 'json' | 'pdf') => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, onExport }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isTyping) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
      setIsTyping(true);
      
      // Simulate typing indicator
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const handleQuickAction = (action: string) => {
    const quickMessages: Record<string, string> = {
      seo: 'Please analyze the SEO performance of this website and provide recommendations.',
      accessibility: 'Check the accessibility compliance and list any issues found.',
      performance: 'Analyze the website performance and Core Web Vitals.',
      tech: 'Identify the technology stack and frameworks used on this website.',
      content: 'Provide a comprehensive content analysis and summary.',
      competitors: 'Analyze the website and suggest potential competitors or similar sites.',
    };
    
    if (quickMessages[action]) {
      onSendMessage(quickMessages[action]);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
              AI Website Analyzer
            </h1>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Ask me anything about the scanned website
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onExport('json')}
              className="btn-secondary flex items-center space-x-1 text-sm"
              title="Export as JSON"
            >
              <Code className="w-4 h-4" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => onExport('csv')}
              className="btn-secondary flex items-center space-x-1 text-sm"
              title="Export as CSV"
            >
              <FileText className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => onExport('pdf')}
              className="btn-secondary flex items-center space-x-1 text-sm"
              title="Export as PDF"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 px-6 py-3">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <span className="text-sm text-secondary-600 dark:text-secondary-400 flex-shrink-0">
            Quick actions:
          </span>
          {[
            { key: 'seo', label: 'SEO Analysis', icon: <Settings className="w-3 h-3" /> },
            { key: 'accessibility', label: 'Accessibility', icon: <HelpCircle className="w-3 h-3" /> },
            { key: 'performance', label: 'Performance', icon: <Settings className="w-3 h-3" /> },
            { key: 'tech', label: 'Tech Stack', icon: <Code className="w-3 h-3" /> },
            { key: 'content', label: 'Content', icon: <FileText className="w-3 h-3" /> },
          ].map((action) => (
            <button
              key={action.key}
              onClick={() => handleQuickAction(action.key)}
              className="flex items-center space-x-1 px-3 py-1 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-full text-xs hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200 flex-shrink-0"
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl ${
                message.role === 'user' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700'
              } rounded-lg px-4 py-3 shadow-sm`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h3 className="text-lg font-semibold mt-0 mb-2">{children}</h3>,
                        h2: ({ children }) => <h4 className="text-base font-semibold mt-0 mb-1">{children}</h4>,
                        h3: ({ children }) => <h5 className="text-sm font-semibold mt-0 mb-1">{children}</h5>,
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 last:mb-0">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 last:mb-0">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        code: ({ children }) => (
                          <code className="bg-secondary-100 dark:bg-secondary-700 px-1 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-secondary-100 dark:bg-secondary-700 p-3 rounded overflow-x-auto text-sm">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  
                  <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-secondary-400 dark:bg-secondary-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-secondary-400 dark:bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-secondary-400 dark:bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 px-6 py-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about SEO, accessibility, performance, or anything else..."
              className="input-field pr-12"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
        
        <div className="mt-2 text-xs text-secondary-500 dark:text-secondary-400 text-center">
          Press Enter to send • Use quick actions above for common analyses
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;