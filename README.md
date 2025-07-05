<h1 align="center">Zaileys - Simplified WhatsApp Node.js API</h1>

<div align="center">
  <img alt="Zaileys - Simplified WhatsApp Node.js API" src="https://socialify.git.ci/zeative/zaileys/image?description=1&descriptionEditable=Zaileys%20is%20a%20simplified%20version%20of%20the%20Baileys%20package%20%0Awhich%20is%20easier%20and%20faster.&font=KoHo&forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Auto">
  <br>
  <a href="https://www.npmjs.com/package/zaileys"><img src="https://img.shields.io/npm/v/zaileys.svg" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/zaileys"><img src="https://img.shields.io/npm/dw/zaileys?label=npm&color=%23CB3837" alt="NPM Downloads"></a>
  <a href="https://github.com/zeative/zaileys"><img src="https://img.shields.io/github/languages/code-size/zeative/zaileys" alt="GitHub Code Size"></a>
  <a href="https://github.com/zeative/zaileys"><img src="https://img.shields.io/github/license/zeative/zaileys" alt="GitHub License"></a>
  <a href="https://github.com/zeative/zaileys"><img src="https://img.shields.io/github/stars/zeative/zaileys" alt="GitHub Stars"></a>
  <a href="https://github.com/zeative/zaileys"><img src="https://img.shields.io/github/forks/zeative/zaileys" alt="GitHub Forks"></a>
</div>

