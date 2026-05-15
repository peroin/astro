import React, { useEffect, useState } from 'react';

const RWALiveTable = () => {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);

  // Daftar Slug Protokol RWA di DefiLlama (Contoh: Ondo, Mountain Protocol, Toucan, dll)
  const rwaSlugs = ['ondo-finance', 'pax-gold', 'hashnote', 'mountain-protocol', 'tangible'];

  const fetchRWAData = async () => {
    try {
      // Mengambil data global dari DefiLlama
      const response = await fetch('https://api.llama.fi/protocols');
      const allProtocols = await response.json();

      // Filter hanya untuk protokol yang masuk kategori RWA
      const rwaData = allProtocols
        .filter(p => rwaSlugs.includes(p.slug) || p.category === 'RWA')
        .sort((a, b) => b.tvl - a.tvl) // Urutkan berdasarkan TVL tertinggi
        .slice(0, 8); // Ambil 8 teratas

      setProtocols(rwaData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching RWA data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRWAData();
  }, []);

  if (loading) return <div className="p-10 text-center text-cyan-500 font-mono animate-pulse">SYNCING ON-CHAIN RESERVES...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm font-sans min-w-[700px]">
        <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-mono">
          <tr>
            <th className="px-6 py-4">Protocol</th>
            <th className="px-6 py-4">Asset Class</th>
            <th className="px-6 py-4">TVL (Live)</th>
            <th className="px-6 py-4">Chain</th>
            <th className="px-6 py-4 text-right">Proof</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {protocols.map((p) => (
            <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4 flex items-center gap-3">
                <img src={p.logo} alt="" className="w-6 h-6 rounded-full" />
                <span className="font-bold text-white">{p.name}</span>
              </td>
              <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                {p.category || 'Real World Assets'}
              </td>
              <td className="px-6 py-4 font-bold text-emerald-400">
                ${p.tvl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-1">
                  {p.chains.slice(0, 2).map(chain => (
                    <span key={chain} className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">{chain}</span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`https://defillama.com/protocol/${p.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-500 font-mono text-[10px] font-black hover:text-white transition-colors flex items-center justify-end gap-1 group-hover:translate-x-1 duration-300"
                >
                  VIEW DATA ↗
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RWALiveTable;