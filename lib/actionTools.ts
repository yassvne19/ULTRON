/**
 * Real-world actions Ultron can take in the browser, triggered as
 * ElevenLabs "client tools" from voice commands.
 *
 * IMPORTANT LIMITS (browser security, not a bug):
 * - A webpage can open a new tab and pre-fill a message/email.
 * - It CANNOT click "send" on WhatsApp/Instagram/etc for you — the
 *   person always has to tap send themselves. There's no safe way
 *   around this from client-side JS, and that's intentional on the
 *   browser vendors' part (prevents spam bots).
 */

type ToolResult = string;

const SITE_ALIASES: Record<string, string> = {
  youtube: "https://www.youtube.com",
  instagram: "https://www.instagram.com",
  google: "https://www.google.com",
  gmail: "https://mail.google.com",
  whatsapp: "https://web.whatsapp.com",
  spotify: "https://open.spotify.com",
  netflix: "https://www.netflix.com",
  twitter: "https://x.com",
  x: "https://x.com",
  facebook: "https://www.facebook.com",
  maps: "https://maps.google.com",
  github: "https://github.com",
  amazon: "https://www.amazon.com",
  reddit: "https://www.reddit.com",
};

function normalizeUrl(input: string): string {
  if (/^https?:\/\//i.test(input)) return input;
  return `https://${input}`;
}

function openTab(url: string): Window | null {
  return window.open(url, "_blank", "noopener,noreferrer");
}

/** Tool: open_website — { site: string } e.g. "youtube", "instagram", or a raw domain */
export function openWebsite(params: { site?: string; url?: string }): ToolResult {
  const raw = (params.site || params.url || "").trim().toLowerCase();
  if (!raw) return "I didn't catch which site to open.";

  const target = SITE_ALIASES[raw] ?? normalizeUrl(raw);
  const win = openTab(target);

  if (!win) {
    return "The browser blocked that popup. Pop-ups need to be allowed for this site — check the troubleshooting steps.";
  }
  return `Opened ${raw}.`;
}

/** Tool: send_whatsapp_message — { phone: string, message?: string } */
export function sendWhatsAppMessage(params: { phone?: string; message?: string }): ToolResult {
  const phone = (params.phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (!phone) return "I need a phone number, including country code, to open WhatsApp.";

  const text = params.message ? `?text=${encodeURIComponent(params.message)}` : "";
  const win = openTab(`https://wa.me/${phone}${text}`);

  if (!win) {
    return "The browser blocked that popup. Pop-ups need to be allowed for this site.";
  }
  return `Opened a WhatsApp chat with ${phone}${params.message ? " with your message typed in" : ""}. You'll need to press send yourself — I can't send it for you.`;
}

/** Tool: send_email — { to: string, subject?: string, body?: string } */
export function sendEmail(params: { to?: string; subject?: string; body?: string }): ToolResult {
  const to = (params.to || "").trim();
  if (!to) return "I need an email address to compose a message to.";

  const query = new URLSearchParams();
  if (params.subject) query.set("subject", params.subject);
  if (params.body) query.set("body", params.body);
  const qs = query.toString();

  window.location.href = `mailto:${to}${qs ? `?${qs}` : ""}`;
  return `Opened an email draft to ${to}. You'll need to press send yourself.`;
}
