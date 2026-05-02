# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Start Expo dev server (choose platform interactively)
npm run ios            # Start on iOS simulator
npm run android        # Start on Android emulator
npm run web            # Start in browser
npm run lint           # Run ESLint via expo lint
```

No test runner is configured yet.

## Architecture

WasteSlayer is an **Expo (React Native) app** using **expo-router** for file-based routing. The app slug is `ewaste-app` and targets iOS, Android, and web from a single codebase. React 19 Compiler is enabled (`experiments.reactCompiler: true`), so manual `useMemo`/`useCallback` optimizations are generally unnecessary.

### Routing

expo-router maps the `app/` directory to routes:

- `app/_layout.tsx` — root Stack navigator; wraps the whole app in `ThemeProvider` (light/dark via `useColorScheme`)
- `app/(tabs)/_layout.tsx` — bottom tab navigator (Home, Explore)
- `app/(tabs)/index.tsx` — Home screen (the main WasteSlayer UI)
- `app/(tabs)/explore.tsx` — Explore tab
- `app/modal.tsx` — modal screen accessible via stack navigation

### Theming

The theming system flows through three layers:

1. `constants/theme.ts` — exports `Colors` (light/dark palettes) and `Fonts` (platform-specific font stacks)
2. `hooks/use-theme-color.ts` — resolves a color key from `Colors` for the active scheme, with per-component light/dark overrides
3. `components/themed-text.tsx` / `components/themed-view.tsx` — themed wrappers around RN primitives; prefer these over raw `Text`/`View` when color-scheme awareness is needed

The Home screen (`index.tsx`) currently uses hardcoded hex values (`#4E6B57`, `#F5F1E8`, etc.) rather than the `Colors` constants — new UI should use `useThemeColor` and `Colors` from `constants/theme.ts`.

### Platform-specific files

expo-router and Metro resolve `.ios.tsx` before `.tsx`, so platform variants are placed at the same path with the suffix:

- `components/ui/icon-symbol.ios.tsx` — uses native `SymbolView` (SF Symbols) on iOS
- `components/ui/icon-symbol.tsx` — falls back to `MaterialIcons` on Android/web

When adding new SF Symbol icons, add the `SFSymbol → MaterialIcons` mapping in `components/ui/icon-symbol.tsx`.

### Path aliases

`@/` maps to the repo root (configured in `tsconfig.json`). Use `@/components/...`, `@/hooks/...`, `@/constants/...` throughout.

### Current app state

The Home screen has a hardcoded `user` object (name, monthly kg, CO₂, items, badges). Navigation links scroll to in-page sections using `measureLayout` refs. The category buttons (batteries, phones, laptops, etc.) and the chatbot CTA are UI-only stubs with no handlers yet.
