import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { MessageStatus as MessageStatusType } from '@/types/chat';
import { COLORS } from '@/constants/colors';

type MessageStatusProps = {
  status: MessageStatusType;
};

const MessageStatus: React.FC<MessageStatusProps> = ({ status }) => {
  // Different statuses
  // - sending: Gray circle
  // - sent: Single gray check
  // - delivered: Double blue checks
  // - read: Double green checks
  // - error: Red exclamation

  if (status === 'sending') {
    return <View style={[styles.dot, { backgroundColor: COLORS.gray }]} />;
  }

  if (status === 'error') {
    return (
      <View style={[styles.error, { backgroundColor: COLORS.error }]}>
        <View style={styles.errorInner} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Check
        size={12}
        color={getColorForStatus(status)}
        style={status === 'sent' ? {} : styles.firstCheck}
      />
      {(status === 'delivered' || status === 'read') && (
        <Check
          size={12}
          color={getColorForStatus(status)}
          style={styles.secondCheck}
        />
      )}
    </View>
  );
};

const getColorForStatus = (status: MessageStatusType): string => {
  switch (status) {
    case 'sent':
      return COLORS.sent;
    case 'delivered':
      return COLORS.delivered;
    case 'read':
      return COLORS.read;
    default:
      return COLORS.gray;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  firstCheck: {
    marginRight: -6,
  },
  secondCheck: {
    marginLeft: -1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  error: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorInner: {
    width: 2,
    height: 5,
    backgroundColor: COLORS.white,
  },
});

export default MessageStatus;