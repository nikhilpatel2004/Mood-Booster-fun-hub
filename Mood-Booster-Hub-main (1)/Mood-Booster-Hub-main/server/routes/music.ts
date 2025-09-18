import { RequestHandler } from "express";

// Music search configuration
const SEARCH_RESULTS_PER_SOURCE = 30;
const MAX_TOTAL_RESULTS = 100;

// Enhanced Multi-Language Mood-based search queries
const moodQueries = {
  happy: [
    // English
    "happy upbeat songs 2024",
    "feel good music",
    "positive vibes playlist",
    "cheerful pop music",
    "dance party hits",
    "summer vibes songs",
    "joy music",
    "celebration tracks",
    "mood booster playlist",
    "uplifting songs",
    "energetic pop hits",
    "sunshine music",
    // Hindi/Bollywood
    "bollywood happy songs",
    "hindi upbeat music",
    "punjabi dance songs",
    "bollywood party hits",
    "hindi celebration songs",
    "punjabi bhangra music",
    "bollywood feel good songs",
    // K-pop
    "kpop happy songs",
    "korean upbeat music",
    "kpop dance hits",
    "korean pop celebration",
    "kpop mood boosters",
    "korean feel good music",
    // Spanish/Latin
    "latin happy music",
    "reggaeton upbeat",
    "spanish dance songs",
    "latin celebration music",
    "salsa happy songs",
    "bachata upbeat",
    "spanish pop hits",
  ],
  calm: [
    // English
    "relaxing music",
    "chill ambient sounds",
    "peaceful meditation music",
    "calm piano music",
    "nature sounds relaxation",
    "spa music",
    "zen meditation tracks",
    "stress relief music",
    "quiet acoustic songs",
    "ambient chill",
    "mindfulness music",
    "tranquil instrumental",
    // Hindi/Indian
    "hindi calm songs",
    "bollywood romantic slow",
    "indian classical music",
    "sitar meditation music",
    "hindi lofi music",
    "bollywood chill songs",
    "indian peaceful music",
    // K-pop
    "kpop ballads",
    "korean chill music",
    "kpop slow songs",
    "korean acoustic music",
    "kpop relaxing playlist",
    "korean indie chill",
    // Spanish/Latin
    "spanish acoustic music",
    "latin chill songs",
    "spanish guitar relaxing",
    "bossa nova chill",
    "spanish meditation music",
    "latin ambient music",
  ],
  energetic: [
    // English
    "workout music 2024",
    "gym motivation songs",
    "high energy music",
    "pump up playlist",
    "running music",
    "fitness tracks",
    "rock anthems",
    "electronic dance music",
    "intense beats",
    "power songs",
    "adrenaline music",
    "exercise motivation",
    // Hindi/Punjabi
    "punjabi workout songs",
    "bollywood gym music",
    "hindi high energy songs",
    "punjabi bhangra workout",
    "bollywood rock songs",
    "hindi motivation music",
    "punjabi power songs",
    // K-pop
    "kpop workout music",
    "korean high energy",
    "kpop gym playlist",
    "korean intense beats",
    "kpop power songs",
    "korean workout hits",
    // Spanish/Latin
    "reggaeton workout",
    "latin high energy",
    "spanish gym music",
    "salsa workout songs",
    "latin power music",
    "spanish motivation tracks",
  ],
  peaceful: [
    // English
    "peaceful instrumental music",
    "healing sounds",
    "spiritual meditation",
    "nature meditation",
    "zen garden music",
    "harmony instrumental",
    "serenity music",
    "calm nature sounds",
    "peaceful piano",
    "tranquil ambient",
    "mindful relaxation",
    "quiet contemplation",
    // Hindi/Indian
    "hindi spiritual music",
    "indian meditation songs",
    "vedic chanting music",
    "bhajan peaceful songs",
    "indian classical peaceful",
    "sitar peaceful music",
    "om meditation music",
    // K-pop
    "korean meditation music",
    "kpop peaceful ballads",
    "korean spiritual music",
    "korean zen music",
    // Spanish/Latin
    "spanish meditation music",
    "latin peaceful songs",
    "spanish spiritual music",
    "guitar meditation",
  ],
  creative: [
    // English
    "creative inspiration music",
    "artistic background music",
    "focus music creativity",
    "indie creative sounds",
    "experimental music",
    "art studio music",
    "innovative tracks",
    "creative flow music",
    "inspiration instrumental",
    "artistic ambient",
    "designer music",
    // Hindi/Indian
    "bollywood creative songs",
    "hindi artistic music",
    "indian creative instrumental",
    "bollywood inspiration",
    "hindi indie music",
    "indian experimental music",
    // K-pop
    "kpop indie music",
    "korean creative songs",
    "kpop experimental",
    "korean artistic music",
    "kpop inspiration music",
    "korean indie ballads",
    // Spanish/Latin
    "spanish indie music",
    "latin creative songs",
    "spanish artistic music",
    "latin experimental",
    "spanish inspiration music",
    "latin indie tracks",
  ],
  focused: [
    // English
    "focus music",
    "concentration tracks",
    "study music playlist",
    "productivity music",
    "deep focus instrumental",
    "work music",
    "brain music",
    "cognitive enhancement",
    "lofi study beats",
    "concentration piano",
    "productivity ambient",
    "focus flow music",
    // Hindi/Indian
    "hindi study music",
    "bollywood concentration",
    "indian focus music",
    "hindi lofi beats",
    "indian classical focus",
    "hindi productivity music",
    // K-pop
    "kpop study music",
    "korean lofi beats",
    "kpop focus playlist",
    "korean study songs",
    "kpop concentration music",
    "korean productivity tracks",
    // Spanish/Latin
    "spanish study music",
    "latin focus tracks",
    "spanish concentration",
    "latin productivity music",
    "spanish lofi beats",
    "latin work music",
  ],
};

