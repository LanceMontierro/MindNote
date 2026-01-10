export const geminiDefaults = (req, res, next) => {
  req.gemini = {
    model: "gemini-2.5-flash",
    tools: [{ googleSearch: {} }],
    config: {
      thinkingConfig: { thinkingBudget: -1 },
      tools: [{ googleSearch: {} }],
    },
  };
  next();
};
