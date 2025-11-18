"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LanguageSelector from "./components/LanguageSelector";
import { useLanguage } from "./contexts/LanguageContext";
import { Users, Lock, Hash, Sparkles, Play, Crown } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createRoom = useMutation(api.rooms.createRoom);
  const joinRoomByCode = useMutation(api.rooms.joinRoomByCode);
  const joinPublicRoom = useMutation(api.rooms.joinPublicRoom);
  const publicRooms = useQuery(api.rooms.getPublicRooms, { language });

  const handleCreatePrivate = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createRoom({
        isPublic: false,
        language,
        playerName: playerName.trim(),
      });

      sessionStorage.setItem("playerId", result.playerId);
      sessionStorage.setItem("playerName", playerName.trim());

      router.push(`/lobby/${result.roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPrivate = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await joinRoomByCode({
        code: roomCode.trim().toUpperCase(),
        playerName: playerName.trim(),
      });

      sessionStorage.setItem("playerId", result.playerId);
      sessionStorage.setItem("playerName", playerName.trim());

      router.push(`/lobby/${result.roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePublic = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createRoom({
        isPublic: true,
        language,
        playerName: playerName.trim(),
      });

      sessionStorage.setItem("playerId", result.playerId);
      sessionStorage.setItem("playerName", playerName.trim());

      router.push(`/lobby/${result.roomId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create public room"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPublic = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await joinPublicRoom({
        language,
        playerName: playerName.trim(),
      });

      sessionStorage.setItem("playerId", result.playerId);
      sessionStorage.setItem("playerName", playerName.trim());

      router.push(`/lobby/${result.roomId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to join public room"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await joinPublicRoom({
        language,
        playerName: playerName.trim(),
      });

      sessionStorage.setItem("playerId", result.playerId);
      sessionStorage.setItem("playerName", playerName.trim());

      router.push(`/lobby/${roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t("home.title")}
              </h1>
              <p className="text-xs text-gray-500">{t("home.subtitle")}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-950 border border-gray-900 rounded-xl p-6 hover:border-gray-800 transition-all duration-300">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                <Users className="w-4 h-4" />
                {t("home.enterName")}
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={t("home.enterName")}
                className="w-full px-4 py-3 bg-black border border-gray-900 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/40 text-white placeholder-gray-600 transition-all duration-200"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-950/30 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={handleCreatePrivate}
                disabled={loading}
                className="group bg-gray-950 border border-gray-900 rounded-xl p-6 hover:border-gray-700 hover:bg-gray-900/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Lock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      Create Private Room
                    </h3>
                    <p className="text-sm text-gray-500">
                      Private room with custom code
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleCreatePublic}
                disabled={loading}
                className="group bg-gray-950 border border-gray-900 rounded-xl p-6 hover:border-gray-700 hover:bg-gray-900/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      Create Public Room
                    </h3>
                    <p className="text-sm text-gray-500">
                      Open to all {language.toUpperCase()} players
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleJoinPublic}
                disabled={loading}
                className="group bg-gray-950 border border-gray-900 rounded-xl p-6 hover:border-gray-700 hover:bg-gray-900/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      {t("home.joinPublic")}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quick match with {language.toUpperCase()} players
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="bg-gray-950 border border-gray-900 rounded-xl p-6 hover:border-gray-800 transition-all duration-300">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                <Hash className="w-4 h-4" />
                {t("home.joinByCode")}
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder={t("home.enterCode")}
                  className="flex-1 px-4 py-3 bg-black border border-gray-900 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/40 uppercase text-white placeholder-gray-600 font-mono tracking-wider transition-all duration-200"
                  disabled={loading}
                  maxLength={6}
                />
                <button
                  onClick={handleJoinPrivate}
                  disabled={loading || !roomCode.trim()}
                  className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("home.join")}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-950 border border-gray-900 rounded-xl p-6 sticky top-24">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                {t("home.publicRooms")}
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {!publicRooms ? (
                  <div className="text-center py-8 text-gray-600">
                    {t("common.loading")}
                  </div>
                ) : publicRooms.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    {t("home.noPublicRooms")}
                  </div>
                ) : (
                  publicRooms.map((room) => (
                    <div
                      key={room._id}
                      className="bg-black border border-gray-900 rounded-lg p-4 hover:border-gray-700 transition-all duration-200 cursor-pointer group"
                      onClick={() => handleJoinRoom(room._id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-gray-500">
                          {room.code}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>
                            {room.playerCount} {t("home.players")}
                          </span>
                        </div>
                      </div>
                      <button className="w-full px-3 py-2 bg-gray-900 group-hover:bg-gray-800 text-white text-sm rounded-md transition-all duration-200">
                        {t("home.join")}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-950 border border-gray-900 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">How to Play</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-400">
            <div>
              <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center mb-2">
                <span className="text-red-400 font-bold">1</span>
              </div>
              <p>Divide into two teams (Red & Blue)</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center mb-2">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <p>Each team picks one Spymaster</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center mb-2">
                <span className="text-purple-400 font-bold">3</span>
              </div>
              <p>Guess words based on clues</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
