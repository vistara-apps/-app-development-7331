import { useCallback, useState } from 'react';
import axios from 'axios';

/**
 * Hook for Chat Agent integration
 * Provides conversational AI for legal Q&A
 */
export function useChatAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  // Base Chat Agent API endpoint (placeholder)
  const CHAT_API_URL = 'https://api.base.org/chat-agents/v1';

  // Legal context for the chat agent
  const LEGAL_CONTEXT = `
You are a legal rights assistant for RightCheck, a Base MiniApp that helps users understand their rights.

Your role is to:
1. Provide clear, accurate information about legal rights
2. Guide users to relevant checklists and resources
3. Explain legal concepts in simple terms
4. Always recommend consulting with a qualified attorney for specific legal advice

Important disclaimers:
- You provide general information, not legal advice
- Laws vary by jurisdiction
- Users should consult qualified attorneys for specific situations
- Emergency situations require immediate professional help

Available resources in RightCheck:
- Police interaction checklists
- Housing rights guides
- Employment law information
- Consumer protection resources
- Legal term glossary
`;

  // Send message to chat agent
  const sendMessage = useCallback(async (message, context = {}) => {
    if (!message.trim()) return null;

    setIsLoading(true);
    setError(null);

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);

    try {
      // In a real implementation, this would call the Base Chat Agent API
      // For now, we'll simulate a response based on common legal queries
      const response = await simulateChatResponse(message, context);

      const agentMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: response.content,
        suggestions: response.suggestions,
        relatedResources: response.relatedResources,
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, agentMessage]);
      return agentMessage;

    } catch (err) {
      console.error('Chat agent error:', err);
      setError(err.message);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: "I'm sorry, I'm having trouble responding right now. Please try again or consult our legal resources directly.",
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, errorMessage]);
      return errorMessage;

    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simulate chat response (replace with actual API call)
  const simulateChatResponse = async (message, context) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = message.toLowerCase();

    // Police-related queries
    if (lowerMessage.includes('police') || lowerMessage.includes('traffic stop') || lowerMessage.includes('arrest')) {
      return {
        content: `If you're dealing with police interactions, here are your key rights:

🚔 **During a Traffic Stop:**
- Stay calm and keep hands visible
- You have the right to remain silent
- You can ask "Am I free to leave?"
- You can refuse vehicle searches (unless they have a warrant)

⚖️ **If Arrested:**
- Request a lawyer immediately
- Don't answer questions without an attorney
- Remember badge numbers and details

Would you like me to guide you through our detailed Police Interaction Checklist?`,
        suggestions: [
          "Show me the police stop checklist",
          "What if I'm arrested?",
          "Can police search my car?",
          "Miranda rights explained"
        ],
        relatedResources: ['police-stop', 'consumer-fraud']
      };
    }

    // Housing-related queries
    if (lowerMessage.includes('landlord') || lowerMessage.includes('rent') || lowerMessage.includes('eviction') || lowerMessage.includes('housing')) {
      return {
        content: `For housing rights, here's what you should know:

🏠 **Landlord Entry Rights:**
- Must give 24-48 hours notice (varies by state)
- Entry only at reasonable times (usually 8am-6pm)
- Must have valid reasons (repairs, inspections, showings)

🛡️ **Your Rights:**
- You can refuse entry for invalid reasons
- Document unauthorized entries
- Contact housing authority if rights are violated

Need specific guidance for your situation?`,
        suggestions: [
          "Landlord entry checklist",
          "Eviction protection",
          "Rental application rights",
          "Housing discrimination"
        ],
        relatedResources: ['landlord-entry', 'rental-application']
      };
    }

    // Employment-related queries
    if (lowerMessage.includes('job') || lowerMessage.includes('work') || lowerMessage.includes('employment') || lowerMessage.includes('interview')) {
      return {
        content: `Employment rights are important to understand:

💼 **Job Interview Rights:**
- Employers can't ask about age, religion, family plans
- Disability questions are generally prohibited
- You can ask about salary ranges in many states

🛡️ **Workplace Protection:**
- Protection from harassment and discrimination
- Right to safe working conditions
- Fair wage and overtime protections

What specific employment situation are you facing?`,
        suggestions: [
          "Job interview checklist",
          "Workplace harassment",
          "Wage and hour rights",
          "Discrimination protection"
        ],
        relatedResources: ['job-interview', 'workplace-harassment']
      };
    }

    // Consumer protection queries
    if (lowerMessage.includes('scam') || lowerMessage.includes('fraud') || lowerMessage.includes('consumer') || lowerMessage.includes('purchase')) {
      return {
        content: `Consumer protection is crucial in today's world:

🛡️ **Fraud Protection:**
- Never give personal info to unsolicited callers
- Verify company legitimacy before payments
- Keep records of all transactions
- Report suspected fraud to FTC

💳 **If You're Scammed:**
- Contact your bank immediately
- File reports with authorities
- Consider credit monitoring

Need help with a specific consumer issue?`,
        suggestions: [
          "Fraud protection checklist",
          "How to report scams",
          "Credit protection",
          "Online shopping safety"
        ],
        relatedResources: ['consumer-fraud']
      };
    }

    // General legal terms
    if (lowerMessage.includes('legal term') || lowerMessage.includes('definition') || lowerMessage.includes('what is') || lowerMessage.includes('explain')) {
      return {
        content: `I can help explain legal terms and concepts! 

📚 **Common Legal Terms:**
- Miranda Rights: Your constitutional rights during police interrogation
- Fair Housing Act: Federal law preventing housing discrimination
- At-Will Employment: Employment that can be terminated by either party
- Consumer Protection: Laws ensuring fair trade and accurate information

What specific legal term would you like me to explain?`,
        suggestions: [
          "Miranda rights explained",
          "Fair housing laws",
          "Employment law basics",
          "Browse legal glossary"
        ],
        relatedResources: ['police-stop', 'landlord-entry', 'job-interview']
      };
    }

    // Default response
    return {
      content: `I'm here to help you understand your legal rights! 

I can assist with:
🚔 Police interactions and your rights
🏠 Housing and landlord issues  
💼 Employment and workplace rights
🛡️ Consumer protection and fraud prevention
📚 Legal terms and concepts

What would you like to know about? Feel free to ask specific questions about any legal situation you're facing.

**Remember:** I provide general information, not legal advice. For specific legal matters, please consult with a qualified attorney.`,
      suggestions: [
        "Police stop rights",
        "Landlord entry rules", 
        "Job interview rights",
        "Fraud protection",
        "Browse all checklists"
      ],
      relatedResources: ['police-stop', 'landlord-entry', 'job-interview', 'consumer-fraud']
    };
  };

  // Clear chat history
  const clearChat = useCallback(() => {
    setChatHistory([]);
    setError(null);
  }, []);

  // Get suggested questions based on current context
  const getSuggestedQuestions = useCallback((category = null) => {
    const suggestions = {
      police: [
        "What are my rights during a traffic stop?",
        "Can police search my car without a warrant?",
        "What should I do if I'm arrested?",
        "Do I have to answer police questions?"
      ],
      housing: [
        "When can my landlord enter my apartment?",
        "What notice is required for rent increases?",
        "How do I report housing discrimination?",
        "What are my rights during eviction?"
      ],
      employment: [
        "What questions can't employers ask in interviews?",
        "How do I report workplace harassment?",
        "What are my rights regarding overtime pay?",
        "Can I be fired for any reason?"
      ],
      consumer: [
        "How do I protect myself from scams?",
        "What should I do if I'm a victim of fraud?",
        "How do I dispute a credit card charge?",
        "What are my rights when returning products?"
      ]
    };

    return category ? suggestions[category] || [] : Object.values(suggestions).flat();
  }, []);

  return {
    chatHistory,
    isLoading,
    error,
    sendMessage,
    clearChat,
    getSuggestedQuestions
  };
}
