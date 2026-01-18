"use client";

import { useState, useEffect } from "react";
import { 
  Baby, Moon, Clock, FileText, Settings, Home, 
  Play, Pause, RotateCcw, Plus, ChevronRight,
  Award, Bell, TrendingUp, Sun, Droplets, Heart
} from "lucide-react";

type Screen = "dashboard" | "sleep" | "feeding" | "notes" | "settings";

interface SleepRecord {
  id: string;
  type: "sleep" | "wake";
  time: string;
  date: string;
}

interface FeedingSession {
  id: string;
  duration: number;
  date: string;
  time: string;
}

interface Note {
  id: string;
  content: string;
  date: string;
  time: string;
}

export default function BabyRoutineApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [feedingSessions, setFeedingSessions] = useState<FeedingSession[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Feeding timer states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  
  // Notes input
  const [noteInput, setNoteInput] = useState("");
  
  // Settings
  const [reminders, setReminders] = useState({
    feeding: true,
    sleep: true,
    diaper: false
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addSleepRecord = (type: "sleep" | "wake") => {
    const now = new Date();
    const newRecord: SleepRecord = {
      id: Date.now().toString(),
      type,
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString('pt-BR')
    };
    setSleepRecords(prev => [newRecord, ...prev].slice(0, 10));
  };

  const saveFeedingSession = () => {
    if (timerSeconds === 0) return;
    const now = new Date();
    const newSession: FeedingSession = {
      id: Date.now().toString(),
      duration: timerSeconds,
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setFeedingSessions(prev => [newSession, ...prev].slice(0, 10));
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const addNote = () => {
    if (!noteInput.trim()) return;
    const now = new Date();
    const newNote: Note = {
      id: Date.now().toString(),
      content: noteInput,
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setNotes(prev => [newNote, ...prev]);
    setNoteInput("");
  };

  // Calculate stats
  const todaySleepRecords = sleepRecords.filter(r => r.date === new Date().toLocaleDateString('pt-BR'));
  const todayFeedings = feedingSessions.filter(f => f.date === new Date().toLocaleDateString('pt-BR'));
  const totalFeedingTime = todayFeedings.reduce((acc, f) => acc + f.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 font-inter relative">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md border-b border-white/20 px-4 py-4 shadow-xl sticky top-0 z-50">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-[#B8E6D5] to-[#F4C2D8] p-2 rounded-xl shadow-lg">
                <Baby className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800 font-inter">Bebê em Rotina</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-md mx-auto px-4 py-6 pb-24">
          {/* Dashboard */}
          {currentScreen === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Welcome Card */}
              <div className="bg-gradient-to-br from-[#B8E6D5] to-[#A8D5C5] rounded-3xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-2">Olá, Mamãe! 👋</h2>
                <p className="text-white/90">Vamos cuidar do seu bebê hoje</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-[#B8E6D5]/20 p-2 rounded-lg">
                      <Moon className="h-5 w-5 text-[#6BB6A0]" />
                    </div>
                    <span className="text-sm text-gray-600">Sono Hoje</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{todaySleepRecords.length}</p>
                  <p className="text-xs text-gray-500">registros</p>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-[#F4C2D8]/20 p-2 rounded-lg">
                      <Droplets className="h-5 w-5 text-[#E89BB8]" />
                    </div>
                    <span className="text-sm text-gray-600">Mamadas</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{todayFeedings.length}</p>
                  <p className="text-xs text-gray-500">sessões</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#B8E6D5]" />
                  Ações Rápidas
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCurrentScreen("sleep")}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
                  >
                    <div className="bg-gradient-to-br from-[#B8E6D5] to-[#A8D5C5] p-3 rounded-xl mb-3 inline-block shadow-lg">
                      <Moon className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-gray-800">Sono</p>
                    <p className="text-xs text-gray-500">Registrar</p>
                  </button>

                  <button
                    onClick={() => setCurrentScreen("feeding")}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
                  >
                    <div className="bg-gradient-to-br from-[#F4C2D8] to-[#E8B5CC] p-3 rounded-xl mb-3 inline-block shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-gray-800">Mamada</p>
                    <p className="text-xs text-gray-500">Cronômetro</p>
                  </button>

                  <button
                    onClick={() => setCurrentScreen("notes")}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
                  >
                    <div className="bg-gradient-to-br from-[#A8C5E8] to-[#98B5D8] p-3 rounded-xl mb-3 inline-block shadow-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-gray-800">Anotações</p>
                    <p className="text-xs text-gray-500">Observações</p>
                  </button>

                  <button
                    onClick={() => setCurrentScreen("settings")}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
                  >
                    <div className="bg-gradient-to-br from-[#D8B8E6] to-[#C8A8D6] p-3 rounded-xl mb-3 inline-block shadow-lg">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-gray-800">Ajustes</p>
                    <p className="text-xs text-gray-500">Lembretes</p>
                  </button>
                </div>
              </div>

              {/* Achievement Badge */}
              <div className="bg-gradient-to-r from-[#FFD700]/30 to-[#FFA500]/30 backdrop-blur-sm rounded-2xl p-4 border-2 border-[#FFD700]/50 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] p-3 rounded-xl shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Mãe Dedicada! 🌟</p>
                    <p className="text-sm text-white/80">7 dias de registros consecutivos</p>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="bg-[#B8E6D5]/20 p-2 rounded-lg">
                    <Heart className="h-5 w-5 text-[#6BB6A0]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Dica do Dia</p>
                    <p className="text-sm text-gray-600">
                      Bebês dormem melhor em ambientes escuros e silenciosos. Considere usar cortinas blackout!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sleep Screen */}
          {currentScreen === "sleep" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setCurrentScreen("dashboard")}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-white rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-white">Registro de Sono</h2>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => addSleepRecord("sleep")}
                  className="bg-gradient-to-br from-[#B8E6D5] to-[#A8D5C5] rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                >
                  <Moon className="h-8 w-8 text-white mb-3 mx-auto" />
                  <p className="text-white font-semibold">Dormiu</p>
                </button>

                <button
                  onClick={() => addSleepRecord("wake")}
                  className="bg-gradient-to-br from-[#F4C2D8] to-[#E8B5CC] rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                >
                  <Sun className="h-8 w-8 text-white mb-3 mx-auto" />
                  <p className="text-white font-semibold">Acordou</p>
                </button>
              </div>

              {/* Records List */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4">Histórico Recente</h3>
                <div className="space-y-3">
                  {sleepRecords.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhum registro ainda</p>
                  ) : (
                    sleepRecords.map(record => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${record.type === 'sleep' ? 'bg-[#B8E6D5]/20' : 'bg-[#F4C2D8]/20'}`}>
                            {record.type === 'sleep' ? (
                              <Moon className="h-5 w-5 text-[#6BB6A0]" />
                            ) : (
                              <Sun className="h-5 w-5 text-[#E89BB8]" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {record.type === 'sleep' ? 'Dormiu' : 'Acordou'}
                            </p>
                            <p className="text-sm text-gray-500">{record.date}</p>
                          </div>
                        </div>
                        <p className="font-bold text-gray-700">{record.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Feeding Screen */}
          {currentScreen === "feeding" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setCurrentScreen("dashboard")}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-white rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-white">Cronômetro de Mamadas</h2>
              </div>

              {/* Timer Display */}
              <div className="bg-gradient-to-br from-[#F4C2D8] to-[#E8B5CC] rounded-3xl p-8 shadow-2xl text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <p className="text-6xl font-bold text-white mb-2">{formatTime(timerSeconds)}</p>
                  <p className="text-white/80">minutos</p>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="bg-white text-[#E89BB8] px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="h-5 w-5" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" />
                        Iniciar
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setTimerSeconds(0);
                      setIsTimerRunning(false);
                    }}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                </div>

                {timerSeconds > 0 && (
                  <button
                    onClick={saveFeedingSession}
                    className="mt-4 w-full bg-white text-[#E89BB8] py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Salvar Sessão
                  </button>
                )}
              </div>

              {/* Feeding History */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4">Histórico de Hoje</h3>
                <div className="space-y-3">
                  {todayFeedings.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhuma mamada registrada hoje</p>
                  ) : (
                    todayFeedings.map(session => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#F4C2D8]/20 p-2 rounded-lg">
                            <Droplets className="h-5 w-5 text-[#E89BB8]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{formatTime(session.duration)}</p>
                            <p className="text-sm text-gray-500">{session.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {todayFeedings.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Total hoje: <span className="font-bold text-gray-800">{formatTime(totalFeedingTime)}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Screen */}
          {currentScreen === "notes" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setCurrentScreen("dashboard")}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-white rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-white">Anotações</h2>
              </div>

              {/* Add Note */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Escreva suas observações sobre o bebê..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#B8E6D5] focus:outline-none resize-none"
                  rows={4}
                />
                <button
                  onClick={addNote}
                  disabled={!noteInput.trim()}
                  className="mt-3 w-full bg-gradient-to-r from-[#B8E6D5] to-[#A8D5C5] text-white py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Adicionar Anotação
                </button>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {notes.length === 0 ? (
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhuma anotação ainda</p>
                  </div>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-shadow">
                      <p className="text-gray-800 mb-3">{note.content}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{note.date} às {note.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Settings Screen */}
          {currentScreen === "settings" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setCurrentScreen("dashboard")}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-white rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-white">Configurações</h2>
              </div>

              {/* Reminders Settings */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#6BB6A0]" />
                  Lembretes Personalizados
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800">Mamadas</p>
                      <p className="text-sm text-gray-500">Lembrete a cada 3 horas</p>
                    </div>
                    <button
                      onClick={() => setReminders(prev => ({ ...prev, feeding: !prev.feeding }))}
                      className={`w-14 h-8 rounded-full transition-colors ${
                        reminders.feeding ? 'bg-[#B8E6D5]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                        reminders.feeding ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800">Sono</p>
                      <p className="text-sm text-gray-500">Lembrete de soneca</p>
                    </div>
                    <button
                      onClick={() => setReminders(prev => ({ ...prev, sleep: !prev.sleep }))}
                      className={`w-14 h-8 rounded-full transition-colors ${
                        reminders.sleep ? 'bg-[#B8E6D5]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                        reminders.sleep ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800">Fraldas</p>
                      <p className="text-sm text-gray-500">Lembrete de troca</p>
                    </div>
                    <button
                      onClick={() => setReminders(prev => ({ ...prev, diaper: !prev.diaper }))}
                      className={`w-14 h-8 rounded-full transition-colors ${
                        reminders.diaper ? 'bg-[#B8E6D5]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                        reminders.diaper ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* App Info */}
              <div className="bg-gradient-to-br from-[#B8E6D5]/30 to-[#F4C2D8]/30 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-[#B8E6D5] to-[#F4C2D8] p-4 rounded-2xl inline-block mb-3 shadow-lg">
                    <Baby className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-bold text-white mb-1">Bebê em Rotina</p>
                  <p className="text-sm text-white/80">Versão 1.0.0</p>
                  <p className="text-xs text-white/60 mt-3">
                    Desenvolvido com ❤️ para mães dedicadas
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-white/20 px-4 py-3 shadow-2xl">
          <div className="max-w-md mx-auto flex items-center justify-around">
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                currentScreen === "dashboard" 
                  ? 'bg-[#B8E6D5]/20 text-[#6BB6A0]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs font-medium">Início</span>
            </button>

            <button
              onClick={() => setCurrentScreen("sleep")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                currentScreen === "sleep" 
                  ? 'bg-[#B8E6D5]/20 text-[#6BB6A0]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Moon className="h-6 w-6" />
              <span className="text-xs font-medium">Sono</span>
            </button>

            <button
              onClick={() => setCurrentScreen("feeding")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                currentScreen === "feeding" 
                  ? 'bg-[#F4C2D8]/20 text-[#E89BB8]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock className="h-6 w-6" />
              <span className="text-xs font-medium">Mamada</span>
            </button>

            <button
              onClick={() => setCurrentScreen("notes")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                currentScreen === "notes" 
                  ? 'bg-[#A8C5E8]/20 text-[#7AA5D8]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-6 w-6" />
              <span className="text-xs font-medium">Notas</span>
            </button>

            <button
              onClick={() => setCurrentScreen("settings")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                currentScreen === "settings" 
                  ? 'bg-[#D8B8E6]/20 text-[#B898D6]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="h-6 w-6" />
              <span className="text-xs font-medium">Ajustes</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
