import { getSupabase } from "./supabase";

const SESSION_KEY = "lt_session_id";

export type EventName =
  | "landing_view"
  | "test_started"
  | "test_completed"
  | "share_card_generated"
  | "share_clicked"
  | "xinyu_clicked";

export const EVENT_NAMES: EventName[] = [
  "landing_view",
  "test_started",
  "test_completed",
  "share_card_generated",
  "share_clicked",
  "xinyu_clicked",
];

/** Stable anonymous per-browser id. */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        (crypto as Crypto | undefined)?.randomUUID?.() ??
        `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

/** Derive a normalized traffic source from UTM params / referrer. */
export function trafficSource(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const utm_source = url.searchParams.get("utm_source") || "";
  const utm_medium = url.searchParams.get("utm_medium") || "";
  const utm_campaign = url.searchParams.get("utm_campaign") || "";

  let source = utm_source;
  if (!source) {
    const ref = document.referrer;
    if (!ref) {
      source = "direct";
    } else {
      try {
        source = new URL(ref).hostname.replace(/^www\./, "");
      } catch {
        source = "direct";
      }
    }
  }
  return { source, referrer: document.referrer || "", utm_source, utm_medium, utm_campaign, path: url.pathname };
}

/** Best-effort event log. No-ops when Supabase is not configured. */
export async function track(
  event: EventName,
  opts?: { archetype?: string; metadata?: Record<string, unknown> }
): Promise<void> {
  try {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.from("event_logs").insert({
      session_id: getSessionId(),
      event_name: event,
      archetype: opts?.archetype ?? null,
      metadata: opts?.metadata ?? {},
    });
  } catch {
    // analytics is best-effort; never block the UX
  }
}
