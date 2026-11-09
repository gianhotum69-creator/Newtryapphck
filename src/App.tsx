import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeWorkspace } from './components/CodeWorkspace';
import { ConfigPanel } from './components/ConfigPanel';
import { IconStudio } from './components/IconStudio';
import { ExportModal } from './components/ExportModal';
import { GuideModal } from './components/GuideModal';
import { AppConfig, ProjectFiles } from './types/appConfig';
import { TEMPLATES } from './data/templates';
import { CheckCircle2, Sparkles, FolderArchive } from 'lucide-react';

export default function App() {
  const initialTemplate = TEMPLATES[0];

  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [activeTab, setActiveTab] = useState<'workspace' | 'config' | 'icon'>('workspace');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [userFileLoaded, setUserFileLoaded] = useState(false);

  // App Configuration state
  const [config, setConfig] = useState<AppConfig>({
    appName: 'BS STORE VIP PANEL',
    packageName: 'com.bsstore.vippanel',
    versionName: '1.0.0',
    versionCode: 1,
    themeColor: '#FF0000',
    backgroundColor: '#000000',
    orientation: 'portrait',
    fullscreen: true,
    enableOfflineCache: true,
    enableZoom: false,
    enableFileAccess: true,
    enableHardwareAcceleration: true,
    splashDurationMs: 1500,
    iconDataUrl: '/my_icon.png',
    permissions: {
      internet: true,
      networkState: true,
      camera: false,
      location: false,
      storage: true,
      vibration: true,
      notifications: true,
      audioRecording: false
    }
  });

  // Project Files state (HTML, CSS, JS)
  const [files, setFiles] = useState<ProjectFiles>({
    html: '',
    css: '',
    js: '',
    assets: []
  });

  // Automatically load the user's uploaded HTML and assets on mount
  useEffect(() => {
    async function loadUserUploadedProject() {
      try {
        const resp = await fetch('/assets/aistudio/mizanmod_9d8d5f7f.html');
        if (resp.ok) {
          const htmlText = await resp.text();
          setFiles({
            html: htmlText,
            css: '',
            js: '',
            assets: []
          });
          setUserFileLoaded(true);
        } else {
          // Fallback to initial template
          setFiles(initialTemplate.files);
        }
      } catch (e) {
        setFiles(initialTemplate.files);
      }
    }
    loadUserUploadedProject();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Universal Top Bar Contract */}
      <Header
        onOpenExport={() => setIsExportOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        appName={config.appName}
      />

      {/* Uploaded File Loaded Banner */}
      {userFileLoaded && (
        <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-950 border-b border-red-500/30 px-4 py-2 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-red-400">
              {lang === 'hi' ? 'आपकी फ़ाइलें लोड हो चुकी हैं:' : 'Your Project is Loaded:'}
            </span>
            <span className="text-white font-medium">
              mizanmod.html + DiskWala.zip (27 Audio & Image Assets, Icon)
            </span>
          </div>
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>{lang === 'hi' ? 'APK डाउनलोड करें' : 'Download APK Project'}</span>
          </button>
        </div>
      )}

      {/* 2. Main Two-Column Viewport Split */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Dynamic Workspace Tabs (Code Editor, Config Panel, Icon Studio) */}
        <section className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden">
          {activeTab === 'workspace' && (
            <CodeWorkspace
              files={files}
              setFiles={setFiles}
              config={config}
              setConfig={setConfig}
              lang={lang}
            />
          )}

          {activeTab === 'config' && (
            <ConfigPanel
              config={config}
              setConfig={setConfig}
              lang={lang}
            />
          )}

          {activeTab === 'icon' && (
            <IconStudio
              config={config}
              setConfig={setConfig}
              lang={lang}
            />
          )}
        </section>

        {/* Right Side: Interactive Android Mobile Simulator */}
        <aside className="w-full lg:w-[460px] xl:w-[500px] shrink-0 bg-slate-950/70 overflow-y-auto flex flex-col justify-start items-center border-slate-800">
          <PhoneSimulator
            files={files}
            config={config}
            lang={lang}
          />
        </aside>
      </main>

      {/* 3. Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
        files={files}
        lang={lang}
      />

      {/* 4. Complete Step-by-Step Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={lang}
      />
    </div>
  );
}
