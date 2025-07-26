import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { CameraDevice, useFrameProcessor, Camera as VisionCamera } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { useResizePlugin } from 'vision-camera-resize-plugin';

import classNames from '../assets/models/mobilenetv1.json';

function getTop10Classes(sortedOutput: [string, number][]) {
  'worklet'

  const filtered = sortedOutput.filter(([, score]) => score > 0.4).slice(0, 3);
  
  if (filtered.length === 0) {
    return "No classes detected";
  }
  
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

  console.log(model)
  console.log("hello")
  const [frameResults, setFrameResults] = useState<string>('Scanning...');


  const onFaceDetected = Worklets.createRunOnJS((results: string) => {
    setFrameResults(results)
  })


  const frameProcessor = useFrameProcessor(
    (frame) => {
    'worklet'

    if (model == null) return

    // Frame processing only

    try {
      // 1. Resize Frame to 224x224x3 using vision-camera-resize-plugin
      const resized = resize(frame, {
        scale: {
          width: 224,
          height: 224,
        },
        pixelFormat: 'rgb',
        dataType: 'float32',
      })

      const outputs = model.runSync([resized])
      if (!outputs || !outputs[0]) {
        console.log('No outputs from model')
        return
      }

      const sortedOutput = Object.entries(outputs[0]).sort((a,b) => b[1] - a[1])
      const top10Classes = getTop10Classes(sortedOutput)

      // Remove global results storage for now

      if (top10Classes !== "No classes detected") {
        console.log("goodbye")
        console.log(top10Classes)
        onFaceDetected(top10Classes)
      }
    } catch (error) {
      console.log('Frame processing error:', error)
    }

    //console.log(`Frame: ${frame.width}x${frame.height} (${frame.pixelFormat})`)
    //console.log(`Resized: ${resized.length}`)
  },
  [onFaceDetected]
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

  // Ensure we only render the hook after mount (avoids some RN/Suspense edge cases)
  useEffect(() => setMounted(true), []);

  if (!device) return null;

  if (!mounted) return <Text>Preparing…</Text>;

  return <CameraWithModel device={device} isActive={isActive} style={style} />;
}