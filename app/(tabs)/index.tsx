import { StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@react-navigation/elements';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import Card from '@/components/Card';
import useStore from '@/store/zustand-store';

export default function HomeScreen() {
  const { 
    boxBreathingState, 
    setBreathingState
  } = useStore();

  const breathingTechniques = [
    { 
      id: 1, 
      title: 'Box Breathing', 
      count: boxBreathingState, 
      setter: setBreathingState,
      url: '/breath' 
    },
    { 
      id: 2, 
      title: 'Sigh Breathing', 
      count: 2, 
      setter: ()=> {},
      url: '/breath/sigh'
    },
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Breathing Techniques</Text>
        <Text style={styles.headerSubtitle}>Select your practice</Text>
      </View>

      <View style={styles.grid}>
        {breathingTechniques.map((technique) => (
          <View key={technique.id} style={styles.gridItem}>
            <Card 
              title={technique.title}
              count={technique.count}
              onChange={technique.setter}
              url={technique.url} // ✅ Pass the URL
            />
          </View>
        ))}
      </View>

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
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
  },
  gridItem: {
    width: '48%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});