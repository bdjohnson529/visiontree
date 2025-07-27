import VideoGallery from '@/components/VideoGallery';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
});

export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <VideoGallery />
    </View>
  );
}