import { colorsTuple, createTheme, virtualColor } from '@mantine/core';

export const theme = createTheme({
  colors: {
    // Create a 10-step scale color tuple from your hex color (Mantine expects array of 10 shades)
    // Mantine’s colorsTuple helper generates this from a base hex.
    'brand-gold': colorsTuple('#FFB800'), // Honey Gold (warm, bright)
    'brand-blue': colorsTuple('#004E8F'), // Deep Blue (trust, stable)

    // Define primary virtual color switching between dark/light modes
    primary: virtualColor({
      name: 'primary',
      light: 'brand-blue', // Primary color in light mode
      dark: 'brand-gold', // Primary color in dark mode
    }),
  },
  primaryColor: 'primary',
  other: {
    anchor: 'primary', // anchor/link color follows primary
  },
});
