"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Chat from "@/app/components/Chat";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import LanguageSelector from "@/app/components/LanguageSelector";
import { useLanguage } from "@/app/contexts/LanguageContext";
import {
  Crown,
  Sparkles,
  ArrowLeft,
  Send,
  SkipForward,
  Maximize,
  Minimize,
} from "lucide-react";

export default function GamePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const { roomId: roomIdString } = use(params);
  const roomId = roomIdString as Id<"rooms">;
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [clueWord, setClueWord] = useState("");
  const [clueNumber, setClueNumber] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const roomData = useQuery(api.rooms.getRoom, { roomId });
  const giveClue = useMutation(api.game.giveClue);
  const makeGuess = useMutation(api.game.makeGuess);
  const endTurn = useMutation(api.game.endTurn);

  useEffect(() => {
    const id = sessionStorage.getItem("playerId");
    if (!id) {
      router.push("/");
    } else {
      setPlayerId(id);
    }
  }, [router]);

  // Wait for playerId to be loaded from sessionStorage
  if (!playerId) {
    return <LoadingSpinner />;
  }

  if (!roomData || !roomData.game) {
    return <LoadingSpinner />;
  }

  const { room, players, game } = roomData;
  const currentPlayer = players.find((p) => p.playerId === playerId);

  if (!currentPlayer) {
    return <LoadingSpinner />;
  }

  const isSpymaster = currentPlayer.role === "spymaster";
  const isMyTurn = currentPlayer.team === game.currentTurn;
  const canGuess =
    !isSpymaster && isMyTurn && game.currentClue && game.guessesRemaining > 0;

  const handleGiveClue = async () => {
    if (!clueWord.trim()) {
      alert("Please enter a valid clue word");
      return;
    }

    // Allow 0-9 or 99 (representing ∞)
    if (clueNumber < 0 || (clueNumber > 9 && clueNumber !== 99)) {
      alert("Please enter a valid number (0-9 or ∞)");
      return;
    }

    try {
      await giveClue({
        roomId,
        playerId,
        word: clueWord.trim(),
        number: clueNumber,
      });
      setClueWord("");
      setClueNumber(1);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to give clue");
    }
  };

  const handleGuess = async (wordIndex: number) => {
    if (!canGuess) return;

    try {
      await makeGuess({
        roomId,
        playerId,
        wordIndex,
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to make guess");
    }
  };

  const handleEndTurn = async () => {
    try {
      await endTurn({ roomId, playerId });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to end turn");
    }
  };

  const getCardColor = (card: (typeof game.board)[0]) => {
    // If card is revealed, EVERYONE sees the full color background
    if (card.revealed) {
      if (card.color === "red") {
        return "bg-red-600 text-white border-red-500 border-2";
      }
      if (card.color === "blue") {
        return "bg-blue-600 text-white border-blue-500 border-2";
      }
      if (card.color === "neutral") {
        return "bg-amber-100 text-gray-900 border-amber-300 border-2";
      }
      if (card.color === "assassin") {
        return "bg-gray-800 text-white border-gray-600 border-2";
      }
    }

    // SPYMASTER sees colored borders (thick edges), dark background
    if (isSpymaster) {
      if (card.color === "red") {
        return "bg-gray-900 text-white border-red-500 border-[10px]";
      }
      if (card.color === "blue") {
        return "bg-gray-900 text-white border-blue-500 border-[10px]";
      }
      if (card.color === "neutral") {
        return "bg-gray-900 text-white border-amber-400 border-[10px]";
      }
      if (card.color === "assassin") {
        return "bg-gray-900 text-white border-gray-600 border-[10px]";
      }
    }

    // OPERATIVES see all black cards
    return "bg-gray-900 text-white border-gray-700 border-2 hover:bg-gray-800 cursor-pointer hover:shadow-xl";
  };

  const getCardOpacity = (card: (typeof game.board)[0]) => {
    return card.revealed ? "opacity-60" : "";
  };

  // Winner screen
  if (game.winner) {
    const winnerTeam =
      game.winner === "assassin"
        ? game.currentTurn === "red"
          ? "blue"
          : "red"
        : game.winner;

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-950 border border-gray-900 rounded-2xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <div
            className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              winnerTeam === "red"
                ? "bg-red-500/20 border border-red-500/30"
                : "bg-blue-500/20 border border-blue-500/30"
            }`}
          >
            <span className="text-6xl">
              {winnerTeam === "red" ? "🔴" : "🔵"}
            </span>
          </div>
          <h1
            className={`text-5xl font-bold mb-4 ${winnerTeam === "red" ? "text-red-400" : "text-blue-400"}`}
          >
            {t("game.winner")}: {winnerTeam.toUpperCase()} {t("game.wins")}
          </h1>
          {game.winner === "assassin" && (
            <p className="text-xl text-gray-400 mb-6">{t("game.assassin")}</p>
          )}
          <div className="space-y-3 mt-8">
            <button
              onClick={() => router.push(`/lobby/${roomId}`)}
              className="w-full bg-white text-black font-bold py-4 px-8 rounded-xl text-lg hover:bg-gray-200 transition-all duration-200"
            >
              {t("game.backToLobby")}
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-black border border-gray-900 hover:border-gray-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/lobby/${roomId}`)}
                className="w-10 h-10 bg-gray-950 border border-gray-900 rounded-lg flex items-center justify-center hover:border-gray-700 transition-all duration-200"
                title="Back to lobby"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {t("game.title")}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {room.code} • {currentPlayer.name}
                  </p>
                </div>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Player Status */}
        <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${currentPlayer.team === "red" ? "bg-red-500" : "bg-blue-500"}`}
              ></div>
              <span className="text-white font-medium">
                You are:{" "}
                <span
                  className={
                    currentPlayer.team === "red"
                      ? "text-red-400"
                      : "text-blue-400"
                  }
                >
                  {currentPlayer.team?.toUpperCase() || "UNASSIGNED"}
                </span>{" "}
                Team
              </span>
              {isSpymaster && (
                <span className="px-2 py-1 bg-yellow-950/50 border border-yellow-900/50 rounded text-xs text-yellow-400 font-medium flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  SPYMASTER
                </span>
              )}
              {!isSpymaster && (
                <span className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs text-gray-400 font-medium">
                  OPERATIVE
                </span>
              )}
            </div>
            <div
              className={`text-sm ${isMyTurn ? "text-green-400" : "text-gray-500"}`}
            >
              {isMyTurn ? "🟢 Your Turn" : "⏳ Waiting..."}
            </div>
          </div>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 hover:border-gray-800 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔴</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">
                    {t("game.redTeam")}
                  </div>
                  <div className="text-3xl font-bold text-red-400">
                    {game.redRemaining}
                  </div>
                </div>
              </div>
              {game.currentTurn === "red" && (
                <div className="px-3 py-1 bg-red-950/50 border border-red-900/50 rounded-full text-xs text-red-400 font-medium">
                  {t("game.currentTurn")}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 hover:border-gray-800 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔵</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">
                    {t("game.blueTeam")}
                  </div>
                  <div className="text-3xl font-bold text-blue-400">
                    {game.blueRemaining}
                  </div>
                </div>
              </div>
              {game.currentTurn === "blue" && (
                <div className="px-3 py-1 bg-blue-950/50 border border-blue-900/50 rounded-full text-xs text-blue-400 font-medium">
                  {t("game.currentTurn")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Clue Display - Everyone sees this */}
        {game.currentClue && (
          <div
            className={`bg-gray-950 border rounded-xl p-6 mb-6 hover:border-gray-800 transition-all duration-300 ${
              game.currentTurn === "red"
                ? "border-red-900/50 bg-red-950/10"
                : "border-blue-900/50 bg-blue-950/10"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Current Clue</div>
                <div className="text-3xl font-bold text-white">
                  {game.currentClue.word}{" "}
                  <span
                    className={
                      game.currentTurn === "red"
                        ? "text-red-400"
                        : "text-blue-400"
                    }
                  >
                    {game.currentClue.number === 99
                      ? "∞"
                      : game.currentClue.number}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {game.guessesRemaining >= 999
                    ? "Unlimited"
                    : game.guessesRemaining}{" "}
                  guesses remaining
                </div>
              </div>
              {isMyTurn && !isSpymaster && game.currentClue && (
                <button
                  onClick={handleEndTurn}
                  className="flex items-center gap-2 px-6 py-3 bg-black border border-gray-900 hover:border-gray-700 rounded-lg transition-all duration-200"
                >
                  <SkipForward className="w-4 h-4" />
                  End Turn
                </button>
              )}
            </div>
          </div>
        )}

        {/* Spymaster Input - Only for spymaster on their turn */}
        {isSpymaster && isMyTurn && !game.currentClue && (
          <div
            className={`bg-gray-950 border-4 rounded-xl p-6 mb-6 ${
              currentPlayer.team === "red"
                ? "border-red-500 bg-red-950/20"
                : "border-blue-500 bg-blue-950/20"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Crown
                className={`w-6 h-6 ${currentPlayer.team === "red" ? "text-red-400" : "text-blue-400"}`}
              />
              <div className="font-bold text-white text-lg">
                Give a Clue to Your Team
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-4">
              Enter one word and a number (0-9, or use 0/∞ for special clues).
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={clueWord}
                  onChange={(e) => setClueWord(e.target.value)}
                  placeholder="One word clue (e.g., ANIMAL)"
                  aria-label="Clue word"
                  className="flex-1 px-4 py-3 bg-black border border-gray-900 rounded-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all duration-200 text-lg font-medium"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={clueNumber === 99 ? "" : clueNumber}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 0 && val <= 9) {
                        setClueNumber(val);
                      }
                    }}
                    min="0"
                    max="9"
                    placeholder={clueNumber === 99 ? "∞" : undefined}
                    aria-label="Number of related words"
                    className="w-28 px-4 py-3 bg-black border border-gray-900 rounded-lg text-white text-center focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all duration-200 text-lg font-bold"
                  />
                  <button
                    onClick={handleGiveClue}
                    disabled={!clueWord.trim()}
                    className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    Send Clue
                  </button>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-gray-500">Quick select:</span>
                <button
                  onClick={() => setClueNumber(0)}
                  className={`px-3 py-1 rounded border transition-all ${clueNumber === 0 ? "bg-yellow-950/50 border-yellow-900/50 text-yellow-400" : "bg-black border-gray-900 text-gray-500 hover:text-gray-300"}`}
                >
                  0 (unlimited, non-related)
                </button>
                <button
                  onClick={() => setClueNumber(99)}
                  className={`px-3 py-1 rounded border transition-all ${clueNumber === 99 ? "bg-purple-950/50 border-purple-900/50 text-purple-400" : "bg-black border-gray-900 text-gray-500 hover:text-gray-300"}`}
                >
                  ∞ (all remaining)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Role Indicator */}
        {isSpymaster && (
          <div
            className={`bg-gray-950 border rounded-xl p-4 mb-6 ${
              currentPlayer.team === "red"
                ? "border-red-900/50 bg-red-950/10"
                : "border-blue-900/50 bg-blue-950/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <Crown
                className={`w-6 h-6 ${currentPlayer.team === "red" ? "text-red-400" : "text-blue-400"}`}
              />
              <div>
                <div className="font-bold text-white text-lg">
                  You are the Spymaster
                </div>
                <div className="text-sm text-gray-400">
                  You can see all card colors. Give clues to help your team!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Board - 5x5 Grid */}
        <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Game Board</h3>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-2 px-4 py-2 bg-black border border-gray-900 hover:border-gray-700 rounded-lg transition-all duration-200 text-sm text-gray-400 hover:text-white"
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-4 h-4" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize className="w-4 h-4" />
                  Fullscreen
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {game.board.map((card, index) => (
              <button
                key={index}
                onClick={() => handleGuess(index)}
                disabled={!canGuess || card.revealed}
                className={`
                  aspect-square p-2 sm:p-3 rounded-lg font-bold text-xs sm:text-sm md:text-base
                  transition-all duration-200
                  ${getCardColor(card)}
                  ${getCardOpacity(card)}
                  ${!canGuess || card.revealed ? "cursor-default" : "hover:scale-105 hover:shadow-lg"}
                `}
              >
                <div className="flex items-center justify-center h-full text-center leading-tight uppercase">
                  {card.word}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fullscreen Board Overlay */}
        {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-black overflow-auto">
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-6xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-2 rounded-lg text-sm ${game.currentTurn === "red" ? "bg-red-950/50 border border-red-900/50 text-red-400" : "bg-blue-950/50 border border-blue-900/50 text-blue-400"}`}
                    >
                      <span className="font-bold">
                        Current Turn: {game.currentTurn.toUpperCase()}
                      </span>
                    </div>
                    {game.currentClue && (
                      <div className="px-3 py-2 bg-gray-950 border border-gray-900 rounded-lg">
                        <span className="text-white font-bold text-lg">
                          {game.currentClue.word}{" "}
                          <span
                            className={
                              game.currentTurn === "red"
                                ? "text-red-400"
                                : "text-blue-400"
                            }
                          >
                            {game.currentClue.number}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm"
                  >
                    <Minimize className="w-4 h-4" />
                    Exit
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {game.board.map((card, index) => (
                    <button
                      key={index}
                      onClick={() => handleGuess(index)}
                      disabled={!canGuess || card.revealed}
                      className={`
                        aspect-square p-2 rounded-lg font-bold text-sm
                        transition-all duration-200
                        ${getCardColor(card)}
                        ${getCardOpacity(card)}
                        ${!canGuess || card.revealed ? "cursor-default" : "hover:scale-105 hover:shadow-xl"}
                      `}
                    >
                      <div className="flex items-center justify-center h-full text-center leading-tight uppercase wrap-break-word">
                        {card.word}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clue History */}
        {game.clueHistory.length > 0 && (
          <div className="bg-gray-950 border border-gray-900 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4 text-white">Clue History</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {game.clueHistory
                .slice()
                .reverse()
                .map((clue, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      clue.team === "red"
                        ? "bg-red-950/20 border-red-900/50"
                        : "bg-blue-950/20 border-blue-900/50"
                    }`}
                  >
                    <span
                      className={
                        clue.team === "red" ? "text-red-400" : "text-blue-400"
                      }
                    >
                      {clue.team.toUpperCase()}:
                    </span>{" "}
                    <span className="font-bold text-white">
                      {clue.word} {clue.number}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Chat Component */}
      <Chat roomId={roomId} playerId={playerId} />
    </div>
  );
}
