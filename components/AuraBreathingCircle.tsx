import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const VISUALIZER_SIZE = width * 0.75;
const CORE_SIZE = VISUALIZER_SIZE * 0.65;

interface AuraBreathingCircleProps {
  isRunning: boolean;
  phaseIndex: number;
  durationSeconds: number;
  phaseType: 'in' | 'hold' | 'out' | 'hold-out';
  currentColor: string;
  secondaryColor?: string;
  idleColor: string;
  idleSecondaryColor?: string;
  label: string;
  timer: number;
  onPress: () => void;
}

export default function AuraBreathingCircle({
  isRunning,
  phaseIndex,
  durationSeconds,
  phaseType,
  currentColor,
  secondaryColor,
  idleColor,
  idleSecondaryColor,
  label,
  timer,
  onPress,
}: AuraBreathingCircleProps) {
  const breathExpansion = useSharedValue(0);
  const holdPulse = useSharedValue(0);

  const isHold = phaseType === 'hold' || phaseType === 'hold-out';

  useEffect(() => {
    if (!isRunning || phaseIndex === -1) {
      cancelAnimation(breathExpansion);
      cancelAnimation(holdPulse);
      breathExpansion.value = withTiming(0, { duration: 400 });
      holdPulse.value = withTiming(0, { duration: 400 });
      return;
    }

    const durationMs = durationSeconds * 1000;

    switch (phaseType) {
      case 'in':
        cancelAnimation(holdPulse);
        holdPulse.value = withTiming(0, { duration: 300 });
        cancelAnimation(breathExpansion);
        breathExpansion.value = withTiming(1, {
          duration: durationMs,
          easing: Easing.bezier(0.37, 0, 0.63, 1),
        });
        break;

      case 'out':
        cancelAnimation(holdPulse);
        holdPulse.value = withTiming(0, { duration: 300 });
        cancelAnimation(breathExpansion);
        breathExpansion.value = withTiming(0, {
          duration: durationMs,
          easing: Easing.bezier(0.37, 0, 0.63, 1),
        });
        break;

      case 'hold':
      case 'hold-out':
        // Freeze expansion where it is, but add a slow gentle pulse
        // so the hold reads as "alive/waiting", not stuck.
        cancelAnimation(breathExpansion);
        cancelAnimation(holdPulse);
        holdPulse.value = withRepeat(
          withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        );
        break;
    }

    return () => {
      cancelAnimation(breathExpansion);
      cancelAnimation(holdPulse);
    };
  }, [phaseIndex, isRunning, durationSeconds, phaseType, breathExpansion, holdPulse]);

  const coreStyle = useAnimatedStyle(() => {
    const baseScale = interpolate(breathExpansion.value, [0, 1], [0.85, 1.35]);
    const pulse = interpolate(holdPulse.value, [0, 1], [0, 0.03]);
    return { transform: [{ scale: baseScale * (1 + pulse) }] };
  });

  const aura1Style = useAnimatedStyle(() => {
    const scale = interpolate(breathExpansion.value, [0, 1], [1.0, 1.65]);
    const opacity = interpolate(breathExpansion.value, [0, 1], [0.15, 0.45]);
    return { transform: [{ scale }], opacity };
  });

  const aura2Style = useAnimatedStyle(() => {
    const scale = interpolate(breathExpansion.value, [0, 1], [1.15, 2.1]);
    const opacity = interpolate(breathExpansion.value, [0, 1], [0.08, 0.25]);
    return { transform: [{ scale }], opacity };
  });

  const effectiveColor = isRunning ? currentColor : idleColor;
  const effectiveAlt = isRunning ? (secondaryColor || currentColor) : (idleSecondaryColor || idleColor);

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      disabled={isRunning}
      hitSlop={20}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.aura,
          {
            backgroundColor: effectiveColor,
            width: CORE_SIZE,
            height: CORE_SIZE,
            borderRadius: CORE_SIZE / 2,
          },
          aura2Style,
        ]}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.aura,
          {
            backgroundColor: effectiveAlt,
            width: CORE_SIZE,
            height: CORE_SIZE,
            borderRadius: CORE_SIZE / 2,
          },
          aura1Style,
        ]}
      />

      <Animated.View style={[styles.coreSphere, { shadowColor: effectiveColor }, coreStyle]}>
        <LinearGradient
          colors={[effectiveColor, effectiveAlt]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCore}
        />
      </Animated.View>

      <View pointerEvents="none" style={styles.centerOverlay}>
        <Text style={styles.centerLabel}>
          {isRunning ? label : 'TAP TO START'}
        </Text>
        {isRunning && timer > 0 && (
          <Text style={styles.timerSubtext}>{`${timer}s`}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: VISUALIZER_SIZE,
    height: VISUALIZER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  aura: {
    position: 'absolute',
  },
  coreSphere: {
    width: CORE_SIZE,
    height: CORE_SIZE,
    borderRadius: CORE_SIZE / 2,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 8,
  },
  gradientCore: {
    flex: 1,
    borderRadius: CORE_SIZE / 2,
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  timerSubtext: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});