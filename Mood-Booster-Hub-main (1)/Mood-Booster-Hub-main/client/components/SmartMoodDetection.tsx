import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  CameraOff,
  Brain,
  MessageSquare,
  Scan,
  Sparkles,
  Eye,
  Mic,
  MicOff,
  Loader2,
} from "lucide-react";

interface EmotionResult {
  emotion: string;
  confidence: number;
  mood: string;
}

interface SentimentResult {
  sentiment: string;
  confidence: number;
  mood: string;
}

interface SmartMoodDetectionProps {
  onMoodDetected: (
    mood: string,
    source: "emotion" | "sentiment" | "combined",
  ) => void;
  currentMood: string;
}

// Emotion to mood mapping
const emotionToMood = {
  happy: "happy",
  joy: "happy",
  excited: "energetic",
  energetic: "energetic",
  calm: "calm",
  peaceful: "peaceful",
  relaxed: "calm",
  focused: "focused",
  concentrated: "focused",
  creative: "creative",
  inspired: "creative",
  sad: "calm",
  stressed: "peaceful",
  angry: "energetic",
  surprised: "happy",
  neutral: "calm",
};

// Sentiment analysis keywords
const sentimentKeywords = {
  happy: [
    "happy",
    "joyful",
    "excited",
    "amazing",
    "wonderful",
    "great",
    "fantastic",
    "awesome",
    "love",
    "perfect",
    "brilliant",
    "excellent",
    "delighted",
    "thrilled",
    "cheerful",
    "glad",
    "pleased",
    "elated",
    "euphoric",
  ],
  energetic: [
    "energetic",
    "pumped",
    "motivated",
    "driven",
    "ambitious",
    "powerful",
    "strong",
    "intense",
    "active",
    "dynamic",
    "vigorous",
    "enthusiastic",
    "fired up",
    "charged",
    "ready",
    "go",
    "action",
    "workout",
    "exercise",
  ],
  calm: [
    "calm",
    "relaxed",
    "peaceful",
    "tranquil",
    "serene",
    "quiet",
    "still",
    "gentle",
    "soft",
    "comfortable",
    "restful",
    "soothing",
    "mellow",
    "laid back",
    "chill",
    "easy",
    "smooth",
    "balanced",
  ],
  peaceful: [
    "peaceful",
    "zen",
    "meditative",
    "spiritual",
    "mindful",
    "centered",
    "balanced",
    "harmonious",
    "pure",
    "enlightened",
    "wise",
    "deep",
    "reflective",
    "contemplative",
    "sacred",
    "divine",
    "inner peace",
  ],
  creative: [
    "creative",
    "artistic",
    "imaginative",
    "innovative",
    "inspired",
    "original",
    "unique",
    "design",
    "art",
    "paint",
    "draw",
    "write",
    "create",
    "invent",
    "express",
    "vision",
    "ideas",
    "brainstorm",
  ],
  focused: [
    "focused",
    "concentrated",
    "productive",
    "work",
    "study",
    "learn",
    "think",
    "analyze",
    "solve",
    "goal",
    "target",
    "objective",
    "task",
    "project",
    "deadline",
    "efficient",
    "organized",
    "determined",
  ],
};

