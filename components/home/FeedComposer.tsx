import { Bell, Image, Search, Smile } from "lucide-react";

export default function FeedComposer() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-full bg-surface-active px-4 py-3 text-sm text-on-surface-variant">
          <Search className="h-4 w-4 text-primary" />
          <input
            type="text"
            placeholder="Explore skysocial"
            className="w-full bg-transparent outline-none placeholder:text-on-surface-variant/70"
          />
        </div>

        <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-active text-primary transition hover:bg-surface-low">
          <Bell className="h-4 w-4" />
        </button>
      </div>

      <div className="create-post home-panel bg-white rounded-4xl overflow-hidden px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
        <div className="flex min-h-[100px] items-start gap-4">
          <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0d464e] via-[#16757d] to-[#4ec5cf] text-sm font-bold text-white shadow-[0_8px_20px_rgba(78,197,207,0.24)]">
            A
          </div>

          <div className="flex-1 ">
            <textarea
              placeholder="Share something ethereal..."
              className="min-h-[50px] w-full resize-none bg-transparent pt-4 text-lg font-semibold text-on-surface outline-none placeholder:text-[#d8cde1]"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/25 pt-4">
              <div className="flex items-center gap-1 text-primary">
                {[Image, Smile].map((Icon, index) => (
                  <button
                    key={index}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-primary transition hover:bg-surface-low"
                  >
                    <Icon className="h-[18px] w-[18px]  " />
                  </button>
                ))}
              </div>

              <button className="rounded-full bg-gradient-to-r from-primary to-primary-container px-8 py-2.5 text-sm font-semibold text-on-primary  transition hover:translate-y-[-1px]">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