#
**Zaileys** is a lightweight, user-friendly wrapper around the [Baileys](https://github.com/WhiskeySockets/Baileys) library, designed to simplify building WhatsApp bots and integrations with TypeScript or ESM JavaScript. It offers a streamlined API, robust multi-device support, and seamless database integration for session management.

> **Note**: Stay updated and get support by joining our [WhatsApp Channel](https://whatsapp.com/channel/0029VazENbmInlqHIWzgn33h).

> **Warning**: Pairing code authentication is currently not supported due to issues. Use QR code authentication instead.

## 📋 Table of Contents

1. [✨ Features](#features)
2. [📦 Installation](#installation)
3. [🚀 Quick Start](#quick-start)
4. [🛠 Core Concepts](#core-concepts)
5. [📡 Event Handling](#event-handling)
6. [📩 Sending Messages](#sending-messages)
7. [🖼 Sending Media](#sending-media)
8. [🔧 Advanced Actions](#advanced-actions)
9. [🐛 Issues & Feedback](#issues--feedback)
10. [❤️ Support](#support)
11. [📜 License](#license)
12. [🙌 Acknowledgements](#acknowledgements)

## ✨ Features

- **Simplified API**: Minimal setup for rapid bot development.
- **Multi-Device Support**: Full compatibility with WhatsApp’s multi-device feature via Baileys.
- **Modular & Extensible**: Easily integrate middleware and custom storage solutions.
- **QR Code Authentication**: Hassle-free login with terminal-based QR codes.
- **TypeScript & ESM**: Full type safety and modern JavaScript support.
- **Database Integration**: Supports SQLite, PostgreSQL, or MySQL for session persistence.
- **Rate Limiting**: Built-in spam detection to prevent abuse.
- **Webhooks Support**: Handle external events with a dynamically provided URL during runtime.

## 📦 Installation

Install Zaileys using your preferred package manager:

```bash
npm install zaileys
# or
yarn add zaileys
# or
pnpm add zaileys
```

**Requirements**:

- **Node.js**: Version 18 or higher.
- **Module System**: ESM or TypeScript only (no CommonJS).
- **Authentication**: QR code only (pairing code not supported).
- **Unsupported Runtimes**: Deno and Bun (due to `better-sqlite3` incompatibility).

## 🚀 Quick Start

Explore the `/examples` folder for practical use cases:

- [Simple Setup](https://github.com/zeative/zaileys/blob/main/examples/simple.ts): A minimal setup for quick prototyping.
- [Citation Example](https://github.com/zeative/zaileys/blob/main/examples/citation.ts): Demonstrates custom metadata with the citation mechanism.
- [Rate Limiting Example](https://github.com/zeative/zaileys/blob/main/examples/limiter.ts): Shows how to implement spam detection.
- [AI Integration with Groq](https://github.com/zeative/zaileys/blob/main/examples/llms.ts): Integrates AI capabilities using Groq.
- [Webhooks Integration](https://github.com/zeative/zaileys/blob/main/examples/webhooks.ts): Handles webhook-based interactions.
- [Voice Note with AI](https://github.com/zeative/zaileys/blob/main/examples/speech.ts): Interacts with AI using voice notes.

### Basic Example

```typescript
import { Client } from "zaileys";

// default configuration
const wa = new Client({
  authType: "qr",
  prefix: "/",
  ignoreMe: true,
  showLogs: true,
  autoRead: true,
  autoOnline: true,
  autoPresence: true,
  autoRejectCall: true,
  loadLLMSchemas: false,
  database: {
    type: "sqlite",
    connection: { url: "./session/zaileys.db" },
  },
});

wa.on("messages", async (ctx) => {
  if (ctx.text === "test") {
    await wa.text("Hello!", { roomId: ctx.roomId });
  }
});
```

### Minimal Example

```typescript
import { Client } from "zaileys";

const wa = new Client({ authType: "qr" });

wa.on("messages", (ctx) => {
  wa.text("Hello", { roomId: ctx.roomId });
});
```

## 🛠 Core Concepts

### Sessions & Authentication

Zaileys uses QR code authentication and stores sessions in a database to avoid repeated QR scans.

```typescript
import { Client } from "zaileys";

const wa = new Client({
  database: {
    type: "sqlite",
    connection: { url: "./session/zaileys.db" },
  },
});
```

### Citation Mechanism

Define custom metadata providers for dynamic boolean flags in `ctx.citation`. See [citation.ts](https://github.com/zeative/zaileys/blob/main/examples/citation.ts).

```typescript
const wa = new Client({
  citation: {
    admins: async () => [628123456789],
    vips: () => [628123456789],
  },
});

wa.on("messages", (ctx) => {
  if (ctx.citation?.isAdmins) {
    wa.text("Admin access granted", { roomId: ctx.roomId });
  }
});
```

### Rate Limiting

Detect and prevent spam with the built-in limiter. See [limiter.ts](https://github.com/zeative/zaileys/blob/main/examples/limiter.ts).

```typescript
const wa = new Client({
  authType: "qr",

  // max 10 messages on 10 seconds
  limiter: {
    durationMs: 10000,
    maxMessages: 5,
  },
});

wa.on("messages", (ctx) => {
  if (ctx.isSpam) {
    wa.text("You're spamming!!", { roomId: ctx.roomId });
    return;
  }

  wa.text("Hello!", { roomId: ctx.roomId });
});
```

### Webhooks

Configure webhooks to handle external events. The URL is dynamically provided in the CLI upon running the app. See [webhooks.ts](https://github.com/zeative/zaileys/blob/main/examples/webhooks.ts).

```typescript
const wa = new Client({
  authType: "qr",
  webhooks: {
    url: "https://your-webhook-url.com",
  },
});

wa.on("webhooks", (ctx) => {
  console.log(ctx.data.query); // Query params
  console.log(ctx.data.json); // JSON body
  console.log(ctx.data.form); // Form data
  console.log(ctx.data.raw); // Raw body
});
```

**Webhook Access**: Displayed in CLI on startup (e.g., `http://xxx.xxx.x.xxx:4135/webhooks`, Port: 4135, Methods: GET, POST).

## 📡 Event Handling

### Connection Events

Monitor connection status changes.

```typescript
wa.on("connection", (ctx) => {
  console.log(`Connection: ${ctx.status}`);
});
```

### Message Events

```typescript
wa.on("messages", (ctx) => {
  console.log(ctx);
});
```

Schemas output of `ctx` type:

```json
{
  "chatId": "string",
  "channelId": "string",
  "uniqueId": "string",
  "receiverId": "string",
  "receiverName": "string",
  "roomId": "string",
  "roomName": "string",
  "senderId": "string",
  "senderName": "string",
  "senderDevice": "string",
  "chatType": "string",
  "timestamp": "number",
  "mentions": "array",
  "text": "string",
  "links": "array",
  "isPrefix": "boolean",
  "isSpam": "boolean",
  "isFromMe": "boolean",
  "isTagMe": "boolean",
  "isGroup": "boolean",
  "isStory": "boolean",
  "isViewOnce": "boolean",
  "isEdited": "boolean",
  "isDeleted": "boolean",
  "isPinned": "boolean",
  "isUnPinned": "boolean",
  "isChannel": "boolean",
  "isBroadcast": "boolean",
  "isEphemeral": "boolean",
  "isForwarded": "boolean",
  "citation": "object",
  "media": {
    ...
    "buffer": "function",
    "stream": "function"
  },
  "replied": "object (same schema as ctx)",
  "message": "function"
}
```

### Call Events

Handle incoming calls.

```typescript
wa.on("calls", (ctx) => {
  console.log(ctx);
});
```

### Webhook Events

Handle external webhook requests.

```typescript
wa.on("webhooks", (ctx) => {
  console.log(ctx.data.query); // Query params
  console.log(ctx.data.json); // JSON body
  console.log(ctx.data.form); // Form data
  console.log(ctx.data.raw); // Raw body
});
```

**Webhook Access**: Displayed in CLI on startup (e.g., `http://xxx.xxx.x.xxx:4135/webhooks`, Port: 4135, Methods: GET, POST).

## 📩 Sending Messages

### Basic Text Messages

Send simple or advanced text messages with options like replies or forwarding.

```typescript
const roomId = ctx.roomId;
const message = ctx.message;

/* sending text  */
wa.text("Hello", { roomId });

/* sending reply  */
wa.text("Reply", { roomId, quoted: message });

/* sending forwarded  */
wa.text("Forwarded", { roomId, asForwarded: true });

/* fake verified (just work on reply message only!)  */
wa.text("Verified reply", { roomId, quoted: message, verifiedReply: "whatsapp" });

/* mark as ai (just work on private message only!)  */
wa.text("Mark AI Message!", { roomId, asAI: true });

/* sending view once */
wa.text({ image: "https://example.com/image.png", text: "View once" }, { roomId, asViewOnce: true });
```

### Message Reactions, Edits, and Deletion

Add reactions, edit, or delete messages.

```typescript
/* sending reaction */
wa.reaction("👍", { message });

/* sending edit */
const original = await wa.text("Will edit", { roomId });
wa.edit("Edited", { message: original?.message });

/* sending delete */
const original = await wa.text("Will delete", { roomId });
wa.delete("Deleted", { message: original?.message });
```

### Polls

Create interactive polls.

```typescript
/* sending polling */
wa.poll({ name: "Do you love me?", answers: ["Yes", "Maybe", "No"] }, { roomId });
```

### Contacts

Share contact information.

```typescript
/* sending contact */
wa.contact({ fullname: "Kejaa", whatsAppNumber: 628123456789 }, { roomId });
```

### Location

Share geographic coordinates.

```typescript
/* sending location */
wa.location({ latitude: 24.121231, longitude: 55.1121221 }, { roomId });
```

## 🖼 Sending Media

### Images and Stickers

Send images or stickers from URLs or local files.

```typescript
import fs from "fs";

/* sending by url */
wa.text({ image: "https://github.com/zeative.png", text: "Image" }, { roomId });

/* sending by file */
wa.text({ image: fs.readFileSync("example/image.png"), text: "Image" }, { roomId });

/* sending sticker */
wa.text({ sticker: "https://github.com/zeative.png" }, { roomId });
```

### Videos and GIFs

Send videos or GIFs with optional captions.

```typescript
/* sending video */
wa.text({ video: "https://example.com/video.mp4", text: "Video" }, { roomId });

/* sending video as circle */
wa.text({ note: "https://example.com/video.mp4", text: "Video" }, { roomId });

/* sending gif */
wa.text({ gif: "https://example.com/video.mp4" }, { roomId });
```

### Audio and Voice Notes

Send audio files or voice notes (use `.ogg` for compatibility).

```typescript
/* sending audio (recommended use .ogg format) */
wa.text({ audio: "https://example.com/audio.ogg" }, { roomId });

/* sending voice note (recommended use .ogg format) */
wa.text({ voice: "https://example.com/audio.ogg" }, { roomId });
```

## 🔧 Advanced Actions

### Presence Updates

Update the bot’s presence status in a chat.

```typescript
wa.presence("typing", { roomId }); // Options: typing, recording, online, offline, paused
```

### Profile Retrieval

Fetch user or group profiles.

```typescript
wa.profile("628123456789@s.whatsapp.net"); // User profile
wa.profile("1209999@g.us"); // Group profile
```

## 🐛 Issues & Feedback

Encounter a bug or have a feature request? Submit it on our [GitHub Issues](https://github.com/zeative/zaileys/issues) page.

## ❤️ Support

Show your support for Zaileys:

- [Buy me a coffee ☕](https://saweria.co/zaadevofc)
- ⭐ Star the repository on [GitHub](https://github.com/zeative/zaileys)

## 📜 License

Zaileys is licensed under the [MIT License](https://github.com/zeative/zaileys/blob/main/LICENSE).

## 🙌 Acknowledgements

Powered by [Baileys](https://github.com/WhiskeySockets/Baileys) from Whiskey Sockets.

Happy coding! 🚀
