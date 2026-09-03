import React, { useState, useRef, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import useStore from '@/store/zustand-store';
import BreathingContainer from '@/components/BreathingContainer';
import AuraBreathingCircle from '@/components/AuraBreathingCircle';
import { useCompleteSession } from '@/hooks/useCompleteSession';
import StreakPopup from '@/components/StreakPopup';
import { TechniqueColors } from '@/constants/theme';

const STATES = [
  {
    title: 'BREATHE IN',
    duration: 5,
    message: 'Inhale slowly',
    color: '#71B280',      // Soft Forest Mint
    altColor: '#93EDC7',   // Pale Lagoon
    type: 'in' as const
  },
  {
    title: 'SMALL SIGH',
    duration: 2,
    message: 'Take one more breath',
    color: '#DFB07A',      // Warm Honey Sand
    altColor: '#F3E0B5',   // Soft Cream
    type: 'in' as const
  },
  {
    title: 'BREATHE OUT',
    duration: 5,
    message: 'Exhale with a sigh',
    color: '#8A9EA7',      // Muted Mist Blue
    altColor: '#B0C2CB',   // Soft Dusk
    type: 'out' as const
  },
];

export default function Sigh() {
  const { sighBreathingState } = useStore();
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

    if (cycle > sighBreathingState) {
      resetAll(true);
      return;
    }

    if (index >= STATES.length) {
      const nextCycle = cycle + 1;
      setCurrentCycle(nextCycle);
      if (nextCycle > sighBreathingState) {
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
  }, [sighBreathingState, cleanup, resetAll]);

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
        title="Sigh Breathing"
        subtitle="5-2-5 · Relax & Release"
        isRunning={isRunning}
        cycleText={isRunning ? `Cycle ${currentCycle}/${sighBreathingState}` : ''}
        statusText={isRunning ? (current?.message || '') : 'Tap to start'}
        showButton={false}
      >
        <AuraBreathingCircle
          isRunning={isRunning}
          phaseIndex={currentIndex}
          durationSeconds={current?.duration || 5}
          phaseType={current?.type || 'in'}
          currentColor={current?.color || TechniqueColors.sigh}
          secondaryColor={current?.altColor || TechniqueColors.sigh}
          idleColor={TechniqueColors.sigh}
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