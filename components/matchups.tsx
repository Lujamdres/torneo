'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords, Trash2, Crown } from 'lucide-react';
import { Matchup } from '@/lib/types';

interface MatchupsProps {
  matchups: Matchup[];
  onResult: (matchup: Matchup, winnerId: number) => void;
  onRemove: (id: number) => void;
  loading: boolean;
}

export function Matchups({ matchups, onResult, onRemove, loading }: MatchupsProps) {
  return (
    <Card className="border-2 border-[#73030C]/40 bg-gradient-to-br from-[#FFF9F0] to-[#F3E1CE] shadow-2xl shadow-[#73030C]/10">
      <CardHeader className="border-b border-[#F49117]/40 bg-[#73030C] rounded-t-xl">
        <CardTitle className="flex items-center gap-3 text-xl uppercase tracking-wider">
          <div className="relative">
            <Swords className="h-7 w-7 text-[#F49117]" />
            <div className="absolute inset-0 bg-[#F49117] blur-md opacity-50" />
          </div>
          <span className="font-black text-[#F3E1CE]">ENFRENTAMIENTOS</span>
        </CardTitle>
        <CardDescription className="text-[#F3E1CE]/70 uppercase text-xs tracking-widest">
          // GENERADOS POR LA RULETA
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {matchups.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-[#73030C]/30 rounded-lg">
            <Swords className="h-12 w-12 mx-auto text-[#73030C]/30 mb-3" />
            <p className="text-sm text-[#0B0F14]/60">
              No hay enfrentamientos
            </p>
            <p className="text-xs text-[#0B0F14]/50 mt-1">
              Gira la ruleta dos veces para crear uno
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
            {matchups.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-lg border-2 transition-all ${
                  m.winnerId
                    ? 'border-[#F49117]/60 bg-[#F49117]/10'
                    : 'border-[#73030C]/20 bg-white/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wide min-w-0">
                    <span className={m.winnerId === m.a.id ? 'text-[#73030C]' : 'text-[#0B0F14]'}>
                      {m.a.name}
                      {m.winnerId === m.a.id && <Crown className="inline h-3.5 w-3.5 ml-1 text-[#F49117]" />}
                    </span>
                    <span className="text-[#F49117] font-black">VS</span>
                    <span className={m.winnerId === m.b.id ? 'text-[#73030C]' : 'text-[#0B0F14]'}>
                      {m.b.name}
                      {m.winnerId === m.b.id && <Crown className="inline h-3.5 w-3.5 ml-1 text-[#F49117]" />}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(m.id)}
                    className="h-7 w-7 hover:bg-[#73030C]/10 shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-[#73030C]/60" />
                  </Button>
                </div>
                {!m.winnerId && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => onResult(m, m.a.id)}
                      disabled={loading}
                      className="flex-1 h-7 bg-[#73030C] hover:bg-[#73030C]/80 text-[#F3E1CE] text-xs font-black uppercase"
                    >
                      Ganó {m.a.name}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onResult(m, m.b.id)}
                      disabled={loading}
                      className="flex-1 h-7 bg-[#73030C] hover:bg-[#73030C]/80 text-[#F3E1CE] text-xs font-black uppercase"
                    >
                      Ganó {m.b.name}
                    </Button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
