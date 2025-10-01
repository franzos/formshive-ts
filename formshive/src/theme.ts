import { colorsTuple, createTheme, MantineTheme, virtualColor } from '@mantine/core';

// Custom CSS variables resolver to properly override Mantine's background variables
export const cssVariablesResolver = (theme: MantineTheme) => ({
  variables: {
    // Variables that don't change between color schemes
    '--mantine-scale': theme.scale.toString(),
  },
  light: {
    // Light mode background overrides
    '--mantine-color-body': theme.colors['neutral-light'][0],
    '--mantine-color-default': theme.white,
    '--mantine-color-default-hover': theme.colors['neutral-light'][1],
    '--mantine-color-default-border': theme.colors['neutral-light'][3],
  },
  dark: {
    // Dark mode background overrides - warm tones to match gradient
    '--mantine-color-body': '#0a0700',              // Matches gradient end color
    '--mantine-color-default': '#1a1300',           // Dark warm surface
    '--mantine-color-default-hover': '#221800',     // Slightly lighter warm hover
    '--mantine-color-default-border': '#332400',    // Warm subtle borders

    // Override specific dark color variables that components use - warm tones
    '--mantine-color-dark-6': '#1a1300',            // Card backgrounds (warm)
    '--mantine-color-dark-7': '#0a0700',            // Main backgrounds (matches gradient)
    '--mantine-color-dark-5': '#221800',            // Hover states (warm)
    '--mantine-color-dark-4': '#332400',            // Borders (warm)
    '--mantine-color-dark-8': '#050400',            // Deep backgrounds (very dark warm)
  }
});

export const theme = createTheme({
  colors: {
    // Generic color names that work across all themes
    'brand-primary': colorsTuple('#FFB800'),    // Honey Gold
    'brand-secondary': colorsTuple('#004E8F'),  // Deep Blue
    'brand-accent': colorsTuple('#00A3AA'),     // Teal
    'neutral-light': colorsTuple('#F7F9FA'),    // Soft Gray
    'neutral-dark': colorsTuple('#2E2E2E'),     // Charcoal Gray
    'alert-color': colorsTuple('#FF4B3E'),      // Coral Red

    // Define primary virtual color switching between dark/light modes
    primary: virtualColor({
      name: 'primary',
      light: 'brand-secondary', // Deep Blue in light mode
      dark: 'brand-primary', // Honey Gold in dark mode
    }),
  },
  primaryColor: 'primary',
  other: {
    anchor: 'primary', // anchor/link color follows primary
  },
});
