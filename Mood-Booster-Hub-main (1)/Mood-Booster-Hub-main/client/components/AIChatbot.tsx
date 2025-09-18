import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  Heart,
  Music,
  BookOpen,
  Gamepad2,
  Coffee,
  Zap,
  Wind,
  Smile,
  Target,
  Lightbulb,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  mood?: string;
  actions?: ChatAction[];
}

interface ChatAction {
  type:
    | "play_music"
    | "show_quote"
    | "start_meditation"
    | "suggest_activity"
    | "mood_change";
  label: string;
  data: any;
}

interface AIChatbotProps {
  currentMood: string;
  onMoodSuggestion: (mood: string) => void;
  onActionSuggestion: (action: ChatAction) => void;
}

const moodKeywords = {
  happy: [
    "happy",
    "joyful",
    "excited",
    "great",
    "amazing",
    "wonderful",
    "fantastic",
    "cheerful",
    "upbeat",
    "positive",
  ],
  sad: [
    "sad",
    "down",
    "depressed",
    "upset",
    "unhappy",
    "blue",
    "melancholy",
    "disappointed",
    "heartbroken",
  ],
  stressed: [
    "stressed",
    "anxious",
    "worried",
    "overwhelmed",
    "pressure",
    "tense",
    "nervous",
    "frantic",
    "panic",
  ],
  calm: [
    "calm",
    "peaceful",
    "relaxed",
    "serene",
    "tranquil",
    "quiet",
    "still",
    "zen",
    "composed",
  ],
  energetic: [
    "energetic",
    "pumped",
    "motivated",
    "active",
    "dynamic",
    "powerful",
    "strong",
    "vigorous",
    "intense",
  ],
  tired: [
    "tired",
    "exhausted",
    "sleepy",
    "weary",
    "drained",
    "fatigued",
    "worn out",
    "lethargic",
  ],
  creative: [
    "creative",
    "artistic",
    "inspired",
    "imaginative",
    "innovative",
    "expressive",
    "inventive",
  ],
  focused: [
    "focused",
    "concentrated",
    "productive",
    "determined",
    "goal-oriented",
    "driven",
    "dedicated",
  ],
};

const botResponses = {
  greeting: [
    "Hey there! I'm your AI mood companion. How are you feeling today? 😊",
    "Hello! I'm here to help boost your mood and suggest activities. What's on your mind? 🌟",
    "Hi! I'm your personal wellness assistant. Tell me how you're doing! 💙",
  ],

  happy: [
    "That's wonderful! Your positive energy is contagious! ✨ Let's keep this vibe going with some upbeat music!",
    "I love your enthusiasm! 🎉 How about we celebrate with some feel-good songs or fun activities?",
    "Amazing energy! 🌞 Let's amplify those good vibes with the perfect playlist!",
  ],

  sad: [
    "I'm sorry you're feeling down. It's okay to feel this way sometimes. 💙 Would you like some gentle music or a comforting quote?",
    "Sending you virtual hugs! 🤗 Sometimes a good song or meditation can help. What sounds good to you?",
    "I hear you. Let's take it one step at a time. Would some calming music or inspirational words help right now?",
  ],

  stressed: [
    "Take a deep breath with me... 🫁 Stress is tough, but we can work through this together. Want to try some relaxation techniques?",
    "I understand you're feeling overwhelmed. Let's find something to help you unwind - maybe some meditation or peaceful music?",
    "Stress happens to everyone. You're not alone! 💚 How about we start with some calming activities?",
  ],

  energetic: [
    "I can feel your energy! ⚡ Let's channel that power into something amazing! Want some high-energy music or fun challenges?",
    "Your enthusiasm is awesome! 🔥 Perfect time for some upbeat activities or motivational content!",
    "Love the energy! 💪 Let's keep that momentum going with exciting music and activities!",
  ],

  tired: [
    "Sounds like you need some rest and rejuvenation. 😴 How about some gentle music or a short meditation to recharge?",
    "Being tired is your body's way of asking for care. 💙 Let's find something soothing to help you feel better.",
    "Rest is important! Let me suggest some relaxing activities to help you recharge your batteries. ⚡",
  ],

  creative: [
    "I love your creative spirit! 🎨 Let's fuel that inspiration with some artistic music or creative challenges!",
    "Creativity is flowing! ✨ Perfect time to explore some inspiring content or artistic activities!",
    "Your creative energy is beautiful! 🌈 Let's find the perfect soundtrack for your artistic journey!",
  ],

  confused: [
    "I'm not quite sure what you mean, but I'm here to help! 🤔 Could you tell me more about how you're feeling?",
    "Help me understand better - are you feeling happy, sad, stressed, or something else? I want to give you the best suggestions! 💭",
    "Let's figure this out together! Can you describe your current mood in a few words? 🌟",
  ],
};

