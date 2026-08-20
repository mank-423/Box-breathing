import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

interface BreathingContainerProps {
  title: string;
  subtitle: string;
  timer: number;
  isRunning: boolean;
  cycleText: string;
  statusText: string;
  onPress?: () => void; // Made optional
  children: React.ReactNode;
  phaseColors?: string[];
  showButton?: boolean; // Added flag to hide/show bottom button
}

export default function BreathingContainer({
  title,
  subtitle,
  timer,
  isRunning,
  cycleText,
  statusText,
  onPress,
  children,
  phaseColors = ['#6C5CE7', '#A29BFE'],
  showButton = false, // Defaults to false
}: BreathingContainerProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(108,92,231,0.15)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <Text style={Fonts.title}>{title}</Text>
        <Text style={Fonts.body}>{subtitle}</Text>
      </View>

      <View style={styles.content}>
        {children}

        <View style={styles.timerSection}>
          <Animated.Text style={Fonts.timer}>
            {isRunning ? `${timer}s` : ' '}
          </Animated.Text>
        </View>

        <View style={styles.statusSection}>
          <Text style={Fonts.message}>{statusText}</Text>
          {isRunning && (
            <Text style={[Fonts.cycle, { marginTop: Spacing.xs }]}>
              {cycleText}
            </Text>
          )}
        </View>

        {showButton && onPress && (
          <Pressable
            style={[styles.button, isRunning && styles.buttonDisabled]}
            onPress={onPress}
            disabled={isRunning}
          >
            <Text style={Fonts.button}>
              {isRunning ? 'Running...' : 'GO'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: Spacing.lg,
  },
  header: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerSection: {
    marginVertical: Spacing.xl,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  button: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowOpacity: 0,
  },
});