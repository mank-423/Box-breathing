import React, { useState, useRef, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import useStore from '@/store/zustand-store';
import BreathingContainer from '@/components/BreathingContainer';
import AuraBreathingCircle from '@/components/AuraBreathingCircle';
import { useCompleteSession } from '@/hooks/useCompleteSession';
import StreakPopup from '@/components/StreakPopup';

const STATES = [
  {
    title: 'BREATHE IN',
    duration: 4,
    message: 'Inhale slowly through your nose',
    color: '#6BA392',      // Deep Eucalyptus
    altColor: '#8CB8AB',   // Soft Teal
    type: 'in' as const
  },
  {
    title: 'HOLD',
    duration: 7,
    message: 'Hold your breath gently',
    color: '#D4A373',      // Warm Oat Amber
    altColor: '#FAEDCD',   // Soft Cream
    type: 'hold' as const
  },
  {
    title: 'BREATHE OUT',
    duration: 8,
    message: 'Exhale slowly through your mouth',
    color: '#8082A6',      // Soft Muted Violet
    altColor: '#A2A5C8',   // Twilight Lavender
    type: 'out' as const
  },
];

export default function FourSevenEight() {
  const { fourSevenEightState } = useStore();
  const { completeSession } = useCompleteSession();
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [newStreakCount, setNewStreakCount] = useState(0);
  const [newHighestStreak, setNewHighestStreak] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentStateCount, setCurrentStateCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isScreenFocusedRef = useRef(false);
  const isRunningRef = useRef(false);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  }, []);

  const setIsRunningWithRef = useCallback((value: boolean) => {
    setIsRunning(value);
    isRunningRef.current = value;
  }, []);

  const resetAll = useCallback((shouldCompleteSession: boolean = false) => {
    const wasRunning = isRunningRef.current;
    cleanup();
    setIsRunningWithRef(false);
    setCurrentIndex(-1);
    setCurrentCycle(1);
    setCurrentStateCount(0);

    if (shouldCompleteSession && wasRunning) {
      completeSession().then((result) => {
        if (result?.updated) {
          setNewStreakCount(result.data.streakCount);
          setNewHighestStreak(result.data.highestStreak);
          setShowStreakPopup(true);
        }
      });
    }
  }, [cleanup, completeSession, setIsRunningWithRef]);

  // Clean up timers and reset state immediately when navigating away
  useFocusEffect(
    useCallback(() => {
      isScreenFocusedRef.current = true;
      return () => {
        isScreenFocusedRef.current = false;
        resetAll(false);
      };
    }, [resetAll])
  );

  const runStep = useCallback((index: number, cycle: number) => {
    cleanup();
    if (!isScreenFocusedRef.current) return;

    if (cycle > fourSevenEightState) {
      resetAll(true);
      return;
    }

    if (index >= STATES.length) {
      const nextCycle = cycle + 1;
      setCurrentCycle(nextCycle);
      if (nextCycle > fourSevenEightState) {
        resetAll(true);
        return;
      }
      timeoutRef.current = setTimeout(() => runStep(0, nextCycle), 0);
      return;
    }

    const state = STATES[index];
    setCurrentIndex(index);
    setCurrentStateCount(state.duration);

    let countdown = state.duration;
    intervalRef.current = setInterval(() => {
      if (!isScreenFocusedRef.current) {
        cleanup();
        return;
      }
      countdown--;
      setCurrentStateCount(countdown);
    }, 1000);

    timeoutRef.current = setTimeout(() => runStep(index + 1, cycle), state.duration * 1000);
  }, [fourSevenEightState, cleanup, resetAll]);

  const onClick = useCallback(() => {
    if (isRunning) return;
    setIsRunningWithRef(true);
    setCurrentCycle(1);
    runStep(0, 1);
  }, [isRunning, runStep, setIsRunningWithRef]);

  const current = currentIndex >= 0 ? STATES[currentIndex] : null;

  return (
    <>
      <BreathingContainer
        title="4-7-8 Breathing"
        subtitle="Calm your nervous system"
        timer={currentStateCount}
        isRunning={isRunning}
        cycleText={isRunning ? `Cycle ${currentCycle}/${fourSevenEightState}` : ''}
        statusText={isRunning ? (current?.message || '') : 'Tap to start'}
        showButton={false}
        phaseColors={['#00F2FE', '#FFD700', '#FF007F']}
      >
        <AuraBreathingCircle
          isRunning={isRunning}
          phaseIndex={currentIndex}
          durationSeconds={current?.duration || 4}
          phaseType={current?.type || 'in'}
          currentColor={current?.color || '#00F2FE'}
          secondaryColor={current?.altColor || '#4FACFE'}
          label={current?.title || 'GO'}
          timer={currentStateCount}
          onPress={onClick}
        />
      </BreathingContainer>

      <StreakPopup
        visible={showStreakPopup}
        streakCount={newStreakCount}
        highestStreak={newHighestStreak}
        onClose={() => setShowStreakPopup(false)}
      />
    </>
  );
}