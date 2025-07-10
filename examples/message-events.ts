import { Client } from "../src";

/**
 * Example demonstrating that all message events (new, edit, delete, reaction, etc.) 
 * are now properly forwarded to the user's 'messages' event listener
 */
const wa = new Client({
  authType: "qr",
  ignoreMe: false, // Set to false to receive updates for your own messages too
});

wa.on("messages", (ctx) => {
  console.log(`📨 Message event received:`);
  console.log(`  - Chat ID: ${ctx.chatId}`);
  console.log(`  - Text: ${ctx.text}`);
  console.log(`  - Is From Me: ${ctx.isFromMe}`);
  console.log(`  - Is Edited: ${ctx.isEdited}`);
  console.log(`  - Is Deleted: ${ctx.isDeleted}`);
  console.log(`  - Timestamp: ${new Date(ctx.timestamp * 1000).toISOString()}`);
  console.log('---');
  
  // Now you'll receive notifications for:
  // - New messages (messages.upsert)
  // - Message edits (messages.update) 
  // - Message deletions (messages.delete)
  // - Message reactions (messages.reaction)
  // - Read receipts (message-receipt.update)
  // - Media updates (messages.media-update)
});

console.log("🚀 Bot started! All message events will be logged...");
