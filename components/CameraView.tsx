import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { CameraDevice, Camera as VisionCamera, useFrameProcessor } from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';

interface CameraViewProps {
  device: CameraDevice | undefined;
  isActive: boolean;
  style?: any;
}

function CameraWithModel({ device, isActive, style }: CameraViewProps) {
  const objectDetection = useTensorflowModel(require('../assets/models/1.tflite'));
  const model = objectDetection.state === 'loaded' ? objectDetection.model : undefined

  const { resize } = useResizePlugin()

  console.log(model);

  const [frameResults, setFrameResults] = useState<string>('Nelly is cute...');

  const frameProcessor = useFrameProcessor(
    (frame) => {
    'worklet'

    if (model == null) return

    // 1. Resize 4k Frame to 192x192x3 using vision-camera-resize-plugin
    const resized = resize(frame, {
      scale: {
        width: 224,
        height: 224,
      },
      pixelFormat: 'rgb',
      dataType: 'float32',
    })

    const outputs = model.runSync([resized])

    console.log(resized.length)
    console.log(outputs[0])

    console.log(`Frame: ${frame.width}x${frame.height} (${frame.pixelFormat})`)
    //console.log(`Resized: ${resized.length}`)
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
    minHeight: 80,
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