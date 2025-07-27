import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface VideoFile {
  name: string;
  path: string;
  size: number;
  modificationTime: number;
}

interface VideoPreviewProps {
  video: VideoFile;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: screenWidth,
    height: screenHeight * 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default function VideoPreview({ video, onClose }: VideoPreviewProps) {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
    if (!status.isLoaded && 'error' in status && status.error) {
      setError(status.error);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{video.name}</ThemedText>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={48} color="#fff" />
          <ThemedText style={styles.errorText}>
            Unable to play video. The file may be corrupted or in an unsupported format.
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{video.name}</ThemedText>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: video.path }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      </View>
    </View>
  );
}