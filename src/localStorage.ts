export function loadLocal(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function saveLocal(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    console.warn("Failed to save local storage item", key);
  }
}
