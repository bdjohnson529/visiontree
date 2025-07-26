import { ThemedText } from '@/components/ThemedText';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCameraDevice } from 'react-native-vision-camera';

export default function CameraViewDetector() {
  const [data, setData] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const device = useCameraDevice('back');

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <ThemedText style={styles.text}>
          Detector Component - Boilerplate
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    fontSize: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
});