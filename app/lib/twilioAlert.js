import twilio from 'twilio';

// Initialize Twilio Client
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;   
const client = twilio(accountSid, authToken);

// Your Twilio Phone Number (From Dashboard)
const TWILIO_NUMBER = '+14155238888'; // Sandbox Number for WhatsApp
// OR use your Trial Number for SMS: '+1555...'

export async function broadcastSystemCode(disasterType) {
  
  // 1. Define Your Codes
  const SYSTEM_CODES = {
    "FLOOD": "1000002",  // Code for Flood
    "DRAIN": "1000001"   // Code for Clogged Drain
  };

  const code = SYSTEM_CODES[disasterType] || "0000000";
  const alertType = disasterType === "FLOOD" ? "CRITICAL FLOOD" : "DRAIN OVERFLOW";

  // 2. List of People to Alert (For Hackathon demo, hardcode them)
  // NOTE: In Twilio Trial, these numbers MUST be verified in your dashboard.
  const users = [
    "whatsapp:+918709436341", // <--- REPLACE WITH YOUR REAL NUMBER
    // "whatsapp:+91...",     // Add teammate's number
  ];

  console.log(`🚨 Broadcasting System Code: ${code} for ${disasterType}...`);

  // 3. Blast the Message
  const promises = users.map(user => {
    return client.messages.create({
      from: TWILIO_NUMBER,
      to: user,
      body: `🚨 *GOVT ALERT SYSTEM* 🚨\n\n⚠️ Issue: ${alertType}\n🔢 *ACTIVATE CODE: ${code}*\n\nTake immediate action.`
    });
  });

  try {
    await Promise.all(promises);
    console.log("✅ All Alert Codes Sent!");
    return true;
  } catch (error) {
    console.error("❌ Twilio Broadcast Failed:", error);
    return false;
  }
}