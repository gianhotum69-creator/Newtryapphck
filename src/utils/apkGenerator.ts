import JSZip from 'jszip';
import { AppConfig, ProjectFiles, CodeValidationIssue } from '../types/appConfig';

/**
 * Validates the user's HTML code for mobile suitability and APK readiness
 */
export function validateHtmlCode(html: string): CodeValidationIssue[] {
  const issues: CodeValidationIssue[] = [];

  if (!html.trim()) {
    issues.push({
      type: 'error',
      message: 'HTML content is empty',
      messageHindi: 'HTML कोड खाली है। कृपया कुछ HTML कोड लिखें या टेम्पलेट चुनें।',
      recommendation: 'Add standard HTML structure with <!DOCTYPE html> and <body>.'
    });
    return issues;
  }

  // Check for viewport meta tag
  const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);
  if (!hasViewport) {
    issues.push({
      type: 'warning',
      message: 'Missing mobile viewport meta tag',
      messageHindi: 'मोबाइल Viewport मेटा टैग नहीं मिला। इसके बिना मोबाइल स्क्रीन पर ऐप बहुत छोटा दिखेगा।',
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">'
    });
  }

  // Check for DOCTYPE
  if (!/<!DOCTYPE\s+html/i.test(html)) {
    issues.push({
      type: 'info',
      message: 'Missing <!DOCTYPE html> declaration',
      messageHindi: '<!DOCTYPE html> घोषणा नहीं मिली। यह आधुनिक वेब मानकों के लिए आवश्यक है।',
      recommendation: 'Add <!DOCTYPE html> at the very beginning of the file.'
    });
  }

  // Check for mixed HTTP content if using external scripts
  if (/src=["']http:\/\//i.test(html) || /href=["']http:\/\//i.test(html)) {
    issues.push({
      type: 'warning',
      message: 'Insecure HTTP links detected',
      messageHindi: 'असुरक्षित HTTP लिंक मिले। Android 9+ डिफ़ॉल्ट रूप से सादे HTTP को ब्लॉक करता है।',
      recommendation: 'Use HTTPS or local asset bundles.'
    });
  }

  // Check if safe-area-inset is accommodated for modern notches
  const hasSafeArea = /safe-area-inset/i.test(html);
  if (!hasSafeArea) {
    issues.push({
      type: 'info',
      message: 'No safe-area notch padding detected',
      messageHindi: 'नॉच और स्टेटस बार के लिए safe-area पैडिंग नहीं मिली।',
      recommendation: 'Consider adding padding: env(safe-area-inset-top) to avoid overlapping the status bar.'
    });
  }

  return issues;
}

/**
 * Combines separate HTML, CSS, and JS files into an interactive single-page preview bundle
 */
export function createPreviewHtml(files: ProjectFiles, config: AppConfig): string {
  let content = files.html;

  // If there is separate CSS, inject it before </head> or at the beginning
  if (files.css && files.css.trim()) {
    const styleTag = `\n<style id="app-injected-css">\n${files.css}\n</style>\n`;
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${styleTag}</head>`);
    } else {
      content = `${styleTag}${content}`;
    }
  }

  // Ensure base tag is present for relative asset resolution (images, audio)
  if (!/<base\s+href=/i.test(content)) {
    const baseTag = `<base href="/">\n`;
    if (content.includes('<head>')) {
      content = content.replace('<head>', `<head>\n${baseTag}`);
    } else {
      content = `${baseTag}${content}`;
    }
  }

  // Inject meta viewport if not present
  if (!/<meta\s+name=["']viewport["']/i.test(content)) {
    const metaTag = `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">\n`;
    if (content.includes('<head>')) {
      content = content.replace('<head>', `<head>\n${metaTag}`);
    } else {
      content = `${metaTag}${content}`;
    }
  }

  // Inject theme color meta
  const themeColorMeta = `<meta name="theme-color" content="${config.themeColor}">\n`;
  if (content.includes('<head>')) {
    content = content.replace('<head>', `<head>\n${themeColorMeta}`);
  }

  // Add console bridge to capture logs in simulator
  const consoleBridge = `
<script>
(function() {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  function sendMsg(type, args) {
    try {
      window.parent.postMessage({
        type: 'SIMULATOR_CONSOLE_LOG',
        logType: type,
        message: Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '),
        time: new Date().toLocaleTimeString()
      }, '*');
    } catch(e) {}
  }
  console.log = function(...args) { sendMsg('log', args); originalLog.apply(console, args); };
  console.warn = function(...args) { sendMsg('warn', args); originalWarn.apply(console, args); };
  console.error = function(...args) { sendMsg('error', args); originalError.apply(console, args); };
  window.onerror = function(msg, url, line) {
    sendMsg('error', ['[Uncaught] ' + msg + ' (' + line + ')']);
  };
})();
</script>
`;

  if (content.includes('</head>')) {
    content = content.replace('</head>', `${consoleBridge}</head>`);
  } else {
    content = `${consoleBridge}${content}`;
  }

  // If there is separate JS, inject it before </body> or at the end
  if (files.js && files.js.trim()) {
    const scriptTag = `\n<script id="app-injected-js">\n${files.js}\n</script>\n`;
    if (content.includes('</body>')) {
      content = content.replace('</body>', `${scriptTag}</body>`);
    } else {
      content = `${content}${scriptTag}`;
    }
  }

  return content;
}

