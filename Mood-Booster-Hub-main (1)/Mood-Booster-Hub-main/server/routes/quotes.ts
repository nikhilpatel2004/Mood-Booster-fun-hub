import { RequestHandler } from "express";

export const handleQuotes: RequestHandler = async (req, res) => {
  try {
    // Using Quotable API - a free quotes API
    const response = await fetch(
      "https://api.quotable.io/random?minLength=50&maxLength=150",
    );

    if (!response.ok) {
      throw new Error("Failed to fetch quote");
    }

    const data = await response.json();

    // Fallback quotes in case API fails
    const fallbackQuotes = [
      {
        content: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
      },
      {
        content:
          "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon",
      },
      {
        content:
          "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
      },
      {
        content:
          "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle",
      },
      {
        content: "Be yourself; everyone else is already taken.",
        author: "Oscar Wilde",
      },
      {
        content: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein",
      },
      {
        content:
          "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
      },
      {
        content: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
      },
    ];

    if (data.content && data.author) {
      res.json({
        quote: data.content,
        author: data.author,
        source: "external",
      });
    } else {
      // Use fallback
      const randomQuote =
        fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      res.json({
        quote: randomQuote.content,
        author: randomQuote.author,
        source: "fallback",
      });
    }
  } catch (error) {
    console.error("Error fetching quote:", error);

    // Fallback quotes
    const fallbackQuotes = [
      {
        content: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
      },
      {
        content:
          "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon",
      },
      {
        content:
          "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
      },
      {
        content:
          "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle",
      },
      {
        content: "Be yourself; everyone else is already taken.",
        author: "Oscar Wilde",
      },
    ];

    const randomQuote =
      fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    res.json({
      quote: randomQuote.content,
      author: randomQuote.author,
      source: "fallback",
    });
  }
};
