import { colors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const radius = {
	sm: 6,
	md: 10,
	lg: 16,
	pill: 999,
  button: 8,
} as const;

export const shadow = {
	card: {
		shadowColor: "#000000",
		shadowOpacity: 0.08,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
		elevation: 2,
	},
} as const;

export const motion = {
	duration: { fast: 120, normal: 200, slow: 300 },
	easing: { standard: "ease-in-out", entrance: "ease-out", exit: "ease-in" },
} as const;

export const theme = { colors, spacing, typography, radius, shadow, motion } as const;
export type Theme = typeof theme;
export default theme;