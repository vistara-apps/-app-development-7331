# RightCheck API Documentation

## Overview

RightCheck is a Base MiniApp that provides on-demand legal checklists and emergency rights alerts. This document outlines the API integrations and technical specifications.

## Table of Contents

1. [Base MiniKit SDK Integration](#base-minikit-sdk-integration)
2. [Farcaster Hub API](#farcaster-hub-api)
3. [Chat Agents API](#chat-agents-api)
4. [Payment Integration](#payment-integration)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)

## Base MiniKit SDK Integration

### Overview
Integration with Base MiniKit SDK for MiniApp functionality within the Base ecosystem.

### Key Features
- **Environment Detection**: Automatically detects if running in Base MiniApp
- **Transaction Handling**: Seamless ETH transactions on Base L2
- **Frame Saving**: Allow users to save the app for quick access
- **Content Sharing**: Share legal content through Base social features
- **Notifications**: Push notifications for legal alerts

### Implementation

```javascript
import { useMiniKit } from './hooks/useMiniKit';

const { 
  isInMiniApp, 
  sendTransaction, 
  saveFrame, 
  shareContent, 
  sendNotification 
} = useMiniKit();
```

### Methods

#### `isInMiniApp: boolean`
Indicates if the app is running within Base MiniApp environment.

#### `sendTransaction(transactionData: Object): Promise<string>`
Sends a transaction through Base MiniApp.

**Parameters:**
- `transactionData`: Transaction object with `to`, `value`, `data` fields

**Returns:** Transaction hash

#### `saveFrame(): Promise<boolean>`
Prompts user to save the frame for quick access.

**Returns:** Success status

#### `shareContent(content: Object): Promise<void>`
Shares content through Base social features.

**Parameters:**
- `content.title`: Content title
- `content.text`: Content description
- `content.url`: Content URL

#### `sendNotification(notification: Object): Promise<void>`
Sends push notification to user.

**Parameters:**
- `notification.title`: Notification title
- `notification.body`: Notification body
- `notification.icon`: Notification icon URL

## Farcaster Hub API

### Overview
Integration with Farcaster Hub API for user identity and social features.

### Base URL
```
https://hub-api.farcaster.xyz:2281
```

### Key Features
- **User Profiles**: Fetch user profile data by FID
- **Cast Management**: Retrieve and create casts
- **Social Sharing**: Share legal content to Farcaster
- **User Search**: Find users by username

### Implementation

```javascript
import { useFarcaster } from './hooks/useFarcaster';

const { 
  getUserProfile, 
  getUserCasts, 
  shareLegalContent 
} = useFarcaster();
```

### Endpoints

#### Get User Profile
```http
GET /v1/userDataByFid?fid={fid}
```

**Response:**
```json
{
  "messages": [
    {
      "data": {
        "userDataBody": {
          "type": "USER_DATA_TYPE_DISPLAY",
          "value": "John Doe"
        }
      }
    }
  ]
}
```

#### Get User Casts
```http
GET /v1/castsByFid?fid={fid}&pageSize={limit}
```

#### Share Legal Content
Prepares content for sharing on Farcaster with legal rights hashtags.

```javascript
const shareData = await shareLegalContent({
  title: "Police Traffic Stop Rights",
  description: "Essential rights during police interactions",
  url: "https://rightcheck.app/police-stop"
});
```

## Chat Agents API

### Overview
AI-powered legal assistant for conversational Q&A about legal rights.

### Base URL
```
https://api.base.org/chat-agents/v1
```

### Key Features
- **Legal Q&A**: Answer questions about legal rights
- **Resource Recommendations**: Suggest relevant checklists and guides
- **Context-Aware**: Understands legal terminology and scenarios
- **Disclaimer Compliance**: Always includes appropriate legal disclaimers

### Implementation

```javascript
import { useChatAgent } from './hooks/useChatAgent';

const { 
  sendMessage, 
  chatHistory, 
  getSuggestedQuestions 
} = useChatAgent();
```

### Methods

#### `sendMessage(message: string, context?: Object): Promise<Object>`
Sends a message to the chat agent.

**Parameters:**
- `message`: User's question or message
- `context`: Optional context object

**Returns:** Agent response with suggestions and related resources

#### `getSuggestedQuestions(category?: string): Array<string>`
Gets suggested questions for a specific category.

**Categories:**
- `police`: Police interaction questions
- `housing`: Housing and landlord questions
- `employment`: Job and workplace questions
- `consumer`: Consumer protection questions

### Response Format

```json
{
  "id": 1234567890,
  "type": "agent",
  "content": "Response text with legal information...",
  "suggestions": [
    "Follow-up question 1",
    "Follow-up question 2"
  ],
  "relatedResources": ["police-stop", "consumer-fraud"],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Payment Integration

### Overview
Micro-transaction payments using X402 protocol for premium content access.

### Base URL
```
https://payments.vistara.dev
```

### Implementation

```javascript
import { usePaymentContext } from './hooks/usePaymentContext';

const { createSession, isWalletConnected } = usePaymentContext();
```

### Payment Flow

1. User clicks premium content
2. Payment modal displays with price ($0.001 ETH)
3. User confirms payment through connected wallet
4. X402 payment processed
5. Content unlocked immediately

### Methods

#### `createSession(amount: string): Promise<Object>`
Creates a payment session for premium content.

**Parameters:**
- `amount`: Payment amount (e.g., "$0.001")

**Returns:** Decoded payment response

## Data Models

### User
```typescript
interface User {
  farcasterId?: string;
  baseWalletAddress?: string;
  preferences?: Object;
  purchaseHistory?: Array<string>;
}
```

### Checklist
```typescript
interface Checklist {
  id: string;
  title: string;
  steps: Array<string>;
  tags: Array<string>;
  premium: boolean;
  category: string;
  description: string;
}
```

### ScenarioGuide
```typescript
interface ScenarioGuide {
  id: string;
  title: string;
  modules: Array<{
    title: string;
    content: string;
  }>;
  tags: Array<string>;
  premium: boolean;
  category: string;
  description: string;
}
```

### LegalTerm
```typescript
interface LegalTerm {
  term: string;
  definition: string;
  relatedGuides: Array<string>;
}
```

### Alert
```typescript
interface Alert {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  readStatus: boolean;
  category: string;
}
```

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

- `WALLET_NOT_CONNECTED`: User wallet not connected
- `PAYMENT_FAILED`: Payment transaction failed
- `CONTENT_NOT_FOUND`: Requested content not available
- `NETWORK_ERROR`: Network connectivity issues
- `UNAUTHORIZED`: User not authorized for premium content

### Error Handling Best Practices

1. **Graceful Degradation**: App continues to function with limited features
2. **User-Friendly Messages**: Clear, actionable error messages
3. **Retry Mechanisms**: Automatic retry for transient failures
4. **Fallback Options**: Alternative methods when primary fails

## Rate Limits

### Farcaster Hub API
- 100 requests per minute per IP
- 1000 requests per hour per IP

### Chat Agents API
- 50 messages per minute per user
- 500 messages per hour per user

### Payment API
- 10 payment attempts per minute per wallet
- 100 payments per hour per wallet

## Security Considerations

1. **Input Validation**: All user inputs validated and sanitized
2. **HTTPS Only**: All API communications over HTTPS
3. **Wallet Security**: Private keys never stored or transmitted
4. **Content Filtering**: Legal content reviewed for accuracy
5. **Rate Limiting**: Protection against abuse and spam

## Development Environment

### Local Development
```bash
npm install
npm run dev
```

### Environment Variables
```env
VITE_FARCASTER_HUB_URL=https://hub-api.farcaster.xyz:2281
VITE_CHAT_AGENT_URL=https://api.base.org/chat-agents/v1
VITE_PAYMENT_URL=https://payments.vistara.dev
```

### Testing
```bash
npm run test
npm run test:integration
```

## Support

For technical support or API questions:
- Email: support@rightcheck.app
- Documentation: https://docs.rightcheck.app
- GitHub Issues: https://github.com/rightcheck/issues

## Legal Disclaimer

RightCheck provides general legal information, not legal advice. Users should consult qualified attorneys for specific legal matters. The app includes appropriate disclaimers and encourages professional legal consultation when needed.
