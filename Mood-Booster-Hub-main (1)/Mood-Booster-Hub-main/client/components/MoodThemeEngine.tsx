import { useEffect, useCallback } from "react";

interface MoodTheme {
  id: string;
  name: string;
  primaryGradient: string;
  secondaryGradient: string;
  accentGradient: string;
  particleColors: string[];
  animations: string[];
  shadows: string[];
  filters: string[];
  customProperties: { [key: string]: string };
}

interface MoodThemeEngineProps {
  currentMood: string;
  isDarkMode: boolean;
  children: React.ReactNode;
}

const moodThemes: { [key: string]: MoodTheme } = {
  happy: {
    id: "happy",
    name: "Sunshine Joy",
    primaryGradient:
      "linear-gradient(135deg, #FFD700 0%, #FF6B6B 50%, #4ECDC4 100%)",
    secondaryGradient: "linear-gradient(45deg, #FFA726 0%, #FF7043 100%)",
    accentGradient: "linear-gradient(90deg, #FFEB3B 0%, #FF9800 100%)",
    particleColors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#FFA726", "#FFEB3B"],
    animations: ["bounce", "pulse", "float", "glow"],
    shadows: [
      "0 10px 30px rgba(255, 215, 0, 0.3)",
      "0 20px 40px rgba(255, 107, 107, 0.2)",
      "0 15px 35px rgba(78, 205, 196, 0.25)",
    ],
    filters: ["brightness(1.1)", "saturate(1.2)", "contrast(1.05)"],
    customProperties: {
      "--mood-primary": "#FFD700",
      "--mood-secondary": "#FF6B6B",
      "--mood-accent": "#4ECDC4",
      "--mood-glow": "0 0 20px rgba(255, 215, 0, 0.5)",
      "--mood-pulse": "pulse-happy 2s ease-in-out infinite",
    },
  },

  calm: {
    id: "calm",
    name: "Ocean Serenity",
    primaryGradient:
      "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
    secondaryGradient: "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
    accentGradient: "linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)",
    particleColors: ["#667eea", "#764ba2", "#4facfe", "#00f2fe", "#a8edea"],
    animations: ["gentle-sway", "soft-pulse", "drift", "ripple"],
    shadows: [
      "0 15px 40px rgba(102, 126, 234, 0.2)",
      "0 25px 50px rgba(118, 75, 162, 0.15)",
      "0 20px 45px rgba(79, 172, 254, 0.18)",
    ],
    filters: ["brightness(0.95)", "saturate(0.9)", "blur(0.5px)"],
    customProperties: {
      "--mood-primary": "#667eea",
      "--mood-secondary": "#764ba2",
      "--mood-accent": "#4facfe",
      "--mood-glow": "0 0 25px rgba(102, 126, 234, 0.4)",
      "--mood-pulse": "pulse-calm 4s ease-in-out infinite",
    },
  },

  energetic: {
    id: "energetic",
    name: "Electric Power",
    primaryGradient:
      "linear-gradient(135deg, #ff416c 0%, #ff4b2b 50%, #ff9a9e 100%)",
    secondaryGradient: "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
    accentGradient: "linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%)",
    particleColors: ["#ff416c", "#ff4b2b", "#ff9a9e", "#f093fb", "#f5576c"],
    animations: ["electric-pulse", "shake", "zoom", "lightning"],
    shadows: [
      "0 10px 30px rgba(255, 65, 108, 0.4)",
      "0 20px 40px rgba(255, 75, 43, 0.3)",
      "0 15px 35px rgba(255, 154, 158, 0.25)",
    ],
    filters: ["brightness(1.15)", "saturate(1.3)", "contrast(1.1)"],
    customProperties: {
      "--mood-primary": "#ff416c",
      "--mood-secondary": "#ff4b2b",
      "--mood-accent": "#ff9a9e",
      "--mood-glow": "0 0 30px rgba(255, 65, 108, 0.6)",
      "--mood-pulse": "pulse-energetic 1.5s ease-in-out infinite",
    },
  },

  peaceful: {
    id: "peaceful",
    name: "Zen Garden",
    primaryGradient:
      "linear-gradient(135deg, #a8e6cf 0%, #dcedc1 50%, #ffd3a5 100%)",
    secondaryGradient: "linear-gradient(45deg, #c1dfc4 0%, #deecdd 100%)",
    accentGradient: "linear-gradient(90deg, #eef2f3 0%, #8e9eab 100%)",
    particleColors: ["#a8e6cf", "#dcedc1", "#ffd3a5", "#c1dfc4", "#deecdd"],
    animations: ["zen-float", "meditation-pulse", "gentle-rotate", "harmony"],
    shadows: [
      "0 20px 50px rgba(168, 230, 207, 0.2)",
      "0 30px 60px rgba(220, 237, 193, 0.15)",
      "0 25px 55px rgba(255, 211, 165, 0.18)",
    ],
    filters: ["brightness(0.98)", "saturate(0.85)", "sepia(0.1)"],
    customProperties: {
      "--mood-primary": "#a8e6cf",
      "--mood-secondary": "#dcedc1",
      "--mood-accent": "#ffd3a5",
      "--mood-glow": "0 0 35px rgba(168, 230, 207, 0.3)",
      "--mood-pulse": "pulse-peaceful 6s ease-in-out infinite",
    },
  },

  creative: {
    id: "creative",
    name: "Artistic Vision",
    primaryGradient:
      "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
    secondaryGradient:
      "linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
    accentGradient:
      "linear-gradient(90deg, #a8edea 0%, #fed6e3 50%, #ffecd2 100%)",
    particleColors: ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"],
    animations: [
      "creative-swirl",
      "rainbow-pulse",
      "artistic-float",
      "inspiration",
    ],
    shadows: [
      "0 15px 40px rgba(102, 126, 234, 0.25)",
      "0 25px 50px rgba(240, 147, 251, 0.2)",
      "0 20px 45px rgba(245, 87, 108, 0.22)",
    ],
    filters: ["brightness(1.05)", "saturate(1.15)", "hue-rotate(5deg)"],
    customProperties: {
      "--mood-primary": "#667eea",
      "--mood-secondary": "#f093fb",
      "--mood-accent": "#f5576c",
      "--mood-glow": "0 0 25px rgba(240, 147, 251, 0.5)",
      "--mood-pulse": "pulse-creative 3s ease-in-out infinite",
    },
  },

  focused: {
    id: "focused",
    name: "Deep Focus",
    primaryGradient:
      "linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #95a5a6 100%)",
    secondaryGradient: "linear-gradient(45deg, #34495e 0%, #2c3e50 100%)",
    accentGradient: "linear-gradient(90deg, #95a5a6 0%, #7f8c8d 100%)",
    particleColors: ["#2c3e50", "#34495e", "#95a5a6", "#7f8c8d", "#ecf0f1"],
    animations: ["focus-beam", "steady-pulse", "linear-flow", "concentrate"],
    shadows: [
      "0 12px 35px rgba(44, 62, 80, 0.3)",
      "0 22px 45px rgba(52, 73, 94, 0.25)",
      "0 18px 40px rgba(149, 165, 166, 0.2)",
    ],
    filters: ["brightness(0.9)", "saturate(0.8)", "contrast(1.2)"],
    customProperties: {
      "--mood-primary": "#2c3e50",
      "--mood-secondary": "#34495e",
      "--mood-accent": "#95a5a6",
      "--mood-glow": "0 0 20px rgba(44, 62, 80, 0.4)",
      "--mood-pulse": "pulse-focused 5s ease-in-out infinite",
    },
  },
};

