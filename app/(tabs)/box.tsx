import { useState, useRef, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import useStore from '@/store/zustand-store';
import BreathingContainer from '@/components/BreathingContainer';
import AuraBreathingCircle from '@/components/AuraBreathingCircle';
import { useCompleteSession } from '@/hooks/useCompleteSession';
import StreakPopup from '@/components/StreakPopup';

const PHASES = [
  {
    label: 'BREATHE IN',
    message: 'Inhale deeply',
    color: '#81B69D',      // Muted Sage
    altColor: '#A3D9C9',   // Soft Seafoam
    duration: 4,
    type: 'in' as const
  },
  {
    label: 'HOLD',
    message: 'Hold your breath',
    color: '#E0C097',      // Warm Sand
    altColor: '#E2D4B7',   // Muted Amber
    duration: 4,
    type: 'hold' as const
  },
  {
    label: 'BREATHE OUT',
    message: 'Exhale slowly',
    color: '#C38D9E',      // Dusty Rose
    altColor: '#E2A9B8',   // Soft Clay
    duration: 4,
    type: 'out' as const
  },
  {
    label: 'HOLD',
    message: 'Hold your breath',
    color: '#708090',      // Slate Blue
    altColor: '#8C9DAE',   // Muted Lavender Blue
    duration: 4,
    type: 'hold-out' as const
  },
];

export default function Box() {
  const { boxBreathingState } = useStore();
  const { completeSession } = useCompleteSession();
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [newStreakCount, setNewStreakCount] = useState(0);
  const [newHighestStreak, setNewHighestStreak] = useState(0);

  const [phaseIndex, setPhaseIndex] = useState(-1);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

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
    setPhaseIndex(-1);
    setTime(0);
    setCycleCount(0);

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

  // Guaranteed unmount & focus transition cleanup
  useFocusEffect(
    useCallback(() => {
      isScreenFocusedRef.current = true;
      return () => {
        isScreenFocusedRef.current = false;
        resetAll(false);
      };
    }, [resetAll])
  );

  const runPhase = useCallback((index: number, cycle: number) => {
    cleanup();
    if (!isScreenFocusedRef.current) return;

    if (cycle >= boxBreathingState) {
      resetAll(true);
      return;
    }

    if (index >= PHASES.length) {
      const newCycle = cycle + 1;
      setCycleCount(newCycle);
      if (newCycle >= boxBreathingState) {
        resetAll(true);
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
      if (!isScreenFocusedRef.current) {
        cleanup();
        return;
      }
      countdown--;
      setTime(countdown);
    }, 1000);

    timeoutRef.current = setTimeout(() => runPhase(index + 1, cycle), phase.duration * 1000);
  }, [boxBreathingState, cleanup, resetAll]);

  const onClick = useCallback(() => {
    if (isRunning) return;
    setIsRunningWithRef(true);
    setCycleCount(0);
    runPhase(0, 0);
  }, [isRunning, runPhase, setIsRunningWithRef]);

  const current = phaseIndex >= 0 ? PHASES[phaseIndex] : null;

  return (
    <>
      <BreathingContainer
        title="Box Breathing"
        subtitle="4-4-4-4 · Balance & Focus"
        timer={time}
        isRunning={isRunning}
        cycleText={isRunning ? `Cycle ${cycleCount + 1}/${boxBreathingState}` : ''}
        statusText={isRunning ? (current?.message || '') : 'Tap to start'}
        showButton={false}
        phaseColors={['#00F2FE', '#FFD700', '#FF007F', '#FF8C00']}
      >
        <AuraBreathingCircle
          isRunning={isRunning}
          phaseIndex={phaseIndex}
          durationSeconds={current?.duration || 4}
          phaseType={current?.type || 'in'}
          currentColor={current?.color || '#00F2FE'}
          secondaryColor={current?.altColor || '#4FACFE'}
          label={current?.label || 'GO'}
          timer={time}
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