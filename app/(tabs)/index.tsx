import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { Button } from '@react-navigation/elements';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
    >
      <ThemedView style={[styles.titleContainer, styles.transparent, { marginTop: insets.top }]}>
        <ThemedText type="title">Hello</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={[styles.titleContainer, styles.transparent]}>
        <ThemedText type="title">Box Breathing</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.titleContainer, styles.transparent]}>
        <Link href="/breath" asChild>
          <Button>
            Go for activity
          </Button>
        </Link>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  linkButton: {
    borderRadius: 10,
    backgroundColor: 'white',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});