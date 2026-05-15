import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TVLChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTvl, setCurrentTvl] = useState(0);

  useEffect(() => {
    const fetchTVL = async () => {
      try {
        // Mengambil data TVL historis global dari DeFiLlama
        const response = await fetch('https://api.llama.fi/charts');
        const json = await response.json();
        
        // Memformat data: mengambil 30 data terakhir (bulan terakhir)
        const formattedData = json.slice(-30).map(item => ({
          date: new Date(item.date * 1000).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
          tvl: item.totalLiquidityUSD
        }));

        setData(formattedData);
        setCurrentTvl(formattedData[formattedData.length - 1].tvl);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching TVL data:", error);
        setLoading(false);
      }
    };

    fetchTVL();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#080a0f] border border-white/5 rounded-3xl">
        <div className="animate-pulse text-cyan-500 font-mono text-[10px] uppercase tracking-widest">
          Loading Live Data...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#080a0f] border border-white/5 rounded-3xl p-5 flex flex-col justify-between overflow-hidden relative">
      {/* Header Info */}
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest">Global DeFi TVL (Live)</p>
        </div>
        <h4 className="text-3xl font-black font-sans tracking-tighter text-white mt-1">
          ${(currentTvl / 1e9).toFixed(2)}B
        </h4>
      </div>

      {/* Live Chart */}
      <div className="h-[180px] w-full mt-4 -ml-4">
        <ResponsiveContainer width="110%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#475569" 
              fontSize={8} 
              tickLine={false} 
              axisLine={false}
              interval={5} 
            />
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #1e293b', 
                borderRadius: '8px', 
                fontSize: '10px' 
              }}
              formatter={(value) => [`$${(value / 1e9).toFixed(2)}B`, 'TVL']}
              labelStyle={{ color: '#64748b' }}
            />
            <Area 
              type="monotone" 
              dataKey="tvl" 
              stroke="#06b6d4" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#tvlGradient)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center mt-2 opacity-50">
        <p className="text-[8px] text-slate-500 uppercase font-bold">Source: DeFiLlama API</p>
        <p className="text-[8px] text-cyan-500 uppercase font-bold">Last 30 Days</p>
      </div>
    </div>
  );
}