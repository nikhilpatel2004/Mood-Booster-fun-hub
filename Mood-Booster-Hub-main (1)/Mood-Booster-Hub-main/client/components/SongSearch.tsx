import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Play,
  Pause,
  Plus,
  Heart,
  Music,
  Loader2,
  Volume2,
  ExternalLink,
  Mic,
  MicOff,
  History,
  TrendingUp,
  Star,
  Download,
  Share2,
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  thumbnail: string;
  url: string;
  embedId?: string;
  source: "youtube" | "spotify" | "apple" | "soundcloud";
  preview_url?: string;
  popularity?: number;
  explicit?: boolean;
}

interface SongSearchProps {
  onSongSelect: (song: SearchResult) => void;
  onAddToPlaylist: (song: SearchResult) => void;
  currentSong?: SearchResult | null;
  isPlaying?: boolean;
}

const popularSearches = [
  "happy songs 2024",
  "workout music",
  "chill indie",
  "bollywood hits",
  "k-pop dance",
  "spanish reggaeton",
  "meditation music",
  "focus music",
  "classic rock",
  "jazz standards",
  "hip hop beats",
  "country roads",
];

const recentSearches = [
  "dynamite BTS",
  "bad bunny",
  "taylor swift",
  "the weeknd",
  "dua lipa",
  "imagine dragons",
  "billie eilish",
  "ed sheeran",
];

