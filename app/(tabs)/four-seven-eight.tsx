import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import useStore from '@/store/zustand-store';
import BreathingContainer from '@/components/BreathingContainer';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const FourSevenEight = () => {
  const states = [
    { title: 'Breathe In', duration: 4, message: 'Inhale slowly through your nose' },
    { title: 'Hold', duration: 7, message: 'Hold your breath gently' },
    { title: 'Breathe Out', duration: 8, message: 'Exhale slowly through your mouth' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentStateCount, setCurrentStateCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const { fourSevenEightState, setFourSevenEightState } = useStore();

  // Circle animation
  const circleScale = useSharedValue(1);
  const circleOpacity = useSharedValue(0.3);

  // ✅ Clean up everything
  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  // ✅ Reset everything
  const resetAll = () => {
    cleanup();
    setIsRunning(false);
    setCurrentIndex(0);
    setCurrentCycle(1);
    setCurrentStateCount(0);
    circleScale.value = withTiming(1);
    circleOpacity.value = withTiming(0.3);
  };

  useEffect(() => {
    if (isRunning) {
      circleScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 4000 }),
          withTiming(1, { duration: 7000 }),
          withTiming(0.7, { duration: 8000 })
        ),
        -1,
        true
      );
      circleOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 4000 }),
          withTiming(0.3, { duration: 7000 }),
          withTiming(0.8, { duration: 8000 })
        ),
        -1,
        true
      );
    } else {
      circleScale.value = withTiming(1);
      circleOpacity.value = withTiming(0.3);
    }
  }, [isRunning]);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
    opacity: circleOpacity.value,
  }));

  const runStep = (index: number, cycle: number) => {
    if (!isRunning) {
      resetAll();
      return;
    }

    if (cycle > fourSevenEightState) {
      resetAll();
      return;
    }

    if (index >= states.length) {
      setCurrentCycle(cycle + 1);
      cleanup();
      timeoutRef.current = setTimeout(() => {
        if (isRunning) {
          runStep(0, cycle + 1);
        }
      }, 1000) as any;
      return;
    }

    setCurrentIndex(index);
    const duration = states[index].duration;
    setCurrentStateCount(duration);

    let countdown = duration;
    countdownRef.current = setInterval(() => {
      countdown--;
      setCurrentStateCount(countdown);
    }, 1000);

    cleanup();
    timeoutRef.current = setTimeout(() => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      if (isRunning) {
        runStep(index + 1, cycle);
      }
    }, duration * 1000) as any;
  };

  const onClick = () => {
    if (isRunning) return;
    resetAll();
    setIsRunning(true);
    setCurrentCycle(1);
    setCurrentIndex(0);
    runStep(0, 1);
  };

  // ✅ Clean up on unmount
  useEffect(() => {
    return () => {
      resetAll();
    };
  }, []);

  const currentState = states[currentIndex] || states[0];
  const totalCycles = fourSevenEightState || 4;

  return (
    <BreathingContainer
      title="4-7-8 Breathing"
      subtitle="Calm your nervous system"
      timer={currentStateCount}
      isRunning={isRunning}
      cycleText={`Cycle ${currentCycle}/${totalCycles}`}
      statusText={currentState.message}
      onPress={onClick}
    >
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, animatedCircleStyle]}>
          <LinearGradient
            colors={['#6C5CE7', '#A29BFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
        <Text style={styles.stateText}>{currentState.title}</Text>
      </View>
    </BreathingContainer>
  );
};

const styles = StyleSheet.create({
  circleContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: 'absolute',
    backgroundColor: 'rgba(108, 92, 231, 0.3)',
  },
  stateText: {
    ...Fonts.subtitle,
    fontSize: 24,
    zIndex: 1,
  },
});

export default FourSevenEight;