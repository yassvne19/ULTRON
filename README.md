# ULTRON

ULTRON is a voice-controlled AI assistant with a Jarvis-style holographic orb interface. Talk to it naturally and it takes real actions in your browser — opening websites, drafting messages, and composing emails — while a Three.js orb reacts to your voice and hand gestures.

![ULTRON orb UI] <img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/cb5cd01f-7be6-4201-bccf-dc2dc4833f1e" />


## Features

- 🗣️ **Talk to ULTRON** — real-time voice conversation powered by ElevenLabs Conversational AI. Speak naturally; no wake word, no typing.
- 🌐 **Open websites** — say a site name ("open YouTube", "open GitHub") or a raw domain and ULTRON opens it in a new tab.
- 💬 **Send messages** — ULTRON opens a WhatsApp chat with your contact and pre-fills the message for you.
- ✉️ **Send emails** — ULTRON drafts an email (recipient, subject, body) and opens it in your mail client.
- ✋ **Hand-gesture control** — spin and zoom the orb with pinch gestures via webcam (MediaPipe hand tracking), or use mouse/touch.

> **Note on messages & emails:** browser security means a webpage can pre-fill a WhatsApp message or email draft, but it can't press "send" for you. ULTRON opens the draft ready to go — you send it with one tap.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Voice setup

ULTRON's voice agent runs on ElevenLabs Conversational AI. Create an agent in the [ElevenLabs dashboard](https://elevenlabs.io/), add `open_website`, `send_whatsapp_message`, and `send_email` as Client Tools with matching names, then set your agent ID:

```bash
# .env.local
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
```

## Controls

### Mouse / touch

| Input | Action |
| --- | --- |
| Drag | Spin the orb |
| Scroll / pinch | Zoom in & out |

### Hand gestures (webcam)

Click **GESTURES OFF** (or press `G`) and allow camera access, then:

| Gesture | Action |
| --- | --- |
| Pinch (thumb + index) one hand and move it | Spin the orb |
| Pinch with **both** hands, spread apart / bring together | Zoom in / out |

### Keyboard

| Key | Action |
| --- | --- |
| `V` | Talk to ULTRON (toggle voice) |
| `G` | Toggle hand gestures |
| `R` | Reset the view |
| `+` / `−` | Zoom in / out |


## How it works

- **`lib/voiceAgent.ts`** — wraps the ElevenLabs Conversational AI SDK: mic capture, streamed voice output, and the client tools ULTRON can call.
- **`lib/actionTools.ts`** — the real-world actions ULTRON takes in the browser: opening sites, starting WhatsApp chats, and drafting emails.
- **`lib/orbScene.ts`** — the Three.js scene: layered wireframe shells, a spiral inner core, floating code-text sprites, orbiting debris, dust particles, scan rings, and a bloom + chromatic-aberration post-processing stack.
- **`lib/handTracker.ts`** — MediaPipe HandLandmarker running on the webcam feed. Pinch detection with hysteresis: one pinched hand spins the orb, two pinched hands zoom by spreading apart or together.
- **`components/JarvisOrb.tsx`** — the HUD and glue between the voice agent, the scene, the tracker, and your inputs.

## License

MOHAMED YASSINE
