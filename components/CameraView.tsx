import React from 'react';
import { StyleSheet } from 'react-native';
import { Camera as VisionCamera, CameraDevice } from 'react-native-vision-camera';

interface CameraViewProps {
  device: CameraDevice | undefined;
  isActive: boolean;
  style?: any;
}

export default function CameraView({ device, isActive, style }: CameraViewProps) {
  if (!device) {
    return null;
  }

  return (
    <VisionCamera
      style={[StyleSheet.absoluteFill, style]}
      device={device}
      isActive={isActive}
    />
  );
}