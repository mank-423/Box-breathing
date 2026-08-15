import { StyleSheet, View, Pressable, Text, Dimensions } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { useState, useRef, useEffect } from 'react';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  Easing 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const SQUARE_SIZE = Math.min(width * 0.7, 300);

export default function TabTwoScreen() {
  const states = ['GO', 'BREATHE IN', 'HOLD', 'BREATHE OUT', 'HOLD'];
  const stateColors = ['#4A90D9', '#2ECC71', '#F39C12', '#E74C3C', '#9B59B6'];
  const stateMessages = ['Tap to start', 'Inhale deeply', 'Hold', 'Exhale slowly', 'Hold'];
  
  const [state, setState] = useState(0);
  const [time, setTime] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [progressPhase, setProgressPhase] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Animation for gradient
  const gradientOffset = useSharedValue(0);

  useEffect(() => {
    gradientOffset.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.linear }),
      -1,
      true
    );
  }, []);

  const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: gradientOffset.value * 100 - 50,
        },
      ],
    };
  });

  const onClick = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    let currentIndex = 0;
    let countdown = 5;
    let phaseCounter = 0;

    setState(0);
    setTime(5);
    setProgressPhase(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      countdown--;
      setTime(countdown);

      phaseCounter = (phaseCounter + 1) % 4;
      setProgressPhase(phaseCounter);

      if (countdown === 0) {
        currentIndex++;

        if (currentIndex >= states.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          intervalRef.current = null;
          setIsRunning(false);
          setState(0);
          setTime(5);
          setProgressPhase(0);
          return;
        }

        setState(currentIndex);
        countdown = 5;
        setTime(5);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1a1a2e', dark: '#1a1a2e' }}
    >
      <ThemedView style={styles.container}>
        {/* Animated Gradient Background */}
        <View style={StyleSheet.absoluteFillObject}>
          <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460', '#533483']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Animated.View 
            style={[
              StyleSheet.absoluteFillObject,
              animatedGradientStyle,
              {
                opacity: 0.3,
                backgroundColor: 'transparent',
              }
            ]}
          >
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.1)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Timer Display */}
          <MotiText
            style={styles.timerText}
            animate={{
              scale: isRunning ? [1, 1.05, 1] : 1,
            }}
            transition={{
              type: 'timing',
              duration: 1000,
              loop: isRunning,
            }}
          >
            {time}s
          </MotiText>

          {/* Square Container with Progress Bars */}
          <View style={styles.squareContainer}>
            {/* Top Progress Bar */}
            <MotiView
              style={[
                styles.progressBar,
                styles.topBar,
                { backgroundColor: 'rgba(255,255,255,0.1)' }
              ]}
            >
              <MotiView
                style={[
                  styles.progressFill,
                  { backgroundColor: stateColors[state] }
                ]}
                animate={{
                  width: progressPhase === 0 || progressPhase === 3 || (progressPhase === 2 && state > 0) ? '100%' : '0%',
                }}
                transition={{
                  type: 'timing',
                  duration: 1000,
                }}
              />
            </MotiView>

            {/* Right Progress Bar */}
            <MotiView
              style={[
                styles.progressBar,
                styles.rightBar,
                { backgroundColor: 'rgba(255,255,255,0.1)' }
              ]}
            >
              <MotiView
                style={[
                  styles.progressFill,
                  { backgroundColor: stateColors[state] }
                ]}
                animate={{
                  height: progressPhase === 0 || progressPhase === 1 || (progressPhase === 2 && state > 0) ? '100%' : '0%',
                }}
                transition={{
                  type: 'timing',
                  duration: 1000,
                }}
              />
            </MotiView>

            {/* Bottom Progress Bar */}
            <MotiView
              style={[
                styles.progressBar,
                styles.bottomBar,
                { backgroundColor: 'rgba(255,255,255,0.1)' }
              ]}
            >
              <MotiView
                style={[
                  styles.progressFill,
                  { backgroundColor: stateColors[state] }
                ]}
                animate={{
                  width: progressPhase === 1 || progressPhase === 2 || (progressPhase === 0 && state > 1) ? '100%' : '0%',
                }}
                transition={{
                  type: 'timing',
                  duration: 1000,
                }}
              />
            </MotiView>

            {/* Left Progress Bar */}
            <MotiView
              style={[
                styles.progressBar,
                styles.leftBar,
                { backgroundColor: 'rgba(255,255,255,0.1)' }
              ]}
            >
              <MotiView
                style={[
                  styles.progressFill,
                  { backgroundColor: stateColors[state] }
                ]}
                animate={{
                  height: progressPhase === 2 || progressPhase === 3 || (progressPhase === 0 && state > 1) ? '100%' : '0%',
                }}
                transition={{
                  type: 'timing',
                  duration: 1000,
                }}
              />
            </MotiView>

            {/* Center Button */}
            <Pressable 
              style={[
                styles.btn,
                { borderColor: stateColors[state] }
              ]} 
              onPress={onClick}
              disabled={isRunning}
            >
              <MotiText
                style={styles.btnText}
                animate={{
                  scale: isRunning ? 1.05 : 1,
                }}
                transition={{
                  type: 'timing',
                  duration: 2000,
                  loop: isRunning,
                }}
              >
                {states[state]}
              </MotiText>
              {!isRunning && state === 0 && (
                <MotiText
                  style={styles.subText}
                  animate={{
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    type: 'timing',
                    duration: 2000,
                    loop: true,
                  }}
                >
                  {stateMessages[state]}
                </MotiText>
              )}
            </Pressable>
          </View>

          {/* Progress Dots */}
          <View style={styles.progressContainer}>
            {states.map((_, index) => (
              <MotiView 
                key={index}
                style={[
                  styles.progressDot,
                  index === state && styles.activeDot,
                  index < state && styles.completedDot
                ]}
                animate={{
                  scale: index === state ? 1.3 : 1,
                }}
                transition={{
                  type: 'timing',
                  duration: 300,
                }}
              />
            ))}
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
    color: 'rgba(255,255,255,0.8)',
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
  },
  progressFill: {
    borderRadius: 2,
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
  btn: {
    height: SQUARE_SIZE * 0.6,
    width: SQUARE_SIZE * 0.6,
    borderRadius: SQUARE_SIZE * 0.3,
    borderWidth: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeDot: {
    backgroundColor: '#ffffff',
  },
  completedDot: {
    backgroundColor: '#2ECC71',
  },
});