import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const CryptoBentoGrid = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const fetchCoinData = async () => {
    try {
      // Mengambil 10 koin teratas berdasarkan market cap
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h'
      );
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCoins(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("CoinGecko Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchCoinData();

    // Polling setiap 60 detik agar tidak terkena rate limit API gratis
    const interval = setInterval(fetchCoinData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted || loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/5"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {coins.map((coin) => {
        const isUp = coin.price_change_percentage_24h >= 0;
        
        // Memformat data sparkline dari CoinGecko
        const chartData = coin.sparkline_in_7d.price.map((p, index) => ({
          price: p,
          index
        }));

        return (
          <div key={coin.id} className="bg-[#0d1017] border border-white/5 p-4 rounded-2xl hover:border-cyan-500/50 transition-all group duration-500 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase">
                    {coin.symbol}
                  </span>
                </div>
                <span className={`text-[10px] font-bold font-mono ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
              
              <div className="text-base font-bold text-white mb-4 font-mono tracking-tighter">
                ${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* 
                PERBAIKAN: 
                1. Memberikan min-height pada div pembungkus (h-12 = 48px).
                2. Menambahkan properti minHeight pada ResponsiveContainer.
            */}
            <div className="h-12 w-full mt-auto overflow-hidden">
              <ResponsiveContainer width="100%" height="100%" minHeight={48}>
                <LineChart data={chartData}>
                  <YAxis domain={['auto', 'auto']} hide />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={isUp ? '#10b981' : '#f43f5e'} 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CryptoBentoGrid;