import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { Fonts, Spacing } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStreak } from '@/hooks/useStreak';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import fire from '@/assets/animations/Fire.json';

const STREAK_KEY = '@breathing_streak_data';

export default function StreakScreen() {
  const { streak, loading, refresh, resetStreak } = useStreak();
  const fireAnimationRef = useRef<LottieView>(null);

  // Refresh data every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      refresh();
      // Play animation when screen is focused and streak > 0
      if (streak.streakCount > 0) {
        fireAnimationRef.current?.play();
      }
    }, [refresh, streak.streakCount])
  );

  // Log button handler
  const logStreakData = async () => {
    try {
      const saved = await AsyncStorage.getItem(STREAK_KEY);
      const data = saved ? JSON.parse(saved) : 'No data found';
      console.log('📦 Current streak data:', data);
      alert(`Data logged to console!\n\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Error reading streak data:', error);
      alert('Error reading data. Check console for details.');
    }
  };

  // Reset button handler
  const handleReset = async () => {
    await resetStreak();
    refresh();
    fireAnimationRef.current?.pause();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={Fonts.title}>Your Streak</Text>
            <Text style={Fonts.body}>Keep the momentum going!</Text>
          </View>

          <View style={styles.streakCard}>
            <View style={styles.streakContent}>
              {/* Lottie Fire Animation */}
              <View style={styles.fireContainer}>
                <LottieView
                  ref={fireAnimationRef}
                  source={fire}
                  style={styles.fireAnimation}
                  autoPlay={false}
                  loop={true}
                  speed={0.8}
                />
              </View>
              <Text style={styles.streakNumber}>
                {loading ? '...' : streak.streakCount}
              </Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>

          <View style={styles.highestCard}>
            <Text style={styles.highestLabel}>Best Streak</Text>
            <Text style={styles.highestNumber}>
              {loading ? '...' : streak.highestStreak > 0 ? streak.highestStreak : '—'}
            </Text>
            <Text style={styles.highestSubtext}>
              {streak.highestStreak > 0 ? 'days' : 'Complete a session to start!'}
            </Text>
          </View>

          <View style={styles.motivationContainer}>
            <Text style={styles.motivationEmoji}>✦</Text>
            <Text style={styles.motivationText}>
              {streak.streakCount === 0 && 'Start your journey today'}
              {streak.streakCount === 1 && 'First step! Keep going!'}
              {streak.streakCount >= 2 && streak.streakCount < 7 && 'Building momentum!'}
              {streak.streakCount >= 7 && streak.streakCount < 30 && 'Strong habit forming!'}
              {streak.streakCount >= 30 && 'Unstoppable! You are a legend!'}
            </Text>
          </View>

          {/* Debug Buttons */}
          <View style={styles.buttonRow}>
            <Pressable 
              style={[styles.button, styles.logButton]} 
              onPress={logStreakData}
            >
              <Text style={styles.buttonText}>Log Data</Text>
            </Pressable>
            <Pressable 
              style={[styles.button, styles.resetButton]} 
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.lg,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  streakCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  streakContent: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  fireContainer: {
    width: 120,
    height: 120,
    marginBottom: -10,
    marginTop: -10,
  },
  fireAnimation: {
    width: 120,
    height: 120,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: '700',
    color: '#fff',
    fontVariant: ['tabular-nums'],
    marginTop: -10,
  },
  streakLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginTop: Spacing.xs,
  },
  highestCard: {
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
  },
  highestLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  highestNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  highestSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 2,
  },
  motivationContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginTop: Spacing.sm,
  },
  motivationEmoji: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: Spacing.sm,
  },
  motivationText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontWeight: '400',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  button: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  logButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  resetButton: {
    backgroundColor: 'rgba(255,80,80,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.2)',
  },
  buttonText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 20,
  },
});