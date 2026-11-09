import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCw,
  RefreshCw,
  Wifi,
  WifiOff,
  BatteryCharging,
  Maximize2,
  Terminal,
  Smartphone,
  ChevronLeft,
  Circle,
  Square,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { AppConfig, ProjectFiles, SimulatorDevice } from '../types/appConfig';
import { createPreviewHtml } from '../utils/apkGenerator';

interface PhoneSimulatorProps {
  files: ProjectFiles;
  config: AppConfig;
  lang: 'hi' | 'en';
}

interface ConsoleMessage {
  id: string;
  type: 'log' | 'warn' | 'error';
  message: string;
  time: string;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  files,
  config,
  lang
}) => {
  const [device, setDevice] = useState<SimulatorDevice>('pixel8');
  const [isLandscape, setIsLandscape] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentTime, setCurrentTime] = useState('12:45');
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Keep time updated
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Listen to iframe postMessage for console logs
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SIMULATOR_CONSOLE_LOG') {
        const newLog: ConsoleMessage = {
          id: Math.random().toString(),
          type: event.data.logType || 'log',
          message: event.data.message || '',
          time: event.data.time || new Date().toLocaleTimeString()
        };
        setConsoleLogs(prev => [newLog, ...prev.slice(0, 99)]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Compute preview HTML
  const previewHtml = React.useMemo(() => {
    if (isOffline) {
      return `<!DOCTYPE html><html><body style="background:#0f172a;color:#94a3b8;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;text-align:center;">
        <div style="font-size:48px;margin-bottom:16px;">✈️</div>
        <h3 style="color:#fff;margin-bottom:8px;">Offline / Airplane Mode Active</h3>
        <p style="font-size:14px;line-height:1.5;">${config.enableOfflineCache ? 'Offline caching enabled in AppConfig: cached assets and localStorage are still active!' : 'Network requests are paused.'}</p>
      </body></html>`;
    }
    return createPreviewHtml(files, config);
  }, [files, config, isOffline, refreshKey]);

  // Back button handler
  const handleAndroidBack = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.history.back();
      } catch (e) {
        console.warn('Cannot go back:', e);
      }
    }
  };

  // Home button handler
  const handleAndroidHome = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Dimensions
  const getDeviceDimensions = () => {
    if (device === 'tablet') {
      return isLandscape ? { width: 680, height: 460 } : { width: 460, height: 620 };
    }
    if (device === 'galaxy24') {
      return isLandscape ? { width: 720, height: 350 } : { width: 350, height: 700 };
    }
    // Pixel 8 standard
    return isLandscape ? { width: 680, height: 340 } : { width: 340, height: 680 };
  };

  const dims = getDeviceDimensions();

  return (
    <div className="flex flex-col items-center justify-start h-full p-2 sm:p-4 select-none">
      {/* Simulator Toolbar */}
      <div className="flex items-center justify-between w-full max-w-[440px] mb-3 px-2 py-1.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5">
          <select
            value={device}
            onChange={(e) => setDevice(e.target.value as SimulatorDevice)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 outline-none"
          >
            <option value="pixel8">Google Pixel 8</option>
            <option value="galaxy24">Samsung Galaxy S24</option>
            <option value="tablet">Android Tablet</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          {/* Rotate */}
          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLandscape
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800'
            }`}
            title={lang === 'hi' ? 'ओरिएंटेशन बदलें (Portrait / Landscape)' : 'Toggle Orientation'}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Airplane / Offline Test */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isOffline
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800'
            }`}
            title={lang === 'hi' ? 'ऑफलाइन टेस्ट (इंटरनेट बंद/चालू)' : 'Simulate Offline Mode'}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          </button>

          {/* Refresh */}
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 border border-transparent transition-colors"
            title={lang === 'hi' ? 'ऐप दोबारा लोड करें' : 'Reload App'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Console Toggle */}
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors ${
              showConsole || consoleLogs.length > 0
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800'
            }`}
            title="Open Mobile Console"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">{consoleLogs.length}</span>
          </button>
        </div>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div
        className="relative bg-slate-900 border-[7px] border-slate-800 rounded-[44px] shadow-2xl shadow-black/80 flex flex-col overflow-hidden transition-all duration-300"
        style={{
          width: `${dims.width}px`,
          height: `${dims.height}px`,
        }}
      >
        {/* Device Outer Highlight Rim */}
        <div className="absolute inset-0 rounded-[37px] border border-slate-700/50 pointer-events-none z-30" />

        {/* Android Status Bar */}
        <div
          className="h-7 w-full px-5 flex items-center justify-between text-[11px] font-medium shrink-0 z-20 relative select-none"
          style={{
            backgroundColor: config.themeColor,
            color: '#ffffff'
          }}
        >
          {/* Status Left: Clock */}
          <span className="font-semibold tracking-tight">{currentTime}</span>

          {/* Camera Hole Punch */}
          {!isLandscape && (
            <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full border border-slate-800 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
            </div>
          )}

          {/* Status Right: Connectivity & Battery */}
          <div className="flex items-center gap-1.5">
            {isOffline ? (
              <WifiOff className="w-3 h-3 text-amber-200" />
            ) : (
              <Wifi className="w-3 h-3 text-white" />
            )}
            <span className="text-[10px] font-bold">5G</span>
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">98%</span>
              <BatteryCharging className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>

        {/* Webview Screen Content */}
        <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
          <iframe
            ref={iframeRef}
            key={refreshKey}
            srcDoc={previewHtml}
            title="Android APK Preview"
            sandbox="allow-scripts allow-forms allow-modals allow-same-origin"
            className="w-full h-full border-0 select-auto"
          />

          {/* Offline Overlay Watermark */}
          {isOffline && (
            <div className="absolute top-2 right-2 bg-amber-500/90 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded shadow">
              OFFLINE TEST
            </div>
          )}
        </div>

        {/* Android Native Navigation Bar (Bottom 3-Key / Gesture Pill) */}
        <div className="h-9 w-full bg-slate-950/95 border-t border-slate-800/80 flex items-center justify-around px-8 shrink-0 z-20">
          {/* Back Button (Triangle/Chevron) */}
          <button
            onClick={handleAndroidBack}
            className="text-slate-400 hover:text-white p-2 rounded-lg transition-transform active:scale-80"
            title="Android Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Home Button (Circle) */}
          <button
            onClick={handleAndroidHome}
            className="text-slate-400 hover:text-white p-2 rounded-lg transition-transform active:scale-80"
            title="Android Home"
          >
            <Circle className="w-3.5 h-3.5" />
          </button>

          {/* Recent Apps Button (Square) */}
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="text-slate-400 hover:text-white p-2 rounded-lg transition-transform active:scale-80"
            title="Android Tasks"
          >
            <Square className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Slide-out Console & Inspector Drawer */}
      {showConsole && (
        <div className="w-full max-w-[440px] mt-3 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Android Logcat / Console</span>
            </span>
            <button
              onClick={() => setConsoleLogs([])}
              className="text-slate-500 hover:text-slate-300 p-1 rounded"
              title="Clear Logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {consoleLogs.length === 0 ? (
            <p className="text-slate-500 italic py-2 text-center">No logs yet. Interact with the app above.</p>
          ) : (
            <div className="space-y-1">
              {consoleLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-1.5 py-1 px-1.5 rounded ${
                    log.type === 'error'
                      ? 'bg-rose-950/40 text-rose-300'
                      : log.type === 'warn'
                      ? 'bg-amber-950/40 text-amber-300'
                      : 'text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 shrink-0 select-none">
                    {log.time}
                  </span>
                  <span className="break-all">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
