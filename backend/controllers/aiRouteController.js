// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateNote = async (req, res) => {
  const { prompt } = req.body;
  const { model, config } = req.gemini;

  try {
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
  const { title, content } = req.body;
  const user = req.user;

  const { model, config } = req.gemini;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `Please summarize the following content in a concise manner while retaining all key information:\n\n${content}\n\nAlso identify relevant tags for the content and their meanings. Format the response exactly as follows (use valid JSON for the TagsJSON section):\n\nSummary:\n<your summary here>\n\nTagsJSON:\n[{"tag":"...","meaning":"..."}, ...] \n\nONLY include the two labeled sections above (Summary and TagsJSON) and nothing else.`,
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

    let aiAnalyze = "";

    for await (const chunk of responseStream) {
      aiAnalyze += chunk.text || "";
    }

    console.log("AI analysis:", aiAnalyze);

    // Extract summary and tags robustly. Prefer TagsJSON (valid JSON). Fall back to parsing common formats.
    let summary = "";
    let tags = [];

    // Try to capture the Summary section (up to TagsJSON or Tags or end)
    const summaryMatch = aiAnalyze.match(
      /Summary:\s*([\s\S]*?)(?:\n\s*TagsJSON:|\n\s*Tags:|$)/i
    );
    if (summaryMatch) {
      summary = summaryMatch[1].trim(); // [0] is regex match, [1] is the captured group
    } else {
      summary = aiAnalyze
        .split(/Tags:\s*/i)[0]
        .replace(/Summary:/i, "")
        .trim();
    }

    // First try to find a JSON array under TagsJSON:
    const tagsJsonMatch = aiAnalyze.match(/TagsJSON:\s*(\[.*\])/is);
    if (tagsJsonMatch) {
      try {
        const parsed = JSON.parse(tagsJsonMatch[1]);
        if (Array.isArray(parsed)) {
          tags = parsed
            .map((t) => {
              const tag = (t.tag || "").toString().trim();
              const meaning = (t.meaning || "").toString().trim();

              if (!tag) return null;

              return {
                tag,
                meaning,
              };
            })
            .filter(Boolean);
        }
      } catch (err) {
        console.error("Failed to parse TagsJSON:", err);
      }
    }

    // Fallback parsing when TagsJSON is not present or failed
    if (!tags.length) {
      const tagsText = (aiAnalyze.split(/Tags:\s*/i)[1] || "").trim();
      if (tagsText) {
        tags = tagsText
          .split(",")
          .map((entry) => {
            const e = entry.trim();
            const cleaned = e.replace(/^<|>$/g, "").trim();
            // try separators like ':' or '-' first
            let parts = cleaned.split(/[:\-–—]/);
            let tagPart = parts.shift();
            let meaningPart = parts.join(":").trim();
            if (!meaningPart) {
              // fallback: split by whitespace (first token is tag)
              const parts2 = cleaned.split(/\s+/);
              tagPart = parts2.shift();
              meaningPart = parts2.join(" ");
            }
            const tag = (tagPart || "").replace(/[<>]/g, "").trim();
            const meaning = (meaningPart || "").trim();
            return tag
              ? {
                  tag,
                  meaning,
                }
              : null;
          })
          .filter(Boolean);
      }
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
      summary,
      tags,
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
  const audioBuffer = req.file?.buffer;
  const { model, config } = req.gemini;

  if (!audioBuffer) {
    return res.status(400).json({ message: "No audio file provided" });
  }

  try {
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
            text: "The audio above is the user's spoken question. First, provide a verbatim TRANSCRIPT of the audio, prefaced with the label 'TRANSCRIPT:' on its own line. Then provide a concise, correct reply prefaced with the label 'REPLY:' on its own line. Use this exact format:\n\nTRANSCRIPT:\n<transcript text>\n\nREPLY:\n<reply text>\n\nEnsure both sections are present and clearly labeled, do not put the transcript, and the reply word in a code block.",
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
      aiResponse += chunk.text || "";
    }

    const parsed = aiResponse.match(
      /TRANSCRIPT:\s*([\s\S]*?)\s*(?:\r?\n)+\s*REPLY:\s*([\s\S]*)/i
    );
    const transcript = parsed?.[1]?.trim() || "";
    const aiReply = parsed?.[2]?.trim() || aiResponse.trim();

    console.log("Transcript:", transcript);
    console.log("AI Reply:", aiReply);

    return res.status(200).json({
      success: true,
      message: "Audio processed successfully",
      data: {
        title: transcript,
        content: aiReply,
      },
    });
  } catch (error) {
    console.error("Error transcribing or generating note:", error);
    return res.status(500).json({ message: "Error processing audio" });
  }
};
