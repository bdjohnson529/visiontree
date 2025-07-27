import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <ThemedView style={styles.linksContainer}>
        <Link href="/capture" style={styles.tabLink}>
          <ThemedText type="link">Go to Capture Screen</ThemedText>
        </Link>
        <Link href="/detector" style={styles.tabLink}>
          <ThemedText type="link">Go to Detector</ThemedText>
        </Link>
        <Link href="/google" style={styles.tabLink}>
          <ThemedText type="link">Go to Google Vision</ThemedText>
        </Link>
        <Link href="/tflite" style={styles.tabLink}>
          <ThemedText type="link">Go to TFLite</ThemedText>
        </Link>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  linksContainer: {
    marginVertical: 16,
    gap: 12,
  },
  tabLink: {
    marginVertical: 4,
  },
});
