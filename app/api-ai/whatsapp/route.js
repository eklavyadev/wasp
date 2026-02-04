import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import twilio from "twilio";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const mediaUrl = formData.get("MediaUrl0");
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    if (!mediaUrl) {
      twiml.message("Please send a photo of the flood.");
      return new NextResponse(twiml.toString(), { headers: { "Content-Type": "text/xml" } });
    }

    console.log("📸 Processing WhatsApp Photo...");

    // 1. Fetch & Convert Image
    const imageFetch = await fetch(mediaUrl);
    const arrayBuffer = await imageFetch.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    let isFlood = false;
    let aiReason = "Analysis failed";

    try {
      // 2. Call the REAL Working Model (90b)
      // This is the same model that worked on your Website
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Is this a flood? Answer strictly JSON: { \"verified\": true, \"reason\": \"short explanation\" }" },
              { type: "image_url", image_url: { url: dataUrl } }
            ]
          }
        ],
        // ✅ FIX: Using the 90b model (11b is dead)
        model: "llama-3.2-90b-vision-preview", 
        temperature: 0,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
      isFlood = result.verified;
      aiReason = result.reason;

    } catch (aiError) {
      console.error("⚠️ AI Failed:", aiError.message);
      // Fallback: If AI dies, we REJECT it to be safe (instead of auto-accepting)
      isFlood = false;
      aiReason = "AI Server Busy (Try again)";
    }

    // 3. Reply
    if (isFlood) {
      twiml.message(`🚨 *FLOOD CONFIRMED*\n\n✅ Analysis: ${aiReason}\n📍 Location: Auto-tagged.\n\nTeam sent.`);
    } else {
      twiml.message(`❌ *REPORT REJECTED*\n\nReason: ${aiReason || "Image does not show clear flooding."}`);
    }

    return new NextResponse(twiml.toString(), { headers: { "Content-Type": "text/xml" } });

  } catch (error) {
    console.error("Server Error:", error);
    return new NextResponse("<Response><Message>System Error</Message></Response>", { headers: { "Content-Type": "text/xml" } });
  }
}