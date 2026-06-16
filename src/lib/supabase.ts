import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client (anon key). Safe to import in client components.
 * Returns null when env vars are not configured so the MVP still works without
 * a Supabase project wired up.
 */
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    cached = null;
    return cached;
  }

  cached = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  return cached;
}

export interface TestResultRecord {
  top_archetype: string;
  secondary_archetype: string;
  score: number;
  scores: Record<string, number>;
  source?: string;
}

/**
 * Best-effort, non-blocking save of an anonymous test result for analytics.
 * Silently no-ops if Supabase is not configured.
 */
export async function saveTestResult(record: TestResultRecord): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("test_results").insert({
      top_archetype: record.top_archetype,
      secondary_archetype: record.secondary_archetype,
      score: record.score,
      scores: record.scores,
      source: record.source ?? "web",
    });
  } catch {
    // analytics is best-effort; never block the UX
  }
}
