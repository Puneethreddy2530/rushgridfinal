export type ThemeTokens = Record<string, string>;

export function applyTheme(tokens: ThemeTokens) {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(tokens)) {
    root.style.setProperty(k, v);
  }
}