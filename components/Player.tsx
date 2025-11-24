import React from 'react';
import { CharacterId } from '../types';

interface PlayerProps {
  skin: CharacterId;
  isSpeedBoostActive?: boolean;
  isCatching?: boolean;
  className?: string;
}

export const Player: React.FC<PlayerProps> = ({ skin, isSpeedBoostActive, isCatching, className }) => {
  const commonClasses = isSpeedBoostActive 
    ? 'filter drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]' 
    : 'filter drop-shadow-xl';

  const finalClassName = `relative ${className ?? 'w-full h-full'} ${commonClasses} ${isCatching ? 'catching' : ''}`;

  const renderSkin = () => {
    switch (skin) {
      case 'alien':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
            {/* Legs (Tentacles) */}
            <g className="leg-left" style={{ transformOrigin: '40px 100px' }}>
              <path d="M40,100 Q30,110 35,120" stroke="#84cc16" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
            <g className="leg-right" style={{ transformOrigin: '60px 100px' }}>
              <path d="M60,100 Q70,110 65,120" stroke="#84cc16" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
            
            <g className="character-body">
               {/* Body */}
               <ellipse cx="50" cy="80" rx="15" ry="25" fill="#a3e635" />
               {/* Head (Glass Dome) */}
               <path d="M30,55 A20,25 0 0 1 70,55" fill="#e0f2fe" opacity="0.6" stroke="#bae6fd" strokeWidth="1" />
               {/* Head (Alien) */}
               <circle cx="50" cy="55" r="12" fill="#84cc16" />
               <ellipse cx="45" cy="52" rx="3" ry="5" fill="#000" transform="rotate(-15, 45, 52)" />
               <ellipse cx="55" cy="52" rx="3" ry="5" fill="#000" transform="rotate(15, 55, 52)" />
               
               {/* Antenna */}
               <path d="M50,43 L50,30" stroke="#84cc16" strokeWidth="2" />
               <circle cx="50" cy="28" r="3" fill="#facc15" className={isSpeedBoostActive ? "animate-pulse" : ""} />

               {/* Container: Cosmic Funnel */}
               <g className="container-part" style={{ transformOrigin: '50px 20px' }}>
                  <path d="M15,10 L85,10 L55,40 L45,40 Z" fill="#6366f1" stroke="#4338ca" strokeWidth="2" opacity="0.9" />
                  <ellipse cx="50" cy="10" rx="35" ry="5" fill="#818cf8" opacity="0.5" />
                  {/* Energy Beam */}
                  <path d="M15,10 L45,40 L55,40 L85,10" fill="none" stroke="#a5b4fc" strokeWidth="1" />
                  {/* Handle */}
                  <path d="M55,40 L65,70" stroke="#84cc16" strokeWidth="4" strokeLinecap="round" />
                  <path d="M45,40 L35,70" stroke="#84cc16" strokeWidth="4" strokeLinecap="round" />
               </g>
            </g>
          </svg>
        );

      case 'dog':
        return (
           <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
            {/* Legs */}
            <g className="leg-left" style={{ transformOrigin: '40px 100px' }}>
              <rect x="35" y="95" width="10" height="20" rx="5" fill="#eab308" />
            </g>
            <g className="leg-right" style={{ transformOrigin: '60px 100px' }}>
              <rect x="55" y="95" width="10" height="20" rx="5" fill="#eab308" />
            </g>

            <g className="character-body">
              {/* Tail */}
              <path d="M65,90 Q80,80 75,70" stroke="#eab308" strokeWidth="6" strokeLinecap="round" fill="none" className="animate-pulse" />
              
              {/* Body */}
              <rect x="35" y="60" width="30" height="40" rx="10" fill="#facc15" />
              <path d="M45,70 L55,70" stroke="#ca8a04" strokeWidth="2" opacity="0.5" />

              {/* Head */}
              <circle cx="50" cy="50" r="22" fill="#facc15" />
              
              {/* Ears */}
              <path d="M30,40 Q20,60 30,70" fill="#eab308" />
              <path d="M70,40 Q80,60 70,70" fill="#eab308" />

              {/* Face */}
              <circle cx="42" cy="45" r="3" fill="#333" />
              <circle cx="58" cy="45" r="3" fill="#333" />
              <ellipse cx="50" cy="52" rx="4" ry="3" fill="#333" /> {/* Nose */}
              <path d="M50,55 L50,60" stroke="#333" strokeWidth="1" />
              
              {/* Container: Dog Bowl on Head */}
              <g className="container-part" style={{ transformOrigin: '50px 25px' }}>
                 <path d="M20,10 L80,10 L70,35 L30,35 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
                 <text x="50" y="30" fontSize="10" textAnchor="middle" fill="white" fontWeight="bold">DOG</text>
                 <ellipse cx="50" cy="10" rx="30" ry="3" fill="#fca5a5" opacity="0.3" />
              </g>
              
              {/* Paws holding logic is tricky with head bowl, let's say he balances it */}
              <path d="M35,65 L30,50" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
              <path d="M65,65 L70,50" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
            </g>
           </svg>
        );

      case 'robot':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
            {/* Legs */}
            <g className="leg-left" style={{ transformOrigin: '35px 95px' }}>
              <rect x="30" y="90" width="10" height="25" fill="#64748b" rx="2" />
              <rect x="28" y="115" width="14" height="5" fill="#334155" />
            </g>
            <g className="leg-right" style={{ transformOrigin: '65px 95px' }}>
              <rect x="60" y="90" width="10" height="25" fill="#64748b" rx="2" />
              <rect x="58" y="115" width="14" height="5" fill="#334155" />
            </g>
            
            <g className="character-body">
              {/* Box Body */}
              <rect x="25" y="50" width="50" height="45" fill="#94a3b8" rx="4" stroke="#475569" strokeWidth="2" />
              <rect x="35" y="60" width="30" height="25" fill="#bfdbfe" opacity="0.5" />
              
              {/* Head */}
              <rect x="35" y="30" width="30" height="25" fill="#cbd5e1" rx="4" stroke="#475569" strokeWidth="2" />
              <circle cx="45" cy="40" r="3" fill="#ef4444" className={isSpeedBoostActive ? "animate-ping" : ""} />
              <circle cx="55" cy="40" r="3" fill="#ef4444" className={isSpeedBoostActive ? "animate-ping" : ""} />
              <rect x="42" y="48" width="16" height="2" fill="#333" />
              
              {/* Antenna */}
              <line x1="50" y1="30" x2="50" y2="20" stroke="#475569" strokeWidth="2" />
              <circle cx="50" cy="18" r="3" fill="#facc15" />

              {/* Container: Metal Hopper */}
              <g className="container-part" style={{ transformOrigin: '50px 30px' }}>
                <path d="M15,15 L85,15 L75,40 L25,40 Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
                <line x1="15" y1="15" x2="25" y2="55" stroke="#94a3b8" strokeWidth="3" />
                <line x1="85" y1="15" x2="75" y2="55" stroke="#94a3b8" strokeWidth="3" />
                <ellipse cx="50" cy="15" rx="35" ry="5" fill="#475569" opacity="0.3" />
              </g>
            </g>
          </svg>
        );

      case 'cat':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
            {/* Legs */}
            <g className="leg-left" style={{ transformOrigin: '40px 95px' }}>
              <path d="M40,90 L40,115 L35,115" stroke="#f97316" strokeWidth="8" strokeLinecap="round" fill="none" />
            </g>
            <g className="leg-right" style={{ transformOrigin: '60px 95px' }}>
              <path d="M60,90 L60,115 L65,115" stroke="#f97316" strokeWidth="8" strokeLinecap="round" fill="none" />
            </g>

            <g className="character-body">
              {/* Tail */}
              <path d="M70,80 Q90,70 85,50" stroke="#f97316" strokeWidth="6" strokeLinecap="round" fill="none" className="animate-pulse" />

              {/* Body */}
              <ellipse cx="50" cy="70" rx="20" ry="25" fill="#fb923c" />
              <ellipse cx="50" cy="70" rx="12" ry="18" fill="#fdba74" />

              {/* Head */}
              <circle cx="50" cy="45" r="18" fill="#fb923c" />
              {/* Ears */}
              <path d="M35,35 L32,20 L45,32 Z" fill="#fb923c" />
              <path d="M65,35 L68,20 L55,32 Z" fill="#fb923c" />
              
              {/* Face */}
              <circle cx="44" cy="42" r="2" fill="#333" />
              <circle cx="56" cy="42" r="2" fill="#333" />
              <path d="M48,48 L50,50 L52,48" stroke="#333" strokeWidth="1.5" fill="none" />
              <line x1="35" y1="45" x2="42" y2="46" stroke="#333" strokeWidth="0.5" />
              <line x1="65" y1="45" x2="58" y2="46" stroke="#333" strokeWidth="0.5" />

              {/* Container: Fish Net */}
              <g className="container-part" style={{ transformOrigin: '50px 30px' }}>
                 <path d="M20,20 Q50,5 80,20 L75,50 Q50,60 25,50 Z" fill="#22d3ee" stroke="#0891b2" strokeWidth="2" opacity="0.8" />
                 <path d="M25,50 L25,20" stroke="#0891b2" strokeWidth="1" />
                 <path d="M75,50 L75,20" stroke="#0891b2" strokeWidth="1" />
              </g>
              {/* Arms */}
              <path d="M35,60 L25,45" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
              <path d="M65,60 L75,45" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'girl':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
            {/* Legs */}
            <g className="leg-left" style={{ transformOrigin: '40px 90px' }}>
              <path d="M40,90 L40,115" stroke="#fbcfe8" strokeWidth="8" strokeLinecap="round" />
              <path d="M40,115 L35,115" stroke="#db2777" strokeWidth="8" strokeLinecap="round" />
            </g>
            <g className="leg-right" style={{ transformOrigin: '60px 90px' }}>
              <path d="M60,90 L60,115" stroke="#fbcfe8" strokeWidth="8" strokeLinecap="round" />
              <path d="M60,115 L65,115" stroke="#db2777" strokeWidth="8" strokeLinecap="round" />
            </g>

            <g className="character-body">
              {/* Hair (Back) */}
              <circle cx="35" cy="45" r="12" fill="#3b0764" />
              <circle cx="65" cy="45" r="12" fill="#3b0764" />

              {/* Dress */}
              <path d="M35,60 L65,60 L75,95 L25,95 Z" fill="#ec4899" />
              
              {/* Head */}
              <circle cx="50" cy="40" r="14" fill="#fce7f3" />
              {/* Hair (Front) */}
              <path d="M36,30 Q50,45 64,30 L64,25 Q50,15 36,25 Z" fill="#3b0764" />

              {/* Face */}
              <circle cx="45" cy="40" r="1.5" fill="#333" />
              <circle cx="55" cy="40" r="1.5" fill="#333" />
              <path d="M48,46 Q50,48 52,46" stroke="#333" strokeWidth="1" fill="none" />

              {/* Container: Wicker Basket */}
              <g className="container-part" style={{ transformOrigin: '50px 25px' }}>
                  <path d="M20,15 L80,15 L70,45 L30,45 Z" fill="#d97706" stroke="#92400e" strokeWidth="2" />
                  <path d="M20,15 Q50,-10 80,15" stroke="#92400e" strokeWidth="4" fill="none" />
              </g>
              {/* Arms */}
              <path d="M38,65 L28,45" stroke="#fce7f3" strokeWidth="4" strokeLinecap="round" />
              <path d="M62,65 L72,45" stroke="#fce7f3" strokeWidth="4" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'boy':
      default:
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
            {/* Legs */}
            <g className="leg-left" style={{ transformOrigin: '40px 90px' }}>
              <path d="M40,90 L40,115" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
              <path d="M40,115 L35,115" stroke="#000" strokeWidth="8" strokeLinecap="round" />
            </g>
            <g className="leg-right" style={{ transformOrigin: '60px 90px' }}>
              <path d="M60,90 L60,115" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
              <path d="M60,115 L65,115" stroke="#000" strokeWidth="8" strokeLinecap="round" />
            </g>

            <g className="character-body">
              {/* Body (Hoodie) */}
              <rect x="35" y="55" width="30" height="40" fill="#3b82f6" rx="5" />
              <path d="M35,55 L25,75" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
              <path d="M65,55 L75,75" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />

              {/* Head */}
              <circle cx="50" cy="40" r="13" fill="#ffedd5" />
              
              {/* Cap */}
              <path d="M35,35 Q50,20 65,35 L65,38 L35,38 Z" fill="#dc2626" />
              <rect x="35" y="35" width="40" height="4" fill="#dc2626" />

              {/* Face */}
              <circle cx="46" cy="42" r="1.5" fill="#333" />
              <circle cx="54" cy="42" r="1.5" fill="#333" />
              <path d="M48,48 Q50,50 52,48" stroke="#333" strokeWidth="1" fill="none" />

              {/* Container: Sack */}
              <g className="container-part" style={{ transformOrigin: '50px 20px' }}>
                 <path d="M15,10 Q50,15 85,10 L80,45 Q50,55 20,45 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
                 <ellipse cx="50" cy="10" rx="35" ry="5" fill="#ca8a04" opacity="0.3" />
              </g>
              
              {/* Hands holding sack */}
              <circle cx="25" cy="40" r="4" fill="#ffedd5" />
              <circle cx="75" cy="40" r="4" fill="#ffedd5" />
            </g>
          </svg>
        );
    }
  };

  return (
    <div className={finalClassName}>
      {renderSkin()}
    </div>
  );
};