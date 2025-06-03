import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Car, Calendar, Tag, MapPin, CircleAlert as AlertCircle, Info, X } from 'lucide-react-native';
import { useChatContext } from '@/context/ChatContext';
import { COLORS } from '@/constants/colors';
import { FONTS, SHADOWS } from '@/constants/theme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const quickActions = [
  {
    id: '1',
    text: 'Explore Models',
    icon: Car,
    message: 'What models does Hyundai currently offer?',
  },
  {
    id: '2',
    text: 'Schedule Test Drive',
    icon: Calendar,
    message: 'I\'d like to schedule a test drive',
  },
  {
    id: '3',
    text: 'Pricing Information',
    icon: Tag,
    message: 'Can you tell me about the pricing for Hyundai models?',
  },
  {
    id: '4',
    text: 'Find Dealership',
    icon: MapPin,
    message: 'Where is the nearest Hyundai dealership?',
  },
  {
    id: '5',
    text: 'Warranty Info',
    icon: AlertCircle,
    message: 'What warranty options does Hyundai offer?',
  },
  {
    id: '6',
    text: 'Special Offers',
    icon: Info,
    message: 'Are there any special offers or promotions currently available?',
  },
];

interface QuickActionsProps {
  onHide: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onHide }) => {
  const { sendMessage } = useChatContext();

  const handleActionPress = async (message: string) => {
    await sendMessage(message);
    onHide();
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(300)} 
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Quick Actions</Text>
        <TouchableOpacity onPress={onHide} style={styles.closeButton}>
          <X size={18} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {quickActions.slice(0, 3).map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={() => handleActionPress(action.message)}
          >
            <action.icon size={24} color={COLORS.primary} />
            <Text style={styles.actionText}>{action.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {quickActions.slice(3).map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={() => handleActionPress(action.message)}
          >
            <action.icon size={24} color={COLORS.primary} />
            <Text style={styles.actionText}>{action.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...FONTS.h4,
    color: COLORS.primary,
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    paddingBottom: 12,
  },
  actionButton: {
    backgroundColor: COLORS.ultraLightGray,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  actionText: {
    ...FONTS.body3,
    color: COLORS.black,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default QuickActions;