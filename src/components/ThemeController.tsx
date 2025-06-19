"use client";

import { FaChevronDown } from "react-icons/fa6";

function ThemeIcon(props: { theme?: string; className?: string }) {
  return (
    <div
      data-theme={props.theme}
      className={
        "rounded grid grid-cols-[8px_8px] auto-rows-[8px] gap-1 bg-base-200 p-1 " +
        props.className
      }
    >
      <div className="rounded bg-base-content" />
      <div className="rounded bg-primary" />
      <div className="rounded bg-secondary" />
      <div className="rounded bg-accent" />
    </div>
  );
}

export function ThemeController() {
  const setTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <div title="Change theme" className="dropdown dropdown-end">
      <button className="btn btn-ghost btn-sm px-0.5 gap-1 md:mr-2">
        <ThemeIcon className="scale-70" /> <FaChevronDown className="hidden sm:block" />
      </button>
      <ul className="dropdown-content rounded-box overflow-auto z-1 shadow-sm menu bg-base-200 grid grid-cols-1 max-h-[60vh] md:grid-cols-4 w-max mt-2">
        {themes.map((theme) => (
          <li key={theme}>
            <button
              type="button"
              className="flex items-center gap-2 p-2 whitespace-pre"
              onClick={() => setTheme(theme)}
            >
              <ThemeIcon theme={theme} />
              {theme}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
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
  "caramellatte",
  "abyss",
  "silk",
];
