import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Heart,
  Smile,
  Meh,
  Frown,
  Save,
  Download,
  Share2,
  BarChart3,
  LineChart,
  PieChart,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  AreaChart,
  BarChart,
  PieChart as RechartsPieChart,
  Line,
  Area,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  score: number; // 1-10 scale
  notes: string;
  activities: string[];
  weather?: string;
  sleep?: number;
  energy?: number;
  stress?: number;
  gratitude?: string;
}

interface MoodStats {
  averageScore: number;
  totalEntries: number;
  streak: number;
  mostCommonMood: string;
  trend: "up" | "down" | "stable";
  weeklyAverage: number;
  monthlyAverage: number;
}

const moodEmojis = {
  happy: { emoji: "😊", score: 8, color: "#22c55e" },
  calm: { emoji: "🧘", score: 7, color: "#3b82f6" },
  energetic: { emoji: "⚡", score: 9, color: "#f59e0b" },
  peaceful: { emoji: "🌿", score: 7, color: "#10b981" },
  creative: { emoji: "🎨", score: 8, color: "#8b5cf6" },
  focused: { emoji: "🎯", score: 7, color: "#6b7280" },
  stressed: { emoji: "😰", score: 3, color: "#ef4444" },
  sad: { emoji: "😢", score: 2, color: "#6366f1" },
  excited: { emoji: "🤩", score: 9, color: "#f97316" },
  tired: { emoji: "😴", score: 4, color: "#64748b" },
};

const activities = [
  "Exercise",
  "Meditation",
  "Reading",
  "Music",
  "Work",
  "Socializing",
  "Gaming",
  "Cooking",
  "Walking",
  "Art",
  "Learning",
  "Rest",
];

