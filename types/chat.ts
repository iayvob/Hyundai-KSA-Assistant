export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error';

export type QuickAction = {
  id: string;
  text: string;
  icon?: string;
};

export type RichMedia = {
  type: 'image' | 'link' | 'button' | 'card';
  url?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  onPress?: () => void;
  imageUrl?: string;
};

export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  status: MessageStatus;
  richMedia?: RichMedia[];
};

export type ChatState = {
  messages: Message[];
  isTyping: boolean;
  error: string | null;
};

export type ChatContextType = {
  state: ChatState;
  sendMessage: (text: string) => Promise<void>;
  sendVoiceMessage: (audioData: string) => Promise<void>;
  clearMessages: () => void;
  retryMessage: (messageId: string) => Promise<void>;
};

// Direct Line interfaces
export interface DirectLineToken {
  token: string;
  conversationId: string;
  expiresIn: number;
}

export interface DirectLineActivity {
  type: string;
  from: {
    id: string;
    name?: string;
  };
  text?: string;
  textFormat?: string;
  locale?: string;
  name?: string;
  attachments?: Array<{
    contentType: string;
    contentUrl?: string;
    name?: string;
    content?: any;
  }>;
}

export interface DirectLineSpeechResponse {
  text: string;
  richMedia?: RichMedia[];
  transcribedText?: string;
}