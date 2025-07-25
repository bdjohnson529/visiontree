import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type MyModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type MyModuleViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};

export type DeviceInfo = {
  name: string;
  model: string;
  systemName: string;
  systemVersion: string;
  screenWidth: number;
  screenHeight: number;
};

export type ImageAnalysis = {
  width: number;
  height: number;
  hasAlpha: boolean;
  bitsPerComponent: number;
  bitsPerPixel: number;
};

export type ProcessImageResult = {
  data?: ImageAnalysis[];
  error?: string;
};
