
import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { InfographicData, LayoutType, StyleOptions } from '../types';
import { NOVA_VIA_BRAND, CORNER_STYLES } from '../constants';
import IconRenderer from './IconRenderer';

interface Props {
  data: InfographicData;
  layout: LayoutType;
  styles: StyleOptions;
}

const InfographicRenderer: React.FC<Props> = ({ data, layout, styles }) => {
  const { title, subtitle, steps } = data;
  const accent = styles.accentColor;
  const bg = styles.backgroundColor;
  
  const getRadius = () => {
    return CORNER_STYLES.find(s => s.id === styles.cornerStyle)?.radius || '0px';
  };

  const getBorderStyle = (colorOverride?: string) => {
    const type = styles.borderVariant === 'dashed' ? 'dashed' : 'solid';
    const color = colorOverride || '#2E3B4A20';
    if (styles.borderVariant === 'none') return 'none';
    return `1px ${type} ${color}`;
  };

  const commonCardStyles = (idx: number) => ({
    borderRadius: getRadius(),
    border: getBorderStyle(),
    background: '#ffffff',
    boxShadow: '0 20px 40px -12px rgba(26, 38, 51, 0.08)',
  });

  const renderVertical = () => {
    return (
      <div className="flex flex-col gap-10 w-full max-w-4xl mx-auto p-10 md:p-20 shadow-2xl" style={{ borderRadius: getRadius(), backgroundColor: bg }}>
        <header className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-normal font-elegant" style={{ color: NOVA_VIA_BRAND.text }}>{title}</h2>
          {subtitle && <p className="text-[#818181] mt-4 text-base md:text-xl font-body italic">{subtitle}</p>}
          <div className="h-1 w-24 bg-[#034F80] mx-auto mt-8 opacity-20" />
        </header>
        <div className="space-y-10">
          {steps.map((step, idx) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-start sm:items-stretch gap-8 p-10 border-l-4 sm:border-l-[12px]"
              style={{ 
                ...commonCardStyles(idx),
                borderLeftColor: idx % 2 === 0 ? NOVA_VIA_BRAND.primary : accent, 
              }}
            >
              <div 
                className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-white font-bold text-xl md:text-2xl font-heading shadow-xl"
                style={{ backgroundColor: NOVA_VIA_BRAND.primary }}
              >
                {step.number < 10 ? `0${step.number}` : step.number}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <IconRenderer name={step.iconName} size={24} style={{ color: accent }} />
                  <h3 className="text-xl md:text-3xl font-bold font-heading uppercase tracking-tight" style={{ color: NOVA_VIA_BRAND.text }}>{step.title}</h3>
                </div>
                <p className="text-[#2E3B4A] leading-relaxed text-base md:text-lg font-body opacity-80">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderHorizontal = () => {
    return (
      <div className="p-10 md:p-24 shadow-2xl inline-block min-w-full lg:min-w-0" style={{ borderRadius: getRadius(), backgroundColor: bg }}>
        <header className="mb-20 text-center">
          <h2 className="text-4xl md:text-6xl font-normal font-elegant" style={{ color: NOVA_VIA_BRAND.text }}>{title}</h2>
          {subtitle && <p className="text-[#818181] mt-6 text-xl font-body italic">{subtitle}</p>}
        </header>
        <div className="flex flex-col md:flex-row gap-10 items-stretch">
          {steps.map((step, idx) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="w-full md:w-[320px] lg:w-[360px] flex flex-col p-10 relative"
              style={commonCardStyles(idx)}
            >
              <div className="absolute -top-6 left-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-white font-bold text-lg md:text-xl font-heading shadow-2xl"
                   style={{ backgroundColor: idx % 2 === 0 ? NOVA_VIA_BRAND.primary : accent }}>
                {step.number}
              </div>
              <div className="mt-8 mb-8">
                <IconRenderer name={step.iconName} size={48} style={{ color: NOVA_VIA_BRAND.primary }} />
              </div>
              <h3 className="text-2xl font-bold mb-6 leading-tight font-heading uppercase tracking-tight" style={{ color: NOVA_VIA_BRAND.text }}>{step.title}</h3>
              <p className="text-sm md:text-base text-[#2E3B4A] leading-relaxed font-body opacity-80">{step.description}</p>
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 bg-white p-2 shadow-xl border border-[#2E3B4A]/5">
                   <LucideIcons.ChevronRight className="text-[#818181]" size={28} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderRadial = () => {
    const svgSize = Math.min(window.innerWidth - 100, 900);
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    const radius = svgSize * 0.32;
    const stepCount = steps.length;

    return (
      <div className="flex flex-col items-center justify-center p-12 md:p-24 shadow-2xl border border-white inline-block" style={{ borderRadius: getRadius(), backgroundColor: bg }}>
        <header className="mb-10 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-normal font-elegant" style={{ color: NOVA_VIA_BRAND.text }}>{title}</h2>
          {subtitle && <p className="text-[#818181] mt-4 text-lg md:text-xl font-body italic">{subtitle}</p>}
        </header>
        <div className="relative" style={{ width: svgSize, height: svgSize }}>
           <motion.div 
             initial={{ scale: 0, rotate: -45 }}
             animate={{ scale: 1, rotate: 0 }}
             transition={{ duration: 1, ease: "circOut" }}
             className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-80 md:h-80 border-4 border-[#EEEDE9] bg-white shadow-2xl flex flex-col items-center justify-center p-8 text-center z-20"
             style={{ borderRadius: getRadius() }}
           >
             <IconRenderer name="Sparkles" size={48} className="md:w-16 md:h-16 mb-4" style={{ color: NOVA_VIA_BRAND.primary }} />
             <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-[#818181] font-heading mb-2">Transformation Hub</p>
             <p className="text-xl md:text-3xl font-bold font-heading uppercase tracking-tighter" style={{ color: NOVA_VIA_BRAND.primary }}>{title.split(' ')[0]}</p>
           </motion.div>

           <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
             {steps.map((_, idx) => {
               const angle = (idx / stepCount) * 2 * Math.PI - Math.PI / 2;
               const x = centerX + radius * Math.cos(angle);
               const y = centerY + radius * Math.sin(angle);
               return (
                 <line 
                   key={`line-${idx}`}
                   x1={centerX} y1={centerY} x2={x} y2={y}
                   stroke={NOVA_VIA_BRAND.primary} strokeOpacity="0.08" strokeWidth="2" 
                   strokeDasharray={styles.borderVariant === 'dashed' ? '12,12' : 'none'}
                 />
               );
             })}
           </svg>

           {steps.map((step, idx) => {
             const angle = (idx / stepCount) * 2 * Math.PI - Math.PI / 2;
             const x = centerX + radius * Math.cos(angle);
             const y = centerY + radius * Math.sin(angle);
             
             return (
               <motion.div 
                 key={step.id}
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: idx * 0.1, duration: 0.8 }}
                 className="absolute w-40 md:w-64 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 md:p-8 shadow-2xl text-center group"
                 style={{ left: x, top: y, borderRadius: getRadius(), border: getBorderStyle() }}
               >
                 <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white text-sm md:text-lg font-bold font-heading mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: NOVA_VIA_BRAND.primary }}>
                   {step.number}
                 </div>
                 <h4 className="text-sm md:text-xl font-bold mb-3 font-heading uppercase tracking-tight" style={{ color: NOVA_VIA_BRAND.text }}>{step.title}</h4>
                 <p className="text-[10px] md:text-sm text-[#2E3B4A] leading-relaxed font-body opacity-70 line-clamp-3">{step.description}</p>
               </motion.div>
             );
           })}
        </div>
      </div>
    );
  };

  const renderTimeline = () => {
    return (
      <div className="w-full max-w-5xl p-10 md:p-24 border border-white shadow-2xl mx-auto" style={{ borderRadius: getRadius(), backgroundColor: bg }}>
        <header className="mb-20 text-center">
          <h2 className="text-4xl md:text-6xl font-normal font-elegant" style={{ color: NOVA_VIA_BRAND.text }}>{title}</h2>
          {subtitle && <p className="text-[#818181] mt-6 text-xl font-body italic">{subtitle}</p>}
        </header>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-6 sm:left-1/2 transform sm:-translate-x-1/2 h-full w-1 md:w-3 bg-[#EEEDE9] rounded-full" />
          <div className="space-y-20 md:space-y-32 py-10">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`flex items-center w-full flex-row sm:${isEven ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className="hidden sm:block sm:w-5/12"></div>
                  <div className="w-16 sm:w-2/12 flex justify-center relative z-10 shrink-0">
                    <div className="w-12 h-12 md:w-20 md:h-20 border-4 md:border-[12px] border-white shadow-2xl flex items-center justify-center text-white text-lg md:text-3xl font-bold font-heading"
                         style={{ backgroundColor: NOVA_VIA_BRAND.primary }}>
                      {step.number}
                    </div>
                  </div>
                  <div className={`flex-1 sm:w-5/12 text-left sm:${isEven ? 'text-right' : 'text-left'} p-8 md:p-12 bg-white shadow-2xl`} style={{ borderRadius: getRadius(), border: getBorderStyle() }}>
                    <div className={`flex items-center gap-4 mb-6 flex-row sm:${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
                       <div className="p-3 bg-[#EEEDE9] shadow-inner">
                         <IconRenderer name={step.iconName} size={28} style={{ color: accent }} />
                       </div>
                       <h3 className="text-xl md:text-3xl font-bold font-heading uppercase tracking-tight" style={{ color: NOVA_VIA_BRAND.text }}>{step.title}</h3>
                    </div>
                    <p className="text-sm md:text-lg text-[#2E3B4A] leading-relaxed font-body opacity-80">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderCircularProgress = () => {
    const svgSize = Math.min(window.innerWidth - 80, 1000);
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    const radius = svgSize * 0.35;
    const stepCount = steps.length;

    return (
      <div className="flex flex-col items-center justify-center p-12 md:p-24 shadow-2xl border border-white inline-block" style={{ borderRadius: getRadius(), backgroundColor: bg }}>
        <header className="mb-16 text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-normal font-elegant tracking-tight" style={{ color: NOVA_VIA_BRAND.text }}>{title}</h2>
          {subtitle && <p className="text-[#818181] mt-6 text-xl font-body italic font-medium">{subtitle}</p>}
        </header>
        
        <div className="relative flex items-center justify-center" style={{ width: svgSize, height: svgSize }}>
           <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
             <circle 
               cx={centerX} cy={centerY} r={radius} 
               fill="none" stroke="#2E3B4A08" strokeWidth="12"
             />
             <path 
               d={`M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 1 1 ${centerX} ${centerY + radius} A ${radius} ${radius} 0 1 1 ${centerX} ${centerY - radius}`}
               fill="none"
               stroke={NOVA_VIA_BRAND.primary}
               strokeWidth="4"
               strokeLinecap="square"
               strokeDasharray="20, 20" 
             />
           </svg>

           {steps.map((step, idx) => {
             const angle = (idx / stepCount) * 2 * Math.PI - Math.PI / 2;
             const x = centerX + radius * Math.cos(angle);
             const y = centerY + radius * Math.sin(angle);
             
             return (
               <motion.div 
                 key={step.id}
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                 className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-30"
                 style={{ left: x, top: y }}
               >
                 <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center text-white border-[6px] md:border-[12px] border-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2"
                      style={{ backgroundColor: idx % 2 === 0 ? NOVA_VIA_BRAND.primary : accent }}>
                    <IconRenderer name={step.iconName} size={28} className="md:w-10 md:h-10" />
                 </div>

                 <div className="mt-4 mb-2 px-4 py-1 border border-[#2E3B4A10] bg-white/95 backdrop-blur-md text-[9px] md:text-[11px] font-bold tracking-[0.3em] text-[#818181] uppercase shadow-sm font-heading">
                   Stage {step.number}
                 </div>

                 <div className="bg-white px-8 py-6 shadow-2xl text-center min-w-[180px] md:min-w-[280px] transition-all duration-500 group-hover:shadow-[0_40px_60px_-15px_rgba(26,38,51,0.15)] border-b-4" 
                      style={{ borderRadius: getRadius(), borderBottomColor: idx % 2 === 0 ? NOVA_VIA_BRAND.primary : accent }}>
                    <h4 className="text-sm md:text-xl font-bold tracking-tight leading-tight font-heading uppercase" style={{ color: NOVA_VIA_BRAND.text }}>
                      {step.title}
                    </h4>
                 </div>
               </motion.div>
             );
           })}
           
           <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 pointer-events-none opacity-[0.05] flex items-center justify-center">
             <LucideIcons.Sparkles size={svgSize * 0.25} style={{ color: NOVA_VIA_BRAND.primary }} />
           </div>
        </div>
      </div>
    );
  };

  const renderMultiColumn = () => {
    return (
      <div className="w-full max-w-7xl p-10 md:p-24 border border-white shadow-2xl mx-auto" style={{ borderRadius: getRadius(), backgroundColor: bg }}>
        <header className="mb-20 text-center">
          <h2 className="text-4xl md:text-6xl font-normal font-elegant" style={{ color: NOVA_VIA_BRAND.text }}>{title}</h2>
          {subtitle && <p className="text-[#818181] mt-6 text-xl font-body italic">{subtitle}</p>}
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
          {steps.map((step, idx) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="bg-white p-10 flex flex-col items-center text-center group hover:-translate-y-4 transition-transform duration-500 shadow-2xl border-t-8"
              style={{ borderRadius: getRadius(), borderTopColor: idx % 2 === 0 ? NOVA_VIA_BRAND.primary : accent }}
            >
              <div 
                className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center shadow-2xl mb-8 relative overflow-hidden"
                style={{ 
                  backgroundColor: NOVA_VIA_BRAND.primary,
                  color: '#fff',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <IconRenderer name={step.iconName} size={40} className="md:w-12 md:h-12" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] md:text-[11px] font-bold text-[#818181] uppercase tracking-[0.4em] mb-4 block font-heading">Section {step.number}</span>
                <h3 className="text-xl md:text-2xl font-bold mb-6 font-heading uppercase tracking-tight" style={{ color: NOVA_VIA_BRAND.text }}>{step.title}</h3>
                <p className="text-sm md:text-base text-[#2E3B4A] leading-relaxed font-body opacity-70">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  switch (layout) {
    case 'horizontal-steps': return renderHorizontal();
    case 'radial-process': return renderRadial();
    case 'timeline-flow': return renderTimeline();
    case 'circular-progress': return renderCircularProgress();
    case 'multi-column': return renderMultiColumn();
    case 'vertical-cards':
    default: return renderVertical();
  }
};

export default InfographicRenderer;
