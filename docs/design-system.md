# HistaStack / HistaTracker Design System

## Overview & Principles

HistaStack is the brand; HistaTracker is the tracking app. The experience follows five principles: calm over chaotic, clarity over complexity, support over fear, science over hype, and consistency over novelty.

Tagline: **Track. Balance. Thrive.**

## Design Tokens

Canonical tokens live in `src/styles/colors.ts`, `spacing.ts`, `typography.ts`, and `theme.ts`.

- Primary green: `#2E8F6F`; deep green: `#1F5F49`; mint: `#A8E8C9`.
- Light canvas: `#F9FAF9`; surface: `#FFFFFF`; text: `#2A2A2A` and `#666666`.
- Dark canvas: `#1F1F1F`; surface: `#262626`; text: `#F9FAF9` and `#C0C0C0`.
- Small eyebrow labels use deep green `#1F5F49` in light mode and mint `#A8E8C9` in dark mode.
- Status colors: error `#D9534F`, warning `#F0AD4E`, success `#5CB85C`.
- Spacing uses a 4px base and 8px grid: 4, 8, 12, 16, 24, 32, 40.
- Typography uses Inter Regular, Medium, and Bold. Sizes are 12, 14, 16, 20, 24, and 32px.
- Radii: 6px, 10px, 16px, and pill. Cards use 10px; buttons use 8px.
- Card shadow uses black at 8% opacity, radius 8, offset (0, 4).
- Motion durations are 120, 200, and 300ms with standard, entrance, and exit easing tokens.

Use `useAppColors()` for system-aware screen and component colors. Do not hard-code a light palette into new UI.

## Themes

Light and dark semantic palettes are defined in `src/styles/colors.ts`. `src/hooks/useAppColors.ts` selects the palette from the system color scheme. The root layout loads Inter before hiding the native splash screen and updates status-bar and tab colors for the active scheme.

## Components & Patterns

- `Button`: primary, secondary, and ghost variants; supports pressed, disabled, and loading states. Legacy `solid`, `outline`, and `quiet` variants map to the semantic variants.
- `Input`: persistent label plus focused, disabled, helper, and error states.
- `Card`: surface background, consistent padding, 10px radius, subtle border and shadow. Avoid nesting cards.
- `Section`: consistent section spacing and heading hierarchy.
- Keep primary actions clear, secondary actions outlined, and low-emphasis actions ghosted.

## Navigation & Layout

Expo Router provides bottom tabs for Home, Triggers, Insights, Log, History, and Settings. Keep the primary tabs visible and use the existing `ScreenFrame` for scrollable screens. Standard horizontal screen padding is 16px.

## Content & Voice

Use short, factual, supportive copy. Explain patterns as observations from a person's own logs. Do not claim to diagnose, predict reactions, or establish medical causation; product briefing claims must be verified against official sources.

## Accessibility

- Keep interactive targets at least 44px high.
- Give icon-only controls an accessible label and state.
- Pair color states with text, labels, or shape changes.
- Preserve visible focus and error states for inputs.
- Check contrast for text and controls in both themes, and allow text to wrap at larger sizes.

## Assets & Usage

- `assets/images/Hista Logo.png`: canonical Hista logo used for the app header, favicon, launcher, and splash.

Do not stretch logos. Expo configuration in `app.json` controls launcher, favicon, and light/dark splash assets.
