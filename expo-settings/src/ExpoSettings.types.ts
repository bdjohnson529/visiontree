export type Theme = 'light' | 'dark' | 'system';

export type ThemeChangeEvent = {
  theme: Theme;
};

export type ExpoSettingsModuleEvents = {
  onChangeTheme: (params: ThemeChangeEvent) => void;
};
