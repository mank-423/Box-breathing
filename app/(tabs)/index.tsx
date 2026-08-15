import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { Button } from '@react-navigation/elements';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#000000', dark: '#000000' }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hello</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Box Breathing</ThemedText>
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <Link href={'/breath'}>
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
  appContainer: {
    backgroundColor: '#0000'
  },
  linkButton: {
    borderRadius: '10px',
    backgroundColor: 'white'
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
