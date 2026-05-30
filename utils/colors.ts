export const tailwindColorToHex: Record<string, string> = {
  red: "#EF4444",
  orange: "#F97316",
  yellow: "#EAB308",
  green: "#22C55E",
  teal: "#14B8A6",
  cyan: "#06B6D4",
  blue: "#3B82F6",
  indigo: "#6366F1",
  purple: "#A855F7",
  pink: "#EC4899",
  rose: "#F43F5E",
  stone: "#78716C",
};

export function resolveColor(color: string): string {
  return tailwindColorToHex[color] ?? color;
}

export const PRESET_COLOR_NAMES = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "purple",
  "pink",
];
