import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bell, Search, Shield } from 'lucide-react';

const AppShell = ({ children, title = "RightCheck" }) => {
  return (
    <div className="miniapp-container">
      {/* Header */}
      <header className="bg-surface border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-text-primary">{title}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-md hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
            </button>
            <div className="hidden sm:block">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-surface border-t border-gray-200 px-4 py-2 sm:hidden">
        <div className="flex justify-around">
          <button className="flex flex-col items-center py-2 px-3 text-primary">
            <Shield className="w-5 h-5" />
            <span className="text-xs mt-1">Rights</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-text-secondary">
            <Search className="w-5 h-5" />
            <span className="text-xs mt-1">Search</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-text-secondary">
            <Bell className="w-5 h-5" />
            <span className="text-xs mt-1">Alerts</span>
          </button>
        </div>
      </nav>

      {/* Mobile Wallet Connect */}
      <div className="fixed bottom-16 right-4 sm:hidden">
        <ConnectButton />
      </div>
    </div>
  );
};

export default AppShell;