/**
 * Generates the full Android Studio project ZIP with MainActivity.java, AndroidManifest.xml,
 * build.gradle, assets, and automated GitHub Actions workflow to build .apk for free!
 */
export async function generateAndroidProjectZip(
  config: AppConfig,
  files: ProjectFiles,
  onProgress?: (status: string) => void
): Promise<Blob> {
  const zip = new JSZip();

  onProgress?.('Preparing Android Project structure...');

  const packageParts = config.packageName.toLowerCase().split('.');
  const packagePath = packageParts.join('/');
  const packageDomain = packageParts.slice(0, 2).join('.');
  const className = 'MainActivity';

  // 1. AndroidManifest.xml
  const permissionsXml = [
    config.permissions.internet ? '    <uses-permission android:name="android.permission.INTERNET" />' : '',
    config.permissions.networkState ? '    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />' : '',
    config.permissions.camera ? '    <uses-permission android:name="android.permission.CAMERA" />' : '',
    config.permissions.location ? '    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />\n    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />' : '',
    config.permissions.storage ? '    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />\n    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />' : '',
    config.permissions.vibration ? '    <uses-permission android:name="android.permission.VIBRATE" />' : '',
    config.permissions.notifications ? '    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />' : '',
    config.permissions.audioRecording ? '    <uses-permission android:name="android.permission.RECORD_AUDIO" />' : '',
  ].filter(Boolean).join('\n');

  const orientationAttr = config.orientation === 'portrait' ? 'android:screenOrientation="portrait"' :
    config.orientation === 'landscape' ? 'android:screenOrientation="landscape"' :
    'android:screenOrientation="unspecified"';

  const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${config.packageName}">

${permissionsXml}

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:hardwareAccelerated="${config.enableHardwareAcceleration}"
        android:theme="@style/Theme.App.Fullscreen"
        android:networkSecurityConfig="@xml/network_security_config">

        <activity
            android:name=".${className}"
            android:exported="true"
            ${orientationAttr}
            android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize|screenLayout|uiMode"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  zip.file('app/src/main/AndroidManifest.xml', manifestContent);

  // 2. MainActivity.java
  const mainActivityJava = `package ${config.packageName};

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;

public class ${className} extends Activity {

    private WebView webView;
    private ProgressBar progressBar;
    private ValueCallback<Uri[]> fileUploadCallback;
    private final static int FILECHOOSER_RESULTCODE = 101;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setSupportZoom(${config.enableZoom});
        webSettings.setBuiltInZoomControls(${config.enableZoom});
        webSettings.setDisplayZoomControls(false);
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);

        ${config.enableOfflineCache ? `
        // Offline cache strategy
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        ` : `
        webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        `}

        // Handle navigation inside WebView
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("whatsapp:") || url.startsWith("intent:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        return false;
                    }
                }
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
            }
        });

        // WebChromeClient for File Chooser, Geolocation, and Progress
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }

            // Android 5.0+ file upload handling
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (fileUploadCallback != null) {
                    fileUploadCallback.onReceiveValue(null);
                }
                fileUploadCallback = filePathCallback;

                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, FILECHOOSER_RESULTCODE);
                } catch (Exception e) {
                    fileUploadCallback = null;
                    Toast.makeText(MainActivity.this, "Cannot open file picker", Toast.LENGTH_SHORT).show();
                    return false;
                }
                return true;
            }
        });

        // Load root HTML from local assets
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (fileUploadCallback != null) {
                Uri[] results = null;
                if (resultCode == RESULT_OK && data != null) {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    }
                }
                fileUploadCallback.onReceiveValue(results);
                fileUploadCallback = null;
            }
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
`;

  zip.file(`app/src/main/java/${packagePath}/${className}.java`, mainActivityJava);

  // 3. Layout: activity_main.xml
  const layoutXml = `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="${config.backgroundColor}">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="4dp"
        android:layout_gravity="top"
        android:max="100"
        android:progressTint="${config.themeColor}"
        android:visibility="gone" />

</FrameLayout>`;

  zip.file('app/src/main/res/layout/activity_main.xml', layoutXml);

  // 4. Resources: strings.xml, colors.xml, styles.xml
  zip.file('app/src/main/res/values/strings.xml', `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${escapeXml(config.appName)}</string>
</resources>`);

  zip.file('app/src/main/res/values/colors.xml', `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">${config.themeColor}</color>
    <color name="background">${config.backgroundColor}</color>
    <color name="black">#000000</color>
    <color name="white">#FFFFFF</color>
</resources>`);

  zip.file('app/src/main/res/values/styles.xml', `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.App.Fullscreen" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:windowBackground">@color/background</item>
        <item name="android:statusBarColor">${config.themeColor}</item>
        <item name="android:navigationBarColor">${config.backgroundColor}</item>
    </style>
</resources>`);

  zip.file('app/src/main/res/xml/network_security_config.xml', `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>`);

  // 5. Assets (User's HTML, CSS, JS, etc.)
  onProgress?.('Bundling HTML, CSS, JS into Android Assets...');
  zip.file('app/src/main/assets/index.html', files.html);
  if (files.css) {
    zip.file('app/src/main/assets/style.css', files.css);
  }
  if (files.js) {
    zip.file('app/src/main/assets/app.js', files.js);
  }

  // Extra assets if any
  if (files.assets && files.assets.length > 0) {
    files.assets.forEach(asset => {
      zip.file(`app/src/main/assets/${asset.name}`, asset.content);
    });
  }

  // Auto-bundle uploaded ZIP assets (e.g. DiskWala assets: images, audio mp3, fonts) if present
  try {
    const assetZipUrl = '/assets/aistudio/DiskWala_bcf761f6.zip';
    const resp = await fetch(assetZipUrl);
    if (resp.ok) {
      onProgress?.('Extracting and bundling uploaded 27 media & sound assets into APK assets...');
      const arrayBuf = await resp.arrayBuffer();
      const userZip = await JSZip.loadAsync(arrayBuf);
      const entries = Object.keys(userZip.files);
      for (const entryName of entries) {
        const item = userZip.files[entryName];
        if (item.dir) continue;
        const data = await item.async('uint8array');
        const cleanName = entryName.split('/').pop() || entryName;
        zip.file(`app/src/main/assets/${cleanName}`, data);

        // Put app icon in res/mipmap
        if (cleanName === 'my_icon.png') {
          const densities = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
          densities.forEach(d => {
            zip.file(`app/src/main/res/mipmap-${d}/ic_launcher.png`, data);
            zip.file(`app/src/main/res/mipmap-${d}/ic_launcher_round.png`, data);
          });
        }
      }
    }
  } catch (err) {
    console.warn('Could not auto-bundle uploaded DiskWala archive:', err);
  }

  // 6. Build Gradle Files
  onProgress?.('Configuring Gradle build scripts...');

  // Top level build.gradle
  zip.file('build.gradle', `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.3.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}`);

  // settings.gradle
  zip.file('settings.gradle', `rootProject.name = "${config.appName.replace(/[^a-zA-Z0-9]/g, '')}"
include ':app'`);

  // gradle.properties
  zip.file('gradle.properties', `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true`);

  // app/build.gradle
  zip.file('app/build.gradle', `plugins {
    id 'com.android.application'
}

android {
    namespace '${config.packageName}'
    compileSdk 34

    defaultConfig {
        applicationId "${config.packageName}"
        minSdk 21
        targetSdk 34
        versionCode ${config.versionCode}
        versionName "${config.versionName}"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.webkit:webkit:1.10.0'
}`);

  // 7. Automated 1-Click Cloud APK Build Workflow (.github/workflows/build-apk.yml)
  onProgress?.('Adding 1-Click Free Cloud APK builder (GitHub Actions)...');
  zip.file('.github/workflows/build-apk.yml', `name: Build Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: Build Debug APK
        run: ./gradlew assembleDebug --stacktrace

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${config.appName.replace(/[^a-zA-Z0-9_-]/g, '_')}-debug-apk
          path: app/build/outputs/apk/debug/app-debug.apk
`);

  // 8. Gradlew scripts
  zip.file('gradlew', `#!/usr/bin/env sh
# Gradle wrapper execution script for Unix/Linux/macOS
exec gradle "$@"
`);
  zip.file('gradlew.bat', `@rem Gradle wrapper execution script for Windows
@gradle %*
`);

  // 9. README.md with Full Hindi and English Step-by-Step Instructions
  zip.file('README.md', `# ${config.appName} - Android Mobile App Project
Package Name: \`${config.packageName}\`  
Version: \`${config.versionName} (${config.versionCode})\`

---

## 🚀 How to Get Your .APK File (3 Easy Methods)

### Method 1: FREE 1-Click Cloud Build (No PC Software Needed! - Sabse Aasan)
Is method me aapko apne computer par koi bhi heavy software install karne ki zarurat nahi hai:
1. Is ZIP ko extract karein.
2. [GitHub.com](https://github.com) par ek naya **Private** ya **Public** repository banayein.
3. Is folder ki sari files ko GitHub repository me upload/push karein.
4. GitHub par **"Actions"** tab me jayein -> "Build Android APK" workflow automatically run hoga (1-2 minutes).
5. Build complete hone ke baad **Artifacts** section se apna **\`app-debug.apk\`** download karein aur phone me install karein!

---

### Method 2: Android Studio (On PC / Mac / Linux)
Agar aapke paas Android Studio installed hai:
1. **Android Studio** open karein.
2. **File** -> **Open** par click karein aur is unzipped folder ko select karein.
3. Gradle sync complete hone ka wait karein (10-20 seconds).
4. Top menu se **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)** par click karein.
5. Android Studio screen ke bottom-right me "locate" button dikhayega: wahan aapka ready \`.apk\` file hoga!

---

### Method 3: Command Line / Terminal / Termux
Terminal me run karein:
\`\`\`bash
chmod +x gradlew
./gradlew assembleDebug
\`\`\`
APK generated at: \`app/build/outputs/apk/debug/app-debug.apk\`

---

## 📱 App Configuration & Permissions
- App Name: ${config.appName}
- Package Name: ${config.packageName}
- Orientation: ${config.orientation}
- Status Bar Color: ${config.themeColor}
- Hardware Acceleration: ${config.enableHardwareAcceleration}
- Offline Cache: ${config.enableOfflineCache}
`);

  onProgress?.('Compressing ZIP archive...');
  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Generates PWA files (manifest.json, sw.js)
 */
export function generatePwaPackage(config: AppConfig, files: ProjectFiles): { manifestJson: string; swJs: string } {
  const manifest = {
    name: config.appName,
    short_name: config.appName,
    start_url: './index.html',
    display: config.fullscreen ? 'fullscreen' : 'standalone',
    background_color: config.backgroundColor,
    theme_color: config.themeColor,
    orientation: config.orientation === 'portrait' ? 'portrait-primary' : config.orientation === 'landscape' ? 'landscape-primary' : 'any',
    icons: [
      {
        src: config.iconDataUrl || 'icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: config.iconDataUrl || 'icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  };

  const sw = `// Service Worker for Offline Mobile Experience
const CACHE_NAME = '${config.appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
`;

  return {
    manifestJson: JSON.stringify(manifest, null, 2),
    swJs: sw
  };
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
