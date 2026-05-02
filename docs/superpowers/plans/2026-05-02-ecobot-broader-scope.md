# EcoBot Broader Scope Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand EcoBot's topic coverage from e-waste-only to the full range of environmental and sustainability topics, and refresh quick reply chips to match.

**Architecture:** Two constants in `app/chat.tsx` need updating — `SYSTEM_PROMPT` (topic list + off-topic deflection) and `QUICK_REPLIES` (5 chips). No structural changes; no new files.

**Tech Stack:** React Native, Expo, TypeScript

---

### Task 1: Update SYSTEM_PROMPT to cover broader environmental topics

**Files:**
- Modify: `app/chat.tsx` (lines 24–32)

- [ ] **Step 1: Open `app/chat.tsx` and locate `SYSTEM_PROMPT`**

The current constant starts at line 24 and reads:

```ts
const SYSTEM_PROMPT =
  "You are EcoBot 🌱, a friendly e-waste recycling assistant for the WasteSlayer app. " +
  "Your job is to educate users about e-waste, suggest recycling and disposal methods, and encourage eco-friendly habits. " +
  "Keep responses short and natural — 2–4 sentences max. " +
  "Be action-oriented: tell users what they can actually DO (donate, repair, drop-off, recycle). " +
  "Include a relevant environmental impact fact when it fits naturally. " +
  "Cover batteries, phones, laptops, chargers, cables, and general e-waste. " +
  "For anything outside that scope, reply: \"I'm still learning! Try asking me about phones, batteries, chargers, or recycling ♻️\". " +
  "End conversations warmly — e.g. \"Thanks for recycling! 🌍\", \"Every device counts 💚\", \"You're making the planet greener 🌿\".";
```

- [ ] **Step 2: Replace `SYSTEM_PROMPT` with the expanded version**

```ts
const SYSTEM_PROMPT =
  "You are EcoBot 🌱, a friendly environmental assistant for the WasteSlayer app. " +
  "Your job is to educate users about sustainability, help them make eco-friendly choices, and inspire positive environmental habits. " +
  "Keep responses short and natural — 2–4 sentences max. " +
  "Be action-oriented: tell users what they can actually DO. " +
  "Include a relevant environmental impact fact when it fits naturally. " +
  "Cover e-waste (phones, batteries, laptops, chargers, cables), recycling (plastic, paper, glass, metal), composting and food waste, energy saving and renewable energy, water conservation, carbon footprint and climate change, and sustainable living. " +
  "For anything outside environmental topics, reply: \"That's outside my eco expertise! Try asking me about recycling, composting, energy saving, or sustainability ♻️\". " +
  "End conversations warmly — e.g. \"Thanks for going green! 🌍\", \"Every action counts 💚\", \"You're making the planet greener 🌿\".";
```

- [ ] **Step 3: Verify the file saves without TypeScript errors**

Run: `npm run lint`
Expected: no errors related to `chat.tsx`

---

### Task 2: Refresh QUICK_REPLIES chips to reflect broader scope

**Files:**
- Modify: `app/chat.tsx` (lines 72–78)

- [ ] **Step 1: Locate `QUICK_REPLIES` in `app/chat.tsx`**

Current value:

```ts
const QUICK_REPLIES = [
  "What do I do with old batteries?",
  "Can I recycle my phone?",
  "Where do chargers go?",
  "How to dispose a laptop?",
  "Tell me an eco fact 🌍",
];
```

- [ ] **Step 2: Replace with the broader set**

```ts
const QUICK_REPLIES = [
  "What do I do with old batteries?",
  "How do I reduce plastic waste?",
  "Tips for saving energy at home",
  "How to start composting?",
  "Tell me an eco fact 🌍",
];
```

- [ ] **Step 3: Commit both changes**

```bash
git add app/chat.tsx
git commit -m "feat: expand EcoBot scope to all environmental topics"
```

Expected: commit succeeds, working tree clean.

---

### Task 3: Manual smoke test

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run ios` (or `npm run web` for quick check)

- [ ] **Step 2: Open the EcoBot chat screen**

Verify the 5 new quick reply chips appear: "What do I do with old batteries?", "How do I reduce plastic waste?", "Tips for saving energy at home", "How to start composting?", "Tell me an eco fact 🌍"

- [ ] **Step 3: Test an expanded-scope question**

Type: "How do I reduce my carbon footprint?"
Expected: EcoBot gives a helpful 2–4 sentence answer with actionable tips — NOT the deflection message.

- [ ] **Step 4: Test composting**

Type: "How do I start composting at home?"
Expected: helpful answer about composting steps/bins.

- [ ] **Step 5: Test off-topic deflection**

Type: "What's a good pasta recipe?"
Expected: "That's outside my eco expertise! Try asking me about recycling, composting, energy saving, or sustainability ♻️"

- [ ] **Step 6: Test original e-waste still works**

Tap quick reply: "What do I do with old batteries?"
Expected: helpful e-waste disposal answer.
