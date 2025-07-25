import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { CameraDevice, Camera as VisionCamera, useFrameProcessor } from 'react-native-vision-camera';

import { useResizePlugin } from 'vision-camera-resize-plugin';

interface CameraViewProps {
  device: CameraDevice | undefined;
  isActive: boolean;
  style?: any;
}

function CameraWithModel({ device, isActive, style }: CameraViewProps) {
  const model = useTensorflowModel(require('../assets/models/1.tflite'));

  const { resize } = useResizePlugin();
  const frameProcessor = useFrameProcessor((frame) => {
      'worklet'

      const resized = resize(frame, {
        scale: {
          width: 192,
          height: 192
        },
        pixelFormat: 'rgb',
        dataType: 'uint8'
      });

    // Use resized data with your TensorFlow model here
    }, [resize]);

  return (
    <VisionCamera
      style={[StyleSheet.absoluteFill, style]}
      device={device!}
      isActive={isActive}
      frameProcessor={frameProcessor}
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