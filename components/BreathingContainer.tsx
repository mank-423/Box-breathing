import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';

interface BreathingContainerProps {
  title: string;
  subtitle: string;
  timer: number;
  isRunning: boolean;
  cycleText: string;
  statusText: string;
  onPress: () => void;
  children?: React.ReactNode;
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
}: BreathingContainerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={Fonts.title}>{title}</Text>
        <Text style={Fonts.body}>{subtitle}</Text>
      </View>

      <View style={styles.content}>
        {children}

        <View style={styles.timerSection}>
          <Text style={Fonts.timer}>{timer}s</Text>
        </View>

        <View style={styles.statusSection}>
          <Text style={Fonts.body}>{statusText}</Text>
          {isRunning && (
            <Text style={Fonts.cycle}>{cycleText}</Text>
          )}
        </View>

        <Pressable
          style={[styles.button, isRunning && styles.buttonDisabled]}
          onPress={onPress}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Running...' : 'Start'}
          </Text>
        </Pressable>
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
    marginBottom: Spacing.xl,
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
  },
  buttonDisabled: {
    backgroundColor: Colors.grayLight,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});