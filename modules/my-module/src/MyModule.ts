import { NativeModule, requireNativeModule } from 'expo';

import { MyModuleEvents, DeviceInfo, ProcessImageResult } from './MyModule.types';

declare class MyModule extends NativeModule<MyModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  getNativeGreeting(name: string): string;
  getDeviceInfo(): DeviceInfo;
  processImage(imageUri: string): Promise<ProcessImageResult>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MyModule>('MyModule');
