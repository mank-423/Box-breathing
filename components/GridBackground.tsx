import { StyleSheet, View, Image, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BreathingImages } from '@/constants/images';

const CELL_SIZE = 36;

export default function GridBackground() {
  const { width, height } = useWindowDimensions();
  const cols = Math.ceil(width / CELL_SIZE) + 1;
  const rows = Math.ceil(height / CELL_SIZE) + 1;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* 1. Base Background Image */}
      <Image
        source={BreathingImages.phoneBg}
        style={StyleSheet.absoluteFillObject}
        resizeMode="contain"
      />

      {/* 2. Soft dark overlay to ensure readability */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />

      {/* 3. Grid Lines rendered ON TOP of the image */}
      {Array.from({ length: cols }).map((_, i) => (
        <View
          key={`v-${i}`}
          style={{
            position: 'absolute',
            left: i * CELL_SIZE,
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: 'rgba(255,255,255,0.08)',
          }}
        />
      ))}
      {Array.from({ length: rows }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={{
            position: 'absolute',
            top: i * CELL_SIZE,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.08)',
          }}
        />
      ))}

      {/* 4. Soft Edge Vignette */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        start={{ x: 0.5, y: 0.4 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}