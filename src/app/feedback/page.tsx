import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getArchetype } from "@/data/archetypes";
import { EVENT_NAMES, type EventName } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "数据看板",
  robots: { index: false, follow: false },
};

const COOKIE = "feedback_auth";

async function isAuthed(): Promise<boolean> {
  const pw = process.env.FEEDBACK_PASSWORD;
  if (!pw) return false;
  const store = await cookies();
  return store.get(COOKIE)?.value === pw;
}

// ---- server action: password login ----
async function login(formData: FormData) {
  "use server";
  const pw = process.env.FEEDBACK_PASSWORD;
  const input = String(formData.get("password") ?? "");
  if (pw && input === pw) {
    const store = await cookies();
    store.set(COOKIE, input, {
      httpOnly: true,
      sameSite: "lax",
      path: "/feedback",
      maxAge: 60 * 60 * 8,
    });
    redirect("/feedback");
  }
  redirect("/feedback?e=1");
}

async function logout() {
  "use server";
  const store = await cookies();
  store.delete(COOKIE);
  redirect("/feedback");
}

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const sp = await searchParams;
  if (!(await isAuthed())) {
    return <Login error={sp.e === "1"} notConfigured={!process.env.FEEDBACK_PASSWORD} />;
  }
  return <Dashboard />;
}

// ===========================================================================
// Login
// ===========================================================================
function Login({ error, notConfigured }: { error?: boolean; notConfigured?: boolean }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <form action={login} className="w-full max-w-xs">
        <div className="mb-6 text-center">
          <div className="text-3xl">🔒</div>
          <h1 className="mt-2 text-lg font-bold text-white">数据看板</h1>
          <p className="mt-1 text-xs text-slate-400">Love Archetype · Analytics</p>
        </div>
        {notConfigured ? (
          <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-center text-xs text-amber-300">
            未配置 FEEDBACK_PASSWORD 环境变量
          </p>
        ) : (
          <>
            <input
              type="password"
              name="password"
              autoFocus
              placeholder="访问密码"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />
            {error && (
              <p className="mt-2 text-center text-xs text-rose-400">密码错误，请重试</p>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98]"
            >
              进入
            </button>
          </>
        )}
      </form>
    </main>
  );
}

