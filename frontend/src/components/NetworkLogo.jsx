import React from 'react';

export default function NetworkLogo({ network, className = "w-10 h-10" }) {
  const net = String(network).toLowerCase();
  
  if (net === 'mtn') {
    return (
      <div className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-[#FFCC00] shadow-md border border-yellow-400/20 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          <circle cx="50" cy="50" r="48" fill="#FFCC00" stroke="#002D62" strokeWidth="4"/>
          <ellipse cx="50" cy="50" rx="36" ry="24" fill="#002D62"/>
          <text x="50" y="56" fill="#FFCC00" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">MTN</text>
        </svg>
      </div>
    );
  }
  
  if (net === 'airtel') {
    return (
      <div className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-[#E11900] shadow-md border border-red-500/20 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full p-1.5">
          <circle cx="50" cy="50" r="48" fill="#E11900"/>
          <text x="50" y="64" fill="#FFFFFF" fontSize="56" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">a</text>
        </svg>
      </div>
    );
  }
  
  if (net === 'glo') {
    return (
      <div className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-[#2EAD5C] shadow-md border border-emerald-500/20 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          <circle cx="50" cy="50" r="48" fill="#2EAD5C"/>
          <circle cx="50" cy="50" r="38" fill="none" stroke="#A3E635" strokeWidth="4" strokeDasharray="12 6"/>
          <text x="48" y="60" fill="#FFFFFF" fontSize="30" fontWeight="900" fontStyle="italic" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">glo</text>
        </svg>
      </div>
    );
  }
  
  if (net === '9mobile') {
    return (
      <div className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-[#0D3B23] shadow-md border border-teal-800/30 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full p-1">
          <circle cx="50" cy="50" r="48" fill="#0D3B23"/>
          <text x="44" y="64" fill="#9CD828" fontSize="48" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">9</text>
          <text x="68" y="60" fill="#FFFFFF" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">m</text>
        </svg>
      </div>
    );
  }
  
  // Generic fallback for custom / other networks
  return (
    <div className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs uppercase shadow-md ${className}`}>
      {String(network).slice(0, 3)}
    </div>
  );
}
