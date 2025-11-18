"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessageCircle, X, Send } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface ChatProps {
  roomId: Id<"rooms">;
  playerId: string;
}

export default function Chat({ roomId, playerId }: ChatProps) {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(api.game.getMessages, { roomId });
  const sendMessage = useMutation(api.game.sendMessage);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage({
        roomId,
        playerId,
        message: message.trim(),
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-200 z-50 border border-gray-900"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        {messages && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {messages.length > 9 ? "9+" : messages.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-black border border-gray-900 rounded-xl shadow-2xl flex flex-col z-50 max-h-128">
      <div className="flex justify-between items-center p-4 border-b border-gray-900 bg-gray-950">
        <h3 className="font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {t("chat.title")}
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-900 transition-all duration-200"
          aria-label="Close chat"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 bg-black">
        {messages && messages.length > 0 ? (
          messages
            .slice()
            .reverse()
            .map((msg, index) => (
              <div
                key={index}
                className="bg-gray-950 border border-gray-900 rounded-lg p-3 hover:border-gray-800 transition-all duration-200"
              >
                <div className="font-semibold text-sm text-white mb-1">
                  {msg.playerName}
                </div>
                <div className="text-sm text-gray-300">{msg.message}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center text-gray-600 text-sm py-8">
            No messages yet
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 border-t border-gray-900 bg-gray-950"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("chat.typeMessage")}
            className="flex-1 px-4 py-2 bg-black border border-gray-900 rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/40 text-white placeholder-gray-600 transition-all duration-200"
          />
          <button
            type="submit"
            className="w-10 h-10 bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