// ===========================================================================
// Dashboard
// ===========================================================================
async function Dashboard() {
  const admin = getSupabaseAdmin();

  if (!admin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-950 px-6 text-center">
        <div className="text-3xl">⚙️</div>
        <h1 className="text-lg font-bold text-white">尚未连接 Supabase</h1>
        <p className="max-w-sm text-sm text-slate-400">
          请配置 <code className="text-indigo-300">NEXT_PUBLIC_SUPABASE_URL</code> 与{" "}
          <code className="text-indigo-300">SUPABASE_SERVICE_ROLE_KEY</code> 后刷新本页。
        </p>
        <form action={logout}>
          <button className="mt-2 text-xs text-slate-500 underline">退出</button>
        </form>
      </main>
    );
  }

  // ---- counts per event ----
  const countEntries = await Promise.all(
    EVENT_NAMES.map(async (name) => {
      const { count } = await admin
        .from("event_logs")
        .select("*", { count: "exact", head: true })
        .eq("event_name", name);
      return [name, count ?? 0] as const;
    })
  );
  const counts = Object.fromEntries(countEntries) as Record<EventName, number>;

  // ---- archetype distribution (from completed tests) ----
  const { data: completed } = await admin
    .from("event_logs")
    .select("archetype")
    .eq("event_name", "test_completed")
    .limit(10000);
  const archCounts = new Map<string, number>();
  for (const row of completed ?? []) {
    const a = (row as { archetype: string | null }).archetype;
    if (a) archCounts.set(a, (archCounts.get(a) ?? 0) + 1);
  }
  const archDist = [...archCounts.entries()].sort((a, b) => b[1] - a[1]);
  const archMax = archDist[0]?.[1] ?? 1;

  // ---- traffic sources (from landing views) ----
  const { data: landings } = await admin
    .from("event_logs")
    .select("metadata")
    .eq("event_name", "landing_view")
    .limit(10000);
  const srcCounts = new Map<string, number>();
  for (const row of landings ?? []) {
    const md = (row as { metadata: Record<string, unknown> | null }).metadata ?? {};
    const src = (md.source as string) || "direct";
    srcCounts.set(src, (srcCounts.get(src) ?? 0) + 1);
  }
  const sources = [...srcCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  const srcMax = sources[0]?.[1] ?? 1;

  // ---- latest 50 events ----
  const { data: latest } = await admin
    .from("event_logs")
    .select("id,created_at,session_id,event_name,archetype,metadata")
    .order("created_at", { ascending: false })
    .limit(50);

  // ---- funnel ----
  const visitors = counts.landing_view;
  const started = counts.test_started;
  const done = counts.test_completed;
  const shared = counts.share_clicked;
  const xinyu = counts.xinyu_clicked;
  const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);

  const funnel = [
    { label: "访客 Visitors", value: visitors, step: 100 },
    { label: "开始测试 Started", value: started, step: pct(started, visitors) },
    { label: "完成测试 Completed", value: done, step: pct(done, started) },
    { label: "分享 Shared", value: shared, step: pct(shared, done) },
    { label: "点击心语 Xinyu", value: xinyu, step: pct(xinyu, shared) },
  ];

  const STAT_LABELS: Record<EventName, string> = {
    landing_view: "总访客",
    test_started: "开始测试",
    test_completed: "完成测试",
    share_card_generated: "生成分享卡",
    share_clicked: "点击分享",
    xinyu_clicked: "点击心语",
  };

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">📊 数据看板</h1>
            <p className="text-xs text-slate-400">Love Archetype · 实时漏斗与事件</p>
          </div>
          <form action={logout}>
            <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300">
              退出
            </button>
          </form>
        </header>

        {/* Stat cards */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {EVENT_NAMES.map((name) => (
            <div key={name} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="text-xs text-slate-400">{STAT_LABELS[name]}</div>
              <div className="mt-1 text-2xl font-extrabold tabular-nums">
                {counts[name].toLocaleString()}
              </div>
            </div>
          ))}
        </section>

        {/* Funnel */}
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-slate-300">转化漏斗</h2>
          <div className="space-y-2.5">
            {funnel.map((f, i) => (
              <div key={f.label} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{f.label}</span>
                  <span className="tabular-nums text-slate-400">
                    {f.value.toLocaleString()}
                    {i > 0 && <span className="ml-2 text-indigo-400">{f.step}%</span>}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500"
                    style={{ width: `${Math.max(pct(f.value, visitors), 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-right text-xs text-slate-500">
            访客 → 心语 总转化率：
            <span className="ml-1 font-semibold text-indigo-300">{pct(xinyu, visitors)}%</span>
          </p>
        </section>

        {/* Archetype distribution */}
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-slate-300">守护灵分布</h2>
          {archDist.length === 0 ? (
            <Empty />
          ) : (
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900 p-4">
              {archDist.map(([id, n]) => {
                const a = getArchetype(id);
                return (
                  <div key={id}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-slate-200">
                        {a ? `${a.animalEmoji} ${a.spiritName}` : id}
                      </span>
                      <span className="tabular-nums text-slate-400">
                        {n} · {pct(n, done)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max((n / archMax) * 100, 3)}%`,
                          background: a?.theme.accent ?? "#6366f1",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Traffic sources */}
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-slate-300">流量来源</h2>
          {sources.length === 0 ? (
            <Empty />
          ) : (
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900 p-4">
              {sources.map(([src, n]) => (
                <div key={src}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="truncate text-slate-200">{src}</span>
                    <span className="tabular-nums text-slate-400">{n}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${Math.max((n / srcMax) * 100, 3)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Latest events */}
        <section className="mt-8 mb-10">
          <h2 className="mb-3 text-sm font-semibold text-slate-300">最近 50 条事件</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-medium">时间</th>
                  <th className="px-3 py-2 font-medium">事件</th>
                  <th className="px-3 py-2 font-medium">守护灵</th>
                  <th className="px-3 py-2 font-medium">来源/会话</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(latest ?? []).map((row) => {
                  const r = row as {
                    id: string;
                    created_at: string;
                    session_id: string;
                    event_name: string;
                    archetype: string | null;
                    metadata: Record<string, unknown> | null;
                  };
                  const a = r.archetype ? getArchetype(r.archetype) : null;
                  const src = (r.metadata?.source as string) || "";
                  return (
                    <tr key={r.id} className="bg-slate-950/40">
                      <td className="whitespace-nowrap px-3 py-2 text-slate-400">
                        {new Date(r.created_at).toLocaleString("zh-CN", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-200">
                          {r.event_name}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-300">
                        {a ? `${a.animalEmoji} ${a.spiritName}` : r.archetype ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-slate-500">
                        {src || r.session_id.slice(0, 8)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {(latest?.length ?? 0) === 0 && (
            <p className="mt-3 text-center text-xs text-slate-500">暂无事件数据</p>
          )}
        </section>
      </div>
    </main>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-xs text-slate-500">
      暂无数据
    </div>
  );
}
