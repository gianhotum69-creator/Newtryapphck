import React from 'react';
import { Smartphone, Download, HelpCircle, Code2, Sparkles, Languages } from 'lucide-react';

interface HeaderProps {
  onOpenExport: () => void;
  onOpenGuide: () => void;
  activeTab: 'workspace' | 'config' | 'icon';
  setActiveTab: (tab: 'workspace' | 'config' | 'icon') => void;
  lang: 'hi' | 'en';
  setLang: (lang: 'hi' | 'en') => void;
  appName: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  onOpenGuide,
  activeTab,
  setActiveTab,
  lang,
  setLang,
  appName
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 font-bold">
          <Smartphone className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            Web2APK <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Studio</span>
          </span>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {lang === 'hi' ? 'HTML, CSS और JS से नेटिव Android APK बनाएं' : 'Convert HTML, CSS & JS into Android APK'}
          </p>
        </div>
      </div>

      {/* Zone 2: Navigation / Tab Controls */}
      <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('workspace')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'workspace'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'HTML कोड' : 'HTML Code'}</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'config'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'ऐप सेटिंग्स' : 'App Settings'}</span>
        </button>

        <button
          onClick={() => setActiveTab('icon')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'icon'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'ऐप आइकॉन' : 'App Icon'}</span>
        </button>
      </nav>

      {/* Zone 3: Actions & Language */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Language switch */}
        <button
          onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors"
          title="Toggle Language (हिंदी / English)"
        >
          <Languages className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'hi' ? 'EN' : 'हिंदी'}</span>
        </button>

        {/* Step Guide */}
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">{lang === 'hi' ? 'APK गाइड' : 'How to Build'}</span>
        </button>

        {/* Primary CTA */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm shadow-emerald-500/30 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'APK प्रोजेक्ट डाउनलोड' : 'Build & Export APK'}</span>
        </button>
      </div>
    </header>
  );
};
