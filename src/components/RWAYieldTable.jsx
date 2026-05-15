// src/components/RWAYieldTable.jsx
import React from 'react';

const yieldData = [
  { protocol: 'Ondo Finance', asset: 'USDY', network: 'Solana', apy: '5.10%', risk: 'Low' },
  { protocol: 'Mountain Protocol', asset: 'USDM', network: 'Base', apy: '5.00%', risk: 'Medium' },
  { protocol: 'Centrifuge', asset: 'Anemoy', network: 'Ethereum', apy: '7.25%', risk: 'High' },
  { protocol: 'Maple Finance', asset: 'Cash Mgmt', network: 'Solana', apy: '4.85%', risk: 'Low' },
];

export default function RWAYieldTable() {
  return (
    <div className="w-full overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {yieldData.map((item, index) => (
          <div 
            key={index} 
            className="p-6 rounded-3xl bg-[#05070a] border border-white/5 hover:border-cyan-500/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 text-white/[0.02] font-black text-6xl italic group-hover:text-cyan-500/[0.05] transition-colors">
                {index + 1}
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-1">{item.network}</p>
                        <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors font-sans">{item.protocol}</h4>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-1 rounded bg-white/5 text-slate-400 uppercase font-mono tracking-tighter">
                        {item.risk} Risk
                    </span>
                </div>
                
                <div className="flex items-end justify-between mt-8">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase font-mono">Current APY</p>
                        <p className="text-3xl font-black text-white tracking-tighter">{item.apy}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase font-mono italic">Asset</p>
                        <p className="text-sm font-bold text-cyan-500 uppercase">{item.asset}</p>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}