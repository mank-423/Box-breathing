import { StyleSheet, View, Pressable, Text, Dimensions } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const SQUARE_SIZE = Math.min(width * 0.7, 300);
const CELL_SIZE = 36;

type Phase = {
  label: string;
  message: string;
  color: string;
  duration: number; // seconds
};

// One phase per side of the square: top -> right -> bottom -> left (clockwise)
const PHASES: Phase[] = [
  { label: 'BREATHE IN', message: 'Inhale deeply', color: '#4A90D9', duration: 5 },
  { label: 'HOLD', message: 'Hold', color: '#F39C12', duration: 5 },
  { label: 'BREATHE OUT', message: 'Exhale slowly', color: '#E74C3C', duration: 5 },
  { label: 'HOLD', message: 'Hold', color: '#9B59B6', duration: 5 },
];

function GridBackground() {
  const cols = Math.ceil(width / CELL_SIZE) + 1;
  const rows = Math.ceil(height / CELL_SIZE) + 1;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* solid black base */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#000000' }]} />

      {/* very subtle top-to-bottom tone shift, no color */}
      <LinearGradient
        colors={['#0c0c12', '#000000', '#000000']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* grid lines */}
      {Array.from({ length: cols }).map((_, i) => (
        <View
          key={`v-${i}`}
          style={{
            position: 'absolute',
            left: i * CELL_SIZE,
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: 'rgba(255,255,255,0.06)',
          }}
        />
      ))}
      {Array.from({ length: rows }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={{
            position: 'absolute',
            top: i * CELL_SIZE,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.06)',
          }}
        />
      ))}

      {/* vignette so the grid fades near the edges instead of tiling harshly */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.6)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

export default function TabTwoScreen() {
  const [phaseIndex, setPhaseIndex] = useState(-1); // -1 = idle, showing "GO"
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const buttonScale = useSharedValue(1);
  const timerScale = useSharedValue(1);

  // one progress value per side of the square, each animates 0 -> 1
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

  const runPhase = (index: number) => {
    if (index >= PHASES.length) {
      // full cycle complete - reset everything
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
      setPhaseIndex(-1);
      setTime(0);
      topProgress.value = withTiming(0, { duration: 300 });
      rightProgress.value = withTiming(0, { duration: 300 });
      bottomProgress.value = withTiming(0, { duration: 300 });
      leftProgress.value = withTiming(0, { duration: 300 });
      return;
    }

    const phase = PHASES[index];
    setPhaseIndex(index);
    setTime(phase.duration);

    // animate only this phase's side, from 0 -> 100% over the full duration
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
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        runPhase(index + 1);
      }
    }, 1000);
  };

  const onClick = () => {
    if (isRunning) return;
    setIsRunning(true);
    topProgress.value = 0;
    rightProgress.value = 0;
    bottomProgress.value = 0;
    leftProgress.value = 0;
    runPhase(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const current = phaseIndex >= 0 ? PHASES[phaseIndex] : null;
  const label = current ? current.label : 'GO';
  const color = current ? current.color : '#4A90D9';

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#000000', dark: '#000000' }}>
      <ThemedView style={styles.container}>
        <GridBackground />

        <View style={styles.content}>
          <Animated.Text style={[styles.timerText, animatedTimerStyle]}>
            {isRunning ? `${time}s` : ' '}
          </Animated.Text>

          <View style={styles.squareContainer}>
            {/* top: breathe in, fills left -> right */}
            <View style={[styles.progressBar, styles.topBar]}>
              <Animated.View
                style={[styles.progressFillTop, topStyle, { backgroundColor: PHASES[0].color }]}
              />
            </View>

            {/* right: hold, fills top -> bottom */}
            <View style={[styles.progressBar, styles.rightBar]}>
              <Animated.View
                style={[styles.progressFillRight, rightStyle, { backgroundColor: PHASES[1].color }]}
              />
            </View>

            {/* bottom: breathe out, fills right -> left */}
            <View style={[styles.progressBar, styles.bottomBar]}>
              <Animated.View
                style={[styles.progressFillBottom, bottomStyle, { backgroundColor: PHASES[2].color }]}
              />
            </View>

            {/* left: hold, fills bottom -> top */}
            <View style={[styles.progressBar, styles.leftBar]}>
              <Animated.View
                style={[styles.progressFillLeft, leftStyle, { backgroundColor: PHASES[3].color }]}
              />
            </View>

            <Pressable style={[styles.btn, { borderColor: color }]} onPress={onClick} disabled={isRunning}>
              <Animated.Text style={[styles.btnText, animatedButtonStyle]}>{label}</Animated.Text>
              {!isRunning && <Text style={styles.subText}>Tap to start</Text>}
              {isRunning && current && <Text style={styles.subText}>{current.message}</Text>}
            </Pressable>
          </View>

          
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  timerText: {
    fontSize: 64,
    fontWeight: '200',
    color: 'rgba(255,255,255,0.85)',
    fontVariant: ['tabular-nums'],
    marginBottom: 30,
  },
  squareContainer: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
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
    height: 4,
  },
  rightBar: {
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  bottomBar: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  leftBar: {
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  progressFillTop: {
    height: '100%',
    borderRadius: 2,
  },
  progressFillRight: {
    width: '100%',
    borderRadius: 2,
  },
  progressFillBottom: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    borderRadius: 2,
  },
  progressFillLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    borderRadius: 2,
  },
  btn: {
    height: SQUARE_SIZE * 0.6,
    width: SQUARE_SIZE * 0.6,
    borderRadius: SQUARE_SIZE * 0.3,
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
    fontSize: Math.min(SQUARE_SIZE * 0.1, 28),
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
  progressContainer: {
    flexDirection: 'row',
    marginTop: 50,
    gap: 12,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  activeDot: {
    backgroundColor: '#ffffff',
  },
  completedDot: {
    backgroundColor: '#2ECC71',
  },
});