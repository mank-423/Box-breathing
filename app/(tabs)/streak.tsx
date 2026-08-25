import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { Fonts, Spacing } from '@/constants/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStreak } from '@/hooks/useStreak';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { streakService } from '@/services/streakService';

export default function StreakScreen() {
  const { streak, loading } = useStreak();

  const fireScale = useSharedValue(1);
  const fireRotate = useSharedValue(0);

  if (streak.streakCount > 0) {
    fireScale.value = withRepeat(
      withTiming(1.15, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    fireRotate.value = withRepeat(
      withTiming(0.08, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  } else {
    fireScale.value = withSpring(1);
    fireRotate.value = withSpring(0);
  }

  const animatedFireStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: fireScale.value },
      { rotate: `${fireRotate.value * 8}deg` }
    ]
  }));

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
              <Animated.View style={[styles.fireContainer, animatedFireStyle]}>
                <Text style={styles.fireEmoji}>🔥</Text>
              </Animated.View>
              <Text style={styles.streakNumber}>
                {loading ? '...' : streak.streakCount}
              </Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>

          <View style={styles.highestCard}>
            <Text style={styles.highestLabel}>🏆 Best Streak</Text>
            <Text style={styles.highestNumber}>
              {loading ? '...' : streak.highestStreak > 0 ? streak.highestStreak : '—'}
            </Text>
            <Text style={styles.highestSubtext}>
              {streak.highestStreak > 0 ? 'days' : 'Complete a session to start!'}
            </Text>
          </View>

          {/* ✅ Test Button - Remove after confirming */}
          <Pressable
            style={{
              padding: 12,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 8,
              marginBottom: 8,
            }}
            onPress={async () => {
              const data = await AsyncStorage.getItem('@breathing_streak_data');
              console.log('📦 Stored streak data:', data ? JSON.parse(data) : 'No data');
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
              Check Storage (Logs to console)
            </Text>
          </Pressable>


          <Pressable
            style={{
              padding: 12,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 8,
              marginBottom: 8,
            }}
            onPress={async () => {
              await streakService.resetStreak();
              console.log('🗑️ Streak data reset!');
              // Refresh the page to show updated data
              // You can use the refresh function from useStreak
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
              Reset
            </Text>
          </Pressable>

          <View style={styles.motivationContainer}>
            <Text style={styles.motivationEmoji}>✨</Text>
            <Text style={styles.motivationText}>
              {streak.streakCount === 0 && 'Start your journey today'}
              {streak.streakCount === 1 && 'First step! Keep going! 🎉'}
              {streak.streakCount >= 2 && streak.streakCount < 7 && 'Building momentum! 🌱'}
              {streak.streakCount >= 7 && streak.streakCount < 30 && 'Strong habit forming! 💪'}
              {streak.streakCount >= 30 && 'Unstoppable! You\'re a legend! 🏆'}
            </Text>
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
    marginBottom: Spacing.sm,
  },
  fireEmoji: {
    fontSize: 56,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: '700',
    color: '#fff',
    fontVariant: ['tabular-nums'],
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
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  motivationText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontWeight: '400',
  },
  bottomPadding: {
    height: 20,
  },
});