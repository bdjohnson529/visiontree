import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CameraDevice, Camera as VisionCamera } from 'react-native-vision-camera';

interface CameraViewProps {
  device: CameraDevice | undefined;
  isActive: boolean;
  style?: any;
}

const styles = StyleSheet.create({
  camera: {
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

function CameraCapture({ device, isActive, style }: CameraViewProps) {
  const [status] = useState<string>('Ready to capture...');

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <VisionCamera
        style={styles.camera}
        device={device!}
        isActive={isActive}
      />
      <View style={styles.overlay}>
        <ThemedText style={styles.text}>{status}</ThemedText>
      </View>
    </View>
  );
}

export default function CameraViewCapture({ device, isActive, style }: CameraViewProps) {
  if (!device) return null;

  return <CameraCapture device={device} isActive={isActive} style={style}/>;
}