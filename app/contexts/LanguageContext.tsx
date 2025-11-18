"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "cs" | "es" | "fr" | "de";

type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

const translations: Translations = {
  // Home Page
  "home.title": {
    en: "Codenames",
    cs: "Kódová jména",
    es: "Nombres en clave",
    fr: "Noms de code",
    de: "Codenames",
  },
  "home.subtitle": {
    en: "Team word game • Strategy & deduction",
    cs: "Týmová slovní hra • Strategie a dedukce",
    es: "Juego de palabras en equipo • Estrategia y deducción",
    fr: "Jeu de mots en équipe • Stratégie et déduction",
    de: "Teamwortspiel • Strategie und Deduktion",
  },
  "home.createRoom": {
    en: "Create Private Room",
    cs: "Vytvořit soukromou místnost",
    es: "Crear sala privada",
    fr: "Créer une salle privée",
    de: "Privaten Raum erstellen",
  },
  "home.joinPublic": {
    en: "Join Public Game",
    cs: "Připojit se k veřejné hře",
    es: "Unirse a juego público",
    fr: "Rejoindre une partie publique",
    de: "Öffentliches Spiel beitreten",
  },
  "home.joinByCode": {
    en: "Join by Code",
    cs: "Připojit se kódem",
    es: "Unirse por código",
    fr: "Rejoindre par code",
    de: "Per Code beitreten",
  },
  "home.enterName": {
    en: "Enter your name",
    cs: "Zadejte své jméno",
    es: "Ingrese su nombre",
    fr: "Entrez votre nom",
    de: "Geben Sie Ihren Namen ein",
  },
  "home.enterCode": {
    en: "Room code",
    cs: "Kód místnosti",
    es: "Código de sala",
    fr: "Code de la salle",
    de: "Raumcode",
  },
  "home.publicRooms": {
    en: "Public Rooms",
    cs: "Veřejné místnosti",
    es: "Salas públicas",
    fr: "Salles publiques",
    de: "Öffentliche Räume",
  },
  "home.noPublicRooms": {
    en: "No public rooms available",
    cs: "Nejsou k dispozici žádné veřejné místnosti",
    es: "No hay salas públicas disponibles",
    fr: "Aucune salle publique disponible",
    de: "Keine öffentlichen Räume verfügbar",
  },
  "home.players": {
    en: "players",
    cs: "hráčů",
    es: "jugadores",
    fr: "joueurs",
    de: "Spieler",
  },
  "home.join": {
    en: "Join",
    cs: "Připojit se",
    es: "Unirse",
    fr: "Rejoindre",
    de: "Beitreten",
  },

  // Lobby Page
  "lobby.title": {
    en: "Game Lobby",
    cs: "Herní místnost",
    es: "Sala de juego",
    fr: "Salon de jeu",
    de: "Spiellobby",
  },
  "lobby.roomCode": {
    en: "Room Code",
    cs: "Kód místnosti",
    es: "Código de sala",
    fr: "Code de la salle",
    de: "Raumcode",
  },
  "lobby.shareCode": {
    en: "Share this code with friends",
    cs: "Sdílejte tento kód s přáteli",
    es: "Comparte este código con amigos",
    fr: "Partagez ce code avec des amis",
    de: "Teilen Sie diesen Code mit Freunden",
  },
  "lobby.redTeam": {
    en: "Red Team",
    cs: "Červený tým",
    es: "Equipo rojo",
    fr: "Équipe rouge",
    de: "Rotes Team",
  },
  "lobby.blueTeam": {
    en: "Blue Team",
    cs: "Modrý tým",
    es: "Equipo azul",
    fr: "Équipe bleue",
    de: "Blaues Team",
  },
  "lobby.spectators": {
    en: "Spectators",
    cs: "Diváci",
    es: "Espectadores",
    fr: "Spectateurs",
    de: "Zuschauer",
  },
  "lobby.spymaster": {
    en: "Spymaster",
    cs: "Velitel",
    es: "Maestro espía",
    fr: "Maître espion",
    de: "Spionagemeister",
  },
  "lobby.operative": {
    en: "Operative",
    cs: "Agent",
    es: "Operativo",
    fr: "Opératif",
    de: "Operative",
  },
  "lobby.startGame": {
    en: "Start Game",
    cs: "Začít hru",
    es: "Iniciar juego",
    fr: "Commencer le jeu",
    de: "Spiel starten",
  },
  "lobby.leaveRoom": {
    en: "Leave Room",
    cs: "Opustit místnost",
    es: "Salir de la sala",
    fr: "Quitter la salle",
    de: "Raum verlassen",
  },
  "lobby.needTeams": {
    en: "Need at least 2 players per team to start",
    cs: "Pro začátek potřebujete alespoň 2 hráče na tým",
    es: "Se necesitan al menos 2 jugadores por equipo para empezar",
    fr: "Besoin d'au moins 2 joueurs par équipe pour commencer",
    de: "Mindestens 2 Spieler pro Team erforderlich",
  },

  // Game Page
  "game.title": {
    en: "Game Board",
    cs: "Herní deska",
    es: "Tablero de juego",
    fr: "Plateau de jeu",
    de: "Spielbrett",
  },
  "game.currentTurn": {
    en: "Current Turn",
    cs: "Aktuální tah",
    es: "Turno actual",
    fr: "Tour actuel",
    de: "Aktueller Zug",
  },
  "game.redTeam": {
    en: "Red",
    cs: "Červený",
    es: "Rojo",
    fr: "Rouge",
    de: "Rot",
  },
  "game.blueTeam": {
    en: "Blue",
    cs: "Modrý",
    es: "Azul",
    fr: "Bleu",
    de: "Blau",
  },
  "game.remaining": {
    en: "remaining",
    cs: "zbývá",
    es: "restantes",
    fr: "restants",
    de: "verbleibend",
  },
  "game.clue": {
    en: "Clue",
    cs: "Nápověda",
    es: "Pista",
    fr: "Indice",
    de: "Hinweis",
  },
  "game.number": {
    en: "Number",
    cs: "Číslo",
    es: "Número",
    fr: "Nombre",
    de: "Nummer",
  },
  "game.giveClue": {
    en: "Give Clue",
    cs: "Dát nápovědu",
    es: "Dar pista",
    fr: "Donner un indice",
    de: "Hinweis geben",
  },
  "game.endTurn": {
    en: "End Turn",
    cs: "Ukončit tah",
    es: "Terminar turno",
    fr: "Terminer le tour",
    de: "Zug beenden",
  },
  "game.guessesLeft": {
    en: "guesses left",
    cs: "hádat zbývá",
    es: "intentos restantes",
    fr: "essais restants",
    de: "Versuche übrig",
  },
  "game.winner": {
    en: "Winner",
    cs: "Vítěz",
    es: "Ganador",
    fr: "Gagnant",
    de: "Gewinner",
  },
  "game.wins": {
    en: "wins!",
    cs: "vyhrává!",
    es: "¡gana!",
    fr: "gagne !",
    de: "gewinnt!",
  },
  "game.assassin": {
    en: "Assassin revealed!",
    cs: "Vrah odhalen!",
    es: "¡Asesino revelado!",
    fr: "Assassin révélé !",
    de: "Attentäter aufgedeckt!",
  },
  "game.backToLobby": {
    en: "Back to Lobby",
    cs: "Zpět do místnosti",
    es: "Volver al lobby",
    fr: "Retour au salon",
    de: "Zurück zur Lobby",
  },

  // Chat
  "chat.title": {
    en: "Chat",
    cs: "Chat",
    es: "Chat",
    fr: "Chat",
    de: "Chat",
  },
  "chat.typeMessage": {
    en: "Type a message...",
    cs: "Napište zprávu...",
    es: "Escribe un mensaje...",
    fr: "Tapez un message...",
    de: "Nachricht eingeben...",
  },
  "chat.send": {
    en: "Send",
    cs: "Odeslat",
    es: "Enviar",
    fr: "Envoyer",
    de: "Senden",
  },

  // Common
  "common.loading": {
    en: "Loading...",
    cs: "Načítání...",
    es: "Cargando...",
    fr: "Chargement...",
    de: "Laden...",
  },
  "common.error": {
    en: "Error",
    cs: "Chyba",
    es: "Error",
    fr: "Erreur",
    de: "Fehler",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && ["en", "cs", "es", "fr", "de"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
