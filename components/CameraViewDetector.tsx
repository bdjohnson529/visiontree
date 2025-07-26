import { ThemedText } from '@/components/ThemedText';
import { detectObjects } from '@/src/ObjectDetectionPlugin';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
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
  const [frameData, setFrameData] = useState({ width: 1, height: 1 })
  
  const screenWidth = Dimensions.get('window').width
  const screenHeight = Dimensions.get('window').height

  const setFrameResultsWorklet = Worklets.createRunOnJS((results: string) => {
    const parsed = JSON.parse(results)
    setFrameResults(parsed.objects?.[0]?.label || 'Scanning...')
    setDetections(parsed.objects || [])
    setFrameData({ width: parsed.frameWidth || 1, height: parsed.frameHeight || 1 })
  })

  const frameProcessor = useFrameProcessor(
    (frame) => {
    'worklet'

    const result = detectObjects(frame)
    if (result && result.objects && result.objects.length > 0) {
      console.log('Objects detected:', result.objects[0])
      console.log('Orientation:', result.orientation)

      console.log("width: ", screenWidth)
      console.log("height: ", screenHeight)
      console.log("result width ", result.objects)
      console.log("result height ", result.objects)

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
      {detections.length > 0 && (() => {
        const detection = detections[0]
        const scaleX = screenWidth / frameData.width
        const scaleY = screenHeight / frameData.height
        
        return (
          <View style={{
            position: 'absolute',
            left: detection.bounds.x * scaleX,
            top: detection.bounds.y * scaleY,
            width: detection.bounds.width * scaleX,
            height: detection.bounds.height * scaleY,
            borderWidth: 2,
            borderColor: 'red',
            backgroundColor: 'transparent'
          }} />
        )
      })()}
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
