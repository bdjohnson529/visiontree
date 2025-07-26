import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, View } from 'react-native';

export default function HelloWorld() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>Hello World</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});