export default function SmartMoodDetection({
  onMoodDetected,
  currentMood,
}: SmartMoodDetectionProps) {
  // Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(
    null,
  );

  // Text states
  const [textInput, setTextInput] = useState("");
  const [sentimentResult, setSentimentResult] =
    useState<SentimentResult | null>(null);
  const [isAnalyzingText, setIsAnalyzingText] = useState(false);

  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
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
        setSpeechResult(transcript);
        setTextInput(transcript);
        analyzeSentiment(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Camera access denied. Please allow camera permissions for emotion detection.",
      );
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setEmotionResult(null);
  }, []);

  // Simulate emotion detection (in real app, you'd use ML models like face-api.js or TensorFlow.js)
  const detectEmotion = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate emotion detection results
    const emotions = [
      "happy",
      "calm",
      "energetic",
      "focused",
      "creative",
      "peaceful",
    ];
    const detectedEmotion =
      emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = 0.7 + Math.random() * 0.3; // 70-100% confidence

    const result: EmotionResult = {
      emotion: detectedEmotion,
      confidence,
      mood:
        emotionToMood[detectedEmotion as keyof typeof emotionToMood] || "happy",
    };

    setEmotionResult(result);
    setIsAnalyzing(false);

    // Auto-suggest mood change if confidence is high
    if (confidence > 0.8) {
      onMoodDetected(result.mood, "emotion");
    }
  }, [onMoodDetected]);

  // Analyze sentiment from text
  const analyzeSentiment = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setIsAnalyzingText(true);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const lowercaseText = text.toLowerCase();
      const words = lowercaseText.split(/\s+/);

      // Calculate mood scores
      const scores = {
        happy: 0,
        energetic: 0,
        calm: 0,
        peaceful: 0,
        creative: 0,
        focused: 0,
      };

      // Score based on keywords
      Object.entries(sentimentKeywords).forEach(([mood, keywords]) => {
        keywords.forEach((keyword) => {
          if (lowercaseText.includes(keyword)) {
            scores[mood as keyof typeof scores] += 1;
          }
        });
      });

      // Find dominant mood
      const dominantMood = Object.entries(scores).reduce((a, b) =>
        scores[a[0] as keyof typeof scores] >
        scores[b[0] as keyof typeof scores]
          ? a
          : b,
      )[0];

      const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
      const confidence =
        totalScore > 0
          ? scores[dominantMood as keyof typeof scores] / totalScore
          : 0.5;

      const result: SentimentResult = {
        sentiment: dominantMood,
        confidence: Math.min(confidence + 0.3, 1), // Boost confidence
        mood: dominantMood,
      };

      setSentimentResult(result);
      setIsAnalyzingText(false);

      // Auto-suggest mood change if confidence is high
      if (result.confidence > 0.6) {
        onMoodDetected(result.mood, "sentiment");
      }
    },
    [onMoodDetected],
  );

  // Start voice recognition
  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  }, []);

  // Stop voice recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white text-lg md:text-xl flex items-center gap-2">
          <Brain className="h-5 w-5" />
          🧠 Smart Mood Detection
          <Badge className="bg-purple-500 text-white">AI Powered</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emotion Detection via Camera */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Facial Emotion Detection
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              {isCameraActive ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-48 bg-black rounded-lg object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ display: "none" }}
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p>Analyzing facial expressions...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p>Camera not active</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {!isCameraActive ? (
                <Button
                  onClick={startCamera}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={detectEmotion}
                    disabled={isAnalyzing}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Scan className="h-4 w-4 mr-2" />
                        Analyze Emotion
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="bg-red-500 hover:bg-red-600 text-white border-red-500 w-full"
                  >
                    <CameraOff className="h-4 w-4 mr-2" />
                    Stop Camera
                  </Button>
                </div>
              )}

              {emotionResult && (
                <div className="bg-white/20 p-3 rounded-lg">
                  <p className="text-white font-semibold">
                    Detected: {emotionResult.emotion}
                  </p>
                  <p className="text-white/80 text-sm">
                    Confidence: {(emotionResult.confidence * 100).toFixed(1)}%
                  </p>
                  <p className="text-white/80 text-sm">
                    Suggested Mood: {emotionResult.mood}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Text Sentiment Analysis */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Text Sentiment Analysis
          </h3>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Textarea
                placeholder="Tell me how you're feeling... (e.g., 'I'm feeling really motivated and ready to work!', 'I need some peace and relaxation')"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 min-h-[80px]"
              />

              <div className="flex flex-col gap-2">
                {!isListening ? (
                  <Button
                    onClick={startListening}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                    title="Voice input"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={stopListening}
                    className="bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    title="Stop listening"
                  >
                    <MicOff className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {isListening && (
              <div className="bg-purple-500/20 p-2 rounded text-white text-center animate-pulse">
                🎤 Listening... Speak now!
              </div>
            )}

            {speechResult && (
              <div className="bg-blue-500/20 p-2 rounded text-white text-sm">
                Voice Input: "{speechResult}"
              </div>
            )}

            <Button
              onClick={() => analyzeSentiment(textInput)}
              disabled={isAnalyzingText || !textInput.trim()}
              className="bg-purple-500 hover:bg-purple-600 text-white w-full"
            >
              {isAnalyzingText ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Sentiment...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Sentiment
                </>
              )}
            </Button>

            {sentimentResult && (
              <div className="bg-white/20 p-3 rounded-lg">
                <p className="text-white font-semibold">
                  Sentiment: {sentimentResult.sentiment}
                </p>
                <p className="text-white/80 text-sm">
                  Confidence: {(sentimentResult.confidence * 100).toFixed(1)}%
                </p>
                <p className="text-white/80 text-sm">
                  Suggested Mood: {sentimentResult.mood}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Combined Results */}
        {(emotionResult || sentimentResult) && (
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4 rounded-lg border border-white/30">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Mood Recommendation
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emotionResult && (
                <div className="text-center">
                  <div className="text-3xl mb-1">📸</div>
                  <p className="text-white text-sm">
                    Facial: {emotionResult.mood}
                  </p>
                  <p className="text-white/60 text-xs">
                    {(emotionResult.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              )}

              {sentimentResult && (
                <div className="text-center">
                  <div className="text-3xl mb-1">💬</div>
                  <p className="text-white text-sm">
                    Text: {sentimentResult.mood}
                  </p>
                  <p className="text-white/60 text-xs">
                    {(sentimentResult.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={() => {
                const recommendedMood =
                  emotionResult?.mood || sentimentResult?.mood;
                if (recommendedMood) {
                  onMoodDetected(recommendedMood, "combined");
                }
              }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white w-full mt-3"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Apply AI Recommendation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
