import React, { useState } from 'react';
import { SceneId } from '../types/game';

interface SceneBackgroundProps {
  sceneId: SceneId;
}

const SCENE_ILLUSTRATIONS: Record<SceneId, string> = {
  ACADEMY: '/assets/scenes/academy.jpg',
  PRAIRIE: '/assets/scenes/prairie.jpg',
  VOLCANO: '/assets/scenes/volcano.jpg',
  BAY: '/assets/scenes/bay.jpg',
  ARENA: '/assets/scenes/arena.jpg',
  HOSPITAL: '/assets/scenes/academy.jpg',
  SHOP: '/assets/scenes/academy.jpg',
};

export const SceneBackground: React.FC<SceneBackgroundProps> = ({ sceneId }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = !imgError ? SCENE_ILLUSTRATIONS[sceneId] || SCENE_ILLUSTRATIONS.ACADEMY : null;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-slate-950">
      {imageUrl ? (
        <div className="relative w-full h-full">
          {/* Main High-Definition Game Scene Illustration */}
          <img
            src={imageUrl}
            alt={sceneId}
            className="w-full h-full object-cover object-center transform scale-[1.02] transition-transform duration-1000 ease-out"
            onError={() => setImgError(true)}
          />

          {/* Roco Kingdom Classic Vignette & Atmospheric Sunbeams */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />

          {/* Magical Ambient Stardust Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              { left: '15%', top: '25%', delay: '0s', size: '4px' },
              { left: '35%', top: '45%', delay: '1.2s', size: '3px' },
              { left: '60%', top: '20%', delay: '0.8s', size: '5px' },
              { left: '78%', top: '60%', delay: '2.1s', size: '3px' },
              { left: '88%', top: '30%', delay: '1.5s', size: '4px' },
              { left: '25%', top: '75%', delay: '2.7s', size: '3px' },
              { left: '50%', top: '80%', delay: '0.5s', size: '4px' },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-amber-200/80 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  animationDelay: p.delay,
                  animationDuration: '3s',
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Fallback gradient if image not ready */
        <div className="absolute inset-0 bg-gradient-to-b from-[#060b1c] via-[#0b1536] to-[#040817]" />
      )}
    </div>
  );
};
