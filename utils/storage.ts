import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '@/types/chat';

const MESSAGES_STORAGE_KEY = '@hyundai_chat_messages';

export const storeMessages = async (messages: Message[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error storing messages:', error);
  }
};

export const getStoredMessages = async (): Promise<Message[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return [];
  }
};

export const clearStoredMessages = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(MESSAGES_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing messages:', error);
  }
};

// Store last session info
export const storeLastSessionTime = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem('@hyundai_last_session', JSON.stringify(Date.now()));
  } catch (error) {
    console.error('Error storing session time:', error);
  }
};

export const getLastSessionTime = async (): Promise<number | null> => {
  try {
    const value = await AsyncStorage.getItem('@hyundai_last_session');
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting session time:', error);
    return null;
  }
};

// Store user preferences
export const storeUserPreference = async (key: string, value: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(`@hyundai_preference_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing preference ${key}:`, error);
  }
};

export const getUserPreference = async (key: string): Promise<any> => {
  try {
    const value = await AsyncStorage.getItem(`@hyundai_preference_${key}`);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error retrieving preference ${key}:`, error);
    return null;
  }
};