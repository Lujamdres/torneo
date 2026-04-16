'use client';

import { useState, useEffect } from 'react';
import { TeamManager } from '@/components/team-manager';
import { TournamentBracket } from '@/components/tournament-bracket';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Swords } from 'lucide-react';
import { Tournament } from '@/lib/types';
import { playGenerate, playReset, playHack, playClick } from '@/lib/sounds';

export default function Home() {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(false);
  const [hacked, setHacked] = useState(false);

  useEffect(() => {
    fetchOrCreateTournament();
  }, []);

  const fetchOrCreateTournament = async () => {
    try {
      const res = await fetch('/api/tournaments');
      const tournaments = await res.json();
      
      if (tournaments.length > 0) {
        setTournament(tournaments[0]);
      } else {
        const createRes = await fetch('/api/tournaments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Torneo de Valorant' }),
        });
        const newTournament = await createRes.json();
        setTournament(newTournament);
      }
    } catch (error) {
      console.error('Error fetching tournament:', error);
    }
  };

  const handleGenerateBracket = async () => {
    if (!tournament) return;

    setLoading(true);
    playGenerate();
    try {
      const res = await fetch(`/api/tournaments/${tournament.id}/generate-bracket`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchOrCreateTournament();
        window.location.reload();
      } else {
        const error = await res.json();
        alert(error.error || 'Error al generar el bracket');
      }
    } catch (error) {
      console.error('Error generating bracket:', error);
      alert('Error al generar el bracket');
    } finally {
      setLoading(false);
    }
  };

  const handleResetTournament = async () => {
    if (!tournament) return;
    
    if (!confirm('¿Estás seguro de reiniciar el torneo? Se borrarán todos los partidos y resultados.')) {
      return;
    }

    setLoading(true);
    playReset();
    try {
      const res = await fetch(`/api/tournaments/${tournament.id}/reset`, {
        method: 'POST',
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert('Error al reiniciar el torneo');
      }
    } catch (error) {
      console.error('Error resetting tournament:', error);
      alert('Error al reiniciar el torneo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0f1923] via-[#1a1f2e] to-[#0f1923] transition-all duration-500 ${hacked ? 'hacked-mode' : ''}`}>
      {/* Easter egg: HACKEO EN PROGRESO */}
      {hacked && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 bg-red-600/90 text-white text-center py-3 font-mono text-lg font-bold tracking-widest animate-pulse pointer-events-auto">
            ⚠ HACKEO EN PROGRESO... ⚠ SISTEMA COMPROMETIDO ⚠
            <button onClick={() => setHacked(false)} className="ml-4 text-xs underline opacity-50 hover:opacity-100">[restaurar]</button>
          </div>
        </div>
      )}
      <div className="w-full px-4 py-8">
        <header className="mb-12 text-center relative overflow-hidden">
          {/* Líneas de fondo estilo tech */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#6600cc] to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent" />
          </div>
          
          {/* Efecto de brillo neón de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6600cc]/5 via-[#00d9ff]/5 to-[#6600cc]/5 blur-3xl -z-10 animate-pulse" />
          
          <div className="relative py-8 px-4">
            {/* Hexágonos decorativos */}
            <div className="absolute top-4 left-4 w-12 h-12 hexagon-clip bg-[#6600cc]/20 animate-pulse" />
            <button
              onClick={() => { setHacked(h => !h); playHack(); }}
              className="absolute top-8 right-8 w-16 h-16 hexagon-clip bg-[#00d9ff]/20 animate-pulse cursor-default hover:bg-[#00d9ff]/40 transition-colors focus:outline-none"
              style={{ animationDelay: '0.5s' }}
              aria-hidden="true"
            />
            <div className="absolute bottom-4 left-1/4 w-8 h-8 hexagon-clip bg-[#6600cc]/30 animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Logo/Título principal */}
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#6600cc] to-[#00d9ff] opacity-20 blur-2xl animate-pulse" />
              <h1 className="relative text-6xl md:text-8xl font-black uppercase tracking-wider">
                <span className="text-neon-purple drop-shadow-2xl">VALORANT</span>
                <div className="h-1 w-full bg-gradient-to-r from-[#6600cc] via-white to-[#00d9ff] mt-2 animate-shimmer" />
              </h1>
            </div>
            
            {/* Subtítulo */}
            <div className="relative">
              <p className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-2">
                <span className="text-neon-cyan">TOURNAMENT</span>
              </p>
              <p className="text-sm md:text-base text-gray-400 uppercase tracking-wider font-semibold">
                // COMPETITIVE GAMING SERIES
              </p>
            </div>
            
            {/* Línea decorativa inferior */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#6600cc]" />
              <div className="w-2 h-2 bg-[#6600cc] rotate-45 animate-pulse" />
              <div className="h-px w-24 bg-gradient-to-r from-[#6600cc] to-[#00d9ff]" />
              <div className="w-2 h-2 bg-[#00d9ff] rotate-45 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="h-px w-24 bg-gradient-to-r from-[#00d9ff] to-transparent" />
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <TeamManager />
          
          <Card className="border-2 border-[#00d9ff]/30 bg-gradient-to-br from-[#1a1f2e] to-[#0f1923] shadow-2xl shadow-[#00d9ff]/10">
            <CardHeader className="border-b border-[#00d9ff]/20 bg-gradient-to-r from-[#00d9ff]/10 to-transparent">
              <CardTitle className="flex items-center gap-3 text-xl uppercase tracking-wider">
                <div className="relative">
                  <Trophy className="h-7 w-7 text-[#00d9ff]" />
                  <div className="absolute inset-0 bg-[#00d9ff] blur-md opacity-50" />
                </div>
                <span className="text-neon-cyan font-black">TOURNAMENT CONTROL</span>
              </CardTitle>
              <CardDescription className="text-base text-gray-400 uppercase text-xs tracking-widest">
                // BRACKET MANAGEMENT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {tournament?.status === 'setup' ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-sm">Agrega equipos</p>
                        <p className="text-xs text-muted-foreground">Mínimo 2 equipos para comenzar</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-sm">Genera el bracket</p>
                        <p className="text-xs text-muted-foreground">Se crearán los enfrentamientos automáticamente</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-sm">Juega los partidos</p>
                        <p className="text-xs text-muted-foreground">Marca ganadores y avanza de fase</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateBracket} 
                    disabled={loading}
                    className="w-full bg-[#6600cc] hover:bg-[#6600cc]/80 text-white shadow-lg shadow-[#6600cc]/50 hover:shadow-xl font-black uppercase tracking-wider"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        GENERATING...
                      </>
                    ) : (
                      <>
                        <Trophy className="h-5 w-5 mr-2" />
                        GENERATE BRACKET
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-400 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-900 dark:text-green-100">
                          ¡Torneo en Progreso!
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          El bracket ha sido generado
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Desplázate hacia abajo para ver los partidos y marcar los ganadores de cada enfrentamiento.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleResetTournament} 
                    disabled={loading}
                    className="w-full border-2 border-[#6600cc] bg-transparent hover:bg-[#6600cc]/20 text-[#6600cc] font-black uppercase tracking-wider"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent mr-2" />
                        Reiniciando...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reiniciar Torneo
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {tournament && tournament.status !== 'setup' && (
          <TournamentBracket tournamentId={tournament.id} />
        )}
      </div>
    </div>
  );
}
