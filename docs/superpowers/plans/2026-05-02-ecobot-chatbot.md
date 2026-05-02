# EcoBot Chatbot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-screen modal chatbot (`app/chat.tsx`) powered by the Gemini API that educates users about e-waste recycling, reachable by tapping the chatbot CTA on the Home screen.

**Architecture:** A single self-contained `app/chat.tsx` screen holds all state (`messages`, `inputText`, `isLoading`) and calls the Gemini REST API directly via `fetch`. The system prompt is injected as the first user/model turn pair in the `contents` array on every request. Navigation is handled by expo-router's stack modal pattern.

**Tech Stack:** React Native, Expo Router, TypeScript, Gemini REST API (`gemini-2.0-flash`), React Native `Animated` API, `KeyboardAvoidingView`, `FlatList`.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `.gitignore` | Edit | Add `.env` so the API key is never committed |
| `.env` | Create | Hold `EXPO_PUBLIC_GEMINI_API_KEY` |
| `app/_layout.tsx` | Edit | Register `chat` as a modal stack screen |
| `app/(tabs)/index.tsx` | Edit | Wire `router.push('/chat')` to the chatbot CTA |
| `app/chat.tsx` | Create | Full chat screen — state, Gemini API call, UI |

---

## Task 1: Protect the API key

**Files:**
- Modify: `.gitignore`
- Create: `.env`

- [ ] **Step 1: Add `.env` to `.gitignore`**

Open `.gitignore` and add `.env` on a new line in the "local env files" section so it sits alongside `.env*.local`:

```
# local env files
.env*.local
.env
```

- [ ] **Step 2: Create `.env` with the Gemini API key placeholder**

Create `.env` at the repo root:

```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with a real key from [Google AI Studio](https://aistudio.google.com/app/apikey) before running the app.

- [ ] **Step 3: Verify `.env` is ignored**

```bash
git status
```

Expected: `.env` does NOT appear in the output (it should be ignored). If it appears as an untracked file, double-check `.gitignore` was saved correctly.

- [ ] **Step 4: Commit the `.gitignore` change only**

```bash
git add .gitignore
git commit -m "chore: ignore .env files"
```

---

## Task 2: Register the chat screen in the root layout

**Files:**
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Add the `chat` stack screen**

Open `app/_layout.tsx`. The current file is:

```tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
```

Add the `chat` screen entry after the `modal` screen:

```tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="chat" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat: register chat modal screen in root layout"
```

---

## Task 3: Wire the chatbot CTA on the Home screen

**Files:**
- Modify: `app/(tabs)/index.tsx`

- [ ] **Step 1: Add the router import**

At the top of `app/(tabs)/index.tsx`, add the `useRouter` import alongside the existing imports:

```tsx
import { useRef } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
```

- [ ] **Step 2: Instantiate the router inside the component**

Inside `HomeScreen`, add one line after the existing `useRef` declarations:

```tsx
export default function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const recycleRef = useRef<View>(null);
  const impactRef = useRef<View>(null);
  const badgeRef = useRef<View>(null);
  const router = useRouter();
  // ...rest unchanged
```

- [ ] **Step 3: Add `onPress` to the chatbot box**

Find this block (~line 126):

```tsx
<TouchableOpacity style={styles.chatbotBox}>
  <Text style={styles.chatbotText}>
    chat with your own recycling agent →
  </Text>
</TouchableOpacity>
```

Replace it with:

```tsx
<TouchableOpacity style={styles.chatbotBox} onPress={() => router.push('/chat')}>
  <Text style={styles.chatbotText}>
    chat with your own recycling agent →
  </Text>
</TouchableOpacity>
```

- [ ] **Step 4: Verify the app starts without errors**

```bash
npm run web
```

Expected: app loads, no TypeScript or import errors in the terminal. Tapping the chatbot box should navigate (it will 404 or crash until `app/chat.tsx` is created in the next task — that's expected).

- [ ] **Step 5: Commit**

```bash
git add app/(tabs)/index.tsx
git commit -m "feat: wire chatbot CTA to chat modal route"
```

---

## Task 4: Build the chat screen

**Files:**
- Create: `app/chat.tsx`

This is the main task. Build it in sub-steps.

### 4a — Scaffold with static greeting (no API yet)

- [ ] **Step 1: Create `app/chat.tsx` with static structure**

```tsx
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: number;
};

