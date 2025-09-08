import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const LegalTermDisplay = ({ term, definition, relatedGuides = [], onGuideClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-surface border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">{term}</h3>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-text-secondary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 animate-slide-up">
          <p className="text-sm text-text-secondary leading-relaxed mb-3">
            {definition}
          </p>
          
          {relatedGuides.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-2">Related Guides:</h4>
              <div className="space-y-1">
                {relatedGuides.map((guideId) => (
                  <button
                    key={guideId}
                    className="flex items-center space-x-2 text-sm text-primary hover:text-accent transition-colors duration-200"
                    onClick={() => onGuideClick?.(guideId)}
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="capitalize">{guideId.replace('-', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LegalTermDisplay;