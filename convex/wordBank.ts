// Codenames word bank - Multiple languages
const WORDS_EN = [
  "AFRICA", "AGENT", "AIR", "ALIEN", "ALPS", "AMAZON", "AMBULANCE", "AMERICA", "ANGEL", "ANTARCTICA",
  "APPLE", "ARM", "ATLANTIS", "AUSTRALIA", "AZTEC", "BACK", "BALL", "BAND", "BANK", "BAR",
  "BARK", "BAT", "BATTERY", "BEACH", "BEAR", "BEAT", "BED", "BEIJING", "BELL", "BELT",
  "BERLIN", "BERMUDA", "BERRY", "BILL", "BLOCK", "BOARD", "BOLT", "BOMB", "BOND", "BOOM",
  "BOOT", "BOTTLE", "BOW", "BOX", "BRIDGE", "BRUSH", "BUCK", "BUFFALO", "BUG", "BUGLE",
  "BUTTON", "CALF", "CANADA", "CAP", "CAPITAL", "CAR", "CARD", "CARROT", "CASINO", "CAST",
  "CAT", "CELL", "CENTAUR", "CENTER", "CHAIR", "CHANGE", "CHARGE", "CHECK", "CHEST", "CHICK",
  "CHINA", "CHOCOLATE", "CHURCH", "CIRCLE", "CLIFF", "CLOAK", "CLUB", "CODE", "COLD", "COMIC",
  "COMPOUND", "CONCERT", "CONDUCTOR", "CONTRACT", "COOK", "COPPER", "COTTON", "COURT", "COVER", "CRANE",
  "CRASH", "CRICKET", "CROSS", "CROWN", "CYCLE", "CZECH", "DANCE", "DATE", "DAY", "DEATH",
  "DECK", "DEGREE", "DIAMOND", "DICE", "DINOSAUR", "DISEASE", "DOCTOR", "DOG", "DRAFT", "DRAGON",
  "DRESS", "DRILL", "DROP", "DUCK", "DWARF", "EAGLE", "EGYPT", "EMBASSY", "ENGINE", "ENGLAND",
  "EUROPE", "EYE", "FACE", "FAIR", "FALL", "FAN", "FENCE", "FIELD", "FIGHTER", "FIGURE",
  "FILE", "FILM", "FIRE", "FISH", "FLUTE", "FLY", "FOOT", "FORCE", "FOREST", "FORK",
  "FRANCE", "GAME", "GAS", "GENIUS", "GERMANY", "GHOST", "GIANT", "GLASS", "GLOVE", "GOLD",
  "GRACE", "GRASS", "GREECE", "GREEN", "GROUND", "HAM", "HAND", "HAWK", "HEAD", "HEART",
  "HELICOPTER", "HIMALAYAS", "HOLE", "HOLLYWOOD", "HONEY", "HOOD", "HOOK", "HORN", "HORSE", "HORSESHOE",
  "HOSPITAL", "HOTEL", "ICE", "ICE CREAM", "INDIA", "IRON", "IVORY", "JACK", "JAM", "JET",
  "JUPITER", "KANGAROO", "KETCHUP", "KEY", "KID", "KING", "KIWI", "KNIFE", "KNIGHT", "LAB",
  "LAP", "LASER", "LAWYER", "LEAD", "LEMON", "LEPRECHAUN", "LIFE", "LIGHT", "LIMOUSINE", "LINE",
  "LINK", "LION", "LITTER", "LOCH NESS", "LOCK", "LOG", "LONDON", "LUCK", "MAIL", "MAMMOTH",
  "MAPLE", "MARBLE", "MARCH", "MASS", "MATCH", "MERCURY", "MEXICO", "MICROSCOPE", "MILLIONAIRE", "MINE",
  "MINT", "MISSILE", "MODEL", "MOLE", "MOON", "MOSCOW", "MOUNT", "MOUSE", "MOUTH", "MUG",
  "NAIL", "NEEDLE", "NET", "NEW YORK", "NIGHT", "NINJA", "NOTE", "NOVEL", "NURSE", "NUT",
  "OCTOPUS", "OIL", "OLIVE", "OLYMPUS", "OPERA", "ORANGE", "ORGAN", "PALM", "PAN", "PANTS",
  "PAPER", "PARACHUTE", "PARK", "PART", "PASS", "PASTE", "PENGUIN", "PHOENIX", "PIANO", "PIE",
  "PILOT", "PIN", "PIPE", "PIRATE", "PISTOL", "PIT", "PITCH", "PLANE", "PLASTIC", "PLATE",
  "PLATYPUS", "PLAY", "PLOT", "POINT", "POISON", "POLE", "POLICE", "POOL", "PORT", "POST",
  "POUND", "PRESS", "PRINCESS", "PUMPKIN", "PUPIL", "PYRAMID", "QUEEN", "RABBIT", "RACKET", "RAY",
  "REVOLUTION", "RING", "ROBIN", "ROBOT", "ROCK", "ROME", "ROOT", "ROSE", "ROULETTE", "ROUND",
  "ROW", "RULER", "SATELLITE", "SATURN", "SCALE", "SCHOOL", "SCIENTIST", "SCORPION", "SCREEN", "SCUBA DIVER",
  "SEAL", "SERVER", "SHADOW", "SHAKESPEARE", "SHARK", "SHIP", "SHOE", "SHOP", "SHOT", "SINK",
  "SKYSCRAPER", "SLIP", "SLUG", "SMUGGLER", "SNOW", "SNOWMAN", "SOCK", "SOLDIER", "SOUL", "SOUND",
  "SPACE", "SPELL", "SPIDER", "SPIKE", "SPINE", "SPOT", "SPRING", "SPY", "SQUARE", "STADIUM",
  "STAFF", "STAR", "STATE", "STICK", "STOCK", "STRAW", "STREAM", "STRIKE", "STRING", "SUB",
  "SUIT", "SUPERHERO", "SWING", "SWITCH", "TABLE", "TABLET", "TAG", "TAIL", "TAP", "TEACHER",
  "TELESCOPE", "TEMPLE", "THEATER", "THIEF", "THUMB", "TICK", "TIE", "TIME", "TOKYO", "TOOTH",
  "TORCH", "TOWER", "TRACK", "TRAIN", "TRIANGLE", "TRIP", "TRUNK", "TUBE", "TURKEY", "UNDERTAKER",
  "UNICORN", "VACUUM", "VAN", "VET", "WAKE", "WALL", "WAR", "WASHER", "WASHINGTON", "WATCH",
  "WATER", "WAVE", "WEB", "WELL", "WHALE", "WHIP", "WIND", "WITCH", "WORM", "YARD",
];

