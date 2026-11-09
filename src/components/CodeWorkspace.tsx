import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import {
  FileCode,
  FileText,
  FileSpreadsheet,
  Upload,
  CheckCircle,
  AlertTriangle,
  Info,
  Wand2,
  Copy,
  Check,
  FolderArchive,
  Layers,
  Sparkles
} from 'lucide-react';
import { ProjectFiles, AppConfig, TemplateApp } from '../types/appConfig';
import { TEMPLATES } from '../data/templates';
import { validateHtmlCode } from '../utils/apkGenerator';

interface CodeWorkspaceProps {
  files: ProjectFiles;
  setFiles: React.Dispatch<React.SetStateAction<ProjectFiles>>;
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  lang: 'hi' | 'en';
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  files,
  setFiles,
  config,
  setConfig,
  lang
}) => {
  const [activeFile, setActiveFile] = useState<'html' | 'css' | 'js' | 'upload'>('html');
  const [copied, setCopied] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate HTML
  const issues = React.useMemo(() => validateHtmlCode(files.html), [files.html]);

  const handleCopy = () => {
    const textToCopy =
      activeFile === 'html' ? files.html : activeFile === 'css' ? files.css : files.js;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-Fix mobile issues (e.g. inject viewport meta)
  const handleAutoFix = () => {
    let updatedHtml = files.html;
    if (!/<meta\s+name=["']viewport["']/i.test(updatedHtml)) {
      const meta = '  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">\n';
      if (updatedHtml.includes('<head>')) {
        updatedHtml = updatedHtml.replace('<head>', `<head>\n${meta}`);
      } else {
        updatedHtml = `${meta}${updatedHtml}`;
      }
    }
    if (!/<!DOCTYPE\s+html/i.test(updatedHtml)) {
      updatedHtml = `<!DOCTYPE html>\n${updatedHtml}`;
    }
    setFiles(prev => ({ ...prev, html: updatedHtml }));
  };

  // Load a preset template
  const handleSelectTemplate = (template: TemplateApp) => {
    setFiles(template.files);
    if (template.config) {
      setConfig(prev => ({
        ...prev,
        ...template.config,
        permissions: {
          ...prev.permissions,
          ...(template.config.permissions || {})
        }
      }));
    }
    setUploadNotice(null);
  };

  // Process files (supports .zip, .html, .css, .js)
  const processFileList = async (fileList: FileList | File[]) => {
    const fileArray = Array.from(fileList);
    if (fileArray.length === 0) return;

    for (const file of fileArray) {
      const ext = file.name.split('.').pop()?.toLowerCase();

      // Handle ZIP archives
      if (ext === 'zip') {
        try {
          setUploadNotice(lang === 'hi' ? 'ZIP फ़ाइल को अनपैक किया जा रहा है...' : 'Unpacking ZIP archive...');
          const zip = await JSZip.loadAsync(file);
          let extractedHtml = '';
          let extractedCss = '';
          let extractedJs = '';
          const extractedAssets: { name: string; content: string; type: string }[] = [];

          const entries = Object.keys(zip.files);
          for (const filename of entries) {
            const entry = zip.files[filename];
            if (entry.dir) continue;
            const lower = filename.toLowerCase();

            if (lower.endsWith('.html') || lower.endsWith('.htm')) {
              const text = await entry.async('string');
              if (!extractedHtml || lower.includes('index.html')) {
                extractedHtml = text;
              }
            } else if (lower.endsWith('.css')) {
              const text = await entry.async('string');
              extractedCss += (extractedCss ? '\n' : '') + text;
            } else if (lower.endsWith('.js')) {
              const text = await entry.async('string');
              extractedJs += (extractedJs ? '\n' : '') + text;
            } else if (/\.(png|jpe?g|gif|webp|svg)$/i.test(lower)) {
              const base64 = await entry.async('base64');
              const mime = lower.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
              extractedAssets.push({
                name: filename.split('/').pop() || filename,
                content: `data:${mime};base64,${base64}`,
                type: mime
              });
            }
          }

          setFiles(prev => ({
            html: extractedHtml || prev.html,
            css: extractedCss || prev.css,
            js: extractedJs || prev.js,
            assets: extractedAssets.length > 0 ? extractedAssets : (prev.assets || [])
          }));

          setUploadNotice(
            lang === 'hi'
              ? `सफलतापूर्वक ZIP से ${entries.length} फ़ाइलें लोड की गईं! सिम्युलेटर में लाइव देखें।`
              : `Extracted ${entries.length} files from ${file.name}! Check the live simulator.`
          );
          setActiveFile('html');
          return;
        } catch (err) {
          console.error('Error unzipping:', err);
          alert('Could not open ZIP file. Please ensure it is a valid zip archive.');
          return;
        }
      }

      // Handle single files
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (!content) return;

        if (ext === 'html' || ext === 'htm') {
          setFiles(prev => ({ ...prev, html: content }));
          setActiveFile('html');
          setUploadNotice(`Loaded ${file.name}`);
        } else if (ext === 'css') {
          setFiles(prev => ({ ...prev, css: content }));
          setActiveFile('css');
          setUploadNotice(`Loaded ${file.name}`);
        } else if (ext === 'js') {
          setFiles(prev => ({ ...prev, js: content }));
          setActiveFile('js');
          setUploadNotice(`Loaded ${file.name}`);
        } else {
          // Extra asset
          setFiles(prev => ({
            ...prev,
            assets: [
              ...(prev.assets || []).filter(a => a.name !== file.name),
              { name: file.name, content, type: file.type }
            ]
          }));
          setUploadNotice(`Added asset: ${file.name}`);
        }
      };

      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp3', 'wav'].includes(ext || '')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFileList(e.target.files);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Templates Bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-2 flex items-center justify-between gap-3 overflow-x-auto text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-300">
            {lang === 'hi' ? 'रेडीमेड टेम्पलेट्स:' : 'Quick Presets:'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              className="px-2.5 py-1 rounded-lg border border-slate-700 hover:border-emerald-500/50 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all whitespace-nowrap"
            >
              {lang === 'hi' ? tmpl.nameHindi : tmpl.name}
            </button>
          ))}
          <button
            onClick={() => {
              setFiles({
                html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${config.appName}</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div style="padding: 24px; text-align: center; color: #fff;">\n    <h1>Hello Android!</h1>\n    <p>Apna HTML code yahan paste karein.</p>\n  </div>\n  <script src="app.js"></script>\n</body>\n</html>`,
                css: `body { margin: 0; background: #0f172a; font-family: sans-serif; }`,
                js: `console.log("App ready!");`,
                assets: []
              });
            }}
            className="px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-300 whitespace-nowrap"
          >
            {lang === 'hi' ? 'खाली ब्लैंक' : 'Blank Starter'}
          </button>
        </div>
      </div>

      {/* Code Health & Warnings Bar */}
      {issues.length > 0 && (
        <div className="border-b border-slate-800 bg-amber-950/20 px-4 py-2 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="truncate">
              {lang === 'hi' ? issues[0].messageHindi : issues[0].message}
            </span>
          </div>
          {issues.some(i => i.message.includes('viewport') || i.message.includes('DOCTYPE')) && (
            <button
              onClick={handleAutoFix}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 font-medium whitespace-nowrap shrink-0 transition-colors"
            >
              <Wand2 className="w-3 h-3" />
              <span>{lang === 'hi' ? 'ऑटो-फिक्स मेटा' : 'Auto-Fix Meta'}</span>
            </button>
          )}
        </div>
      )}

      {/* File Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-1.5">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveFile('html')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeFile === 'html'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-orange-400" />
            <span>index.html</span>
          </button>

          <button
            onClick={() => setActiveFile('css')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeFile === 'css'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>style.css</span>
          </button>

          <button
            onClick={() => setActiveFile('js')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeFile === 'js'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-yellow-400" />
            <span>app.js</span>
          </button>

          <button
            onClick={() => setActiveFile('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeFile === 'upload'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'hi' ? 'फ़ाइल अपलोड' : 'Upload Files'}</span>
          </button>
        </div>

        {/* Copy Button */}
        {activeFile !== 'upload' && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative overflow-hidden bg-slate-950">
        {activeFile === 'html' && (
          <textarea
            value={files.html}
            onChange={(e) => setFiles(prev => ({ ...prev, html: e.target.value }))}
            placeholder="Paste your HTML code here..."
            spellCheck={false}
            className="w-full h-full p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed resize-none outline-none border-0"
          />
        )}

        {activeFile === 'css' && (
          <textarea
            value={files.css}
            onChange={(e) => setFiles(prev => ({ ...prev, css: e.target.value }))}
            placeholder="/* Optional: Paste CSS styles here */"
            spellCheck={false}
            className="w-full h-full p-4 bg-slate-950 text-cyan-200 font-mono text-xs leading-relaxed resize-none outline-none border-0"
          />
        )}

        {activeFile === 'js' && (
          <textarea
            value={files.js}
            onChange={(e) => setFiles(prev => ({ ...prev, js: e.target.value }))}
            placeholder="// Optional: Paste JavaScript app logic here"
            spellCheck={false}
            className="w-full h-full p-4 bg-slate-950 text-amber-200 font-mono text-xs leading-relaxed resize-none outline-none border-0"
          />
        )}

        {activeFile === 'upload' && (
          <div className="p-6 flex flex-col items-center justify-center h-full text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".zip,.html,.htm,.css,.js,.png,.jpg,.jpeg,.svg,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files) {
                  processFileList(e.dataTransfer.files);
                }
              }}
              className="border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 rounded-2xl p-8 max-w-lg w-full cursor-pointer transition-all bg-slate-900/40 hover:bg-slate-900/80 shadow-lg group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <FolderArchive className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5 flex items-center justify-center gap-2">
                <span>{lang === 'hi' ? 'अपनी ZIP या HTML फ़ाइलें यहाँ ड्रॉप करें' : 'Drop your ZIP or HTML files here'}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4 max-w-sm mx-auto">
                {lang === 'hi'
                  ? 'पूरा प्रोजेक्ट ZIP (index.html, CSS, JS, images) या एकल HTML फ़ाइलें सीधे ड्रॉप करें। हमारा सिस्टम अपने आप ZIP को एक्सट्रैक्ट करके सिम्युलेटर में चला देगा!'
                  : 'Drag & drop your entire project ZIP or individual files. We will automatically unpack all files into the live simulator!'}
              </p>
              <button
                type="button"
                className="px-5 py-2.5 text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl transition-colors shadow-md shadow-emerald-500/20"
              >
                {lang === 'hi' ? 'फ़ाइल या ZIP चुनें (Browse)' : 'Browse ZIP or Files'}
              </button>
            </div>

            {uploadNotice && (
              <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 max-w-md w-full flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{uploadNotice}</span>
              </div>
            )}

            {(files.assets?.length ?? 0) > 0 && (
              <div className="mt-6 text-left max-w-md w-full">
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Uploaded Assets ({files.assets?.length}):
                </span>
                <div className="space-y-1">
                  {files.assets?.map((asset, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded border border-slate-800 text-slate-300"
                    >
                      <span className="truncate">{asset.name}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{asset.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
