import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shuffle,
  RefreshCw,
  Music,
  Sparkles,
  Globe,
  Heart,
  TrendingUp,
  Clock,
  Star,
  Headphones,
  Loader2,
} from "lucide-react";

interface PlaylistPreferences {
  languages: string[];
  genres: string[];
  energy: number;
  duration: number;
  includeTrending: boolean;
  personalizedWeight: number;
}

interface GeneratedPlaylist {
  id: string;
  name: string;
  description: string;
  songs: any[];
  mood: string;
  languages: string[];
  totalDuration: string;
  createdAt: string;
}

interface AutoPlaylistGeneratorProps {
  currentMood: string;
  onPlaylistGenerated: (playlist: any[]) => void;
}

const languages = [
  { code: "en", name: "🇺🇸 English", flag: "🇺🇸" },
  { code: "hi", name: "🇮🇳 Hindi", flag: "🇮🇳" },
  { code: "pa", name: "🇮🇳 Punjabi", flag: "🇮🇳" },
  { code: "ko", name: "🇰🇷 Korean (K-pop)", flag: "🇰🇷" },
  { code: "es", name: "🇪🇸 Spanish", flag: "🇪🇸" },
  { code: "pt", name: "🇧🇷 Portuguese", flag: "🇧🇷" },
  { code: "fr", name: "🇫🇷 French", flag: "🇫🇷" },
  { code: "de", name: "🇩🇪 German", flag: "🇩🇪" },
];

const genres = [
  "Pop",
  "Rock",
  "Electronic",
  "Hip-Hop",
  "Indie",
  "Alternative",
  "Classical",
  "Jazz",
  "Reggae",
  "Country",
  "R&B",
  "Folk",
  "Bollywood",
  "K-pop",
  "Reggaeton",
  "Salsa",
  "Bhangra",
  "Ambient",
];

const moodPlaylists = {
  happy: {
    name: "Sunshine & Smiles",
    description: "Uplifting tracks to brighten your day",
    emoji: "😊",
  },
  calm: {
    name: "Peaceful Waters",
    description: "Relaxing melodies for tranquil moments",
    emoji: "🧘",
  },
  energetic: {
    name: "Power Surge",
    description: "High-energy beats to fuel your activities",
    emoji: "⚡",
  },
  peaceful: {
    name: "Zen Garden",
    description: "Spiritual sounds for inner harmony",
    emoji: "🌿",
  },
  creative: {
    name: "Artistic Flow",
    description: "Inspiring tracks for creative minds",
    emoji: "🎨",
  },
  focused: {
    name: "Deep Focus Zone",
    description: "Concentration music for productivity",
    emoji: "🎯",
  },
};