export default function DailyMoodJournal() {
  const [currentEntry, setCurrentEntry] = useState<Partial<MoodEntry>>({
    date: new Date().toISOString().split("T")[0],
    mood: "happy",
    score: 7,
    notes: "",
    activities: [],
    energy: 5,
    stress: 3,
    gratitude: "",
  });

  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [showPrivateNotes, setShowPrivateNotes] = useState(false);
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month",
  );

  // Load saved entries
  useEffect(() => {
    const saved = localStorage.getItem("moodJournalEntries");
    if (saved) {
      const loadedEntries = JSON.parse(saved);
      setEntries(loadedEntries);
      calculateStats(loadedEntries);
    }
  }, []);

  // Calculate statistics
  const calculateStats = useCallback((journalEntries: MoodEntry[]) => {
    if (journalEntries.length === 0) return;

    const scores = journalEntries.map((e) => e.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Calculate streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split("T")[0];

      if (journalEntries.some((e) => e.date === dateString)) {
        streak++;
      } else {
        break;
      }
    }

    // Most common mood
    const moodCounts: { [key: string]: number } = {};
    journalEntries.forEach((e) => {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });
    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) =>
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b,
    )[0];

    // Trend calculation
    const recentEntries = journalEntries.slice(-7);
    const olderEntries = journalEntries.slice(-14, -7);
    const recentAvg =
      recentEntries.reduce((a, b) => a + b.score, 0) / recentEntries.length;
    const olderAvg =
      olderEntries.reduce((a, b) => a + b.score, 0) /
      (olderEntries.length || 1);

    let trend: "up" | "down" | "stable" = "stable";
    if (recentAvg > olderAvg + 0.5) trend = "up";
    if (recentAvg < olderAvg - 0.5) trend = "down";

    const weeklyEntries = journalEntries.slice(-7);
    const monthlyEntries = journalEntries.slice(-30);

    const newStats: MoodStats = {
      averageScore,
      totalEntries: journalEntries.length,
      streak,
      mostCommonMood,
      trend,
      weeklyAverage:
        weeklyEntries.reduce((a, b) => a + b.score, 0) /
        (weeklyEntries.length || 1),
      monthlyAverage:
        monthlyEntries.reduce((a, b) => a + b.score, 0) /
        (monthlyEntries.length || 1),
    };

    setStats(newStats);
  }, []);

  // Save mood entry
  const saveMoodEntry = useCallback(() => {
    if (!currentEntry.mood || !currentEntry.score) return;

    const newEntry: MoodEntry = {
      id: `entry_${Date.now()}`,
      date: currentEntry.date || new Date().toISOString().split("T")[0],
      mood: currentEntry.mood,
      score: currentEntry.score,
      notes: currentEntry.notes || "",
      activities: currentEntry.activities || [],
      energy: currentEntry.energy || 5,
      stress: currentEntry.stress || 3,
      gratitude: currentEntry.gratitude || "",
    };

    // Update or add entry
    const updatedEntries = entries.filter((e) => e.date !== newEntry.date);
    updatedEntries.push(newEntry);
    updatedEntries.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    setEntries(updatedEntries);
    localStorage.setItem("moodJournalEntries", JSON.stringify(updatedEntries));
    calculateStats(updatedEntries);

    // Reset form for next entry
    setCurrentEntry({
      date: new Date().toISOString().split("T")[0],
      mood: "happy",
      score: 7,
      notes: "",
      activities: [],
      energy: 5,
      stress: 3,
      gratitude: "",
    });

    console.log("✅ Mood entry saved successfully");
  }, [currentEntry, entries, calculateStats]);

  // Get chart data based on time range
  const getChartData = useCallback(() => {
    const now = new Date();
    let filterDate = new Date();

    switch (timeRange) {
      case "week":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return entries
      .filter((e) => new Date(e.date) >= filterDate)
      .map((e) => ({
        date: e.date,
        score: e.score,
        mood: e.mood,
        energy: e.energy || 5,
        stress: e.stress || 3,
        formattedDate: new Date(e.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
  }, [entries, timeRange]);

  // Get mood distribution data
  const getMoodDistribution = useCallback(() => {
    const moodCounts: { [key: string]: number } = {};
    entries.forEach((e) => {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });

    return Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood,
      value: count,
      color: moodEmojis[mood as keyof typeof moodEmojis]?.color || "#6b7280",
      emoji: moodEmojis[mood as keyof typeof moodEmojis]?.emoji || "😊",
    }));
  }, [entries]);

  // Export data
  const exportData = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mood-journal-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const chartData = getChartData();
  const moodDistribution = getMoodDistribution();

  return (
    <div className="space-y-6">
      {/* Quick Entry */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-lg md:text-xl flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            📝 Daily Mood Journal
            <Badge className="bg-blue-500 text-white">Track & Grow</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Today's Entry */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-lg border border-white/30">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              How are you feeling today?
            </h3>

            {/* Mood Selection */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
              {Object.entries(moodEmojis).map(([mood, data]) => (
                <Button
                  key={mood}
                  onClick={() =>
                    setCurrentEntry((prev) => ({
                      ...prev,
                      mood,
                      score: data.score,
                    }))
                  }
                  variant={currentEntry.mood === mood ? "default" : "outline"}
                  className={`h-16 flex-col gap-1 ${
                    currentEntry.mood === mood
                      ? "bg-white text-black scale-105"
                      : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                  }`}
                >
                  <span className="text-xl">{data.emoji}</span>
                  <span className="text-xs capitalize">{mood}</span>
                </Button>
              ))}
            </div>

            {/* Mood Score */}
            <div className="mb-4">
              <label className="text-white text-sm font-medium block mb-2">
                Mood Intensity: {currentEntry.score}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentEntry.score || 7}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    score: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Energy & Stress */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  Energy: {currentEntry.energy}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.energy || 5}
                  onChange={(e) =>
                    setCurrentEntry((prev) => ({
                      ...prev,
                      energy: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-green-500/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  Stress: {currentEntry.stress}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.stress || 3}
                  onChange={(e) =>
                    setCurrentEntry((prev) => ({
                      ...prev,
                      stress: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-red-500/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Activities */}
            <div className="mb-4">
              <label className="text-white text-sm font-medium block mb-2">
                Activities today:
              </label>
              <div className="flex flex-wrap gap-2">
                {activities.map((activity) => (
                  <Button
                    key={activity}
                    onClick={() => {
                      const isSelected =
                        currentEntry.activities?.includes(activity);
                      const newActivities = isSelected
                        ? currentEntry.activities?.filter(
                            (a) => a !== activity,
                          ) || []
                        : [...(currentEntry.activities || []), activity];
                      setCurrentEntry((prev) => ({
                        ...prev,
                        activities: newActivities,
                      }));
                    }}
                    size="sm"
                    variant={
                      currentEntry.activities?.includes(activity)
                        ? "default"
                        : "outline"
                    }
                    className={`text-xs ${
                      currentEntry.activities?.includes(activity)
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                    }`}
                  >
                    {activity}
                  </Button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="text-white text-sm font-medium block mb-2">
                Notes & Reflection:
              </label>
              <Textarea
                placeholder="What made you feel this way? Any thoughts or observations..."
                value={currentEntry.notes || ""}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 min-h-[80px]"
              />
            </div>

            {/* Gratitude */}
            <div className="mb-4">
              <label className="text-white text-sm font-medium block mb-2">
                💝 One thing you're grateful for:
              </label>
              <Textarea
                placeholder="I'm grateful for..."
                value={currentEntry.gratitude || ""}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    gratitude: e.target.value,
                  }))
                }
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 min-h-[60px]"
              />
            </div>

            <Button
              onClick={saveMoodEntry}
              className="bg-green-500 hover:bg-green-600 text-white w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Today's Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics & Analytics */}
      {stats && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-lg md:text-xl flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              📊 Mood Analytics
              <Badge className="bg-purple-500 text-white">Insights</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-500/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-white">
                  {stats.averageScore.toFixed(1)}
                </div>
                <div className="text-blue-200 text-sm">Average Mood</div>
              </div>

              <div className="bg-green-500/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-white">
                  {stats.streak}
                </div>
                <div className="text-green-200 text-sm">Day Streak</div>
              </div>

              <div className="bg-purple-500/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-white">
                  {stats.totalEntries}
                </div>
                <div className="text-purple-200 text-sm">Total Entries</div>
              </div>

              <div className="bg-yellow-500/20 p-4 rounded-lg text-center flex flex-col items-center">
                <div className="text-2xl">
                  {
                    moodEmojis[stats.mostCommonMood as keyof typeof moodEmojis]
                      ?.emoji
                  }
                </div>
                <div className="text-yellow-200 text-sm capitalize">
                  Most Common
                </div>
              </div>
            </div>

            {/* Trend */}
            <div className="flex items-center justify-center gap-2 p-4 bg-white/10 rounded-lg">
              {stats.trend === "up" && (
                <>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-green-200">
                    Your mood is trending upward! 📈
                  </span>
                </>
              )}
              {stats.trend === "down" && (
                <>
                  <TrendingDown className="h-5 w-5 text-red-400" />
                  <span className="text-red-200">
                    Consider some self-care activities 💝
                  </span>
                </>
              )}
              {stats.trend === "stable" && (
                <span className="text-white">Your mood has been stable 😌</span>
              )}
            </div>

            {/* Chart Controls */}
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="flex gap-1">
                {(["week", "month", "year"] as const).map((range) => (
                  <Button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    size="sm"
                    variant={timeRange === range ? "default" : "outline"}
                    className={
                      timeRange === range
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-white border-white/30"
                    }
                  >
                    {range}
                  </Button>
                ))}
              </div>

              <div className="flex gap-1">
                {(["line", "area", "bar"] as const).map((type) => (
                  <Button
                    key={type}
                    onClick={() => setChartType(type)}
                    size="sm"
                    variant={chartType === type ? "default" : "outline"}
                    className={
                      chartType === type
                        ? "bg-purple-500 text-white"
                        : "bg-white/10 text-white border-white/30"
                    }
                  >
                    {type === "line" && <LineChart className="h-4 w-4" />}
                    {type === "area" && <BarChart3 className="h-4 w-4" />}
                    {type === "bar" && <PieChart className="h-4 w-4" />}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mood Trend Chart */}
            {chartData.length > 0 && (
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-4 text-center">
                  Mood Trend ({timeRange})
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  {chartType === "line" && (
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="formattedDate" stroke="#ffffff80" />
                      <YAxis domain={[1, 10]} stroke="#ffffff80" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          color: "white",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#22c55e"
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="energy"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="stress"
                        stroke="#ef4444"
                        strokeWidth={2}
                      />
                    </RechartsLineChart>
                  )}

                  {chartType === "area" && (
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="formattedDate" stroke="#ffffff80" />
                      <YAxis domain={[1, 10]} stroke="#ffffff80" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          color: "white",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stackId="1"
                        stroke="#22c55e"
                        fill="#22c55e30"
                      />
                    </AreaChart>
                  )}

                  {chartType === "bar" && (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="formattedDate" stroke="#ffffff80" />
                      <YAxis domain={[1, 10]} stroke="#ffffff80" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          color: "white",
                        }}
                      />
                      <Bar dataKey="score" fill="#22c55e" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}

            {/* Mood Distribution Pie Chart */}
            {moodDistribution.length > 0 && (
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-4 text-center">
                  Mood Distribution
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "white",
                      }}
                    />
                    <Cell />
                  </RechartsPieChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                  {moodDistribution.map((mood, index) => (
                    <div
                      key={mood.name}
                      className="flex items-center gap-2 text-white text-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: mood.color }}
                      />
                      <span>
                        {mood.emoji} {mood.name}
                      </span>
                      <span className="text-white/60">({mood.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                onClick={() => setShowPrivateNotes(!showPrivateNotes)}
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                {showPrivateNotes ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {showPrivateNotes ? "Hide" : "Show"} Notes
              </Button>

              <Button
                onClick={exportData}
                variant="outline"
                className="bg-blue-500/20 text-blue-200 border-blue-500/30 hover:bg-blue-500/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>

              <Button
                onClick={() => {
                  navigator
                    .share?.({
                      title: "My Mood Journal Stats",
                      text: `I've been tracking my mood for ${stats.totalEntries} days with an average score of ${stats.averageScore.toFixed(1)}/10!`,
                      url: window.location.href,
                    })
                    .catch(() => {
                      navigator.clipboard?.writeText(
                        `I've been tracking my mood for ${stats.totalEntries} days with an average score of ${stats.averageScore.toFixed(1)}/10! ${window.location.href}`,
                      );
                      alert("Stats copied to clipboard!");
                    });
                }}
                variant="outline"
                className="bg-green-500/20 text-green-200 border-green-500/30 hover:bg-green-500/30"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      {showPrivateNotes && entries.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {entries
                .slice(-10)
                .reverse()
                .map((entry) => (
                  <div key={entry.id} className="bg-white/10 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {
                            moodEmojis[entry.mood as keyof typeof moodEmojis]
                              ?.emoji
                          }
                        </span>
                        <span className="text-white font-medium capitalize">
                          {entry.mood}
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-200">
                          {entry.score}/10
                        </Badge>
                      </div>
                      <span className="text-white/60 text-sm">
                        {entry.date}
                      </span>
                    </div>

                    {entry.notes && (
                      <p className="text-white/80 text-sm mb-2">
                        {entry.notes}
                      </p>
                    )}

                    {entry.gratitude && (
                      <p className="text-yellow-200 text-sm italic">
                        💝 {entry.gratitude}
                      </p>
                    )}

                    {entry.activities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.activities.map((activity) => (
                          <Badge
                            key={activity}
                            className="bg-purple-500/20 text-purple-200 text-xs"
                          >
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
