import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Smile,
  Quote,
  Headphones,
  Play,
  Pause,
  SkipForward,
  RefreshCw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Heart,
  BookOpen,
  Sparkles,
  Wind,
  Waves,
  Flame,
  Leaf,
  Sun,
  Moon,
  CloudRain,
  Mountain,
} from "lucide-react";

interface MemeData {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  category: string;
  mood: string;
}

interface MeditationTrack {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  category: "breathing" | "mindfulness" | "nature" | "sleep" | "focus";
  instructor?: string;
  mood: string;
  audioUrl?: string;
  thumbnail: string;
}

interface MoodBoosterExtrasProps {
  currentMood: string;
  isDarkMode: boolean;
}

const moodMemes = {
  happy: [
    {
      id: "happy1",
      title: "Sunshine Vibes",
      imageUrl: "https://picsum.photos/400/300?random=1",
      caption: "When you realize it's Friday and you've got weekend plans! 🌞",
      category: "positivity",
      mood: "happy",
    },
    {
      id: "happy2",
      title: "Good Vibes Only",
      imageUrl: "https://picsum.photos/400/300?random=2",
      caption: "Life is better when you're laughing! 😄",
      category: "motivation",
      mood: "happy",
    },
    {
      id: "happy3",
      title: "Success Kid",
      imageUrl: "https://picsum.photos/400/300?random=3",
      caption: "When everything goes according to plan! 💪",
      category: "achievement",
      mood: "happy",
    },
  ],
  calm: [
    {
      id: "calm1",
      title: "Peace of Mind",
      imageUrl: "https://picsum.photos/400/300?random=10",
      caption: "Taking a deep breath and letting go... 🧘‍♀️",
      category: "relaxation",
      mood: "calm",
    },
    {
      id: "calm2",
      title: "Zen Master",
      imageUrl: "https://picsum.photos/400/300?random=11",
      caption: "Inner peace is the new success 🌸",
      category: "mindfulness",
      mood: "calm",
    },
  ],
  energetic: [
    {
      id: "energetic1",
      title: "Power Mode",
      imageUrl: "https://picsum.photos/400/300?random=20",
      caption: "When the pre-workout kicks in! ⚡",
      category: "energy",
      mood: "energetic",
    },
    {
      id: "energetic2",
      title: "Unstoppable",
      imageUrl: "https://picsum.photos/400/300?random=21",
      caption: "Crushing goals like it's Monday morning! 🔥",
      category: "motivation",
      mood: "energetic",
    },
  ],
};

const meditationTracks = {
  happy: [
    {
      id: "happy_med1",
      title: "Gratitude & Joy",
      description:
        "A guided meditation to cultivate happiness and appreciation",
      duration: 600, // 10 minutes
      category: "mindfulness" as const,
      instructor: "Sarah Johnson",
      mood: "happy",
      thumbnail: "🌞",
      audioUrl: "meditation-gratitude.mp3",
    },
    {
      id: "happy_med2",
      title: "Loving Kindness",
      description: "Send love and positive energy to yourself and others",
      duration: 900, // 15 minutes
      category: "mindfulness" as const,
      instructor: "Michael Chen",
      mood: "happy",
      thumbnail: "💝",
      audioUrl: "meditation-loving-kindness.mp3",
    },
  ],
  calm: [
    {
      id: "calm_med1",
      title: "Ocean Waves",
      description: "Relax with the soothing sounds of gentle ocean waves",
      duration: 1800, // 30 minutes
      category: "nature" as const,
      mood: "calm",
      thumbnail: "🌊",
      audioUrl: "ocean-waves.mp3",
    },
    {
      id: "calm_med2",
      title: "Forest Rain",
      description: "Peaceful raindrops falling in a quiet forest",
      duration: 1200, // 20 minutes
      category: "nature" as const,
      mood: "calm",
      thumbnail: "🌧️",
      audioUrl: "forest-rain.mp3",
    },
    {
      id: "calm_med3",
      title: "4-7-8 Breathing",
      description: "Calming breathing technique for instant relaxation",
      duration: 480, // 8 minutes
      category: "breathing" as const,
      instructor: "Dr. Amanda Smith",
      mood: "calm",
      thumbnail: "🫁",
      audioUrl: "breathing-478.mp3",
    },
  ],
  energetic: [
    {
      id: "energetic_med1",
      title: "Morning Energy Boost",
      description: "Energizing meditation to start your day with power",
      duration: 600, // 10 minutes
      category: "focus" as const,
      instructor: "Tony Rodriguez",
      mood: "energetic",
      thumbnail: "☀️",
      audioUrl: "morning-energy.mp3",
    },
    {
      id: "energetic_med2",
      title: "Confidence Builder",
      description: "Build unstoppable confidence and inner strength",
      duration: 720, // 12 minutes
      category: "mindfulness" as const,
      instructor: "Lisa Wang",
      mood: "energetic",
      thumbnail: "💪",
      audioUrl: "confidence-builder.mp3",
    },
  ],
  peaceful: [
    {
      id: "peaceful_med1",
      title: "Tibetan Singing Bowls",
      description: "Healing vibrations for deep spiritual peace",
      duration: 1500, // 25 minutes
      category: "mindfulness" as const,
      mood: "peaceful",
      thumbnail: "🎵",
      audioUrl: "singing-bowls.mp3",
    },
    {
      id: "peaceful_med2",
      title: "Mountain Silence",
      description: "Find inner stillness in the serenity of mountains",
      duration: 1200, // 20 minutes
      category: "nature" as const,
      mood: "peaceful",
      thumbnail: "⛰️",
      audioUrl: "mountain-silence.mp3",
    },
  ],
  creative: [
    {
      id: "creative_med1",
      title: "Creative Flow State",
      description: "Unlock your creative potential and artistic vision",
      duration: 900, // 15 minutes
      category: "focus" as const,
      instructor: "Maya Patel",
      mood: "creative",
      thumbnail: "🎨",
      audioUrl: "creative-flow.mp3",
    },
  ],
  focused: [
    {
      id: "focused_med1",
      title: "Deep Focus Meditation",
      description: "Enhance concentration and mental clarity",
      duration: 1200, // 20 minutes
      category: "focus" as const,
      instructor: "James Thompson",
      mood: "focused",
      thumbnail: "🎯",
      audioUrl: "deep-focus.mp3",
    },
    {
      id: "focused_med2",
      title: "Study Focus",
      description: "Improve learning capacity and retention",
      duration: 600, // 10 minutes
      category: "focus" as const,
      instructor: "Dr. Rachel Green",
      mood: "focused",
      thumbnail: "📚",
      audioUrl: "study-focus.mp3",
    },
  ],
};

