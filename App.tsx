
import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import { 
  PlusCircle, 
  Layout, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  RefreshCw,
  Info,
  Palette,
  Trash2,
  Download,
  AlertCircle,
  X
} from 'lucide-react';
import { InfographicData, LayoutType, StyleOptions } from './types';
import { LAYOUT_OPTIONS, NOVA_VIA_BRAND, ACCENT_COLORS, BACKGROUND_COLORS, CORNER_STYLES, BORDER_VARIANTS } from './constants';
import { parseStepsManually, ParserError } from './services/infographicParser';
import InfographicRenderer from './components/InfographicRenderer';

const ErrorToast: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => (
  <motion.div 
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 50, opacity: 0 }}
    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-[#1A2633] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl max-w-[90vw] md:max-w-md"
  >
    <AlertCircle className="text-[#8F9185] shrink-0" size={24} />
    <div className="flex-1">
      <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5 font-heading">System Error</h4>
      <p className="text-sm font-medium leading-tight font-body">{message}</p>
    </div>
    <button onClick={onDismiss} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
      <X size={18} />
    </button>
  </motion.div>
);

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InfographicData | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('vertical-cards');
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  
  const [styleOptions, setStyleOptions] = useState<StyleOptions>({
    accentColor: NOVA_VIA_BRAND.accent,
    backgroundColor: BACKGROUND_COLORS[1].value, // Soft Off-White
    cornerStyle: 'soft',
    borderVariant: 'solid',
  });

  const handleGenerate = () => {
    setIsProcessing(true);
    setError(null);
    
    // Artificial delay to simulate "orchestration" for better UX feel
    setTimeout(() => {
      try {
        const parsedData = parseStepsManually(inputText);
        setData(parsedData);
      } catch (err: any) {
        setError(err instanceof ParserError ? err.message : "Parsing failed.");
      } finally {
        setIsProcessing(false);
      }
    }, 600);
  };

  const handleCopySvg = useCallback(() => {
    const svgElement = exportRef.current?.querySelector('svg');
    if (svgElement) {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      navigator.clipboard.writeText(svgString).then(() => {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);
      });
    }
  }, []);

  const exportAsImage = async (format: 'png' | 'jpeg' | 'svg') => {
    if (!exportRef.current) return;

    try {
      const node = exportRef.current;
      const options = {
        backgroundColor: styleOptions.backgroundColor,
        pixelRatio: 3, 
        style: {
          borderRadius: '0px',
        },
      };

      let dataUrl = '';
      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(node, options);
      } else if (format === 'jpeg') {
        dataUrl = await htmlToImage.toJpeg(node, { ...options, quality: 0.98 });
      } else if (format === 'svg') {
        dataUrl = await htmlToImage.toSvg(node, options);
      }

      const link = document.createElement('a');
      link.download = `NovaViA-Infographic-${Date.now()}.${format === 'jpeg' ? 'jpg' : format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      setError('Export failed. Check content complexity.');
    }
  };

  const handleReset = () => {
    setData(null);
    setInputText('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#EEEDE9] selection:bg-[#034F80] selection:text-white">
      <AnimatePresence>
        {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="h-20 border-b border-[#2E3B4A]/10 bg-white flex items-center justify-between px-6 md:px-10 sticky top-0 z-50">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-20 h-20 md:w-22 md:h-22 flex items-center justify-center">
            <img
              src="/novavia-logo.png"
              alt="NOVA ViA Logo"
              className="w-12 md:w-14 object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter font-heading" style={{ color: NOVA_VIA_BRAND.primary }}>NOVA ViA</h1>
            <p className="hidden md:block text-[9px] uppercase tracking-[0.4em] text-[#818181] font-black -mt-1 font-body">Design Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-[10px] md:text-xs font-bold text-[#818181] flex items-center gap-2 uppercase tracking-widest font-heading">
            {/* <Info size={14} /> <span className="hidden sm:inline">Rule-Based Engine V2.0</span> */}
          </div>
        </div>
      </nav>

      {/* Hero Input Section */}
      <section className="bg-[#1A2633] py-12 md:py-20 px-4 md:px-6 flex justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
             <defs>
               <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                 <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
               </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>
        
        <div className="w-full max-w-4xl bg-white p-6 md:p-10 shadow-2xl relative z-10 border-t-8" style={{ borderColor: NOVA_VIA_BRAND.primary }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#1A2633] flex items-center gap-3 text-lg uppercase tracking-tight font-heading">
              <PlusCircle size={24} style={{ color: NOVA_VIA_BRAND.primary }} />
              Process Blueprint
            </h3>
            {data && (
              <button 
                onClick={handleReset}
                className="p-2 hover:bg-[#EEEDE9] rounded-full text-[#818181] transition-all"
                title="Reset Workspace"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={"Enter steps like:\n1. Step One: Description\n2. Step Two: Description\n\nOR use arrows:\nStart -> Process -> End"}
            className="w-full h-32 md:h-44 p-6 bg-[#EEEDE9]/30 text-[#1A2633] focus:bg-white focus:ring-4 focus:ring-[#034F80]/5 border border-transparent focus:border-[#034F80]/20 outline-none transition-all resize-none text-lg placeholder:text-[#818181]/50 font-body mb-6"
          />
          <button
            onClick={handleGenerate}
            disabled={isProcessing || !inputText.trim()}
            className="w-full py-4 md:py-5 font-bold flex items-center justify-center gap-3 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] font-heading tracking-widest text-lg"
            style={{ backgroundColor: NOVA_VIA_BRAND.primary }}
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={24} /> : <Sparkles size={24} />}
            {isProcessing ? "PROCESSING..." : "GENERATE INFOGRAPHIC"}
          </button>
        </div>
      </section>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 md:p-12 gap-8 md:gap-16">
        {/* Sidebar Configuration */}
        <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-10">
          {/* Structure Section */}
          <section className="flex flex-col gap-6">
            <h3 className="font-bold text-[#1A2633] flex items-center gap-3 text-base md:text-lg uppercase tracking-widest font-heading border-b border-[#2E3B4A]/10 pb-4">
              <Layout size={20} style={{ color: NOVA_VIA_BRAND.primary }} />
              Geometry & Flow
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {LAYOUT_OPTIONS.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout.id)}
                  className={`p-5 border transition-all text-left flex flex-col gap-1 ${
                    selectedLayout === layout.id 
                      ? 'border-[#034F80] bg-white shadow-xl translate-x-2' 
                      : 'border-[#2E3B4A]/10 bg-white/50 text-[#818181] hover:bg-white'
                  }`}
                >
                  <div className={`text-sm font-black uppercase tracking-widest font-heading ${selectedLayout === layout.id ? 'text-[#034F80]' : 'text-[#1A2633]'}`}>
                    {layout.label}
                  </div>
                  <div className="text-xs font-medium opacity-70 font-body">
                    {layout.description}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Aesthetic Values Section */}
          <section className="flex flex-col gap-8">
            <h3 className="font-bold text-[#1A2633] flex items-center gap-3 text-base md:text-lg uppercase tracking-widest font-heading border-b border-[#2E3B4A]/10 pb-4">
              <Palette size={20} style={{ color: NOVA_VIA_BRAND.accent }} />
              Aesthetic Values
            </h3>
            
            <div className="space-y-4">
              <label className="text-xs font-bold text-[#818181] uppercase tracking-[0.2em] font-heading">Atmosphere</label>
              <div className="flex flex-wrap gap-3">
                {BACKGROUND_COLORS.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setStyleOptions(prev => ({ ...prev, backgroundColor: color.value }))}
                    className={`w-9 h-9 border-2 transition-all ${
                      styleOptions.backgroundColor === color.value ? 'border-[#034F80] scale-110 shadow-md ring-4 ring-[#034F80]/5' : 'border-white'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-[#818181] uppercase tracking-[0.2em] font-heading">Accentuation</label>
              <div className="flex flex-wrap gap-3">
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setStyleOptions(prev => ({ ...prev, accentColor: color.value }))}
                    className={`w-9 h-9 border-4 transition-all ${
                      styleOptions.accentColor === color.value ? 'border-[#1A2633] scale-110 shadow-xl' : 'border-white opacity-60 hover:opacity-100 shadow-sm'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-[#818181] uppercase tracking-[0.2em] font-heading">Intentional Edge</label>
              <div className="flex gap-2">
                {CORNER_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setStyleOptions(prev => ({ ...prev, cornerStyle: style.id as any }))}
                    className={`flex-1 py-4 text-xs font-bold border transition-all uppercase tracking-widest font-heading ${
                      styleOptions.cornerStyle === style.id ? 'border-[#034F80] bg-[#034F80] text-white shadow-lg' : 'border-[#2E3B4A]/10 bg-white text-[#818181]'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </aside>

        {/* Live Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sm:gap-0">
            <h3 className="font-bold text-[#1A2633] flex items-center gap-3 uppercase tracking-[0.4em] text-[10px] font-heading">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8F9185] animate-pulse" />
              Manifestation Workspace
            </h3>
            {data && (
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex bg-white shadow-sm border border-[#2E3B4A]/10 p-1">
                  <button 
                    onClick={() => exportAsImage('png')}
                    className="px-4 py-2 hover:bg-[#EEEDE9] text-[10px] font-bold text-[#1A2633] transition-all uppercase tracking-widest font-heading flex items-center gap-2"
                  >
                    <Download size={14} /> PNG
                  </button>
                  <button 
                    onClick={() => exportAsImage('jpeg')}
                    className="px-4 py-2 hover:bg-[#EEEDE9] text-[10px] font-bold text-[#1A2633] transition-all uppercase tracking-widest font-heading"
                  >
                    JPG
                  </button>
                  <button 
                    onClick={() => exportAsImage('svg')}
                    className="px-4 py-2 hover:bg-[#EEEDE9] text-[10px] font-bold text-[#1A2633] transition-all uppercase tracking-widest font-heading"
                  >
                    SVG
                  </button>
                </div>
                <button 
                  onClick={handleCopySvg}
                  className="px-6 py-3 bg-[#1A2633] text-[10px] font-bold text-white hover:bg-[#034F80] transition-all shadow-xl uppercase tracking-widest font-heading"
                >
                  <Copy size={16} className="inline mr-2" /> {showCopySuccess ? 'COPIED!' : 'COPY SVG'}
                </button>
              </div>
            )}
          </div>

          <div 
            className="flex-1 min-h-[600px] md:min-h-[850px] bg-white border border-[#2E3B4A]/5 flex items-start justify-center p-6 md:p-16 overflow-x-auto overflow-y-visible shadow-sm relative transition-colors duration-700"
          >
            <AnimatePresence mode="wait">
              {data ? (
                <motion.div 
                  key={`${selectedLayout}-${JSON.stringify(styleOptions)}-${data.title}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="shrink-0 w-full"
                  ref={exportRef}
                >
                  <InfographicRenderer data={data} layout={selectedLayout} styles={styleOptions} />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center max-w-lg m-auto py-24 px-4"
                >
                  <div className="w-20 h-20 md:w-28 md:h-28 bg-[#EEEDE9] flex items-center justify-center shadow-inner mx-auto mb-10 text-[#818181]/30 border border-white transform transition-transform hover:scale-105">
                    {isProcessing ? <RefreshCw className="animate-spin md:w-14 md:h-14" /> : <ArrowRight size={40} className="md:w-16 md:h-16" />}
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-[#1A2633] mb-4 tracking-tight uppercase font-heading">
                    {isProcessing ? "Processing Blueprint" : "The Path of Visual Clarity"}
                  </h4>
                  <p className="text-[#818181] text-sm md:text-lg font-medium leading-relaxed font-body">
                    {isProcessing 
                      ? "Orchestrating layout geometry and content hierarchy for a professional human-centered result." 
                      : "Describe your evolution or steps (using 1. Step or Step 1 -> Step 2) to manifest a purposeful visual roadmap."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 opacity-[0.01] pointer-events-none z-[-1] overflow-hidden">
              <Sparkles className="absolute -bottom-40 -left-40" size={800} />
            </div>
          </div>
        </div>
      </div>

      <footer className="py-10 border-t border-[#2E3B4A]/5 bg-white flex flex-col items-center justify-center text-[#818181] shrink-0 px-4 text-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-20 h-20 md:w-22 md:h-22 flex items-center justify-center">
            <img
              src="/novavia-logo.png"
              alt="NOVA ViA Logo"
              className="w-12 md:w-14 object-contain"
            />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] font-heading text-[#1A2633]">NOVA ViA</span>
        </div>
        <p className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-100 font-body">
          &copy; 2025 NOVA ViA - All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