const suggestions = {
  music: [
    "Play uplifting music",
    "Suggest calm melodies",
    "Find workout beats",
    "Discover new artists",
  ],
  meditation: [
    "Start 5-min breathing",
    "Try mindfulness session",
    "Listen to nature sounds",
    "Guided body scan",
  ],
  activities: [
    "Take a walk outside",
    "Call a friend",
    "Write in journal",
    "Do some stretching",
  ],
  inspiration: [
    "Show daily quote",
    "Share success story",
    "Find motivation video",
    "Read affirmations",
  ],
};

export default function AIChatbot({
  currentMood,
  onMoodSuggestion,
  onActionSuggestion,
}: AIChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatPersonality, setChatPersonality] = useState<
    "supportive" | "energetic" | "calm"
  >("supportive");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Speech Recognition
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
        setInputText(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Speech Synthesis
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initial greeting - only if no saved messages
    const saved = localStorage.getItem("aiChatHistory");
    if (!saved || JSON.parse(saved).length === 0) {
      setTimeout(() => {
        addBotMessage(getRandomResponse(botResponses.greeting), "greeting");
      }, 100);
    }
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history
  useEffect(() => {
    const saved = localStorage.getItem("aiChatHistory");
    if (saved) {
      const history = JSON.parse(saved);
      if (history.length > 0) {
        // Convert timestamp strings back to Date objects
        const messagesWithDates = history.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      }
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        "aiChatHistory",
        JSON.stringify(messages.slice(-50)),
      ); // Keep last 50 messages
    }
  }, [messages]);

  // Get random response
  const getRandomResponse = (responses: string[]) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Analyze mood from text
  const analyzeMood = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    let moodScores: { [key: string]: number } = {};

    Object.entries(moodKeywords).forEach(([mood, keywords]) => {
      moodScores[mood] = 0;
      keywords.forEach((keyword) => {
        if (lowerText.includes(keyword)) {
          moodScores[mood] += 1;
        }
      });
    });

    const detectedMood = Object.entries(moodScores).reduce((a, b) =>
      moodScores[a[0]] > moodScores[b[0]] ? a : b,
    )[0];

    return moodScores[detectedMood] > 0 ? detectedMood : null;
  }, []);

  // Generate bot response
  const generateBotResponse = useCallback(
    (userMessage: string, detectedMood: string | null) => {
      let response = "";
      let actions: ChatAction[] = [];
      let moodSuggestions: string[] = [];

      if (
        detectedMood &&
        botResponses[detectedMood as keyof typeof botResponses]
      ) {
        response = getRandomResponse(
          botResponses[detectedMood as keyof typeof botResponses],
        );

        // Add specific actions based on detected mood
        switch (detectedMood) {
          case "happy":
            actions.push(
              {
                type: "play_music",
                label: "🎵 Play Happy Music",
                data: { mood: "happy" },
              },
              {
                type: "suggest_activity",
                label: "🎉 Fun Activities",
                data: { activities: ["dance", "party games"] },
              },
            );
            break;

          case "sad":
            actions.push(
              {
                type: "play_music",
                label: "🎵 Gentle Music",
                data: { mood: "calm" },
              },
              {
                type: "show_quote",
                label: "💝 Comforting Quote",
                data: { type: "inspiration" },
              },
              {
                type: "start_meditation",
                label: "🧘 Healing Meditation",
                data: { type: "healing" },
              },
            );
            break;

          case "stressed":
            actions.push(
              {
                type: "start_meditation",
                label: "🫁 Breathing Exercise",
                data: { type: "breathing" },
              },
              {
                type: "play_music",
                label: "🎵 Calming Sounds",
                data: { mood: "peaceful" },
              },
              {
                type: "suggest_activity",
                label: "🚶 Stress Relief",
                data: { activities: ["walk", "stretch"] },
              },
            );
            break;

          case "energetic":
            actions.push(
              {
                type: "play_music",
                label: "⚡ High Energy Music",
                data: { mood: "energetic" },
              },
              {
                type: "suggest_activity",
                label: "💪 Workout Ideas",
                data: { activities: ["exercise", "sports"] },
              },
            );
            break;

          case "tired":
            actions.push(
              {
                type: "start_meditation",
                label: "😴 Rest Meditation",
                data: { type: "sleep" },
              },
              {
                type: "play_music",
                label: "🎵 Relaxing Music",
                data: { mood: "calm" },
              },
            );
            break;
        }

        // Suggest mood change if detected mood differs from current
        if (detectedMood !== currentMood) {
          moodSuggestions.push(`Switch to ${detectedMood} mode`);
        }
      } else {
        response = getRandomResponse(botResponses.confused);

        // General suggestions
        actions.push(
          {
            type: "play_music",
            label: "🎵 Mood Music",
            data: { mood: currentMood },
          },
          {
            type: "show_quote",
            label: "✨ Daily Quote",
            data: { type: "daily" },
          },
          {
            type: "start_meditation",
            label: "🧘 Quick Meditation",
            data: { type: "general" },
          },
        );
      }

      return {
        response,
        actions,
        mood: detectedMood,
        suggestions: moodSuggestions,
      };
    },
    [currentMood],
  );

  // Add message to chat
  const addMessage = (
    type: "user" | "bot",
    content: string,
    extras?: Partial<ChatMessage>,
  ) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date(),
      ...extras,
    };

    // Ensure timestamp is always a Date object
    if (!(newMessage.timestamp instanceof Date)) {
      newMessage.timestamp = new Date();
    }

    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  // Add bot message with typing animation
  const addBotMessage = async (
    content: string,
    mood?: string,
    extras?: Partial<ChatMessage>,
  ) => {
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000),
    );

    setIsTyping(false);
    const message = addMessage("bot", content, { mood, ...extras });

    // Text-to-speech for bot responses
    if (synthRef.current && !isSpeaking) {
      speakText(content);
    }

    return message;
  };

  // Handle sending message
  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    addMessage("user", messageText);
    setInputText("");

    // Analyze mood and generate response
    const detectedMood = analyzeMood(messageText);
    const { response, actions, mood, suggestions } = generateBotResponse(
      messageText,
      detectedMood,
    );

    // Add bot response
    await addBotMessage(response, mood, {
      actions,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    });

    // Auto-suggest mood change if detected
    if (detectedMood && detectedMood !== currentMood) {
      setTimeout(() => {
        onMoodSuggestion(detectedMood);
      }, 2000);
    }

    console.log(
      `🤖 Bot analyzed mood: ${detectedMood || "unclear"} | Current: ${currentMood}`,
    );
  };

  // Voice input
  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert("Voice input not supported in this browser.");
    }
  };

  // Text-to-speech
  const speakText = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Handle action click
  const handleActionClick = (action: ChatAction) => {
    console.log("🎯 Bot action triggered:", action.type);
    onActionSuggestion(action);

    // Add confirmation message
    addBotMessage(
      `Great choice! I've ${action.label.toLowerCase()} for you! 🌟`,
    );
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("aiChatHistory");
    setTimeout(() => {
      addBotMessage(getRandomResponse(botResponses.greeting), "greeting");
    }, 100);
  };

  // Get personality color
  const getPersonalityColor = () => {
    switch (chatPersonality) {
      case "energetic":
        return "from-orange-500 to-red-500";
      case "calm":
        return "from-blue-500 to-green-500";
      default:
        return "from-purple-500 to-pink-500";
    }
  };

  // Safe timestamp formatting
  const formatTimestamp = (timestamp: Date | string) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return date.toLocaleTimeString();
    } catch (error) {
      return new Date().toLocaleTimeString();
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg md:text-xl flex items-center gap-2">
          <Bot className="h-5 w-5" />
          🤖 AI Mood Companion
          <Badge
            className={`bg-gradient-to-r ${getPersonalityColor()} text-white`}
          >
            {chatPersonality}
          </Badge>
        </CardTitle>

        <div className="flex gap-2 items-center">
          <div className="flex gap-1">
            {(["supportive", "energetic", "calm"] as const).map(
              (personality) => (
                <Button
                  key={personality}
                  onClick={() => setChatPersonality(personality)}
                  size="sm"
                  variant={
                    chatPersonality === personality ? "default" : "outline"
                  }
                  className={`text-xs ${
                    chatPersonality === personality
                      ? "bg-white text-black"
                      : "bg-white/10 text-white border-white/30"
                  }`}
                >
                  {personality}
                </Button>
              ),
            )}
          </div>

          <Button
            onClick={clearChat}
            size="sm"
            variant="outline"
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 ml-auto"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 pr-3">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "bot" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>

                  {/* Bot actions */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 mt-3">
                      {message.actions.map((action, index) => (
                        <Button
                          key={index}
                          onClick={() => handleActionClick(action)}
                          size="sm"
                          className="bg-white/20 text-white hover:bg-white/30 justify-start text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Mood suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 p-2 bg-yellow-500/20 rounded text-yellow-200 text-xs">
                      💡 Suggestion: {message.suggestions[0]}
                    </div>
                  )}

                  <div className="text-xs opacity-60 mt-2">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>

                {message.type === "user" && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white/20 text-white p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input Area */}
        <div className="space-y-3">
          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2">
            {[
              "I feel stressed",
              "I need motivation",
              "I'm happy today",
              "Help me relax",
            ].map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => handleSendMessage(suggestion)}
                size="sm"
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>

          {/* Input controls */}
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isTyping && handleSendMessage()
              }
              placeholder="Tell me how you're feeling..."
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              disabled={isTyping}
            />

            <Button
              onClick={startListening}
              disabled={isListening || isTyping}
              className={`${isListening ? "bg-red-500 animate-pulse" : "bg-purple-500 hover:bg-purple-600"} text-white`}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            <Button
              onClick={isSpeaking ? stopSpeaking : undefined}
              disabled={!isSpeaking}
              className={`${isSpeaking ? "bg-red-500" : "bg-gray-500"} text-white`}
            >
              {isSpeaking ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
