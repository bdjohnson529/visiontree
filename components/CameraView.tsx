import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { CameraDevice, Camera as VisionCamera } from 'react-native-vision-camera';


interface CameraViewProps {
  device: CameraDevice | undefined;
  isActive: boolean;
  style?: any;
}

function CameraWithModel({ device, isActive, style }: CameraViewProps) {
  const model = useTensorflowModel(require('../assets/models/1.tflite'));

  return (
    <VisionCamera
      style={[StyleSheet.absoluteFill, style]}
      device={device!}
      isActive={isActive}
    />
  );
}


export default function CameraView({ device, isActive, style }: CameraViewProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure we only render the hook after mount (avoids some RN/Suspense edge cases)
  useEffect(() => setMounted(true), []);

  if (!device) return null;

  if (!mounted) return <Text>Preparing…</Text>;

  return <CameraWithModel device={device} isActive={isActive} style={style} />;
}