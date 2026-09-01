import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import GridBackground from '@/components/GridBackground';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from '@/widgets/widget-task-handler';

registerWidgetTaskHandler(widgetTaskHandler);

export default function RootLayout() {
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