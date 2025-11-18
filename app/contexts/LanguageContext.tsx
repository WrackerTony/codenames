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
    cs: "Codenames",
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

  // Authentication
  "auth.login": {
    en: "Login",
    cs: "Přihlásit se",
    es: "Iniciar sesión",
    fr: "Connexion",
    de: "Anmelden",
  },
  "auth.register": {
    en: "Register",
    cs: "Registrovat se",
    es: "Registrarse",
    fr: "S'inscrire",
    de: "Registrieren",
  },
  "auth.email": {
    en: "Email",
    cs: "E-mail",
    es: "Correo electrónico",
    fr: "E-mail",
    de: "E-Mail",
  },
  "auth.password": {
    en: "Password",
    cs: "Heslo",
    es: "Contraseña",
    fr: "Mot de passe",
    de: "Passwort",
  },
  "auth.username": {
    en: "Username",
    cs: "Uživatelské jméno",
    es: "Nombre de usuario",
    fr: "Nom d'utilisateur",
    de: "Benutzername",
  },
  "auth.emailPlaceholder": {
    en: "Enter your email",
    cs: "Zadejte svůj e-mail",
    es: "Ingrese su correo electrónico",
    fr: "Entrez votre e-mail",
    de: "Geben Sie Ihre E-Mail ein",
  },
  "auth.passwordPlaceholder": {
    en: "Enter your password",
    cs: "Zadejte své heslo",
    es: "Ingrese su contraseña",
    fr: "Entrez votre mot de passe",
    de: "Geben Sie Ihr Passwort ein",
  },
  "auth.usernamePlaceholder": {
    en: "Choose a username",
    cs: "Vyberte uživatelské jméno",
    es: "Elija un nombre de usuario",
    fr: "Choisissez un nom d'utilisateur",
    de: "Wählen Sie einen Benutzernamen",
  },
  "auth.loginButton": {
    en: "Login",
    cs: "Přihlásit se",
    es: "Iniciar sesión",
    fr: "Se connecter",
    de: "Anmelden",
  },
  "auth.registerButton": {
    en: "Create Account",
    cs: "Vytvořit účet",
    es: "Crear cuenta",
    fr: "Créer un compte",
    de: "Konto erstellen",
  },
  "auth.alreadyHaveAccount": {
    en: "Already have an account?",
    cs: "Již máte účet?",
    es: "¿Ya tienes una cuenta?",
    fr: "Vous avez déjà un compte ?",
    de: "Haben Sie bereits ein Konto?",
  },
  "auth.dontHaveAccount": {
    en: "Don't have an account?",
    cs: "Nemáte účet?",
    es: "¿No tienes una cuenta?",
    fr: "Vous n'avez pas de compte ?",
    de: "Haben Sie kein Konto?",
  },
  "auth.switchToLogin": {
    en: "Login here",
    cs: "Přihlásit se zde",
    es: "Inicia sesión aquí",
    fr: "Connectez-vous ici",
    de: "Hier anmelden",
  },
  "auth.switchToRegister": {
    en: "Register here",
    cs: "Registrovat se zde",
    es: "Regístrate aquí",
    fr: "Inscrivez-vous ici",
    de: "Hier registrieren",
  },
  "auth.continueAsGuest": {
    en: "Continue as guest",
    cs: "Pokračovat jako host",
    es: "Continuar como invitado",
    fr: "Continuer en tant qu'invité",
    de: "Als Gast fortfahren",
  },
  "auth.logout": {
    en: "Logout",
    cs: "Odhlásit se",
    es: "Cerrar sesión",
    fr: "Se déconnecter",
    de: "Abmelden",
  },
  "auth.profile": {
    en: "Profile",
    cs: "Profil",
    es: "Perfil",
    fr: "Profil",
    de: "Profil",
  },

  // Profile Page
  "profile.title": {
    en: "My Profile",
    cs: "Můj profil",
    es: "Mi perfil",
    fr: "Mon profil",
    de: "Mein Profil",
  },
  "profile.stats": {
    en: "Statistics",
    cs: "Statistiky",
    es: "Estadísticas",
    fr: "Statistiques",
    de: "Statistiken",
  },
  "profile.points": {
    en: "Points",
    cs: "Body",
    es: "Puntos",
    fr: "Points",
    de: "Punkte",
  },
  "profile.gamesWon": {
    en: "Games Won",
    cs: "Vyhraných her",
    es: "Juegos ganados",
    fr: "Parties gagnées",
    de: "Gewonnene Spiele",
  },
  "profile.gamesLost": {
    en: "Games Lost",
    cs: "Prohraných her",
    es: "Juegos perdidos",
    fr: "Parties perdues",
    de: "Verlorene Spiele",
  },
  "profile.winRate": {
    en: "Win Rate",
    cs: "Úspěšnost",
    es: "Tasa de victoria",
    fr: "Taux de victoire",
    de: "Gewinnrate",
  },
  "profile.friends": {
    en: "Friends",
    cs: "Přátelé",
    es: "Amigos",
    fr: "Amis",
    de: "Freunde",
  },
  "profile.pendingRequests": {
    en: "Pending Friend Requests",
    cs: "Nevyřízené žádosti o přátelství",
    es: "Solicitudes de amistad pendientes",
    fr: "Demandes d'ami en attente",
    de: "Ausstehende Freundschaftsanfragen",
  },
  "profile.addFriends": {
    en: "Add Friends",
    cs: "Přidat přátele",
    es: "Agregar amigos",
    fr: "Ajouter des amis",
    de: "Freunde hinzufügen",
  },
  "profile.searchPlaceholder": {
    en: "Search by username",
    cs: "Hledat podle uživatelského jména",
    es: "Buscar por nombre de usuario",
    fr: "Rechercher par nom d'utilisateur",
    de: "Nach Benutzername suchen",
  },
  "profile.accept": {
    en: "Accept",
    cs: "Přijmout",
    es: "Aceptar",
    fr: "Accepter",
    de: "Annehmen",
  },
  "profile.reject": {
    en: "Reject",
    cs: "Odmítnout",
    es: "Rechazar",
    fr: "Refuser",
    de: "Ablehnen",
  },
  "profile.remove": {
    en: "Remove",
    cs: "Odebrat",
    es: "Eliminar",
    fr: "Supprimer",
    de: "Entfernen",
  },
  "profile.sendRequest": {
    en: "Send Request",
    cs: "Odeslat žádost",
    es: "Enviar solicitud",
    fr: "Envoyer la demande",
    de: "Anfrage senden",
  },
  "profile.noFriends": {
    en: "No friends yet. Add some to play together!",
    cs: "Zatím žádní přátelé. Přidejte někoho a hrajte společně!",
    es: "Aún no tienes amigos. ¡Añade algunos para jugar juntos!",
    fr: "Pas encore d'amis. Ajoutez-en pour jouer ensemble !",
    de: "Noch keine Freunde. Fügen Sie welche hinzu, um zusammen zu spielen!",
  },
  "profile.noPendingRequests": {
    en: "No pending requests",
    cs: "Žádné nevyřízené žádosti",
    es: "No hay solicitudes pendientes",
    fr: "Aucune demande en attente",
    de: "Keine ausstehenden Anfragen",
  },
  "profile.backToHome": {
    en: "Back to Home",
    cs: "Zpět na domovskou stránku",
    es: "Volver al inicio",
    fr: "Retour à l'accueil",
    de: "Zurück zur Startseite",
  },

  // How to Play
  "howToPlay.title": {
    en: "How to Play Codenames",
    cs: "Jak hrát Codenames",
    es: "Cómo jugar Nombres en clave",
    fr: "Comment jouer à Noms de code",
    de: "Wie man Codenames spielt",
  },
  "howToPlay.objective": {
    en: "Objective",
    cs: "Cíl",
    es: "Objetivo",
    fr: "Objectif",
    de: "Ziel",
  },
  "howToPlay.objectiveDesc": {
    en: "Two teams compete to identify all their agents on a 5x5 grid of words before the other team, while avoiding the assassin.",
    cs: "Dva týmy soutěží o identifikaci všech svých agentů na mřížce 5x5 slov před druhým týmem, přičemž se vyhýbají vrahovi.",
    es: "Dos equipos compiten para identificar a todos sus agentes en una cuadrícula de 5x5 palabras antes que el otro equipo, evitando al asesino.",
    fr: "Deux équipes s'affrontent pour identifier tous leurs agents sur une grille de 5x5 mots avant l'autre équipe, tout en évitant l'assassin.",
    de: "Zwei Teams wetteifern darum, alle ihre Agenten auf einem 5x5-Raster von Wörtern vor dem anderen Team zu identifizieren, während sie den Attentäter vermeiden.",
  },
  "howToPlay.setup": {
    en: "Setup",
    cs: "Příprava",
    es: "Configuración",
    fr: "Configuration",
    de: "Aufbau",
  },
  "howToPlay.setupDesc": {
    en: "Each team needs at least 2 players: 1 Spymaster and 1+ Operatives. The board contains 25 words with hidden identities: 9 cards for one team (red), 8 for the other (blue), 7 neutral bystanders, and 1 assassin.",
    cs: "Každý tým potřebuje alespoň 2 hráče: 1 velitele a 1+ agentů. Deska obsahuje 25 slov se skrytými identitami: 9 karet pro jeden tým (červený), 8 pro druhý (modrý), 7 neutrálních kolemjdoucích a 1 vraha.",
    es: "Cada equipo necesita al menos 2 jugadores: 1 Maestro espía y 1+ Operativos. El tablero contiene 25 palabras con identidades ocultas: 9 cartas para un equipo (rojo), 8 para el otro (azul), 7 transeúntes neutrales y 1 asesino.",
    fr: "Chaque équipe a besoin d'au moins 2 joueurs : 1 Maître espion et 1+ Opératifs. Le plateau contient 25 mots avec des identités cachées : 9 cartes pour une équipe (rouge), 8 pour l'autre (bleue), 7 passants neutres et 1 assassin.",
    de: "Jedes Team benötigt mindestens 2 Spieler: 1 Spionagemeister und 1+ Operative. Das Brett enthält 25 Wörter mit versteckten Identitäten: 9 Karten für ein Team (rot), 8 für das andere (blau), 7 neutrale Zuschauer und 1 Attentäter.",
  },
  "howToPlay.roles": {
    en: "Roles",
    cs: "Role",
    es: "Roles",
    fr: "Rôles",
    de: "Rollen",
  },
  "howToPlay.spymasterRole": {
    en: "Spymaster",
    cs: "Velitel",
    es: "Maestro espía",
    fr: "Maître espion",
    de: "Spionagemeister",
  },
  "howToPlay.spymasterDesc": {
    en: "The Spymaster can see all card identities and gives one-word clues followed by a number indicating how many words relate to that clue.",
    cs: "Velitel vidí všechny identity karet a dává nápovědy z jednoho slova následované číslem udávajícím, kolik slov se vztahuje k této nápovědě.",
    es: "El Maestro espía puede ver todas las identidades de las cartas y da pistas de una palabra seguidas de un número que indica cuántas palabras se relacionan con esa pista.",
    fr: "Le Maître espion peut voir toutes les identités des cartes et donne des indices d'un mot suivis d'un nombre indiquant combien de mots se rapportent à cet indice.",
    de: "Der Spionagemeister kann alle Kartenidentitäten sehen und gibt Ein-Wort-Hinweise gefolgt von einer Zahl an, die angibt, wie viele Wörter sich auf diesen Hinweis beziehen.",
  },
  "howToPlay.operativeRole": {
    en: "Operative",
    cs: "Agent",
    es: "Operativo",
    fr: "Opératif",
    de: "Operative",
  },
  "howToPlay.operativeDesc": {
    en: "Operatives see the board without card identities. They discuss and choose which words to select based on their Spymaster's clue.",
    cs: "Agenti vidí desku bez identit karet. Diskutují a vybírají, která slova vybrat na základě nápovědy jejich velitele.",
    es: "Los Operativos ven el tablero sin las identidades de las cartas. Discuten y eligen qué palabras seleccionar según la pista de su Maestro espía.",
    fr: "Les Opératifs voient le plateau sans les identités des cartes. Ils discutent et choisissent quels mots sélectionner en fonction de l'indice de leur Maître espion.",
    de: "Die Operativen sehen das Brett ohne Kartenidentitäten. Sie diskutieren und wählen aus, welche Wörter sie basierend auf dem Hinweis ihres Spionagemeisters auswählen.",
  },
  "howToPlay.gameplay": {
    en: "Gameplay",
    cs: "Hra",
    es: "Juego",
    fr: "Déroulement",
    de: "Spielablauf",
  },
  "howToPlay.turn": {
    en: "On Your Turn",
    cs: "Váš tah",
    es: "En tu turno",
    fr: "À votre tour",
    de: "In Ihrem Zug",
  },
  "howToPlay.turnDesc": {
    en: "The Spymaster gives a clue (one word + one number). Operatives make guesses by clicking words. Each correct guess lets you continue. Wrong guesses or choosing to stop ends your turn.",
    cs: "Velitel dá nápovědu (jedno slovo + jedno číslo). Agenti hádají kliknutím na slova. Každá správná odpověď vám umožní pokračovat. Špatné odpovědi nebo rozhodnutí zastavit končí váš tah.",
    es: "El Maestro espía da una pista (una palabra + un número). Los Operativos hacen conjeturas haciendo clic en palabras. Cada conjetura correcta te permite continuar. Las conjeturas incorrectas o elegir detenerse termina tu turno.",
    fr: "Le Maître espion donne un indice (un mot + un nombre). Les Opératifs font des suppositions en cliquant sur des mots. Chaque supposition correcte vous permet de continuer. Les mauvaises suppositions ou le choix d'arrêter met fin à votre tour.",
    de: "Der Spionagemeister gibt einen Hinweis (ein Wort + eine Zahl). Die Operativen raten, indem sie auf Wörter klicken. Jede richtige Vermutung lässt Sie fortfahren. Falsche Vermutungen oder die Entscheidung aufzuhören beendet Ihren Zug.",
  },
  "howToPlay.clueRules": {
    en: "Clue Rules",
    cs: "Pravidla nápověd",
    es: "Reglas de pistas",
    fr: "Règles des indices",
    de: "Hinweis-Regeln",
  },
  "howToPlay.clueRule1": {
    en: "• Must be one word (no hyphenated words or proper names from the board)",
    cs: "• Musí být jedno slovo (žádná slova s pomlčkou nebo vlastní jména z desky)",
    es: "• Debe ser una palabra (sin palabras con guion o nombres propios del tablero)",
    fr: "• Doit être un mot (pas de mots avec trait d'union ou de noms propres du plateau)",
    de: "• Muss ein Wort sein (keine Bindestrich-Wörter oder Eigennamen vom Brett)",
  },
  "howToPlay.clueRule2": {
    en: "• Cannot use root words of words on the board",
    cs: "• Nelze použít kořenová slova slov na desce",
    es: "• No se pueden usar raíces de palabras en el tablero",
    fr: "• Ne peut pas utiliser les racines des mots du plateau",
    de: "• Kann keine Wortwurzeln von Wörtern auf dem Brett verwenden",
  },
  "howToPlay.clueRule3": {
    en: "• Must relate to the meaning of words, not spelling or pronunciation",
    cs: "• Musí souviset s významem slov, ne s pravopisem nebo výslovností",
    es: "• Debe relacionarse con el significado de las palabras, no con la ortografía o pronunciación",
    fr: "• Doit se rapporter au sens des mots, pas à l'orthographe ou à la prononciation",
    de: "• Muss sich auf die Bedeutung von Wörtern beziehen, nicht auf Rechtschreibung oder Aussprache",
  },
  "howToPlay.clueNumber": {
    en: "The number indicates how many words on the board relate to your clue. You get that many guesses plus one bonus guess.",
    cs: "Číslo udává, kolik slov na desce souvisí s vaší nápovědou. Máte tolik pokusů plus jeden bonusový pokus.",
    es: "El número indica cuántas palabras en el tablero se relacionan con tu pista. Obtienes esa cantidad de conjeturas más una conjetura adicional.",
    fr: "Le nombre indique combien de mots sur le plateau se rapportent à votre indice. Vous avez ce nombre de suppositions plus une supposition bonus.",
    de: "Die Zahl gibt an, wie viele Wörter auf dem Brett sich auf Ihren Hinweis beziehen. Sie erhalten so viele Vermutungen plus eine Bonus-Vermutung.",
  },
  "howToPlay.winning": {
    en: "Winning",
    cs: "Výhra",
    es: "Ganar",
    fr: "Gagner",
    de: "Gewinnen",
  },
  "howToPlay.winCondition1": {
    en: "• Identify all your team's agents first",
    cs: "• Identifikujte všechny agenty svého týmu jako první",
    es: "• Identifica a todos los agentes de tu equipo primero",
    fr: "• Identifiez tous les agents de votre équipe en premier",
    de: "• Identifizieren Sie zuerst alle Agenten Ihres Teams",
  },
  "howToPlay.winCondition2": {
    en: "• The other team reveals the assassin (you win automatically)",
    cs: "• Druhý tým odhalí vraha (automaticky vyhrajete)",
    es: "• El otro equipo revela al asesino (ganas automáticamente)",
    fr: "• L'autre équipe révèle l'assassin (vous gagnez automatiquement)",
    de: "• Das andere Team enthüllt den Attentäter (Sie gewinnen automatisch)",
  },
  "howToPlay.losing": {
    en: "Losing",
    cs: "Prohra",
    es: "Perder",
    fr: "Perdre",
    de: "Verlieren",
  },
  "howToPlay.loseCondition": {
    en: "If your team selects the assassin card, your team loses immediately!",
    cs: "Pokud váš tým vybere kartu vraha, váš tým okamžitě prohrává!",
    es: "¡Si tu equipo selecciona la carta del asesino, tu equipo pierde inmediatamente!",
    fr: "Si votre équipe sélectionne la carte de l'assassin, votre équipe perd immédiatement !",
    de: "Wenn Ihr Team die Attentäterkarte auswählt, verliert Ihr Team sofort!",
  },
  "howToPlay.tips": {
    en: "Tips",
    cs: "Tipy",
    es: "Consejos",
    fr: "Conseils",
    de: "Tipps",
  },
  "howToPlay.tip1": {
    en: "• Spymasters: Think carefully about multi-word clues that connect your team's words",
    cs: "• Velitelé: Pečlivě přemýšlejte o nápovědách, které spojují slova vašeho týmu",
    es: "• Maestros espías: Piensa cuidadosamente sobre pistas que conecten las palabras de tu equipo",
    fr: "• Maîtres espions : Réfléchissez attentivement aux indices qui relient les mots de votre équipe",
    de: "• Spionagemeister: Denken Sie sorgfältig über Hinweise nach, die die Wörter Ihres Teams verbinden",
  },
  "howToPlay.tip2": {
    en: "• Operatives: Discuss possibilities with your team before choosing",
    cs: "• Agenti: Diskutujte o možnostech se svým týmem před výběrem",
    es: "• Operativos: Discute las posibilidades con tu equipo antes de elegir",
    fr: "• Opératifs : Discutez des possibilités avec votre équipe avant de choisir",
    de: "• Operative: Besprechen Sie Möglichkeiten mit Ihrem Team, bevor Sie wählen",
  },
  "howToPlay.tip3": {
    en: "• Be cautious of words that could relate to the opponent's agents or the assassin",
    cs: "• Buďte opatrní na slova, která by mohla souviset s agenty soupeře nebo vrahem",
    es: "• Ten cuidado con las palabras que podrían relacionarse con los agentes del oponente o el asesino",
    fr: "• Soyez prudent avec les mots qui pourraient se rapporter aux agents de l'adversaire ou à l'assassin",
    de: "• Seien Sie vorsichtig mit Wörtern, die sich auf die Agenten des Gegners oder den Attentäter beziehen könnten",
  },
  "howToPlay.tip4": {
    en: "• Sometimes it's better to give a safe clue for 1-2 words than risk a larger clue",
    cs: "• Někdy je lepší dát bezpečnou nápovědu pro 1-2 slova než riskovat větší nápovědu",
    es: "• A veces es mejor dar una pista segura para 1-2 palabras que arriesgar una pista más grande",
    fr: "• Parfois, il vaut mieux donner un indice sûr pour 1-2 mots que de risquer un indice plus grand",
    de: "• Manchmal ist es besser, einen sicheren Hinweis für 1-2 Wörter zu geben, als einen größeren Hinweis zu riskieren",
  },
  "howToPlay.assassinCard": {
    en: "Assassin Card",
    cs: "Karta vraha",
    es: "Carta del asesino",
    fr: "Carte de l'assassin",
    de: "Attentäterkarte",
  },
  "howToPlay.detailedGuide": {
    en: "Detailed Game Guide",
    cs: "Podrobný herní průvodce",
    es: "Guía detallada del juego",
    fr: "Guide de jeu détaillé",
    de: "Detaillierte Spielanleitung",
  },
  "howToPlay.step1": {
    en: "Step 1: Team Formation",
    cs: "Krok 1: Vytvoření týmů",
    es: "Paso 1: Formación de equipos",
    fr: "Étape 1 : Formation des équipes",
    de: "Schritt 1: Teambildung",
  },
  "howToPlay.step1Desc": {
    en: "Divide players into Red and Blue teams. Each team must have at least 2 players. One player from each team volunteers to be the Spymaster - this player will see all card identities and give clues. The remaining players are Operatives who will guess based on clues.",
    cs: "Rozdělte hráče do červeného a modrého týmu. Každý tým musí mít alespoň 2 hráče. Jeden hráč z každého týmu se dobrovolně přihlásí jako velitel - tento hráč uvidí všechny identity karet a bude dávat nápovědy. Zbývající hráči jsou agenti, kteří budou hádat podle nápověd.",
    es: "Divide a los jugadores en equipos Rojo y Azul. Cada equipo debe tener al menos 2 jugadores. Un jugador de cada equipo se ofrece como Maestro espía: este jugador verá todas las identidades de las cartas y dará pistas. Los jugadores restantes son Operativos que adivinarán según las pistas.",
    fr: "Divisez les joueurs en équipes Rouge et Bleue. Chaque équipe doit avoir au moins 2 joueurs. Un joueur de chaque équipe se porte volontaire pour être le Maître espion - ce joueur verra toutes les identités des cartes et donnera des indices. Les joueurs restants sont des Opératifs qui devineront en fonction des indices.",
    de: "Teilen Sie die Spieler in rote und blaue Teams auf. Jedes Team muss mindestens 2 Spieler haben. Ein Spieler aus jedem Team meldet sich freiwillig als Spionagemeister - dieser Spieler wird alle Kartenidentitäten sehen und Hinweise geben. Die übrigen Spieler sind Operative, die basierend auf Hinweisen raten.",
  },
  "howToPlay.step2": {
    en: "Step 2: Understanding the Board",
    cs: "Krok 2: Pochopení desky",
    es: "Paso 2: Comprender el tablero",
    fr: "Étape 2 : Comprendre le plateau",
    de: "Schritt 2: Das Brett verstehen",
  },
  "howToPlay.step2Desc": {
    en: "The 5×5 board contains 25 random words. For Spymasters only, each word has a hidden color: 9 cards belong to the starting team (red/blue), 8 to the other team, 7 neutral bystanders (beige), and 1 deadly assassin (gray). Operatives see only the words, not the colors.",
    cs: "Deska 5×5 obsahuje 25 náhodných slov. Pouze pro velitele má každé slovo skrytou barvu: 9 karet patří začínajícímu týmu (červený/modrý), 8 druhému týmu, 7 neutrálním kolemjdoucím (béžová) a 1 smrtícímu vrahovi (šedá). Agenti vidí pouze slova, ne barvy.",
    es: "El tablero de 5×5 contiene 25 palabras aleatorias. Solo para Maestros espías, cada palabra tiene un color oculto: 9 cartas pertenecen al equipo que empieza (rojo/azul), 8 al otro equipo, 7 transeúntes neutrales (beige) y 1 asesino mortal (gris). Los Operativos ven solo las palabras, no los colores.",
    fr: "Le plateau 5×5 contient 25 mots aléatoires. Pour les Maîtres espions uniquement, chaque mot a une couleur cachée : 9 cartes appartiennent à l'équipe qui commence (rouge/bleu), 8 à l'autre équipe, 7 passants neutres (beige) et 1 assassin mortel (gris). Les Opératifs ne voient que les mots, pas les couleurs.",
    de: "Das 5×5-Brett enthält 25 zufällige Wörter. Nur für Spionagemeister hat jedes Wort eine versteckte Farbe: 9 Karten gehören zum Startteam (rot/blau), 8 zum anderen Team, 7 neutrale Zuschauer (beige) und 1 tödlicher Attentäter (grau). Operative sehen nur die Wörter, nicht die Farben.",
  },
  "howToPlay.step3": {
    en: "Step 3: Giving Clues (Spymaster)",
    cs: "Krok 3: Dávání nápověd (velitel)",
    es: "Paso 3: Dar pistas (Maestro espía)",
    fr: "Étape 3 : Donner des indices (Maître espion)",
    de: "Schritt 3: Hinweise geben (Spionagemeister)",
  },
  "howToPlay.step3Desc": {
    en: "When it's your team's turn, the Spymaster gives ONE word followed by a number. The word relates to multiple cards, and the number tells how many. For example: 'FRUIT 3' means 3 words relate to fruit (like APPLE, BANANA, ORANGE).",
    cs: "Když je na řadě váš tým, velitel řekne JEDNO slovo následované číslem. Slovo se vztahuje k více kartám a číslo říká kolik. Například: 'OVOCE 3' znamená, že 3 slova se vztahují k ovoci (jako JABLKO, BANÁN, POMERANČ).",
    es: "Cuando sea el turno de tu equipo, el Maestro espía da UNA palabra seguida de un número. La palabra se relaciona con varias cartas, y el número indica cuántas. Por ejemplo: 'FRUTA 3' significa que 3 palabras se relacionan con fruta (como MANZANA, PLÁTANO, NARANJA).",
    fr: "Lorsque c'est le tour de votre équipe, le Maître espion donne UN mot suivi d'un nombre. Le mot se rapporte à plusieurs cartes, et le nombre indique combien. Par exemple : 'FRUIT 3' signifie que 3 mots se rapportent aux fruits (comme POMME, BANANE, ORANGE).",
    de: "Wenn Ihr Team an der Reihe ist, gibt der Spionagemeister EIN Wort gefolgt von einer Zahl. Das Wort bezieht sich auf mehrere Karten, und die Zahl sagt wie viele. Zum Beispiel: 'OBST 3' bedeutet, dass sich 3 Wörter auf Obst beziehen (wie APFEL, BANANE, ORANGE).",
  },
  "howToPlay.specialNumbers": {
    en: "Special Number Options",
    cs: "Speciální číselné možnosti",
    es: "Opciones de números especiales",
    fr: "Options de nombres spéciaux",
    de: "Spezielle Zahlenoptionen",
  },
  "howToPlay.numberZero": {
    en: "• Using '0' (Zero): Means the clue word does NOT relate to any of your team's words. This is a risky 'pass' that gives your Operatives unlimited guesses - but they cannot select words related to your clue. Example: 'ANIMAL 0' means 'none of our words are animals, but you can guess freely.'",
    cs: "• Použití '0' (Nula): Znamená, že nápovědné slovo NESOUVISÍ s žádným slovem vašeho týmu. Toto je riskantní 'pas', který dává vašim agentům neomezené pokusy - ale nemohou vybrat slova související s vaší nápovědou. Příklad: 'ZVÍŘE 0' znamená 'žádná naše slova nejsou zvířata, ale můžete hádat volně.'",
    es: "• Usar '0' (Cero): Significa que la palabra pista NO se relaciona con ninguna palabra de tu equipo. Este es un 'pase' arriesgado que da a tus Operativos intentos ilimitados, pero no pueden seleccionar palabras relacionadas con tu pista. Ejemplo: 'ANIMAL 0' significa 'ninguna de nuestras palabras son animales, pero pueden adivinar libremente.'",
    fr: "• Utiliser '0' (Zéro) : Signifie que le mot indice n'est PAS lié à aucun des mots de votre équipe. C'est un 'passage' risqué qui donne à vos Opératifs des suppositions illimitées - mais ils ne peuvent pas sélectionner de mots liés à votre indice. Exemple : 'ANIMAL 0' signifie 'aucun de nos mots n'est un animal, mais vous pouvez deviner librement.'",
    de: "• Verwenden von '0' (Null): Bedeutet, dass sich das Hinweiswort NICHT auf eines Ihrer Teamwörter bezieht. Dies ist ein riskanter 'Pass', der Ihren Operativen unbegrenzte Vermutungen gibt - aber sie können keine Wörter auswählen, die sich auf Ihren Hinweis beziehen. Beispiel: 'TIER 0' bedeutet 'keines unserer Wörter ist ein Tier, aber Sie können frei raten.'",
  },
  "howToPlay.numberInfinite": {
    en: "• Using '∞' (Infinite): Tells your Operatives that ALL remaining words of your color relate to this clue. This is for very broad clues. Example: If you have PARIS, LONDON, ROME, BERLIN left, you could say 'EUROPE ∞'. Your team gets unlimited guesses.",
    cs: "• Použití '∞' (Nekonečno): Říká vašim agentům, že VŠECHNA zbývající slova vaší barvy se vztahují k této nápovědě. Toto je pro velmi široké nápovědy. Příklad: Pokud vám zbývá PAŘÍŽ, LONDÝN, ŘÍM, BERLÍN, můžete říct 'EVROPA ∞'. Váš tým má neomezené pokusy.",
    es: "• Usar '∞' (Infinito): Indica a tus Operativos que TODAS las palabras restantes de tu color se relacionan con esta pista. Esto es para pistas muy amplias. Ejemplo: Si te quedan PARÍS, LONDRES, ROMA, BERLÍN, podrías decir 'EUROPA ∞'. Tu equipo tiene intentos ilimitados.",
    fr: "• Utiliser '∞' (Infini) : Indique à vos Opératifs que TOUS les mots restants de votre couleur se rapportent à cet indice. C'est pour des indices très larges. Exemple : Si vous avez PARIS, LONDRES, ROME, BERLIN restants, vous pourriez dire 'EUROPE ∞'. Votre équipe a des suppositions illimitées.",
    de: "• Verwenden von '∞' (Unendlich): Teilt Ihren Operativen mit, dass sich ALLE verbleibenden Wörter Ihrer Farbe auf diesen Hinweis beziehen. Dies ist für sehr breite Hinweise. Beispiel: Wenn Sie PARIS, LONDON, ROM, BERLIN übrig haben, könnten Sie 'EUROPA ∞' sagen. Ihr Team hat unbegrenzte Vermutungen.",
  },
  "howToPlay.step4": {
    en: "Step 4: Making Guesses (Operatives)",
    cs: "Krok 4: Tipování (agenti)",
    es: "Paso 4: Hacer conjeturas (Operativos)",
    fr: "Étape 4 : Faire des suppositions (Opératifs)",
    de: "Schritt 4: Vermutungen anstellen (Operative)",
  },
  "howToPlay.step4Desc": {
    en: "After hearing the clue, Operatives discuss and click words they think match. You get (number + 1) guesses. If you guess correctly, you can continue. If you guess wrong (opponent's card, neutral, or assassin) or choose to stop, your turn ends. You can always pass voluntarily with the 'End Turn' button.",
    cs: "Po vyslechnutí nápovědy agenti diskutují a klikají na slova, která si myslí, že odpovídají. Máte (číslo + 1) pokusů. Pokud uhodnete správně, můžete pokračovat. Pokud uhodnete špatně (karta soupeře, neutrální nebo vrah) nebo se rozhodnete zastavit, váš tah končí. Vždy můžete dobrovolně pasovat tlačítkem 'Ukončit tah'.",
    es: "Después de escuchar la pista, los Operativos discuten y hacen clic en las palabras que creen que coinciden. Obtienes (número + 1) intentos. Si adivinas correctamente, puedes continuar. Si adivinas mal (carta del oponente, neutral o asesino) o decides detenerte, tu turno termina. Siempre puedes pasar voluntariamente con el botón 'Terminar turno'.",
    fr: "Après avoir entendu l'indice, les Opératifs discutent et cliquent sur les mots qu'ils pensent correspondre. Vous obtenez (nombre + 1) suppositions. Si vous devinez correctement, vous pouvez continuer. Si vous devinez mal (carte de l'adversaire, neutre ou assassin) ou choisissez d'arrêter, votre tour se termine. Vous pouvez toujours passer volontairement avec le bouton 'Terminer le tour'.",
    de: "Nach dem Hören des Hinweises diskutieren die Operativen und klicken auf Wörter, von denen sie glauben, dass sie passen. Sie erhalten (Zahl + 1) Vermutungen. Wenn Sie richtig raten, können Sie fortfahren. Wenn Sie falsch raten (Karte des Gegners, neutral oder Attentäter) oder sich entscheiden aufzuhören, endet Ihr Zug. Sie können jederzeit freiwillig mit der Schaltfläche 'Zug beenden' passen.",
  },
  "howToPlay.bonusGuess": {
    en: "Bonus Guess from Previous Turn",
    cs: "Bonusový tip z předchozího tahu",
    es: "Conjetura adicional del turno anterior",
    fr: "Supposition bonus du tour précédent",
    de: "Bonus-Vermutung vom vorherigen Zug",
  },
  "howToPlay.bonusGuessDesc": {
    en: "If your team ended their last turn without finding all words for a clue, you can make ONE extra guess for that old clue before your Spymaster gives a new one. This is optional - you can skip it if you're not confident.",
    cs: "Pokud váš tým ukončil svůj poslední tah, aniž by našel všechna slova pro nápovědu, můžete udělat JEDEN extra tip pro starou nápovědu, než váš velitel dá novou. Toto je volitelné - můžete to přeskočit, pokud si nejste jisti.",
    es: "Si tu equipo terminó su último turno sin encontrar todas las palabras de una pista, puedes hacer UNA conjetura adicional para esa pista antigua antes de que tu Maestro espía dé una nueva. Esto es opcional: puedes omitirlo si no estás seguro.",
    fr: "Si votre équipe a terminé son dernier tour sans trouver tous les mots d'un indice, vous pouvez faire UNE supposition supplémentaire pour cet ancien indice avant que votre Maître espion n'en donne un nouveau. C'est facultatif - vous pouvez le sauter si vous n'êtes pas sûr.",
    de: "Wenn Ihr Team seinen letzten Zug beendet hat, ohne alle Wörter für einen Hinweis zu finden, können Sie EINE zusätzliche Vermutung für diesen alten Hinweis machen, bevor Ihr Spionagemeister einen neuen gibt. Dies ist optional - Sie können es überspringen, wenn Sie nicht sicher sind.",
  },
  "howToPlay.examples": {
    en: "Examples of Good Clues",
    cs: "Příklady dobrých nápověd",
    es: "Ejemplos de buenas pistas",
    fr: "Exemples de bons indices",
    de: "Beispiele für gute Hinweise",
  },
  "howToPlay.example1": {
    en: "• 'SPACE 2' for MOON and STAR",
    cs: "• 'VESMÍR 2' pro MĚSÍC a HVĚZDA",
    es: "• 'ESPACIO 2' para LUNA y ESTRELLA",
    fr: "• 'ESPACE 2' pour LUNE et ÉTOILE",
    de: "• 'WELTRAUM 2' für MOND und STERN",
  },
  "howToPlay.example2": {
    en: "• 'WATER 3' for OCEAN, RIVER, and FISH",
    cs: "• 'VODA 3' pro OCEÁN, ŘEKA a RYBA",
    es: "• 'AGUA 3' para OCÉANO, RÍO y PEZ",
    fr: "• 'EAU 3' pour OCÉAN, RIVIÈRE et POISSON",
    de: "• 'WASSER 3' für OZEAN, FLUSS und FISCH",
  },
  "howToPlay.example3": {
    en: "• 'METAL 2' for IRON and GOLD",
    cs: "• 'KOV 2' pro ŽELEZO a ZLATO",
    es: "• 'METAL 2' para HIERRO y ORO",
    fr: "• 'MÉTAL 2' pour FER et OR",
    de: "• 'METALL 2' für EISEN und GOLD",
  },
  "howToPlay.example4": {
    en: "• 'EUROPE ∞' when all remaining cards are European cities",
    cs: "• 'EVROPA ∞' když všechny zbývající karty jsou evropská města",
    es: "• 'EUROPA ∞' cuando todas las cartas restantes son ciudades europeas",
    fr: "• 'EUROPE ∞' quand toutes les cartes restantes sont des villes européennes",
    de: "• 'EUROPA ∞' wenn alle verbleibenden Karten europäische Städte sind",
  },
  "howToPlay.example5": {
    en: "• 'ANIMAL 0' to let your team guess freely when none of your words are animals",
    cs: "• 'ZVÍŘE 0' abyste nechali tým hádat volně, když žádná vaše slova nejsou zvířata",
    es: "• 'ANIMAL 0' para que tu equipo adivine libremente cuando ninguna de tus palabras son animales",
    fr: "• 'ANIMAL 0' pour laisser votre équipe deviner librement quand aucun de vos mots n'est un animal",
    de: "• 'TIER 0' damit Ihr Team frei raten kann, wenn keines Ihrer Wörter Tiere sind",
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
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language;
      if (saved && ["en", "cs", "es", "fr", "de"].includes(saved)) {
        return saved;
      }
    }
    return "en";
  });

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
