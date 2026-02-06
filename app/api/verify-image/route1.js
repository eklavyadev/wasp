// Add import
import { broadcastSystemCode } from "../../lib/twilioAlert";

// ... inside POST function ...

if (result.verified) {
    console.log("⚠️ Flood Detected! Sending Code 1000002...");
    
    // FIRE THE ALERT
    broadcastSystemCode("FLOOD");
}