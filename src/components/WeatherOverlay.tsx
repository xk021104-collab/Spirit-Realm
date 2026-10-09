import React from 'react';
import { BattleWeather } from '../types/game';

interface WeatherOverlayProps {
  weather: BattleWeather;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ weather }) => {
  if (weather === 'CLEAR') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-30">
        <div className="absolute top-10 left-1/4 w-2 h-2 rounded-full bg-emerald-300 blur-xs animate-ping" />
        <div className="absolute top-20 right-1/3 w-2.5 h-2.5 rounded-full bg-amber-200 blur-xs animate-pulse" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {/* 1. SUNNY: Blazing Sunbeams & Warm Heatwave Overlay */}
      {weather === 'SUNNY' && (
        <>
          {/* Top-Right Golden Solar Flare */}
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-br from-amber-300/40 via-yellow-500/25 to-transparent blur-2xl animate-pulse pointer-events-none" />
          
          {/* Diagonal Solar Rays SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-35" preserveAspectRatio="none">
            <polygon points="1000,0 750,500 850,500 1000,0" fill="url(#sunray-grad)" />
            <polygon points="900,0 550,500 660,500 950,0" fill="url(#sunray-grad)" />
            <polygon points="750,0 350,500 440,500 800,0" fill="url(#sunray-grad)" />
            <polygon points="600,0 150,500 230,500 650,0" fill="url(#sunray-grad)" />
            <defs>
              <linearGradient id="sunray-grad" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating Warm Heat Particles */}
          <div className="absolute bottom-1/3 left-1/4 w-3 h-3 rounded-full bg-amber-400 blur-xs animate-bounce" />
          <div className="absolute bottom-1/2 right-1/4 w-2 h-2 rounded-full bg-yellow-300 blur-xs animate-ping" />
        </>
      )}

      {/* 2. RAIN: Diagonal Falling Rain Lines & Water Splash Ripples */}
      {weather === 'RAIN' && (
        <>
          <div className="absolute inset-0 bg-blue-950/25 pointer-events-none backdrop-blur-[0.5px]" />
          
          {/* Rain lines container with CSS animation */}
          <svg className="absolute inset-0 w-full h-full opacity-65" preserveAspectRatio="none">
            {/* Multiple Rain Streaks */}
            {[...Array(24)].map((_, i) => {
              const x1 = (i * 45) % 1000;
              const y1 = (i * 28) % 250;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x1 - 40}
                  y2={y1 + 180}
                  stroke="#38bdf8"
                  strokeWidth={i % 3 === 0 ? '2' : '1.2'}
                  strokeOpacity={0.4 + (i % 5) * 0.12}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Ground Splash Ripples at base */}
          <div className="absolute bottom-12 left-1/4 w-12 h-4 rounded-full border border-cyan-400/50 animate-ping" />
          <div className="absolute bottom-16 right-1/3 w-16 h-5 rounded-full border border-sky-400/40 animate-ping" style={{ animationDelay: '0.4s' }} />
          <div className="absolute bottom-10 right-1/4 w-10 h-3 rounded-full border border-cyan-300/40 animate-ping" style={{ animationDelay: '0.8s' }} />
        </>
      )}

      {/* 3. SANDSTORM: Whirling Ochre Dust & Sand Streams */}
      {weather === 'SANDSTORM' && (
        <>
          <div className="absolute inset-0 bg-amber-950/30 pointer-events-none" />
          
          <svg className="absolute inset-0 w-full h-full opacity-55" preserveAspectRatio="none">
            {/* Sand Wind Gust Paths */}
            <path d="M -50 120 Q 250 80 500 130 T 1050 90" stroke="#f59e0b" strokeWidth="3" fill="none" opacity="0.6" strokeDasharray="25 15" />
            <path d="M -50 240 Q 300 200 650 250 T 1050 210" stroke="#d97706" strokeWidth="4" fill="none" opacity="0.5" strokeDasharray="35 20" />
            <path d="M -50 360 Q 200 320 550 370 T 1050 330" stroke="#fbbf24" strokeWidth="2.5" fill="none" opacity="0.7" strokeDasharray="20 12" />
            <path d="M -50 440 Q 350 400 700 450 T 1050 420" stroke="#ca8a04" strokeWidth="3" fill="none" opacity="0.5" strokeDasharray="30 18" />

            {/* Airborne Sand Grains */}
            {[...Array(20)].map((_, i) => (
              <circle
                key={i}
                cx={(i * 55 + 20) % 980}
                cy={(i * 35 + 40) % 480}
                r={1.5 + (i % 3)}
                fill="#fde047"
                opacity={0.6 + (i % 4) * 0.1}
              />
            ))}
          </svg>
        </>
      )}

      {/* 4. THUNDER: Purple-Gold Tempest Clouds & Ambient Electric Lightning */}
      {weather === 'THUNDER' && (
        <>
          <div className="absolute inset-0 bg-purple-950/30 pointer-events-none animate-pulse" />
          
          {/* Lightning arcs in sky */}
          <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none">
            {/* Upper Lightning Bolt */}
            <polyline
              points="480,0 470,60 495,110 480,160 510,210 490,260"
              stroke="#facc15"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_rgba(250,204,21,0.9)] animate-pulse"
            />
            {/* Distant Branching Arcs */}
            <polyline
              points="280,0 290,40 275,80 300,120"
              stroke="#c084fc"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
            <polyline
              points="750,0 735,50 760,95 745,140"
              stroke="#a855f7"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>

          {/* Electric sparks on ground */}
          <div className="absolute bottom-20 left-1/3 w-3 h-3 rounded-full bg-yellow-300 blur-xs animate-ping" />
          <div className="absolute bottom-24 right-1/3 w-3 h-3 rounded-full bg-purple-400 blur-xs animate-ping" style={{ animationDelay: '0.3s' }} />
        </>
      )}
    </div>
  );
};
