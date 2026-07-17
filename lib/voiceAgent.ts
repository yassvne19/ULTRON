import { Conversation } from "@elevenlabs/client";
import { openWebsite, sendWhatsAppMessage, sendEmail } from "./actionTools";

export type VoiceState = "off" | "connecting" | "listening" | "speaking" | "error";

export interface VoiceAgentCallbacks {
  onStateChange: (state: VoiceState) => void;
  onError?: (message: string) => void;
}

/**
 * Thin wrapper around the ElevenLabs Conversational AI SDK.
 * Handles mic capture + streamed voice output, and exposes "client
 * tools" the agent can call to take real actions in the browser
 * (open a site, start a WhatsApp/email draft, etc).
 *
 * Each tool below must ALSO be added as a "Client Tool" in the
 * ElevenLabs agent dashboard with the exact same name, so the agent
 * knows when to call it. See the README for the exact config.
 */
export class VoiceAgent {
  private conversation: Conversation | null = null;
  private agentId: string;
  private callbacks: VoiceAgentCallbacks;

  constructor(agentId: string, callbacks: VoiceAgentCallbacks) {
    this.agentId = agentId;
    this.callbacks = callbacks;
  }

  async start() {
    if (this.conversation) return;
    this.callbacks.onStateChange("connecting");

    try {
      // Requests mic permission itself.
      this.conversation = await Conversation.startSession({
        agentId: this.agentId,
        clientTools: {
          open_website: async (params: any) => openWebsite(params),
          send_whatsapp_message: async (params: any) => sendWhatsAppMessage(params),
          send_email: async (params: any) => sendEmail(params),
        },
        onConnect: () => this.callbacks.onStateChange("listening"),
        onDisconnect: () => this.callbacks.onStateChange("off"),
        onModeChange: ({ mode }) => {
          this.callbacks.onStateChange(mode === "speaking" ? "speaking" : "listening");
        },
        onError: (message: string) => {
          this.callbacks.onError?.(message);
          this.callbacks.onStateChange("error");
        },
      });
    } catch (err) {
      this.conversation = null;
      const message =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "MIC ACCESS DENIED"
          : "VOICE INIT FAILED";
      this.callbacks.onError?.(message);
      this.callbacks.onStateChange("error");
    }
  }

  async stop() {
    await this.conversation?.endSession();
    this.conversation = null;
    this.callbacks.onStateChange("off");
  }

  get active() {
    return this.conversation !== null;
  }
}
