'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Award, Crown, Zap, Medal } from 'lucide-react';
import { MatchWithTeams } from '@/lib/types';
import { getRoundName, calculateRounds } from '@/lib/bracket-generator';
import { PodiumModal } from '@/components/podium-modal';
import { playWin, playChampion } from '@/lib/sounds';

interface TournamentBracketProps {
  tournamentId: number;
}

export function TournamentBracket({ tournamentId }: TournamentBracketProps) {
  const [matches, setMatches] = useState<MatchWithTeams[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPodium, setShowPodium] = useState(false);

  useEffect(() => {
    if (tournamentId) {
      fetchMatches();
    }
  }, [tournamentId]);

  const fetchMatches = async () => {
    try {
      const res = await fetch(`/api/matches?tournament_id=${tournamentId}`);
      const data = await res.json();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleSetWinner = async (matchId: number, winnerId: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/matches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: matchId, winner_id: winnerId }),
      });

      if (res.ok) {
        playWin();
        await fetch('/api/matches/advance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tournament_id: tournamentId }),
        });
        
        await fetchMatches();
      }
    } catch (error) {
      console.error('Error setting winner:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, MatchWithTeams[]>);

  // Filtrar round 0 (partido de 3er puesto) de las rondas normales
  const thirdPlaceMatch = matches.find(m => m.round === 0) || null;
  const rounds = Object.keys(groupedMatches)
    .filter(r => Number(r) > 0)
    .sort((a, b) => Number(a) - Number(b));
  
  // Calcular el total de rondas basándose en la cantidad de equipos en la primera ronda
  const firstRoundMatches = groupedMatches[1] || [];
  const totalTeams = firstRoundMatches.length * 2; // Cada partido tiene 2 equipos
  const totalRounds = calculateRounds(totalTeams);

  // Solo mostrar campeón si es la última ronda Y solo hay 1 partido en esa ronda Y está completado
  const finalRoundMatches = matches.filter(m => m.round === totalRounds);
  const champion = (finalRoundMatches.length === 1 && finalRoundMatches[0].status === 'completed') 
    ? finalRoundMatches[0] 
    : null;

  // Calcular podio (1º, 2º, 3º lugar)
  const firstPlace = champion ? { name: champion.winner_name || '' } : null;
  const secondPlace = champion && finalRoundMatches[0] ? {
    name: finalRoundMatches[0].winner_id === finalRoundMatches[0].team1_id 
      ? finalRoundMatches[0].team2_name 
      : finalRoundMatches[0].team1_name
  } : null;
  
  // 3º lugar: ganador del partido de 3er puesto (round = 0)
  const thirdPlace = (thirdPlaceMatch && thirdPlaceMatch.status === 'completed' && thirdPlaceMatch.winner_name)
    ? { name: thirdPlaceMatch.winner_name }
    : null;

  // Abrir modal automáticamente cuando se complete el torneo
  useEffect(() => {
    if (champion && !showPodium) {
      playChampion();
      const timer = setTimeout(() => setShowPodium(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [champion]);

  if (matches.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Bracket del Torneo
          </CardTitle>
          <CardDescription>
            Genera el bracket para comenzar el torneo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay partidos generados aún. Primero agrega equipos y luego genera el bracket.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#00d9ff]/30 bg-gradient-to-br from-[#1a1f2e] to-[#0f1923] shadow-2xl shadow-[#00d9ff]/10">
        <CardHeader className="border-b border-[#00d9ff]/20 bg-gradient-to-r from-[#00d9ff]/10 to-transparent">
          <CardTitle className="flex items-center gap-3 text-2xl uppercase tracking-wider">
            <div className="relative">
              <Trophy className="h-8 w-8 text-[#00d9ff]" />
              <div className="absolute inset-0 bg-[#00d9ff] blur-md opacity-50" />
            </div>
            <span className="text-neon-cyan font-black">TOURNAMENT BRACKET</span>
          </CardTitle>
          <CardDescription className="text-base text-gray-400 uppercase text-xs tracking-widest">
            // COMPETITIVE MATCHES
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto py-8">
          {(() => {
            // Función para renderizar una card de partido
            const renderMatchCard = (match: MatchWithTeams, connectorSide: 'left' | 'right' | 'none') => {
              const isBye = match.team1_id === match.team2_id;
              return (
                <div key={match.id} className="relative flex items-center">
                  {/* Conector izquierdo (para lado derecho del bracket) */}
                  {connectorSide === 'right' && (
                    <div className="w-10 h-0.5 bg-[#6600cc]/60" />
                  )}
                  <div className={`relative border-2 p-3 w-56 transition-all ${
                    match.status === 'completed'
                      ? 'bg-[#1a1f2e] border-[#00d9ff] shadow-lg shadow-[#00d9ff]/20'
                      : 'bg-[#1a1f2e] border-[#6600cc]/30 hover:border-[#6600cc]'
                  }`}>
                    {!isBye ? (
                      <div className="space-y-1">
                        <div className={`flex items-center justify-between p-2 border-l-2 ${
                          match.winner_id === match.team1_id ? 'border-[#00d9ff] bg-[#00d9ff]/10' : 'border-[#6600cc]/30'
                        }`}>
                          <span className={`font-bold text-sm truncate mr-2 ${
                            match.winner_id === match.team1_id ? 'text-[#00d9ff]' : 'text-white'
                          }`}>{match.team1_name}</span>
                          {match.status !== 'completed' && (
                            <Button size="sm" onClick={() => handleSetWinner(match.id, match.team1_id)}
                              disabled={loading} className="h-6 px-2 bg-[#6600cc] hover:bg-[#6600cc]/80 text-white text-xs shrink-0">WIN</Button>
                          )}
                        </div>
                        <div className={`flex items-center justify-between p-2 border-l-2 ${
                          match.winner_id === match.team2_id ? 'border-[#00d9ff] bg-[#00d9ff]/10' : 'border-[#6600cc]/30'
                        }`}>
                          <span className={`font-bold text-sm truncate mr-2 ${
                            match.winner_id === match.team2_id ? 'text-[#00d9ff]' : 'text-white'
                          }`}>{match.team2_name}</span>
                          {match.status !== 'completed' && (
                            <Button size="sm" onClick={() => handleSetWinner(match.id, match.team2_id)}
                              disabled={loading} className="h-6 px-2 bg-[#6600cc] hover:bg-[#6600cc]/80 text-white text-xs shrink-0">WIN</Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="font-semibold text-sm">{match.team1_name}</p>
                        <p className="text-xs text-gray-400">BYE</p>
                      </div>
                    )}
                  </div>
                  {/* Conector derecho (para lado izquierdo del bracket) */}
                  {connectorSide === 'left' && (
                    <div className="w-10 h-0.5 bg-[#6600cc]/60" />
                  )}
                </div>
              );
            };

            // Usar totalRounds (calculado por cantidad de equipos) para saber cuál es la ronda final REAL
            const actualFinalRound = totalRounds;
            const nonFinalRounds = rounds.filter(r => Number(r) < actualFinalRound);
            const finalMatches = groupedMatches[actualFinalRound] || [];
            const hasFinalMatch = finalMatches.length > 0;

            // Altura total basada en primera ronda
            const firstRoundCount = (groupedMatches[1] || []).length;
            const bracketHeight = Math.max(500, firstRoundCount * 100);

            return (
              <div className="flex items-stretch justify-center min-w-max gap-4">
                {/* ========== MITAD IZQUIERDA ========== */}
                <div className="flex">
                  {nonFinalRounds.map((round, roundIndex) => {
                    const roundNum = Number(round);
                    const roundName = getRoundName(roundNum, totalRounds);
                    const allMatches = groupedMatches[roundNum];
                    const half = Math.ceil(allMatches.length / 2);
                    const leftMatches = allMatches.slice(0, half);

                    return (
                      <div key={`L-${round}`} className="flex flex-col mr-4">
                        <div className="mb-4 px-3 py-2 bg-[#6600cc]/10 border border-[#6600cc]/50 text-center">
                          <h3 className="text-sm font-black uppercase tracking-widest text-neon-purple">{roundName}</h3>
                        </div>
                        <div className="flex flex-col justify-around flex-1" style={{ minHeight: `${bracketHeight}px` }}>
                          {leftMatches.map((m) => renderMatchCard(m, 'left'))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ========== FINAL EN EL CENTRO ========== */}
                <div className="flex flex-col items-center justify-center" style={{ minHeight: `${bracketHeight}px` }}>
                  <div className={`mb-4 px-5 py-3 border-2 text-center ${
                    hasFinalMatch ? 'bg-[#00d9ff]/10 border-[#00d9ff] animate-neon-pulse' : 'bg-[#6600cc]/5 border-[#6600cc]/30'
                  }`}>
                    <h3 className={`text-xl font-black uppercase tracking-widest flex items-center gap-2 ${
                      hasFinalMatch ? 'text-neon-cyan' : 'text-gray-500'
                    }`}>
                      <Trophy className={`h-5 w-5 ${hasFinalMatch ? 'animate-float' : 'opacity-30'}`} />
                      FINAL
                    </h3>
                  </div>
                  {hasFinalMatch ? (
                    finalMatches.map((m) => renderMatchCard(m, 'none'))
                  ) : (
                    <div className="w-56 border-2 border-dashed border-[#6600cc]/20 p-6 text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Por definir</p>
                    </div>
                  )}

                  {/* Partido de 3er puesto */}
                  {thirdPlaceMatch && (
                    <div className="mt-10 flex flex-col items-center">
                      <div className="mb-3 px-4 py-2 bg-amber-600/10 border-2 border-amber-600/50 text-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                          <Medal className="h-4 w-4" />
                          3ER PUESTO
                        </h3>
                      </div>
                      {renderMatchCard(thirdPlaceMatch, 'none')}
                    </div>
                  )}
                </div>

                {/* ========== MITAD DERECHA (ESPEJO) ========== */}
                <div className="flex flex-row-reverse">
                  {nonFinalRounds.map((round, roundIndex) => {
                    const roundNum = Number(round);
                    const roundName = getRoundName(roundNum, totalRounds);
                    const allMatches = groupedMatches[roundNum];
                    const half = Math.ceil(allMatches.length / 2);
                    const rightMatches = allMatches.slice(half);

                    return (
                      <div key={`R-${round}`} className="flex flex-col ml-4">
                        <div className="mb-4 px-3 py-2 bg-[#6600cc]/10 border border-[#6600cc]/50 text-center">
                          <h3 className="text-sm font-black uppercase tracking-widest text-neon-purple">{roundName}</h3>
                        </div>
                        <div className="flex flex-col justify-around flex-1" style={{ minHeight: `${bracketHeight}px` }}>
                          {rightMatches.map((m) => renderMatchCard(m, 'right'))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Botón para ver podio */}
      {champion && (
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setShowPodium(true)}
            className="bg-gradient-to-r from-[#6600cc] to-[#00d9ff] hover:from-[#6600cc]/80 hover:to-[#00d9ff]/80 text-white shadow-lg shadow-[#00d9ff]/50 hover:shadow-xl font-black uppercase tracking-wider text-lg px-8 py-6"
          >
            <Medal className="h-6 w-6 mr-2" />
            VER PODIO
          </Button>
        </div>
      )}

      {/* Card del Campeón - Solo aparece al final cuando la final está completada */}
      {champion && (
        <Card className="relative border-4 border-[#00d9ff] bg-gradient-to-br from-[#1a1f2e] via-[#6600cc] to-[#1a1f2e] overflow-hidden animate-bounce-in shadow-2xl shadow-[#00d9ff]/50">
          {/* Efectos de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6600cc]/10 via-[#00d9ff]/10 to-[#6600cc]/10 animate-shimmer" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6600cc] via-[#00d9ff] to-[#6600cc] animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6600cc] via-[#00d9ff] to-[#6600cc] animate-pulse" />
          
          {/* Hexágonos decorativos */}
          <div className="absolute top-4 left-4 w-16 h-16 hexagon-clip bg-[#6600cc]/20 animate-pulse" />
          <div className="absolute top-4 right-4 w-16 h-16 hexagon-clip bg-[#00d9ff]/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-4 left-1/4 w-12 h-12 hexagon-clip bg-[#6600cc]/30 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-4 right-1/4 w-12 h-12 hexagon-clip bg-[#00d9ff]/30 animate-pulse" style={{ animationDelay: '1.5s' }} />
          
          <CardContent className="pt-12 pb-12 relative z-10">
            <div className="text-center space-y-8">
              {/* Corona con efectos neón */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#00d9ff] blur-3xl opacity-50 animate-pulse" />
                <Crown className="h-32 w-32 mx-auto text-[#00d9ff] animate-float drop-shadow-2xl relative z-10" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#6600cc] rounded-full animate-ping" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-[#00d9ff] rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>
              
              {/* Título CHAMPION */}
              <div className="space-y-4">
                <div className="relative">
                  <h2 className="text-6xl md:text-8xl font-black uppercase tracking-wider">
                    <span className="text-neon-cyan drop-shadow-2xl">CHAMPION</span>
                  </h2>
                  <div className="h-2 w-full bg-gradient-to-r from-[#6600cc] via-[#00d9ff] to-[#6600cc] mt-3 animate-shimmer" />
                </div>
                
                {/* Nombre del ganador */}
                <div className="relative inline-block py-6 px-8 bg-[#00d9ff]/10 border-2 border-[#00d9ff] rounded animate-neon-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6600cc]/20 to-[#00d9ff]/20 animate-shimmer" />
                  <p className="text-4xl md:text-5xl font-black uppercase tracking-widest relative z-10">
                    <span className="text-white drop-shadow-lg">{champion.winner_name}</span>
                  </p>
                </div>
              </div>
              
              {/* Líneas decorativas */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="h-px w-32 bg-gradient-to-r from-transparent to-[#6600cc]" />
                <div className="w-3 h-3 bg-[#6600cc] rotate-45 animate-pulse" />
                <div className="h-px w-32 bg-gradient-to-r from-[#6600cc] to-[#00d9ff]" />
                <div className="w-3 h-3 bg-[#00d9ff] rotate-45 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="h-px w-32 bg-gradient-to-r from-[#00d9ff] to-transparent" />
              </div>
              
              {/* Mensaje de victoria */}
              <p className="text-xl font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                // TOURNAMENT WINNER
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Podio */}
      <PodiumModal
        open={showPodium}
        onOpenChange={setShowPodium}
        firstPlace={firstPlace}
        secondPlace={secondPlace}
        thirdPlace={thirdPlace}
      />
    </div>
  );
}
