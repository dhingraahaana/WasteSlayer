import { useRef } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const user = {
  name: "bob",
  monthly: 24.8,
  co2: 41,
  items: 67,
  badges: 3,
};

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);

  const recycleRef = useRef<View>(null);
  const impactRef = useRef<View>(null);
  const badgeRef = useRef<View>(null);
  const router = useRouter();

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

        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.buttonText}>add today&apos;s e-waste</Text>
        </TouchableOpacity>
      </View>

      {/* RECYCLING SECTION */}
      <View style={styles.section} ref={recycleRef}>
        <Text style={styles.sectionTitle}>
          what are you planning to recycle today?
        </Text>

        <View style={styles.categoryContainer}>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>batteries</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>phones</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>laptops</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>chargers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton}>
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
