import React from 'react';
import { ChevronRight, Lock, AlertTriangle, BookOpen, Clock } from 'lucide-react';

const ActionCard = ({ variant = 'default', title, description, premium = false, category, timestamp, onClick, className = '' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'checklist':
        return 'border-l-4 border-l-primary bg-blue-50';
      case 'alert':
        return 'border-l-4 border-l-accent bg-purple-50';
      case 'guide':
        return 'border-l-4 border-l-green-500 bg-green-50';
      default:
        return 'border border-gray-200';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'checklist':
        return <BookOpen className="w-5 h-5 text-primary" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-accent" />;
      case 'guide':
        return <BookOpen className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Now';
  };

  return (
    <div 
      className={`
        bg-surface rounded-lg shadow-card p-4 cursor-pointer 
        hover:shadow-lg transition-all duration-300 animate-fade-in
        ${getVariantStyles()} ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {getIcon()}
            <div className="flex items-center space-x-2 flex-1">
              <h3 className="text-base font-semibold text-text-primary">{title}</h3>
              {premium && (
                <Lock className="w-4 h-4 text-accent" />
              )}
            </div>
          </div>
          
          {description && (
            <p className="text-sm text-text-secondary mb-2 leading-relaxed">{description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {category && (
                <span className="text-xs bg-gray-100 text-text-secondary px-2 py-1 rounded-full">
                  {category}
                </span>
              )}
              {timestamp && (
                <div className="flex items-center space-x-1 text-xs text-text-secondary">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(timestamp)}</span>
                </div>
              )}
            </div>
            {premium && (
              <span className="text-xs text-accent font-medium">Premium</span>
            )}
          </div>
        </div>
        
        <ChevronRight className="w-5 h-5 text-text-secondary ml-3 flex-shrink-0" />
      </div>
    </div>
  );
};

export default ActionCard;