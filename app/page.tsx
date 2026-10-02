'use client';

import { useState, useEffect, useRef } from 'react';
import { TeamManager } from '@/components/team-manager';
import { StandingsTable } from '@/components/standings-table';
import { Matchups } from '@/components/matchups';
import { PWARegister } from '@/components/pwa-register';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, WifiOff, ImagePlus, Pencil, Check, X } from 'lucide-react';
import { Roulette } from '@/components/roulette';
import { Team, Matchup } from '@/lib/types';
import { getTeams, resetPoints, addPoints, isOffline, getSettings, saveSetting } from '@/lib/store';
import { playReset, playHack, playWin, playClick } from '@/lib/sounds';

const MATCHUPS_KEY = 'utopia_matchups';

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [loading, setLoading] = useState(false);
  const [hacked, setHacked] = useState(false);
  const [offline, setOffline] = useState(false);
  const [title, setTitle] = useState('LIGA');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('LIGA');
  const [logo, setLogo] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTeams();
    getSettings().then((s) => {
      if (s.title) {
        setTitle(s.title);
        setTitleDraft(s.title);
      }
      if (s.logo) setLogo(s.logo);
    });
    try {
      setMatchups(JSON.parse(localStorage.getItem(MATCHUPS_KEY) || '[]'));
    } catch {}
  }, []);

  const saveMatchups = (list: Matchup[]) => {
    setMatchups(list);
    localStorage.setItem(MATCHUPS_KEY, JSON.stringify(list));
  };

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
      setOffline(isOffline());
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleMatchup = (a: Team, b: Team) => {
    saveMatchups([{ id: Date.now(), a, b, winnerId: null }, ...matchups]);
  };

  const handleMatchupResult = async (matchup: Matchup, winnerId: number) => {
    playWin();
    saveMatchups(matchups.map((m) => (m.id === matchup.id ? { ...m, winnerId } : m)));
    await addPoints(winnerId, 3);
    fetchTeams();
  };

  const handleRemoveMatchup = (id: number) => {
    saveMatchups(matchups.filter((m) => m.id !== id));
  };

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 512 / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setLogo(dataUrl);
        saveSetting('logo', dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    saveSetting('logo', null);
  };

  const handleSaveTitle = () => {
    const clean = titleDraft.trim();
    if (clean) {
      setTitle(clean);
      saveSetting('title', clean);
    }
    setEditingTitle(false);
  };

  const handleResetPoints = async () => {
    if (!confirm('¿Estás seguro de reiniciar la liga? Se pondrán en 0 los puntos de todos los equipos.')) {
      return;
    }

    setLoading(true);
    playReset();
    try {
      await resetPoints();
      fetchTeams();
    } catch (error) {
      console.error('Error resetting points:', error);
      alert('Error al reiniciar los puntos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#F3E1CE] via-[#FFF9F0] to-[#F3E1CE] transition-all duration-500 ${hacked ? 'hacked-mode' : ''}`}>
      <PWARegister />
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

            {/* Logo invitado (subible) */}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoFile}
              className="hidden"
            />
            <div className="relative inline-block mb-6 group">
              <button
                onClick={() => logoInputRef.current?.click()}
                className={`relative w-24 h-24 rounded-full overflow-hidden transition-all ${
                  logo
                    ? 'border-2 border-[#73030C] shadow-lg shadow-[#73030C]/30'
                    : 'border-2 border-dashed border-[#73030C]/40 hover:border-[#73030C] bg-white/40 hover:bg-white/60'
                }`}
                title={logo ? 'Cambiar logo' : 'Agregar logo'}
              >
                {logo ? (
                  <img src={logo} alt="Logo invitado" className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus className="h-8 w-8 mx-auto text-[#73030C]/50" />
                )}
              </button>
              {logo && (
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#73030C] text-[#F3E1CE] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Quitar logo"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Logo/Título principal */}
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#73030C] to-[#F49117] opacity-15 blur-2xl animate-pulse" />
              <h1 className="relative text-6xl md:text-8xl font-black uppercase tracking-wider">
                <span className="text-vino drop-shadow-2xl">UTOPIA</span>
                <div className="h-1 w-full bg-gradient-to-r from-[#73030C] via-[#F49117] to-[#F3E1CE] mt-2 animate-shimmer" />
              </h1>
            </div>

            {/* Subtítulo editable */}
            <div className="relative">
              <p className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                {editingTitle ? (
                  <>
                    <input
                      autoFocus
                      value={titleDraft}
                      onChange={(e) => setTitleDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveTitle();
                        if (e.key === 'Escape') { setEditingTitle(false); setTitleDraft(title); }
                      }}
                      className="bg-white/60 border-2 border-[#F49117] rounded px-3 py-1 text-center uppercase text-[#0B0F14] outline-none w-56"
                      maxLength={30}
                    />
                    <button onClick={handleSaveTitle} className="p-1 text-[#73030C] hover:bg-[#73030C]/10 rounded" title="Guardar">
                      <Check className="h-5 w-5" />
                    </button>
                    <button onClick={() => { setEditingTitle(false); setTitleDraft(title); }} className="p-1 text-[#0B0F14]/50 hover:bg-[#73030C]/10 rounded" title="Cancelar">
                      <X className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-mostaza">{title}</span>
                    <button
                      onClick={() => { setTitleDraft(title); setEditingTitle(true); playClick(); }}
                      className="p-1 text-[#0B0F14]/30 hover:text-[#73030C] transition-colors"
                      title="Editar título"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </>
                )}
              </p>
              <p className="text-sm md:text-base text-[#0B0F14]/60 uppercase tracking-wider font-semibold">
                // LIGA POR PUNTOS
              </p>
            </div>

            {/* Indicador offline */}
            {offline && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B0F14] text-[#F3E1CE] text-xs font-bold uppercase tracking-widest">
                <WifiOff className="h-4 w-4" />
                Modo offline — datos locales
              </div>
            )}

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
          <div className="space-y-6">
            <TeamManager teams={teams} onTeamsChange={fetchTeams} />
            <Matchups
              matchups={matchups}
              onResult={handleMatchupResult}
              onRemove={handleRemoveMatchup}
              loading={loading}
            />
          </div>

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
                    <p className="font-medium text-sm text-[#0B0F14]">Sortea enfrentamientos</p>
                    <p className="text-xs text-[#0B0F14]/60">Gira la ruleta dos veces y marca al ganador (+3 pts)</p>
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
                <Roulette teams={teams} onMatchup={handleMatchup} />
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
