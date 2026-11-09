import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Smartphone,
  CloudLightning,
  Laptop,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'cloud' | 'studio' | 'pwa' | 'tips'>('cloud');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {lang === 'hi' ? 'HTML से APK बनाने की संपूर्ण गाइड' : 'How HTML to APK Works: Step-by-Step Guide'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'अपने HTML, CSS और JS कोड को आसानी से Android APK फाइल में बदलें।'
                : 'Turn your HTML, CSS & JS code into installable Android APKs.'}
            </p>
          </div>
        </div>

        {/* Guide Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'cloud'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudLightning className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'hi' ? 'विधि 1: 1-क्लिक क्लाउड APK (मुफ्त)' : 'Method 1: Free Cloud Build'}</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'hi' ? 'विधि 2: Android Studio' : 'Method 2: Android Studio'}</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span>{lang === 'hi' ? 'विधि 3: WebAPK / PWA' : 'Method 3: Direct WebAPK'}</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'tips'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'मोबाइल बेस्ट प्रैक्टिसेज' : 'Mobile Best Practices'}</span>
          </button>
        </div>

        {/* Tab Content 1: Free Cloud Build (GitHub Actions) */}
        {activeTab === 'cloud' && (
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl">
              <h3 className="text-sm font-bold text-emerald-300 mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {lang === 'hi'
                  ? 'सबसे आसान तरीका — बिना किसी सॉफ्टवेयर डाउनलोड किए APK बनाएं'
                  : 'Easiest Method — Get .apk with 0 Software Installed'}
              </h3>
              <p className="text-slate-300">
                {lang === 'hi'
                  ? 'हमारे द्वारा दिए जाने वाले ZIP प्रोजेक्ट में एक ऑटोमेटेड GitHub Actions वर्कफ़्लो (.github/workflows/build-apk.yml) पहले से शामिल होता है। यह क्लाउड पर मुफ्त में आपकी APK संकलित (compile) करता है।'
                  : 'The generated project ZIP includes a pre-configured GitHub Actions CI workflow. GitHub servers compile the Android Gradle project and produce your downloadable .apk file in under 2 minutes.'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold mb-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[11px]">1</span>
                  <span>{lang === 'hi' ? 'प्रोजेक्ट ZIP डाउनलोड करें' : 'Download the Project ZIP'}</span>
                </div>
                <p className="text-slate-400 ml-7">
                  {lang === 'hi'
                    ? 'ऊपर "Build & Export APK" बटन दबाकर .zip फाइल डाउनलोड करें और उसे अपने कंप्यूटर या फोन पर Extract (Unzip) करें।'
                    : 'Click "Build & Export APK" to download the ZIP file and extract it on your device.'}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold mb-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[11px]">2</span>
                  <span>{lang === 'hi' ? 'GitHub.com पर अपलोड करें' : 'Create a Free Repo on GitHub'}</span>
                </div>
                <p className="text-slate-400 ml-7">
                  {lang === 'hi'
                    ? 'GitHub.com पर लॉगिन करें (मुफ्त खाता) -> New Repository बनाएं -> अनज़िप किए गए फोल्डर की सभी फाइलें अपलोड करें (Add file -> Upload files)।'
                    : 'Log in to GitHub.com -> Click New Repository -> Upload all files from the extracted folder.'}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold mb-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[11px]">3</span>
                  <span>{lang === 'hi' ? 'Actions टैब से .apk डाउनलोड करें!' : 'Download your APK from Actions Tab!'}</span>
                </div>
                <p className="text-slate-400 ml-7">
                  {lang === 'hi'
                    ? 'GitHub रिपॉजिटरी में ऊपर "Actions" टैब पर जाएं। आपको "Build Android APK" वर्कफ़्लो चलता हुआ दिखेगा। 1-2 मिनट बाद उस पर क्लिक करें और नीचे "Artifacts" से app-debug.apk डाउनलोड कर लें!'
                    : 'Go to the "Actions" tab in your repository. Click on the completed run -> Scroll down to "Artifacts" -> Download your compiled app-debug.apk!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Android Studio */}
        {activeTab === 'studio' && (
          <div className="space-y-4 text-xs leading-relaxed">
            <p className="text-slate-300">
              {lang === 'hi'
                ? 'यदि आपके पास PC या Mac पर Google Android Studio इंस्टॉल है, तो आप 1 क्लिक में लोकल APK बना सकते हैं:'
                : 'If you have official Android Studio installed on your computer:'}
            </p>

            <ol className="list-decimal list-inside space-y-2.5 text-slate-400">
              <li>
                <strong className="text-white">Open Project:</strong> Android Studio खोलें और <code className="text-emerald-400 font-mono">File &gt; Open</code> में जाकर डाउनलोड किया गया अनज़िप फोल्डर चुनें।
              </li>
              <li>
                <strong className="text-white">Wait for Gradle Sync:</strong> नीचे Gradle sync पूरा होने की प्रतीक्षा करें (10-30 सेकंड)।
              </li>
              <li>
                <strong className="text-white">Build APK:</strong> टॉप मेन्यू से <code className="text-emerald-400 font-mono">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</code> पर क्लिक करें।
              </li>
              <li>
                <strong className="text-white">Locate APK:</strong> स्क्रीन के निचले-दाएं कोने में एक नोटिफिकेशन आएगा: "APK(s) generated successfully now." वहाँ <span className="text-emerald-400 font-semibold underline">locate</span> बटन दबाएं। आपका तैयार <code className="text-white font-mono">app-debug.apk</code> फोल्डर में मिल जाएगा!
              </li>
            </ol>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mt-4">
              <span className="font-semibold text-slate-300 block mb-1">Terminal / CLI command:</span>
              <div className="flex items-center justify-between font-mono text-[11px] bg-slate-900 p-2 rounded text-emerald-300">
                <span>./gradlew assembleDebug</span>
                <button
                  onClick={() => copyToClipboard('./gradlew assembleDebug', 'cmd')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedCode === 'cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: WebAPK / PWA */}
        {activeTab === 'pwa' && (
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="bg-purple-950/20 border border-purple-500/30 p-4 rounded-2xl">
              <h3 className="text-sm font-bold text-purple-300 mb-1">
                {lang === 'hi' ? 'WebAPK क्या है?' : 'What is WebAPK / PWA?'}
              </h3>
              <p className="text-slate-300">
                {lang === 'hi'
                  ? 'Google Android में Chrome ब्राउज़र किसी भी अच्छी HTML वेबसाइट को सीधे वास्तविक नेटिव ऐप (WebAPK) के रूप में बिना प्ले स्टोर के इंस्टॉल कर देता है।'
                  : 'Android Google Chrome automatically mints a native WebAPK package when a user taps "Install App" or "Add to Home Screen".'}
              </p>
            </div>

            <div className="space-y-2 text-slate-400">
              <p>
                {lang === 'hi'
                  ? '1. अपनी HTML फाइल को किसी भी फ्री होस्टिंग (Netlify, Vercel, GitHub Pages) पर डालें।'
                  : '1. Host your HTML files on any hosting service (Vercel, Netlify, or GitHub Pages).'}
              </p>
              <p>
                {lang === 'hi'
                  ? '2. अपने Android फोन में Chrome से उस लिंक को खोलें।'
                  : '2. Open the URL in Google Chrome on your Android mobile device.'}
              </p>
              <p>
                {lang === 'hi'
                  ? '3. ऊपर 3 डॉट्स (⋮) पर क्लिक करें और "Install App" या "होम स्क्रीन पर जोड़ें" दबाएं।'
                  : '3. Tap 3 dots (⋮) -> "Install App" or "Add to Home Screen".'}
              </p>
              <p>
                {lang === 'hi'
                  ? '4. ऐप आपके फोन में बिल्कुल नेटिव APK की तरह फुलस्क्रीन खुलेगा!'
                  : '4. The app installs as a standalone native app running in its own window!'}
              </p>
            </div>
          </div>
        )}

        {/* Tab Content 4: Mobile Best Practices */}
        {activeTab === 'tips' && (
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
                  <span className="text-emerald-400">01.</span>
                  <span>Viewport Meta Tag</span>
                </h4>
                <p className="text-slate-400 text-[11px] mb-2">
                  इसके बिना मोबाइल पर आपकी वेबसाइट डेस्कटॉप की तरह सिकुड़ जाएगी।
                </p>
                <div className="bg-slate-900 p-2 rounded text-[10px] font-mono text-cyan-300 overflow-x-auto">
                  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"&gt;
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
                  <span className="text-emerald-400">02.</span>
                  <span>Touch Vibration / Haptics</span>
                </h4>
                <p className="text-slate-400 text-[11px] mb-2">
                  बटन क्लिक पर असली मोबाइल जैसा कंपन (vibration) देने के लिए:
                </p>
                <div className="bg-slate-900 p-2 rounded text-[10px] font-mono text-emerald-300">
                  navigator.vibrate(30);
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
                  <span className="text-emerald-400">03.</span>
                  <span>Offline LocalStorage</span>
                </h4>
                <p className="text-slate-400 text-[11px] mb-2">
                  बिना इंटरनेट के डेटा सुरक्षित रखने के लिए localStorage का उपयोग करें:
                </p>
                <div className="bg-slate-900 p-2 rounded text-[10px] font-mono text-amber-300">
                  localStorage.setItem('data', JSON.stringify(myData));
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
                  <span className="text-emerald-400">04.</span>
                  <span>Notch & Safe Area</span>
                </h4>
                <p className="text-slate-400 text-[11px] mb-2">
                  कैमरा कटआउट और स्टेटस बार से टेक्स्ट बचाने के लिए CSS में जोड़ें:
                </p>
                <div className="bg-slate-900 p-2 rounded text-[10px] font-mono text-purple-300">
                  padding-top: env(safe-area-inset-top);
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
