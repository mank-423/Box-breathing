import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import Card from '@/components/Card';
import useStore from '@/store/zustand-store';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const {
    boxBreathingState,
    setBoxBreathingState,
    sighBreathingState,
    setSighBreathingState,
    fourSevenEightState,
    setFourSevenEightState,
  } = useStore();

  const breathingTechniques = [
    {
      id: 1,
      title: 'Box Breathing',
      description: '4-4-4-4 • Calm & Focus',
      count: boxBreathingState,
      setter: setBoxBreathingState,
      url: '/box',
      colors: ['#667eea', '#764ba2'],
    },
    {
      id: 2,
      title: 'Sigh Breathing',
      description: '5-2-5 • Relax & Release',
      count: sighBreathingState,
      setter: setSighBreathingState,
      url: '/sigh',
      colors: ['#f093fb', '#f5576c'],
    },
    {
      id: 3,
      title: '4-7-8 Breathing',
      description: '4-7-8 • Sleep & Calm',
      count: fourSevenEightState,
      setter: setFourSevenEightState,
      url: '/four-seven-eight',
      colors: ['#6C5CE7', '#A29BFE'],
    },
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
    >
      <View style={styles.header}>
        <Text style={Fonts.title}>Breathe Easy</Text>
        <Text style={Fonts.body}>Find your calm, one breath at a time</Text>
      </View>

      <View style={styles.grid}>
        {breathingTechniques.map((technique) => (
          <View key={technique.id} style={styles.gridItem}>
            <Card
              title={technique.title}
              description={technique.description}
              count={technique.count}
              onChange={technique.setter}
              url={technique.url}
              colors={technique.colors}
            />
          </View>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  grid: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  gridItem: {
    width: '100%',
  },
});