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

  const contents = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    { role: "model", parts: [{ text: "Got it! I'm EcoBot, ready to help with e-waste. 🌱" }] },
    ...conversationMessages
      .filter((m) => m.id !== "greeting")
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    }
  );

  if (response.status === 429) throw new Error("rate_limit");
  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I didn't catch that — try again! ♻️";
}

const createGreeting = (): Message => ({
  id: "greeting",
  role: "bot",
  text: "Hey! I'm EcoBot 🌱 I help you figure out what to do with your e-waste. What have you got? ♻️",
  timestamp: Date.now(),
});

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
  const msgIdRef = useRef(0);
  const nextId = () => String(++msgIdRef.current);
  const [messages, setMessages] = useState<Message[]>(() => [createGreeting()]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderMessage = ({ item }: { item: Message }) => (
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
  );

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: nextId(),
      role: "user",
      text: text.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    setIsLoading(true);
    setShowQuickReplies(false);
    setTimeout(scrollToBottom, 50);

    try {
      const botReply = await callGemini(updatedMessages);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "bot",
          text: botReply,
          timestamp: Date.now(),
        },
      ]);
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      const isRateLimit = err instanceof Error && err.message === "rate_limit";
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "bot",
          text: isRateLimit
            ? "I'm getting a lot of questions right now 🌿 Give me a moment and try again!"
            : "Oops, I couldn't reach the internet 🌐 Try again in a moment!",
          timestamp: Date.now(),
        },
      ]);
      setTimeout(scrollToBottom, 50);
    } finally {
      setIsLoading(false);
    }
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
        renderItem={renderMessage}
        ListFooterComponent={isLoading ? <TypingIndicator /> : null}
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
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
          ]}
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
