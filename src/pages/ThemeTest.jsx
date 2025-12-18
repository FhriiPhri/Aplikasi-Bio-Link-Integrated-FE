export default function ThemeTest() {
  const themes = [
    "light",
    "dark",
    "cupcake",
    "retro",
    "synthwave",
    "forest",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
    "bumblebee",
  ];

  return (
    <div className="min-h-screen p-10 space-y-8">
      <h1 className="text-3xl font-bold">Test Theme daisyUI v4</h1>

      {/* Theme Switcher */}
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button
            key={theme}
            className="btn btn-sm"
            onClick={() =>
              document
                .getElementById("theme-root")
                .setAttribute("data-theme", theme)
            }
          >
            {theme}
          </button>
        ))}
      </div>

      {/* Theme Preview */}
      <div
        id="theme-root"
        data-theme="cupcake"
        className="p-8 rounded-box bg-base-200 space-y-6"
      >
        <div className="space-x-2">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-accent">Accent</button>
        </div>

        <div className="card bg-base-100 shadow-xl w-96">
          <div className="card-body">
            <h2 className="card-title">Card Test</h2>
            <p>Ini buat ngetes theme daisyUI</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">OK</button>
            </div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Input test"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
    </div>
  );
}
