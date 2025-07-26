import { ThemedText } from '@/components/ThemedText';
import { detectObjects } from '@/src/ObjectDetectionPlugin';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CameraDevice, useFrameProcessor, Camera as VisionCamera } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';

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


function CameraDetector({ device, isActive, style }: CameraViewProps) {
  
  const [frameResults, setFrameResults] = useState<string>('Scanning...');
  const [detections, setDetections] = useState([])

  const setFrameResultsWorklet = Worklets.createRunOnJS((results: string) => {
    const parsed = JSON.parse(results)
    setFrameResults(parsed.objects?.[0]?.label || 'Scanning...')
    setDetections(parsed.objects || [])
  })

  const frameProcessor = useFrameProcessor(
    (frame) => {
    'worklet'

    const result = detectObjects(frame)
    if (result && result.objects && result.objects.length > 0) {
      console.log('Objects detected:', result.objects[0])
      setFrameResultsWorklet(JSON.stringify(result))
    }
  },
  []
);

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <VisionCamera
        style={styles.camera}
        device={device!}
        isActive={isActive}
        frameProcessor={frameProcessor}
      />
      {detections.length > 0 && (
        <View style={{
          position: 'absolute',
          left: detections[0].bounds.x,
          top: detections[0].bounds.y,
          width: detections[0].bounds.width,
          height: detections[0].bounds.height,
          borderWidth: 2,
          borderColor: 'red',
          backgroundColor: 'transparent'
        }} />
      )}
      <View style={styles.overlay}>
        <ThemedText style={styles.text}>{frameResults}</ThemedText>
      </View>
    </View>
  );
}

export default function CameraViewDetector({ device, isActive, style }: CameraViewProps) {
  const [data, setData] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  if (!device) return null;


  return <CameraDetector device={device} isActive={true} style={style}/>;
}
