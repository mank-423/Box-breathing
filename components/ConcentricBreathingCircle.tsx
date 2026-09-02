import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
  interpolate,
} from 'react-native-reanimated';
import { Fonts } from '@/constants/theme';

const { width } = Dimensions.get('window');
const BASE_CIRCLE_SIZE = width * 0.42;

interface ConcentricBreathingCircleProps {
  isRunning: boolean;
  phaseIndex: number;
  durationSeconds: number;
  phaseType: 'in' | 'hold' | 'out' | 'hold-out';
  currentColor: string;
  label: string;
  onPress: () => void;
}

export default function ConcentricBreathingCircle({
  isRunning,
  phaseIndex,
  durationSeconds,
  phaseType,
  currentColor,
  label,
  onPress,
}: ConcentricBreathingCircleProps) {
  const breathExpansion = useSharedValue(0);

  useEffect(() => {
    if (!isRunning || phaseIndex === -1) {
      cancelAnimation(breathExpansion);
      breathExpansion.value = withTiming(0, { duration: 500 });
      return;
    }

    const durationMs = durationSeconds * 1000;

    switch (phaseType) {
      case 'in':
        cancelAnimation(breathExpansion);
        breathExpansion.value = withTiming(1, {
          duration: durationMs,
          easing: Easing.out(Easing.cubic),
        });
        break;

      case 'hold':
        breathExpansion.value = 1;
        break;

      case 'out':
        cancelAnimation(breathExpansion);
        breathExpansion.value = withTiming(0, {
          duration: durationMs,
          easing: Easing.inOut(Easing.cubic),
        });
        break;

      case 'hold-out':
        breathExpansion.value = 0;
        break;
    }
  }, [phaseIndex, isRunning, durationSeconds, phaseType, breathExpansion]);

  const coreCircleStyle = useAnimatedStyle(() => {
    const scale = interpolate(breathExpansion.value, [0, 1], [0.85, 1.35]);
    return { transform: [{ scale }] };
  });

  const ring1Style = useAnimatedStyle(() => {
    const scale = interpolate(breathExpansion.value, [0, 1], [1.05, 1.65]);
    const opacity = interpolate(breathExpansion.value, [0, 1], [0.25, 0.5]);
    return { transform: [{ scale }], opacity };
  });

  const ring2Style = useAnimatedStyle(() => {
    const scale = interpolate(breathExpansion.value, [0, 1], [1.25, 2.05]);
    const opacity = interpolate(breathExpansion.value, [0, 1], [0.15, 0.35]);
    return { transform: [{ scale }], opacity };
  });

  const ring3Style = useAnimatedStyle(() => {
    const scale = interpolate(breathExpansion.value, [0, 1], [1.45, 2.45]);
    const opacity = interpolate(breathExpansion.value, [0, 1], [0.05, 0.2]);
    return { transform: [{ scale }], opacity };
  });

  return (
    <Pressable
      style={styles.visualizerContainer}
      onPress={onPress}
      disabled={isRunning}
      hitSlop={20}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.concentricRing,
          styles.outerRing,
          { borderColor: currentColor },
          ring3Style,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.concentricRing,
          styles.middleRing,
          { borderColor: currentColor, backgroundColor: `${currentColor}15` },
          ring2Style,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.concentricRing,
          { borderColor: currentColor, backgroundColor: `${currentColor}30` },
          ring1Style,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.coreCircle,
          coreCircleStyle,
          { borderColor: currentColor, shadowColor: currentColor },
        ]}
      />
      <Text
        pointerEvents="none"
        style={styles.phaseLabel}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  visualizerContainer: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  concentricRing: {
    position: 'absolute',
    width: BASE_CIRCLE_SIZE,
    height: BASE_CIRCLE_SIZE,
    borderRadius: BASE_CIRCLE_SIZE / 2,
    borderWidth: 1.5,
  },
  middleRing: {
    borderWidth: 2,
  },
  outerRing: {
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  coreCircle: {
    width: BASE_CIRCLE_SIZE,
    height: BASE_CIRCLE_SIZE,
    borderRadius: BASE_CIRCLE_SIZE / 2,
    borderWidth: 4,
    backgroundColor: 'rgba(10, 15, 30, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 10,
  },
  phaseLabel: {
    ...Fonts.subtitle,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
    zIndex: 5,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 16,
    maxWidth: width * 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});