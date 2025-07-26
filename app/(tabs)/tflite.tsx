import { StyleSheet } from 'react-native';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import PermissionScreen from '@/components/PermissionScreen';
import CameraViewTflite from '@/components/CameraViewTflite';

export default function HomeScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  if (!hasPermission) {
    return <PermissionScreen onPress={requestPermission} />
  } else {
    return (
      <CameraViewTflite
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
      />
    );
  }
}
