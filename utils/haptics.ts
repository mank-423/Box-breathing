import * as Haptics from 'expo-haptics';

// Central haptics wrapper — keeps call sites simple and makes it easy
// to tune feedback strength/type in one place later.
export const haptics = {
  // Light tick — phase transitions, minor UI feedback
  tick: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  // Used for +/- style selection changes
  select: () => {
    Haptics.selectionAsync();
  },
  // Session complete, streak milestone
  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  // Reserved for errors / destructive actions (e.g. reset streak)
  warning: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  // Firm/heavy — SOS button, anything that should feel deliberate
  firm: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
};