# Love Archetype Test · 恋爱原型测试

A highly shareable relationship personality test (16Personalities / Dimensional style) that funnels young adults and couples into **Xinyu (心语)**.

20 questions → scoring engine → top + secondary archetype → beautiful mobile result page → Instagram-Story share card → CTA to Xinyu.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **TailwindCSS 3**
- **Supabase** (anonymous analytics now; couple-matching schema scaffolded for later)
- Mobile-first, SEO-optimized, no AI API required (pure scoring system)

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — app runs without Supabase
npm run dev                  # http://localhost:3000
```

Build for production:

```bash
npm run build && npm run start
```

## How the test works

- **8 archetypes**: Guardian 守护者 · Dreamer 梦想家 · Pursuer 追求者 · Independent 独行者 · Healer 治愈者 · Challenger 挑战者 · Mediator 调停者 · Builder 建设者
- 20 questions; **each option awards points to 2–3 archetypes** (`src/data/questions.ts`).
- Scoring + ranking in `src/lib/scoring.ts`. Result is encoded into the URL (`/result?s=...`) so links are shareable and stateless.
- The match "score" is a shareability-friendly 70–99% derived from how strongly the top archetype dominates.

## Project structure

```
src/
  app/
    page.tsx              landing
    test/page.tsx         the 20-question quiz (client)
    result/page.tsx       result (Suspense → ResultClient)
    opengraph-image.tsx   branded link-preview image
    sitemap.ts / robots.ts
  components/
    ResultClient.tsx      full result UI + share logic
    ShareCard.tsx         1080×1920 Instagram Story card (captured to PNG)
    ConversionCTA.tsx     Xinyu conversion block
  data/
    archetypes.ts         8 archetypes: copy, strengths, blind spots, ideal match, theme
    questions.ts          20 weighted questions
  lib/
    scoring.ts            scoring + URL encode/decode
    supabase.ts           best-effort analytics client
    site.ts               site + Xinyu config
supabase/
  schema.sql              test_results + future couple-matching scaffolding
```

## Share card

The result page renders a hidden 1080×1920 `ShareCard`, captures it with [`html-to-image`](https://github.com/bubkoo/html-to-image), and uses the Web Share API (`navigator.share` with files) on mobile, falling back to a PNG download on desktop.

## Configuration

Set these in `.env.local` (or your host's env):

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO / OG / share links |
| `NEXT_PUBLIC_XINYU_URL` | Where the conversion CTA points |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional analytics |

## Future architecture (scaffolded, not built)

`supabase/schema.sql` already defines: `profiles`, `couples`, `invites`, `compatibility_reports`, `relationship_scores` — ready for **couple matching, invite partner, compatibility report, and relationship score** in a later phase.

---

由 心语 AI 情侣辅导师 出品 · MVP
