import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
  Animated as RNAnimated,
  PermissionsAndroid,
  Alert,
  Text,
} from 'react-native';
import { Mic, Send, X, Camera } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { useChatContext } from '@/context/ChatContext';
import { COLORS } from '@/constants/colors';
import { FONTS, SHADOWS } from '@/constants/theme';
import { MAX_RECORDING_DURATION } from '@/config/botConfig';

interface ChatInputProps {
  onMessageSent?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onMessageSent }) => {
  const { sendMessage, sendVoiceMessage } = useChatContext();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const inputRef = useRef<TextInput>(null);
  const recordingAnimation = useSharedValue(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;
  const audioRecording = useRef<Audio.Recording | null>(null);

  // Check and request microphone permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'The app needs access to your microphone to record voice messages.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setHasPermission(permission === PermissionsAndroid.RESULTS.GRANTED);
      } else if (Platform.OS === 'ios') {
        const { status } = await Audio.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      } else {
        // Web platform
        setHasPermission(true);
      }
    })();
  }, []);

  // Animation for the recording button
  const recordingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isRecording ? 1.2 : 1) },
      ],
      backgroundColor: isRecording ? COLORS.error : COLORS.primary,
    };
  });
  
  // Pulse animation for recording
  useEffect(() => {
    if (isRecording) {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          RNAnimated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      pulseAnim.stopAnimation();
    };
  }, [isRecording, pulseAnim]);

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000) as unknown as NodeJS.Timeout;
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const handleSendMessage = async () => {
    if (text.trim() === '') return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const messageText = text.trim();
    setText('');
    await sendMessage(messageText);
    
    if (onMessageSent) {
      onMessageSent();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Start audio recording
  const startRecording = async () => {
    try {
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Microphone permission is required to record audio');
        return;
      }

      // Configure audio recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        // Use the Audio.InterruptionModeIOS enum
        interruptionModeIOS: Audio.InterruptionModeIOS.DoNotMix,
        // Use the Audio.InterruptionModeAndroid enum
        interruptionModeAndroid: Audio.InterruptionModeAndroid.DoNotMix,
      });

      // Create a new recording with high quality settings for better speech recognition
      const recording = new Audio.Recording();
      
      // Use high quality audio for better speech recognition
      await recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });
      
      console.log('Starting audio recording');
      await recording.startAsync();
      audioRecording.current = recording;

      // Set a timer to automatically stop recording after MAX_RECORDING_DURATION seconds
      setTimeout(() => {
        if (isRecording) {
          console.log(`Auto-stopping recording after ${MAX_RECORDING_DURATION} seconds`);
          toggleRecording();
        }
      }, MAX_RECORDING_DURATION * 1000);

      // Provide feedback that recording started
      if (Platform.OS !== 'web') {
        Speech.speak('Recording started', { rate: 0.8 });
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  // Stop audio recording and send to Microsoft Copilot
  const stopRecording = async () => {
    try {
      if (!audioRecording.current) return;

      console.log('Stopping audio recording');
      
      // Stop the recording
      await audioRecording.current.stopAndUnloadAsync();
      
      // Get the recording URI
      const uri = audioRecording.current.getURI();
      
      if (uri) {
        console.log('Audio recording URI:', uri);
        
        // Provide feedback
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Provide user feedback that processing is happening
        setText('Processing voice message...');
        setTimeout(() => setText(''), 2000);
        
        try {
          // Send the voice message
          await sendVoiceMessage(uri);
        } catch (sendError) {
          console.error('Error sending voice message:', sendError);
          Alert.alert(
            'Voice Processing Error',
            'We had trouble understanding that. Please try again or type your message instead.',
            [{ text: 'OK' }]
          );
        }
      } else {
        console.error('No URI returned from recording');
        Alert.alert('Error', 'Failed to process recording. Please try again.');
      }
      
      // Reset the recording
      audioRecording.current = null;
      
      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to process voice recording. Please try again.');
    }
  };

  const toggleRecording = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      recordingAnimation.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      await stopRecording();
      
      if (onMessageSent) {
        onMessageSent();
      }
    } else {
      // Start recording
      setIsRecording(true);
      recordingAnimation.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      await startRecording();
    }
  };

  const cancelRecording = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setIsRecording(false);
    recordingAnimation.value = withTiming(0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    // Cancel and clean up recording
    if (audioRecording.current) {
      try {
        await audioRecording.current.stopAndUnloadAsync();
        audioRecording.current = null;
        
        // Reset audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
      } catch (error) {
        console.error('Error canceling recording:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {isRecording ? (
        <Animated.View
          style={[styles.recordingContainer, { opacity: recordingAnimation.value }]}
        >
          <BlurView intensity={80} tint="light" style={styles.blurContainer}>
            <RNAnimated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.recordingContent}>
              <View style={styles.recordingInfo}>
                <View style={styles.recordingDot} />
                <View style={styles.recordingTime}>
                  <Animated.Text style={styles.recordingTimeText}>
                    {formatTime(recordingTime)}
                  </Animated.Text>
                </View>
              </View>
              
              <View style={styles.recordingActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={cancelRecording}
                >
                  <X size={20} color={COLORS.white} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.stopButton]}
                  onPress={toggleRecording}
                >
                  <Send size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Animated.View>
      ) : (
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={20} color={COLORS.gray} />
          </TouchableOpacity>
          
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.gray}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
          />
          
          {text.trim() === '' ? (
            <TouchableOpacity
              style={[styles.sendButton, recordingStyle]}
              onPress={toggleRecording}
            >
              <Mic size={20} color={COLORS.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Send size={20} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    ...FONTS.body2,
    maxHeight: 100,
    backgroundColor: COLORS.ultraLightGray,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  cameraButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  blurContainer: {
    padding: 16,
    borderRadius: 16,
  },
  pulseCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(230, 51, 18, 0.2)',
    alignSelf: 'center',
  },
  recordingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.error,
    marginRight: 8,
  },
  recordingTime: {
    justifyContent: 'center',
  },
  recordingTimeText: {
    ...FONTS.h4,
    color: COLORS.black,
  },
  recordingActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: COLORS.gray,
  },
  stopButton: {
    backgroundColor: COLORS.primary,
  },
});

export default ChatInput;