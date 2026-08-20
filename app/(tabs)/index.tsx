import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import Card from '@/components/Card';
import useStore from '@/store/zustand-store';
import { Fonts, Spacing } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BreathingImages } from '@/constants/images';

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

  const techniques = [
    {
      id: 1,
      title: 'Box Breathing',
      description: '4-4-4-4 · Balance & Focus',
      count: boxBreathingState,
      setter: setBoxBreathingState,
      url: '/box',
      image: BreathingImages.box,
      icon: '⊞',
    },
    {
      id: 2,
      title: 'Sigh Breathing',
      description: '5-2-5 · Relax & Release',
      count: sighBreathingState,
      setter: setSighBreathingState,
      url: '/sigh',
      image: BreathingImages.sigh,
      icon: '◯',
    },
    {
      id: 3,
      title: '4-7-8 Breathing',
      description: '4-7-8 · Sleep & Calm',
      count: fourSevenEightState,
      setter: setFourSevenEightState,
      url: '/four-seven-eight',
      image: BreathingImages.fourSevenEight,
      icon: '◉',
    },
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
    >
      <LinearGradient
        colors={['rgba(108,92,231,0.2)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={styles.headerGlow}
      />
      <View style={styles.header}>
        <Text style={Fonts.title}>Breathe Easy</Text>
        <Text style={Fonts.body}>Find your calm, one breath at a time</Text>
      </View>

      <View style={styles.grid}>
        {techniques.map((tech) => (
          <View key={tech.id} style={styles.gridItem}>
            <Card
              title={tech.title}
              description={tech.description}
              count={tech.count}
              onChange={tech.setter}
              url={tech.url}
              image={tech.image}
              icon={tech.icon}
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
  headerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  grid: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  gridItem: {
    width: '100%',
  },
});