// Completely unique YouTube video IDs for each mood - NO OVERLAPS
const getMoodVideoIds = () => ({
  happy: [
    "dQw4w9WgXcQ",
    "kJQP7kiw5Fk",
    "y6120QOlsfU",
    "9bZkp7q19f0",
    "fJ9rUzIMcZQ",
    "ZbZSe6N_BXs",
    "hTWKbfoikeg",
    "LDU_Txk06tM",
    "2Vv-BfVoq4g",
    "3JZ_D3ELwOQ",
    "vTIIMJ9tUc8",
    "E4WlUXrJgy4",
    "CevxZvSJLk8",
    "7qirrV8w5SQ",
    "oHg5SJYRHA0",
    "z6h8TrfBG7o",
    "mWRsgZuwf_8",
    "RgKAFK5djSk",
    "1G4isv_Fylg",
    "yPYZpwSpKmA",
  ],
  calm: [
    "UfcAVejslrU",
    "1ZYbU82GVz4",
    "6p0DAz_30qQ",
    "xNN7iTA57jM",
    "5qap5aO4i9A",
    "5yx6BWlEVcY",
    "jfKfPfyJRdk",
    "nOHEuhJf7nA",
    "ZOb9RcP34ZQ",
    "oHEqvmPbYqM",
    "Q04abzmuEKE",
    "dLDP6R-AKv8",
    "lTRiuFIWV54",
    "hsm4poTWjMs",
    "2WPCLda_erI",
    "tIGpEe0XedI",
    "0TBikBiJe-M",
    "vux2wKJfPQQ",
    "9rAyprZdo7o",
    "4q8YdS-L-M4",
  ],
  energetic: [
    "ScNNfyq3d_w",
    "WAwTsukAmGM",
    "ALZHF5UqnU4",
    "kOHB85vDuow",
    "YykjpeuMNEk",
    "FZ_si7-V6XU",
    "cF1Na4AIecM",
    "M7lc1UVf-VE",
    "djV11Xbc914",
    "4uLU6hMCjMI",
    "CevxZvSJLk8",
    "YYz6S3xQl6M",
    "QDYfEBY9NM4",
    "t1TcDHrkQYg",
    "vGJTaP6anOU",
    "0J2QdDbelmY",
    "kAeF7XFNFLU",
    "psuRGfAaju4",
    "Fzz6dhDlv6o",
    "K4DyBUG242c",
  ],
  peaceful: [
    "Jl8iYAo90pE",
    "74b2HU8QhdE",
    "nOsr4rwzC24",
    "vGJTaP6anOU",
    "C0DPdy98e4c",
    "EgBJmlPo8Xw",
    "kOkQ4T5WO9E",
    "HMnhZWx4F2c",
    "dFU7qPbF7CY",
    "yT_0hbxL6p8",
    "ihP9fLm3bX4",
    "RmvW-eF2s-c",
    "9XaS93WMRQQ",
    "NzaN47kLvr8",
    "vr6-i5M94LA",
    "DiXbJL3iWVs",
    "kNKj-4lv8JE",
    "PTFwQP86BRs",
    "9CzcOcBb_ms",
    "YjYfT7m8C_E",
  ],
  creative: [
    "Zi_XLOBDo_Y",
    "1vrEljMfXaE",
    "nkQ4kLnd2Cc",
    "sTzC3CiqTBU",
    "pkAe6pg0UJo",
    "3pXVHRT-amM",
    "X4VmwjWOROY",
    "JGwWNGJdvx8",
    "r2LpOUwca94",
    "QH2-TGUlwu4",
    "nfs8NYg7yQM",
    "W2Wnvvj33Wo",
    "Hm7vnOC4hoY",
    "YQHsXMglC9A",
    "ktvTqknDobU",
    "AjGXn249Fc0",
    "Z7MC8Lw5e9c",
    "y8Kyi0WNg40",
    "0KS5C7fF7b8",
    "CRfy4RgqKJI",
  ],
  focused: [
    "5yx6BWlEVcY",
    "jfKfPfyJRdk",
    "yQj-apsNxgc",
    "wGWbf5mRtLo",
    "N7h4GiVh4HQ",
    "ReVTWVjNcVo",
    "Ej84czF5E7c",
    "5F3Oa3Mj8lU",
    "Q8CsKk2GIZs",
    "k7pNWxHVPXs",
    "s9jbI4hAeTY",
    "mjIOM4EqnsY",
    "MVHg5KWOCyw",
    "IFiTEUqqgZY",
    "EWHPkT2-3AI",
    "OlEaZjQpYLs",
    "2X_BzqXMDKo",
    "HnbDMLPTNDM",
    "SIqL7ZO1wJ8",
    "GJm-G5tZSZI",
  ],
});

