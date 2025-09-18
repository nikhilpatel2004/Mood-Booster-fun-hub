import { RequestHandler } from "express";

export const handleJokes: RequestHandler = async (req, res) => {
  try {
    // Using JokesAPI - a free jokes API
    const response = await fetch(
      "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single",
    );

    if (!response.ok) {
      throw new Error("Failed to fetch joke");
    }

    const data = await response.json();

    // Fallback jokes in case API fails
    const fallbackJokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why don't skeletons fight each other? They don't have the guts.",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? He was outstanding in his field!",
      "How do you organize a space party? You planet!",
      "Why don't programmers like nature? It has too many bugs.",
      "What do you call a bear with no teeth? A gummy bear!",
    ];

    if (data.joke) {
      res.json({
        joke: data.joke,
        source: "external",
        category: data.category || "general",
      });
    } else {
      // Use fallback
      const randomJoke =
        fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
      res.json({
        joke: randomJoke,
        source: "fallback",
        category: "general",
      });
    }
  } catch (error) {
    console.error("Error fetching joke:", error);

    // Fallback jokes
    const fallbackJokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why don't skeletons fight each other? They don't have the guts.",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? He was outstanding in his field!",
    ];

    const randomJoke =
      fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    res.json({
      joke: randomJoke,
      source: "fallback",
      category: "general",
    });
  }
};
