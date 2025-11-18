"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowLeft,
  UserPlus,
  UserCheck,
  UserX,
  Trophy,
  Target,
  Users,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const friends = useQuery(api.friends.getFriends, token ? { token } : "skip");
  const pendingRequests = useQuery(
    api.friends.getPendingRequests,
    token ? { token } : "skip"
  );
  const searchResults = useQuery(
    api.auth.searchUsers,
    searchTerm.length >= 2 ? { searchTerm } : "skip"
  );

  const sendFriendRequest = useMutation(api.friends.sendFriendRequest);
  const acceptFriendRequest = useMutation(api.friends.acceptFriendRequest);
  const rejectFriendRequest = useMutation(api.friends.rejectFriendRequest);
  const removeFriend = useMutation(api.friends.removeFriend);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user || !token) {
    return null;
  }

  const handleSendRequest = async (username: string) => {
    try {
      setError("");
      setSuccess("");
      await sendFriendRequest({ token, receiverUsername: username });
      setSuccess(`Friend request sent to ${username}!`);
      setSearchTerm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send request");
    }
  };

  const handleAcceptRequest = async (requestId: Id<"friendRequests">) => {
    try {
      setError("");
      await acceptFriendRequest({ token, requestId });
      setSuccess("Friend request accepted!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestId: Id<"friendRequests">) => {
    try {
      setError("");
      await rejectFriendRequest({ token, requestId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject request");
    }
  };

  const handleRemoveFriend = async (friendId: Id<"users">) => {
    try {
      setError("");
      await removeFriend({ token, friendId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove friend");
    }
  };

  const winRate =
    user.gamesWon + user.gamesLost > 0
      ? Math.round((user.gamesWon / (user.gamesWon + user.gamesLost)) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("profile.backToHome")}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-950/30 border border-red-900/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-950/30 border border-green-900/50 rounded-lg text-green-400">
            {success}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-950 border border-gray-900 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">{user.username}</h2>
              <p className="text-gray-400 text-sm mb-6">{user.email}</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-400">{t("profile.points")}</span>
                  </div>
                  <span className="text-xl font-bold">{user.points}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-black rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-500" />
                    <span className="text-gray-400">
                      {t("profile.gamesWon")}
                    </span>
                  </div>
                  <span className="text-xl font-bold">{user.gamesWon}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-black rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-red-500" />
                    <span className="text-gray-400">
                      {t("profile.gamesLost")}
                    </span>
                  </div>
                  <span className="text-xl font-bold">{user.gamesLost}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-black rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-400">
                      {t("profile.winRate")}
                    </span>
                  </div>
                  <span className="text-xl font-bold">{winRate}%</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-black rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-400">
                      {t("profile.friends")}
                    </span>
                  </div>
                  <span className="text-xl font-bold">
                    {friends?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Friends & Requests */}
          <div className="lg:col-span-2 space-y-6">
            {/* Friend Requests */}
            {pendingRequests && pendingRequests.length > 0 && (
              <div className="bg-gray-950 border border-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">
                  {t("profile.pendingRequests")}
                </h3>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.requestId}
                      className="flex items-center justify-between p-4 bg-black rounded-lg"
                    >
                      <span className="font-medium">
                        {request.senderUsername}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.requestId)}
                          className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                          aria-label="Accept request"
                        >
                          <UserCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.requestId)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          aria-label="Reject request"
                        >
                          <UserX className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Friends */}
            <div className="bg-gray-950 border border-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">
                {t("profile.addFriends")}
              </h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("profile.searchPlaceholder")}
                className="w-full px-4 py-3 bg-black border border-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-600 transition-all"
              />

              {searchResults && searchResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {searchResults
                    .filter((result) => result.username !== user.username)
                    .map((result) => (
                      <div
                        key={result.userId}
                        className="flex items-center justify-between p-4 bg-black rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{result.username}</div>
                          <div className="text-sm text-gray-400">
                            {result.points} points
                          </div>
                        </div>
                        <button
                          onClick={() => handleSendRequest(result.username)}
                          className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                          aria-label="Send friend request"
                        >
                          <UserPlus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Friends List */}
            <div className="bg-gray-950 border border-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">{t("profile.friends")}</h3>
              {friends && friends.length > 0 ? (
                <div className="space-y-3">
                  {friends.map((friend) => (
                    <div
                      key={friend.userId}
                      className="flex items-center justify-between p-4 bg-black rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{friend.username}</div>
                        <div className="text-sm text-gray-400">
                          {friend.points} pts • {friend.gamesWon}W{" "}
                          {friend.gamesLost}L
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFriend(friend.userId)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        aria-label={t("profile.remove")}
                      >
                        <UserX className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  {t("profile.noFriends")}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
