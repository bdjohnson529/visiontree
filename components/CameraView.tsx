import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { CameraDevice, Camera as VisionCamera, useFrameProcessor } from 'react-native-vision-camera';

interface CameraViewProps {
  device: CameraDevice | undefined;
  isActive: boolean;
  style?: any;
}

function CameraWithModel({ device, isActive, style }: CameraViewProps) {
  const model = useTensorflowModel(require('../assets/models/1.tflite'));
  const [frameResults, setFrameResults] = useState<string>('Ellie is cute...');

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    console.log(`Frame: ${frame.width}x${frame.height} (${frame.pixelFormat})`)
  }, []);

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