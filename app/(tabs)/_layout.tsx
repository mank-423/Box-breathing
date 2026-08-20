import { Tabs } from 'expo-router';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarStyle: {
          display: 'none', // ✅ Completely hide the tab bar
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          href: null, // Also hide from tab bar
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="box"
        options={{
          title: 'Box',
          href: null,
        }}
      />
      <Tabs.Screen
        name="sigh"
        options={{
          title: 'Sigh',
          href: null,
        }}
      />
      <Tabs.Screen
        name="four-seven-eight"
        options={{
          title: '4-7-8',
          href: null,
        }}
      />
    </Tabs>
  );
}