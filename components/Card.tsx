import { StyleSheet, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CardProp } from '@/types/HomeScreen';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';

const Card = ({ title, description, count, onChange, url, colors }: CardProp) => {
  const router = useRouter();

  const changeCount = (state: number) => {
    if (state === 0) {
      const newCount = count > 0 ? count - 1 : count;
      onChange(newCount);
    } else {
      const newCount = count + 1;
      onChange(newCount);
    }
  };

  const handleCardPress = () => {
    if (url) {
      router.push(url as any);
    }
  };

  const gradientColors = colors || ['#667eea', '#764ba2'];

  return (
    <Pressable
      style={styles.card}
      onPress={handleCardPress}
      disabled={!url}
    >
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.cardContent}>
        <View style={styles.textSection}>
          <Text style={styles.title}>{title}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>

        <View style={styles.controls}>
          <Pressable
            style={styles.button}
            onPress={() => changeCount(0)}
          >
            <Text style={styles.buttonText}>−</Text>
          </Pressable>

          <View style={styles.countContainer}>
            <Text style={styles.count}>{count}</Text>
            <Text style={styles.countLabel}>cycles</Text>
          </View>

          <Pressable
            style={styles.button}
            onPress={() => changeCount(1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  cardContent: {
    padding: Spacing.md,
  },
  textSection: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Fonts.subtitle,
    fontSize: 20,
  },
  description: {
    ...Fonts.body,
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    padding: Spacing.md,
    backgroundColor: Colors.grayLight,
    borderRadius: BorderRadius.sm,
    minWidth: 48,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '300',
  },
  countContainer: {
    alignItems: 'center',
  },
  count: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '600',
  },
  countLabel: {
    ...Fonts.label,
    fontSize: 10,
    textTransform: 'uppercase',
  },
});

export default Card;