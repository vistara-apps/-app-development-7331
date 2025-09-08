import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Lightbulb, ArrowLeft } from 'lucide-react';
import { useChatAgent } from '../hooks/useChatAgent';

const ChatAgent = ({ isOpen, onClose, onResourceClick }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { chatHistory, isLoading, sendMessage, clearChat, getSuggestedQuestions } = useChatAgent();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;
    
    setInputMessage('');
    await sendMessage(message);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleResourceClick = (resourceId) => {
    onResourceClick?.(resourceId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-surface w-full h-full sm:h-[600px] sm:max-w-md sm:rounded-lg shadow-xl flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Legal Assistant</h3>
              <p className="text-xs text-text-secondary">Ask about your rights</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Legal Rights Assistant</h4>
              <p className="text-sm text-text-secondary mb-4">
                Ask me about your rights in various situations. I can help with police interactions, housing, employment, and more.
              </p>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-text-secondary mb-2">Try asking:</p>
                {getSuggestedQuestions().slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="block w-full text-left text-sm text-primary hover:text-accent transition-colors duration-200 p-2 hover:bg-gray-50 rounded"
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatHistory.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-primary'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {message.suggestions && (
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center space-x-1 mb-2">
                      <Lightbulb className="w-3 h-3 text-accent" />
                      <span className="text-xs font-medium text-text-secondary">Suggestions:</span>
                    </div>
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left text-xs text-primary hover:text-accent transition-colors duration-200 p-1 hover:bg-white hover:bg-opacity-20 rounded"
                      >
                        • {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {message.relatedResources && message.relatedResources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs font-medium text-text-secondary mb-1">Related Resources:</p>
                    <div className="space-y-1">
                      {message.relatedResources.map((resourceId, index) => (
                        <button
                          key={index}
                          onClick={() => handleResourceClick(resourceId)}
                          className="block text-xs text-primary hover:text-accent transition-colors duration-200"
                        >
                          → View {resourceId.replace('-', ' ')} checklist
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your legal rights..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          {chatHistory.length > 0 && (
            <button
              onClick={clearChat}
              className="mt-2 text-xs text-text-secondary hover:text-primary transition-colors duration-200"
            >
              Clear conversation
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="px-4 pb-2">
          <p className="text-xs text-text-secondary text-center">
            This provides general information, not legal advice. Consult an attorney for specific situations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatAgent;
