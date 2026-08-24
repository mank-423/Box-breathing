import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const STREAK_KEY = '@breathing_streak_data';
const PRIMARY_COLOR = '#015595';
const ACCENT_COLOR = '#F97316'; // ✅ Orange for calendar

interface StreakData {
  lastDate: string;
  streakCount: number;
  completedDates: string[];
}

export default function StreakScreen() {
  const [streakData, setStreakData] = useState<StreakData>({
    lastDate: '',
    streakCount: 0,
    completedDates: []
  });
  const [todayCompleted, setTodayCompleted] = useState(false);
  
  // Animation for fire emoji
  const fireScale = useSharedValue(1);
  const fireRotate = useSharedValue(0);

  useEffect(() => {
    loadStreakData();
  }, []);

  useEffect(() => {
    if (streakData.streakCount > 0) {
      fireScale.value = withRepeat(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      fireRotate.value = withRepeat(
        withTiming(0.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      fireScale.value = withSpring(1);
      fireRotate.value = withSpring(0);
    }
  }, [streakData.streakCount]);

  const animatedFireStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: fireScale.value },
      { rotate: `${fireRotate.value * 10}deg` }
    ]
  }));

  const loadStreakData = async () => {
    try {
      const saved = await AsyncStorage.getItem(STREAK_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setStreakData(data);
        checkTodayCompletion(data);
      }
    } catch (error) {
      console.error('Error loading streak data:', error);
    }
  };

  const saveStreakData = async (data: StreakData) => {
    try {
      await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving streak data:', error);
    }
  };

  const checkTodayCompletion = (data: StreakData) => {
    const today = getToday();
    setTodayCompleted(data.completedDates.includes(today));
  };

  const getToday = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const getYesterday = () => {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    return now.toISOString().split('T')[0];
  };

  const handleCompleteBreathing = async () => {
    const today = getToday();
    
    if (todayCompleted) {
      return;
    }

    let newData = { ...streakData };
    newData.completedDates.push(today);
    
    const yesterday = getYesterday();
    const completedYesterday = newData.completedDates.includes(yesterday);
    
    if (completedYesterday || newData.completedDates.length === 1) {
      newData.streakCount += 1;
    } else {
      newData.streakCount = 1;
    }
    
    newData.lastDate = today;
    
    setStreakData(newData);
    setTodayCompleted(true);
    await saveStreakData(newData);
  };

  const getMarkedDates = () => {
    const marked: any = {};
    streakData.completedDates.forEach(date => {
      marked[date] = { 
        selected: true, 
        selectedColor: ACCENT_COLOR, // ✅ Orange instead of blue
        selectedDotColor: '#fff',
      };
    });
    
    const today = getToday();
    if (todayCompleted) {
      marked[today] = { 
        selected: true, 
        selectedColor: ACCENT_COLOR, // ✅ Orange
        selectedDotColor: '#fff',
      };
    }
    
    return marked;
  };

  const getWeekView = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek || 7) + 1);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const isCompleted = streakData.completedDates.includes(dateStr);
      const isToday = dateStr === getToday();
      week.push({ date, dateStr, isCompleted, isToday });
    }
    
    return week;
  };

  const weekData = getWeekView();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(1,85,149,0.15)', 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
          style={styles.headerGlow}
        />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={Fonts.title}>Your Streak</Text>
            <Text style={Fonts.body}>Keep the momentum going!</Text>
          </View>

          {/* Streak Counter - Smaller */}
          <View style={styles.streakCard}>
            <LinearGradient
              colors={['#015595', '#0284c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            //   borderRadius={16}
            />
            <View style={styles.streakContent}>
              <Animated.View style={[styles.fireContainer, animatedFireStyle]}>
                <Text style={styles.fireEmoji}>🔥</Text>
              </Animated.View>
              <Text style={styles.streakNumber}>{streakData.streakCount}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
              <Text style={styles.streakSubtext}>
                {todayCompleted 
                  ? '✅ Today\'s session complete!' 
                  : 'Complete today\'s session to continue your streak'}
              </Text>
            </View>
          </View>

          {/* Week View */}
          <View style={styles.weekContainer}>
            <Text style={styles.weekTitle}>This Week</Text>
            <View style={styles.weekRow}>
              {weekData.map((day, index) => (
                <View key={index} style={styles.weekDayContainer}>
                  <Text style={styles.weekDayLabel}>{day.date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                  <View style={[
                    styles.weekDayCircle,
                    day.isCompleted && styles.weekDayCompleted,
                    day.isToday && styles.weekDayToday,
                  ]}>
                    {day.isCompleted ? (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    ) : (
                      <Text style={styles.weekDayNumber}>{day.date.getDate()}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Calendar - Orange Highlights */}
          <View style={styles.calendarContainer}>
            <Text style={styles.calendarTitle}>Progress Calendar</Text>
            <Calendar
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'rgba(255,255,255,0.05)',
                textSectionTitleColor: Colors.gray,
                dayTextColor: Colors.white,
                todayTextColor: ACCENT_COLOR, 
                selectedDayBackgroundColor: ACCENT_COLOR,
                selectedDayTextColor: '#fff',
                arrowColor: ACCENT_COLOR,
                arrowHeight: 20,
                arrowWidth: 20,
                monthTextColor: Colors.white,
                textDisabledColor: 'rgba(255,255,255,0.2)',
              }}
              markedDates={getMarkedDates()}
              style={styles.calendar}
            />
          </View>

          {/* Complete Button */}
          <Pressable
            style={[styles.completeButton, todayCompleted && styles.completeButtonDisabled]}
            onPress={handleCompleteBreathing}
            disabled={todayCompleted}
          >
            <Text style={styles.completeButtonText}>
              {todayCompleted ? '✓ Completed Today' : '🎯 Complete Today\'s Session'}
            </Text>
          </Pressable>
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.lg,
  },
  headerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  streakCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  streakContent: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  fireContainer: {
    marginBottom: Spacing.xs,
  },
  fireEmoji: {
    fontSize: 30, // ✅ Smaller
  },
  streakNumber: {
    fontSize: 38, // ✅ Smaller
    fontWeight: '700',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  streakLabel: {
    fontSize: 18, // ✅ Smaller
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginTop: Spacing.xs,
  },
  streakSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  weekContainer: {
    marginBottom: Spacing.xl,
  },
  weekTitle: {
    ...Fonts.subtitle,
    fontSize: 18,
    marginBottom: Spacing.md,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDayContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  weekDayLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
  },
  weekDayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  weekDayCompleted: {
    backgroundColor: ACCENT_COLOR, // ✅ Orange
    borderColor: ACCENT_COLOR,
  },
  weekDayToday: {
    borderColor: ACCENT_COLOR, // ✅ Orange
    borderWidth: 2,
  },
  weekDayNumber: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  calendarContainer: {
    marginBottom: Spacing.xl,
  },
  calendarTitle: {
    ...Fonts.subtitle,
    fontSize: 18,
    marginBottom: Spacing.md,
  },
  calendar: {
    borderRadius: 12,
    padding: 8,
  },
  completeButton: {
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  completeButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    shadowOpacity: 0,
  },
  completeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});