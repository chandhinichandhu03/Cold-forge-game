/* =========================================================
   GAMETHON — The Living AI Universe
   Global Configuration & Universal Game Database
   ========================================================= */

window.GAMETHON = window.GAMETHON || {};

window.GAMETHON.Config = {
  TITLE: "GAMETHON",
  SUBTITLE: "The Living AI Universe",
  VERSION: "3.0.0-AAA",
  OFFLINE_MODE: true,
  OLLAMA_URL: "http://localhost:11434/api/generate",
  DEFAULT_LLM_MODEL: "llama3",

  // 6 Sub-Game Specifications
  SUB_GAMES: [
    {
      id: "boxing_arena",
      name: "AI Boxing Arena",
      tagline: "Realistic Boxing, RL Physics & Comic Engine",
      category: "Sports & Story",
      tagClass: "tag-sports",
      icon: "🥊",
      description: "Character creator, 12 boxing styles, ML punch prediction, stamina/sweat/blood physics, dynamic AI commentary, and procedural comic builder.",
      engine: "Canvas WebGL & RL AI Engine"
    },
    {
      id: "puzzleverse",
      name: "AI PuzzleVerse",
      tagline: "80+ AI-Powered Logic, Word & Mystery Games",
      category: "Puzzle & Logic",
      tagClass: "tag-puzzle",
      icon: "🧩",
      description: "Infinite 9x9 Sudoku, Wordle, Crossword generator, A* 3D Maze, Minesweeper safe-cell tutor, 2048, and AI Detective interrogator.",
      engine: "Procedural Logic Engine"
    },
    {
      id: "dreamverse",
      name: "DreamVerse Metaverse",
      tagline: "Real World, Dream World & Hidden World",
      category: "Metaverse & RPG",
      tagClass: "tag-meta",
      icon: "🌌",
      description: "Seamless 3-Realities switcher, procedural rooms, RAG memory log, dynamic NPC relationships, and morality matrix.",
      engine: "Dimension Nexus Engine"
    },
    {
      id: "project_ares",
      name: "Project ARES",
      tagline: "100-Bot AI Hyper-Realistic Battle Royale",
      category: "Action Shooter",
      tagClass: "tag-action",
      icon: "🎯",
      description: "100-bot combatants, shrinking safe zone, loot drops, weapon recoil/reload, vehicle physics, and tactical voice commands.",
      engine: "Top-Down Arena Engine"
    },
    {
      id: "two_worlds",
      name: "Chronicles of Two Worlds",
      tagline: "Real World → Imaginary Ecosystem Simulator",
      category: "Adventure",
      tagClass: "tag-adventure",
      icon: "🌱",
      description: "Planting trees, rescuing animals, and building cities in the real world dynamically morphs the imaginary ecosystem.",
      engine: "Ecosystem Simulator"
    },
    {
      id: "cursed_mansion",
      name: "Janani's Cursed Mansion",
      tagline: "Ultra-Realistic AI Horror Survival",
      category: "Horror & Stealth",
      tagClass: "tag-horror",
      icon: "👵",
      description: "Escape Granny (hearing AI), Grandpa (door-breaking AI), and Queen Janani (teleporting boss). Features spoken NLP ghost alerts.",
      engine: "Stealth Physics Engine"
    }
  ],

  // Wordle Dictionary Database
  WORDLE_DICTIONARY: [
    "CYBER", "NEXUS", "ROBOT", "LASER", "AIRED", "VOICE", "POWER", "GHOST", "PULSE", "MAZE", "PUNCH", "GUILD", "BRAIN", "FIGHT", "SPHERE"
  ],

  // 12 Boxing Styles
  BOXING_STYLES: [
    { id: "peek_a_boo", name: "Peek-a-boo", desc: "High guard defensive style with rapid counters." },
    { id: "southpaw", name: "Southpaw", desc: "Left-handed stance with unorthodox angle attacks." },
    { id: "swarmer", name: "Swarmer", desc: "Aggressive in-fighting with relentless hooks." },
    { id: "slugger", name: "Slugger", desc: "Power puncher focusing on raw knockout force." },
    { id: "out_boxer", name: "Out Boxer", desc: "Long-range jabs and smooth footwork." },
    { id: "counter_puncher", name: "Counter Puncher", desc: "Patient defender relying on precision counters." }
  ],

  // Default Player Data
  DEFAULT_PLAYER: {
    username: "CyberVanguard_01",
    level: 1,
    xp: 250,
    points: 1250,
    coins: 1500,
    gems: 50,
    diamonds: 50,
    giftVouchers: 250, // INR Cash Voucher balance
    withdrawableCash: 250,
    reputation: 100,
    character: {
      gender: "Male",
      height: 182,
      weight: 78,
      muscle: 85,
      skinColor: "#d2a679",
      hairStyle: "Cyber Cut",
      gloveColor: "#00f0ff",
      shortsColor: "#ff0077"
    },
    stats: {
      boxingWins: 5,
      boxingKOs: 4,
      puzzlesSolved: 18,
      battleRoyaleKills: 12,
      horrorEscapes: 2,
      treesPlanted: 16
    },
    inventory: [
      { id: "glove_cyber", name: "Cyber Red Gloves", category: "boxing", rarity: "Epic" },
      { id: "ar_vortex", name: "Vortex M4 Rifle", category: "weapon", rarity: "Legendary" },
      { id: "medkit", name: "Nanotech Med-Kit", category: "consumable", quantity: 5 }
    ],
    quests: [
      { id: "q1", title: "First Knockout", target: "Win 1 Boxing Match", status: "completed", rewardXP: 200 },
      { id: "q2", title: "Sudoku Master", target: "Solve 1 Sudoku Board", status: "active", rewardXP: 300 },
      { id: "q3", title: "Mansion Escape", target: "Escape Janani's Mansion", status: "active", rewardXP: 500 }
    ],
    achievements: ["FIRST_BLOOD", "PUZZLE_MASTER", "FIRST_ESCAPE"]
  },

  // Achievements List
  ACHIEVEMENTS: {
    FIRST_BLOOD: { name: "First Knockout", desc: "Win your first fight in AI Boxing Arena", icon: "🥊" },
    PUZZLE_MASTER: { name: "Mind Over Matter", desc: "Solve 10 puzzles in AI PuzzleVerse", icon: "🧠" },
    FIRST_ESCAPE: { name: "Survivor", desc: "Escape Janani's Mansion alive", icon: "🏃" },
    VICTORY_ROYALE: { name: "ARES Champion", desc: "Win a Battle Royale match", icon: "🏆" },
    ECO_WARRIOR: { name: "Living Earth", desc: "Plant 15 trees in Chronicles of Two Worlds", icon: "🌳" }
  }
};
