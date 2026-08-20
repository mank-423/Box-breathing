import { StyleSheet, Pressable, Text, View, ImageBackground, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { Fonts, Spacing, BorderRadius } from '@/constants/theme';
import { CardProp } from '@/types/HomeScreen';


export default function Card({
  title,
  description,
  count,
  onChange,
  url,
  image,
  icon,
}: CardProp) {
  const router = useRouter();

  const handlePress = () => {
    if (url) router.push(url as any);
  };

  return (
    <Pressable style={styles.card} onPress={handlePress} disabled={!url}>
      <ImageBackground
        source={image}
        style={styles.backgroundImage}
        imageStyle={{ borderRadius: BorderRadius.md }}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <View style={styles.textSection}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {description && <Text style={styles.description}>{description}</Text>}
            </View>
          </View>

          <View style={styles.controls}>
            <Pressable
              style={styles.button}
              onPress={(e) => {
                e.stopPropagation();
                const newCount = count > 0 ? count - 1 : count;
                onChange(newCount);
              }}
            >
              <Text style={styles.buttonText}>−</Text>
            </Pressable>

            <View style={styles.countContainer}>
              <Text style={styles.count}>{count}</Text>
              <Text style={styles.countLabel}>cycles</Text>
            </View>

            <Pressable
              style={styles.button}
              onPress={(e) => {
                e.stopPropagation();
                onChange(count + 1);
              }}
            >
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.sm,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  backgroundImage: {
    width: '100%',
  },
  content: {
    padding: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Subtle backdrop overlay to ensure crisp readability
  },
  textSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  icon: {
    fontSize: 28,
    marginRight: Spacing.md,
    color: '#1A1A1A', // Dark color for light background
  },
  title: {
    ...Fonts.subtitle,
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A', // Dark text color
  },
  description: {
    ...Fonts.body,
    fontSize: 13,
    marginTop: 2,
    color: '#333333', // Slightly lighter dark text for description
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    padding: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.08)', // Dark translucent button background for contrast
    borderRadius: BorderRadius.sm,
    minWidth: 44,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1A1A1A',
    fontSize: 24,
    fontWeight: '400',
  },
  countContainer: {
    alignItems: 'center',
  },
  count: {
    color: '#1A1A1A',
    fontSize: 28,
    fontWeight: '700',
  },
  countLabel: {
    ...Fonts.label,
    fontSize: 10,
    color: '#4A4A4A',
    fontWeight: '600',
  },
});