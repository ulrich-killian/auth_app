// server.js
import express from 'express';
import crypto from 'node:crypto';

const app = express();
app.use(express.json());

// In production, load this from process.env.ENCRYPTION_KEY (Must be exactly 32 bytes)
const ENCRYPTION_KEY = crypto.randomBytes(32);
const ALGORITHM = 'aes-256-gcm';

// Global variable to hold the packed payload string during testing
let databaseStorageMock = "";

/**
 * Encrypts data and logs the step-by-step cryptographic components
 */
function encryptData(text) {
  const iv = crypto.randomBytes(12); // Unique 12-byte initialization vector
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  // Pack everything together using standard delimiters
  const packedPayload = `${iv.toString('hex')}:${encrypted}:${authTag}`;

  // --- TESTING PRINTS ---
  console.log("\n================ [ ENCRYPTION ENGINE TRIGGERED ] ================");
  console.log("📥 Incoming Plaintext Text: ", text);
  console.log("🎲 Generated IV (Hex):       ", iv.toString('hex'));
  console.log("🔒 Raw Ciphertext (Hex):     ", encrypted);
  console.log("🏷️ Integrity Auth Tag (Hex): ", authTag);
  console.log("📦 Packed Payload For DB:    ", packedPayload);
  console.log("================================================================\n");

  // Setting our global mock database state variable
  databaseStorageMock = packedPayload;
}

/**
 * Decrypts data, runs the integrity check, and logs the execution output
 */
function decryptData(packedPayload) {
  console.log("\n================ [ DECRYPTION ENGINE TRIGGERED ] ================");
  console.log("📥 Parsing Packed Payload: ", packedPayload);

  try {
    const [ivHex, encryptedHex, authTagHex] = packedPayload.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    // Attach the auth tag. If the string was altered, decipher.final() throws an error.
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // --- TESTING PRINTS ---
    console.log("🟢 Integrity Check:          PASSED (No data tampering detected)");
    console.log("🔓 Decrypted Output Text:    ", decrypted);
    console.log("================================================================\n");

  } catch (error) {
    // --- TAMPERING PRINTS ---
    console.log("🔴 Integrity Check:          FAILED!");
    console.log("🚨 Security Action:          Execution blocked. The string was altered.");
    console.log("💥 Error Logs:               ", error.message);
    console.log("================================================================\n");
  }
}

// Route to run the test workflow sequentially
app.post('/api/test-crypto', (req, res) => {
  const { sensitiveData } = req.body;

  if (!sensitiveData) {
    return res.status(400).json({ error: "Please provide 'sensitiveData' in the request body" });
  }

  // Phase 1: Trigger Encryption
  encryptData(sensitiveData);

  // Phase 2: Trigger Decryption with the valid string
  decryptData(databaseStorageMock);

  // Phase 3: Simulate Malicious Tampering
  console.log("😈 Simulating data tampering inside MongoDB...");
  const tamperedString = databaseStorageMock.replace(/.$/, 'a'); // Intentionally flip the last digit
  decryptData(tamperedString);

  res.json({
    message: "Test completed successfully. Check your terminal output window to analyze the architecture data maps!",
    storedPayloadSample: databaseStorageMock
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Security testing harness running on http://localhost:${PORT}`);
  console.log(`💡 Send a POST request to http://localhost:${PORT}/api/test-crypto with a JSON body.`);
});