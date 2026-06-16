import { ARCHETYPE_IDS, type ArchetypeId } from "@/data/archetypes";
import { QUESTIONS } from "@/data/questions";

export type ScoreMap = Record<ArchetypeId, number>;

export interface TestResult {
  top: ArchetypeId;
  secondary: ArchetypeId;
  /** Match percentage (0-100) for the top archetype */
  score: number;
  /** Raw points per archetype */
  scores: ScoreMap;
  /** Sorted ranking, highest first */
  ranking: { id: ArchetypeId; points: number; percent: number }[];
}

function emptyScores(): ScoreMap {
  return ARCHETYPE_IDS.reduce((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {} as ScoreMap);
}

/**
 * answers[i] = selected option index for QUESTIONS[i]. -1 / undefined = unanswered.
 */
export function computeResult(answers: number[]): TestResult {
  const scores = emptyScores();

  QUESTIONS.forEach((q, i) => {
    const choice = answers[i];
    const option = q.options[choice];
    if (!option) return;
    for (const [id, pts] of Object.entries(option.scores)) {
      scores[id as ArchetypeId] += pts ?? 0;
    }
  });

  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;

  const ranking = ARCHETYPE_IDS.map((id) => ({
    id,
    points: scores[id],
    percent: Math.round((scores[id] / total) * 100),
  })).sort((a, b) => b.points - a.points);

  const top = ranking[0].id;
  const secondary = ranking[1].id;

  // "Match score": how strongly the top archetype dominates, framed as an
  // attractive 70-99 number for shareability.
  const dominance = ranking[0].points / total; // 0..1
  const score = Math.min(99, Math.max(70, Math.round(68 + dominance * 90)));

  return { top, secondary, score, scores, ranking };
}

const PARAM_KEYS = ARCHETYPE_IDS;

/** Encode raw scores into a compact URL query string: a=3-b=5-... */
export function encodeScores(scores: ScoreMap): string {
  return PARAM_KEYS.map((id) => scores[id]).join("-");
}

export function decodeScores(value: string | null): ScoreMap | null {
  if (!value) return null;
  const parts = value.split("-").map((n) => parseInt(n, 10));
  if (parts.length !== PARAM_KEYS.length || parts.some((n) => Number.isNaN(n))) {
    return null;
  }
  const scores = emptyScores();
  PARAM_KEYS.forEach((id, i) => {
    scores[id] = parts[i];
  });
  return scores;
}

export function resultFromScores(scores: ScoreMap): TestResult {
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const ranking = ARCHETYPE_IDS.map((id) => ({
    id,
    points: scores[id],
    percent: Math.round((scores[id] / total) * 100),
  })).sort((a, b) => b.points - a.points);
  const dominance = ranking[0].points / total;
  const score = Math.min(99, Math.max(70, Math.round(68 + dominance * 90)));
  return { top: ranking[0].id, secondary: ranking[1].id, score, scores, ranking };
}
