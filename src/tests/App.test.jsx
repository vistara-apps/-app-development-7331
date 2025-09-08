import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';
import App from '../App';

// Mock the hooks
vi.mock('../hooks/useMiniKit', () => ({
  useMiniKit: () => ({
    isInMiniApp: false,
    saveFrame: vi.fn(),
    shareContent: vi.fn(),
    sendNotification: vi.fn()
  })
}));

vi.mock('../hooks/useFarcaster', () => ({
  useFarcaster: () => ({
    shareLegalContent: vi.fn()
  })
}));

vi.mock('../hooks/useChatAgent', () => ({
  useChatAgent: () => ({
    chatHistory: [],
    isLoading: false,
    sendMessage: vi.fn(),
    clearChat: vi.fn(),
    getSuggestedQuestions: () => [
      "What are my rights during a traffic stop?",
      "Can police search my car?",
      "What should I do if arrested?"
    ]
  })
}));

// Mock Wagmi config
const config = getDefaultConfig({
  appName: "RightCheck Test",
  projectId: "test-project-id",
  chains: [base],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const TestWrapper = ({ children }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </WagmiProvider>
);

describe('RightCheck App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the onboarding screen initially', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    expect(screen.getByText('Know Your Rights, Instantly')).toBeInTheDocument();
    expect(screen.getByText('Get step-by-step guidance and essential rights information for common life situations.')).toBeInTheDocument();
  });

  it('shows free checklists in onboarding', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    expect(screen.getByText('Try a Free Checklist:')).toBeInTheDocument();
    expect(screen.getByText('Police Traffic Stop')).toBeInTheDocument();
    expect(screen.getByText('Consumer Fraud Protection')).toBeInTheDocument();
  });

  it('navigates to main app after onboarding', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    const continueButton = screen.getByText('Continue to App');
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText('Recent Alerts')).toBeInTheDocument();
      expect(screen.getByText('Quick Rights Checklists')).toBeInTheDocument();
    });
  });

  it('displays legal checklists', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Skip onboarding
    fireEvent.click(screen.getByText('Continue to App'));

    await waitFor(() => {
      expect(screen.getByText('Police Traffic Stop')).toBeInTheDocument();
      expect(screen.getByText('Consumer Fraud Protection')).toBeInTheDocument();
    });
  });

  it('shows premium content indicators', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Skip onboarding
    fireEvent.click(screen.getByText('Continue to App'));

    await waitFor(() => {
      // Premium content should be marked
      const premiumItems = screen.getAllByText(/premium/i);
      expect(premiumItems.length).toBeGreaterThan(0);
    });
  });

  it('opens search functionality', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Skip onboarding
    fireEvent.click(screen.getByText('Continue to App'));

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('navigates to checklist detail view', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Skip onboarding
    fireEvent.click(screen.getByText('Continue to App'));

    await waitFor(() => {
      const policeStopCard = screen.getByText('Police Traffic Stop');
      fireEvent.click(policeStopCard);
    });

    await waitFor(() => {
      expect(screen.getByText('Stay calm and keep your hands visible')).toBeInTheDocument();
    });
  });

  it('shows legal glossary', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Skip onboarding
    fireEvent.click(screen.getByText('Continue to App'));

    await waitFor(() => {
      // Click on glossary navigation (desktop)
      const glossaryButton = screen.getByTitle('Legal Glossary');
      fireEvent.click(glossaryButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Legal Terms Glossary')).toBeInTheDocument();
      expect(screen.getByText('Miranda Rights')).toBeInTheDocument();
    });
  });

  it('displays emergency alerts', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Skip onboarding
    fireEvent.click(screen.getByText('Continue to App'));

    await waitFor(() => {
      expect(screen.getByText('Recent Alerts')).toBeInTheDocument();
      expect(screen.getByText('New California Tenant Protection Act')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Skip onboarding
    fireEvent.click(screen.getByText('Continue to App'));

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'police' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Police Traffic Stop')).toBeInTheDocument();
    });
  });

  it('shows payment modal for premium content', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Skip onboarding
    fireEvent.click(screen.getByText('Continue to App'));

    await waitFor(() => {
      // Click on premium content
      const premiumContent = screen.getByText('Landlord Entry Rights');
      fireEvent.click(premiumContent);
    });

    await waitFor(() => {
      expect(screen.getByText('Unlock Premium Content')).toBeInTheDocument();
      expect(screen.getByText('$0.001')).toBeInTheDocument();
    });
  });

  it('handles navigation between views', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Skip onboarding
    fireEvent.click(screen.getByText('Continue to App'));

    // Navigate to all checklists
    await waitFor(() => {
      const viewAllButton = screen.getByText('View All Checklists');
      fireEvent.click(viewAllButton);
    });

    await waitFor(() => {
      expect(screen.getByText('All Rights Checklists')).toBeInTheDocument();
    });

    // Navigate back
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText('Recent Alerts')).toBeInTheDocument();
    });
  });

  it('displays scenario guides', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Skip onboarding
    fireEvent.click(screen.getByText('Continue to App'));

    await waitFor(() => {
      expect(screen.getByText('Scenario Guides')).toBeInTheDocument();
      expect(screen.getByText('Rental Application Process')).toBeInTheDocument();
    });
  });

  it('shows legal terms with definitions', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Skip onboarding
    fireEvent.click(screen.getByText('Continue to App'));

    // Navigate to glossary
    await waitFor(() => {
      const glossaryButton = screen.getByTitle('Legal Glossary');
      fireEvent.click(glossaryButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Miranda Rights')).toBeInTheDocument();
      expect(screen.getByText(/Constitutional rights that police must inform/)).toBeInTheDocument();
    });
  });

  it('handles error states gracefully', async () => {
    // Mock console.error to avoid test noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // The app should still render even if there are errors
    expect(screen.getByText('Know Your Rights, Instantly')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('maintains responsive design', () => {
    // Test mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    expect(screen.getByText('Know Your Rights, Instantly')).toBeInTheDocument();

    // Test desktop view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    expect(screen.getByText('Know Your Rights, Instantly')).toBeInTheDocument();
  });
});
