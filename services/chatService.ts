import { Message, MessageStatus, DirectLineSpeechResponse } from '@/types/chat';
import { storeMessages, getStoredMessages } from '@/utils/storage';
import { AgentApplication, CloudAdapter, TurnContext } from '@microsoft/agents-hosting';
import { ActivityTypes } from '@microsoft/agents-activity';
import { NATIVE_APP_CHANNEL_ENDPOINT, USE_MOCK_DATA } from '@/config/botConfig';

// Initialize AgentApplication
const app = new AgentApplication({
  storage: undefined, // Replace with actual storage implementation if needed
});

// Correct initialization of CloudAdapter with fallback to mock values if not in production
const adapter = new CloudAdapter({
  clientId: process.env.CLIENT_ID || 'mock-client-id',
  clientSecret: process.env.CLIENT_SECRET || 'mock-client-secret',
  tenantId: process.env.TENANT_ID || 'mock-tenant-id',
  issuers: ['https://login.microsoftonline.com'],
});

// Function to send a message to the bot using native app channel
export const sendMessageToAPI = async (text: string): Promise<DirectLineSpeechResponse> => {
  try {
    // For mock/development purposes
    if (USE_MOCK_DATA) {
      console.log('Using mock data for text message');
      return {
        text: `This is a mock response to: "${text}"`,
        richMedia: []
      };
    }

    // Send message to bot using CloudAdapter
    const context = new TurnContext(adapter, {
      type: ActivityTypes.Message,
      text,
      from: { id: 'user', name: 'User' },
      recipient: { id: 'bot', name: 'Bot' },
      conversation: { id: 'conversationId' },
      channelId: 'directline', // Changed from 'nativeapp' to a known channel type
      serviceUrl: process.env.NATIVE_APP_CHANNEL_ENDPOINT || NATIVE_APP_CHANNEL_ENDPOINT,
    });

    // Process message and get response
    let responseText = '';
    let responseAttachments: any[] = [];
    
    // Add a response handler to capture the bot's reply
    context.onSendActivities(async (_, activities, next) => {
      for (const activity of activities) {
        if (activity.type === ActivityTypes.Message) {
          responseText = activity.text || '';
          responseAttachments = activity.attachments || [];
        }
      }
      return await next();
    });
    
    // Run the bot
    await app.run(context);
    
    // Return the response in the expected format
    return {
      text: responseText || "I didn't understand that. Can you try again?",
      richMedia: processAttachments(responseAttachments)
    };
  } catch (error) {
    console.error('Error sending message to bot:', error);
    throw error;
  }
};

// Process voice message using native app channel
export const sendVoiceMessageDirectLine = async (_audioUri: string): Promise<DirectLineSpeechResponse> => {
  try {
    // For mock/development purposes
    if (USE_MOCK_DATA) {
      console.log('Using mock data for voice message');
      return {
        text: "I understand you're interested in Hyundai models. How can I help you today?",
        richMedia: [],
        transcribedText: "Tell me about Hyundai models"
      };
    }

    // In a real implementation, we would:
    // 1. Convert audio to text using a service like Azure Cognitive Services
    // 2. Send the transcribed text to the bot using the native app channel
    
    // For now, we'll use a simpler approach and just treat it as a text message
    const transcribedText = "Voice message processed"; // This would be the result of speech-to-text
    
    const botResponse = await sendMessageToAPI(transcribedText);
    
    return {
      ...botResponse,
      transcribedText
    };
  } catch (error) {
    console.error('Error processing voice message:', error);
    throw error;
  }
};

// Helper function to process attachments from bot response
const processAttachments = (attachments: any[] = []): any[] => {
  return attachments.map(attachment => {
    // Process different attachment types based on contentType
    switch (attachment.contentType) {
      case 'image/png':
      case 'image/jpeg':
        return {
          type: 'image',
          url: attachment.contentUrl,
          title: attachment.name
        };
      case 'application/vnd.microsoft.card.hero':
        const content = attachment.content;
        return {
          type: 'card',
          title: content.title,
          description: content.text,
          imageUrl: content.images?.[0]?.url,
          buttonText: content.buttons?.[0]?.title,
          url: content.buttons?.[0]?.value
        };
      default:
        return null;
    }
  }).filter(Boolean);
};

// Load messages from storage
export const loadMessages = async (): Promise<Message[]> => {
  return await getStoredMessages();
};

// Save messages to storage
export const saveMessages = async (messages: Message[]): Promise<void> => {
  await storeMessages(messages);
};

// Update message status
export const updateMessageStatus = async (
  messages: Message[],
  messageId: string,
  status: MessageStatus
): Promise<Message[]> => {
  const updatedMessages = messages.map(message =>
    message.id === messageId ? { ...message, status } : message
  );
  await saveMessages(updatedMessages);
  return updatedMessages;
};

// Simulate message delivery status changes
export const simulateMessageDelivery = async (
  messages: Message[],
  messageId: string,
  callback: (updatedMessages: Message[]) => void
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const sentMessages = await updateMessageStatus(messages, messageId, 'sent');
  callback(sentMessages);

  await new Promise(resolve => setTimeout(resolve, 1000));
  const deliveredMessages = await updateMessageStatus(sentMessages, messageId, 'delivered');
  callback(deliveredMessages);

  await new Promise(resolve => setTimeout(resolve, 1000));
  const readMessages = await updateMessageStatus(deliveredMessages, messageId, 'read');
  callback(readMessages);
};