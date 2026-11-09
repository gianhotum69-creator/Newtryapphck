import React from 'react';
import {
  Smartphone,
  Shield,
  Palette,
  Layers,
  Settings,
  HelpCircle,
  Check,
  AlertCircle
} from 'lucide-react';
import { AppConfig } from '../types/appConfig';

interface ConfigPanelProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  lang: 'hi' | 'en';
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  setConfig,
  lang
}) => {
  const isPackageValid = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/i.test(config.packageName);

  const handlePermissionToggle = (permKey: keyof AppConfig['permissions']) => {
    setConfig(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permKey]: !prev.permissions[permKey]
      }
    }));
  };

  const presetColors = [
    '#0ea5e9', // Sky Blue
    '#10b981', // Emerald
    '#7c3aed', // Violet
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#0f172a', // Slate Dark
    '#ec4899', // Pink
    '#06b6d4', // Cyan
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto p-4 lg:p-6 space-y-6 text-slate-200">
      {/* 1. App Identity Section */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">
            {lang === 'hi' ? 'ऐप का नाम और पैकेज आईडी' : 'App Identity & Package'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {lang === 'hi' ? 'ऐप का नाम (App Title)' : 'App Name'}
            </label>
            <input
              type="text"
              value={config.appName}
              onChange={(e) => setConfig(prev => ({ ...prev, appName: e.target.value }))}
              placeholder="My Mobile App"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>{lang === 'hi' ? 'पैकेज आईडी (Package Name)' : 'Package Name'}</span>
              {!isPackageValid && (
                <span className="text-[10px] text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> com.name.app
                </span>
              )}
            </label>
            <input
              type="text"
              value={config.packageName}
              onChange={(e) => setConfig(prev => ({ ...prev, packageName: e.target.value.toLowerCase() }))}
              placeholder="com.example.myapp"
              className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs font-mono outline-none ${
                isPackageValid ? 'border-slate-800 focus:border-emerald-500 text-slate-200' : 'border-amber-500 text-amber-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {lang === 'hi' ? 'वर्शन नाम (Version Name)' : 'Version Name'}
            </label>
            <input
              type="text"
              value={config.versionName}
              onChange={(e) => setConfig(prev => ({ ...prev, versionName: e.target.value }))}
              placeholder="1.0.0"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {lang === 'hi' ? 'वर्शन कोड (Version Code)' : 'Version Code'}
            </label>
            <input
              type="number"
              min="1"
              value={config.versionCode}
              onChange={(e) => setConfig(prev => ({ ...prev, versionCode: parseInt(e.target.value) || 1 }))}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Theme & Colors */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Palette className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">
            {lang === 'hi' ? 'थीम और स्टेटस बार रंग' : 'Theme & Status Bar Colors'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {lang === 'hi' ? 'स्टेटस बार और प्राइमरी रंग' : 'Primary / Status Bar Color'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.themeColor}
                onChange={(e) => setConfig(prev => ({ ...prev, themeColor: e.target.value }))}
                className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={config.themeColor}
                onChange={(e) => setConfig(prev => ({ ...prev, themeColor: e.target.value }))}
                className="w-28 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
              />
            </div>
            {/* Quick swatches */}
            <div className="flex items-center gap-1.5 mt-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setConfig(prev => ({ ...prev, themeColor: color }))}
                  className="w-5 h-5 rounded-full border border-slate-700 transition-transform active:scale-90"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {lang === 'hi' ? 'ऐप बैकग्राउंड रंग' : 'App Window Background'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={config.backgroundColor}
                onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-28 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Screen Behavior */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Layers className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-white">
            {lang === 'hi' ? 'स्क्रीन ओरिएंटेशन' : 'Screen Orientation & Viewport'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'portrait', title: 'Portrait Only', titleHi: 'पोर्ट्रेट (सीधा फोन)', desc: 'Standard mobile apps' },
            { id: 'landscape', title: 'Landscape Only', titleHi: 'लैंडस्केप (आड़ा फोन)', desc: 'Games & video apps' },
            { id: 'sensor', title: 'Auto-Sensor', titleHi: 'ऑटो रोटेट (सेंसर)', desc: 'Rotates with device' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setConfig(prev => ({ ...prev, orientation: item.id as any }))}
              className={`p-3 rounded-xl border text-left transition-all ${
                config.orientation === item.id
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="font-semibold text-xs text-white">
                {lang === 'hi' ? item.titleHi : item.title}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Android Native Permissions */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Shield className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white">
            {lang === 'hi' ? 'Android परमिशन सेटिंग्स' : 'Android Permissions (AndroidManifest.xml)'}
          </h2>
        </div>

        <p className="text-xs text-slate-400">
          {lang === 'hi'
            ? 'केवल वही परमिशन चालू रखें जिनकी आपके ऐप को सचमुच जरूरत है। Google Play Store गैर-ज़रूरी परमिशन अस्वीकार करता है।'
            : 'Toggle permissions your web app needs. Unneeded permissions can lead to Play Store review flags.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: 'internet', label: 'Internet Access', labelHi: 'इंटरनेट एक्सेस', code: 'INTERNET', desc: 'Allows API calls & external URLs' },
            { key: 'networkState', label: 'Network State', labelHi: 'नेटवर्क स्थिति', code: 'ACCESS_NETWORK_STATE', desc: 'Detects Wi-Fi / Cellular online/offline' },
            { key: 'camera', label: 'Camera Access', labelHi: 'कैमरा एक्सेस', code: 'CAMERA', desc: 'Capture photos & scan QR/barcodes' },
            { key: 'location', label: 'GPS Location', labelHi: 'जीपीएस लोकेशन', code: 'ACCESS_FINE_LOCATION', desc: 'Geolocation API support' },
            { key: 'storage', label: 'Storage Access', labelHi: 'स्टोरेज (फ़ाइलें)', code: 'READ_EXTERNAL_STORAGE', desc: 'File uploads & caching' },
            { key: 'vibration', label: 'Vibration / Haptic', labelHi: 'वाइब्रेशन व हैप्टिक', code: 'VIBRATE', desc: 'navigator.vibrate() tactile clicks' },
            { key: 'notifications', label: 'Push Notifications', labelHi: 'पुश नोटिफिकेशन', code: 'POST_NOTIFICATIONS', desc: 'Android 13+ alert banners' },
            { key: 'audioRecording', label: 'Microphone', labelHi: 'माइक / ऑडियो रिकॉर्ड', code: 'RECORD_AUDIO', desc: 'Voice input and audio speech' },
          ].map((item) => {
            const isChecked = config.permissions[item.key as keyof AppConfig['permissions']];
            return (
              <div
                key={item.key}
                onClick={() => handlePermissionToggle(item.key as keyof AppConfig['permissions'])}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:bg-slate-900/60'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                    isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-slate-700'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                </div>
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <span>{lang === 'hi' ? item.labelHi : item.label}</span>
                    <span className="text-[10px] font-mono text-slate-500">[{item.code}]</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. WebView Settings */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Settings className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">
            {lang === 'hi' ? 'WebView और परफ़ॉर्मेंस सेटिंग्स' : 'WebView & Hardware Acceleration'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setConfig(prev => ({ ...prev, enableHardwareAcceleration: !prev.enableHardwareAcceleration }))}
            className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
              config.enableHardwareAcceleration
                ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                : 'bg-slate-950 border-slate-800/80 text-slate-400'
            }`}
          >
            <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
              config.enableHardwareAcceleration ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
            }`}>
              {config.enableHardwareAcceleration && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
            </div>
            <div>
              <div className="text-xs font-semibold">
                {lang === 'hi' ? 'हार्डवेयर एक्सेलेरेशन (60 FPS)' : 'Hardware Acceleration'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                GPU rendering for silky-smooth animations and 2D canvas games.
              </div>
            </div>
          </div>

          <div
            onClick={() => setConfig(prev => ({ ...prev, enableOfflineCache: !prev.enableOfflineCache }))}
            className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
              config.enableOfflineCache
                ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                : 'bg-slate-950 border-slate-800/80 text-slate-400'
            }`}
          >
            <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
              config.enableOfflineCache ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
            }`}>
              {config.enableOfflineCache && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
            </div>
            <div>
              <div className="text-xs font-semibold">
                {lang === 'hi' ? 'ऑफलाइन कैशिंग सपोर्ट' : 'Offline Cache Strategy'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Keeps web assets and localStorage cached when internet is disconnected.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
