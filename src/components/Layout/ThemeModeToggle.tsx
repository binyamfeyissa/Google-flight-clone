import React from "react";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import { useThemeMode, ColorMode } from "@/theme/ThemeModeProvider";

const modeOptions: { value: ColorMode; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Brightness7Icon /> },
  { value: "dark", label: "Dark", icon: <Brightness4Icon /> },
  { value: "system", label: "System", icon: <SettingsBrightnessIcon /> },
];

const ThemeModeToggle: React.FC = () => {
  const { mode, setMode } = useThemeMode();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="body2" sx={{ mr: 1 }}>
        Theme:
      </Typography>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, value) => value && setMode(value)}
        size="small"
        aria-label="theme mode"
      >
        {modeOptions.map((opt) => (
          <ToggleButton key={opt.value} value={opt.value} aria-label={opt.label}>
            {opt.icon}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default ThemeModeToggle;