export default function AutoPlaylistGenerator({
  currentMood,
  onPlaylistGenerated,
}: AutoPlaylistGeneratorProps) {
  const [preferences, setPreferences] = useState<PlaylistPreferences>({
    languages: ["en", "hi"],
    genres: ["Pop", "Electronic", "Indie"],
    energy: 50,
    duration: 60,
    includeTrending: true,
    personalizedWeight: 70,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [recentPlaylists, setRecentPlaylists] = useState<GeneratedPlaylist[]>(
    [],
  );
  const [currentPlaylist, setCurrentPlaylist] =
    useState<GeneratedPlaylist | null>(null);

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem("playlistPreferences");
    if (saved) {
      setPreferences(JSON.parse(saved));
    }

    const savedPlaylists = localStorage.getItem("recentPlaylists");
    if (savedPlaylists) {
      setRecentPlaylists(JSON.parse(savedPlaylists));
    }
  }, []);

  // Save preferences
  const savePreferences = useCallback((newPrefs: PlaylistPreferences) => {
    setPreferences(newPrefs);
    localStorage.setItem("playlistPreferences", JSON.stringify(newPrefs));
  }, []);

  // Generate intelligent playlist
  const generatePlaylist = useCallback(async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate AI playlist generation with multiple steps
      const steps = [
        "Analyzing your mood preferences...",
        "Fetching multi-language content...",
        "Applying personalization filters...",
        "Mixing trending tracks...",
        "Optimizing playlist flow...",
        "Finalizing your perfect playlist...",
      ];

      for (let i = 0; i < steps.length; i++) {
        console.log(`🎵 ${steps[i]}`);
        setGenerationProgress(((i + 1) / steps.length) * 100);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // Generate playlist based on preferences
      const playlistData = await fetch(
        `/api/music?mood=${currentMood}&limit=50&languages=${preferences.languages.join(",")}`,
      );
      const data = await playlistData.json();

      // Apply intelligent filtering
      let songs = data.playlist || [];

      // Filter by energy level if specified
      if (preferences.energy !== 50) {
        // Simulate energy-based filtering
        songs = songs.filter((song: any, index: number) => {
          if (preferences.energy > 70) return index % 3 === 0; // High energy
          if (preferences.energy < 30) return index % 4 === 0; // Low energy
          return true; // Medium energy
        });
      }

      // Mix languages intelligently
      const langSongs: { [key: string]: any[] } = {};
      preferences.languages.forEach((lang) => {
        langSongs[lang] = songs.filter((song: any) => {
          if (lang === "en") return !song.title.match(/[^\x00-\x7F]/);
          if (lang === "hi")
            return (
              song.title.includes("hindi") || song.artist.includes("Bollywood")
            );
          if (lang === "ko")
            return (
              song.title.includes("kpop") || song.artist.includes("Korean")
            );
          if (lang === "es")
            return (
              song.artist.includes("Latin") || song.artist.includes("Spanish")
            );
          return false;
        });
      });

      // Create balanced mix
      const finalPlaylist = [];
      const maxPerLang = Math.ceil(
        preferences.duration / preferences.languages.length,
      );

      preferences.languages.forEach((lang) => {
        const langSongsList = langSongs[lang] || [];
        finalPlaylist.push(...langSongsList.slice(0, maxPerLang));
      });

      // Shuffle for better flow
      const shuffled = finalPlaylist
        .sort(() => Math.random() - 0.5)
        .slice(0, preferences.duration);

      // Create playlist object
      const newPlaylist: GeneratedPlaylist = {
        id: `playlist_${Date.now()}`,
        name: `${moodPlaylists[currentMood as keyof typeof moodPlaylists]?.name || "Custom"} Mix`,
        description: `AI-generated ${currentMood} playlist with ${preferences.languages.length} languages`,
        songs: shuffled,
        mood: currentMood,
        languages: preferences.languages,
        totalDuration: `${Math.floor(shuffled.length * 3.5)} min`,
        createdAt: new Date().toISOString(),
      };

      setCurrentPlaylist(newPlaylist);

      // Save to recent playlists
      const updated = [newPlaylist, ...recentPlaylists.slice(0, 4)];
      setRecentPlaylists(updated);
      localStorage.setItem("recentPlaylists", JSON.stringify(updated));

      // Send to parent
      onPlaylistGenerated(shuffled);

      console.log(
        `✅ Generated ${shuffled.length} songs playlist for ${currentMood} mood`,
      );
    } catch (error) {
      console.error("Error generating playlist:", error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  }, [currentMood, preferences, onPlaylistGenerated, recentPlaylists]);

  // Quick generate with current settings
  const quickGenerate = () => {
    generatePlaylist();
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white text-lg md:text-xl flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          🎵 AI Playlist Generator
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Smart
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={quickGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Quick Generate
              </>
            )}
          </Button>

          <Button
            onClick={() => generatePlaylist()}
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>

          <Button
            onClick={() =>
              setPreferences((prev) => ({
                ...prev,
                includeTrending: !prev.includeTrending,
              }))
            }
            variant="outline"
            className={`border-white/30 hover:bg-white/30 ${
              preferences.includeTrending
                ? "bg-green-500/20 text-green-200"
                : "bg-white/20 text-white"
            }`}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </Button>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-white text-sm">
              <span>Generating your perfect playlist...</span>
              <span>{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="bg-white/20" />
          </div>
        )}

        {/* Language Selection */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Languages & Cultures
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                onClick={() => {
                  const newLangs = preferences.languages.includes(lang.code)
                    ? preferences.languages.filter((l) => l !== lang.code)
                    : [...preferences.languages, lang.code];
                  savePreferences({ ...preferences, languages: newLangs });
                }}
                variant={
                  preferences.languages.includes(lang.code)
                    ? "default"
                    : "outline"
                }
                size="sm"
                className={`text-xs ${
                  preferences.languages.includes(lang.code)
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                }`}
              >
                {lang.flag} {lang.name.split(" ")[1]}
              </Button>
            ))}
          </div>
        </div>

        {/* Playlist Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Playlist Length: {preferences.duration} songs
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={preferences.duration}
              onChange={(e) =>
                savePreferences({
                  ...preferences,
                  duration: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4" />
              Energy Level: {preferences.energy}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={preferences.energy}
              onChange={(e) =>
                savePreferences({
                  ...preferences,
                  energy: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Current Playlist Info */}
        {currentPlaylist && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-lg border border-white/30">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Music className="h-4 w-4" />
              Current Playlist: {currentPlaylist.name}
            </h4>
            <p className="text-white/80 text-sm mb-2">
              {currentPlaylist.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-500/20 text-green-200">
                {currentPlaylist.songs.length} songs
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-200">
                {currentPlaylist.totalDuration}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-200">
                {currentPlaylist.languages.length} languages
              </Badge>
            </div>
          </div>
        )}

        {/* Recent Playlists */}
        {recentPlaylists.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Playlists
            </h4>

            <div className="space-y-2">
              {recentPlaylists.slice(0, 3).map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-white/10 p-3 rounded-lg cursor-pointer hover:bg-white/20 transition-all"
                  onClick={() => {
                    setCurrentPlaylist(playlist);
                    onPlaylistGenerated(playlist.songs);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">
                        {playlist.name}
                      </p>
                      <p className="text-white/60 text-xs">
                        {playlist.songs.length} songs • {playlist.totalDuration}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <Headphones className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/30">
          <p className="text-yellow-200 text-sm">
            💡 <strong>Tip:</strong> The AI learns from your preferences and
            creates smarter playlists over time!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
