import { StyleSheet, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';
import { CardProp } from '@/types/HomeScreen';
import { haptics } from '@/utils/haptics';

export default function Card({
  title,
  description,
  count,
  onChange,
  url,
  color,
  icon,
}: CardProp) {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => url && router.push(url as any)}
      disabled={!url}
    >
      <LinearGradient
        colors={[hexToRgba(color, 0.14), 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.textSection}>
          {icon && (
            <View style={[styles.iconChip, { backgroundColor: hexToRgba(color, 0.18) }]}>
              <Text style={[styles.icon, { color }]}>{icon}</Text>
            </View>
          )}
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
              haptics.select();
              onChange(count > 1 ? count - 1 : count);
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
              haptics.select();
              onChange(count + 1);
            }}
          >
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const parsed = hex.replace('#', '');
  const r = parseInt(parsed.substring(0, 2), 16);
  const g = parseInt(parsed.substring(2, 4), 16);
  const b = parseInt(parsed.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.sm,
    overflow: 'hidden',
    backgroundColor: Colors.glassSurface,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  cardPressed: {
    opacity: 0.85,
  },
  content: {
    padding: Spacing.md,
  },
  textSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 22,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...Fonts.subtitle,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    ...Fonts.body,
    fontSize: 13,
    marginTop: 2,
    color: Colors.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    padding: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.sm,
    minWidth: 44,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '400',
  },
  countContainer: {
    alignItems: 'center',
  },
  count: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  countLabel: {
    ...Fonts.label,
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});