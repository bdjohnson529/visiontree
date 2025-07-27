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
  label?: string;
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  labelsButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  labelsButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  labelsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  labelsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  labelsContent: {
    fontSize: 12,
    fontFamily: 'monospace',
    opacity: 0.8,
  },
});

export default function VideoGallery() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [showLabelsFile, setShowLabelsFile] = useState(false);
  const [labelsFileContent, setLabelsFileContent] = useState<string>('');

  const loadVideos = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory!);
      const videoFiles = files.filter(file => file.endsWith('.mov') || file.endsWith('.mp4'));
      
      // Load labels data
      let labelsData: { [key: string]: string } = {};
      const labelsFilePath = `${FileSystem.documentDirectory}labels.json`;
      const labelsFileInfo = await FileSystem.getInfoAsync(labelsFilePath);
      if (labelsFileInfo.exists) {
        const labelsContent = await FileSystem.readAsStringAsync(labelsFilePath);
        setLabelsFileContent(labelsContent);
        labelsData = JSON.parse(labelsContent);
      } else {
        setLabelsFileContent('{}');
      }
      
      const videoDetails = await Promise.all(
        videoFiles.map(async (fileName) => {
          const filePath = `${FileSystem.documentDirectory}${fileName}`;
          const info = await FileSystem.getInfoAsync(filePath);
          
          return {
            name: fileName,
            path: filePath,
            size: info.exists && !info.isDirectory ? (info as any).size || 0 : 0,
            modificationTime: info.exists ? (info as any).modificationTime || 0 : 0,
            label: labelsData[fileName] || undefined,
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
      {item.label && (
        <ThemedText style={[styles.videoDetails, { marginBottom: 4, fontWeight: 'bold', opacity: 1 }]}>
          Label: {item.label}
        </ThemedText>
      )}
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

  if (showLabelsFile) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.header}>Labels File</ThemedText>
          <TouchableOpacity 
            style={styles.labelsButton} 
            onPress={() => setShowLabelsFile(false)}
          >
            <ThemedText style={styles.labelsButtonText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.labelsContainer}>
          <ThemedText style={styles.labelsTitle}>labels.json</ThemedText>
          <ThemedText style={styles.labelsContent}>{labelsFileContent}</ThemedText>
        </View>
      </View>
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
      <View style={styles.headerRow}>
        <ThemedText style={styles.header}>Recorded Videos</ThemedText>
        <TouchableOpacity 
          style={styles.labelsButton} 
          onPress={() => setShowLabelsFile(true)}
        >
          <ThemedText style={styles.labelsButtonText}>View Labels</ThemedText>
        </TouchableOpacity>
      </View>
      
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