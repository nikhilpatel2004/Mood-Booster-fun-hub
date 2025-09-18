import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import SmartMoodDetection from "@/components/SmartMoodDetection";
import AutoPlaylistGenerator from "@/components/AutoPlaylistGenerator";
import DailyMoodJournal from "@/components/DailyMoodJournal";
import SongSearch from "@/components/SongSearch";
import MoodBoosterExtras from "@/components/MoodBoosterExtras";
import AIChatbot from "@/components/AIChatbot";
import MoodThemeEngine from "@/components/MoodThemeEngine";
import AIPersonalizationEngine from "@/components/AIPersonalizationEngine";
import {
  Sun,
  Moon,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Heart,
  Smile,
  Coffee,
  Zap,
  Star,
  Gamepad2,
  Music,
  Quote,
  Lightbulb,
  Volume2,
  Repeat,
  RefreshCw,
  Sparkles,
  Brain,
  Target,
  Trophy,
  Users,
  Compass,
  Waves,
  Wind,
  CloudRain,
  Flame,
  Leaf,
  Snowflake,
  Rainbow,
  Eye,
  Headphones,
  Download,
  Share2,
  BookOpen,
} from "lucide-react";

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  gradient: string;
  particles: string[];
  description: string;
  benefits: string[];
}

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  mood: string;
  genre: string;
  cover: string;
  url?: string;
  embedId?: string;
  thumbnail?: string;
}

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface ApiJoke {
  joke: string;
  source: string;
  category: string;
}

interface ApiQuote {
  quote: string;
  author: string;
  source: string;
}

