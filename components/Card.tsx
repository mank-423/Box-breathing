import { StyleSheet, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CardProp } from '@/types/HomeScreen';

const Card = ({ title, count, onChange, url }: CardProp) => {
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

  return (
    <Pressable 
      style={styles.card} 
      onPress={handleCardPress}
      disabled={!url} // Disable if no URL
    >
      <Text style={styles.title}>{title}</Text>

      <View style={styles.controls}>
        <Pressable 
          style={styles.button} 
          onPress={() => changeCount(0)}
          // Stop propagation so clicking button doesn't navigate
        >
          <Text style={styles.buttonText}>−</Text>
        </Pressable>

        <Text style={styles.count}>{count}</Text>

        <Pressable 
          style={styles.button} 
          onPress={() => changeCount(1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: 'black',
    borderRadius: 12,
    marginVertical: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '300',
  },
  count: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
});

export default Card;