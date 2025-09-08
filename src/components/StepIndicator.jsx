import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep = 0, variant = 'default' }) => {
  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'default';
  };

  const getStepStyles = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-primary text-white border-primary';
      case 'active':
        return 'bg-accent text-white border-accent';
      default:
        return 'bg-gray-100 text-text-secondary border-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        return (
          <div key={index} className="flex items-start space-x-3">
            <div className={`
              w-8 h-8 rounded-full border-2 flex items-center justify-center 
              flex-shrink-0 transition-all duration-300
              ${getStepStyles(status)}
            `}>
              {status === 'completed' ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <div className="flex-1 pt-1">
              <p className={`
                text-sm leading-relaxed
                ${status === 'active' ? 'text-text-primary font-medium' : 'text-text-secondary'}
              `}>
                {step}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;