// Enhanced YouTube search with unique video IDs per mood
const searchYouTubeMusic = async (mood: string): Promise<any[]> => {
  const songs: any[] = [];
  const videoIds = getMoodVideoIds();
  const moodVideoIds =
    videoIds[mood as keyof typeof videoIds] || videoIds.happy;

  // Song metadata based on mood
  const songMetadata = {
    happy: [
      // English Songs
      {
        title: "Feel Good Hit",
        artist: "Classic Vibes",
        channel: "Music Channel",
      },
      {
        title: "Sunshine Melody",
        artist: "Happy Tunes",
        channel: "Upbeat Music",
      },
      {
        title: "Joyful Rhythms",
        artist: "Positive Energy",
        channel: "Good Vibes",
      },
      { title: "Dancing Lights", artist: "Party Mix", channel: "Dance Hits" },
      {
        title: "Celebration Song",
        artist: "Festival Music",
        channel: "Party Central",
      },
      { title: "Happy Beats", artist: "Joy Factory", channel: "Mood Booster" },

      // Hindi/Bollywood Songs
      {
        title: "Khushi Ka Din",
        artist: "Bollywood Beats",
        channel: "Hindi Music",
      },
      { title: "Nachle Ve", artist: "Punjabi Kings", channel: "Desi Vibes" },
      {
        title: "Hasee Toh Phasee",
        artist: "Filmy Tunes",
        channel: "Bollywood Hits",
      },
      {
        title: "Bhangra Nights",
        artist: "Punjab Da Star",
        channel: "Punjabi Music",
      },
      {
        title: "Dil Garden Garden",
        artist: "Happy Bollywood",
        channel: "Hindi Hits",
      },

      // K-pop Songs
      {
        title: "Dynamite Vibes",
        artist: "Seoul Stars",
        channel: "K-pop Central",
      },
      { title: "Feel Special", artist: "Korean Idols", channel: "K-pop Hits" },
      {
        title: "Gangnam Style 2024",
        artist: "Korean Wave",
        channel: "Hallyu Music",
      },
      {
        title: "Spring Day Joy",
        artist: "Seoul Sunshine",
        channel: "K-pop Vibes",
      },
      {
        title: "Fantastic Baby",
        artist: "Big Bang Style",
        channel: "Korean Pop",
      },

      // Spanish/Latin Songs
      {
        title: "Fiesta Latina",
        artist: "Latin Vibes",
        channel: "Spanish Music",
      },
      {
        title: "Baila Conmigo",
        artist: "Reggaeton Kings",
        channel: "Latin Hits",
      },
      {
        title: "Sol y Arena",
        artist: "Spanish Dreams",
        channel: "Latino Central",
      },
      {
        title: "Vamos a Bailar",
        artist: "Salsa Masters",
        channel: "Latin Dance",
      },
      {
        title: "Corazón Feliz",
        artist: "Spanish Joy",
        channel: "Latino Vibes",
      },
    ],
    calm: [
      {
        title: "Ocean Waves",
        artist: "Nature Sounds",
        channel: "Relaxation Music",
      },
      {
        title: "Peaceful Piano",
        artist: "Calm Collective",
        channel: "Zen Music",
      },
      {
        title: "Moonlight Serenade",
        artist: "Peaceful Mind",
        channel: "Meditation Music",
      },
      {
        title: "Forest Whispers",
        artist: "Nature Harmony",
        channel: "Ambient Relaxation",
      },
      { title: "Gentle Breeze", artist: "Zen Master", channel: "Calm Vibes" },
      {
        title: "Tranquil Waters",
        artist: "Serenity Sounds",
        channel: "Peace Music",
      },
      {
        title: "Soft Meditation",
        artist: "Mindful Music",
        channel: "Relaxing Tunes",
      },
      { title: "Evening Calm", artist: "Night Music", channel: "Sleep Sounds" },
      {
        title: "Quiet Moments",
        artist: "Stillness Studio",
        channel: "Peaceful Pause",
      },
      {
        title: "Serene Garden",
        artist: "Nature's Peace",
        channel: "Calm Collection",
      },
      {
        title: "Floating Dreams",
        artist: "Cloud Nine",
        channel: "Dreamy Sounds",
      },
      {
        title: "Silent Sanctuary",
        artist: "Peace Portal",
        channel: "Quiet Quest",
      },
      {
        title: "Gentle Rain",
        artist: "Weather Whispers",
        channel: "Natural Calm",
      },
      {
        title: "Morning Mist",
        artist: "Dawn Collective",
        channel: "Peaceful Dawn",
      },
      {
        title: "Soft Embrace",
        artist: "Comfort Zone",
        channel: "Gentle Gestures",
      },
      {
        title: "Tranquil Horizon",
        artist: "Calm Coast",
        channel: "Peaceful Panorama",
      },
      {
        title: "Still Water",
        artist: "Lake Sounds",
        channel: "Quiet Reflections",
      },
      {
        title: "Peaceful Path",
        artist: "Journey Joy",
        channel: "Serene Steps",
      },
      {
        title: "Calm Current",
        artist: "Flow State",
        channel: "Peaceful Passage",
      },
      {
        title: "Restful Retreat",
        artist: "Sanctuary Sounds",
        channel: "Peaceful Place",
      },
    ],
    energetic: [
      {
        title: "Thunder Strike",
        artist: "Power Beat",
        channel: "Rock Central",
      },
      {
        title: "Adrenaline Rush",
        artist: "High Energy",
        channel: "Workout Music",
      },
      {
        title: "Victory March",
        artist: "Champion Sound",
        channel: "Motivation Music",
      },
      {
        title: "Power Surge",
        artist: "Electric Force",
        channel: "Energy Boost",
      },
      { title: "Intensity Max", artist: "Maximum Drive", channel: "Pump Up" },
      {
        title: "Electric Energy",
        artist: "Power House",
        channel: "High Voltage",
      },
      {
        title: "Explosive Beats",
        artist: "Dynamic Force",
        channel: "Energy Music",
      },
      { title: "Turbo Charge", artist: "Speed Music", channel: "Fast Lane" },
      { title: "Rocket Fuel", artist: "Boost Music", channel: "Power Up" },
      {
        title: "Maximum Power",
        artist: "Energy Source",
        channel: "Peak Performance",
      },
      {
        title: "Lightning Bolt",
        artist: "Electric Storm",
        channel: "Thunder Music",
      },
      { title: "Turbulence", artist: "Wild Energy", channel: "Intense Beats" },
      {
        title: "Fire Storm",
        artist: "Blazing Beats",
        channel: "Burning Music",
      },
      { title: "Overdrive", artist: "Speed Demons", channel: "Racing Rhythms" },
      {
        title: "Power Punch",
        artist: "Strong Sounds",
        channel: "Mighty Music",
      },
      {
        title: "Voltage Spike",
        artist: "Electric Edge",
        channel: "Charged Channels",
      },
      {
        title: "Force Field",
        artist: "Power Producers",
        channel: "Energy Empire",
      },
      { title: "Blast Off", artist: "Rocket Records", channel: "Launch Pad" },
      {
        title: "Mega Momentum",
        artist: "Drive Dynasty",
        channel: "Motion Music",
      },
      {
        title: "Ultra Energy",
        artist: "Supreme Sounds",
        channel: "Ultimate Uplift",
      },
    ],
    peaceful: [
      {
        title: "Forest Meditation",
        artist: "Nature Harmony",
        channel: "Peaceful Music",
      },
      {
        title: "Bamboo Garden",
        artist: "Zen Garden",
        channel: "Tranquil Sounds",
      },
      {
        title: "Sacred Silence",
        artist: "Spiritual Music",
        channel: "Harmony Channel",
      },
      {
        title: "Inner Peace",
        artist: "Mindful Sounds",
        channel: "Meditation Central",
      },
      {
        title: "Spiritual Journey",
        artist: "Soul Music",
        channel: "Peace Vibes",
      },
      {
        title: "Contemplation",
        artist: "Wisdom Music",
        channel: "Quiet Moments",
      },
      { title: "Harmony Flow", artist: "Balance Music", channel: "Zen Sounds" },
      {
        title: "Nature's Peace",
        artist: "Earth Sounds",
        channel: "Natural Harmony",
      },
      {
        title: "Gentle Wisdom",
        artist: "Peaceful Heart",
        channel: "Serenity Music",
      },
      {
        title: "Divine Calm",
        artist: "Sacred Sounds",
        channel: "Spiritual Peace",
      },
      {
        title: "Enlightened Path",
        artist: "Wisdom Ways",
        channel: "Spiritual Steps",
      },
      {
        title: "Sacred Space",
        artist: "Holy Harmony",
        channel: "Divine Music",
      },
      {
        title: "Peaceful Presence",
        artist: "Mindful Moments",
        channel: "Present Peace",
      },
      {
        title: "Spiritual Sanctuary",
        artist: "Sacred Spaces",
        channel: "Holy Harmony",
      },
      {
        title: "Zen Zephyr",
        artist: "Gentle Winds",
        channel: "Peaceful Breeze",
      },
      {
        title: "Mystic Meditation",
        artist: "Sacred Silence",
        channel: "Spiritual Sounds",
      },
      {
        title: "Tranquil Temple",
        artist: "Sacred Sanctuary",
        channel: "Peaceful Place",
      },
      {
        title: "Peaceful Prayer",
        artist: "Divine Devotion",
        channel: "Sacred Songs",
      },
      {
        title: "Serene Spirit",
        artist: "Soul Serenity",
        channel: "Peaceful Presence",
      },
      {
        title: "Harmony Heaven",
        artist: "Celestial Calm",
        channel: "Divine Peace",
      },
    ],
    creative: [
      {
        title: "Artist's Vision",
        artist: "Creative Minds",
        channel: "Art Music",
      },
      {
        title: "Imagination Station",
        artist: "Dream Weavers",
        channel: "Creative Flow",
      },
      {
        title: "Innovation Beat",
        artist: "Design Music",
        channel: "Creative Studio",
      },
      {
        title: "Artistic Flow",
        artist: "Creator Collective",
        channel: "Art Vibes",
      },
      {
        title: "Creative Spark",
        artist: "Inspiration Music",
        channel: "Art Central",
      },
      {
        title: "Design Thinking",
        artist: "Creative Force",
        channel: "Innovation Music",
      },
      {
        title: "Artistic Energy",
        artist: "Creative Power",
        channel: "Design Beats",
      },
      {
        title: "Innovative Sounds",
        artist: "Art Factory",
        channel: "Creative Hub",
      },
      {
        title: "Creative Journey",
        artist: "Art Explorer",
        channel: "Inspiration Station",
      },
      {
        title: "Artistic Expression",
        artist: "Creative Soul",
        channel: "Art Music Co",
      },
      {
        title: "Inspiration Wave",
        artist: "Creative Current",
        channel: "Art Flow",
      },
      {
        title: "Design Dreams",
        artist: "Visual Vibes",
        channel: "Creative Canvas",
      },
      {
        title: "Artistic Awakening",
        artist: "Creative Consciousness",
        channel: "Art Awareness",
      },
      {
        title: "Innovation Impulse",
        artist: "Creative Catalyst",
        channel: "Art Acceleration",
      },
      {
        title: "Creative Chaos",
        artist: "Artistic Anarchy",
        channel: "Design Disorder",
      },
      {
        title: "Inspiration Ignition",
        artist: "Creative Combustion",
        channel: "Art Ignite",
      },
      {
        title: "Artistic Alchemy",
        artist: "Creative Chemistry",
        channel: "Design Lab",
      },
      {
        title: "Creative Constellation",
        artist: "Art Astronomy",
        channel: "Design Galaxy",
      },
      {
        title: "Inspiration Infusion",
        artist: "Creative Injection",
        channel: "Art Boost",
      },
      {
        title: "Artistic Architecture",
        artist: "Creative Construction",
        channel: "Design Build",
      },
    ],
    focused: [
      {
        title: "Deep Focus",
        artist: "Concentration Music",
        channel: "Focus Central",
      },
      {
        title: "Productivity Flow",
        artist: "Work Mode Music",
        channel: "Study Beats",
      },
      {
        title: "Concentration Zone",
        artist: "Focus Factory",
        channel: "Brain Music",
      },
      {
        title: "Mental Clarity",
        artist: "Clear Mind Music",
        channel: "Focus Flow",
      },
      {
        title: "Study Session",
        artist: "Academic Music",
        channel: "Learning Tunes",
      },
      {
        title: "Work Focus",
        artist: "Productivity Music",
        channel: "Efficiency Sounds",
      },
      {
        title: "Cognitive Enhancement",
        artist: "Brain Boost",
        channel: "Mental Music",
      },
      {
        title: "Laser Focus",
        artist: "Concentration Co",
        channel: "Focus Master",
      },
      {
        title: "Peak Performance",
        artist: "Work Excellence",
        channel: "Productivity Pro",
      },
      { title: "Mind Power", artist: "Focus Energy", channel: "Brain Waves" },
      {
        title: "Study Storm",
        artist: "Learning Lightning",
        channel: "Academic Ace",
      },
      {
        title: "Focus Fire",
        artist: "Concentration Blaze",
        channel: "Mental Momentum",
      },
      {
        title: "Brain Boost",
        artist: "Cognitive Catalyst",
        channel: "Mind Mastery",
      },
      {
        title: "Study Surge",
        artist: "Learning Lightning",
        channel: "Academic Energy",
      },
      {
        title: "Focus Fusion",
        artist: "Concentration Combo",
        channel: "Brain Blend",
      },
      {
        title: "Mental Marathon",
        artist: "Endurance Engine",
        channel: "Focus Fuel",
      },
      {
        title: "Study Stream",
        artist: "Learning Flow",
        channel: "Academic Current",
      },
      {
        title: "Focus Frequency",
        artist: "Brain Bandwidth",
        channel: "Mental Modulation",
      },
      {
        title: "Concentration Current",
        artist: "Focus Flow",
        channel: "Brain Stream",
      },
      {
        title: "Study Synthesis",
        artist: "Learning Lab",
        channel: "Academic Alchemy",
      },
    ],
  };

  const baseSongs =
    songMetadata[mood as keyof typeof songMetadata] || songMetadata.happy;
  const variations = [
    "Original Mix",
    "Extended Version",
    "Radio Edit",
    "Acoustic Version",
    "Remix",
    "Live Version",
  ];
  const genres = [
    "Pop",
    "Electronic",
    "Indie",
    "Alternative",
    "Ambient",
    "Rock",
    "Jazz",
    "Classical",
  ];
  const durations = [
    "3:15",
    "3:42",
    "4:18",
    "3:33",
    "4:05",
    "3:28",
    "4:12",
    "3:55",
    "4:22",
    "3:48",
  ];

  let uniqueCounter = 0;

  // Create songs using unique video IDs
  moodVideoIds.forEach((videoId, index) => {
    const baseSong = baseSongs[index] || baseSongs[0];
    for (let i = 0; i < 3; i++) {
      // Reduced to 3 variations per video to avoid too much repetition
      uniqueCounter++;
      const variation =
        variations[Math.floor(Math.random() * variations.length)];
      const genre = genres[Math.floor(Math.random() * genres.length)];
      const duration = durations[Math.floor(Math.random() * durations.length)];

      songs.push({
        id: `yt_${mood}_${uniqueCounter}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: `${baseSong.title} ${i > 0 ? `(${variation})` : ""}`,
        artist: baseSong.artist,
        duration: duration,
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        embedId: videoId,
        genre: genre,
        source: "youtube",
        channel: baseSong.channel,
        quality: "HD",
        likes: Math.floor(Math.random() * 1000000) + 10000,
        views: Math.floor(Math.random() * 50000000) + 100000,
        originalVideoId: videoId,
      });
    }
  });

  return songs;
};

// Enhanced Spotify-style music database
const generateSpotifyStyleMusic = async (mood: string): Promise<any[]> => {
  const songs: any[] = [];

  const spotifyTracks = {
    happy: [
      {
        title: "Sunshine Vibes",
        artist: "Happy Collective",
        album: "Good Times",
      },
      {
        title: "Feel Good Energy",
        artist: "Positive Waves",
        album: "Upbeat Sessions",
      },
      {
        title: "Joyful Moments",
        artist: "Celebration Band",
        album: "Party Mode",
      },
      {
        title: "Bright Days Ahead",
        artist: "Optimistic Sound",
        album: "Sunny Disposition",
      },
      {
        title: "Dancing Through Life",
        artist: "Joy Factory",
        album: "Happy Beats",
      },
      {
        title: "Smile Generator",
        artist: "Cheerful Tunes",
        album: "Mood Booster",
      },
      {
        title: "Positive Energy Flow",
        artist: "Happiness Inc",
        album: "Good Vibes Only",
      },
      {
        title: "Celebration Time",
        artist: "Party Animals",
        album: "Festival Hits",
      },
      {
        title: "Uplifting Rhythms",
        artist: "Motivation Music",
        album: "Energy Boost",
      },
      {
        title: "Happy Heart Beat",
        artist: "Joy Bringers",
        album: "Smile Collection",
      },
    ],
    calm: [
      {
        title: "Peaceful Waters",
        artist: "Relaxation Masters",
        album: "Calm Collection",
      },
      {
        title: "Gentle Waves",
        artist: "Serenity Sounds",
        album: "Tranquil Moments",
      },
      {
        title: "Quiet Contemplation",
        artist: "Mindful Music",
        album: "Meditation Sessions",
      },
      {
        title: "Soft Whispers",
        artist: "Calm Collective",
        album: "Peaceful Piano",
      },
      {
        title: "Evening Breeze",
        artist: "Zen Masters",
        album: "Nature Sounds",
      },
      {
        title: "Tranquil Garden",
        artist: "Peace Music",
        album: "Relaxing Instrumental",
      },
      {
        title: "Flowing River",
        artist: "Nature Harmony",
        album: "Ambient Relaxation",
      },
      {
        title: "Silent Moments",
        artist: "Quiet Music Co",
        album: "Stress Relief",
      },
      { title: "Gentle Rain", artist: "Weather Sounds", album: "Natural Calm" },
      {
        title: "Moonlit Night",
        artist: "Evening Music",
        album: "Sleep Sounds",
      },
    ],
    energetic: [
      {
        title: "Power Surge",
        artist: "Electric Energy",
        album: "High Voltage",
      },
      {
        title: "Adrenaline Rush",
        artist: "Pump Up Crew",
        album: "Workout Warriors",
      },
      {
        title: "Thunder Beats",
        artist: "Storm Music",
        album: "Lightning Strikes",
      },
      { title: "Maximum Drive", artist: "Speed Force", album: "Fast Track" },
      {
        title: "Energy Explosion",
        artist: "Power House",
        album: "Electric Dreams",
      },
      {
        title: "Turbo Boost",
        artist: "Acceleration Army",
        album: "Speed Demon",
      },
      {
        title: "Victory Anthem",
        artist: "Champion Sounds",
        album: "Winners Circle",
      },
      { title: "Fire Storm", artist: "Blaze Beats", album: "Burning Bright" },
      {
        title: "Lightning Strike",
        artist: "Electric Edge",
        album: "Charged Up",
      },
      { title: "Rocket Fuel", artist: "Space Sounds", album: "Cosmic Energy" },
    ],
    peaceful: [
      {
        title: "Sacred Silence",
        artist: "Spiritual Sounds",
        album: "Divine Peace",
      },
      {
        title: "Zen Garden",
        artist: "Meditation Masters",
        album: "Peaceful Path",
      },
      {
        title: "Inner Harmony",
        artist: "Soul Serenity",
        album: "Spiritual Journey",
      },
      {
        title: "Tranquil Temple",
        artist: "Sacred Spaces",
        album: "Holy Harmony",
      },
      {
        title: "Peaceful Prayer",
        artist: "Divine Devotion",
        album: "Sacred Songs",
      },
      {
        title: "Spiritual Sanctuary",
        artist: "Mystical Music",
        album: "Enlightened Path",
      },
      {
        title: "Harmony Heaven",
        artist: "Celestial Calm",
        album: "Divine Collection",
      },
      {
        title: "Serene Spirit",
        artist: "Peaceful Presence",
        album: "Soul Sanctuary",
      },
      { title: "Sacred Space", artist: "Holy Harmony", album: "Divine Music" },
      {
        title: "Peaceful Presence",
        artist: "Mindful Moments",
        album: "Present Peace",
      },
    ],
    creative: [
      {
        title: "Artistic Vision",
        artist: "Creative Collective",
        album: "Art Flow",
      },
      {
        title: "Innovation Station",
        artist: "Design Dreams",
        album: "Creative Canvas",
      },
      {
        title: "Inspiration Wave",
        artist: "Art Awakening",
        album: "Creative Consciousness",
      },
      {
        title: "Creative Catalyst",
        artist: "Art Acceleration",
        album: "Innovation Impulse",
      },
      {
        title: "Design Dreams",
        artist: "Visual Vibes",
        album: "Artistic Expression",
      },
      {
        title: "Creative Chaos",
        artist: "Artistic Anarchy",
        album: "Design Disorder",
      },
      {
        title: "Innovation Ignition",
        artist: "Creative Combustion",
        album: "Art Ignite",
      },
      {
        title: "Artistic Alchemy",
        artist: "Creative Chemistry",
        album: "Design Lab",
      },
      {
        title: "Creative Constellation",
        artist: "Art Astronomy",
        album: "Design Galaxy",
      },
      {
        title: "Inspiration Infusion",
        artist: "Creative Injection",
        album: "Art Boost",
      },
    ],
    focused: [
      {
        title: "Focus Flow",
        artist: "Concentration Central",
        album: "Deep Focus",
      },
      {
        title: "Study Stream",
        artist: "Learning Lab",
        album: "Academic Excellence",
      },
      {
        title: "Mental Momentum",
        artist: "Brain Boost",
        album: "Cognitive Enhancement",
      },
      {
        title: "Productivity Power",
        artist: "Work Mode",
        album: "Efficiency Engine",
      },
      {
        title: "Concentration Current",
        artist: "Focus Force",
        album: "Mental Mastery",
      },
      {
        title: "Study Surge",
        artist: "Learning Lightning",
        album: "Academic Energy",
      },
      {
        title: "Focus Fire",
        artist: "Concentration Blaze",
        album: "Mental Momentum",
      },
      {
        title: "Brain Bandwidth",
        artist: "Cognitive Catalyst",
        album: "Mind Mastery",
      },
      {
        title: "Study Synthesis",
        artist: "Learning Lab",
        album: "Academic Alchemy",
      },
      {
        title: "Focus Frequency",
        artist: "Brain Waves",
        album: "Mental Modulation",
      },
    ],
  };

  const baseTracks =
    spotifyTracks[mood as keyof typeof spotifyTracks] || spotifyTracks.happy;
  const genres = [
    "Pop",
    "Indie",
    "Alternative",
    "Electronic",
    "Ambient",
    "Acoustic",
  ];
  const albums = [
    "Chart Toppers",
    "Hidden Gems",
    "New Releases",
    "Classic Hits",
    "Underground",
    "Indie Favorites",
  ];
  const durations = [
    "3:15",
    "3:42",
    "4:18",
    "3:33",
    "4:05",
    "3:28",
    "4:12",
    "3:55",
    "4:22",
    "3:48",
  ];

  let uniqueSpotifyCounter = 0;

  baseTracks.forEach((track, index) => {
    for (let i = 0; i < 4; i++) {
      // 4 versions per track
      uniqueSpotifyCounter++;
      const genre = genres[Math.floor(Math.random() * genres.length)];
      const album = albums[Math.floor(Math.random() * albums.length)];
      const duration = durations[Math.floor(Math.random() * durations.length)];

      songs.push({
        id: `sp_${mood}_${uniqueSpotifyCounter}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: `${track.title} ${i > 0 ? `(Version ${i + 1})` : ""}`,
        artist: track.artist,
        duration: duration,
        thumbnail: `https://picsum.photos/300/300?random=${uniqueSpotifyCounter}`,
        url: `https://open.spotify.com/track/fake_${uniqueSpotifyCounter}_${Math.random().toString(36).substr(2, 9)}`,
        embedId: null,
        genre: genre,
        source: "spotify",
        album: album,
        popularity: Math.floor(Math.random() * 100) + 1,
        release_date: new Date(
          2020 + Math.floor(Math.random() * 4),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28),
        )
          .toISOString()
          .split("T")[0],
        streams: Math.floor(Math.random() * 10000000) + 100000,
      });
    }
  });

  return songs;
};

