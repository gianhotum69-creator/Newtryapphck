import React, { useState } from 'react';
import {
  X,
  Download,
  FolderArchive,
  CloudLightning,
  Sparkles,
  CheckCircle2,
  FileCode,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { AppConfig, ProjectFiles } from '../types/appConfig';
import { generateAndroidProjectZip, generatePwaPackage, createPreviewHtml } from '../utils/apkGenerator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  files: ProjectFiles;
  lang: 'hi' | 'en';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  config,
  files,
  lang
}) => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState('');
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);

  if (!isOpen) return null;

  // 1. Download Android Project ZIP
  const handleDownloadAndroidZip = async () => {
    try {
      setIsBuilding(true);
      setDownloadComplete(false);
      setBuildProgress(lang === 'hi' ? 'Android प्रोजेक्ट संरचना तैयार की जा रही है...' : 'Generating Android Project...');

      const zipBlob = await generateAndroidProjectZip(config, files, (status) => {
        setBuildProgress(status);
      });

      // Trigger browser download
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = config.appName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'android_app';
      a.download = `${safeName}_android_project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsBuilding(false);
      setDownloadComplete(true);
    } catch (err) {
      console.error('Export error:', err);
      setIsBuilding(false);
      alert('Error bundling project. Please try again.');
    }
  };

  // 2. Download PWA WebAPK Package
  const handleDownloadPwa = () => {
    const { manifestJson, swJs } = generatePwaPackage(config, files);
    const blob = new Blob([
      JSON.stringify({
        'manifest.json': manifestJson,
        'sw.js': swJs,
        'index.html': files.html
      }, null, 2)
    ], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.appName}_pwa_package.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 3. Download Standalone Single HTML
  const handleDownloadSingleHtml = () => {
    const fullHtml = createPreviewHtml(files, config);
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.appName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {lang === 'hi' ? 'Android APK पैकेज एक्सपोर्ट करें' : 'Export Android APK Package'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'तैयार Gradle प्रोजेक्ट डाउनलोड करें और सीधे APK प्राप्त करें।'
                : 'Download production-ready Android Studio project with free 1-click cloud APK build.'}
            </p>
          </div>
        </div>

        {/* Export Option 1 (PRIMARY): Full Android Studio Project ZIP */}
        <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-2xl p-5 mb-4 relative overflow-hidden shadow-lg shadow-emerald-950/20">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                {lang === 'hi'
                  ? 'संपूर्ण Android Studio प्रोजेक्ट (.ZIP) + 1-Click Cloud APK Build'
                  : 'Full Android Studio Project (.ZIP) + Free Cloud APK Workflow'}
              </h3>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              {lang === 'hi' ? 'अनुशंसित' : 'Recommended'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            {lang === 'hi'
              ? 'इस ZIP में पूरा नेटिव Android प्रोजेक्ट है: MainActivity.java (WebView), AndroidManifest.xml, build.gradle, और .github/workflows/build-apk.yml। आप इसे सीधे Android Studio में खोल सकते हैं या फ्री GitHub Actions से बिना किसी सॉफ्टवेयर के सीधे .apk डाउनलोड कर सकते हैं!'
              : 'Contains full native Android Gradle wrapper, WebView client, AndroidManifest, assets, and GitHub Actions CI. Push to GitHub to compile and download .apk in 2 minutes with 0 software installed on your PC.'}
          </p>

          {/* Progress / Status */}
          {isBuilding && (
            <div className="mb-4 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                <CloudLightning className="w-4 h-4 animate-bounce" />
                <span>{buildProgress}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-2/3 animate-pulse" />
              </div>
            </div>
          )}

          {downloadComplete && (
            <div className="mb-4 bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {lang === 'hi'
                  ? 'ZIP सफलतापूर्वक डाउनलोड हो गई! नीचे दी गई आसान विधि से अपना .apk निकालें।'
                  : 'ZIP downloaded successfully! Follow the steps below to get your .apk file.'}
              </span>
            </div>
          )}

          <button
            onClick={handleDownloadAndroidZip}
            disabled={isBuilding}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>
              {isBuilding
                ? (lang === 'hi' ? 'ZIP तैयार हो रही है...' : 'Compressing ZIP...')
                : (lang === 'hi' ? 'प्रोजेक्ट ZIP डाउनलोड करें (.zip)' : 'Download Android Project (.zip)')}
            </span>
          </button>
        </div>

        {/* 2-Step Cloud Build Walkthrough Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-4 text-xs space-y-2">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {lang === 'hi'
                ? 'बिना PC सॉफ्टवेयर के मुफ्त APK कैसे पाएं? (2 मिनट की ट्रिक)'
                : 'How to get .apk for FREE in 2 mins without installing anything:'}
            </span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed">
            <li>
              {lang === 'hi'
                ? 'ऊपर से डाउनलोड हुई ZIP को अनज़िप (Extract) करें।'
                : 'Extract the downloaded project ZIP file.'}
            </li>
            <li>
              {lang === 'hi'
                ? 'GitHub.com पर एक नया रिपॉजिटरी बनाएं और ये सभी फाइलें वहां अपलोड कर दें।'
                : 'Create a free repository on GitHub.com and push/upload the files.'}
            </li>
            <li>
              {lang === 'hi'
                ? 'GitHub Actions अपने आप .apk बना देगा! "Actions" टैब से "app-debug.apk" डाउनलोड करके फोन में इंस्टॉल कर लें!'
                : 'GitHub Actions automatically compiles it! Go to "Actions" tab -> Download your app-debug.apk!'}
            </li>
          </ol>
        </div>

        {/* Secondary Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option 2: PWA WebAPK Package */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white">
                  {lang === 'hi' ? 'PWA / WebAPK मैनिफेस्ट' : 'PWA / WebAPK Package'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal mb-3">
                {lang === 'hi'
                  ? 'Chrome से सीधे फोन पर ऐप की तरह इंस्टॉल करने के लिए manifest.json और sw.js।'
                  : 'Includes manifest.json and offline Service Worker for native WebAPK install.'}
              </p>
            </div>
            <button
              onClick={handleDownloadPwa}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              {lang === 'hi' ? 'PWA पैकेज डाउनलोड' : 'Download PWA Files'}
            </button>
          </div>

          {/* Option 3: Standalone Single HTML */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <FileCode className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white">
                  {lang === 'hi' ? 'एकल इनलाइन HTML फ़ाइल' : 'Single Inlined HTML'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal mb-3">
                {lang === 'hi'
                  ? 'सभी CSS और JS को एक ही .html फ़ाइल में मिलाकर ऑफ़लाइन इस्तेमाल करें।'
                  : 'Bundle HTML + CSS + JS in a single standalone file for instant preview.'}
              </p>
            </div>
            <button
              onClick={handleDownloadSingleHtml}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              {lang === 'hi' ? 'सिंगल HTML डाउनलोड' : 'Download Inlined HTML'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