export default function SongSearch({
  onSongSelect,
  onAddToPlaylist,
  currentSong,
  isPlaying = false,
}: SongSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [filters, setFilters] = useState({
    source: "all" as "all" | "youtube" | "spotify" | "apple",
    explicit: false,
    duration: "any" as "any" | "short" | "medium" | "long",
  });

  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        performSearch(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Load search history
    const saved = localStorage.getItem("songSearchHistory");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Simulate song search with multi-source results
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      setIsSearching(true);
      console.log(`🔍 Searching for: "${searchQuery}"`);

      try {
        // Add to search history
        const newHistory = [
          searchQuery,
          ...searchHistory.filter((h) => h !== searchQuery),
        ].slice(0, 10);
        setSearchHistory(newHistory);
        localStorage.setItem("songSearchHistory", JSON.stringify(newHistory));

        // Simulate API search with realistic results
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Generate realistic search results
        const mockResults: SearchResult[] = [];

        // YouTube results
        for (let i = 0; i < 8; i++) {
          const artists = [
            "The Weeknd",
            "Dua Lipa",
            "BTS",
            "Taylor Swift",
            "Bad Bunny",
            "Billie Eilish",
            "Drake",
            "Ariana Grande",
          ];
          const artist = artists[Math.floor(Math.random() * artists.length)];

          mockResults.push({
            id: `yt_${i}_${Date.now()}`,
            title: `${searchQuery} - ${artist} Style Mix`,
            artist: artist,
            album: "Latest Hits",
            duration: `${Math.floor(Math.random() * 3) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
            thumbnail: `https://picsum.photos/300/300?random=${i}`,
            url: `https://www.youtube.com/watch?v=sample${i}`,
            embedId: `sample${i}`,
            source: "youtube",
            popularity: Math.floor(Math.random() * 100),
            explicit: Math.random() > 0.7,
          });
        }

        // Spotify results
        for (let i = 0; i < 6; i++) {
          const artists = [
            "Olivia Rodrigo",
            "Post Malone",
            "Doja Cat",
            "Harry Styles",
            "SZA",
            "Travis Scott",
          ];
          const artist = artists[Math.floor(Math.random() * artists.length)];

          mockResults.push({
            id: `sp_${i}_${Date.now()}`,
            title: `${searchQuery} (${artist} Remix)`,
            artist: artist,
            album: "Trending Now",
            duration: `${Math.floor(Math.random() * 2) + 3}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
            thumbnail: `https://picsum.photos/300/300?random=${i + 10}`,
            url: `https://open.spotify.com/track/sample${i}`,
            source: "spotify",
            popularity: Math.floor(Math.random() * 100),
            explicit: Math.random() > 0.8,
            preview_url: `https://sample-preview-${i}.mp3`,
          });
        }

        // Filter results based on preferences
        let filteredResults = mockResults;

        if (filters.source !== "all") {
          filteredResults = filteredResults.filter(
            (r) => r.source === filters.source,
          );
        }

        if (!filters.explicit) {
          filteredResults = filteredResults.filter((r) => !r.explicit);
        }

        // Shuffle and limit results
        filteredResults = filteredResults
          .sort(() => Math.random() - 0.5)
          .slice(0, 20);

        setResults(filteredResults);
        console.log(
          `✅ Found ${filteredResults.length} results for "${searchQuery}"`,
        );
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [searchHistory, filters],
  );

  // Handle search
  const handleSearch = () => {
    performSearch(query);
  };

  // Voice search
  const startVoiceSearch = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert("Voice search not supported in this browser.");
    }
  };

  // Quick search from popular/recent
  const quickSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    performSearch(searchTerm);
    setShowHistory(false);
  };

  // Play song
  const playSong = (song: SearchResult) => {
    console.log(`🎵 Playing: ${song.title} by ${song.artist}`);
    onSongSelect(song);
  };

  // Add to playlist
  const addToPlaylist = (song: SearchResult) => {
    console.log(`➕ Adding to playlist: ${song.title}`);
    onAddToPlaylist(song);
  };

  // Get source icon and color
  const getSourceInfo = (source: string) => {
    switch (source) {
      case "youtube":
        return {
          icon: "📺",
          color: "bg-red-500/20 text-red-200",
          name: "YouTube",
        };
      case "spotify":
        return {
          icon: "🎵",
          color: "bg-green-500/20 text-green-200",
          name: "Spotify",
        };
      case "apple":
        return {
          icon: "🍎",
          color: "bg-gray-500/20 text-gray-200",
          name: "Apple Music",
        };
      default:
        return {
          icon: "🎶",
          color: "bg-blue-500/20 text-blue-200",
          name: "Music",
        };
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white text-lg md:text-xl flex items-center gap-2">
          <Search className="h-5 w-5" />
          🔍 Song Search & Play
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            Multi-Source
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Search for any song, artist, or album..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 pr-10"
              />
              {query && (
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1 text-white hover:bg-white/20 h-8 w-8"
                >
                  <History className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>

            <Button
              onClick={startVoiceSearch}
              disabled={isListening}
              className={`text-white ${isListening ? "bg-red-500 animate-pulse" : "bg-purple-500 hover:bg-purple-600"}`}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Search History Dropdown */}
          {showHistory && searchHistory.length > 0 && (
            <div className="bg-white/20 rounded-lg p-3 space-y-2">
              <h4 className="text-white font-medium text-sm">
                Recent Searches
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {searchHistory.map((term, index) => (
                  <Button
                    key={index}
                    onClick={() => quickSearch(term)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 justify-start text-xs"
                  >
                    <History className="h-3 w-3 mr-2" />
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.source}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  source: e.target.value as any,
                }))
              }
              className="bg-white/20 border-white/30 text-white rounded px-3 py-1 text-sm"
            >
              <option value="all">All Sources</option>
              <option value="youtube">YouTube</option>
              <option value="spotify">Spotify</option>
              <option value="apple">Apple Music</option>
            </select>

            <Button
              onClick={() =>
                setFilters((prev) => ({ ...prev, explicit: !prev.explicit }))
              }
              size="sm"
              variant={filters.explicit ? "default" : "outline"}
              className={
                filters.explicit
                  ? "bg-red-500 text-white"
                  : "bg-white/10 text-white border-white/30"
              }
            >
              🚫 Hide Explicit
            </Button>
          </div>
        </div>

        {/* Quick Search Suggestions */}
        {!query && !isSearching && results.length === 0 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Popular Searches
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {popularSearches.map((term, index) => (
                  <Button
                    key={index}
                    onClick={() => quickSearch(term)}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-xs"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Trending Artists
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {recentSearches.map((artist, index) => (
                  <Button
                    key={index}
                    onClick={() => quickSearch(artist)}
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30 hover:bg-purple-500/30 text-xs"
                  >
                    {artist}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isSearching && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-white">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
              <p>Searching across multiple music platforms...</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold">
                Search Results ({results.length})
              </h4>
              <Badge className="bg-blue-500/20 text-blue-200">{query}</Badge>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((song, index) => {
                const sourceInfo = getSourceInfo(song.source);
                const isCurrentSong = currentSong?.id === song.id;

                return (
                  <div
                    key={song.id}
                    className={`bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-all ${
                      isCurrentSong
                        ? "ring-2 ring-green-500 bg-green-500/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="relative">
                        <img
                          src={song.thumbnail}
                          alt={song.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        {isCurrentSong && isPlaying && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <Volume2 className="h-4 w-4 text-white animate-pulse" />
                          </div>
                        )}
                      </div>

                      {/* Song Info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-white font-medium text-sm truncate">
                          {song.title}
                        </h5>
                        <p className="text-white/80 text-xs truncate">
                          {song.artist}
                          {song.album && ` • ${song.album}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${sourceInfo.color} text-xs`}>
                            {sourceInfo.icon} {sourceInfo.name}
                          </Badge>
                          <span className="text-white/60 text-xs">
                            {song.duration}
                          </span>
                          {song.explicit && (
                            <Badge className="bg-red-500/20 text-red-200 text-xs">
                              E
                            </Badge>
                          )}
                          {song.popularity && (
                            <Badge className="bg-yellow-500/20 text-yellow-200 text-xs">
                              {song.popularity}%
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => playSong(song)}
                          size="sm"
                          className={`${
                            isCurrentSong && isPlaying
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white w-8 h-8`}
                        >
                          {isCurrentSong && isPlaying ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>

                        <Button
                          onClick={() => addToPlaylist(song)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 text-white border-white/30 hover:bg-white/20 w-8 h-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          onClick={() => {
                            // Add to favorites
                            const favorites = JSON.parse(
                              localStorage.getItem("favoriteSongs") || "[]",
                            );
                            favorites.push(song);
                            localStorage.setItem(
                              "favoriteSongs",
                              JSON.stringify(favorites),
                            );
                            alert("Added to favorites!");
                          }}
                          size="sm"
                          variant="outline"
                          className="bg-pink-500/20 text-pink-200 border-pink-500/30 hover:bg-pink-500/30 w-8 h-8"
                        >
                          <Heart className="h-3 w-3" />
                        </Button>

                        {song.url && (
                          <Button
                            onClick={() => window.open(song.url, "_blank")}
                            size="sm"
                            variant="outline"
                            className="bg-blue-500/20 text-blue-200 border-blue-500/30 hover:bg-blue-500/30 w-8 h-8"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isSearching && query && results.length === 0 && (
          <div className="text-center py-8">
            <Music className="h-12 w-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/60">No results found for "{query}"</p>
            <p className="text-white/40 text-sm mt-1">
              Try different keywords or check spelling
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
          <p className="text-blue-200 text-sm">
            💡 <strong>Pro Tips:</strong> Use voice search 🎤, try different
            languages, or search by mood like "happy songs" or "workout music"!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
