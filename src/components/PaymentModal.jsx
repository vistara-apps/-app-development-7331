import React, { useState } from 'react';
import { X, Lock, CreditCard, AlertCircle } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const PaymentModal = ({ isOpen, onClose, title, price = "$0.001", onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { createSession, isWalletConnected } = usePaymentContext();

  const handlePurchase = async () => {
    if (!isWalletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      await createSession(price);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-surface rounded-lg shadow-xl max-w-sm mx-4 w-full animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-text-primary">Unlock Premium Content</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="font-medium text-text-primary">{title}</h4>
              <p className="text-sm text-text-secondary">Premium legal guidance</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Price:</span>
              <span className="text-lg font-semibold text-text-primary">{price}</span>
            </div>
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
          
          <button
            onClick={handlePurchase}
            disabled={isProcessing || !isWalletConnected}
            className="
              w-full bg-primary text-white py-3 px-4 rounded-lg font-medium
              hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
              transition-colors duration-200 flex items-center justify-center space-x-2
            "
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>{isWalletConnected ? 'Purchase Now' : 'Connect Wallet First'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;