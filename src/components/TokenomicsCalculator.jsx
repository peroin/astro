import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Wallet, Calendar, Info } from 'lucide-react';

const TokenomicsCalculator = () => {
  // States
  const [principal, setPrincipal] = useState(1000);
  const [years, setYears] = useState(5);
  const [apy, setApy] = useState(12);
  const [isCompounding, setIsCompounding] = useState(true);
  const [marketScenario, setMarketScenario] = useState('moderate');

  // Logika Simulasi Proyeksi
  const data = useMemo(() => {
    let results = [];
    let currentBalance = principal;
    const marketGrowth = {
      conservative: 0,
      moderate: 0.08,
      aggressive: 0.25
    };

    for (let i = 0; i <= years; i++) {
      if (i === 0) {
        results.push({ year: 'Start', balance: principal });
        continue;
      }
      
      if (isCompounding) {
        currentBalance = currentBalance * (1 + (apy / 100));
      } else {
        currentBalance = principal + (principal * (apy / 100) * i);
      }

      const appreciationFactor = 1 + marketGrowth[marketScenario];
      currentBalance = currentBalance * appreciationFactor;

      results.push({
        year: `Y${i}`,
        balance: Math.round(currentBalance),
      });
    }
    return results;
  }, [principal, years, apy, isCompounding, marketScenario]);

  const finalBalance = data[data.length - 1].balance;
  const tradFiComparison = principal * Math.pow(1 + 0.04, years);

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-1 bg-transparent text-slate-900 font-sans">
      
      {/* KIRI: Input Controls (Compact Height) */}
      <div className="w-full lg:w-2/5 space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        {/* Investment Input */}
        <div>
          <div className="flex items-center gap-2 mb-1 text-slate-500">
            <Wallet size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Investment</h3>
          </div>
          <input 
            type="range" min="100" max="100000" step="100"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#990000]"
          />
          <div className="mt-1 font-mono font-bold text-lg">${principal.toLocaleString()}</div>
        </div>

        {/* Years Input */}
        <div>
          <div className="flex items-center gap-2 mb-1 text-slate-500">
            <Calendar size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Duration</h3>
          </div>
          <input 
            type="range" min="1" max="10" step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#990000]"
          />
          <div className="font-mono font-bold text-lg mt-1">{years} Years</div>
        </div>

        {/* APY Input - FIXED VISIBILITY */}
        <div>
          <div className="flex items-center gap-2 mb-1 text-[#990000]">
            <TrendingUp size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Target APY %</h3>
          </div>
          <input 
            type="number" 
            value={apy}
            onChange={(e) => setApy(Number(e.target.value))}
            className="w-full bg-slate-100 border-b-2 border-slate-300 py-1 px-2 text-xl font-bold font-mono text-slate-900 focus:outline-none focus:border-[#990000] transition-colors"
          />
        </div>

        {/* Compound Toggle */}
        <div className="pt-2 border-t border-slate-200 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[11px] font-bold text-slate-500">Compound Interest</span>
            <div className="relative">
              <input type="checkbox" checked={isCompounding} onChange={() => setIsCompounding(!isCompounding)} className="sr-only" />
              <div className={`w-10 h-5 rounded-full transition-colors ${isCompounding ? 'bg-[#990000]' : 'bg-slate-300'}`}></div>
              <div className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform ${isCompounding ? 'translate-x-5' : ''}`}></div>
            </div>
          </label>

          {/* Scenario Buttons */}
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Market Growth</span>
            <div className="grid grid-cols-3 gap-1">
              {['conservative', 'moderate', 'aggressive'].map((s) => (
                <button 
                  key={s}
                  onClick={() => setMarketScenario(s)}
                  className={`text-[9px] py-1.5 rounded font-black uppercase border transition-all ${marketScenario === s ? 'bg-[#990000] border-[#990000] text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                >
                  {s.slice(0, 4)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KANAN: Chart & Results (Shortened) */}
      <div className="w-full lg:w-3/5 flex flex-col gap-3">
        <div className="bg-slate-900 p-5 rounded-xl flex-grow min-h-[280px] flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#990000] italic">Projected Portfolio</p>
            <h4 className="text-3xl font-black font-sans tracking-tighter text-white mt-1">
              ${finalBalance.toLocaleString()}
            </h4>
          </div>

          <div className="h-[160px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#990000" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#990000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="year" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#990000" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TradFi Comparison Box (Compact) */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">TradFi Bank (4%)</p>
            <p className="text-lg font-bold text-slate-600 font-mono">${Math.round(tradFiComparison).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-green-600 uppercase italic">Digital Advantage</p>
            <p className="text-xl font-black text-slate-900 font-mono">+{Math.round((finalBalance/tradFiComparison - 1) * 100)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenomicsCalculator;