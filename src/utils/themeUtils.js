const isBrowser = typeof window !== 'undefined';

export const getCssVariableValue = (variableName, fallback = '') => {
  if (!isBrowser) return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName);
  return value ? value.trim() : fallback;
};

const expandHex = (hex) => {
  if (!hex) return null;
  const normalized = hex.replace('#', '');
  if (normalized.length === 3) {
    return normalized
      .split('')
      .map((char) => `${char}${char}`)
      .join('');
  }
  if (normalized.length === 6) {
    return normalized;
  }
  return null;
};

export const hexToRgba = (hex, alpha = 1) => {
  const expanded = expandHex(hex);
  if (!expanded) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  const bigint = parseInt(expanded, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getChartPalette = () => {
  const primary = getCssVariableValue('--color-primary-500', '#0894E2');
  const primaryTint = hexToRgba(primary, 0.18);
  const secondary = getCssVariableValue('--color-secondary-500', '#10B981');
  const secondaryTint = hexToRgba(secondary, 0.16);
  const muted = getCssVariableValue('--color-text-secondary', '#6b7280');
  const border = getCssVariableValue('--color-border', '#e2e8f0');

  return {
    primary,
    primaryTint,
    secondary,
    secondaryTint,
    muted,
    border,
  };
};