const WORDS_CS = [
  "AFRIKA", "AGENT", "VZDUCH", "MIMOZEMŠŤAN", "ALPY", "AMAZON", "SANITKA", "AMERIKA", "ANDĚL", "ANTARKTIDA",
  "JABLKO", "PAŽE", "ATLANTIDA", "AUSTRÁLIE", "AZTÉKOVÉ", "ZÁDA", "MÍČ", "KAPELA", "BANKA", "BAR",
  "KŮRA", "NETOPÝR", "BATERIE", "PLÁŽ", "MEDVĚD", "RYTMUS", "POSTEL", "PEKING", "ZVONEK", "PÁSEK",
  "BERLÍN", "BERMUDY", "BOBULE", "ÚČET", "BLOK", "DESKA", "ŠROUB", "BOMBA", "BOND", "VÝBUCH",
  "BOTA", "LÁHEV", "LUK", "KRABICE", "MOST", "KARTÁČ", "DOLAR", "BUVOL", "CHYBA", "POLNICE",
  "TLAČÍTKO", "TELE", "KANADA", "ČEPICE", "HLAVNÍ MĚSTO", "AUTO", "KARTA", "MRKEV", "KASINO", "OBSAZENÍ",
  "KOČKA", "CELA", "KENTAUR", "STŘED", "ŽIDLE", "ZMĚNA", "NABITÍ", "ŠEK", "HRUĎ", "KUŘE",
  "ČÍNA", "ČOKOLÁDA", "KOSTEL", "KRUH", "ÚTES", "PLÁŠŤ", "KLUB", "KÓD", "ZIMA", "KOMIKS",
  "SLOŽENINA", "KONCERT", "DIRIGENT", "SMLOUVA", "KUCHAŘ", "MĚĎ", "BAVLNA", "SOUD", "PŘEBAL", "JEŘÁB",
  "HAVÁRIE", "KRIKET", "KŘÍŽ", "KORUNA", "KOLO", "ČESKO", "TANEC", "DATUM", "DEN", "SMRT",
  "PALUBA", "STUPEŇ", "DIAMANT", "KOSTKY", "DINOSAURUS", "NEMOC", "DOKTOR", "PES", "NÁVRH", "DRAK",
  "ŠATY", "VRTAČKA", "KAPKA", "KACHNA", "TRPASLÍK", "OREL", "EGYPT", "AMBASÁDA", "MOTOR", "ANGLIE",
  "EVROPA", "OKO", "OBLIČEJ", "TRH", "PODZIM", "FANOUŠEK", "PLOT", "POLE", "BOJOVNÍK", "POSTAVA",
  "SOUBOR", "FILM", "OHEŇ", "RYBA", "FLÉTNA", "MOUCHA", "NOHA", "SÍLA", "LES", "VIDLIČKA",
  "FRANCIE", "HRA", "PLYN", "GÉNIUS", "NĚMECKO", "DUCH", "OBŘÍ", "SKLO", "RUKAVICE", "ZLATO",
  "MILOST", "TRÁVA", "ŘECKO", "ZELENÝ", "ZEMĚ", "ŠUNKA", "RUKA", "JESTŘÁB", "HLAVA", "SRDCE",
  "HELIKOPTÉRA", "HIMALÁJE", "DÍRA", "HOLLYWOOD", "MED", "KAPUCE", "HÁK", "ROH", "KŮŇ", "PODKOVA",
  "NEMOCNICE", "HOTEL", "LED", "ZMRZLINA", "INDIE", "ŽELEZO", "SLONOVÍNA", "KLUK", "DŽEM", "TRYSKÁČ",
  "JUPITER", "KLOKAN", "KEČUP", "KLÍČ", "DÍTĚ", "KRÁL", "KIWI", "NŮŽ", "RYTÍŘ", "LAB",
  "KLÍN", "LASER", "PRÁVNÍK", "OLOVO", "CITRÓN", "SKŘÍTEK", "ŽIVOT", "SVĚTLO", "LIMUZÍNA", "LINKA",
  "ODKAZ", "LEV", "ODPADKY", "LOCH NESS", "ZÁMEK", "POLENO", "LONDÝN", "ŠTĚSTÍ", "POŠTA", "MAMUT",
  "JAVOR", "MRAMOR", "BŘEZEN", "HMOTA", "ZÁPAS", "MERKUR", "MEXIKO", "MIKROSKOP", "MILIONÁŘ", "DŮL",
  "MÁTA", "RAKETA", "MODEL", "KRTEK", "MĚSÍC", "MOSKVA", "HORA", "MYŠ", "ÚSTA", "HRNEK",
  "HŘEBÍK", "JEHLA", "SÍŤ", "NEW YORK", "NOC", "NINJA", "POZNÁMKA", "ROMÁN", "ZDRAVOTNÍ SESTRA", "OŘECH",
  "CHOBOTNICE", "OLEJ", "OLIVA", "OLYMP", "OPERA", "POMERANČ", "VARHANY", "DLAŇ", "PÁNEV", "KALHOTY",
  "PAPÍR", "PADÁK", "PARK", "ČÁST", "PRŮCHOD", "PASTA", "TUČŇÁK", "FÉNIX", "KLAVÍR", "KOLÁČ",
  "PILOT", "ŠPENDLÍK", "DÝMKA", "PIRÁT", "PISTOLE", "JÁM", "HŘIŠTĚ", "LETADLO", "PLAST", "TALÍŘ",
  "PTAKOPYSK", "HRA", "DĚJ", "BOD", "JED", "TYČE", "POLICIE", "BAZÉN", "PŘÍSTAV", "POŠTA",
  "LIBRA", "TISK", "PRINCEZNA", "DÝNĚ", "ŽÁČEK", "PYRAMIDA", "KRÁLOVNA", "KRÁLÍK", "RAKETA", "PAPRSEK",
  "REVOLUCE", "KRUH", "ROBIN", "ROBOT", "SKÁLA", "ŘÍM", "KOŘEN", "RŮŽE", "RULETA", "KOLO",
  "ŘADA", "PRAVÍTKO", "SATELIT", "SATURN", "VÁHA", "ŠKOLA", "VĚDEC", "ŠTÍR", "OBRAZOVKA", "POTÁPĚČ",
  "TULEŇ", "SERVER", "STÍN", "SHAKESPEARE", "ŽRALOK", "LOĎ", "BOTA", "OBCHOD", "VÝSTŘEL", "DŘEZ",
  "MRAKODRAP", "SKLUZ", "SLIMÁK", "PAŠERÁK", "SNÍH", "SNĚHULÁK", "PONOŽKA", "VOJÁK", "DUŠE", "ZVUK",
  "VESMÍR", "KOUZLO", "PAVOUK", "HŘEB", "PÁTEŘ", "MÍSTO", "JARO", "ŠPION", "ČTVEREC", "STADION",
  "PERSONÁL", "HVĚZDA", "STÁT", "TYČ", "AKCIE", "BRČKO", "POTOK", "STÁVKA", "ŠŇŮRA", "PONORKA",
  "OBLEK", "SUPERHRDINA", "HOUPAČKA", "SPÍNAČ", "STŮL", "TABLET", "ZNAČKA", "OCAS", "KOHOUTEK", "UČITEL",
  "TELESKOP", "CHRÁM", "DIVADLO", "ZLODĚJ", "PALEC", "KLÍŠTĚ", "KRAVATA", "ČAS", "TOKIO", "ZUB",
  "POCHODEŇ", "VĚŽ", "STOPA", "VLAK", "TROJÚHELNÍK", "VÝLET", "KUFR", "TRUBKA", "TURECKO", "POHŘEBNÍK",
  "JEDNOROŽEC", "VYSAVAČ", "DODÁVKA", "VETERINÁŘ", "PROBUZENÍ", "ZEĎ", "VÁLKA", "PRAČKA", "WASHINGTON", "HODINKY",
  "VODA", "VLNA", "PAVUČINA", "STUDNA", "VELRYBA", "BIČ", "VÍTR", "ČARODĚJNICE", "ČERV", "DVŮR",
];

