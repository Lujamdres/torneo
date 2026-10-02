'use client';

import { useState, useEffect } from 'react';
import { TeamManager } from '@/components/team-manager';
import { StandingsTable } from '@/components/standings-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Roulette } from '@/components/roulette';
import { Team } from '@/lib/types';
import { playReset, playHack } from '@/lib/sounds';

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [hacked, setHacked] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleResetPoints = async () => {
    if (!confirm('¿Estás seguro de reiniciar la liga? Se pondrán en 0 los puntos de todos los equipos.')) {
      return;
    }

    setLoading(true);
    playReset();
    try {
      const res = await fetch('/api/teams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true }),
      });

      if (res.ok) {
        fetchTeams();
      } else {
        alert('Error al reiniciar los puntos');
      }
    } catch (error) {
      console.error('Error resetting points:', error);
      alert('Error al reiniciar los puntos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#F3E1CE] via-[#FFF9F0] to-[#F3E1CE] transition-all duration-500 ${hacked ? 'hacked-mode' : ''}`}>
      {/* Easter egg: HACKEO EN PROGRESO */}
      {hacked && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 bg-red-600/90 text-white text-center py-3 font-mono text-lg font-bold tracking-widest animate-pulse pointer-events-auto">
            ⚠ HACKEO EN PROGRESO... ⚠ SISTEMA COMPROMETIDO ⚠
            <button onClick={() => setHacked(false)} className="ml-4 text-xs underline opacity-50 hover:opacity-100">[restaurar]</button>
          </div>
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <header className="mb-12 text-center relative overflow-hidden">
          {/* Líneas de fondo decorativas */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#73030C] to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F49117] to-transparent" />
          </div>

          {/* Efecto de brillo de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#73030C]/5 via-[#F49117]/5 to-[#73030C]/5 blur-3xl -z-10 animate-pulse" />

          <div className="relative py-8 px-4">
            {/* Hexágonos decorativos */}
            <div className="absolute top-4 left-4 w-12 h-12 hexagon-clip bg-[#73030C]/15 animate-pulse" />
            <button
              onClick={() => { setHacked(h => !h); playHack(); }}
              className="absolute top-8 right-8 w-16 h-16 hexagon-clip bg-[#F49117]/25 animate-pulse cursor-default hover:bg-[#F49117]/40 transition-colors focus:outline-none"
              style={{ animationDelay: '0.5s' }}
              aria-hidden="true"
            />
            <div className="absolute bottom-4 left-1/4 w-8 h-8 hexagon-clip bg-[#73030C]/20 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Logo/Título principal */}
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#73030C] to-[#F49117] opacity-15 blur-2xl animate-pulse" />
              <h1 className="relative text-6xl md:text-8xl font-black uppercase tracking-wider">
                <span className="text-vino drop-shadow-2xl">UTOPIA</span>
                <div className="h-1 w-full bg-gradient-to-r from-[#73030C] via-[#F49117] to-[#F3E1CE] mt-2 animate-shimmer" />
              </h1>
            </div>

            {/* Subtítulo */}
            <div className="relative">
              <p className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-2">
                <span className="text-mostaza">LIGA </span>
              </p>
              <p className="text-sm md:text-base text-[#0B0F14]/60 uppercase tracking-wider font-semibold">
                // LIGA POR PUNTOS
              </p>
            </div>

            {/* Línea decorativa inferior */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#73030C]" />
              <div className="w-2 h-2 bg-[#73030C] rotate-45 animate-pulse" />
              <div className="h-px w-24 bg-gradient-to-r from-[#73030C] to-[#F49117]" />
              <div className="w-2 h-2 bg-[#F49117] rotate-45 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="h-px w-24 bg-gradient-to-r from-[#F49117] to-transparent" />
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <TeamManager teams={teams} onTeamsChange={fetchTeams} />

          <Card className="border-2 border-[#73030C]/40 bg-gradient-to-br from-[#FFF9F0] to-[#F3E1CE] shadow-2xl shadow-[#73030C]/10">
            <CardHeader className="border-b border-[#F49117]/40 bg-[#73030C] rounded-t-xl">
              <CardTitle className="flex items-center gap-3 text-xl uppercase tracking-wider">
                <div className="relative">
                  <Trophy className="h-7 w-7 text-[#F49117]" />
                  <div className="absolute inset-0 bg-[#F49117] blur-md opacity-50" />
                </div>
                <span className="font-black text-[#F3E1CE]">CONTROL DE LIGA</span>
              </CardTitle>
              <CardDescription className="text-[#F3E1CE]/70 uppercase text-xs tracking-widest">
                // GESTIÓN DE PUNTOS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#F49117]/10 border border-[#F49117]/50">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F49117] text-[#0B0F14] flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#0B0F14]">Agrega equipos</p>
                    <p className="text-xs text-[#0B0F14]/60">Equipos de 5 niños participantes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#73030C]/5 border border-[#73030C]/30">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#73030C] text-[#F3E1CE] flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#0B0F14]">Suma puntos</p>
                    <p className="text-xs text-[#0B0F14]/60">Usa los botones de la tabla después de cada ronda </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-[#F49117]/10 border border-[#F49117]/50">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F49117] text-[#0B0F14] flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#0B0F14]">Corona al líder</p>
                    <p className="text-xs text-[#0B0F14]/60">El equipo con más puntos gana la liga</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#73030C]/20 pt-6">
                <Roulette />
              </div>

              <Button
                onClick={handleResetPoints}
                disabled={loading}
                className="w-full border-2 border-[#73030C] bg-transparent hover:bg-[#73030C]/10 text-[#73030C] font-black uppercase tracking-wider"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#73030C] border-t-transparent mr-2" />
                    Reiniciando...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reiniciar Puntos
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <StandingsTable teams={teams} onTeamsChange={fetchTeams} />
      </div>
    </div>
  );
}
