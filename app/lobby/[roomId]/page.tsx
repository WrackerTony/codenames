"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import LanguageSelector from "@/app/components/LanguageSelector";
import { useLanguage } from "@/app/contexts/LanguageContext";
import {
  Users,
  Crown,
  Eye,
  Copy,
  Check,
  Sparkles,
  ArrowLeft,
  Play,
} from "lucide-react";

export default function LobbyPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const { roomId: roomIdString } = use(params);
  const roomId = roomIdString as Id<"rooms">;
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const roomData = useQuery(api.rooms.getRoom, roomId ? { roomId } : "skip");
  const updateTeamRole = useMutation(api.rooms.updatePlayerTeamRole);
  const startGame = useMutation(api.rooms.startGame);

  useEffect(() => {
    const id = sessionStorage.getItem("playerId");
    if (!id) {
      router.push("/");
    } else {
      setPlayerId(id);
    }
  }, [router]);

  useEffect(() => {
    if (roomData?.room?.status === "playing") {
      router.push(`/game/${roomId}`);
    }
  }, [roomData, roomId, router]);

  if (!roomData || !playerId) {
    return <LoadingSpinner />;
  }

  const { room, players } = roomData;
  const isHost = room.hostId === playerId;

  const redTeam = players.filter((p) => p.team === "red");
  const blueTeam = players.filter((p) => p.team === "blue");
  const spectators = players.filter((p) => p.team === "spectator");
  const unassigned = players.filter((p) => !p.team);

  const redSpymaster = redTeam.find((p) => p.role === "spymaster");
  const blueSpymaster = blueTeam.find((p) => p.role === "spymaster");

  const canStart =
    redTeam.length >= 2 &&
    blueTeam.length >= 2 &&
    redSpymaster &&
    blueSpymaster;

  const handleTeamRoleChange = async (
    team: "red" | "blue" | "spectator",
    role: "spymaster" | "operative"
  ) => {
    if (!playerId) return;
    try {
      await updateTeamRole({
        playerId,
        roomId,
        team,
        role,
      });
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to update team/role"
      );
    }
  };

  const handleStartGame = async () => {
    if (!playerId) return;
    try {
      await startGame({ roomId, playerId });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to start game");
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentPlayer = players.find((p) => p.playerId === playerId);

  if (!currentPlayer) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="w-10 h-10 bg-gray-950 border border-gray-900 rounded-lg flex items-center justify-center hover:border-gray-700 transition-all duration-200"
              title="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {t("lobby.title")}
                </h1>
                <p className="text-xs text-gray-500">
                  {players.length} {t("home.players")}
                </p>
              </div>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Room Code Card */}
        <div className="bg-gray-950 border border-gray-900 rounded-xl p-6 mb-6 hover:border-gray-800 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                {t("lobby.roomCode")}
              </div>
              <div className="text-4xl font-bold font-mono tracking-wider text-white">
                {room.code}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {t("lobby.shareCode")}
              </div>
            </div>
            <button
              onClick={copyRoomCode}
              className="flex items-center gap-2 px-4 py-2 bg-black border border-gray-900 rounded-lg hover:border-gray-700 transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {!canStart && (
          <div className="bg-yellow-950/30 border border-yellow-900/50 text-yellow-400 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div className="flex flex-col gap-1">
                <span className="font-medium">Game Requirements:</span>
                <ul className="text-sm space-y-1">
                  <li>
                    • Each team needs at least 2 players (minimum 4 players
                    total)
                  </li>
                  <li>• Each team needs 1 spymaster</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Red Team */}
          <div className="bg-gray-950 border border-gray-900 rounded-xl overflow-hidden hover:border-gray-800 transition-all duration-300">
            <div className="bg-linear-to-br from-red-500/10 to-red-600/5 border-b border-gray-900 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🔴</span>
                  </div>
                  {t("lobby.redTeam")}
                </h2>
                <span className="px-3 py-1 bg-red-950/50 border border-red-900/50 rounded-full text-sm text-red-400">
                  {redTeam.length} {t("home.players")}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {redTeam.map((player) => (
                <div
                  key={player._id}
                  className={`bg-black border rounded-lg p-3 flex items-center justify-between transition-all duration-200 ${
                    player.playerId === playerId
                      ? "border-red-500/50 bg-red-950/20"
                      : "border-gray-900 hover:border-gray-800"
                  }`}
                >
                  <span className="font-medium text-white flex items-center gap-2">
                    {player.role === "spymaster" && (
                      <Crown className="w-4 h-4 text-red-400" />
                    )}
                    {player.name}
                  </span>
                  <span className="text-xs px-2 py-1 bg-red-900/30 text-red-300 rounded-md">
                    {player.role === "spymaster"
                      ? t("lobby.spymaster")
                      : t("lobby.operative")}
                  </span>
                </div>
              ))}
              {redTeam.length === 0 && (
                <div className="text-gray-600 text-center py-8 text-sm">
                  No players yet
                </div>
              )}
            </div>

            <div className="p-4 space-y-2 border-t border-gray-900">
              <button
                onClick={() => handleTeamRoleChange("red", "spymaster")}
                disabled={!!redSpymaster}
                className="w-full group bg-black border border-gray-900 hover:border-red-500/50 hover:bg-red-950/20 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4 text-red-400" />
                {t("lobby.spymaster")} {redSpymaster && "✓"}
              </button>
              <button
                onClick={() => handleTeamRoleChange("red", "operative")}
                className="w-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 text-red-400 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                {t("lobby.operative")}
              </button>
            </div>
          </div>

          {/* Blue Team */}
          <div className="bg-gray-950 border border-gray-900 rounded-xl overflow-hidden hover:border-gray-800 transition-all duration-300">
            <div className="bg-linear-to-br from-blue-500/10 to-blue-600/5 border-b border-gray-900 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🔵</span>
                  </div>
                  {t("lobby.blueTeam")}
                </h2>
                <span className="px-3 py-1 bg-blue-950/50 border border-blue-900/50 rounded-full text-sm text-blue-400">
                  {blueTeam.length} {t("home.players")}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {blueTeam.map((player) => (
                <div
                  key={player._id}
                  className={`bg-black border rounded-lg p-3 flex items-center justify-between transition-all duration-200 ${
                    player.playerId === playerId
                      ? "border-blue-500/50 bg-blue-950/20"
                      : "border-gray-900 hover:border-gray-800"
                  }`}
                >
                  <span className="font-medium text-white flex items-center gap-2">
                    {player.role === "spymaster" && (
                      <Crown className="w-4 h-4 text-blue-400" />
                    )}
                    {player.name}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-300 rounded-md">
                    {player.role === "spymaster"
                      ? t("lobby.spymaster")
                      : t("lobby.operative")}
                  </span>
                </div>
              ))}
              {blueTeam.length === 0 && (
                <div className="text-gray-600 text-center py-8 text-sm">
                  No players yet
                </div>
              )}
            </div>

            <div className="p-4 space-y-2 border-t border-gray-900">
              <button
                onClick={() => handleTeamRoleChange("blue", "spymaster")}
                disabled={!!blueSpymaster}
                className="w-full group bg-black border border-gray-900 hover:border-blue-500/50 hover:bg-blue-950/20 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4 text-blue-400" />
                {t("lobby.spymaster")} {blueSpymaster && "✓"}
              </button>
              <button
                onClick={() => handleTeamRoleChange("blue", "operative")}
                className="w-full bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 text-blue-400 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                {t("lobby.operative")}
              </button>
            </div>
          </div>
        </div>

        {/* Unassigned Players */}
        {unassigned.length > 0 && (
          <div className="bg-gray-950 border border-gray-900 rounded-xl p-6 mb-6 hover:border-gray-800 transition-all duration-300">
            <h3 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Unassigned Players ({unassigned.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {unassigned.map((player) => (
                <span
                  key={player._id}
                  className="px-4 py-2 bg-black border border-gray-900 rounded-lg text-sm text-gray-200 hover:border-gray-700 transition-all duration-200"
                >
                  {player.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Spectators */}
        {spectators.length > 0 && (
          <div className="bg-gray-950 border border-gray-900 rounded-xl p-6 mb-6 hover:border-gray-800 transition-all duration-300">
            <h3 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {t("lobby.spectators")} ({spectators.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {spectators.map((player) => (
                <span
                  key={player._id}
                  className="px-4 py-2 bg-black border border-gray-900 rounded-lg text-sm text-gray-200 hover:border-gray-700 transition-all duration-200"
                >
                  {player.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {(isHost || room.isPublic) && (
            <button
              onClick={handleStartGame}
              disabled={!canStart}
              className="w-full group bg-linear-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-800 disabled:to-gray-900 flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              {t("lobby.startGame")}
            </button>
          )}

          {!isHost && !room.isPublic && (
            <div className="text-center py-8 text-gray-500">
              Waiting for host to start the game...
            </div>
          )}

          <button
            onClick={() => router.push("/")}
            className="w-full bg-black border border-gray-900 hover:border-gray-700 hover:bg-gray-950 text-gray-400 hover:text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
          >
            {t("lobby.leaveRoom")}
          </button>
        </div>
      </main>
    </div>
  );
}
