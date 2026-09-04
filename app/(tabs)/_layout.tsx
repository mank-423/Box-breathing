import React from 'react';
import { View, StyleSheet, Pressable, Dimensions, Text } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import Ionicons from '@react-native-vector-icons/ionicons';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Color Palette
const PRIMARY_COLOR = '#015595';
const SOS_COLOR = '#E74C3C'; // Red for SOS
const INACTIVE_COLOR = 'rgba(255, 255, 255, 0.45)';
const ACTIVE_COLOR = '#F59E0B';

const TAB_HEIGHT = 65;
const CIRCLE_SIZE = 58;

function CurvedTabBarBackground() {
  const h = TAB_HEIGHT;
  const w = width;
  const center = w / 2;

  const path = `
    M 0 0
    L ${center - 55} 0
    C ${center - 35} 0, ${center - 30} 32, ${center} 32
    C ${center + 30} 32, ${center + 35} 0, ${center + 55} 0
    L ${w} 0
    L ${w} ${h + 40}
    L 0 ${h + 40}
    Z
  `;

  return (
    <Svg width={w} height={h + 40} style={StyleSheet.absoluteFill}>
      <Path fill="rgba(18, 20, 26, 0.92)" d={path} />
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
          tabBarActiveTintColor: ACTIVE_COLOR,
          tabBarInactiveTintColor: INACTIVE_COLOR,
          tabBarLabelStyle: styles.label,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="streak"
          options={{
            title: 'Streak',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flame-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Hidden Detail Routes */}
        <Tabs.Screen name="box" options={{ href: null }} />
        <Tabs.Screen name="sigh" options={{ href: null }} />
        <Tabs.Screen name="four-seven-eight" options={{ href: null }} />
      </Tabs>

      {/* SOS Center Button */}
      <View style={styles.centerButtonContainer} pointerEvents="box-none">
        <Pressable
          style={({ pressed }) => [
            styles.centerButton,
            pressed && styles.centerButtonPressed,
          ]}
          onPress={() => router.push('/sigh')}
        >
          <Ionicons name="pulse" size={28} color="#FFFFFF" />
          <View style={styles.sosPulse}>
            <View style={styles.sosPulseRing} />
            <View style={[styles.sosPulseRing, styles.sosPulseRingDelay]} />
          </View>
        </Pressable>
        <Text style={styles.sosLabel}>SOS</Text>
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
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  centerButtonContainer: {
    position: 'absolute',
    bottom: TAB_HEIGHT - CIRCLE_SIZE / 2 - 2,
    left: width / 2 - CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  centerButton: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: SOS_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: SOS_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  centerButtonPressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.9,
  },
  sosLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  sosPulse: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosPulseRing: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    borderColor: SOS_COLOR,
    opacity: 0,
    transform: [{ scale: 1 }],
  },
  sosPulseRingDelay: {
    animationDelay: '500ms',
  },
});