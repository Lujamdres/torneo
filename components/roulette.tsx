'use client';

import { useState } from 'react';
import { playClick } from '@/lib/sounds';
import { Team, Matchup } from '@/lib/types';
import { getRoundState } from '@/lib/rounds';

const PALETTE = ['#73030C', '#F49117', '#0B0F14'];

interface RouletteProps {
  teams: Team[];
  matchups: Matchup[];
  onMatchup: (a: Team, b: Team) => void;
}

export function Roulette({ teams, matchups, onMatchup }: RouletteProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [pickA, setPickA] = useState<Team | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const state = getRoundState(teams, matchups);
  const usedIds = new Set(state.usedIds);
  const available = teams.filter((t) => !usedIds.has(t.id));

  // Equipos elegibles para el giro actual: los que no han jugado esta ronda,
  // priorizando los que menos enfrentamientos acumulados tienen (bye rotativo).
  const candidates = available
    .filter((t) => t.id !== pickA?.id)
    .reduce<Team[]>((acc, t) => {
      const c = state.counts[t.id] ?? 0;
      if (acc.length === 0 || c < (state.counts[acc[0].id] ?? 0)) return [t];
      if (c === (state.counts[acc[0].id] ?? 0)) acc.push(t);
      return acc;
    }, []);

  const segmentAngle = candidates.length > 0 ? 360 / candidates.length : 360;

  const spin = () => {
    if (spinning || candidates.length === 0) return;
    playClick();
    setSpinning(true);
    setResult(null);

    const extraTurns = (5 + Math.random() * 3) * 360;
    const randomAngle = Math.random() * 360;
    const newRotation = rotation + extraTurns + randomAngle;

    setRotation(newRotation);

    setTimeout(() => {
      const finalAngle = newRotation % 360;
      const pointerAngle = (360 - (finalAngle % 360)) % 360;
      const index = Math.floor(pointerAngle / segmentAngle) % candidates.length;
      const picked = candidates[index];

      setSpinning(false);

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.value = 0.2;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);

      if (!pickA) {
        setPickA(picked);
      } else {
        setResult(`${pickA.name} vs ${picked.name}`);
        onMatchup(pickA, picked);
        setPickA(null);
      }
    }, 4000);
  };

  const buildSegmentPath = (index: number) => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
    const radius = 120;
    const cx = 150, cy = 150;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArc = segmentAngle > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number) => {
    const midAngle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);
    const radius = 75;
    const cx = 150, cy = 150;
    return {
      x: cx + radius * Math.cos(midAngle),
      y: cy + radius * Math.sin(midAngle),
    };
  };

  if (teams.length < 2) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#0B0F14]/60">
          // RULETA DE ENFRENTAMIENTOS
        </h3>
        <div className="w-40 h-40 rounded-full border-4 border-dashed border-[#73030C]/30 flex items-center justify-center">
          <span className="text-4xl">?</span>
        </div>
        <p className="text-xs text-[#0B0F14]/50 text-center uppercase tracking-widest">
          Agrega al menos 2 equipos para sortear
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-sm font-black uppercase tracking-widest text-[#0B0F14]/60">
        // RULETA DE ENFRENTAMIENTOS
      </h3>

      {/* Ronda + estado de equipos */}
      <div className="flex flex-col items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#F49117]/20 border-2 border-[#F49117] text-[#73030C] text-xs font-black uppercase tracking-widest">
          Ronda {state.round}
        </span>
        <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
          {teams.map((t) => (
            <span
              key={t.id}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                usedIds.has(t.id)
                  ? 'border-[#0B0F14]/20 text-[#0B0F14]/30 line-through'
                  : t.id === state.byeId
                    ? 'border-[#F49117] bg-[#F49117]/20 text-[#73030C]'
                    : 'border-[#73030C]/40 text-[#73030C]'
              }`}
            >
              {t.name}
            </span>
          ))}
        </div>
        {state.byeId && (
          <p className="text-[10px] text-[#0B0F14]/50 uppercase tracking-widest">
            {teams.find((t) => t.id === state.byeId)?.name} descansó — entra primero
          </p>
        )}
      </div>

      {/* Indicador de turno */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
        <span className={`px-3 py-1 rounded-full border-2 ${
          !pickA ? 'bg-[#73030C] text-[#F3E1CE] border-[#73030C]' : 'border-[#73030C]/30 text-[#0B0F14]/50'
        }`}>
          1° equipo
        </span>
        <span className="text-[#F49117] font-black">VS</span>
        <span className={`px-3 py-1 rounded-full border-2 ${
          pickA ? 'bg-[#73030C] text-[#F3E1CE] border-[#73030C]' : 'border-[#73030C]/30 text-[#0B0F14]/50'
        }`}>
          {pickA ? `2° equipo (vs ${pickA.name})` : '2° equipo'}
        </span>
      </div>

      <div className="relative">
        {/* Pointer triangle at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-[#73030C] drop-shadow-lg" />
        </div>

        {/* Glow ring */}
        <div className={`absolute inset-[-8px] rounded-full transition-all duration-300 ${
          spinning ? 'bg-gradient-to-r from-[#73030C] via-[#F49117] to-[#0B0F14] animate-spin opacity-30 blur-md' : 'opacity-0'
        }`} style={{ animationDuration: '2s' }} />

        {/* Wheel */}
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="drop-shadow-2xl cursor-pointer"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
          onClick={spin}
        >
          {/* Outer ring */}
          <circle cx="150" cy="150" r="140" fill="none" stroke="#73030C" strokeWidth="3" opacity="0.5" />
          <circle cx="150" cy="150" r="122" fill="none" stroke="#F49117" strokeWidth="1" opacity="0.3" />

          {candidates.length === 1 ? (
            <>
              <circle cx="150" cy="150" r="120" fill={PALETTE[0]} stroke="#F3E1CE" strokeWidth="2" opacity="0.9" />
              <text
                x="150"
                y="95"
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="14"
                fontWeight="900"
                letterSpacing="1"
                className="uppercase select-none pointer-events-none"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
              >
                {candidates[0].name.length > 12 ? candidates[0].name.slice(0, 11) + '…' : candidates[0].name}
              </text>
            </>
          ) : (
            candidates.map((team, i) => {
              const textPos = getTextPosition(i);
              const midAngle = (i + 0.5) * segmentAngle - 90;
              const color = PALETTE[i % PALETTE.length];
              return (
                <g key={team.id}>
                  <path
                    d={buildSegmentPath(i)}
                    fill={color}
                    stroke="#F3E1CE"
                    strokeWidth="2"
                    opacity="0.9"
                    className="hover:opacity-100 transition-opacity"
                  />
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={candidates.length > 6 ? 10 : 13}
                    fontWeight="900"
                    letterSpacing="1"
                    transform={`rotate(${midAngle}, ${textPos.x}, ${textPos.y})`}
                    className="uppercase select-none pointer-events-none"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    {team.name.length > 12 ? team.name.slice(0, 11) + '…' : team.name}
                  </text>
                </g>
              );
            })
          )}

          {/* Center circle */}
          <circle cx="150" cy="150" r="25" fill="#73030C" stroke="#F49117" strokeWidth="2" />
          <text
            x="150"
            y="150"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#F3E1CE"
            fontSize="10"
            fontWeight="900"
            letterSpacing="1"
            className="uppercase select-none pointer-events-none"
          >
            VS
          </text>
        </svg>
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning || candidates.length === 0}
        className={`px-8 py-3 font-black uppercase tracking-widest text-sm border-2 transition-all duration-300 rounded ${
          spinning || candidates.length === 0
            ? 'border-[#0B0F14]/30 text-[#0B0F14]/30 cursor-not-allowed'
            : 'border-[#73030C] text-[#73030C] hover:bg-[#73030C]/10 hover:shadow-lg hover:shadow-[#73030C]/20 active:scale-95'
        }`}
      >
        {spinning ? 'GIRANDO...' : pickA ? 'GIRAR: 2° EQUIPO' : 'GIRAR RULETA'}
      </button>

      {/* Result */}
      {result && !spinning && (
        <div className="mt-2 p-4 border-2 border-[#F49117] bg-[#F49117]/10 text-center animate-pulse rounded">
          <p className="text-xs text-[#0B0F14]/60 uppercase tracking-widest mb-1">Enfrentamiento</p>
          <p className="text-2xl font-black text-[#73030C] uppercase tracking-wider">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}