export default function MoodBoosterExtras({
  currentMood,
  isDarkMode,
}: MoodBoosterExtrasProps) {
  const [currentMeme, setCurrentMeme] = useState<MemeData | null>(null);
  const [currentTrack, setCurrentTrack] = useState<MeditationTrack | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Load favorites
  useEffect(() => {
    const saved = localStorage.getItem("moodBoosterFavorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Load content for current mood
  useEffect(() => {
    loadRandomMeme();
    loadRecommendedTrack();
  }, [currentMood]);

  // Audio progress tracking
  useEffect(() => {
    if (isPlaying && currentTrack) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 100 / currentTrack.duration;
          if (newProgress >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return newProgress;
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentTrack]);

  // Load random meme for current mood
  const loadRandomMeme = useCallback(() => {
    const moodMemeList =
      moodMemes[currentMood as keyof typeof moodMemes] || moodMemes.happy;
    const randomMeme =
      moodMemeList[Math.floor(Math.random() * moodMemeList.length)];
    setCurrentMeme(randomMeme);
  }, [currentMood]);

  // Load recommended meditation track
  const loadRecommendedTrack = useCallback(() => {
    const moodTracks =
      meditationTracks[currentMood as keyof typeof meditationTracks] ||
      meditationTracks.calm;
    const recommendedTrack = moodTracks[0]; // First track as recommendation
    setCurrentTrack(recommendedTrack);
    setProgress(0);
    setIsPlaying(false);
  }, [currentMood]);

  // Play/pause meditation
  const togglePlayback = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      setIsPlaying(false);
      console.log("⏸️ Paused meditation:", currentTrack.title);
    } else {
      setIsPlaying(true);
      console.log("▶️ Playing meditation:", currentTrack.title);
    }
  };

  // Skip to next track
  const nextTrack = () => {
    const moodTracks =
      meditationTracks[currentMood as keyof typeof meditationTracks] ||
      meditationTracks.calm;
    const currentIndex = moodTracks.findIndex(
      (track) => track.id === currentTrack?.id,
    );
    const nextIndex = (currentIndex + 1) % moodTracks.length;
    const nextTrackData = moodTracks[nextIndex];

    setCurrentTrack(nextTrackData);
    setProgress(0);
    setIsPlaying(false);
    console.log("⏭️ Next track:", nextTrackData.title);
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Add to favorites
  const toggleFavorite = (id: string, type: "meme" | "meditation") => {
    const favoriteId = `${type}_${id}`;
    const newFavorites = favorites.includes(favoriteId)
      ? favorites.filter((f) => f !== favoriteId)
      : [...favorites, favoriteId];

    setFavorites(newFavorites);
    localStorage.setItem("moodBoosterFavorites", JSON.stringify(newFavorites));
  };

  // Share content
  const shareContent = (
    content: MemeData | MeditationTrack,
    type: "meme" | "meditation",
  ) => {
    const shareText =
      type === "meme"
        ? `Check out this mood-boosting meme: "${content.title}" - ${(content as MemeData).caption}`
        : `Try this meditation: "${content.title}" - ${(content as MeditationTrack).description}`;

    if (navigator.share) {
      navigator.share({
        title: `Mood Booster - ${content.title}`,
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(`${shareText} ${window.location.href}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Memes Section */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-lg md:text-xl flex items-center gap-2">
            <Smile className="h-5 w-5" />
            😂 Mood-Boosting Memes
            <Badge className="bg-yellow-500 text-black">Fun</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {currentMeme && (
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-center mb-4">
                <img
                  src={currentMeme.imageUrl}
                  alt={currentMeme.title}
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
              </div>

              <div className="text-center space-y-3">
                <h3 className="text-white font-bold text-lg">
                  {currentMeme.title}
                </h3>
                <p className="text-white/90 text-base italic">
                  "{currentMeme.caption}"
                </p>

                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge className="bg-purple-500/20 text-purple-200">
                    {currentMeme.category}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-200">
                    {currentMeme.mood} mood
                  </Badge>
                </div>

                <div className="flex justify-center gap-3 mt-4">
                  <Button
                    onClick={loadRandomMeme}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New Meme
                  </Button>

                  <Button
                    onClick={() => toggleFavorite(currentMeme.id, "meme")}
                    variant="outline"
                    className={`border-white/30 ${
                      favorites.includes(`meme_${currentMeme.id}`)
                        ? "bg-red-500/20 text-red-200 border-red-500/30"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        favorites.includes(`meme_${currentMeme.id}`)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                    {favorites.includes(`meme_${currentMeme.id}`)
                      ? "Loved"
                      : "Love"}
                  </Button>

                  <Button
                    onClick={() => shareContent(currentMeme, "meme")}
                    variant="outline"
                    className="bg-blue-500/20 text-blue-200 border-blue-500/30 hover:bg-blue-500/30"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meditation Audio Section */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-lg md:text-xl flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            🧘 Meditation & Relaxation
            <Badge className="bg-green-500 text-white">Wellness</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentTrack && (
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-white/30">
              {/* Track Info */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{currentTrack.thumbnail}</div>
                <h3 className="text-white font-bold text-xl mb-2">
                  {currentTrack.title}
                </h3>
                <p className="text-white/80 mb-3">{currentTrack.description}</p>

                <div className="flex justify-center gap-2 flex-wrap mb-4">
                  <Badge className="bg-green-500/20 text-green-200">
                    {currentTrack.category}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-200">
                    {formatDuration(currentTrack.duration)}
                  </Badge>
                  {currentTrack.instructor && (
                    <Badge className="bg-purple-500/20 text-purple-200">
                      {currentTrack.instructor}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Audio Controls */}
              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-white/70 text-sm mb-2">
                    <span>
                      {formatDuration(
                        Math.floor((progress * currentTrack.duration) / 100),
                      )}
                    </span>
                    <span>{formatDuration(currentTrack.duration)}</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-white/20" />
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={nextTrack}
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>

                  <Button
                    onClick={togglePlayback}
                    size="lg"
                    className={`w-14 h-14 rounded-full ${
                      isPlaying
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-1" />
                    )}
                  </Button>

                  <Button
                    onClick={() => setIsMuted(!isMuted)}
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3">
                  <Volume2 className="h-4 w-4 text-white/70" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-white/70 text-sm w-8">
                    {isMuted ? 0 : volume}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 mt-6">
                  <Button
                    onClick={() =>
                      toggleFavorite(currentTrack.id, "meditation")
                    }
                    variant="outline"
                    className={`border-white/30 ${
                      favorites.includes(`meditation_${currentTrack.id}`)
                        ? "bg-red-500/20 text-red-200 border-red-500/30"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        favorites.includes(`meditation_${currentTrack.id}`)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                    Favorite
                  </Button>

                  <Button
                    onClick={() => shareContent(currentTrack, "meditation")}
                    variant="outline"
                    className="bg-blue-500/20 text-blue-200 border-blue-500/30 hover:bg-blue-500/30"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>

                  <Button
                    onClick={() => {
                      // Simulate download
                      alert("Download feature coming soon! 🎧");
                    }}
                    variant="outline"
                    className="bg-purple-500/20 text-purple-200 border-purple-500/30 hover:bg-purple-500/30"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Track Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["breathing", "mindfulness", "nature", "sleep", "focus"].map(
              (category) => {
                const categoryIcons = {
                  breathing: "🫁",
                  mindfulness: "🧘",
                  nature: "🌿",
                  sleep: "😴",
                  focus: "🎯",
                };

                return (
                  <Button
                    key={category}
                    onClick={() => {
                      // Filter tracks by category
                      const allTracks = Object.values(meditationTracks).flat();
                      const categoryTracks = allTracks.filter(
                        (track) => track.category === category,
                      );
                      if (categoryTracks.length > 0) {
                        const randomTrack =
                          categoryTracks[
                            Math.floor(Math.random() * categoryTracks.length)
                          ];
                        setCurrentTrack(randomTrack);
                        setProgress(0);
                        setIsPlaying(false);
                      }
                    }}
                    variant="outline"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 h-16 flex-col gap-1"
                  >
                    <span className="text-xl">
                      {categoryIcons[category as keyof typeof categoryIcons]}
                    </span>
                    <span className="text-xs capitalize">{category}</span>
                  </Button>
                );
              },
            )}
          </div>

          {/* Wellness Tips */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              💡 Wellness Tip
            </h4>
            <p className="text-purple-200 text-sm">
              Regular meditation, even just 5-10 minutes daily, can
              significantly reduce stress, improve focus, and boost overall
              mental well-being. Find what works for you! 🌟
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
