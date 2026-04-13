import { Sparkles } from "lucide-react";

type Trend = {
  label: string;
  topic: string;
  count: string;
};

type Suggestion = {
  name: string;
  handle: string;
  tone: string;
};

type RightRailProps = {
  trends: Trend[];
  suggestions: Suggestion[];
};

export default function RightRail({ trends, suggestions }: RightRailProps) {
  return (
    <aside className="space-y-5 ">
      <section className="home-panel bg-white rounded-4xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-on-surface">
            Celestial Trends
          </h2>
        </div>

        <div className="space-y-4">
          {trends.map((trend) => (
            <div key={trend.topic} className="space-y-0">
              <p className="text-[11px] font-medium text-on-surface-variant">
                {trend.label}
              </p>
              <p className="text-sm font-bold text-on-surface">{trend.topic}</p>
              <p className="text-[11px] text-on-surface-variant">
                {trend.count}
              </p>
            </div>
          ))}
        </div>

        <button className="mt-5 text-xs font-semibold text-primary text-center w-full transition cursor-pointer hover:bg-surface-low rounded-full py-2">
          Show more
        </button>
      </section>

      <section className="home-panel bg-white rounded-4xl p-5">
        <h2 className="mb-4 text-sm font-bold text-on-surface">
          Suggested People
        </h2>

        <div className="space-y-4">
          {suggestions.map((person) => (
            <div key={person.handle} className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full bg-gradient-to-br ${person.tone}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-on-surface">
                  {person.name}
                </p>
                <p className="truncate text-xs text-on-surface-variant">
                  {person.handle}
                </p>
              </div>
              <button className="rounded-full bg-surface-low px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-surface-active">
                Follow
              </button>
            </div>
          ))}
        </div>
      </section>
      <div className="mt-6 space-y-2 text-[10px] uppercase tracking-[0.18em] text-on-surface-variant/70">
        <div className="flex flex-wrap gap-x-3 gap-y-2  transition cursor-pointer">
          <span className="hover:text-primary">Terms</span>
          <span className="hover:text-primary">Privacy</span>
          <span className="hover:text-primary">Help</span>
          <span className="hover:text-primary">Ad Choices</span>
        </div>
        <p>&copy; 2026 SkySocial</p>
      </div>
    </aside>
  );
}