const WORD_BANKS: Record<string, string[]> = {
  en: WORDS_EN,
  cs: WORDS_CS,
  es: WORDS_EN, // TODO: Add Spanish words
  fr: WORDS_EN, // TODO: Add French words
  de: WORDS_EN, // TODO: Add German words
};

export function getRandomWords(count: number, language: string = "en"): string[] {
  const words = WORD_BANKS[language] || WORDS_EN;
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateBoard(language?: string) {
  const words = getRandomWords(25, language);
  const startingTeam: "red" | "blue" = Math.random() < 0.5 ? "red" : "blue";
  
  // Starting team gets 9 words, other team gets 8, 7 neutral, 1 assassin
  const colors: Array<"red" | "blue" | "neutral" | "assassin"> = [
    ...Array(startingTeam === "red" ? 9 : 8).fill("red"),
    ...Array(startingTeam === "blue" ? 9 : 8).fill("blue"),
    ...Array(7).fill("neutral"),
    "assassin",
  ];
  
  // Shuffle colors
  colors.sort(() => Math.random() - 0.5);
  
  return {
    board: words.map((word, index) => ({
      word,
      color: colors[index],
      revealed: false,
    })),
    startingTeam,
    redCount: colors.filter(c => c === "red").length,
    blueCount: colors.filter(c => c === "blue").length,
  };
}