const GREETING: Message = {
  id: "greeting",
  role: "bot",
  text: "Hey! I'm EcoBot 🌱 I help you figure out what to do with your e-waste. What have you got? ♻️",
  timestamp: Date.now(),
};

const QUICK_REPLIES = [
  "What do I do with old batteries?",
  "Can I recycle my phone?",
  "Where do chargers go?",
  "How to dispose a laptop?",
  "Tell me an eco fact 🌍",
];

export default function ChatScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<Message>>(null);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      text: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setShowQuickReplies(false);

    // Gemini API call added in 4b
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "bot",
          text: "(EcoBot response coming soon)",
          timestamp: Date.now(),
        },
      ]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EcoBot 🌱</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* MESSAGE LIST */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={scrollToBottom}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubbleWrapper,
              item.role === "user" ? styles.bubbleWrapperUser : styles.bubbleWrapperBot,
            ]}
          >
            <View
              style={[
                styles.bubble,
                item.role === "user" ? styles.bubbleUser : styles.bubbleBot,
              ]}
            >
              <Text
                style={
                  item.role === "user" ? styles.bubbleTextUser : styles.bubbleTextBot
                }
              >
                {item.text}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          isLoading ? <TypingIndicator /> : null
        }
      />

      {/* QUICK REPLIES */}
      {showQuickReplies && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickRepliesScroll}
          contentContainerStyle={styles.quickRepliesContent}
        >
          {QUICK_REPLIES.map((reply) => (
            <TouchableOpacity
              key={reply}
              style={styles.chip}
              onPress={() => sendMessage(reply)}
            >
              <Text style={styles.chipText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* INPUT BAR */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about e-waste..."
          placeholderTextColor="#9BA8A0"
          onSubmitEditing={() => sendMessage(inputText)}
          returnKeyType="send"
          multiline={false}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      ).start();

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.bubbleWrapperBot}>
      <View style={[styles.bubble, styles.bubbleBot, styles.typingBubble]}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.Text key={i} style={[styles.dot, { opacity: dot }]}>
            ●
          </Animated.Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F1E8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E3DDD1",
    backgroundColor: "#F5F1E8",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4E6B57",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 60,
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: "#6E7F68",
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  bubbleWrapper: {
    marginBottom: 12,
    flexDirection: "row",
  },
  bubbleWrapperBot: {
    justifyContent: "flex-start",
    paddingRight: 60,
  },
  bubbleWrapperUser: {
    justifyContent: "flex-end",
    paddingLeft: 60,
  },
  bubble: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: "100%",
  },
  bubbleBot: {
    backgroundColor: "#D6E2D1",
  },
  bubbleUser: {
    backgroundColor: "#4E6B57",
  },
  bubbleTextBot: {
    color: "#4E6B57",
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: "#F5F1E8",
    fontSize: 15,
    lineHeight: 22,
  },
  typingBubble: {
    flexDirection: "row",
    gap: 4,
    paddingVertical: 14,
  },
  dot: {
    color: "#4E6B57",
    fontSize: 10,
  },
  quickRepliesScroll: {
    flexShrink: 0,
    paddingVertical: 8,
  },
  quickRepliesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: "#E3DDD1",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  chipText: {
    color: "#4E6B57",
    fontSize: 14,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFE9DE",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F1E8",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#4E6B57",
  },
  sendButton: {
    backgroundColor: "#4E6B57",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#B5C4B1",
  },
  sendIcon: {
    color: "#F5F1E8",
    fontSize: 16,
  },
});
```

- [ ] **Step 2: Run the app and verify static UI**

```bash
npm run ios
```

Expected: Tapping "chat with your own recycling agent →" on the Home screen opens the EcoBot modal. The greeting message appears. Quick reply chips are visible. Tapping a chip shows a stub "(EcoBot response coming soon)" bot bubble. The ✕ button closes the modal. Typing indicator dots animate while loading.

### 4b — Connect the Gemini API

- [ ] **Step 3: Replace the stub with a real Gemini API call**

In `app/chat.tsx`, find and replace the `sendMessage` function's stub block (the `setTimeout` call) with the real Gemini implementation.

Replace this section inside `sendMessage`:

```tsx
    // Gemini API call added in 4b
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "bot",
          text: "(EcoBot response coming soon)",
          timestamp: Date.now(),
        },
      ]);
      setIsLoading(false);
    }, 800);
