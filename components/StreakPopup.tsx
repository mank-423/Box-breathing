import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Spacing } from '@/constants/theme';

interface StreakPopupProps {
  visible: boolean;
  streakCount: number;
  highestStreak: number;
  onClose: () => void;
}

export default function StreakPopup({ 
  visible, 
  streakCount, 
  highestStreak,
  onClose 
}: StreakPopupProps) {
  const fireScale = useSharedValue(0);
  const fireRotate = useSharedValue(0);
  const popupScale = useSharedValue(0.5);
  const popupOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Entrance animation
      popupScale.value = withSpring(1, { damping: 12, stiffness: 100 });
      popupOpacity.value = withSpring(1);
      
      // Continuous fire animation
      fireScale.value = withRepeat(
        withTiming(1.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      fireRotate.value = withRepeat(
        withTiming(0.12, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      popupScale.value = withSpring(0.5);
      popupOpacity.value = withSpring(0);
      fireScale.value = withSpring(0);
      fireRotate.value = withSpring(0);
    }
  }, [visible]);

  const animatedFireStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: fireScale.value },
      { rotate: `${fireRotate.value * 12}deg` }
    ]
  }));

  const animatedPopupStyle = useAnimatedStyle(() => ({
    transform: [{ scale: popupScale.value }],
    opacity: popupOpacity.value,
  }));

  const getMessage = () => {
    if (streakCount === 1) return "You've started your streak! 🎉";
    if (streakCount <= 3) return "Keep it going! You're building momentum! 💪";
    if (streakCount <= 7) return "You're on a roll! Amazing consistency! 🔥";
    if (streakCount <= 14) return "Two weeks strong! You're unstoppable! ⚡";
    if (streakCount <= 30) return "A whole month! You're a legend! 🏆";
    return "Incredible dedication! You're the best! 🌟";
  };

  const getAchievement = () => {
    if (streakCount === highestStreak && streakCount > 0) {
      if (streakCount === 1) return "🌟 First streak!";
      if (streakCount <= 3) return "🎯 Off to a great start!";
      if (streakCount <= 7) return "🔥 On fire!";
      if (streakCount <= 14) return "⚡ Unstoppable!";
      if (streakCount <= 30) return "🏆 New record!";
      return "👑 All-time best!";
    }
    return null;
  };

  const achievement = getAchievement();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <Animated.View style={[styles.popup, animatedPopupStyle]}>
          <Animated.View style={[styles.fireContainer, animatedFireStyle]}>
            <Text style={styles.fireEmoji}>🔥</Text>
          </Animated.View>

          <Text style={styles.streakNumber}>{streakCount}</Text>
          <Text style={styles.streakLabel}>Day Streak</Text>

          {achievement && (
            <View style={styles.achievementBadge}>
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          )}
          
          <Text style={styles.message}>{getMessage()}</Text>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Amazing! ✨</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popup: {
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '85%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  fireContainer: {
    marginBottom: Spacing.sm,
  },
  fireEmoji: {
    fontSize: 72,
  },
  streakNumber: {
    fontSize: 60,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  streakLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    marginTop: Spacing.xs,
  },
  achievementBadge: {
    backgroundColor: 'rgba(255,107,53,0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.2)',
  },
  achievementText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  message: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});