import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';

interface BreathingContainerProps {
  title: string;
  subtitle: string;
  isRunning: boolean;
  cycleText: string;
  statusText: string;
  onPress?: () => void;
  children: React.ReactNode;
  showButton?: boolean;
}

export default function BreathingContainer({
  title,
  subtitle,
  isRunning,
  cycleText,
  statusText,
  onPress,
  children,
  showButton = false,
}: BreathingContainerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={Fonts.title}>{title}</Text>
        <Text style={Fonts.body}>{subtitle}</Text>
      </View>

      <View style={styles.content}>
        {children}

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
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusSection: {
    alignItems: 'center',
    marginTop: Spacing.md,
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