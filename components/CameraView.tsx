import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { CameraDevice, useFrameProcessor, Camera as VisionCamera } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { useResizePlugin } from 'vision-camera-resize-plugin';

import classNames from '../assets/models/mobilenetv1.json';

function getDetectedClasses(output: Record<string, number>) {
  'worklet'

  // sort classes by probabilities
  const sortedOutput = Object.entries(output).sort((a,b) => b[1] - a[1])
  
  // apply confidence interval of 0.4 and get top 3 results
  const filtered = sortedOutput.filter(([, score]) => score > 0.4).slice(0, 3);
  
  if (filtered.length === 0) {
    return "No classes detected";
  }
  
  // return stringified results
  const classNamesList = filtered.map(([index, score]) => (classNames as any)[index][1]);
  return classNamesList.join(', ');
}

interface CameraViewProps {
  device: CameraDevice | undefined;
  isActive: boolean;
  style?: any;
}

function CameraWithModel({ device, isActive, style }: CameraViewProps) {
  const objectDetection = useTensorflowModel(require('../assets/models/mobilenetv1.tflite'));
  const model = objectDetection.state === 'loaded' ? objectDetection.model : undefined

  const { resize } = useResizePlugin()

  //console.log(model)
  console.log("hello")

  const [frameResults, setFrameResults] = useState<string>('Scanning...');

  const setFrameResultsWorklet = Worklets.createRunOnJS((results: string) => {
    setFrameResults(results)
  })

  const frameProcessor = useFrameProcessor(
    (frame) => {
    'worklet'

    if (model == null) return

    try {
      // resize frame to fit model
      const resized = resize(frame, {
        scale: {
          width: 224,
          height: 224,
        },
        pixelFormat: 'rgb',
        dataType: 'float32',
      })

      // run model
      const outputs = model.runSync([resized])
      if (!outputs || !outputs[0]) {
        console.log('No outputs from model')
        return
      }

      // get results
      const detectedClasses = getDetectedClasses(outputs[0])

      // update UI
      if (detectedClasses !== "No classes detected") {
        console.log(detectedClasses)
        setFrameResultsWorklet(detectedClasses)
      }
    } catch (error) {
      console.log('Frame processing error:', error)
    }

  },
  [setFrameResultsWorklet]
);

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <VisionCamera
        style={styles.camera}
        device={device!}
        isActive={isActive}
        frameProcessor={frameProcessor}
      />
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{frameResults}</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  resultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    minHeight: 100,
  },
  resultText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default function CameraView({ device, isActive, style }: CameraViewProps) {
  const [mounted, setMounted] = useState(false);

  // ensure we only render the hook after mount
  useEffect(() => setMounted(true), []);

  if (!device) return null;

  if (!mounted) return <Text>Preparing…</Text>;

  return <CameraWithModel device={device} isActive={isActive} style={style} />;
}