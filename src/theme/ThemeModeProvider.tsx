import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { theme as baseTheme } from "@/theme";

export type ColorMode = "light" | "dark" | "system";

interface ThemeModeContextProps {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextProps | undefined>(undefined);

export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeModeProvider");
  return ctx;
};

function getSystemMode(): "light" | "dark" {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ColorMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("colorMode") as ColorMode) || "system";
    }
    return "system";
  });

  useEffect(() => {
    localStorage.setItem("colorMode", mode);
  }, [mode]);

  // Listen to system changes if in system mode
  useEffect(() => {
    if (mode !== "system") return;
    const handler = () => setMode("system");
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handler);
    return () => window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", handler);
  }, [mode]);

  const muiMode = mode === "system" ? getSystemMode() : mode;

  const theme = useMemo(() =>
    createTheme({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        mode: muiMode,
        background: muiMode === "dark"
          ? { default: "#202124", paper: "#23272f" }
          : baseTheme.palette.background,
        text: muiMode === "dark"
          ? { primary: "#f1f5f9", secondary: "#cbd5e1" }
          : baseTheme.palette.text,
      },
    }), [muiMode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
