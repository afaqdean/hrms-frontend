/**
 * Utility functions for color manipulation
 */

/**
 * Converts a hex color to HSL format
 * @param hex - Hex color string (e.g., "#FF0000")
 * @returns HSL color string (e.g., "0 100% 50%")
 */
export const hexToHsl = (hex: string): string => {
  // Validate hex color format
  if (!hex || typeof hex !== 'string') {
    console.error('Invalid hex color: must be a string', hex);
    return '0 0% 0%'; // Default black
  }

  // Check if hex starts with # and has 6 characters after #
  if (!/^#[0-9A-F]{6}$/i.test(hex)) {
    console.error('Invalid hex color format:', hex);
    return '0 0% 0%'; // Default black
  }

  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};
