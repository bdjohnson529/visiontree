import { StyleSheet } from 'react-native';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

import PermissionScreen from '@/components/PermissionScreen';
import CameraView from '@/components/CameraView';

export default function HomeScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back')

  if (!hasPermission) {
    return <PermissionScreen onPress={requestPermission} />
  } else {
    return (
      <CameraView
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    );
  }
}
