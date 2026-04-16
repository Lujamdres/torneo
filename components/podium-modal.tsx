'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trophy, Medal, Award } from 'lucide-react';

interface PodiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstPlace: { name: string } | null;
  secondPlace: { name: string } | null;
  thirdPlace: { name: string } | null;
}

export function PodiumModal({ open, onOpenChange, firstPlace, secondPlace, thirdPlace }: PodiumModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-[#1a1f2e] to-[#0f1923] border-4 border-[#00d9ff] shadow-2xl shadow-[#00d9ff]/50">
        <div className="relative py-12">
          {/* Efectos de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6600cc]/10 via-[#00d9ff]/10 to-[#6600cc]/10 animate-shimmer" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6600cc] via-[#00d9ff] to-[#6600cc] animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6600cc] via-[#00d9ff] to-[#6600cc] animate-pulse" />
          
          {/* Título */}
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-4">
              <span className="text-neon-cyan drop-shadow-2xl">PODIUM</span>
            </h2>
            <div className="h-1 w-64 mx-auto bg-gradient-to-r from-[#6600cc] via-[#00d9ff] to-[#6600cc] animate-shimmer" />
          </div>

          {/* Podio */}
          <div className="flex items-end justify-center gap-6 relative z-10">
            {/* 2º Lugar */}
            {secondPlace && (
              <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="relative mb-4">
                  <Medal className="h-20 w-20 text-gray-400 animate-float" />
                  <div className="absolute inset-0 bg-gray-400 blur-xl opacity-50 animate-pulse" />
                </div>
                <div className="bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-500 rounded-t-lg px-8 py-6 text-center shadow-xl w-48">
                  <div className="text-6xl font-black text-gray-300 mb-2">2</div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Second Place</div>
                  <div className="text-lg font-black text-white uppercase">{secondPlace.name}</div>
                </div>
                <div className="bg-gray-700 w-48 h-24 border-x-2 border-gray-500" />
              </div>
            )}

            {/* 1º Lugar */}
            {firstPlace && (
              <div className="flex flex-col items-center animate-bounce-in">
                <div className="relative mb-4">
                  <Trophy className="h-28 w-28 text-[#00d9ff] animate-float" />
                  <div className="absolute inset-0 bg-[#00d9ff] blur-2xl opacity-70 animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#6600cc] rounded-full animate-ping" />
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#00d9ff] rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="bg-gradient-to-b from-[#00d9ff] to-cyan-700 border-4 border-[#00d9ff] rounded-t-lg px-10 py-8 text-center shadow-2xl shadow-[#00d9ff]/50 w-56 animate-neon-pulse">
                  <div className="text-7xl font-black text-white mb-3">1</div>
                  <div className="text-sm font-bold text-cyan-100 uppercase tracking-widest mb-3">Champion</div>
                  <div className="text-xl font-black text-white uppercase">{firstPlace.name}</div>
                </div>
                <div className="bg-cyan-600 w-56 h-32 border-x-4 border-[#00d9ff]" />
              </div>
            )}

            {/* 3º Lugar */}
            {thirdPlace && (
              <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="relative mb-4">
                  <Award className="h-16 w-16 text-amber-600 animate-float" />
                  <div className="absolute inset-0 bg-amber-600 blur-xl opacity-50 animate-pulse" />
                </div>
                <div className="bg-gradient-to-b from-amber-700 to-amber-900 border-2 border-amber-600 rounded-t-lg px-6 py-5 text-center shadow-xl w-44">
                  <div className="text-5xl font-black text-amber-300 mb-2">3</div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Third Place</div>
                  <div className="text-base font-black text-white uppercase">{thirdPlace.name}</div>
                </div>
                <div className="bg-amber-800 w-44 h-16 border-x-2 border-amber-600" />
              </div>
            )}
          </div>

          {/* Mensaje final */}
          <div className="text-center mt-12 relative z-10">
            <p className="text-lg font-bold text-gray-400 uppercase tracking-widest animate-pulse">
              // TOURNAMENT COMPLETE
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
