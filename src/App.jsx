import React, { useState, useEffect } from 'react';
import AppShell from './components/AppShell';
import ActionCard from './components/ActionCard';
import StepIndicator from './components/StepIndicator';
import SearchInput from './components/SearchInput';
import LegalTermDisplay from './components/LegalTermDisplay';
import PaymentModal from './components/PaymentModal';
import ChatAgent from './components/ChatAgent';
import { checklists, scenarioGuides, legalTerms, alerts } from './data/mockData';
import { useMiniKit } from './hooks/useMiniKit';
import { useFarcaster } from './hooks/useFarcaster';
import { ArrowLeft, Star, BookOpen, AlertTriangle, Search, MessageCircle, Share2 } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasedItems, setPurchasedItems] = useState(new Set());
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, item: null });
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  // Initialize MiniKit and Farcaster hooks
  const { isInMiniApp, saveFrame, shareContent, sendNotification } = useMiniKit();
  const { shareLegalContent } = useFarcaster();

  // Filter content based on search
  const filteredChecklists = checklists.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredGuides = scenarioGuides.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTerms = legalTerms.filter(item =>
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (item, type) => {
    if (item.premium && !purchasedItems.has(item.id)) {
      setPaymentModal({ isOpen: true, item: { ...item, type } });
      return;
    }
    
    setSelectedItem({ ...item, type });
    setCurrentView('detail');
  };

  const handlePurchaseSuccess = async () => {
    if (paymentModal.item) {
      setPurchasedItems(prev => new Set([...prev, paymentModal.item.id]));
      setSelectedItem(paymentModal.item);
      setCurrentView('detail');
      
      // Show save frame prompt for premium content
      if (isInMiniApp) {
        try {
          await saveFrame();
          await sendNotification({
            title: 'Premium Content Unlocked!',
            body: `You now have access to "${paymentModal.item.title}". Save this frame for quick access.`,
            icon: '/icon-192x192.png'
          });
        } catch (error) {
          console.log('Frame save or notification failed:', error);
        }
      }
    }
  };

  // Handle sharing content
  const handleShare = async (item) => {
    try {
      if (isInMiniApp) {
        await shareContent({
          title: `RightCheck: ${item.title}`,
          text: `Check out this legal guide: ${item.description}`,
          url: window.location.href
        });
      } else {
        // Fallback for web
        const shareData = await shareLegalContent(item);
        if (navigator.share) {
          await navigator.share({
            title: `RightCheck: ${item.title}`,
            text: shareData.text,
            url: window.location.href
          });
        } else {
          // Copy to clipboard fallback
          await navigator.clipboard.writeText(shareData.text);
          alert('Content copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // Handle chat resource clicks
  const handleChatResourceClick = (resourceId) => {
    const item = checklists.find(c => c.id === resourceId) || 
                 scenarioGuides.find(g => g.id === resourceId);
    
    if (item) {
      const type = checklists.find(c => c.id === resourceId) ? 'checklist' : 'guide';
      handleItemClick(item, type);
    }
  };

  const renderOnboarding = () => (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-4 pt-8">
        <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto">
          <Star className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Know Your Rights, Instantly</h1>
        <p className="text-text-secondary leading-relaxed max-w-xs mx-auto">
          Get step-by-step guidance and essential rights information for common life situations.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Try a Free Checklist:</h2>
        {checklists.filter(item => !item.premium).slice(0, 2).map(item => (
          <ActionCard
            key={item.id}
            variant="checklist"
            title={item.title}
            description={item.description}
            category={item.category}
            onClick={() => handleItemClick(item, 'checklist')}
          />
        ))}
      </div>

      <button
        onClick={() => setShowOnboarding(false)}
        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
      >
        Continue to App
      </button>
    </div>
  );

  const renderHome = () => (
    <div className="p-4 space-y-6">
      <SearchInput onSearch={setSearchQuery} />
      
      {/* Recent Alerts */}
      <section>
        <div className="flex items-center space-x-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">Recent Alerts</h2>
        </div>
        <div className="space-y-3">
          {alerts.slice(0, 2).map(alert => (
            <ActionCard
              key={alert.id}
              variant="alert"
              title={alert.title}
              description={alert.content}
              category={alert.category}
              timestamp={alert.timestamp}
              onClick={() => setCurrentView('alerts')}
            />
          ))}
        </div>
      </section>

      {/* Quick Access Checklists */}
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-3">Quick Rights Checklists</h2>
        <div className="space-y-3">
          {filteredChecklists.slice(0, 3).map(item => (
            <ActionCard
              key={item.id}
              variant="checklist"
              title={item.title}
              description={item.description}
              premium={item.premium}
              category={item.category}
              onClick={() => handleItemClick(item, 'checklist')}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentView('checklists')}
          className="w-full mt-3 text-primary text-sm font-medium py-2 hover:text-accent transition-colors duration-200"
        >
          View All Checklists
        </button>
      </section>

      {/* Scenario Guides */}
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-3">Scenario Guides</h2>
        <div className="space-y-3">
          {filteredGuides.slice(0, 2).map(item => (
            <ActionCard
              key={item.id}
              variant="guide"
              title={item.title}
              description={item.description}
              premium={item.premium}
              category={item.category}
              onClick={() => handleItemClick(item, 'guide')}
            />
          ))}
        </div>
      </section>
    </div>
  );

  const renderDetail = () => {
    if (!selectedItem) return null;

    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-text-primary">{selectedItem.title}</h1>
              <p className="text-sm text-text-secondary">{selectedItem.category}</p>
            </div>
          </div>
          <button
            onClick={() => handleShare(selectedItem)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Share this guide"
          >
            <Share2 className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {selectedItem.type === 'checklist' && (
          <StepIndicator steps={selectedItem.steps} />
        )}

        {selectedItem.type === 'guide' && (
          <div className="space-y-4">
            {selectedItem.modules.map((module, index) => (
              <div key={index} className="bg-surface border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-text-primary mb-2">{module.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{module.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderGlossary = () => (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <h1 className="text-xl font-bold text-text-primary">Legal Terms Glossary</h1>
      </div>

      <SearchInput 
        placeholder="Search legal terms..."
        onSearch={setSearchQuery}
      />

      <div className="space-y-3">
        {filteredTerms.map((term, index) => (
          <LegalTermDisplay
            key={index}
            term={term.term}
            definition={term.definition}
            relatedGuides={term.relatedGuides}
            onGuideClick={(guideId) => {
              const guide = checklists.find(c => c.id === guideId);
              if (guide) handleItemClick(guide, 'checklist');
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderChecklists = () => (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <h1 className="text-xl font-bold text-text-primary">All Rights Checklists</h1>
      </div>

      <SearchInput onSearch={setSearchQuery} />

      <div className="space-y-3">
        {filteredChecklists.map(item => (
          <ActionCard
            key={item.id}
            variant="checklist"
            title={item.title}
            description={item.description}
            premium={item.premium}
            category={item.category}
            onClick={() => handleItemClick(item, 'checklist')}
          />
        ))}
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <h1 className="text-xl font-bold text-text-primary">Rights Alerts</h1>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => (
          <ActionCard
            key={alert.id}
            variant="alert"
            title={alert.title}
            description={alert.content}
            category={alert.category}
            timestamp={alert.timestamp}
          />
        ))}
      </div>
    </div>
  );

  const renderCurrentView = () => {
    if (showOnboarding) return renderOnboarding();
    
    switch (currentView) {
      case 'detail': return renderDetail();
      case 'glossary': return renderGlossary();
      case 'checklists': return renderChecklists();
      case 'alerts': return renderAlerts();
      default: return renderHome();
    }
  };

  return (
    <AppShell>
      {renderCurrentView()}
      
      {/* Navigation shortcuts for desktop */}
      <div className="hidden sm:flex fixed bottom-4 right-4 flex-col space-y-2">
        <button
          onClick={() => setChatOpen(true)}
          className="bg-accent p-3 rounded-full shadow-card hover:shadow-lg transition-all duration-200"
          title="Legal Assistant"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => setCurrentView('glossary')}
          className="bg-surface p-3 rounded-full shadow-card hover:shadow-lg transition-all duration-200"
          title="Legal Glossary"
        >
          <BookOpen className="w-5 h-5 text-primary" />
        </button>
        <button
          onClick={() => setCurrentView('checklists')}
          className="bg-surface p-3 rounded-full shadow-card hover:shadow-lg transition-all duration-200"
          title="All Checklists"
        >
          <Search className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Mobile Chat Button */}
      <div className="fixed bottom-20 right-4 sm:hidden">
        <button
          onClick={() => setChatOpen(true)}
          className="bg-accent p-3 rounded-full shadow-card hover:shadow-lg transition-all duration-200"
          title="Legal Assistant"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </button>
      </div>

      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, item: null })}
        title={paymentModal.item?.title}
        onSuccess={handlePurchaseSuccess}
      />

      <ChatAgent
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onResourceClick={handleChatResourceClick}
      />
    </AppShell>
  );
};

export default App;
