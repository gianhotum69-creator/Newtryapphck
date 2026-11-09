export interface AppConfig {
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  themeColor: string;
  backgroundColor: string;
  orientation: 'portrait' | 'landscape' | 'sensor';
  fullscreen: boolean;
  enableOfflineCache: boolean;
  enableZoom: boolean;
  enableFileAccess: boolean;
  enableHardwareAcceleration: boolean;
  splashDurationMs: number;
  iconDataUrl: string;
  permissions: {
    internet: boolean;
    networkState: boolean;
    camera: boolean;
    location: boolean;
    storage: boolean;
    vibration: boolean;
    notifications: boolean;
    audioRecording: boolean;
  };
}

export interface ProjectFiles {
  html: string;
  css: string;
  js: string;
  assets?: { name: string; content: string; type: string }[];
}

export type SimulatorDevice = 'pixel8' | 'galaxy24' | 'iphone15' | 'tablet';

export interface TemplateApp {
  id: string;
  name: string;
  nameHindi: string;
  category: string;
  description: string;
  icon: string;
  config: Partial<AppConfig>;
  files: ProjectFiles;
}

export interface CodeValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  messageHindi: string;
  recommendation?: string;
}
