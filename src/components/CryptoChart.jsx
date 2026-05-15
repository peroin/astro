import React, { useEffect, useRef, useState } from 'react';

const CryptoChart = () => {
  const container = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Membersihkan container sebelum render ulang untuk mencegah duplikasi widget
    if (container.current) {
      container.current.innerHTML = '';
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true, // Sangat penting agar chart memenuhi div induk
      "symbol": "BINANCE:BTCUSDT",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "hide_top_toolbar": false,
      "allow_symbol_change": true,
      "save_image": false,
      "calendar": false,
      "hide_volume": true,
      "support_host": "https://www.tradingview.com",
      "backgroundColor": "#05070a", // Warna latar belakang ChainPulse
      "gridColor": "rgba(255, 255, 255, 0.03)",
      "container_id": "tradingview_chart_widget_full"
    });

    const timer = setTimeout(() => setLoading(false), 1200);

    if (container.current) {
      container.current.appendChild(script);
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full bg-[#080a0f] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
      
      {/* HEADER - Tetap tipis agar ruang chart maksimal */}
      <div className="flex-none px-6 py-4 border-b border-white/5 flex justify-between items-center bg-[#080a0f]">
        <div className="flex items-center gap-3">
            <div className="h-4 w-[2px] bg-cyan-500"></div>
            <div className="flex flex-col">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.15em] font-sans">Market Terminal</h3>
              <span className="text-[8px] text-cyan-500 font-bold uppercase tracking-[0.2em] font-mono italic">Real-Time Engine</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
            </span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono">Live</span>
        </div>
      </div>

      {/* CHART CONTAINER - Tanpa padding agar chart menyentuh tepi kontainer */}
      <div className="relative flex-grow w-full overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#05070a]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className="text-[8px] font-black text-cyan-500 uppercase tracking-[0.3em] animate-pulse font-mono">Syncing Terminal...</p>
            </div>
          </div>
        )}
        
        {/* Container ini HARUS h-full dan w-full untuk TradingView autosize */}
        <div 
          id="tradingview_chart_widget_full"
          className="tradingview-widget-container h-full w-full" 
          ref={container}
        >
          {/* Widget TradingView akan mengisi 100% area ini */}
        </div>
      </div>

      {/* FOOTER STATS - Minimalis */}
      <div className="flex-none px-6 py-2 bg-white/[0.01] border-t border-white/5 flex justify-end gap-4">
          <div className="flex items-center gap-1.5">
              <span className="text-[7px] text-slate-600 font-bold uppercase tracking-widest">Protocol</span>
              <span className="text-[9px] text-slate-500 font-mono">WSS</span>
          </div>
          <div className="flex items-center gap-1.5">
              <span className="text-[7px] text-slate-600 font-bold uppercase tracking-widest">Feed</span>
              <span className="text-[9px] text-slate-500 font-mono">TV-SDK</span>
          </div>
      </div>
    </div>
  );
};

export default CryptoChart;