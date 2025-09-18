import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  Clock,
  Heart,
  Star,
  Target,
  Sparkles,
  Eye,
  Music,
  Calendar,
  BarChart3,
  Zap,
  User,
  Settings,
  Lightbulb,
  Trophy,
  RefreshCw,
} from "lucide-react";

interface UserBehavior {
  moodSelections: { [mood: string]: number };
  timeOfDayPreferences: { [hour: string]: string };
  sessionDurations: { [mood: string]: number[] };
  songInteractions: { [songId: string]: number };
  featureUsage: { [feature: string]: number };
  moodTransitions: Array<{ from: string; to: string; timestamp: Date }>;
  dailyPatterns: { [day: string]: string[] };
  feedbackData: { [type: string]: { positive: number; negative: number } };
}

interface PersonalizationInsight {
  id: string;
  type:
    | "mood_recommendation"
    | "music_suggestion"
    | "time_pattern"
    | "behavior_insight";
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  data: any;
  timestamp: Date;
}

interface PersonalizedRecommendation {
  id: string;
  type: "mood" | "song" | "activity" | "time_suggestion";
  title: string;
  description: string;
  confidence: number;
  reason: string;
  action: () => void;
}

interface AIPersonalizationEngineProps {
  currentMood: string;
  currentSong?: any;
  onRecommendation: (recommendation: PersonalizedRecommendation) => void;
  onMoodSuggestion: (mood: string, reason: string) => void;
  isDarkMode: boolean;
}

