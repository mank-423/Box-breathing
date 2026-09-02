import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
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
  label,
  timer,
  onPress,
}: AuraBreathingCircleProps) {
  const breathExpansion = useSharedValue(0);

  useEffect(() => {
    // Stop and reset immediately when session ends or component unmounts
    if (!isRunning || phaseIndex === -1) {
      cancelAnimation(breathExpansion);
      breathExpansion.value = withTiming(0, { duration: 400 });
      return;
    }

    const durationMs = durationSeconds * 1000;

    switch (phaseType) {
      case 'in':
        cancelAnimation(breathExpansion);
        breathExpansion.value = withTiming(1, {
          duration: durationMs,
          easing: Easing.bezier(0.37, 0, 0.63, 1),
        });
        break;

      case 'hold':
        // Maintain static scale during holds
        break;

      case 'out':
        cancelAnimation(breathExpansion);
        breathExpansion.value = withTiming(0, {
          duration: durationMs,
          easing: Easing.bezier(0.37, 0, 0.63, 1),
        });
        break;

      case 'hold-out':
        breathExpansion.value = 0;
        break;
    }

    return () => {
      cancelAnimation(breathExpansion);
    };
  }, [phaseIndex, isRunning, durationSeconds, phaseType, breathExpansion]);

  const coreStyle = useAnimatedStyle(() => {
    const scale = interpolate(breathExpansion.value, [0, 1], [0.85, 1.35]);
    return { transform: [{ scale }] };
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

  const altColor = secondaryColor || currentColor;

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      disabled={isRunning}
      hitSlop={20}
    >
      {/* Outer Expanding Aura */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.aura,
          {
            backgroundColor: currentColor,
            width: CORE_SIZE,
            height: CORE_SIZE,
            borderRadius: CORE_SIZE / 2,
          },
          aura2Style,
        ]}
      />

      {/* Middle Expanding Aura */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.aura,
          {
            backgroundColor: altColor,
            width: CORE_SIZE,
            height: CORE_SIZE,
            borderRadius: CORE_SIZE / 2,
          },
          aura1Style,
        ]}
      />

      {/* Inner Gradient Core Sphere */}
      <Animated.View style={[styles.coreSphere, coreStyle]}>
        <LinearGradient
          colors={[currentColor, altColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCore}
        />
      </Animated.View>

      {/* Center Label & Counter */}
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
    marginVertical: 20,
  },
  aura: {
    position: 'absolute',
  },
  coreSphere: {
    width: CORE_SIZE,
    height: CORE_SIZE,
    borderRadius: CORE_SIZE / 2,
    overflow: 'hidden',
    shadowColor: '#00F2FE',
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