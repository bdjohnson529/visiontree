import { ThemedText } from '@/components/ThemedText';
import VideoPreview from '@/components/VideoPreview';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

interface VideoFile {
  name: string;
  path: string;
  size: number;
  modificationTime: number;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  videoItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  videoName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoDetails: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
});

export default function VideoGallery() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);

  const loadVideos = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory!);
      const videoFiles = files.filter(file => file.endsWith('.mov') || file.endsWith('.mp4'));
      
      const videoDetails = await Promise.all(
        videoFiles.map(async (fileName) => {
          const filePath = `${FileSystem.documentDirectory}${fileName}`;
          const info = await FileSystem.getInfoAsync(filePath);
          
          return {
            name: fileName,
            path: filePath,
            size: info.exists && !info.isDirectory ? (info as any).size || 0 : 0,
            modificationTime: info.exists ? (info as any).modificationTime || 0 : 0,
          };
        })
      );

      setVideos(videoDetails.sort((a, b) => b.modificationTime - a.modificationTime));
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadVideos();
    }, [])
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const renderVideoItem = ({ item }: { item: VideoFile }) => (
    <TouchableOpacity style={styles.videoItem} onPress={() => setSelectedVideo(item)}>
      <ThemedText style={styles.videoName}>{item.name}</ThemedText>
      <ThemedText style={styles.videoDetails}>
        {formatFileSize(item.size)} • {formatDate(item.modificationTime)}
      </ThemedText>
    </TouchableOpacity>
  );

  if (selectedVideo) {
    return (
      <VideoPreview 
        video={selectedVideo} 
        onClose={() => setSelectedVideo(null)}
        onDelete={() => {
          // Refresh the video list after deletion
          loadVideos();
        }}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.header}>Loading videos...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.header}>Recorded Videos</ThemedText>
      
      {videos.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>No videos recorded yet</ThemedText>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.path}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}