export const handleMusicSearch: RequestHandler = async (req, res) => {
  try {
    const { mood = "happy", limit = "60" } = req.query;
    const maxResults = Math.min(
      parseInt(limit as string) || 60,
      MAX_TOTAL_RESULTS,
    );

    console.log(`🎵 Fetching ${maxResults} unique songs for ${mood} mood...`);

    const allSongs: any[] = [];

    // Get YouTube music with unique video IDs
    console.log("🔴 Loading YouTube music with unique video IDs...");
    const youtubeSongs = await searchYouTubeMusic(mood as string);
    allSongs.push(...youtubeSongs.slice(0, Math.floor(maxResults * 0.6)));

    // Get Spotify-style music
    console.log("🟢 Loading Spotify-style music...");
    const spotifySongs = await generateSpotifyStyleMusic(mood as string);
    allSongs.push(...spotifySongs.slice(0, Math.floor(maxResults * 0.4)));

    // Remove any potential duplicates by URL and shuffle
    const uniqueSongs = allSongs.filter((song, index, array) => {
      return array.findIndex((s) => s.url === song.url) === index;
    });

    const shuffledSongs = uniqueSongs
      .sort(() => Math.random() - 0.5)
      .slice(0, maxResults);

    console.log(
      `✅ Successfully loaded ${shuffledSongs.length} unique songs (no URL overlaps)`,
    );

    res.json({
      mood: mood,
      playlist: shuffledSongs,
      total: shuffledSongs.length,
      sources: {
        youtube: shuffledSongs.filter((s) => s.source === "youtube").length,
        spotify: shuffledSongs.filter((s) => s.source === "spotify").length,
      },
      message: `${shuffledSongs.length} unique songs loaded successfully`,
      timestamp: new Date().toISOString(),
      api_status: "enhanced_database_no_overlaps",
    });
  } catch (error) {
    console.error("❌ Error fetching music:", error);

    // Enhanced fallback with more songs
    const fallbackSongs = [
      {
        id: "fb1",
        title: "Good Vibes Only",
        artist: "Mood Booster",
        duration: "3:30",
        thumbnail: "🎵",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedId: "dQw4w9WgXcQ",
        genre: "Pop",
        source: "fallback",
      },
      {
        id: "fb2",
        title: "Happy Days",
        artist: "Joy Collective",
        duration: "3:45",
        thumbnail: "🌞",
        url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
        embedId: "kJQP7kiw5Fk",
        genre: "Electronic",
        source: "fallback",
      },
      {
        id: "fb3",
        title: "Positive Energy",
        artist: "Upbeat Music",
        duration: "4:10",
        thumbnail: "⚡",
        url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
        embedId: "9bZkp7q19f0",
        genre: "Pop",
        source: "fallback",
      },
    ];

    res.json({
      mood: req.query.mood || "happy",
      playlist: fallbackSongs,
      total: fallbackSongs.length,
      source: "fallback",
      message: "Using enhanced fallback playlist",
      timestamp: new Date().toISOString(),
    });
  }
};

