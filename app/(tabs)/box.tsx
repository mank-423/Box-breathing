import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Fonts } from '@/constants/theme';
import useStore from '@/store/zustand-store';
import BreathingContainer from '@/components/BreathingContainer';

const PHASES = [
  { label: 'BREATHE IN', message: 'Inhale deeply', color: '#4A90D9', duration: 4 },
  { label: 'HOLD', message: 'Hold your breath', color: '#F39C12', duration: 4 },
  { label: 'BREATHE OUT', message: 'Exhale slowly', color: '#E74C3C', duration: 4 },
  { label: 'HOLD', message: 'Hold your breath', color: '#9B59B6', duration: 4 },
];

// Individual floating particle dot moving vertically
const FloatingDot = ({ angle, radius, delay, color }: { angle: number; radius: number; delay: number; color: string }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500 + delay, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 1500 + delay, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [delay]);

  const animatedDotStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value }
    ],
  }));

  // Calculate polar positions around the center
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          left: 110 + x - 2,
          top: 110 + y - 2,
          backgroundColor: color,
        },
        animatedDotStyle,
      ]}
    />
  );
};

export default function Box() {
  const { width } = useWindowDimensions();
  const { boxBreathingState } = useStore();

  const [phaseIndex, setPhaseIndex] = useState(-1);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reanimated shared values
  const circleScale = useSharedValue(1);
  const particleScale = useSharedValue(1);

  // Generate particle positions outside the circle boundary
  const particles = useMemo(() => {
    const list = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      // Stagger radius slightly between 82 and 100 for natural halo ring effect
      const radius = 84 + (i % 3) * 8; 
      const delay = (i % 6) * 150;
      list.push({ id: i, angle, radius, delay });
    }
    return list;
  }, []);

  // Sync size scale with current breathing phase
  useEffect(() => {
    if (!isRunning || phaseIndex === -1) {
      circleScale.value = withTiming(1, { duration: 500 });
      particleScale.value = withTiming(1, { duration: 500 });
      return;
    }

    const durationMs = PHASES[phaseIndex].duration * 1000;

    switch (phaseIndex) {
      case 0: // BREATHE IN
        circleScale.value = withTiming(1.3, { duration: durationMs, easing: Easing.out(Easing.ease) });
        particleScale.value = withTiming(1.25, { duration: durationMs, easing: Easing.out(Easing.ease) });
        break;

      case 1: // HOLD
        circleScale.value = 1.3;
        particleScale.value = 1.25;
        break;

      case 2: // BREATHE OUT
        circleScale.value = withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.ease) });
        particleScale.value = withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.ease) });
        break;

      case 3: // HOLD
        circleScale.value = 1;
        particleScale.value = 1;
        break;
    }
  }, [phaseIndex, isRunning]);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const animatedParticleContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: particleScale.value }],
  }));

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetAll = useCallback(() => {
    cleanup();
    setIsRunning(false);
    setPhaseIndex(-1);
    setTime(0);
    setCycleCount(0);
    circleScale.value = withTiming(1, { duration: 400 });
    particleScale.value = withTiming(1, { duration: 400 });
  }, [cleanup]);

  const runPhase = useCallback((index: number, cycle: number) => {
    cleanup();

    if (cycle >= boxBreathingState) {
      resetAll();
      return;
    }

    if (index >= PHASES.length) {
      const newCycle = cycle + 1;
      setCycleCount(newCycle);
      if (newCycle >= boxBreathingState) {
        resetAll();
        return;
      }
      timeoutRef.current = setTimeout(() => runPhase(0, newCycle), 0);
      return;
    }

    const phase = PHASES[index];
    setPhaseIndex(index);
    setTime(phase.duration);

    let countdown = phase.duration;
    intervalRef.current = setInterval(() => {
      countdown--;
      setTime(countdown);
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      runPhase(index + 1, cycle);
    }, phase.duration * 1000);
  }, [boxBreathingState, cleanup, resetAll]);

  const onClick = useCallback(() => {
    if (isRunning) return;
    resetAll();
    setIsRunning(true);
    setCycleCount(0);
    runPhase(0, 0);
  }, [isRunning, resetAll, runPhase]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const current = phaseIndex >= 0 ? PHASES[phaseIndex] : null;
  const currentColor = current?.color || '#4A90D9';
  const statusText = isRunning ? (current?.message || '') : 'Tap GO to start';
  const cycleText = isRunning ? `Cycle ${cycleCount + 1}/${boxBreathingState}` : '';

  return (
    <BreathingContainer
      title="Box Breathing"
      subtitle="4-4-4-4 · Balance & Focus"
      timer={time}
      isRunning={isRunning}
      cycleText={cycleText}
      statusText={statusText}
      showButton={false}
      phaseColors={['#4A90D9', '#F39C12', '#E74C3C', '#9B59B6']}
    >
      <Pressable 
        style={styles.circleWrapper} 
        onPress={onClick}
        disabled={isRunning}
        hitSlop={15}
      >
        {/* Floating particles ring outside the central circle */}
        <Animated.View pointerEvents="none" style={[styles.particleField, animatedParticleContainerStyle]}>
          {particles.map((p) => (
            <FloatingDot 
              key={p.id} 
              angle={p.angle} 
              radius={p.radius} 
              delay={p.delay} 
              color={currentColor} 
            />
          ))}
        </Animated.View>

        {/* Solid inner outline ring */}
        <Animated.View 
          pointerEvents="none" 
          style={[
            styles.animatedCircle, 
            animatedCircleStyle,
            { borderColor: currentColor }
          ]}
        />

        <Text 
          pointerEvents="none" 
          style={styles.phaseLabel}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {current?.label || 'GO'}
        </Text>
      </Pressable>
    </BreathingContainer>
  );
}

const styles = StyleSheet.create({
  circleWrapper: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  particleField: {
    width: 220,
    height: 220,
    position: 'absolute',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    opacity: 0.85,
  },
  animatedCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  phaseLabel: {
    ...Fonts.subtitle,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    zIndex: 2,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 16,
    maxWidth: 160,
  },
});