'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Medal, Award } from 'lucide-react';
interface PodiumEntry {
  name: string;
  points?: number;
}

interface PodiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstPlace: PodiumEntry | null;
  secondPlace: PodiumEntry | null;
  thirdPlace: PodiumEntry | null;
}

const CONFETTI_COLORS = ['#73030C', '#F49117', '#0B0F14'];

export function PodiumModal({ open, onOpenChange, firstPlace, secondPlace, thirdPlace }: PodiumModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-[#FFF9F0] to-[#F3E1CE] border-4 border-[#F49117] shadow-2xl shadow-[#F49117]/50 overflow-hidden">
        <div className="relative py-12">
          {/* Confeti */}
          {open && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2.5 h-2.5 rounded-sm"
                  style={{
                    left: `${(i * 37) % 100}%`,
                    top: '-16px',
                    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                    animation: `confetti ${2.5 + (i % 5) * 0.6}s linear ${(i % 12) * 0.25}s infinite`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Efectos de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#73030C]/10 via-[#F49117]/10 to-[#73030C]/10" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#73030C] via-[#F49117] to-[#73030C] animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#73030C] via-[#F49117] to-[#73030C] animate-pulse" />

          {/* Título */}
          <div className="text-center mb-12 relative z-10">
            <DialogTitle className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-4">
              <span className="text-mostaza drop-shadow-2xl">PODIO</span>
            </DialogTitle>
            <div className="h-1 w-64 mx-auto bg-gradient-to-r from-[#73030C] via-[#F49117] to-[#73030C]" />
          </div>

          {/* Podio */}
          <div className="flex items-end justify-center gap-6 relative z-10">
            {/* 2° Lugar */}
            {secondPlace && (
              <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="relative mb-4">
                  <Medal className="h-20 w-20 text-gray-400 animate-float" />
                  <div className="absolute inset-0 bg-gray-400 blur-xl opacity-50 animate-pulse" />
                </div>
                <div className="bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-500 rounded-t-lg px-8 py-6 text-center shadow-xl w-48">
                  <div className="text-6xl font-black text-gray-300 mb-2">2</div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">2° lugar</div>
                  <div className="text-lg font-black text-white uppercase">{secondPlace.name}</div>
                  {secondPlace.points !== undefined && (
                    <div className="text-xs font-bold text-gray-300 uppercase mt-1">{secondPlace.points} pts</div>
                  )}
                </div>
                <div className="bg-gray-700 w-48 h-24 border-x-2 border-gray-500" />
              </div>
            )}

            {/* 1° Lugar */}
            {firstPlace && (
              <div className="flex flex-col items-center animate-bounce-in">
                <div className="relative mb-4">
                  <Trophy className="h-28 w-28 text-[#F49117] animate-float" />
                  <div className="absolute inset-0 bg-[#F49117] blur-2xl opacity-70 animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#73030C] rounded-full animate-ping" />
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#F49117] rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="bg-gradient-to-b from-[#F49117] to-amber-600 border-4 border-[#F49117] rounded-t-lg px-10 py-8 text-center shadow-2xl shadow-[#F49117]/50 w-56 animate-neon-pulse">
                  <div className="text-7xl font-black text-[#73030C] mb-3">1</div>
                  <div className="text-sm font-bold text-[#73030C] uppercase tracking-widest mb-3">Campeón</div>
                  <div className="text-xl font-black text-[#73030C] uppercase">{firstPlace.name}</div>
                  {firstPlace.points !== undefined && (
                    <div className="text-sm font-bold text-[#73030C]/80 uppercase mt-1">{firstPlace.points} pts</div>
                  )}
                </div>
                <div className="bg-amber-600 w-56 h-32 border-x-4 border-[#F49117]" />
              </div>
            )}

            {/* 3° Lugar */}
            {thirdPlace && (
              <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="relative mb-4">
                  <Award className="h-16 w-16 text-amber-600 animate-float" />
                  <div className="absolute inset-0 bg-amber-600 blur-xl opacity-50 animate-pulse" />
                </div>
                <div className="bg-gradient-to-b from-amber-700 to-amber-900 border-2 border-amber-600 rounded-t-lg px-6 py-5 text-center shadow-xl w-44">
                  <div className="text-5xl font-black text-amber-300 mb-2">3</div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">3° lugar</div>
                  <div className="text-base font-black text-white uppercase">{thirdPlace.name}</div>
                  {thirdPlace.points !== undefined && (
                    <div className="text-xs font-bold text-amber-200 uppercase mt-1">{thirdPlace.points} pts</div>
                  )}
                </div>
                <div className="bg-amber-800 w-44 h-16 border-x-2 border-amber-600" />
              </div>
            )}
          </div>

          {/* Mensaje final */}
          <div className="text-center mt-12 relative z-10">
            <p className="text-lg font-bold text-[#0B0F14]/60 uppercase tracking-widest animate-pulse">
              // FIN DE LA LIGA
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