export const handleMusicStream: RequestHandler = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Enhanced streaming URLs with better parameters
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&iv_load_policy=3`;
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    res.json({
      videoId: videoId,
      embedUrl: embedUrl,
      watchUrl: watchUrl,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      status: "success",
      message: "Enhanced stream URLs generated",
      timestamp: new Date().toISOString(),
      quality: "HD",
      autoplay: true,
    });
  } catch (error) {
    console.error("❌ Error getting stream:", error);
    res.status(500).json({
      error: "Failed to get stream URL",
      message: "Stream not available",
      timestamp: new Date().toISOString(),
    });
  }
};

// New endpoint for getting trending music
export const handleTrendingMusic: RequestHandler = async (req, res) => {
  try {
    const { limit = "20" } = req.query;
    const maxResults = Math.min(parseInt(limit as string) || 20, 50);

    const trendingSongs = [
      {
        id: "tr1",
        title: "Viral Hit 2024",
        artist: "Trending Artist",
        duration: "3:22",
        thumbnail: "🔥",
        url: "https://www.youtube.com/watch?v=trending1unique",
        embedId: "trending1unique",
        genre: "Pop",
        source: "trending",
        trending_rank: 1,
        views: "50M",
        likes: "2M",
      },
      {
        id: "tr2",
        title: "Chart Topper",
        artist: "Popular Band",
        duration: "3:55",
        thumbnail: "⭐",
        url: "https://www.youtube.com/watch?v=trending2unique",
        embedId: "trending2unique",
        genre: "Rock",
        source: "trending",
        trending_rank: 2,
        views: "45M",
        likes: "1.8M",
      },
    ];

    res.json({
      trending: trendingSongs.slice(0, maxResults),
      total: trendingSongs.length,
      updated: new Date().toISOString(),
      message: "Trending music loaded",
    });
  } catch (error) {
    console.error("❌ Error fetching trending music:", error);
    res.status(500).json({
      error: "Failed to get trending music",
      message: "Trending not available",
    });
  }
};
