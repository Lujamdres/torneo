'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Users, UserPlus, Shield } from 'lucide-react';
import { Team } from '@/lib/types';
import { playAdd, playDelete } from '@/lib/sounds';

interface TeamManagerProps {
  teams: Team[];
  onTeamsChange: () => void;
}

export function TeamManager({ teams, onTeamsChange }: TeamManagerProps) {
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTeamName }),
      });

      if (res.ok) {
        playAdd();
        setNewTeamName('');
        onTeamsChange();
      }
    } catch (error) {
      console.error('Error adding team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este equipo?')) return;

    try {
      await fetch(`/api/teams?id=${id}`, { method: 'DELETE' });
      playDelete();
      onTeamsChange();
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  return (
    <Card className="border-2 border-[#73030C]/40 bg-gradient-to-br from-[#FFF9F0] to-[#F3E1CE] shadow-2xl shadow-[#73030C]/10">
      <CardHeader className="border-b border-[#F49117]/40 bg-[#73030C] rounded-t-xl">
        <CardTitle className="flex items-center gap-3 text-xl uppercase tracking-wider">
          <div className="relative">
            <Shield className="h-7 w-7 text-[#F49117]" />
            <div className="absolute inset-0 bg-[#F49117] blur-md opacity-50" />
          </div>
          <span className="font-black text-[#F3E1CE]">EQUIPOS</span>
        </CardTitle>
        <CardDescription className="text-[#F3E1CE]/70 uppercase text-xs tracking-widest">
          // REGISTRO DE EQUIPOS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <form onSubmit={handleAddTeam} className="flex gap-2">
          <Input
            placeholder="Nombre del equipo..."
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            disabled={loading}
            className="text-base border-[#73030C]/30 bg-white/60 text-[#0B0F14] placeholder:text-[#0B0F14]/40 focus-visible:ring-[#F49117]"
          />
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="gap-2 bg-[#73030C] hover:bg-[#73030C]/80 text-[#F3E1CE]"
          >
            <UserPlus className="h-4 w-4" />
            Agregar
          </Button>
        </form>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {teams.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[#73030C]/30 rounded-lg">
              <Users className="h-12 w-12 mx-auto text-[#73030C]/30 mb-3" />
              <p className="text-sm text-[#0B0F14]/60">
                No hay equipos registrados
              </p>
              <p className="text-xs text-[#0B0F14]/50 mt-1">
                Agrega el primero arriba
              </p>
            </div>
          ) : (
            teams.map((team, index) => (
              <div
                key={team.id}
                className="relative flex items-center justify-between p-4 rounded border-l-4 border-[#73030C] bg-gradient-to-r from-[#73030C]/10 to-transparent hover:from-[#73030C]/15 hover:to-[#F49117]/10 transition-all hover:shadow-lg hover:shadow-[#73030C]/15 group"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="flex items-center justify-center w-10 h-10 hexagon-clip bg-[#73030C] text-[#F3E1CE] font-black text-sm shadow-lg shadow-[#73030C]/40">
                    {index + 1}
                  </div>
                  <span className="font-bold text-base text-[#0B0F14] uppercase tracking-wide">{team.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTeam(team.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#73030C]/10 relative z-10"
                >
                  <Trash2 className="h-4 w-4 text-[#73030C]" />
                </Button>
              </div>
            ))
          )}
        </div>

        {teams.length > 0 && (
          <div className="pt-4 border-t border-[#73030C]/20">
            <div className="flex items-center justify-between p-3 rounded bg-[#F49117]/10 border border-[#F49117]/40">
              <p className="text-xs font-bold text-[#0B0F14]/60 uppercase tracking-widest">
                // TOTAL EQUIPOS
              </p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Users className="h-5 w-5 text-[#73030C]" />
                  <div className="absolute inset-0 bg-[#73030C] blur-md opacity-30" />
                </div>
                <span className="text-3xl font-black text-vino">
                  {teams.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
