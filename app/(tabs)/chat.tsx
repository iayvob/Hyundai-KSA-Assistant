import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatContext } from '@/context/ChatContext';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import ChatHeader from '@/components/chat/ChatHeader';
import TypingIndicator from '@/components/chat/TypingIndicator';
import QuickActions from '@/components/chat/QuickActions';
import { COLORS } from '@/constants/colors';
import { FONTS, SHADOWS } from '@/constants/theme';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInDown 
} from 'react-native-reanimated';

export default function ChatScreen() {
  const { state, clearMessages } = useChatContext();
  const { messages, isTyping, error } = state;
  const flatListRef = useRef<FlatList | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  
  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    return (
      <ChatBubble
        message={item}
        isLastMessage={index === messages.length - 1}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ChatHeader onClearChat={clearMessages} />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {messages.length === 0 ? (
          <Animated.View 
            entering={FadeIn} 
            style={styles.emptyStateContainer}
          >
            <Text style={styles.welcomeTitle}>Welcome to Hyundai KSA</Text>
            <Text style={styles.welcomeText}>
              I'm your virtual assistant. How can I help you today?
            </Text>
            
            {showQuickActions && (
              <Animated.View 
                entering={SlideInDown.duration(500).delay(300)} 
                style={styles.quickActionsContainer}
              >
                <QuickActions onHide={() => setShowQuickActions(false)} />
              </Animated.View>
            )}
          </Animated.View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
          />
        )}

        {isTyping && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.typingContainer}
          >
            <TypingIndicator />
          </Animated.View>
        )}

        {error && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.errorContainer}
          >
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}

        <ChatInput onMessageSent={scrollToBottom} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.ultraLightGray,
  },
  container: {
    flex: 1,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#FFECEC',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
    ...SHADOWS.light,
  },
  errorText: {
    ...FONTS.body3,
    color: COLORS.error,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcomeTitle: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    ...FONTS.body2,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 32,
  },
  quickActionsContainer: {
    width: '100%',
  },
});