export default function Index() {
  // Theme and mood state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>("happy");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Music state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  // Games state
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [memoryScore, setMemoryScore] = useState(0);
  const [guessNumber, setGuessNumber] = useState<number | null>(null);
  const [guess, setGuess] = useState("");
  const [guessResult, setGuessResult] = useState("");
  const [guessAttempts, setGuessAttempts] = useState(0);
  const [ticTacToe, setTicTacToe] = useState(Array(9).fill(""));
  const [ticTacPlayer, setTicTacPlayer] = useState("X");
  const [gameStats, setGameStats] = useState({ wins: 0, games: 0 });

  // Content state
  const [currentJoke, setCurrentJoke] = useState<ApiJoke | null>(null);
  const [currentQuote, setCurrentQuote] = useState<ApiQuote | null>(null);
  const [isLoadingJoke, setIsLoadingJoke] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  // Music API state
  const [apiSongs, setApiSongs] = useState<Song[]>([]);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");

  // Animation refs
  const particlesRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const moods: Mood[] = [
    {
      id: "happy",
      name: "Joyful",
      emoji: "😊",
      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
      gradient: "from-yellow-400 via-orange-400 to-pink-400",
      particles: ["😊", "😄", "🎉", "⭐", "🌈", "✨", "🎊", "💫"],
      description: "Boost your happiness and spread positive vibes",
      benefits: [
        "Increased energy",
        "Better mood",
        "Social connection",
        "Creative thinking",
      ],
    },
    {
      id: "calm",
      name: "Serene",
      emoji: "🧘",
      color: "bg-gradient-to-r from-blue-400 to-cyan-500",
      gradient: "from-blue-400 via-cyan-400 to-teal-400",
      particles: ["🧘", "🌸", "☁️", "💙", "🕯️", "🦋", "🌊", "🍃"],
      description: "Find inner peace and tranquility",
      benefits: [
        "Reduced stress",
        "Mental clarity",
        "Better focus",
        "Emotional balance",
      ],
    },
    {
      id: "energetic",
      name: "Dynamic",
      emoji: "⚡",
      color: "bg-gradient-to-r from-red-400 to-pink-500",
      gradient: "from-red-400 via-pink-400 to-purple-400",
      particles: ["⚡", "🔥", "💪", "🚀", "⭐", "💥", "🎯", "🏃"],
      description: "Unleash your power and achieve greatness",
      benefits: [
        "High motivation",
        "Peak performance",
        "Goal achievement",
        "Physical energy",
      ],
    },
    {
      id: "peaceful",
      name: "Zen",
      emoji: "🌿",
      color: "bg-gradient-to-r from-green-400 to-emerald-500",
      gradient: "from-green-400 via-emerald-400 to-teal-400",
      particles: ["🌿", "🍃", "🌱", "🦋", "✨", "🌺", "🕊️", "🌸"],
      description: "Embrace harmony and natural balance",
      benefits: [
        "Deep relaxation",
        "Mindfulness",
        "Spiritual growth",
        "Inner wisdom",
      ],
    },
    {
      id: "creative",
      name: "Inspired",
      emoji: "🎨",
      color: "bg-gradient-to-r from-purple-400 to-indigo-500",
      gradient: "from-purple-400 via-indigo-400 to-blue-400",
      particles: ["🎨", "✨", "💡", "🌟", "🎭", "🎪", "🎨", "💫"],
      description: "Unlock your creative potential",
      benefits: [
        "Enhanced creativity",
        "Artistic inspiration",
        "Innovation",
        "Self-expression",
      ],
    },
    {
      id: "focused",
      name: "Determined",
      emoji: "🎯",
      color: "bg-gradient-to-r from-gray-600 to-slate-700",
      gradient: "from-gray-600 via-slate-600 to-zinc-600",
      particles: ["🎯", "📚", "💼", "⚡", "🧠", "💪", "🔥", "⭐"],
      description: "Achieve laser-sharp focus and productivity",
      benefits: [
        "Deep concentration",
        "Productivity boost",
        "Goal clarity",
        "Mental sharpness",
      ],
    },
  ];

  const songs: Song[] = [
    // Happy/Joyful Songs
    {
      id: "1",
      title: "Sunshine Symphony",
      artist: "Bright Waves",
      duration: "3:42",
      mood: "happy",
      genre: "Pop",
      cover: "🌞",
    },
    {
      id: "2",
      title: "Dancing Colors",
      artist: "Joy Collective",
      duration: "3:28",
      mood: "happy",
      genre: "Electronic",
      cover: "🌈",
    },
    {
      id: "3",
      title: "Laughter Lines",
      artist: "Happy Hearts",
      duration: "4:15",
      mood: "happy",
      genre: "Indie",
      cover: "😄",
    },

    // Calm/Serene Songs
    {
      id: "4",
      title: "Ocean Meditation",
      artist: "Calm Sounds",
      duration: "6:20",
      mood: "calm",
      genre: "Ambient",
      cover: "🌊",
    },
    {
      id: "5",
      title: "Gentle Breeze",
      artist: "Zen Master",
      duration: "5:30",
      mood: "calm",
      genre: "Nature",
      cover: "🍃",
    },
    {
      id: "6",
      title: "Moonlight Serenade",
      artist: "Peaceful Mind",
      duration: "4:45",
      mood: "calm",
      genre: "Classical",
      cover: "🌙",
    },

    // Energetic/Dynamic Songs
    {
      id: "7",
      title: "Thunder Strike",
      artist: "Power Beat",
      duration: "3:55",
      mood: "energetic",
      genre: "Rock",
      cover: "⚡",
    },
    {
      id: "8",
      title: "Adrenaline Rush",
      artist: "High Energy",
      duration: "3:33",
      mood: "energetic",
      genre: "EDM",
      cover: "🔥",
    },
    {
      id: "9",
      title: "Victory March",
      artist: "Champion Sound",
      duration: "4:12",
      mood: "energetic",
      genre: "Electronic",
      cover: "🏆",
    },

    // Peaceful/Zen Songs
    {
      id: "10",
      title: "Forest Whispers",
      artist: "Nature Sounds",
      duration: "7:10",
      mood: "peaceful",
      genre: "Ambient",
      cover: "🌲",
    },
    {
      id: "11",
      title: "Bamboo Garden",
      artist: "Zen Garden",
      duration: "5:45",
      mood: "peaceful",
      genre: "Traditional",
      cover: "🎋",
    },
    {
      id: "12",
      title: "River Flow",
      artist: "Tranquil Moments",
      duration: "6:30",
      mood: "peaceful",
      genre: "Nature",
      cover: "🏞️",
    },

    // Creative/Inspired Songs
    {
      id: "13",
      title: "Artist's Vision",
      artist: "Creative Minds",
      duration: "4:20",
      mood: "creative",
      genre: "Experimental",
      cover: "🎨",
    },
    {
      id: "14",
      title: "Imagination Station",
      artist: "Dream Weavers",
      duration: "3:50",
      mood: "creative",
      genre: "Alternative",
      cover: "💭",
    },
    {
      id: "15",
      title: "Color Splash",
      artist: "Artistic Soul",
      duration: "4:35",
      mood: "creative",
      genre: "Indie",
      cover: "🌈",
    },

    // Focused/Determined Songs
    {
      id: "16",
      title: "Deep Focus",
      artist: "Concentration",
      duration: "8:15",
      mood: "focused",
      genre: "Ambient",
      cover: "🧠",
    },
    {
      id: "17",
      title: "Productivity Flow",
      artist: "Work Mode",
      duration: "6:45",
      mood: "focused",
      genre: "Lo-Fi",
      cover: "💼",
    },
    {
      id: "18",
      title: "Mental Clarity",
      artist: "Sharp Mind",
      duration: "5:20",
      mood: "focused",
      genre: "Minimal",
      cover: "🎯",
    },
  ];

  // Enhanced Jokes Collection
  const jokeCollections = [
    {
      joke: "Why don't scientists trust atoms? Because they make up everything!",
      category: "Science",
    },
    {
      joke: "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      category: "Comedy",
    },
    {
      joke: "Why don't skeletons fight each other? They don't have the guts.",
      category: "Funny",
    },
    { joke: "What do you call a fake noodle? An impasta!", category: "Food" },
    {
      joke: "Why did the scarecrow win an award? He was outstanding in his field!",
      category: "Farm",
    },
    {
      joke: "How do you organize a space party? You planet!",
      category: "Space",
    },
    {
      joke: "Why don't programmers like nature? It has too many bugs.",
      category: "Tech",
    },
    {
      joke: "What do you call a bear with no teeth? A gummy bear!",
      category: "Animals",
    },
    {
      joke: "Why did the coffee file a police report? It got mugged!",
      category: "Coffee",
    },
    {
      joke: "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
      category: "Dinosaurs",
    },
  ];

  // Enhanced Quotes Collection
  const quotesCollection = [
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      quote:
        "Life is what happens to you while you're busy making other plans.",
      author: "John Lennon",
    },
    {
      quote:
        "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
    },
    {
      quote:
        "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
    },
    {
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    },
    {
      quote: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
    },
    {
      joke: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    {
      quote: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
    },
    {
      quote: "Your time is limited, don't waste it living someone else's life.",
      author: "Steve Jobs",
    },
    {
      quote: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
    },
  ];

  const memoryEmojis = ["🎈", "🎨", "🎭", "🎪", "🎯", "🎸", "🎹", "🎺"];

  // Enhanced fetch joke function
  const fetchJoke = useCallback(async () => {
    setIsLoadingJoke(true);
    try {
      const response = await fetch("/api/jokes");
      if (response.ok) {
        const data: ApiJoke = await response.json();
        setCurrentJoke(data);
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      console.error("Using fallback joke:", error);
      // Use local collection as fallback
      const randomJoke =
        jokeCollections[Math.floor(Math.random() * jokeCollections.length)];
      setCurrentJoke({
        joke: randomJoke.joke,
        source: "local",
        category: randomJoke.category,
      });
    } finally {
      setIsLoadingJoke(false);
    }
  }, []);

  // Enhanced fetch quote function
  const fetchQuote = useCallback(async () => {
    setIsLoadingQuote(true);
    try {
      const response = await fetch("/api/quotes");
      if (response.ok) {
        const data: ApiQuote = await response.json();
        setCurrentQuote(data);
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      console.error("Using fallback quote:", error);
      // Use local collection as fallback
      const randomQuote =
        quotesCollection[Math.floor(Math.random() * quotesCollection.length)];
      setCurrentQuote({
        quote: randomQuote.quote,
        author: randomQuote.author,
        source: "local",
      });
    } finally {
      setIsLoadingQuote(false);
    }
  }, []);

  // Enhanced music fetching with more songs
  const fetchMusicPlaylist = useCallback(
    async (mood: string, limit: number = 60) => {
      setIsLoadingMusic(true);
      console.log(`🎵 Loading ${limit} songs for ${mood} mood...`);

      try {
        const response = await fetch(`/api/music?mood=${mood}&limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
          console.log(
            `✅ Music API Response: ${data.total} songs loaded from ${data.sources?.youtube || 0} YouTube + ${data.sources?.spotify || 0} Spotify sources`,
          );

          // Deduplicate and sort songs
          const uniqueSongs = (data.playlist || []).filter(
            (song: any, index: number, array: any[]) => {
              // Remove duplicates based on title + artist combination
              return (
                array.findIndex(
                  (s) => s.title === song.title && s.artist === song.artist,
                ) === index
              );
            },
          );

          // Sort songs by source and quality
          const sortedSongs = uniqueSongs.sort((a: any, b: any) => {
            // Prioritize YouTube songs (they have embedId)
            if (a.embedId && !b.embedId) return -1;
            if (!a.embedId && b.embedId) return 1;
            return 0;
          });

          // Ensure absolutely unique IDs
          const finalSongs = sortedSongs.map((song: any, index: number) => ({
            ...song,
            id: `${song.id}_final_${index}_${Date.now()}`, // Add extra uniqueness
          }));

          console.log(
            `🔧 Deduplicated: ${data.playlist?.length || 0} → ${finalSongs.length} unique songs`,
          );
          setApiSongs(finalSongs);
          return finalSongs;
        } else {
          throw new Error("Music API failed");
        }
      } catch (error) {
        console.error("🔄 Using enhanced fallback music:", error);

        // Enhanced fallback with more variety
        const enhancedFallback = [
          ...songs.filter((song) => song.mood === mood),
          // Add some cross-mood songs for variety
          ...songs.filter((song) => song.mood !== mood).slice(0, 10),
        ];

        console.log(`📁 Fallback: ${enhancedFallback.length} songs loaded`);
        setApiSongs(enhancedFallback);
        return enhancedFallback;
      } finally {
        setIsLoadingMusic(false);
      }
    },
    [],
  );

  // Fetch trending music
  const fetchTrendingMusic = useCallback(async () => {
    try {
      const response = await fetch("/api/music/trending?limit=20");
      if (response.ok) {
        const data = await response.json();
        console.log("🔥 Trending music loaded:", data.total, "songs");
        return data.trending || [];
      }
    } catch (error) {
      console.error("Trending music fetch failed:", error);
    }
    return [];
  }, []);

  // Get stream URL for a specific song
  const fetchStreamUrl = useCallback(async (videoId: string) => {
    try {
      const response = await fetch(`/api/music/stream/${videoId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentStreamUrl(data.embedUrl || data.streamUrl || "");
        return data.embedUrl || data.streamUrl || "";
      }
    } catch (error) {
      console.error("Error getting stream URL:", error);
    }
    return "";
  }, []);

  // Handle mood change with smooth transition and music loading
  const handleMoodChange = useCallback(
    async (newMood: string) => {
      console.log("Changing mood to:", newMood);
      setIsTransitioning(true);

      // Fetch new playlist for the mood
      const newPlaylist = await fetchMusicPlaylist(newMood);

      setTimeout(() => {
        setSelectedMood(newMood);
        setCurrentSong(0);
        setProgress(0);
        setIsPlaying(false);
        setIsTransitioning(false);

        // Load first song if available
        if (newPlaylist && newPlaylist.length > 0 && newPlaylist[0].embedId) {
          fetchStreamUrl(newPlaylist[0].embedId);
        }
      }, 300);
    },
    [fetchMusicPlaylist, fetchStreamUrl],
  );

  // Enhanced Music player functions with real YouTube integration
  const togglePlayPause = () => {
    console.log("Toggle play/pause clicked");
    const currentPlaylist = apiSongs.length > 0 ? apiSongs : filteredSongs;
    const current = currentPlaylist[currentSong];

    setIsPlaying(!isPlaying);

    if (!isPlaying && current) {
      console.log("🎵 Now playing:", current.title);
      // Load the video if embedId exists
      if (current.embedId && !currentStreamUrl) {
        fetchStreamUrl(current.embedId);
      }
    } else {
      console.log("⏸️ Music paused");
    }
  };

  const nextSong = () => {
    console.log("Next song clicked");
    const currentPlaylist = apiSongs.length > 0 ? apiSongs : filteredSongs;
    let newIndex;

    if (isShuffled) {
      newIndex = Math.floor(Math.random() * currentPlaylist.length);
    } else {
      newIndex = (currentSong + 1) % currentPlaylist.length;
    }

    setCurrentSong(newIndex);
    setProgress(0);

    // Load new song stream
    const nextSongData = currentPlaylist[newIndex];
    if (nextSongData && nextSongData.embedId) {
      fetchStreamUrl(nextSongData.embedId);
    }

    // Continue playing if currently playing
    if (isPlaying) {
      console.log("🎵 Next song:", nextSongData?.title);
    }
  };

  const prevSong = () => {
    console.log("Previous song clicked");
    const currentPlaylist = apiSongs.length > 0 ? apiSongs : filteredSongs;
    const newIndex =
      (currentSong - 1 + currentPlaylist.length) % currentPlaylist.length;

    setCurrentSong(newIndex);
    setProgress(0);

    // Load previous song stream
    const prevSongData = currentPlaylist[newIndex];
    if (prevSongData && prevSongData.embedId) {
      fetchStreamUrl(prevSongData.embedId);
    }

    // Continue playing if currently playing
    if (isPlaying) {
      console.log("🎵 Previous song:", prevSongData?.title);
    }
  };

  // Select song from playlist
  const selectSong = (index: number) => {
    console.log("Song selected:", index);
    const currentPlaylist = apiSongs.length > 0 ? apiSongs : filteredSongs;
    const selectedSong = currentPlaylist[index];

    setCurrentSong(index);
    setProgress(0);

    // Load selected song stream
    if (selectedSong && selectedSong.embedId) {
      fetchStreamUrl(selectedSong.embedId);
    }

    // Auto-play if music was playing
    if (isPlaying) {
      console.log("🎵 Now playing:", selectedSong?.title);
    }
  };

  // Enhanced share functionality with robust fallbacks
  const handleShare = async () => {
    const shareData = {
      title: "Mood Booster & Fun Hub ✨",
      text: `I'm feeling ${currentMood.name.toLowerCase()} and listening to "${currentSongData?.title}" on this amazing mood-boosting app!`,
      url: window.location.href,
    };

    const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;

    try {
      // First try: Native Web Share API (mobile browsers)
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        console.log("✅ Content shared via Web Share API");
        return;
      }
    } catch (shareError) {
      console.log("Web Share API failed, trying clipboard...");
    }

    // Second try: Secure Clipboard API (requires HTTPS)
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareText);
        alert("📋 Link copied to clipboard! Share it with your friends! ✨");
        console.log("�� Content copied via Clipboard API");
        return;
      }
    } catch (clipboardError) {
      console.log("Clipboard API failed, trying fallback method...");
    }

    // Third try: Legacy document.execCommand method
    try {
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        alert("📋 Content copied to clipboard! Share it with your friends! ✨");
        console.log("✅ Content copied via execCommand");
        return;
      } else {
        throw new Error("execCommand failed");
      }
    } catch (execError) {
      console.log("execCommand failed, showing manual copy option...");
    }

    // Final fallback: Show modal with text to copy manually
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    modal.innerHTML = `
      <div style="
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      ">
        <h3 style="
          margin: 0 0 20px 0;
          color: #333;
          font-size: 20px;
          font-weight: bold;
        ">📤 Share This App</h3>

        <p style="
          margin: 0 0 15px 0;
          color: #666;
          font-size: 14px;
        ">Copy and share this link with your friends:</p>

        <textarea readonly style="
          width: 100%;
          height: 120px;
          padding: 15px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.4;
          background: #f8f9fa;
          color: #333;
          resize: none;
          box-sizing: border-box;
        ">${shareText}</textarea>

        <div style="
          display: flex;
          gap: 10px;
          margin-top: 20px;
          justify-content: flex-end;
        ">
          <button id="copyBtn" style="
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          ">�� Try Copy Again</button>

          <button id="closeBtn" style="
            background: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          ">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Handle modal buttons
    const copyBtn = modal.querySelector("#copyBtn");
    const closeBtn = modal.querySelector("#closeBtn");
    const textarea = modal.querySelector("textarea");

    copyBtn?.addEventListener("click", () => {
      textarea?.select();
      try {
        document.execCommand("copy");
        alert("✅ Copied to clipboard!");
      } catch (e) {
        alert("❌ Please select and copy the text manually");
      }
    });

    closeBtn?.addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    // Auto-select text
    textarea?.select();

    console.log("📤 Manual share modal opened");
  };

  // Add to favorites
  const handleFavorite = () => {
    const favoriteData = {
      mood: currentMood.name,
      song: currentSongData?.title,
      timestamp: new Date().toISOString(),
    };

    try {
      const favorites = JSON.parse(
        localStorage.getItem("moodBoosterFavorites") || "[]",
      );
      favorites.push(favoriteData);
      localStorage.setItem("moodBoosterFavorites", JSON.stringify(favorites));

      alert(
        `💖 Added to favorites!\nMood: ${currentMood.name}\nSong: ${currentSongData?.title}`,
      );
      console.log("✅ Added to favorites:", favoriteData);
    } catch (error) {
      console.error("❌ Error saving favorite:", error);
      alert("❌ Unable to save favorite. Please try again.");
    }
  };

  // Enhanced theme toggle with immediate visual feedback
  const handleThemeToggle = (checked: boolean) => {
    console.log(
      "🌗 Theme toggle clicked:",
      checked ? "Dark Mode" : "Light Mode",
    );

    // Update state immediately
    setIsDarkMode(checked);

    // Apply classes to multiple elements for maximum compatibility
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");

    // Remove existing classes first
    [html, body, root].forEach((el) => {
      if (el) {
        el.classList.remove("dark", "light");
      }
    });

    // Apply new theme
    if (checked) {
      [html, body, root].forEach((el) => {
        if (el) {
          el.classList.add("dark");
        }
      });
      html.style.colorScheme = "dark";
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("darkMode", "true");
      console.log("✅ Dark mode applied");
    } else {
      [html, body, root].forEach((el) => {
        if (el) {
          el.classList.add("light");
        }
      });
      html.style.colorScheme = "light";
      html.setAttribute("data-theme", "light");
      localStorage.setItem("darkMode", "false");
      console.log("✅ Light mode applied");
    }

    // Force style recalculation
    document.body.style.display = "none";
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = "";
  };

  // Initialize on component mount
  useEffect(() => {
    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      const isDark = savedTheme === "true";
      setIsDarkMode(isDark);
      handleThemeToggle(isDark);
    } else {
      // Default to light mode
      handleThemeToggle(false);
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    handleThemeToggle(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    // Initialize memory game
    const shuffled = [...memoryEmojis, ...memoryEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setMemoryCards(shuffled);
  }, []);

  useEffect(() => {
    // Initialize number guessing game
    setGuessNumber(Math.floor(Math.random() * 100) + 1);
    setGuessAttempts(0);
  }, []);

  useEffect(() => {
    // Fetch initial content on load
    fetchJoke();
    fetchQuote();

    // Load extensive music playlist (60 songs)
    console.log("🎵 Loading initial music library...");
    fetchMusicPlaylist(selectedMood, 60);
  }, [fetchJoke, fetchQuote, fetchMusicPlaylist, selectedMood]);

  useEffect(() => {
    // Simulate music progress
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (isRepeating) {
              return 0;
            } else {
              nextSong();
              return 0;
            }
          }
          return prev + 0.5;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isRepeating, nextSong]);

  useEffect(() => {
    // Enhanced particle system
    const createParticle = () => {
      if (!particlesRef.current) return;

      const particle = document.createElement("div");
      const mood = moods.find((m) => m.id === selectedMood);
      const emoji =
        mood?.particles[Math.floor(Math.random() * mood.particles.length)] ||
        "✨";

      particle.textContent = emoji;
      particle.className =
        "absolute text-lg pointer-events-none animate-bounce opacity-60 select-none";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDuration = Math.random() * 4 + 3 + "s";
      particle.style.filter = "drop-shadow(0 0 8px rgba(255,255,255,0.3))";

      particlesRef.current.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 5000);
    };

    const interval = setInterval(createParticle, 2000);
    return () => clearInterval(interval);
  }, [selectedMood]);

  const currentMood = moods.find((m) => m.id === selectedMood) || moods[0];
  const filteredSongs = songs.filter((song) => song.mood === selectedMood);

  // Use API songs if available, otherwise fallback to static songs
  const currentPlaylist = apiSongs.length > 0 ? apiSongs : filteredSongs;
  const currentSongData = currentPlaylist[currentSong] || currentPlaylist[0];

  // Check for winner function
  const checkWinner = (board: string[]) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  // Computer AI move
  const makeComputerMove = (board: string[]) => {
    // Try to win first
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        const testBoard = [...board];
        testBoard[i] = "O";
        if (checkWinner(testBoard) === "O") {
          return i;
        }
      }
    }

    // Block player from winning
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        const testBoard = [...board];
        testBoard[i] = "X";
        if (checkWinner(testBoard) === "X") {
          return i;
        }
      }
    }

    // Take center if available
    if (board[4] === "") return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter((i) => board[i] === "");
    if (availableCorners.length > 0) {
      return availableCorners[
        Math.floor(Math.random() * availableCorners.length)
      ];
    }

    // Take any available space
    const available = board
      .map((cell, index) => (cell === "" ? index : -1))
      .filter((i) => i !== -1);
    return available[Math.floor(Math.random() * available.length)];
  };

  // Memory game logic
  const handleMemoryCardClick = (id: number) => {
    console.log("Memory card clicked:", id);
    if (flippedCards.length === 2) return;
    if (memoryCards[id].isFlipped || memoryCards[id].isMatched) return;

    const newCards = [...memoryCards];
    newCards[id].isFlipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (newCards[first].emoji === newCards[second].emoji) {
        setTimeout(() => {
          newCards[first].isMatched = true;
          newCards[second].isMatched = true;
          setMemoryCards([...newCards]);
          setFlippedCards([]);
          setMemoryScore((prev) => prev + 10);
        }, 1000);
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setMemoryCards([...newCards]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Number guessing logic
  const handleGuess = () => {
    console.log("Guess submitted:", guess);
    const userGuess = parseInt(guess);
    if (isNaN(userGuess) || !guessNumber) return;

    setGuessAttempts((prev) => prev + 1);

    if (userGuess === guessNumber) {
      setGuessResult("🎉 Perfect! You got it right!");
      setTimeout(() => {
        setGuessNumber(Math.floor(Math.random() * 100) + 1);
        setGuess("");
        setGuessResult("");
        setGuessAttempts(0);
      }, 3000);
    } else if (userGuess < guessNumber) {
      setGuessResult("📈 Too low! Try a higher number.");
    } else {
      setGuessResult("📉 Too high! Try a lower number.");
    }
  };

  // Tic Tac Toe logic - Human vs Computer
  const handleTicTacToe = (index: number) => {
    console.log("Tic Tac Toe cell clicked:", index);

    // Only allow human moves (X) and when it's human's turn
    if (ticTacToe[index] !== "" || ticTacPlayer !== "X") return;

    // Human move
    const newBoard = [...ticTacToe];
    newBoard[index] = "X";
    setTicTacToe(newBoard);

    // Check if human won
    const humanWin = checkWinner(newBoard);
    if (humanWin === "X") {
      setGameStats((prev) => ({ wins: prev.wins + 1, games: prev.games + 1 }));
      setTimeout(() => {
        alert("🎉 You Win! Great job!");
        setTicTacToe(Array(9).fill(""));
        setTicTacPlayer("X");
      }, 500);
      return;
    }

    // Check for tie
    if (newBoard.every((cell) => cell !== "")) {
      setGameStats((prev) => ({ ...prev, games: prev.games + 1 }));
      setTimeout(() => {
        alert("🤝 It's a Tie! Good game!");
        setTicTacToe(Array(9).fill(""));
        setTicTacPlayer("X");
      }, 500);
      return;
    }

    // Computer's turn
    setTicTacPlayer("O");
    setTimeout(() => {
      const computerMove = makeComputerMove(newBoard);
      if (computerMove !== undefined) {
        const computerBoard = [...newBoard];
        computerBoard[computerMove] = "O";
        setTicTacToe(computerBoard);

        // Check if computer won
        const computerWin = checkWinner(computerBoard);
        if (computerWin === "O") {
          setGameStats((prev) => ({ ...prev, games: prev.games + 1 }));
          setTimeout(() => {
            alert("🤖 Computer Wins! Try again!");
            setTicTacToe(Array(9).fill(""));
            setTicTacPlayer("X");
          }, 500);
          return;
        }

        // Check for tie after computer move
        if (computerBoard.every((cell) => cell !== "")) {
          setGameStats((prev) => ({ ...prev, games: prev.games + 1 }));
          setTimeout(() => {
            alert("🤝 It's a Tie! Good game!");
            setTicTacToe(Array(9).fill(""));
            setTicTacPlayer("X");
          }, 500);
          return;
        }

        // Back to human turn
        setTicTacPlayer("X");
      }
    }, 800); // Delay for computer move
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ease-in-out overflow-x-hidden ${isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"} ${isDarkMode ? "dark" : ""}`}
    >
      {/* Dynamic Background */}
      <div
        className={`fixed inset-0 bg-gradient-to-br ${currentMood.gradient} transition-all duration-1000 z-0`}
      >
        <div
          className={`absolute inset-0 ${isDarkMode ? "bg-black/30" : "bg-black/10"} transition-all duration-500`}
        ></div>
        <div
          className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? "from-black/40" : "from-black/20"} via-transparent to-transparent transition-all duration-500`}
        ></div>
      </div>

      {/* Enhanced Particles */}
      <div
        ref={particlesRef}
        className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
      ></div>

      {/* Main Content - Fixed z-index and scrolling */}
      <div className="relative z-20 min-h-screen w-full">
        {/* Header */}
        <div className="w-full px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
              <div className="text-center lg:text-left mb-6 lg:mb-0">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl leading-tight">
                  Mood Booster & Fun Hub ✨
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-white/90 drop-shadow-lg max-w-2xl leading-relaxed">
                  Transform your day with personalized experiences that adapt to
                  your mood
                </p>
              </div>

              {/* Enhanced Theme Toggle */}
              <div
                className={`flex items-center space-x-3 backdrop-blur-lg rounded-2xl px-6 py-3 border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-600/30"
                    : "bg-white/20 border-white/20"
                }`}
              >
                <Sun
                  className={`h-5 w-5 transition-all duration-300 ${isDarkMode ? "text-gray-400" : "text-yellow-300"}`}
                />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={(checked) => {
                    console.log("🌗 Header theme toggle clicked:", checked);
                    handleThemeToggle(checked);
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-yellow-500"
                />
                <Moon
                  className={`h-5 w-5 transition-all duration-300 ${isDarkMode ? "text-blue-300" : "text-gray-400"}`}
                />
                <span
                  className={`text-sm ml-2 font-medium transition-all duration-300 ${
                    isDarkMode ? "text-blue-200" : "text-white"
                  }`}
                >
                  {isDarkMode ? "🌙 Dark" : "☀️ Light"}
                </span>
              </div>
            </div>

            {/* Current Mood Display */}
            <Card className="mb-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl mb-4 animate-bounce">
                    {currentMood.emoji}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {currentMood.name} Mode
                  </h2>
                  <p className="text-white/80 mb-4 text-sm md:text-base">
                    {currentMood.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {currentMood.benefits.map((benefit, index) => (
                      <div key={index} className="text-center">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Star className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <p className="text-white/90 text-xs font-medium">
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Mood Selector */}
            <Card className="mb-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white text-lg md:text-xl">
                  <Compass className="h-6 w-6" />
                  Choose Your Vibe
                </CardTitle>
                <CardDescription className="text-white/80 text-sm md:text-base">
                  Select how you're feeling to unlock a personalized experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                  {moods.map((mood) => (
                    <Button
                      key={mood.id}
                      variant={selectedMood === mood.id ? "default" : "outline"}
                      className={`h-20 md:h-24 flex-col gap-2 transition-all duration-300 group cursor-pointer ${
                        selectedMood === mood.id
                          ? "bg-white text-black hover:bg-white/90 scale-105 shadow-xl"
                          : "bg-white/10 text-white border-white/30 hover:bg-white/20 hover:scale-105"
                      }`}
                      onClick={() => handleMoodChange(mood.id)}
                    >
                      <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-200">
                        {mood.emoji}
                      </span>
                      <div className="text-center">
                        <span className="text-xs md:text-sm font-bold block">
                          {mood.name}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Smart Mood Detection */}
            <SmartMoodDetection
              onMoodDetected={(mood, source) => {
                console.log(`🧠 AI detected mood: ${mood} (source: ${source})`);
                handleMoodChange(mood);
              }}
              currentMood={selectedMood}
            />

            {/* Main Features */}
            <Tabs defaultValue="music" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-8 bg-white/10 backdrop-blur-lg border border-white/20 h-12 md:h-14">
                <TabsTrigger
                  value="music"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black h-10 text-xs md:text-sm"
                >
                  <Headphones className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Music
                </TabsTrigger>
                <TabsTrigger
                  value="quotes"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black h-10 text-xs md:text-sm"
                >
                  <Quote className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Quotes
                </TabsTrigger>
                <TabsTrigger
                  value="jokes"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black h-10 text-xs md:text-sm"
                >
                  <Smile className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Jokes
                </TabsTrigger>
                <TabsTrigger
                  value="memory"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black h-10 text-xs md:text-sm"
                >
                  <Brain className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Memory
                </TabsTrigger>
                <TabsTrigger
                  value="games"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black h-10 text-xs md:text-sm"
                >
                  <Gamepad2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Games
                </TabsTrigger>
                <TabsTrigger
                  value="journal"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black h-10 text-xs md:text-sm"
                >
                  <BookOpen className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Journal
                </TabsTrigger>
                <TabsTrigger
                  value="wellness"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black h-10 text-xs md:text-sm"
                >
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Wellness
                </TabsTrigger>
                <TabsTrigger
                  value="chatbot"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black h-10 text-xs md:text-sm"
                >
                  <Brain className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  AI Chat
                </TabsTrigger>
              </TabsList>

              {/* Enhanced Music Player */}
              <TabsContent value="music">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white text-lg md:text-xl flex items-center gap-2">
                      🎵 {currentMood.name} Playlist
                      {isPlaying && (
                        <Badge className="bg-green-500 text-white animate-pulse">
                          Playing
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-white/80 text-sm md:text-base">
                      Music curated for your {currentMood.name.toLowerCase()}{" "}
                      mood
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Now Playing */}
                    <div className="bg-white/20 rounded-xl p-4 md:p-6">
                      <div className="flex items-center gap-3 md:gap-4 mb-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center text-xl md:text-2xl animate-pulse-slow">
                          {currentSongData?.cover}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-base md:text-lg truncate">
                            {currentSongData?.title}
                          </h3>
                          <p className="text-white/80 text-sm md:text-base truncate">
                            {currentSongData?.artist}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="bg-white/20 text-white text-xs"
                            >
                              {currentSongData?.genre}
                            </Badge>
                            <span className="text-white/70 text-xs">
                              {currentSongData?.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <Progress
                          value={progress}
                          className="h-2 bg-white/20"
                        />
                        <div className="flex justify-between text-white/70 text-xs mt-1">
                          <span>
                            {Math.floor((progress * 0.01 * 240) / 60)}:
                            {String(
                              Math.floor(progress * 0.01 * 240) % 60,
                            ).padStart(2, "0")}
                          </span>
                          <span>{currentSongData?.duration}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-center gap-3 md:gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-white hover:bg-white/20 cursor-pointer ${isShuffled ? "bg-white/20" : ""}`}
                          onClick={() => {
                            console.log("Shuffle clicked");
                            setIsShuffled(!isShuffled);
                          }}
                        >
                          <Shuffle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 cursor-pointer"
                          onClick={prevSong}
                        >
                          <SkipBack className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                        <Button
                          size="lg"
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full cursor-pointer shadow-lg transition-all duration-200 ${
                            isPlaying
                              ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                          onClick={() => {
                            console.log("🎵 Play/Pause button clicked");
                            togglePlayPause();
                          }}
                        >
                          {isPlaying ? (
                            <Pause className="h-5 w-5 md:h-6 md:w-6" />
                          ) : (
                            <Play className="h-5 w-5 md:h-6 md:w-6 ml-0.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 cursor-pointer"
                          onClick={nextSong}
                        >
                          <SkipForward className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-white hover:bg-white/20 cursor-pointer ${isRepeating ? "bg-white/20" : ""}`}
                          onClick={() => {
                            console.log("Repeat clicked");
                            setIsRepeating(!isRepeating);
                          }}
                        >
                          <Repeat className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center gap-3 mt-4">
                        <Volume2 className="h-4 w-4 text-white" />
                        <Progress
                          value={volume}
                          className="flex-1 h-2 bg-white/20"
                        />
                        <span className="text-white/70 text-xs w-10">
                          {volume}%
                        </span>
                      </div>

                      {/* Enhanced YouTube Player */}
                      {isPlaying && currentSongData && (
                        <div className="mt-4">
                          <div className="bg-white/10 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-red-600 text-white text-xs animate-pulse">
                                🔴 LIVE
                              </Badge>
                              <span className="text-white/80 text-xs">
                                Playing: {currentSongData.title}
                              </span>
                              <Badge className="bg-white/20 text-white text-xs">
                                YouTube
                              </Badge>
                            </div>
                            <div className="aspect-video rounded-lg overflow-hidden bg-black/20">
                              {currentSongData.embedId ? (
                                <iframe
                                  src={`https://www.youtube.com/embed/${currentSongData.embedId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                                  title={`Playing: ${currentSongData.title}`}
                                  className="w-full h-full border-0"
                                  allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white">
                                  <div className="text-center">
                                    <div className="text-4xl mb-2 animate-bounce">
                                      🎵
                                    </div>
                                    <p className="text-sm opacity-80">
                                      Music Playing...
                                    </p>
                                    <p className="text-xs opacity-60">
                                      {currentSongData.title}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Playlist */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <h4 className="text-white font-semibold text-sm md:text-base">
                          🎵 Queue ({currentPlaylist.length} songs)
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          {isLoadingMusic && (
                            <Badge className="bg-blue-500 text-white animate-pulse text-xs">
                              🔄 Loading...
                            </Badge>
                          )}
                          {apiSongs.length > 0 && (
                            <div className="flex gap-1">
                              <Badge className="bg-red-600 text-white text-xs">
                                🔴 YT:{" "}
                                {
                                  apiSongs.filter((s) => s.source === "youtube")
                                    .length
                                }
                              </Badge>
                              <Badge className="bg-green-600 text-white text-xs">
                                🟢 SP:{" "}
                                {
                                  apiSongs.filter((s) => s.source === "spotify")
                                    .length
                                }
                              </Badge>
                            </div>
                          )}
                          <Badge className="bg-white/20 text-white text-xs">
                            {apiSongs.length > 0 ? "🌐 API" : "📁 Local"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-xs h-6 px-2"
                            onClick={() => {
                              console.log("🔄 Refreshing playlist...");
                              fetchMusicPlaylist(selectedMood, 80); // Load even more songs
                            }}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            More
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {currentPlaylist.map((song, index) => {
                          // Create absolutely unique key for each song to prevent React warnings
                          const uniqueKey = `playlist_${index}_${song.title?.replace(/[^a-zA-Z0-9]/g, "")}_${song.artist?.replace(/[^a-zA-Z0-9]/g, "")}_${song.source}_${Date.now()}`;

                          return (
                            <div
                              key={uniqueKey}
                              className={`flex items-center gap-3 p-2 md:p-3 rounded-lg cursor-pointer transition-all ${
                                index === currentSong
                                  ? "bg-white/30 shadow-lg scale-105"
                                  : "bg-white/10 hover:bg-white/20 hover:scale-102"
                              }`}
                              onClick={() => selectSong(index)}
                            >
                              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-lg flex items-center justify-center text-sm md:text-base">
                                {song.thumbnail || song.cover}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm md:text-base truncate">
                                  {song.title}
                                </p>
                                <p className="text-white/70 text-xs md:text-sm truncate">
                                  {song.artist}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="bg-white/10 text-white text-xs"
                                  >
                                    {song.genre}
                                  </Badge>
                                  {song.embedId && (
                                    <Badge className="bg-red-600 text-white text-xs">
                                      YT
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-white/70 text-xs block">
                                  {song.duration}
                                </span>
                                {index === currentSong && isPlaying && (
                                  <Badge className="bg-green-500 text-white text-xs">
                                    Playing
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {currentPlaylist.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-white/60">No songs available</p>
                          <Button
                            onClick={() => fetchMusicPlaylist(selectedMood)}
                            className="mt-2 bg-white/20 text-white hover:bg-white/30"
                            size="sm"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reload Playlist
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Auto Playlist Generator */}
                    <AutoPlaylistGenerator
                      currentMood={selectedMood}
                      onPlaylistGenerated={(playlist) => {
                        console.log(
                          `🎵 Auto-generated playlist with ${playlist.length} songs`,
                        );
                        setApiSongs(playlist);
                        setCurrentSong(0);
                        setProgress(0);
                        if (playlist.length > 0 && playlist[0].embedId) {
                          fetchStreamUrl(playlist[0].embedId);
                        }
                      }}
                    />

                    {/* Song Search */}
                    <SongSearch
                      onSongSelect={(song) => {
                        console.log(
                          `🔍 Selected song from search: ${song.title}`,
                        );
                        // Convert search result to app song format
                        const newSong = {
                          id: song.id,
                          title: song.title,
                          artist: song.artist,
                          duration: song.duration,
                          mood: selectedMood,
                          genre: "Search Result",
                          cover: "🎵",
                          url: song.url,
                          embedId: song.embedId,
                          thumbnail: song.thumbnail,
                        };

                        // Add to current playlist and play
                        setApiSongs((prev) => [newSong, ...prev]);
                        setCurrentSong(0);
                        setProgress(0);
                        setIsPlaying(true);

                        if (song.embedId) {
                          fetchStreamUrl(song.embedId);
                        }
                      }}
                      onAddToPlaylist={(song) => {
                        console.log(`➕ Added song to playlist: ${song.title}`);
                        // Convert and add to playlist
                        const newSong = {
                          id: song.id,
                          title: song.title,
                          artist: song.artist,
                          duration: song.duration,
                          mood: selectedMood,
                          genre: "Added Song",
                          cover: "🎵",
                          url: song.url,
                          embedId: song.embedId,
                          thumbnail: song.thumbnail,
                        };

                        setApiSongs((prev) => [...prev, newSong]);
                      }}
                      currentSong={currentSongData}
                      isPlaying={isPlaying}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Quotes */}
              <TabsContent value="quotes">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3 text-lg md:text-xl">
                      <Lightbulb className="h-6 w-6" />
                      Daily Inspiration
                    </CardTitle>
                    <CardDescription className="text-white/80 text-sm md:text-base">
                      Fresh motivational quotes to elevate your mindset
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-6 max-w-4xl mx-auto">
                      <div className="bg-white/20 rounded-2xl p-6 md:p-8">
                        <Quote className="h-8 w-8 md:h-10 md:w-10 text-white/70 mx-auto mb-4 md:mb-6" />
                        {currentQuote ? (
                          <div>
                            <p className="text-white text-base md:text-lg lg:text-xl font-medium leading-relaxed mb-4 md:mb-6">
                              "{currentQuote.quote}"
                            </p>
                            <p className="text-white/80 text-sm md:text-base lg:text-lg font-semibold">
                              — {currentQuote.author}
                            </p>
                            <Badge className="mt-3 md:mt-4 bg-white/20 text-white text-xs">
                              {currentQuote.source === "external"
                                ? "Live API"
                                : "Curated Collection"}
                            </Badge>
                          </div>
                        ) : (
                          <div className="animate-pulse">
                            <div className="h-6 bg-white/20 rounded mb-4"></div>
                            <div className="h-4 bg-white/20 rounded w-1/2 mx-auto"></div>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          console.log("New quote clicked");
                          fetchQuote();
                        }}
                        disabled={isLoadingQuote}
                        size="lg"
                        className="bg-white text-black hover:bg-white/90 px-6 md:px-8 py-3 cursor-pointer text-sm md:text-base"
                      >
                        {isLoadingQuote ? (
                          <RefreshCw className="h-4 w-4 md:h-5 md:w-5 mr-2 animate-spin" />
                        ) : (
                          <Star className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                        )}
                        {isLoadingQuote ? "Loading..." : "New Inspiration"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Jokes */}
              <TabsContent value="jokes">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3 text-lg md:text-xl">
                      <Smile className="h-6 w-6" />
                      Laughter Therapy
                    </CardTitle>
                    <CardDescription className="text-white/80 text-sm md:text-base">
                      Fresh jokes to brighten your day - new one every time!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-6 max-w-4xl mx-auto">
                      <div className="bg-white/20 rounded-2xl p-6 md:p-8">
                        <span className="text-4xl md:text-5xl mb-4 md:mb-6 block animate-bounce">
                          😂
                        </span>
                        {currentJoke ? (
                          <div>
                            <p className="text-white text-base md:text-lg lg:text-xl leading-relaxed mb-4 md:mb-6">
                              {currentJoke.joke}
                            </p>
                            <div className="flex justify-center gap-3 flex-wrap">
                              <Badge className="bg-white/20 text-white text-xs">
                                {currentJoke.category}
                              </Badge>
                              <Badge className="bg-white/20 text-white text-xs">
                                {currentJoke.source === "external"
                                  ? "Live API"
                                  : "Fresh Collection"}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="animate-pulse">
                            <div className="h-6 bg-white/20 rounded mb-4"></div>
                            <div className="h-4 bg-white/20 rounded w-3/4 mx-auto"></div>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          console.log("New joke clicked");
                          fetchJoke();
                        }}
                        disabled={isLoadingJoke}
                        size="lg"
                        className="bg-white text-black hover:bg-white/90 px-6 md:px-8 py-3 cursor-pointer text-sm md:text-base"
                      >
                        {isLoadingJoke ? (
                          <RefreshCw className="h-4 w-4 md:h-5 md:w-5 mr-2 animate-spin" />
                        ) : (
                          <Coffee className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                        )}
                        {isLoadingJoke ? "Loading..." : "Another Joke"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Memory Game */}
              <TabsContent value="memory">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <Brain className="h-6 w-6" />
                        Memory Challenge
                      </div>
                      <Badge className="bg-white/20 text-white px-3 py-1 text-sm">
                        Score: {memoryScore}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-white/80 text-sm md:text-base">
                      Test your memory by finding matching pairs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-sm mx-auto">
                        {memoryCards.map((card) => (
                          <Button
                            key={card.id}
                            variant="outline"
                            className={`aspect-square text-lg md:text-2xl transition-all duration-300 cursor-pointer ${
                              card.isFlipped || card.isMatched
                                ? "bg-white text-black scale-105 shadow-lg"
                                : "bg-white/20 text-white border-white/30 hover:bg-white/30 hover:scale-105"
                            }`}
                            onClick={() => handleMemoryCardClick(card.id)}
                          >
                            {card.isFlipped || card.isMatched
                              ? card.emoji
                              : "?"}
                          </Button>
                        ))}
                      </div>
                      <div className="text-center">
                        <Button
                          onClick={() => {
                            console.log("Memory game reset");
                            const shuffled = [...memoryEmojis, ...memoryEmojis]
                              .sort(() => Math.random() - 0.5)
                              .map((emoji, index) => ({
                                id: index,
                                emoji,
                                isFlipped: false,
                                isMatched: false,
                              }));
                            setMemoryCards(shuffled);
                            setFlippedCards([]);
                            setMemoryScore(0);
                          }}
                          className="bg-white text-black hover:bg-white/90 cursor-pointer px-6 py-2"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          New Game
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Games */}
              <TabsContent value="games">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Number Guessing Game */}
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3 text-base md:text-lg">
                        <Target className="h-6 w-6" />
                        Number Challenge
                      </CardTitle>
                      <CardDescription className="text-white/80 text-sm md:text-base">
                        Guess the number between 1-100
                      </CardDescription>
                      <Badge className="bg-white/20 text-white w-fit text-xs">
                        Attempts: {guessAttempts}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={guess}
                          onChange={(e) => setGuess(e.target.value)}
                          placeholder="Your guess..."
                          className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-white/50 focus:outline-none text-sm md:text-base"
                          min="1"
                          max="100"
                        />
                        <Button
                          onClick={handleGuess}
                          className="bg-white text-black hover:bg-white/90 cursor-pointer px-4"
                        >
                          Guess
                        </Button>
                      </div>
                      {guessResult && (
                        <div className="bg-white/20 rounded-lg p-3">
                          <p className="text-white font-medium text-center text-sm md:text-base">
                            {guessResult}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tic Tac Toe */}
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <Trophy className="h-6 w-6" />
                          <span className="text-base md:text-lg">
                            Tic Tac Toe vs Computer 🤖
                          </span>
                        </div>
                        <Badge className="bg-white/20 text-white text-xs">
                          {gameStats.wins}/{gameStats.games} wins
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-white/80 text-sm md:text-base">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span>You: X �� | Computer: O 🤖</span>
                          <span
                            className={`font-bold text-xs md:text-sm ${ticTacPlayer === "X" ? "text-green-300" : "text-blue-300"}`}
                          >
                            {ticTacPlayer === "X"
                              ? "Your Turn"
                              : "Computer Thinking..."}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                          {ticTacToe.map((cell, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="aspect-square text-xl md:text-2xl font-bold bg-white/20 text-white border-white/30 hover:bg-white/30 cursor-pointer transition-all duration-200 hover:scale-105"
                              onClick={() => handleTicTacToe(index)}
                              disabled={ticTacPlayer !== "X"}
                            >
                              {cell}
                            </Button>
                          ))}
                        </div>
                        <Button
                          onClick={() => {
                            console.log("Tic Tac Toe reset");
                            setTicTacToe(Array(9).fill(""));
                            setTicTacPlayer("X");
                          }}
                          className="w-full bg-white text-black hover:bg-white/90 cursor-pointer"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset Game
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Daily Mood Journal */}
              <TabsContent value="journal">
                <DailyMoodJournal />
              </TabsContent>

              {/* Wellness & Mood Boosters */}
              <TabsContent value="wellness">
                <MoodBoosterExtras
                  currentMood={selectedMood}
                  isDarkMode={isDarkMode}
                />
              </TabsContent>

              {/* AI Chatbot */}
              <TabsContent value="chatbot">
                <AIChatbot
                  currentMood={selectedMood}
                  onMoodSuggestion={(mood) => {
                    console.log(`🤖 AI suggested mood change: ${mood}`);
                    handleMoodChange(mood);
                  }}
                  onActionSuggestion={(action) => {
                    console.log(`🎯 AI suggested action:`, action);
                    // Handle different action types
                    switch (action.type) {
                      case "play_music":
                        handleMoodChange(action.data.mood);
                        break;
                      case "start_meditation":
                        // Switch to wellness tab
                        break;
                      case "show_quote":
                        fetchQuote();
                        break;
                      default:
                        console.log("Unknown action type:", action.type);
                    }
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="relative z-20 bg-black/20 backdrop-blur-lg mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                Keep spreading the good vibes! ✨
              </h3>
              <p className="text-white/80 mb-6 text-sm md:text-base">
                Your mood matters. Take care of yourself and enjoy every moment.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:scale-105 transition-all text-sm cursor-pointer"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share App
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:scale-105 transition-all text-sm cursor-pointer"
                  onClick={handleFavorite}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Favorites
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:scale-105 transition-all text-sm cursor-pointer"
                  onClick={() => {
                    fetchJoke();
                    fetchQuote();
                    fetchMusicPlaylist(selectedMood);
                    console.log("🔄 Refreshing all content...");
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh All
                </Button>
                <Button
                  variant="outline"
                  className={`${isDarkMode ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/30" : "bg-purple-500/20 text-purple-300 border-purple-400/30"} hover:scale-105 transition-all text-sm cursor-pointer`}
                  onClick={() => handleThemeToggle(!isDarkMode)}
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4 mr-2" />
                  ) : (
                    <Moon className="h-4 w-4 mr-2" />
                  )}
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
