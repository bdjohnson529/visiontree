import React from 'react';
import { StyleSheet } from 'react-native';
import { Camera as VisionCamera, CameraDevice } from 'react-native-vision-camera';
import { useTreeAnalysis } from '@/hooks/useTreeAnalysis';

interface CameraViewProps {
  device: CameraDevice | undefined;
  isActive: boolean;
  style?: any;
  onTreeAnalysis?: (result: any) => void;
}

export default function CameraView({ device, isActive, style, onTreeAnalysis }: CameraViewProps) {
  const { frameProcessor } = useTreeAnalysis({
    onAnalysisResult: onTreeAnalysis,
    analysisInterval: 30
  });

  if (!device) {
    return null;
  }

  return (
    <VisionCamera
      style={[StyleSheet.absoluteFill, style]}
      device={device}
      isActive={isActive}
      frameProcessor={frameProcessor}
    />
  );
}