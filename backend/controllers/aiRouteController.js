import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import userSchema from "../models/User.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateNote = async (req, res) => {
  const { prompt, userId } = req.body;

  try {
    const user = await userSchema.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tools = [
      {
        googleSearch: {},
      },
    ];
    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      tools,
    };
    const model = "gemini-2.5-flash";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `Your name is MindBot. Always answer as MindBot if you're only being asked who you are, a helpful AI assistant.\nUser prompt: ${prompt}`,
          },
        ],
      },
    ];

    // Streaming response
    const responseStream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let aiResponse = "";
    for await (const chunk of responseStream) {
      aiResponse += chunk.text || "";
    }

    console.log("AI response:", aiResponse);

    const title = prompt;
    const content = aiResponse;

    const newNote = { title, content };

    return res.status(200).json({
      success: true,
      message: "Note generated successfully",
      data: newNote,
    });
  } catch (error) {
    console.error("Error generating note:", error);
    return res.status(500).json({ message: "Error generating note" });
  }
};

export const saveGeneratedNotes = async (req, res) => {
  const { title, content, userId } = req.body;

  try {
    const user = await userSchema.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingNote = user.notes.find((note) => note.title === title);

    if (existingNote) {
      return res.status(409).json({
        message: "Note title already exists please choose a different title",
      });
    }

    const newNote = {
      title,
      content,
    };

    user.notes.push(newNote);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Note saved successfully",
      data: newNote,
    });
  } catch (error) {
    console.error("Error saving generated note:", error);
    return res.status(500).json({ message: "Error saving generated note" });
  }
};

export const generateNoteFromAudio = async (req, res) => {
  const { userId } = req.body;
  const audioBuffer = req.file?.buffer;

  if (!audioBuffer) {
    return res.status(400).json({ message: "No audio file provided" });
  }

  try {
    const tools = [{ googleSearch: {} }];
    const config = { thinkingConfig: { thinkingBudget: -1 }, tools };
    const model = "gemini-2.5-flash";

    const contents = [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "audio/webm",
              data: audioBuffer.toString("base64"),
            },
          },
          {
            text: "The audio above is the user's spoken question. Provide a concise, correct text answer to the spoken question. Do not return a verbatim transcription — return only the reply.",
          },
        ],
      },
    ];

    // stream and accumulate the model reply
    const stream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    let aiResponse = "";
    for await (const chunk of stream) {
      // chunk.text contains incremental text for streaming responses
      aiResponse += chunk.text || "";
    }

    const parsed = aiResponse.match(
      /TRANSCRIPT:\s*([\s\S]*?)\s*(?:\r?\n)+\s*REPLY:\s*([\s\S]*)/i
    );
    const transcript = parsed?.[1]?.trim() || "";

    return res.status(200).json({
      success: true,
      message: "Audio processed successfully",
      data: {
        title: transcript,
        content: aiResponse,
      },
    });
  } catch (error) {
    console.error("Error transcribing or generating note:", error);
    return res.status(500).json({ message: "Error processing audio" });
  }
};