export default function MoodThemeEngine({
  currentMood,
  isDarkMode,
  children,
}: MoodThemeEngineProps) {
  // Apply mood theme
  const applyMoodTheme = useCallback(
    (moodId: string) => {
      const theme = moodThemes[moodId] || moodThemes.happy;
      const root = document.documentElement;

      // Apply custom CSS properties
      Object.entries(theme.customProperties).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });

      // Apply theme class
      root.classList.remove(
        ...Object.keys(moodThemes).map((mood) => `theme-${mood}`),
      );
      root.classList.add(`theme-${theme.id}`);

      // Apply dark mode adjustments
      if (isDarkMode) {
        root.classList.add("theme-dark");
        // Adjust colors for dark mode
        root.style.setProperty("--mood-brightness", "0.8");
        root.style.setProperty("--mood-contrast", "1.1");
      } else {
        root.classList.remove("theme-dark");
        root.style.setProperty("--mood-brightness", "1");
        root.style.setProperty("--mood-contrast", "1");
      }

      console.log(`🎨 Applied theme: ${theme.name} (${theme.id})`);
    },
    [isDarkMode],
  );

  // Create dynamic style sheet
  const createDynamicStyles = useCallback(() => {
    // Remove existing dynamic styles
    const existingStyle = document.getElementById("mood-theme-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const styleElement = document.createElement("style");
    styleElement.id = "mood-theme-styles";

    // Generate CSS for all themes
    let css = `
      /* Enhanced Mood Theme Animations */
      @keyframes pulse-happy {
        0%, 100% { transform: scale(1); filter: brightness(1); }
        50% { transform: scale(1.05); filter: brightness(1.2); }
      }
      
      @keyframes pulse-calm {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.02); opacity: 1; }
      }
      
      @keyframes pulse-energetic {
        0%, 100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
        25% { transform: scale(1.03) rotate(1deg); filter: brightness(1.1); }
        75% { transform: scale(1.03) rotate(-1deg); filter: brightness(1.1); }
      }
      
      @keyframes pulse-peaceful {
        0%, 100% { transform: translateY(0px); opacity: 0.95; }
        50% { transform: translateY(-3px); opacity: 1; }
      }
      
      @keyframes pulse-creative {
        0%, 100% { transform: scale(1) hue-rotate(0deg); }
        33% { transform: scale(1.02) hue-rotate(5deg); }
        66% { transform: scale(1.02) hue-rotate(-5deg); }
      }
      
      @keyframes pulse-focused {
        0%, 100% { transform: scale(1); filter: contrast(1); }
        50% { transform: scale(1.01); filter: contrast(1.1); }
      }
      
      @keyframes gentle-sway {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(1deg); }
      }
      
      @keyframes electric-pulse {
        0%, 100% { box-shadow: var(--mood-glow); }
        50% { box-shadow: var(--mood-glow), 0 0 40px var(--mood-primary); }
      }
      
      @keyframes zen-float {
        0%, 100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-5px) scale(1.01); }
      }
      
      @keyframes creative-swirl {
        0% { transform: rotate(0deg) hue-rotate(0deg); }
        100% { transform: rotate(360deg) hue-rotate(60deg); }
      }
      
      @keyframes focus-beam {
        0%, 100% { opacity: 0.8; transform: scaleX(1); }
        50% { opacity: 1; transform: scaleX(1.02); }
      }
      
      /* Enhanced particle effects */
      .mood-particle {
        position: absolute;
        pointer-events: none;
        user-select: none;
        z-index: 1;
      }
      
      .particle-happy {
        animation: bounce 3s ease-in-out infinite, glow 2s ease-in-out infinite alternate;
      }
      
      .particle-calm {
        animation: gentle-sway 4s ease-in-out infinite, float 6s ease-in-out infinite;
      }
      
      .particle-energetic {
        animation: electric-pulse 1.5s ease-in-out infinite, shake 2s ease-in-out infinite;
      }
      
      .particle-peaceful {
        animation: zen-float 8s ease-in-out infinite;
      }
      
      .particle-creative {
        animation: creative-swirl 10s linear infinite;
      }
      
      .particle-focused {
        animation: focus-beam 4s ease-in-out infinite;
      }
    `;

    // Add theme-specific styles
    Object.entries(moodThemes).forEach(([moodId, theme]) => {
      css += `
        .theme-${moodId} {
          background: ${theme.primaryGradient} !important;
          filter: ${theme.filters.join(" ")};
        }
        
        .theme-${moodId} .mood-enhanced-bg {
          background: ${theme.primaryGradient};
          animation: var(--mood-pulse);
        }
        
        .theme-${moodId} .mood-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: ${theme.shadows[0]};
        }
        
        .theme-${moodId} .mood-button {
          background: ${theme.secondaryGradient};
          box-shadow: ${theme.shadows[1]};
          transition: all 0.3s ease;
        }
        
        .theme-${moodId} .mood-button:hover {
          background: ${theme.accentGradient};
          box-shadow: ${theme.shadows[2]};
          transform: translateY(-2px);
        }
        
        .theme-${moodId} .mood-accent {
          background: ${theme.accentGradient};
        }
        
        .theme-${moodId} .mood-glow {
          box-shadow: var(--mood-glow);
        }
      `;
    });

    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  }, []);

  // Initialize theme system
  useEffect(() => {
    createDynamicStyles();
    applyMoodTheme(currentMood);
  }, [currentMood, createDynamicStyles, applyMoodTheme]);

  // Enhanced particle system
  const createEnhancedParticles = useCallback(() => {
    const theme = moodThemes[currentMood] || moodThemes.happy;
    const container = document.querySelector(".mood-particle-container");

    if (!container) return;

    // Clear existing particles
    container.innerHTML = "";

    // Create mood-specific particles
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement("div");
      particle.className = `mood-particle particle-${theme.id}`;
      particle.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)]};
        border-radius: 50%;
        opacity: ${Math.random() * 0.6 + 0.2};
        animation-delay: ${Math.random() * 2}s;
        animation-duration: ${Math.random() * 4 + 3}s;
      `;

      container.appendChild(particle);
    }
  }, [currentMood]);

  // Update particles when mood changes
  useEffect(() => {
    const timer = setTimeout(createEnhancedParticles, 500);
    return () => clearTimeout(timer);
  }, [createEnhancedParticles]);

  return (
    <div className="mood-theme-wrapper relative overflow-hidden">
      {/* Enhanced particle container */}
      <div className="mood-particle-container fixed inset-0 pointer-events-none z-10" />

      {/* Enhanced background layers */}
      <div className="mood-enhanced-bg fixed inset-0 z-0 opacity-80" />
      <div className="mood-gradient-overlay fixed inset-0 z-5 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {/* Content with theme context */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}

// Export theme utilities
export const getMoodTheme = (moodId: string) =>
  moodThemes[moodId] || moodThemes.happy;

export const applyMoodClasses = (mood: string, baseClasses: string = "") => {
  const theme = moodThemes[mood] || moodThemes.happy;
  return `${baseClasses} mood-enhanced mood-${theme.id}`.trim();
};
