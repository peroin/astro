import React, { useEffect, useState, useRef } from 'react';

const LiveTicker = () => {
  const [coins, setCoins] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const prevPricesRef = useRef({});

  const fetchTickerData = async (signal) => {
    try {
      // Mengambil 20 koin teratas
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false',
        { signal }
      );

      if (!response.ok) return;

      const data = await response.json();
      if (Array.isArray(data)) {
        setCoins(data);
        
        const pricesObj = {};
        data.forEach(coin => { pricesObj[coin.id] = coin.current_price; });
        prevPricesRef.current = pricesObj;
      }
      setLoading(false);
    } catch (error) {
      if (error.name !== 'AbortError') console.error("API Error:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const controller = new AbortController();
    
    fetchTickerData(controller.signal);

    // Update API setiap 60 detik agar aman dari rate limit
    const apiInterval = setInterval(() => fetchTickerData(controller.signal), 60000);
    
    // Ganti pasangan koin setiap 5 detik
    const slideInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % 20);
    }, 5000);

    return () => {
      controller.abort();
      clearInterval(apiInterval);
      clearInterval(slideInterval);
    };
  }, []);

  if (!isMounted || (loading && coins.length === 0)) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-[10px] font-mono font-black text-cyan-500 animate-pulse tracking-[0.2em]">
          LOADING VIBRANT DATA FEED...
        </div>
      </div>
    );
  }

  const leftCoin = coins[currentIndex];
  const rightCoin = coins[(currentIndex + 1) % 20];

  const CoinSlot = ({ coin }) => {
    if (!coin) return null;
    const isUp = coin.price_change_percentage_24h >= 0;

    return (
      <div 
        key={coin.id} 
        className="flex items-center gap-4 md:gap-8 animate-score-fade w-1/2 justify-center border-x border-white/5"
      >
        <div className="flex items-center gap-3">
          {/* Gambar dengan warna asli (filter grayscale dihapus) */}
          <img 
            src={coin.image} 
            alt={coin.name} 
            className="w-6 h-6 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]" 
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-black text-white font-mono leading-none">
                {coin.symbol.toUpperCase()}
            </span>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter truncate max-w-[60px]">
                {coin.name}
            </span>
          </div>
          <span className="sm:hidden text-[10px] font-black text-white font-mono">
            {coin.symbol.toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm md:text-lg font-black font-mono text-white tracking-tight">
            ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </span>
        </div>

        <div className={`text-[9px] font-black font-mono px-2 py-0.5 rounded border ${
          isUp 
            ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' 
            : 'text-rose-400 bg-rose-400/10 border-rose-400/20'
        }`}>
          {isUp ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full flex items-center bg-[#05070a]/80 backdrop-blur-xl border-y border-white/5">
      <div className="flex w-full divide-x divide-white/10 py-3">
        <CoinSlot coin={leftCoin} />
        <CoinSlot coin={rightCoin} />
      </div>

      {/* Indikator Real-time */}
      <div className="absolute right-4 hidden lg:flex items-center gap-2">
        <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
        <span className="text-[7px] font-bold text-cyan-500/60 font-mono uppercase tracking-[0.4em]">
            Live RWA Feed
        </span>
      </div>
    </div>
  );
};

export default LiveTicker;