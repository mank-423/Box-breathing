import { Tabs } from 'expo-router';
import Ionicons from '@react-native-vector-icons/ionicons';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#015595';
const ACCENT_COLOR = '#F97316';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={20}
            tint="dark"
            style={{
              ...StyleSheet.absoluteFillObject,
              overflow: 'hidden',
            }}
          />
        ),
        tabBarActiveTintColor: ACCENT_COLOR, // ✅ Orange instead of blue
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="streak"
        options={{
          title: 'Streak',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flame" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="box"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="sigh"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="four-seven-eight"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}