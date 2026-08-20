import { StyleSheet, View, Text, Pressable } from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import useStore from '@/store/zustand-store';
import { Fonts } from '@/constants/theme';
import BreathingContainer from '@/components/BreathingContainer';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const states = [
  { title: 'Breathe In', duration: 4, message: 'Inhale slowly through your nose', color: '#6C5CE7' },
  { title: 'Hold', duration: 7, message: 'Hold your breath gently', color: '#F39C12' },
  { title: 'Breathe Out', duration: 8, message: 'Exhale slowly through your mouth', color: '#A29BFE' },
];

export default function FourSevenEight() {
  const { fourSevenEightState } = useStore();

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentStateCount, setCurrentStateCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Shared animated values
  const circleScale = useSharedValue(1);

  // Animate size based on current 4-7-8 phase
  useEffect(() => {
    if (!isRunning || currentIndex === -1) {
      circleScale.value = withTiming(1, { duration: 500 });
      return;
    }

    const durationMs = states[currentIndex].duration * 1000;

    switch (currentIndex) {
      case 0: // BREATHE IN (4s) -> Smooth expansion
        circleScale.value = withTiming(1.35, { duration: durationMs, easing: Easing.out(Easing.ease) });
        break;

      case 1: // HOLD (7s) -> Maintain size
        circleScale.value = 1.35;
        break;

      case 2: // BREATHE OUT (8s) -> Slow, complete contraction
        circleScale.value = withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.ease) });
        break;
    }
  }, [currentIndex, isRunning]);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
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
  }, [cleanup]);

  const runStep = useCallback((index: number, cycle: number) => {
    cleanup();

    if (cycle > fourSevenEightState) {
      resetAll();
      return;
    }

    if (index >= states.length) {
      const nextCycle = cycle + 1;
      setCurrentCycle(nextCycle);
      if (nextCycle > fourSevenEightState) {
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
  }, [fourSevenEightState, cleanup, resetAll]);

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
  const currentColor = current?.color || '#6C5CE7';
  const statusText = isRunning ? (current?.message || '') : 'Tap GO to start';
  const cycleText = isRunning ? `Cycle ${currentCycle}/${fourSevenEightState}` : '';

  return (
    <BreathingContainer
      title="4-7-8 Breathing"
      subtitle="Calm your nervous system"
      timer={currentStateCount}
      isRunning={isRunning}
      cycleText={cycleText}
      statusText={statusText}
      showButton={false}
      phaseColors={['#6C5CE7', '#A29BFE']}
    >
      <Pressable 
        style={styles.circleWrapper} 
        onPress={onClick}
        disabled={isRunning}
        hitSlop={15}
      >
        {/* Simple outlined circular border */}
        <Animated.View 
          pointerEvents="none" 
          style={[
            styles.circle, 
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
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
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