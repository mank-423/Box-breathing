import { StyleSheet, View, Text, Pressable } from 'react-native';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import useStore from '@/store/zustand-store';
import { Fonts } from '@/constants/theme';
import BreathingContainer from '@/components/BreathingContainer';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

// High-contrast neon colors that pop against blue/indigo wave patterns:
// Electric Cyan (Breathe) -> Gold (Small Sigh) -> Neon Pink (Breathe Out)
const states = [
  { title: 'Breathe', duration: 5, message: 'Inhale slowly', color: '#00F2FE' },
  { title: 'Small Sigh', duration: 2, message: 'Take one more breath', color: '#FFD700' },
  { title: 'Breathe Out', duration: 5, message: 'Exhale with a sigh', color: '#FF007F' },
];

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
    transform: [{ translateY: translateY.value }],
  }));

  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          left: 110 + x - 3,
          top: 110 + y - 3,
          backgroundColor: color,
          shadowColor: color,
        },
        animatedDotStyle,
      ]}
    />
  );
};

export default function Sigh() {
  const { sighBreathingState } = useStore();

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentStateCount, setCurrentStateCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const circleScale = useSharedValue(1);
  const particleScale = useSharedValue(1);

  const particles = useMemo(() => {
    const list = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const radius = 86 + (i % 3) * 8;
      const delay = (i % 6) * 150;
      list.push({ id: i, angle, radius, delay });
    }
    return list;
  }, []);

  useEffect(() => {
    if (!isRunning || currentIndex === -1) {
      circleScale.value = withTiming(1, { duration: 500 });
      particleScale.value = withTiming(1, { duration: 500 });
      return;
    }

    const durationMs = states[currentIndex].duration * 1000;

    switch (currentIndex) {
      case 0:
        circleScale.value = withTiming(1.2, { duration: durationMs, easing: Easing.out(Easing.ease) });
        particleScale.value = withTiming(1.15, { duration: durationMs, easing: Easing.out(Easing.ease) });
        break;

      case 1:
        circleScale.value = withTiming(1.35, { duration: durationMs, easing: Easing.out(Easing.ease) });
        particleScale.value = withTiming(1.28, { duration: durationMs, easing: Easing.out(Easing.ease) });
        break;

      case 2:
        circleScale.value = withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.ease) });
        particleScale.value = withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.ease) });
        break;
    }
  }, [currentIndex, isRunning]);

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
    setCurrentIndex(-1);
    setCurrentCycle(1);
    setCurrentStateCount(0);
    circleScale.value = withTiming(1, { duration: 400 });
    particleScale.value = withTiming(1, { duration: 400 });
  }, [cleanup]);

  const runStep = useCallback((index: number, cycle: number) => {
    cleanup();

    if (cycle > sighBreathingState) {
      resetAll();
      return;
    }

    if (index >= states.length) {
      const nextCycle = cycle + 1;
      setCurrentCycle(nextCycle);
      if (nextCycle > sighBreathingState) {
        resetAll();
        return;
      }
      timeoutRef.current = setTimeout(() => runStep(0, nextCycle), 0);
      return;
    }

    const state = states[index];
    setCurrentIndex(index);
    setCurrentStateCount(state.duration);

    let countdown = state.duration;
    intervalRef.current = setInterval(() => {
      countdown--;
      setCurrentStateCount(countdown);
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      runStep(index + 1, cycle);
    }, state.duration * 1000);
  }, [sighBreathingState, cleanup, resetAll]);

  const onClick = useCallback(() => {
    if (isRunning) return;
    resetAll();
    setIsRunning(true);
    setCurrentCycle(1);
    runStep(0, 1);
  }, [isRunning, resetAll, runStep]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const current = currentIndex >= 0 ? states[currentIndex] : null;
  const currentColor = current?.color || '#00F2FE';
  const statusText = isRunning ? (current?.message || '') : 'Tap GO to start';
  const cycleText = isRunning ? `Cycle ${currentCycle}/${sighBreathingState}` : '';

  return (
    <BreathingContainer
      title="Sigh Breathing"
      subtitle="5-2-5 · Relax & Release"
      timer={currentStateCount}
      isRunning={isRunning}
      cycleText={cycleText}
      statusText={statusText}
      showButton={false}
      phaseColors={['#00F2FE', '#FFD700', '#FF007F']}
    >
      <Pressable
        style={styles.circleWrapper}
        onPress={onClick}
        disabled={isRunning}
        hitSlop={15}
      >
        {/* Floating particles ring */}
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

        {/* Thick Bold Animated Circle Ring */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.animatedCircle,
            animatedCircleStyle,
            { borderColor: currentColor, shadowColor: currentColor }
          ]}
        />

        <Text
          pointerEvents="none"
          style={styles.phaseLabel}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {current?.title || 'GO'}
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
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    opacity: 0.95,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  animatedCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  phaseLabel: {
    ...Fonts.subtitle,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
    zIndex: 2,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 16,
    maxWidth: 160,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});