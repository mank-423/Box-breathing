import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import GridBackground from '@/components/GridBackground';
import { notificationService } from '@/services/notificationService';

export default function RootLayout() {
  useEffect(() => {
    notificationService.init();
  }, []);

  return (
    <View style={styles.root}>
      <GridBackground />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
});