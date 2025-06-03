import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MoveVertical as MoreVertical, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { FONTS, SHADOWS } from '@/constants/theme';

interface ChatHeaderProps {
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat }) => {
  const confirmClearChat = () => {
    Alert.alert(
      "Clear Conversation",
      "Are you sure you want to clear the entire conversation history?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          onPress: onClearChat,
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.iconButton}>
              <ArrowLeft size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.centerSection}>
            <Text style={styles.title}>Hyundai Assistant</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
          
          <View style={styles.rightSection}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={confirmClearChat}
            >
              <Trash2 size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MoreVertical size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  safeArea: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  statusText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
});

export default ChatHeader;