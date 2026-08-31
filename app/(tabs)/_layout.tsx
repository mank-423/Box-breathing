import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import Ionicons from '@react-native-vector-icons/ionicons';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const ACCENT_COLOR = '#F97316';
const TAB_HEIGHT = 65;
const CIRCLE_SIZE = 56;

// Custom SVG Background with Center Curve
function CurvedTabBarBackground() {
  const h = TAB_HEIGHT;
  const w = width;
  const cr = 35; // Curve radius around button

  // SVG Bezier path creating the top curve in the center
  const path = `
    M 0 0
    L ${w / 2 - cr - 10} 0
    C ${w / 2 - cr} 0, ${w / 2 - cr + 5} ${cr}, ${w / 2} ${cr}
    C ${w / 2 + cr - 5} ${cr}, ${w / 2 + cr} 0, ${w / 2 + cr + 10} 0
    L ${w} 0
    L ${w} ${h + 40}
    L 0 ${h + 40}
    Z
  `;

  return (
    <Svg width={w} height={h + 40} style={StyleSheet.absoluteFill}>
      <Path fill="rgba(0,0,0,0.85)" d={path} />
    </Svg>
  );
}

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: 'transparent' },
          tabBarStyle: styles.tabBar,
          tabBarBackground: CurvedTabBarBackground,
          tabBarActiveTintColor: ACCENT_COLOR,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
          tabBarLabelStyle: styles.label,
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

        {/* Dummy Tab to reserve space in the center curve */}
        <Tabs.Screen
          name="sos-placeholder"
          options={{
            title: '',
            tabBarButton: () => <View style={{ flex: 1 }} />,
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

        {/* Hidden Routes */}
        <Tabs.Screen name="box" options={{ href: null }} />
        <Tabs.Screen name="sigh" options={{ href: null }} />
        <Tabs.Screen name="four-seven-eight" options={{ href: null }} />
      </Tabs>

      {/* Center Floating SOS Button */}
      <View style={styles.sosButtonWrapper} pointerEvents="box-none">
        <Pressable
          style={({ pressed }) => [
            styles.sosButton,
            pressed && styles.sosButtonPressed,
          ]}
          onPress={() => router.push('/sigh')}
        >
          <Ionicons name="alert-circle" size={32} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_HEIGHT,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 4,
  },
  sosButtonWrapper: {
    position: 'absolute',
    bottom: TAB_HEIGHT - CIRCLE_SIZE / 2 + 5,
    left: width / 2 - CIRCLE_SIZE / 2,
    alignItems: 'center',
    // justify: 'center',
    zIndex: 10,
  },
  sosButton: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  sosButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});