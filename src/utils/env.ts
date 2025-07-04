// src/utils/env.ts
export function getEnvVar(key: string): string | undefined {
  try {
    // In Vite / next-lite modules   → import.meta.env is defined.
    if (typeof import.meta !== "undefined" && (import.meta as any).env) {
      return (import.meta as any).env[key] as string | undefined
    }
    // Fallback to Node / Jest where process.env is available.
    if (typeof process !== "undefined" && process.env) {
      return process.env[key] as string | undefined
    }
  } catch {
    /* ignore – return undefined below */
  }
  return undefined
}
