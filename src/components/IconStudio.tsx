import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Upload,
  RefreshCw,
  Palette,
  Smartphone,
  Check,
  Type,
  Smile
} from 'lucide-react';
import { AppConfig } from '../types/appConfig';

interface IconStudioProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  lang: 'hi' | 'en';
}

export const IconStudio: React.FC<IconStudioProps> = ({
  config,
  setConfig,
  lang
}) => {
  const [iconMode, setIconMode] = useState<'emoji' | 'text' | 'custom'>('emoji');
  const [selectedEmoji, setSelectedEmoji] = useState('📱');
  const [initials, setInitials] = useState('APP');
  const [iconShape, setIconShape] = useState<'squircle' | 'circle' | 'rounded'>('squircle');
  const [bgColor, setBgColor] = useState(config.themeColor || '#0ea5e9');
  const [bgGradient, setBgGradient] = useState('linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojiList = ['📱', '🚀', '⚡', '🛒', '🎮', '📋', '🎯', '⭐', '🔥', '🏆', '💡', '🎧', '☕', '❤️', '💼', '🍕'];

  const gradientPresets = [
    { name: 'Sky Glow', css: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)', color: '#0ea5e9' },
    { name: 'Emerald', css: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', color: '#10b981' },
    { name: 'Purple Night', css: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', color: '#7c3aed' },
    { name: 'Sunset Amber', css: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', color: '#f59e0b' },
    { name: 'Crimson Rose', css: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)', color: '#ef4444' },
    { name: 'Dark Slate', css: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#0f172a' },
  ];

  // Render to canvas to produce base64 icon data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 512;
    canvas.width = size;
    canvas.height = size;

    // Background fill
    ctx.clearRect(0, 0, size, size);

    // Create gradient
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, bgColor);
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Text or Emoji
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (iconMode === 'emoji') {
      ctx.font = '240px sans-serif';
      ctx.fillText(selectedEmoji, size / 2, size / 2 + 15);
    } else if (iconMode === 'text') {
      ctx.font = 'bold 180px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(initials.toUpperCase(), size / 2, size / 2 + 10);
    }

    try {
      const dataUrl = canvas.toDataURL('image/png');
      setConfig(prev => ({ ...prev, iconDataUrl: dataUrl }));
    } catch (e) {}
  }, [iconMode, selectedEmoji, initials, bgColor, setConfig]);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setConfig(prev => ({ ...prev, iconDataUrl: result }));
        setIconMode('custom');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto p-4 lg:p-6 space-y-6 text-slate-200">
      {/* Hidden high-res canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'hi' ? 'Android ऐप आइकॉन डिज़ाइनर' : 'Android App Icon Studio'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'hi'
              ? 'यह आइकॉन आपके फ़ोन की होम स्क्रीन पर दिखाई देगा (512x512 adaptive icon).'
              : 'Customize the launcher icon displayed on Android home screen and app drawer.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Customizer Controls */}
        <div className="space-y-5">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setIconMode('emoji')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-medium transition-colors ${
                iconMode === 'emoji'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Emoji Symbol</span>
            </button>

            <button
              onClick={() => setIconMode('text')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-medium transition-colors ${
                iconMode === 'text'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Initials Text</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-medium transition-colors ${
                iconMode === 'custom'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PNG</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleCustomUpload}
              className="hidden"
            />
          </div>

          {/* Emoji Selection Grid */}
          {iconMode === 'emoji' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {lang === 'hi' ? 'प्रतीक (Emoji) चुनें' : 'Choose Symbol / Emoji'}
              </label>
              <div className="grid grid-cols-8 gap-2 bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
                {emojiList.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? 'bg-emerald-500/20 border-2 border-emerald-400 scale-110 shadow'
                        : 'hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Initials Input */}
          {iconMode === 'text' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'hi' ? 'ऐप के अक्षर (1-3 अक्षरों का नाम)' : 'Initials / Monogram (1-3 chars)'}
              </label>
              <input
                type="text"
                maxLength={3}
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                placeholder="APP"
                className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2 text-sm font-bold tracking-widest text-white outline-none"
              />
            </div>
          )}

          {/* Background Color Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {lang === 'hi' ? 'बैकग्राउंड रंग' : 'Background Color Gradient'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {gradientPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setBgColor(preset.color);
                    setBgGradient(preset.css);
                  }}
                  className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                    bgColor === preset.color
                      ? 'border-emerald-400 bg-slate-800 shadow-sm'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-lg shrink-0 border border-white/20"
                    style={{ background: preset.css }}
                  />
                  <span className="text-xs text-slate-200 truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shape Mask */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {lang === 'hi' ? 'Android मास्क का आकार' : 'Adaptive Icon Shape Mask'}
            </label>
            <div className="flex items-center gap-2">
              {[
                { id: 'squircle', label: 'Squircle', radius: 'rounded-[26%]' },
                { id: 'circle', label: 'Circle', radius: 'rounded-full' },
                { id: 'rounded', label: 'Rounded Rect', radius: 'rounded-2xl' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setIconShape(s.id as any)}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl border text-center transition-colors ${
                    iconShape === s.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Realistic Android Home Screen Mockup */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 mb-4 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'hi' ? 'Android फ़ोन स्क्रीन पर पूर्वावलोकन' : 'Live Home Screen Preview'}</span>
          </span>

          {/* Mock Wallpaper Card */}
          <div className="relative w-64 h-80 rounded-[32px] p-4 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-4 border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Top Mock Clock */}
            <div className="text-center pt-3">
              <div className="text-2xl font-light text-white tracking-wide">12:45</div>
              <div className="text-[10px] text-slate-400">Monday, Nov 9</div>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-4 gap-3 py-4">
              {/* Other default apps */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-2xl bg-red-500 flex items-center justify-center text-white text-base shadow">
                  ▶
                </div>
                <span className="text-[9px] text-slate-300">YouTube</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-base shadow">
                  🌐
                </div>
                <span className="text-[9px] text-slate-300">Chrome</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-base shadow">
                  💬
                </div>
                <span className="text-[9px] text-slate-300">Chat</span>
              </div>

              {/* YOUR APP ICON HIGHLIGHTED */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-11 h-11 flex items-center justify-center text-xl shadow-lg ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900 transition-all ${
                    iconShape === 'circle'
                      ? 'rounded-full'
                      : iconShape === 'squircle'
                      ? 'rounded-[26%]'
                      : 'rounded-xl'
                  }`}
                  style={{
                    backgroundColor: bgColor,
                    backgroundImage: bgGradient
                  }}
                >
                  {iconMode === 'emoji' && selectedEmoji}
                  {iconMode === 'text' && (
                    <span className="text-white text-xs font-bold">{initials}</span>
                  )}
                  {iconMode === 'custom' && config.iconDataUrl && (
                    <img
                      src={config.iconDataUrl}
                      alt="App Icon"
                      className="w-full h-full object-cover rounded-[inherit]"
                    />
                  )}
                </div>
                <span className="text-[9px] font-semibold text-emerald-300 truncate max-w-[50px]">
                  {config.appName || 'My App'}
                </span>
              </div>
            </div>

            {/* Bottom Dock Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex justify-around items-center">
              <span className="text-sm">📞</span>
              <span className="text-sm">✉️</span>
              <span className="text-sm">📷</span>
              <span className="text-sm">⚙️</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-4 text-center max-w-xs">
            {lang === 'hi'
              ? 'यह आइकॉन अपने आप mipmap ड्राएबल्स और वेब मैनिफेस्ट दोनों में बंडल हो जाता है।'
              : 'Automatically bundled into both Android res/mipmap drawables and PWA manifest.'}
          </p>
        </div>
      </div>
    </div>
  );
};
