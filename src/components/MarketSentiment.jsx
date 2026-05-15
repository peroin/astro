import React, { useState, useEffect } from 'react';

const MarketSentiment = () => {
  const [data, setData] = useState({
    sentiment: 'Neutral',
    value: 50,
    change24h: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Mengambil data global crypto
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        const result = await response.json();
        
        // Logika sederhana: Menggunakan Market Cap Change 24h sebagai proksi sentimen
        const change = result.data.market_cap_change_percentage_24h_usd;
        let sentimentLabel = 'Neutral';
        let val = 50 + (change * 5); // Normalisasi ke skala 0-100

        if (change > 2) sentimentLabel = 'Bullish';
        else if (change > 5) sentimentLabel = 'Extreme Bull';
        else if (change < -2) sentimentLabel = 'Bearish';
        else if (change < -5) sentimentLabel = 'Extreme Fear';

        setData({
          sentiment: sentimentLabel,
          value: Math.min(Math.max(val, 10), 90), // Batasi antara 10-90
          change24h: change.toFixed(2)
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sentiment:", error);
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  if (loading) return <div className="h-24 animate-pulse bg-white/5 rounded-2xl"></div>;

  return (
    <div className="p-6 rounded-3xl bg-[#0d1017] border border-white/5 shadow-inner relative overflow-hidden">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-1 font-mono">Market Pulse</p>
          <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">{data.sentiment}</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase font-mono">24h Change</p>
          <p className={`font-bold ${parseFloat(data.change24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.change24h}%
          </p>
        </div>
      </div>

      {/* Meter Bar */}
      <div className="relative h-3 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-400 to-cyan-500 transition-all duration-1000 ease-out"
          style={{ width: `${data.value}%` }}
        ></div>
        {/* Glow Effect */}
        <div 
          className="absolute top-0 h-full w-4 bg-white/30 blur-sm shadow-[0_0_15px_white]"
          style={{ left: `calc(${data.value}% - 8px)` }}
        ></div>
      </div>

      <div className="flex justify-between mt-2 text-[8px] font-black uppercase tracking-widest text-slate-600 font-mono">
        <span>Fear</span>
        <span>Neutral</span>
        <span>Greed</span>
      </div>
    </div>
  );
};

export default MarketSentiment;