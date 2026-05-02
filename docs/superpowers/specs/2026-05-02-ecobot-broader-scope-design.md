# EcoBot Broader Scope Design

**Date:** 2026-05-02  
**Status:** Approved

## Problem

EcoBot currently restricts responses to a narrow e-waste topic list (phones, batteries, chargers, laptops, cables). Any question outside that list gets a hard deflection. This underutilises the LLM's knowledge and limits the app's value to users with broader environmental questions.

## Goal

Expand EcoBot's scope to cover the full range of environmental and sustainability topics, while keeping the bot purposeful and eco-focused.

## Covered Topics (new scope)

- E-waste: phones, batteries, laptops, chargers, cables
- Recycling: plastic, paper, glass, metal
- Composting and food waste
- Energy saving and renewable energy
- Water conservation
- Carbon footprint and climate change
- Sustainable living and eco-friendly habits

## Out-of-scope deflection

For questions genuinely unrelated to any environmental topic, EcoBot replies:
> "That's outside my eco expertise! Try asking me about recycling, composting, energy saving, or sustainability ♻️"

## Changes

### 1. System prompt (`SYSTEM_PROMPT` in `app/chat.tsx`)

- Replace the narrow e-waste topic list with the expanded list above.
- Replace the old out-of-scope reply with the new deflection text.
- Keep all other guidance unchanged: 2–4 sentence responses, action-oriented, environmental impact facts, warm closings.

### 2. Quick replies (`QUICK_REPLIES` in `app/chat.tsx`)

Replace current chips with:
1. "What do I do with old batteries?"
2. "How do I reduce plastic waste?"
3. "Tips for saving energy at home"
4. "How to start composting?"
5. "Tell me an eco fact 🌍"

## What stays the same

- Bot name and personality: EcoBot 🌱
- Response length: 2–4 sentences
- Tone: friendly, action-oriented
- Warm closing lines
- All UI and styling

## Files affected

- `app/chat.tsx` — `SYSTEM_PROMPT` constant and `QUICK_REPLIES` array only
