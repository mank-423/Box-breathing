import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Colors } from '@/constants/theme';

const PERMISSION_ASKED_KEY = '@notification_permission_asked';
const DAILY_REMINDER_ID = 'daily-breathe-reminder';
const REMINDER_HOUR = 20; // 8 PM
const REMINDER_MINUTE = 0;

// Controls how notifications behave while the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  async setupAndroidChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Daily Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: Colors.accentWarm,
      });
    }
  },

  async hasAskedPermission(): Promise<boolean> {
    const value = await AsyncStorage.getItem(PERMISSION_ASKED_KEY);
    return value === 'true';
  },

  async markPermissionAsked() {
    await AsyncStorage.setItem(PERMISSION_ASKED_KEY, 'true');
  },

  // Only prompts the OS permission dialog the very first time this ever runs.
  // Every subsequent app launch just reads the current status instead of re-prompting.
  async requestPermissionIfNeeded(): Promise<boolean> {
    const alreadyAsked = await this.hasAskedPermission();

    if (alreadyAsked) {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    }

    const { status } = await Notifications.requestPermissionsAsync();
    await this.markPermissionAsked();
    return status === 'granted';
  },

  async scheduleDailyReminder() {
    // Avoid stacking duplicate schedules on every app launch
    const existing = await Notifications.getAllScheduledNotificationsAsync();
    const alreadyScheduled = existing.some((n) => n.identifier === DAILY_REMINDER_ID);
    if (alreadyScheduled) return;

    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_REMINDER_ID,
      content: {
        title: 'Time to breathe',
        body: 'Take a few minutes for yourself today.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: REMINDER_HOUR,
        minute: REMINDER_MINUTE,
        repeats: true,
      },
    });
  },

  async cancelDailyReminder() {
    await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
  },

  async init() {
    await this.setupAndroidChannel();
    const granted = await this.requestPermissionIfNeeded();
    if (granted) {
      await this.scheduleDailyReminder();
    }
  },
};