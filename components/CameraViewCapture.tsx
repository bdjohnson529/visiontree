import { ThemedText } from '@/components/ThemedText';
import * as FileSystem from 'expo-file-system';
import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import { CameraDevice, Camera as VisionCamera } from 'react-native-vision-camera';

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
  labelInput: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    zIndex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    zIndex: 1,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

function CameraCapture({ device, isActive, style }: CameraViewProps) {
  const camera = useRef<VisionCamera>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Ready to capture...');
  const [label, setLabel] = useState<string>('');

  const saveLabelsData = async (fileName: string, label: string) => {
    const labelsFilePath = `${FileSystem.documentDirectory}labels.json`;
    
    try {
      let labelsData: { [key: string]: string } = {};
      
      // Read existing labels file if it exists
      const fileInfo = await FileSystem.getInfoAsync(labelsFilePath);
      if (fileInfo.exists) {
        const existingData = await FileSystem.readAsStringAsync(labelsFilePath);
        labelsData = JSON.parse(existingData);
      }
      
      // Add new label
      labelsData[fileName] = label;
      
      // Save updated labels data
      await FileSystem.writeAsStringAsync(labelsFilePath, JSON.stringify(labelsData, null, 2));
      console.log('Labels data saved for:', fileName);
    } catch (error) {
      console.error('Error saving labels data:', error);
    }
  };

  const saveVideoToFilesystem = async (uri: string) => {
    const fileName = uri.split('/').pop();
    const newPath = `${FileSystem.documentDirectory}${fileName}`;

    try {
      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });
      console.log('Video saved to:', newPath);
      
      // Save label data if label is provided
      if (label.trim() && fileName) {
        await saveLabelsData(fileName, label.trim());
      }
      
      return newPath;
    } catch (error) {
      console.error('Error saving video:', error);
      throw error;
    }
  };

  const startRecording = () => {
    if (camera.current && !isRecording) {
      camera.current.startRecording({
        onRecordingFinished: (video) => {
          console.log(video.path);
          setStatus('Recording finished');
          setIsRecording(false);
          saveVideoToFilesystem(video.path);
          setLabel(''); // Clear label after recording
        },
        onRecordingError: (error) => {
          console.error(error);
          setStatus('Recording error');
          setIsRecording(false);
        }
      });
      setIsRecording(true);
      setStatus('Recording...');
    }
  };

  const stopRecording = () => {
    if (camera.current && isRecording) {
      camera.current.stopRecording();
    }
  };

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <VisionCamera
        ref={camera}
        style={styles.camera}
        device={device!}
        isActive={isActive}
        video={true}
      />
      <View style={styles.overlay}>
        <ThemedText style={styles.text}>{status}</ThemedText>
      </View>
      <TextInput
        style={styles.labelInput}
        placeholder="Enter label for this recording..."
        placeholderTextColor="#666"
        value={label}
        onChangeText={setLabel}
        editable={!isRecording}
      />
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, { opacity: isRecording ? 0.5 : 1 }]} 
          onPress={startRecording}
          disabled={isRecording}
        >
          <ThemedText style={styles.buttonText}>Start</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { opacity: !isRecording ? 0.5 : 1 }]} 
          onPress={stopRecording}
          disabled={!isRecording}
        >
          <ThemedText style={styles.buttonText}>Stop</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CameraViewCapture({ device, isActive, style }: CameraViewProps) {
  if (!device) return null;

  return <CameraCapture device={device} isActive={isActive} style={style}/>;
}
