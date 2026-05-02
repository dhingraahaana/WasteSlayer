# EcoBot Chatbot — Design Spec

**Date:** 2026-05-02  
**Feature:** E-waste recycling chatbot accessible from the Home screen  
**Status:** Approved

---

## Overview

A full-screen modal chat interface powered by the Gemini API that educates users about e-waste recycling. The bot has a friendly personality (EcoBot 🌱), gives short action-oriented answers, and encourages eco-friendly habits. Accessible by tapping "chat with your own recycling agent →" on the Home screen.

---

## 1. Navigation & Screen Structure

- Tapping the chatbot CTA in `app/(tabs)/index.tsx` calls `router.push('/chat')`
- `app/chat.tsx` is a new file registered as a stack screen in `app/_layout.tsx` with `presentation: 'modal'` and `headerShown: false`
- The modal can be dismissed via swipe-down or a close button (✕) in the top-right corner of the screen's own header bar
- The tab bar and `(tabs)/_layout.tsx` are unchanged

---

## 2. Gemini API Integration

- **Model:** `gemini-2.0-flash`
- **Transport:** direct `fetch` to the Gemini REST endpoint — no SDK dependency
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=EXPO_PUBLIC_GEMINI_API_KEY`
- **API key:** `EXPO_PUBLIC_GEMINI_API_KEY` in `.env` (gitignored); referenced via `process.env.EXPO_PUBLIC_GEMINI_API_KEY`

### System Prompt

The system prompt is a constant in `app/chat.tsx`. Gemini does not use a `system` role — it is injected as the first `user` turn in the `contents` array, with an immediate `model` turn acknowledging it (a common Gemini pattern to simulate a system prompt via the REST API):

> You are EcoBot 🌱, a friendly e-waste recycling assistant for the WasteSlayer app. Your job is to educate users about e-waste, suggest recycling and disposal methods, and encourage eco-friendly habits. Keep responses short and natural — 2–4 sentences max. Be action-oriented: tell users what they can actually DO (donate, repair, drop-off, recycle). Include a relevant environmental impact fact when it fits naturally. Cover batteries, phones, laptops, chargers, cables, and general e-waste. For anything outside that scope, reply: "I'm still learning! Try asking me about phones, batteries, chargers, or recycling ♻️". End conversations warmly — e.g. "Thanks for recycling! 🌍", "Every device counts 💚", "You're making the planet greener 🌿".

### Conversation history

The full `messages` array (system prompt + all prior turns) is included in every API request so the model has context across the conversation.

### Error handling

If the API call fails (network error, invalid key, rate limit), the bot appends a friendly error bubble: *"Oops, I couldn't reach the internet 🌐 Try again in a moment!"* — no crash, no unhandled promise rejection.

---

## 3. UI Design

### Color palette (consistent with Home screen)

| Element | Color |
|---|---|
| Screen background | `#F5F1E8` |
| Bot bubble background | `#D6E2D1` |
| Bot bubble text | `#4E6B57` |
| User bubble background | `#4E6B57` |
| User bubble text | `#F5F1E8` |
| Quick reply chip background | `#E3DDD1` |
| Quick reply chip text | `#4E6B57` |
| Input bar background | `#EFE9DE` |
| Input send button | `#4E6B57` |

### Layout (top to bottom)

1. **Header bar** — "EcoBot 🌱" title centered, ✕ close button top-right, subtle bottom border (`#E3DDD1`)
2. **Message list** — `FlatList`, newest messages at bottom. Bot bubbles left-aligned, user bubbles right-aligned. `borderRadius: 20`, small left/right indent to visually indicate sender. Typing indicator (animated three dots) shown while `isLoading` is true.
3. **Quick reply chips** — horizontal `ScrollView` of pill buttons shown below the most recent bot message. Chips disappear once the user sends any message. Default chips:
   - "What do I do with old batteries?"
   - "Can I recycle my phone?"
   - "Where do chargers go?"
   - "How to dispose a laptop?"
   - "Tell me an eco fact 🌍"
4. **Input bar** — pinned to bottom, `TextInput` + send `TouchableOpacity` (arrow icon). Wrapped in `KeyboardAvoidingView` (behavior `padding` on iOS, `height` on Android) so the input is never hidden by the software keyboard.

### Typing indicator

Three dots animated with React Native's built-in `Animated` API (opacity fade loop) — no third-party library.

---

## 4. Data Flow & State

All state is local to `app/chat.tsx`:

```ts
type Message = {
  id: string;         // uuid or timestamp string
  role: 'user' | 'bot';
  text: string;
  timestamp: number;
};

messages: Message[]
inputText: string
isLoading: boolean
```

### Send flow

1. User types in `TextInput` or taps a quick reply chip
2. User `Message` appended to `messages`; `inputText` cleared; `isLoading: true`
3. Gemini API called with system prompt + full `messages` history
4. Bot `Message` appended to `messages`; `isLoading: false`
5. `FlatList` scrolls to bottom via `scrollToEnd`

### Opening state

On mount, the bot automatically appends a greeting message (no API call needed — hardcoded):

> "Hey! I'm EcoBot 🌱 I help you figure out what to do with your e-waste. What have you got? ♻️"

This ensures the chat never opens to a blank screen.

### Persistence

None — conversation is in-memory only, cleared when the modal is closed. No AsyncStorage or database in this version.

---

## 5. Files Changed / Created

| File | Change |
|---|---|
| `app/chat.tsx` | **New** — full chat screen |
| `app/_layout.tsx` | **Edit** — register `chat` stack screen with `presentation: 'modal'` |
| `app/(tabs)/index.tsx` | **Edit** — wire `router.push('/chat')` to chatbot CTA button |
| `.env` | **New** — `EXPO_PUBLIC_GEMINI_API_KEY=<key>` |
| `.gitignore` | **Verify** — `.env` is already ignored (Expo default includes it) |

---

## Out of Scope (this version)

- Conversation persistence across sessions
- User authentication / per-user chat history
- Backend proxy for the API key
- Push notifications
- Voice input
