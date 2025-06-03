import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { SHADOWS } from '@/constants/theme';

const TypingIndicator: React.FC = () => {
  const bubble1Opacity = useSharedValue(0.3);
  const bubble2Opacity = useSharedValue(0.3);
  const bubble3Opacity = useSharedValue(0.3);
  
  const bubble1Scale = useSharedValue(0.8);
  const bubble2Scale = useSharedValue(0.8);
  const bubble3Scale = useSharedValue(0.8);

  // Animation for bubble 1
  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      opacity: bubble1Opacity.value,
      transform: [{ scale: bubble1Scale.value }],
    };
  });

  // Animation for bubble 2
  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      opacity: bubble2Opacity.value,
      transform: [{ scale: bubble2Scale.value }],
    };
  });

  // Animation for bubble 3
  const animatedStyle3 = useAnimatedStyle(() => {
    return {
      opacity: bubble3Opacity.value,
      transform: [{ scale: bubble3Scale.value }],
    };
  });

  useEffect(() => {
    const easing = Easing.bezier(0.25, 0.1, 0.25, 1);
    
    bubble1Opacity.value = withRepeat(
      withTiming(1, { duration: 600, easing }),
      -1,
      true
    );
    
    bubble2Opacity.value = withDelay(
      200,
      withRepeat(
        withTiming(1, { duration: 600, easing }),
        -1,
        true
      )
    );
    
    bubble3Opacity.value = withDelay(
      400,
      withRepeat(
        withTiming(1, { duration: 600, easing }),
        -1,
        true
      )
    );
    
    bubble1Scale.value = withRepeat(
      withTiming(1, { duration: 600, easing }),
      -1,
      true
    );
    
    bubble2Scale.value = withDelay(
      200,
      withRepeat(
        withTiming(1, { duration: 600, easing }),
        -1,
        true
      )
    );
    
    bubble3Scale.value = withDelay(
      400,
      withRepeat(
        withTiming(1, { duration: 600, easing }),
        -1,
        true
      )
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Animated.View style={[styles.dot, animatedStyle1]} />
        <Animated.View style={[styles.dot, animatedStyle2]} />
        <Animated.View style={[styles.dot, animatedStyle3]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  bubble: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginHorizontal: 2,
  },
});

export default TypingIndicator;