export default function AIPersonalizationEngine({
  currentMood,
  currentSong,
  onRecommendation,
  onMoodSuggestion,
  isDarkMode,
}: AIPersonalizationEngineProps) {
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    moodSelections: {},
    timeOfDayPreferences: {},
    sessionDurations: {},
    songInteractions: {},
    featureUsage: {},
    moodTransitions: [],
    dailyPatterns: {},
    feedbackData: {},
  });

  const [insights, setInsights] = useState<PersonalizationInsight[]>([]);
  const [recommendations, setRecommendations] = useState<
    PersonalizedRecommendation[]
  >([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);
  const [personalizationLevel, setPersonalizationLevel] = useState<
    "basic" | "intermediate" | "advanced"
  >("basic");

  const sessionStartRef = useRef<Date>(new Date());
  const lastMoodRef = useRef<string>(currentMood);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load user behavior data
  useEffect(() => {
    const saved = localStorage.getItem("aiPersonalizationData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        data.moodTransitions =
          data.moodTransitions?.map((transition: any) => ({
            ...transition,
            timestamp: new Date(transition.timestamp),
          })) || [];
        setUserBehavior(data);

        // Determine personalization level based on data richness
        const totalInteractions = Object.values(
          data.moodSelections || {},
        ).reduce((a: number, b: number) => a + b, 0);
        if (totalInteractions > 100) setPersonalizationLevel("advanced");
        else if (totalInteractions > 30)
          setPersonalizationLevel("intermediate");

        console.log("📊 Loaded personalization data:", data);
      } catch (error) {
        console.error("Error loading personalization data:", error);
      }
    }
  }, []);

  // Save user behavior data
  const saveBehaviorData = useCallback((newData: Partial<UserBehavior>) => {
    setUserBehavior((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem("aiPersonalizationData", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Track mood selection
  const trackMoodSelection = useCallback(
    (mood: string) => {
      const hour = new Date().getHours().toString();
      const day = new Date().toLocaleDateString("en-US", { weekday: "long" });

      saveBehaviorData({
        moodSelections: {
          ...userBehavior.moodSelections,
          [mood]: (userBehavior.moodSelections[mood] || 0) + 1,
        },
        timeOfDayPreferences: {
          ...userBehavior.timeOfDayPreferences,
          [hour]: mood,
        },
        dailyPatterns: {
          ...userBehavior.dailyPatterns,
          [day]: [...(userBehavior.dailyPatterns[day] || []), mood],
        },
      });

      // Track mood transitions
      if (lastMoodRef.current !== mood) {
        const transition = {
          from: lastMoodRef.current,
          to: mood,
          timestamp: new Date(),
        };

        saveBehaviorData({
          moodTransitions: [...userBehavior.moodTransitions, transition],
        });

        lastMoodRef.current = mood;
      }

      console.log(`🎯 Tracked mood selection: ${mood} at ${hour}:00`);
    },
    [userBehavior, saveBehaviorData],
  );

  // Track song interaction
  const trackSongInteraction = useCallback(
    (
      songId: string,
      interactionType: "play" | "skip" | "favorite" | "complete",
    ) => {
      const weight = {
        play: 1,
        skip: -0.5,
        favorite: 3,
        complete: 2,
      }[interactionType];

      saveBehaviorData({
        songInteractions: {
          ...userBehavior.songInteractions,
          [songId]: (userBehavior.songInteractions[songId] || 0) + weight,
        },
      });

      console.log(
        `🎵 Tracked song interaction: ${songId} (${interactionType})`,
      );
    },
    [userBehavior.songInteractions, saveBehaviorData],
  );

  // Track feature usage
  const trackFeatureUsage = useCallback(
    (feature: string) => {
      saveBehaviorData({
        featureUsage: {
          ...userBehavior.featureUsage,
          [feature]: (userBehavior.featureUsage[feature] || 0) + 1,
        },
      });
    },
    [userBehavior.featureUsage, saveBehaviorData],
  );

  // Track session duration
  const trackSessionEnd = useCallback(() => {
    const sessionDuration = Date.now() - sessionStartRef.current.getTime();
    const durationMinutes = Math.floor(sessionDuration / (1000 * 60));

    if (durationMinutes > 0) {
      saveBehaviorData({
        sessionDurations: {
          ...userBehavior.sessionDurations,
          [currentMood]: [
            ...(userBehavior.sessionDurations[currentMood] || []),
            durationMinutes,
          ],
        },
      });
    }
  }, [currentMood, userBehavior.sessionDurations, saveBehaviorData]);

  // Analyze patterns and generate insights
  const analyzeUserPatterns = useCallback(async () => {
    setIsAnalyzing(true);
    setLearningProgress(0);

    console.log("🧠 Starting AI pattern analysis...");

    // Simulate analysis steps
    const analysisSteps = [
      "Analyzing mood preferences...",
      "Detecting time patterns...",
      "Evaluating music taste...",
      "Identifying behavior trends...",
      "Generating insights...",
      "Creating recommendations...",
    ];

    for (let i = 0; i < analysisSteps.length; i++) {
      console.log(`📊 ${analysisSteps[i]}`);
      setLearningProgress(((i + 1) / analysisSteps.length) * 100);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    const newInsights: PersonalizationInsight[] = [];
    const newRecommendations: PersonalizedRecommendation[] = [];

    // Analyze mood patterns
    const totalMoodSelections = Object.values(
      userBehavior.moodSelections,
    ).reduce((a, b) => a + b, 0);
    if (totalMoodSelections > 10) {
      const favoriteModeDrive = Object.entries(
        userBehavior.moodSelections,
      ).sort(([, a], [, b]) => b - a)[0];

      if (favoriteModeDrive) {
        const [favoriteMood, count] = favoriteModeDrive;
        const percentage = Math.round((count / totalMoodSelections) * 100);

        newInsights.push({
          id: `mood_pattern_${Date.now()}`,
          type: "behavior_insight",
          title: `Your Favorite Mood: ${favoriteMood}`,
          description: `You choose ${favoriteMood} mood ${percentage}% of the time. This suggests you're naturally drawn to ${favoriteMood} experiences.`,
          confidence: Math.min((percentage / 100) * 2, 1),
          actionable: true,
          data: { mood: favoriteMood, percentage },
          timestamp: new Date(),
        });
      }
    }

    // Analyze time patterns
    const currentHour = new Date().getHours();
    const timePreference =
      userBehavior.timeOfDayPreferences[currentHour.toString()];
    if (timePreference && timePreference !== currentMood) {
      newRecommendations.push({
        id: `time_rec_${Date.now()}`,
        type: "mood",
        title: `Switch to ${timePreference} mood?`,
        description: `Based on your patterns, you usually prefer ${timePreference} mood around this time`,
        confidence: 0.7,
        reason: `Historical data shows ${timePreference} preference at ${currentHour}:00`,
        action: () =>
          onMoodSuggestion(timePreference, "Time-based recommendation"),
      });
    }

    // Analyze mood transitions
    if (userBehavior.moodTransitions.length > 5) {
      const transitionPatterns: { [key: string]: number } = {};
      userBehavior.moodTransitions.forEach((transition) => {
        const key = `${transition.from}->${transition.to}`;
        transitionPatterns[key] = (transitionPatterns[key] || 0) + 1;
      });

      const mostCommonTransition = Object.entries(transitionPatterns).sort(
        ([, a], [, b]) => b - a,
      )[0];

      if (mostCommonTransition) {
        const [transition, count] = mostCommonTransition;
        const [fromMood, toMood] = transition.split("->");

        if (currentMood === fromMood && count > 2) {
          newRecommendations.push({
            id: `transition_rec_${Date.now()}`,
            type: "mood",
            title: `Ready for ${toMood} mood?`,
            description: `You often transition from ${fromMood} to ${toMood}`,
            confidence: 0.6,
            reason: `Detected pattern: ${transition} (${count} times)`,
            action: () =>
              onMoodSuggestion(toMood, "Transition pattern recommendation"),
          });
        }
      }
    }

    // Analyze session durations
    Object.entries(userBehavior.sessionDurations).forEach(
      ([mood, durations]) => {
        if (durations.length > 3) {
          const avgDuration =
            durations.reduce((a, b) => a + b, 0) / durations.length;

          newInsights.push({
            id: `session_${mood}_${Date.now()}`,
            type: "time_pattern",
            title: `${mood} Sessions: ${Math.round(avgDuration)} min average`,
            description: `You typically spend ${Math.round(avgDuration)} minutes in ${mood} mode`,
            confidence: Math.min(durations.length / 10, 1),
            actionable: false,
            data: { mood, avgDuration, sessions: durations.length },
            timestamp: new Date(),
          });
        }
      },
    );

    // Feature usage insights
    const mostUsedFeature = Object.entries(userBehavior.featureUsage).sort(
      ([, a], [, b]) => b - a,
    )[0];

    if (mostUsedFeature) {
      const [feature, usage] = mostUsedFeature;
      newInsights.push({
        id: `feature_${feature}_${Date.now()}`,
        type: "behavior_insight",
        title: `Favorite Feature: ${feature}`,
        description: `You've used ${feature} ${usage} times. You're really getting the most out of this feature!`,
        confidence: Math.min(usage / 20, 1),
        actionable: false,
        data: { feature, usage },
        timestamp: new Date(),
      });
    }

    // Daily pattern recommendations
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todayPatterns = userBehavior.dailyPatterns[today];
    if (todayPatterns && todayPatterns.length > 2) {
      const moodCounts: { [mood: string]: number } = {};
      todayPatterns.forEach((mood) => {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      });

      const preferredMoodForToday = Object.entries(moodCounts).sort(
        ([, a], [, b]) => b - a,
      )[0][0];

      if (preferredMoodForToday !== currentMood) {
        newRecommendations.push({
          id: `daily_rec_${Date.now()}`,
          type: "mood",
          title: `${today} vibes: ${preferredMoodForToday}`,
          description: `You usually prefer ${preferredMoodForToday} mood on ${today}s`,
          confidence: 0.5,
          reason: `${today} pattern analysis`,
          action: () =>
            onMoodSuggestion(preferredMoodForToday, `${today} preference`),
        });
      }
    }

    // Generate activity recommendations based on mood and time
    if (totalMoodSelections > 15) {
      const activities = {
        happy: [
          "Share your joy with friends",
          "Try a new creative project",
          "Listen to upbeat music",
        ],
        calm: [
          "Practice meditation",
          "Take a peaceful walk",
          "Listen to nature sounds",
        ],
        energetic: [
          "Do a quick workout",
          "Tackle a challenging task",
          "Listen to pump-up music",
        ],
        peaceful: [
          "Practice gratitude",
          "Read something inspiring",
          "Listen to zen music",
        ],
        creative: [
          "Start an art project",
          "Write in your journal",
          "Explore new music",
        ],
        focused: [
          "Work on important tasks",
          "Learn something new",
          "Listen to focus music",
        ],
      };

      const suggestedActivities =
        activities[currentMood as keyof typeof activities] || [];
      if (suggestedActivities.length > 0) {
        const randomActivity =
          suggestedActivities[
            Math.floor(Math.random() * suggestedActivities.length)
          ];

        newRecommendations.push({
          id: `activity_rec_${Date.now()}`,
          type: "activity",
          title: "Suggested Activity",
          description: randomActivity,
          confidence: 0.6,
          reason: `Perfect for your ${currentMood} mood`,
          action: () => console.log(`Activity suggested: ${randomActivity}`),
        });
      }
    }

    setInsights((prev) => [...newInsights, ...prev].slice(0, 10)); // Keep last 10 insights
    setRecommendations(newRecommendations);
    setIsAnalyzing(false);
    setLearningProgress(100);

    console.log(
      `✅ Generated ${newInsights.length} insights and ${newRecommendations.length} recommendations`,
    );
  }, [userBehavior, currentMood, onMoodSuggestion]);

  // Auto-analyze patterns periodically
  useEffect(() => {
    analysisIntervalRef.current = setInterval(() => {
      const totalInteractions = Object.values(
        userBehavior.moodSelections,
      ).reduce((a, b) => a + b, 0);
      if (totalInteractions > 5) {
        analyzeUserPatterns();
      }
    }, 300000); // Every 5 minutes

    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [analyzeUserPatterns, userBehavior]);

  // Track mood changes
  useEffect(() => {
    trackMoodSelection(currentMood);
  }, [currentMood, trackMoodSelection]);

  // Track session end on unmount
  useEffect(() => {
    return () => trackSessionEnd();
  }, [trackSessionEnd]);

  // Track current song
  useEffect(() => {
    if (currentSong) {
      trackSongInteraction(currentSong.id, "play");
    }
  }, [currentSong, trackSongInteraction]);

  // Get personalization level badge color
  const getLevelColor = () => {
    switch (personalizationLevel) {
      case "advanced":
        return "bg-purple-500 text-white";
      case "intermediate":
        return "bg-blue-500 text-white";
      default:
        return "bg-green-500 text-white";
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return "text-green-400";
    if (confidence > 0.6) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="space-y-6">
      {/* Personalization Status */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-lg md:text-xl flex items-center gap-2">
            <Brain className="h-5 w-5" />
            🤖 AI Personalization Engine
            <Badge className={getLevelColor()}>{personalizationLevel}</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Learning Progress */}
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-white text-sm">
                <span>Analyzing your patterns...</span>
                <span>{Math.round(learningProgress)}%</span>
              </div>
              <Progress value={learningProgress} className="bg-white/20" />
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-500/20 p-3 rounded-lg text-center">
              <div className="text-white font-bold text-lg">
                {Object.values(userBehavior.moodSelections).reduce(
                  (a, b) => a + b,
                  0,
                )}
              </div>
              <div className="text-blue-200 text-xs">Mood Selections</div>
            </div>

            <div className="bg-green-500/20 p-3 rounded-lg text-center">
              <div className="text-white font-bold text-lg">
                {Object.values(userBehavior.songInteractions).length}
              </div>
              <div className="text-green-200 text-xs">Songs Played</div>
            </div>

            <div className="bg-purple-500/20 p-3 rounded-lg text-center">
              <div className="text-white font-bold text-lg">
                {userBehavior.moodTransitions.length}
              </div>
              <div className="text-purple-200 text-xs">Transitions</div>
            </div>

            <div className="bg-orange-500/20 p-3 rounded-lg text-center">
              <div className="text-white font-bold text-lg">
                {insights.length}
              </div>
              <div className="text-orange-200 text-xs">Insights</div>
            </div>
          </div>

          <Button
            onClick={analyzeUserPatterns}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white w-full"
          >
            {isAnalyzing ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze My Patterns
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              🎯 Personalized Recommendations
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={rec.id} className="bg-white/20 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      {rec.type === "mood" && <Zap className="h-4 w-4" />}
                      {rec.type === "song" && <Music className="h-4 w-4" />}
                      {rec.type === "activity" && (
                        <Target className="h-4 w-4" />
                      )}
                      {rec.title}
                    </h4>
                    <p className="text-white/80 text-sm">{rec.description}</p>
                    <p className="text-white/60 text-xs mt-1">
                      Reason: {rec.reason}
                    </p>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}
                    >
                      {Math.round(rec.confidence * 100)}%
                    </div>
                    <Button
                      onClick={() => {
                        rec.action();
                        onRecommendation(rec);
                        // Remove recommendation after accepting
                        setRecommendations((prev) =>
                          prev.filter((r) => r.id !== rec.id),
                        );
                      }}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white mt-2"
                    >
                      Try It
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Behavioral Insights */}
      {insights.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              📊 Your Insights
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {insights.slice(0, 5).map((insight, index) => (
              <div key={insight.id} className="bg-white/20 p-3 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      {insight.type === "behavior_insight" && (
                        <User className="h-4 w-4" />
                      )}
                      {insight.type === "time_pattern" && (
                        <Clock className="h-4 w-4" />
                      )}
                      {insight.type === "mood_recommendation" && (
                        <Heart className="h-4 w-4" />
                      )}
                      {insight.title}
                    </h4>
                    <p className="text-white/80 text-sm">
                      {insight.description}
                    </p>
                  </div>

                  <div
                    className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}
                  >
                    {Math.round(insight.confidence * 100)}%
                  </div>
                </div>
              </div>
            ))}

            {insights.length > 5 && (
              <div className="text-center">
                <Badge className="bg-white/20 text-white">
                  +{insights.length - 5} more insights
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <div className="bg-green-500/20 p-3 rounded-lg border border-green-500/30">
        <p className="text-green-200 text-sm">
          🔒 <strong>Privacy:</strong> All your data is stored locally on your
          device. We analyze your patterns to provide better recommendations,
          but never share your information.
        </p>
      </div>
    </div>
  );
}

// Export behavior tracking utilities
export const usePersonalizationTracking = () => {
  const trackInteraction = useCallback((type: string, data: any) => {
    const existing = JSON.parse(
      localStorage.getItem("aiPersonalizationData") || "{}",
    );
    const updated = {
      ...existing,
      featureUsage: {
        ...existing.featureUsage,
        [type]: (existing.featureUsage?.[type] || 0) + 1,
      },
    };
    localStorage.setItem("aiPersonalizationData", JSON.stringify(updated));
  }, []);

  return { trackInteraction };
};
