'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Users, UserPlus, Shield } from 'lucide-react';
import { Team } from '@/lib/types';
import { playAdd, playDelete } from '@/lib/sounds';

export function TeamManager() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(false);

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
        fetchTeams();
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
      fetchTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  return (
    <Card className="border-2 border-[#6600cc]/30 bg-gradient-to-br from-[#1a1f2e] to-[#0f1923] shadow-2xl shadow-[#6600cc]/10">
      <CardHeader className="border-b border-[#6600cc]/20 bg-gradient-to-r from-[#6600cc]/10 to-transparent">
        <CardTitle className="flex items-center gap-3 text-xl uppercase tracking-wider">
          <div className="relative">
            <Shield className="h-7 w-7 text-[#6600cc]" />
            <div className="absolute inset-0 bg-[#6600cc] blur-md opacity-50" />
          </div>
          <span className="text-neon-purple font-black">ROSTER</span>
        </CardTitle>
        <CardDescription className="text-base text-gray-400 uppercase text-xs tracking-widest">
          // TEAM REGISTRATION
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <form onSubmit={handleAddTeam} className="flex gap-2">
          <Input
            placeholder="Nombre del equipo o jugador..."
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            disabled={loading}
            className="text-base"
          />
          <Button type="submit" disabled={loading} size="lg" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Agregar
          </Button>
        </form>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {teams.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No hay equipos registrados
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Agrega el primero arriba
              </p>
            </div>
          ) : (
            teams.map((team, index) => (
              <div
                key={team.id}
                className="relative flex items-center justify-between p-4 rounded border-l-4 border-[#6600cc] bg-gradient-to-r from-[#6600cc]/10 to-transparent hover:from-[#6600cc]/20 hover:to-[#00d9ff]/10 transition-all hover:shadow-lg hover:shadow-[#6600cc]/20 group"
              >
                {/* Línea de scan animada */}
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6600cc]/20 to-transparent h-full animate-scan-line" />
                </div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="flex items-center justify-center w-10 h-10 hexagon-clip bg-[#6600cc] text-white font-black text-sm shadow-lg shadow-[#6600cc]/50">
                    {index + 1}
                  </div>
                  <span className="font-bold text-base text-white uppercase tracking-wide">{team.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTeam(team.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#6600cc]/20 relative z-10"
                >
                  <Trash2 className="h-4 w-4 text-[#6600cc]" />
                </Button>
              </div>
            ))
          )}
        </div>

        {teams.length > 0 && (
          <div className="pt-4 border-t border-[#6600cc]/20">
            <div className="flex items-center justify-between p-3 rounded bg-[#6600cc]/5 border border-[#6600cc]/20">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                // TOTAL PLAYERS
              </p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Users className="h-5 w-5 text-[#6600cc]" />
                  <div className="absolute inset-0 bg-[#6600cc] blur-md opacity-50" />
                </div>
                <span className="text-3xl font-black text-neon-purple">
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
