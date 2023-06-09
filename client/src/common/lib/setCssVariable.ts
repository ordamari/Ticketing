export function setCssVariables(data: Record<string, string>) {
  for (const [key, value] of Object.entries(data)) {
    document.documentElement.style.setProperty(`--${key}`, value);
  }
}