```

With:

```tsx
    try {
      const botReply = await callGemini([...messages, userMessage]);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "bot",
          text: botReply,
          timestamp: Date.now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "bot",
          text: "Oops, I couldn't reach the internet 🌐 Try again in a moment!",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
```

- [ ] **Step 4: Add the `SYSTEM_PROMPT` constant and `callGemini` function**

Add these above the `GREETING` constant (after the `Message` type):

```tsx
const SYSTEM_PROMPT =
  "You are EcoBot 🌱, a friendly e-waste recycling assistant for the WasteSlayer app. " +
  "Your job is to educate users about e-waste, suggest recycling and disposal methods, and encourage eco-friendly habits. " +
  "Keep responses short and natural — 2–4 sentences max. " +
  "Be action-oriented: tell users what they can actually DO (donate, repair, drop-off, recycle). " +
  "Include a relevant environmental impact fact when it fits naturally. " +
  "Cover batteries, phones, laptops, chargers, cables, and general e-waste. " +
  "For anything outside that scope, reply: \"I'm still learning! Try asking me about phones, batteries, chargers, or recycling ♻️\". " +
  "End conversations warmly — e.g. \"Thanks for recycling! 🌍\", \"Every device counts 💚\", \"You're making the planet greener 🌿\".";

async function callGemini(conversationMessages: Message[]): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing EXPO_PUBLIC_GEMINI_API_KEY");

  // Build contents: system prompt injected as first user/model pair, then real conversation
  const contents = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    { role: "model", parts: [{ text: "Got it! I'm EcoBot, ready to help with e-waste. 🌱" }] },
    ...conversationMessages
      .filter((m) => m.id !== "greeting") // greeting is local only
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    }
  );

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I didn't catch that — try again! ♻️";
}
```

- [ ] **Step 5: Set a real API key in `.env`**

Edit `.env`:

```
EXPO_PUBLIC_GEMINI_API_KEY=<your_real_key_from_aistudio>
```

Get a free key at https://aistudio.google.com/app/apikey — no billing required for `gemini-2.0-flash` at low volume.

- [ ] **Step 6: Restart the dev server to load the new env var**

Expo only reads `.env` at startup. Stop the server (`Ctrl+C`) and restart:

```bash
npm run ios
```

- [ ] **Step 7: Manual smoke test the chatbot**

Open the chat modal and verify:

1. Greeting appears automatically on open
2. Tapping a quick reply chip sends it as a user message and gets a real EcoBot response
3. Typing a custom message and pressing Send works
4. Quick reply chips disappear after the first message
5. Asking "what's the weather?" triggers the fallback: "I'm still learning! Try asking me about phones, batteries, chargers, or recycling ♻️"
6. Typing indicator (animated dots) shows while waiting for Gemini
7. Tapping ✕ or swiping down closes the modal

- [ ] **Step 8: Commit**

```bash
git add app/chat.tsx
git commit -m "feat: add EcoBot chatbot screen with Gemini API integration"
```

---

## Task 5: Final wiring verification

- [ ] **Step 1: Check TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No errors or warnings.

- [ ] **Step 3: Commit any lint fixes if needed**

```bash
git add -A
git commit -m "fix: lint and type errors in chat screen"
```

---

## Summary of commits

| Commit | Files |
|---|---|
| `chore: ignore .env files` | `.gitignore` |
| `feat: register chat modal screen in root layout` | `app/_layout.tsx` |
| `feat: wire chatbot CTA to chat modal route` | `app/(tabs)/index.tsx` |
| `feat: add EcoBot chatbot screen with Gemini API integration` | `app/chat.tsx` |
| `fix: lint and type errors in chat screen` *(if needed)* | various |
