import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { format } from 'date-fns';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn } from 'react-native-reanimated';
import { Message } from '@/types/chat';
import { COLORS } from '@/constants/colors';
import { FONTS, SHADOWS } from '@/constants/theme';
import MessageStatus from './MessageStatus';

type ChatBubbleProps = {
  message: Message;
  isLastMessage: boolean;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLastMessage }) => {
  const isUser = message.sender === 'user';
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withSpring(1);
    translateY.value = withSpring(0);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const renderRichMedia = () => {
    if (!message.richMedia || message.richMedia.length === 0) return null;

    return (
      <View style={styles.richMediaContainer}>
        {message.richMedia.map((media, index) => {
          switch (media.type) {
            case 'image':
              return (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    source={{ uri: media.url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  {media.title && <Text style={styles.imageCaption}>{media.title}</Text>}
                </View>
              );
            case 'button':
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.button}
                  onPress={media.onPress}
                >
                  <Text style={styles.buttonText}>{media.buttonText}</Text>
                </TouchableOpacity>
              );
            case 'link':
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.link}
                  onPress={() => media.url && Linking.openURL(media.url)}
                >
                  <Text style={styles.linkText}>{media.title || media.url}</Text>
                  {media.description && (
                    <Text style={styles.linkDescription}>{media.description}</Text>
                  )}
                </TouchableOpacity>
              );
            default:
              return null;
          }
        })}
      </View>
    );
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          SHADOWS.light,
        ]}
      >
        <Text style={styles.text}>{message.text}</Text>
        {renderRichMedia()}
        <View style={styles.timeContainer}>
          <Text style={styles.time}>
            {format(new Date(message.timestamp), 'h:mm a')}
          </Text>
          {isUser && <MessageStatus status={message.status} />}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    marginRight: 16,
  },
  assistantContainer: {
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  bubble: {
    borderRadius: 18,
    padding: 12,
    minWidth: 60,
  },
  userBubble: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: COLORS.assistantBubble,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  text: {
    ...FONTS.body2,
    color: COLORS.black,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  time: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginRight: 4,
  },
  richMediaContainer: {
    marginTop: 8,
  },
  imageContainer: {
    marginVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
  },
  imageCaption: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginTop: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 4,
  },
  buttonText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
  link: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginVertical: 4,
  },
  linkText: {
    ...FONTS.body3,
    color: COLORS.info,
    textDecorationLine: 'underline',
  },
  linkDescription: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginTop: 2,
  },
});

export default ChatBubble;