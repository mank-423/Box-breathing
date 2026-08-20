import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import useStore from '@/store/zustand-store';

const TOTAL_CYCLES = 4;

type Phase = {
  label: string;
  message: string;
  color: string;
  duration: number;
};

const PHASES: Phase[] = [
  { label: 'BREATHE IN', message: 'Inhale deeply', color: '#4A90D9', duration: 5 },
  { label: 'HOLD', message: 'Hold', color: '#F39C12', duration: 5 },
  { label: 'BREATHE OUT', message: 'Exhale slowly', color: '#E74C3C', duration: 5 },
  { label: 'HOLD', message: 'Hold', color: '#9B59B6', duration: 5 },
];

export default function Box() {
  const { width } = useWindowDimensions();
  const SQUARE_SIZE = Math.min(width * 0.7, 300);

  const { boxBreathingState } = useStore();

  const [phaseIndex, setPhaseIndex] = useState(-1);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null); // ✅ For countdown intervals

  const buttonScale = useSharedValue(1);
  const timerScale = useSharedValue(1);

  const topProgress = useSharedValue(0);
  const rightProgress = useSharedValue(0);
  const bottomProgress = useSharedValue(0);
  const leftProgress = useSharedValue(0);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));
  const animatedTimerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: timerScale.value }],
  }));

  const topStyle = useAnimatedStyle(() => ({ width: `${topProgress.value * 100}%` }));
  const rightStyle = useAnimatedStyle(() => ({ height: `${rightProgress.value * 100}%` }));
  const bottomStyle = useAnimatedStyle(() => ({ width: `${bottomProgress.value * 100}%` }));
  const leftStyle = useAnimatedStyle(() => ({ height: `${leftProgress.value * 100}%` }));

  // ✅ Clean up all intervals and timeouts
  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // ✅ Reset everything
  const resetAll = () => {
    cleanup();
    setIsRunning(false);
    setPhaseIndex(-1);
    setTime(0);
    setCycleCount(0);
    topProgress.value = withTiming(0, { duration: 100 });
    rightProgress.value = withTiming(0, { duration: 100 });
    bottomProgress.value = withTiming(0, { duration: 100 });
    leftProgress.value = withTiming(0, { duration: 100 });
    buttonScale.value = withTiming(1);
    timerScale.value = withTiming(1);
  };

  useEffect(() => {
    if (isRunning) {
      buttonScale.value = withRepeat(
        withSequence(withTiming(1.05, { duration: 2000 }), withTiming(1, { duration: 2000 })),
        -1,
        true
      );
      timerScale.value = withRepeat(
        withSequence(withTiming(1.05, { duration: 1000 }), withTiming(1, { duration: 1000 })),
        -1,
        true
      );
    } else {
      buttonScale.value = withTiming(1);
      timerScale.value = withTiming(1);
    }
  }, [isRunning]);

  const progressValues = [topProgress, rightProgress, bottomProgress, leftProgress];

  const resetAllProgress = () => {
    topProgress.value = withTiming(0, { duration: 400 });
    rightProgress.value = withTiming(0, { duration: 400 });
    bottomProgress.value = withTiming(0, { duration: 400 });
    leftProgress.value = withTiming(0, { duration: 400 });
  };

  const runPhase = (index: number, cycle: number) => {
    if (index >= PHASES.length) {
      const newCycle = cycle + 1;
      setCycleCount(newCycle);
      resetAllProgress();

      if (newCycle >= boxBreathingState) {
        resetAll();
        return;
      }

      runPhase(0, newCycle);
      return;
    }

    const phase = PHASES[index];
    setPhaseIndex(index);
    setTime(phase.duration);

    progressValues[index].value = 0;
    progressValues[index].value = withTiming(1, {
      duration: phase.duration * 1000,
      easing: Easing.linear,
    });

    let countdown = phase.duration;
    intervalRef.current = setInterval(() => {
      countdown--;
      setTime(countdown);
      if (countdown <= 0) {
        cleanup();
        runPhase(index + 1, cycle);
      }
    }, 1000);
  };

  const onClick = () => {
    if (isRunning) return;
    resetAll();
    setIsRunning(true);
    setCycleCount(0);
    topProgress.value = 0;
    rightProgress.value = 0;
    bottomProgress.value = 0;
    leftProgress.value = 0;
    runPhase(0, 0);
  };

  // ✅ Clean up when component unmounts
  useEffect(() => {
    return () => {
      resetAll();
    };
  }, []);

  const current = phaseIndex >= 0 ? PHASES[phaseIndex] : null;
  const label = current ? current.label : 'GO';
  const color = current ? current.color : '#4A90D9';

  const getCycleText = () => {
    if (!isRunning) return '';
    return `Cycle ${cycleCount + 1}/${boxBreathingState}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.Text style={[Fonts.timer, animatedTimerStyle]}>
          {isRunning ? `${time}s` : ' '}
        </Animated.Text>

        <View style={[styles.squareContainer, { width: SQUARE_SIZE, height: SQUARE_SIZE }]}>
          <View style={[styles.progressBar, styles.topBar]}>
            <Animated.View
              style={[styles.progressFillTop, topStyle, { backgroundColor: PHASES[0].color }]}
            />
          </View>

          <View style={[styles.progressBar, styles.rightBar]}>
            <Animated.View
              style={[styles.progressFillRight, rightStyle, { backgroundColor: PHASES[1].color }]}
            />
          </View>

          <View style={[styles.progressBar, styles.bottomBar]}>
            <Animated.View
              style={[styles.progressFillBottom, bottomStyle, { backgroundColor: PHASES[2].color }]}
            />
          </View>

          <View style={[styles.progressBar, styles.leftBar]}>
            <Animated.View
              style={[styles.progressFillLeft, leftStyle, { backgroundColor: PHASES[3].color }]}
            />
          </View>

          <Pressable
            style={[styles.btn, { borderColor: color, width: SQUARE_SIZE * 0.6, height: SQUARE_SIZE * 0.6, borderRadius: SQUARE_SIZE * 0.3 }]}
            onPress={onClick}
            disabled={isRunning}
          >
            <Animated.Text style={[styles.btnText, animatedButtonStyle, { fontSize: Math.min(SQUARE_SIZE * 0.1, 28) }]}>
              {label}
            </Animated.Text>
            {!isRunning && <Text style={styles.subText}>Tap to start</Text>}
            {isRunning && current && <Text style={styles.subText}>{current.message}</Text>}
            {isRunning && (
              <Text style={[styles.subText, { color: 'rgba(255,255,255,0.3)', marginTop: 2 }]}>
                {getCycleText()}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  squareContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  topBar: {
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  rightBar: {
    right: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  bottomBar: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  leftBar: {
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  progressFillTop: {
    height: '100%',
    borderRadius: 3,
  },
  progressFillRight: {
    width: '100%',
    borderRadius: 3,
  },
  progressFillBottom: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    borderRadius: 3,
  },
  progressFillLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    borderRadius: 3,
  },
  btn: {
    borderWidth: 4,
    backgroundColor: 'rgba(255,255,255,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnText: {
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    textAlign: 'center',
  },
});