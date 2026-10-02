'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Plus, Minus, Medal } from 'lucide-react';
import { Team } from '@/lib/types';
import { addPoints } from '@/lib/store';
import { playWin, playDelete } from '@/lib/sounds';

interface StandingsTableProps {
  teams: Team[];
  onTeamsChange: () => void;
}

const POINT_BUTTONS = [1, 3, 5];

export function StandingsTable({ teams, onTeamsChange }: StandingsTableProps) {
  const [loading, setLoading] = useState<number | null>(null);

  const sorted = [...teams].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  const maxPoints = Math.max(1, ...sorted.map((t) => t.points));
  const leaderId = sorted.find((t) => t.points > 0)?.id ?? null;

  const handleAddPoints = async (teamId: number, delta: number) => {
    setLoading(teamId);
    try {
      await addPoints(teamId, delta);
      if (delta > 0) {
        playWin();
      } else {
        playDelete();
      }
      onTeamsChange();
    } catch (error) {
      console.error('Error updating points:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="border-2 border-[#73030C]/40 bg-gradient-to-br from-[#FFF9F0] to-[#F3E1CE] shadow-2xl shadow-[#73030C]/10">
      <CardHeader className="border-b border-[#F49117]/40 bg-[#73030C] rounded-t-xl">
        <CardTitle className="flex items-center gap-3 text-2xl uppercase tracking-wider">
          <div className="relative">
            <Trophy className="h-8 w-8 text-[#F49117]" />
            <div className="absolute inset-0 bg-[#F49117] blur-md opacity-50" />
          </div>
          <span className="font-black text-[#F3E1CE]">TABLA DE POSICIONES</span>
        </CardTitle>
        <CardDescription className="text-[#F3E1CE]/70 uppercase text-xs tracking-widest">
          // LIGA POR PUNTOS
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {sorted.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-[#73030C]/30 rounded-lg">
            <Trophy className="h-12 w-12 mx-auto text-[#73030C]/30 mb-3" />
            <p className="text-sm text-[#0B0F14]/60">
              No hay equipos registrados
            </p>
            <p className="text-xs text-[#0B0F14]/50 mt-1">
              Agrega equipos arriba para comenzar la liga
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((team, index) => {
              const isLeader = team.id === leaderId;
              return (
                <div
                  key={team.id}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    isLeader
                      ? 'border-[#F49117] bg-[#F49117]/10 shadow-lg shadow-[#F49117]/20'
                      : 'border-[#73030C]/20 bg-white/50 hover:border-[#73030C]/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`flex items-center justify-center w-10 h-10 hexagon-clip font-black text-sm shrink-0 ${
                        isLeader ? 'bg-[#F49117] text-[#0B0F14]' : 'bg-[#73030C] text-[#F3E1CE]'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-[#0B0F14] uppercase tracking-wide truncate">
                            {team.name}
                          </span>
                          {isLeader && <Medal className="h-4 w-4 text-[#F49117] shrink-0" />}
                        </div>
                        {/* Medidor de puntos */}
                        <div className="mt-2 h-3 w-full rounded-full bg-[#73030C]/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#73030C] to-[#F49117] transition-all duration-500"
                            style={{ width: `${(team.points / maxPoints) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-[#73030C] w-14 text-right tabular-nums">
                        {team.points}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddPoints(team.id, -1)}
                          disabled={loading === team.id || team.points === 0}
                          className="h-8 w-8 p-0 border-[#73030C]/40 text-[#73030C] hover:bg-[#73030C]/10"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        {POINT_BUTTONS.map((delta) => (
                          <Button
                            key={delta}
                            size="sm"
                            onClick={() => handleAddPoints(team.id, delta)}
                            disabled={loading === team.id}
                            className="h-8 px-2 bg-[#73030C] hover:bg-[#73030C]/80 text-[#F3E1CE] text-xs font-black shrink-0"
                          >
                            <Plus className="h-3 w-3" />
                            {delta}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
