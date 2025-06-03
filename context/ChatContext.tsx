import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ChatContextType, ChatState, Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import {
  loadMessages,
  saveMessages,
  sendMessageToAPI,
  simulateMessageDelivery,
  sendVoiceMessageDirectLine,
} from '@/services/chatService';

// Initial state for the chat
const initialState: ChatState = {
  messages: [],
  isTyping: false,
  error: null,
};

// Actions
type ChatAction =
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' };

// Reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.id
            ? { ...message, ...action.payload.updates }
            : message
        ),
      };
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
};

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load messages from storage on initialization
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const savedMessages = await loadMessages();
        dispatch({ type: 'SET_MESSAGES', payload: savedMessages });
      } catch (error) {
        console.error('Error loading messages:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load previous messages' });
      }
    };

    fetchMessages();
  }, []);

  // Save messages to storage whenever they change
  useEffect(() => {
    if (state.messages.length > 0) {
      saveMessages(state.messages);
    }
  }, [state.messages]);

  // Send a text message
  const sendMessage = async (text: string): Promise<void> => {
    try {
      // Create and add user message
      const userMessageId = uuidv4();
      const userMessage: Message = {
        id: userMessageId,
        text,
        sender: 'user',
        timestamp: Date.now(),
        status: 'sending',
      };

      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      // Simulate message delivery status changes
      simulateMessageDelivery(
        [...state.messages, userMessage],
        userMessageId,
        (updatedMessages) => {
          dispatch({ type: 'SET_MESSAGES', payload: updatedMessages });
        }
      );

      // Set bot to typing
      dispatch({ type: 'SET_TYPING', payload: true });

      // Get response from API
      const response = await sendMessageToAPI(text);

      // Add bot response after a small delay
      setTimeout(() => {
        const botMessage: Message = {
          id: uuidv4(),
          text: response.text,
          sender: 'assistant',
          timestamp: Date.now(),
          status: 'delivered',
          richMedia: response.richMedia,
        };

        dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
        dispatch({ type: 'SET_TYPING', payload: false });
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update user message status to error
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          id: state.messages[state.messages.length - 1]?.id,
          updates: { status: 'error' },
        },
      });
      
      dispatch({ type: 'SET_TYPING', payload: false });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message' });
    }
  };

  // Send a voice message
  const sendVoiceMessage = async (audioUri: string): Promise<void> => {
    try {
      // Create a user message with "..." to indicate that voice is being processed
      const userMessageId = uuidv4();
      const userMessage: Message = {
        id: userMessageId,
        text: "🎤 Processing voice message...",
        sender: 'user',
        timestamp: Date.now(),
        status: 'sending',
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
      
      // Simulate message delivery status changes
      simulateMessageDelivery(
        [...state.messages, userMessage],
        userMessageId,
        (updatedMessages) => {
          dispatch({ type: 'SET_MESSAGES', payload: updatedMessages });
        }
      );
      
      // Set bot to typing
      dispatch({ type: 'SET_TYPING', payload: true });
      
      // Process the voice message using Native App Channel
      console.log('Processing voice message with Native App Channel');
      
      // Use the Native App Channel service to process the voice message
      let response;
      try {
        response = await sendVoiceMessageDirectLine(audioUri);
      } catch (speechError) {
        console.error('Error processing voice message:', speechError);
        
        // Handle error but continue with a default response
        response = {
          text: "I'm sorry, I couldn't understand the audio. Could you try again or type your message?",
          richMedia: [],
          transcribedText: "Error processing voice"
        };
      }
      
      // Update the user message with the transcribed text (if available)
      if (response.transcribedText) {
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            id: userMessageId,
            updates: { text: response.transcribedText },
          },
        });
      } else {
        // If no transcribed text is available, update with a generic message
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            id: userMessageId,
            updates: { text: "🎤 Voice message sent" },
          },
        });
      }
      
      // Add bot response after a small delay
      setTimeout(() => {
        const botMessage: Message = {
          id: uuidv4(),
          text: response.text,
          sender: 'assistant',
          timestamp: Date.now(),
          status: 'delivered',
          richMedia: response.richMedia,
        };
        
        dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
        dispatch({ type: 'SET_TYPING', payload: false });
      }, 1000);
      
    } catch (error) {
      console.error('Error processing voice message:', error);
      
      // Update user message status to error
      if (state.messages.length > 0) {
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            id: state.messages[state.messages.length - 1]?.id,
            updates: { 
              status: 'error',
              text: "Voice message processing failed" 
            },
          },
        });
      }
      
      dispatch({ type: 'SET_TYPING', payload: false });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to process voice message' });
    }
  };

  // Clear all messages
  const clearMessages = async (): Promise<void> => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    await saveMessages([]);
  };

  // Retry sending a failed message
  const retryMessage = async (messageId: string): Promise<void> => {
    const message = state.messages.find(msg => msg.id === messageId);
    
    if (message && message.status === 'error') {
      // Update message status to sending
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          id: messageId,
          updates: { status: 'sending' },
        },
      });
      
      try {
        // Retry sending the message
        await sendMessage(message.text);
      } catch (error) {
        console.error('Error retrying message:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to retry message' });
      }
    }
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        sendMessage,
        sendVoiceMessage,
        clearMessages,
        retryMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};