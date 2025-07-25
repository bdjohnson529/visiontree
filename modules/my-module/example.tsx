import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import MyModule from './src/MyModule';

export default function MyModuleExample() {
  const testNativeGreeting = () => {
    const greeting = MyModule.getNativeGreeting('Developer');
    Alert.alert('Native Greeting', greeting);
  };

  const testDeviceInfo = () => {
    const deviceInfo = MyModule.getDeviceInfo();
    Alert.alert('Device Info', JSON.stringify(deviceInfo, null, 2));
  };

  const testImageProcessing = async () => {
    try {
      // Using a placeholder image URL for testing
      const result = await MyModule.processImage('https://via.placeholder.com/300x200');
      Alert.alert('Image Analysis', JSON.stringify(result, null, 2));
    } catch (error) {
      Alert.alert('Error', `Failed to process image: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MyModule Native Objective-C Test</Text>
      
      <Button
        title="Test Native Greeting"
        onPress={testNativeGreeting}
      />
      
      <Button
        title="Get Device Info"
        onPress={testDeviceInfo}
      />
      
      <Button
        title="Test Image Processing"
        onPress={testImageProcessing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});