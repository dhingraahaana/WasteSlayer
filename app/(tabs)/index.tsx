import { useRef, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const userStats = {
  monthly: 24.8,
  co2: 41,
  items: 67,
  badges: 3,
};

function LoginScreen({ onLogin }: { onLogin: (name: string) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (step !== 2 || timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = () => {
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit number.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (!userName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    onLogin(userName.trim());
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={loginStyles.card}>
          <Text style={loginStyles.title}>
            {step === 1 ? "Verify Phone" : "Complete Profile"}
          </Text>
          {error ? <Text style={loginStyles.error}>{error}</Text> : null}

          {step === 1 ? (
            <TextInput
              style={loginStyles.input}
              placeholder="Enter Mobile Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="numeric"
              maxLength={10}
            />
          ) : (
            <View>
              <TextInput
                style={loginStyles.input}
                placeholder="Enter Your Full Name"
                value={userName}
                onChangeText={setUserName}
                autoCapitalize="words"
              />
              <TextInput
                style={loginStyles.input}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          )}

          <TouchableOpacity
            style={loginStyles.button}
            onPress={step === 1 ? handleSendOtp : handleVerifyOtp}
          >
            <Text style={loginStyles.buttonText}>
              {step === 1 ? "Send OTP" : "Verify & Proceed"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  const [loggedInName, setLoggedInName] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const recycleRef = useRef<View>(null);
  const impactRef = useRef<View>(null);
  const badgeRef = useRef<View>(null);
  const router = useRouter();

  if (!loggedInName) {
    return <LoginScreen onLogin={(name) => setLoggedInName(name)} />;
  }

  const user = { name: loggedInName, ...userStats };

  return (
    <ScrollView ref={scrollRef} style={styles.container}>
      {/* NAVBAR */}
      <View style={styles.navbar}>
        <Text style={styles.logo}>WasteSlayer</Text>

        <View style={styles.navLinks}>
          <TouchableOpacity
            onPress={() =>
              recycleRef.current?.measureLayout(
                scrollRef.current as any,
                (x, y) =>
                  scrollRef.current?.scrollTo({
                    y,
                    animated: true,
                  }),
                () => {},
              )
            }
          >
            <Text style={styles.link}>Ways to Recycle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              impactRef.current?.measureLayout(
                scrollRef.current as any,
                (x, y) =>
                  scrollRef.current?.scrollTo({
                    y,
                    animated: true,
                  }),
                () => {},
              )
            }
          >
            <Text style={styles.link}>Environmental Impact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              badgeRef.current?.measureLayout(
                scrollRef.current as any,
                (x, y) =>
                  scrollRef.current?.scrollTo({
                    y,
                    animated: true,
                  }),
                () => {},
              )
            }
          >
            <Text style={styles.link}>Badges</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HERO SECTION */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Hi, {user.name}! Let&apos;s slay some waste today.
        </Text>

        <Text style={styles.heroSubtitle}>
          track your e-waste production, earn rewards, learn how to recycle and
          help build a greener future.
        </Text>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() =>
            Alert.alert(
              "Whoa, slow down Captain Planet! 🌍",
              "We're still building the digital recycling bin. Hoard those broken charging cables for just a little longer.",
              [{ text: "Got it!", style: "default" }]
            )
          }
        >
          <Text style={styles.buttonText}>add today&apos;s e-waste</Text>
        </TouchableOpacity>
      </View>

      {/* RECYCLING SECTION */}
      <View style={styles.section} ref={recycleRef}>
        <Text style={styles.sectionTitle}>
          what are you planning to recycle today?
        </Text>

        <View style={styles.categoryContainer}>
          <TouchableOpacity style={styles.categoryButton} onPress={() => router.push({ pathname: '/chat', params: { initialPrompt: "What do I do with old batteries?" } })}>
            <Text style={styles.categoryText}>batteries</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton} onPress={() => router.push({ pathname: '/chat', params: { initialPrompt: "Can I recycle my phone?" } })}>
            <Text style={styles.categoryText}>phones</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton} onPress={() => router.push({ pathname: '/chat', params: { initialPrompt: "How to dispose a laptop?" } })}>
            <Text style={styles.categoryText}>laptops</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton} onPress={() => router.push({ pathname: '/chat', params: { initialPrompt: "Where do chargers go?" } })}>
            <Text style={styles.categoryText}>chargers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton} onPress={() => router.push({ pathname: '/chat', params: { initialPrompt: "How do I recycle other e-waste?" } })}>
            <Text style={styles.categoryText}>other</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.chatbotBox} onPress={() => router.push('/chat')}>
          <Text style={styles.chatbotText}>
            chat with your own recycling agent →
          </Text>
        </TouchableOpacity>
      </View>

      {/* TRACKERS */}
      <View style={styles.section} ref={impactRef}>
        <Text style={styles.sectionTitle}>your environmental impact</Text>

        <View style={styles.trackerCard}>
          <Text style={styles.trackerTitle}>monthly e-waste recycled</Text>

          <Text style={styles.trackerNumber}>{user.monthly} kg</Text>
        </View>

        <View style={styles.trackerCard}>
          <Text style={styles.trackerTitle}>co₂ emissions reduced</Text>

          <Text style={styles.trackerNumber}>{user.co2} kg</Text>
        </View>

        <View style={styles.trackerCard}>
          <Text style={styles.trackerTitle}>items saved from landfill</Text>

          <Text style={styles.trackerNumber}>{user.items} items</Text>
        </View>
      </View>

      {/* BADGES */}
      <View style={styles.section} ref={badgeRef}>
        <Text style={styles.sectionTitle}>earned badges</Text>

        {/* PRODUCT BADGES */}
        <Text style={styles.subheading}>saving indivual products</Text>

        <View style={styles.badgesContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>🪫</Text>
            <Text style={styles.badgeText}>battery bounty hunter</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>📱</Text>
            <Text style={styles.badgeText}>device whisperer</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>🔌</Text>
            <Text style={styles.badgeText}>toxic waste takedown</Text>
          </View>
        </View>

        {/* STREAKS */}
        <Text style={styles.subheading}>streaks</Text>

        <View style={styles.badgesContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>🌏</Text>
            <Text style={styles.badgeText}>eco addict</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>🌍</Text>
            <Text style={styles.badgeText}>trash transformer</Text>
          </View>
        </View>

        {/* CREATIVITY */}
        <Text style={styles.subheading}>creativity level</Text>

        <View style={styles.creativityCard}>
          <Text style={styles.creativityTitle}>future architect — level 3</Text>

          <View style={styles.progressBackground}>
            <View style={styles.progressFill} />
          </View>

          <Text style={styles.progressText}>70% to level 4</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F1E8",
    paddingHorizontal: 40,
    paddingTop: 50,
  },

  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: 34,
    color: "#4E6B57",
    fontWeight: "300",
  },

  navLinks: {
    flexDirection: "row",
    gap: 25,
  },

  link: {
    color: "#6E7F68",
    fontSize: 16,
  },

  hero: {
    marginTop: 100,
    alignItems: "center",
    marginBottom: 120,
  },

  heroTitle: {
    fontSize: 50,
    color: "#4E6B57",
    textAlign: "center",
    width: "75%",
    lineHeight: 65,
    fontWeight: "300",
    marginBottom: 25,
  },

  heroSubtitle: {
    fontSize: 18,
    color: "#7A8B76",
    textAlign: "center",
    width: "55%",
    lineHeight: 30,
    marginBottom: 40,
  },

  mainButton: {
    backgroundColor: "#4E6B57",
    paddingVertical: 18,
    paddingHorizontal: 34,
    borderRadius: 40,
  },

  buttonText: {
    color: "#F5F1E8",
    fontSize: 18,
    fontWeight: "600",
  },

  section: {
    marginBottom: 100,
  },

  sectionTitle: {
    fontSize: 36,
    color: "#4E6B57",
    marginBottom: 30,
    fontWeight: "300",
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginBottom: 35,
  },

  categoryButton: {
    backgroundColor: "#E3DDD1",
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 24,
  },

  categoryText: {
    color: "#4E6B57",
    fontSize: 17,
  },

  chatbotBox: {
    backgroundColor: "#D6E2D1",
    padding: 30,
    borderRadius: 28,
  },

  chatbotText: {
    color: "#4E6B57",
    fontSize: 20,
  },

  trackerCard: {
    backgroundColor: "#EFE9DE",
    padding: 30,
    borderRadius: 30,
    marginBottom: 25,
  },

  trackerTitle: {
    color: "#7A8B76",
    fontSize: 18,
    marginBottom: 10,
  },

  trackerNumber: {
    color: "#4E6B57",
    fontSize: 42,
    fontWeight: "600",
  },

  subheading: {
    fontSize: 24,
    color: "#6E7F68",
    marginBottom: 20,
    marginTop: 20,
  },

  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginBottom: 30,
  },

  badge: {
    backgroundColor: "#DDE8D8",
    padding: 25,
    borderRadius: 25,
    alignItems: "center",
    width: 180,
  },

  badgeEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },

  badgeText: {
    color: "#4E6B57",
    fontSize: 16,
    textAlign: "center",
  },

  creativityCard: {
    backgroundColor: "#E8E2D7",
    padding: 30,
    borderRadius: 30,
    marginTop: 10,
  },

  creativityTitle: {
    fontSize: 24,
    color: "#4E6B57",
    marginBottom: 20,
  },

  progressBackground: {
    width: "100%",
    height: 18,
    backgroundColor: "#D3CCBF",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#6E8B74",
  },

  progressText: {
    marginTop: 15,
    color: "#6E7F68",
    fontSize: 16,
  },
});

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F1E8",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4E6B57",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E3DDD1",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    color: "#4E6B57",
  },
  button: {
    backgroundColor: "#4E6B57",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#F5F1E8",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "#c0392b",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 14,
  },
});
