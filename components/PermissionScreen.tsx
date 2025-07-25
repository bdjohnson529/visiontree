import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface PermissionScreenProps {
  onPress: () => void;
}

export default function PermissionScreen({ onPress }: PermissionScreenProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Camera Permission Required
        </ThemedText>
        <ThemedText type="subtitle" style={styles.description}>
          This app needs access to your camera to capture photos and videos.
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Grant Permission
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});