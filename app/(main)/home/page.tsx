export default function Home(){
    return (   
         <div className="bg-background min-h-screen p-8 space-y-10">
      
      {/* 🧾 PAGE HEADING */}
      <section className="space-y-2">
        <h1 className="font-display text-4xl">
          Editorial Social UI
        </h1>
        <p className="font-body text-neutral text-sm">
          Demonstrating your design system (surface, typography, buttons, cards)
        </p>
      </section>

      {/* 🎯 BUTTONS */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl">Buttons</h2>

        <div className="flex gap-4 flex-wrap">
          
          {/* ✅ PRIMARY BUTTON */}
          <button className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2 rounded-full">
            Primary Action
          </button>

          {/* ✅ SECONDARY BUTTON (GHOST) */}
          <button className="text-primary px-6 py-2 rounded-full ghost-border hover:bg-surface-low">
            Secondary
          </button>

          {/* ✅ TERTIARY BUTTON */}
          <button className="text-tertiary px-6 py-2 rounded-full">
            Alert Action
          </button>

        </div>
      </section>

      {/* 🧱 CARDS (TONAL LAYERING DEMO) */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl">Cards (Tonal Layering)</h2>

        {/* SECTION LAYER */}
        <div className="bg-surface-low p-6 rounded-xl">

          {/* CARD */}
          <div className="bg-surface-card p-6 rounded-xl space-y-3">
            
            <h3 className="font-display text-xl">
              Featured Post Title
            </h3>

            <p className="font-body text-sm text-neutral">
              This is body text using Be Vietnam Pro. It is clean, readable, and slightly condensed.
            </p>

            <div className="flex gap-4 text-sm">
              <span className="text-neutral">2h ago</span>
              <span className="text-primary">Author Name</span>
            </div>

          </div>
        </div>
      </section>

      {/* 📝 INPUT FIELD */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl">Input</h2>

        <input
          placeholder="Write something..."
          className="w-full p-3 rounded-lg bg-surface-active focus:bg-surface-card outline-none ghost-border focus:border-primary"
        />
      </section>

      {/* 🌫 GLASS EFFECT */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl">Glass Effect</h2>

        <div className="glass p-6 rounded-xl">
          <p className="text-sm">
            This is a glassmorphism container (blur + transparency)
          </p>
        </div>
      </section>

    </div>
    );
}