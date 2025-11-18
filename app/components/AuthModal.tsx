"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { t } = useLanguage();

  // Update mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
    setError("");
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (username.length < 3) {
          throw new Error("Username must be at least 3 characters");
        }
        await register(email, password, username);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full max-w-md bg-gray-950 border border-gray-900 rounded-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          {t(mode === "login" ? "auth.login" : "auth.register")}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t("auth.username")}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder={t("auth.usernamePlaceholder")}
                required
                minLength={3}
                maxLength={20}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t("auth.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder={t("auth.emailPlaceholder")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t("auth.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder={t("auth.passwordPlaceholder")}
              required
              minLength={8}
            />
            {mode === "register" && (
              <p className="mt-1 text-xs text-gray-500">
                At least 8 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {loading
              ? t("common.loading")
              : t(
                  mode === "login" ? "auth.loginButton" : "auth.registerButton"
                )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-400">
          {mode === "login" ? (
            <>
              {t("auth.dontHaveAccount")}{" "}
              <button
                onClick={() => setMode("register")}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                {t("auth.switchToRegister")}
              </button>
            </>
          ) : (
            <>
              {t("auth.alreadyHaveAccount")}{" "}
              <button
                onClick={() => setMode("login")}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                {t("auth.switchToLogin")}
              </button>
            </>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-400 text-sm"
          >
            {t("auth.continueAsGuest")}
          </button>
        </div>
      </div>
    </div>
  );
}
