import { ThemedText } from '@/components/ThemedText';
import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCameraDevice } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera-v3-image-labeling';
import { useFocusEffect } from '@react-navigation/native';

export default function CameraViewGoogleLabel() {
  const [data, setData] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const device = useCameraDevice('back');
  console.log(data);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  return (
    <View style={styles.container}>
      {!!device && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isFocused}
          options={{
            minConfidence: 0.1
          }}
          callback={(d) => setData(d)}
        />
      )}
      <View style={styles.overlay}>
        <ThemedText style={styles.text}>
          {data && data.length > 0 ? data[0].label : 'No object detected'}
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