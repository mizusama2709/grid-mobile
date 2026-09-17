import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AmbientBackground } from '../components/AmbientBackground';
import { BottomNav, type NavTab } from '../components/BottomNav';
import { ConfirmSheet } from '../components/ConfirmSheet';
import { ScalePressable } from '../components/ScalePressable';
import { colors, fonts, gradientAt, gradients } from '../theme/colors';
import { logOut } from '../lib/auth';

type Listing = { title: string; price: string };
type Review = { author: string; rating: string; text: string };

const MY_LISTINGS: Listing[] = [
  { title: 'Product & Catalog Shoots', price: '₹2,900/hr' },
  { title: 'E-commerce Flatlay Package', price: '₹1,900' },
  { title: 'Brand Lookbook Shoot', price: '₹9,500/day' },
];

const REVIEWS: Review[] = [
  { author: 'Ritika S.', rating: '4.5', text: 'Delivered clean, well-lit product shots fast. Would book again.' },
  { author: 'Vivek N.', rating: '4.8', text: 'Great communication and understood the brand look immediately.' },
];

const STATS = [
  { value: '37', label: 'Bookings' },
  { value: '4.6', label: 'Rating' },
  { value: '3', label: 'Listings' },
];

const SETTINGS_LINKS = ['Account settings', 'Payment methods', 'Notifications', 'Help & support'];

type Props = {
  onNavigate?: (tab: NavTab, opts?: { threadId?: number }) => void;
};

export function ProfileScreen({ onNavigate }: Props) {
  const insets = useSafeAreaInsets();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));

  const handleLogOut = async () => {
    setSigningOut(true);
    // Reverse of App.tsx's post-splash reveal (260ms fade+scale) before the
    // real signOut() flips App.tsx's user state and unmounts this screen.
    opacity.value = withTiming(0, { duration: 260, easing: Easing.in(Easing.ease) });
    scale.value = withTiming(1.03, { duration: 260, easing: Easing.in(Easing.ease) });
    await new Promise((r) => setTimeout(r, 260));
    await logOut();
  };

  return (
    <Animated.View style={[styles.screen, fadeStyle]}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 128 }]}>
        <View style={[styles.header, { paddingTop: insets.top + 22 }]}>
          <LinearGradient colors={gradients.avatar} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={styles.avatar} />
          <Text style={styles.name}>Meher Prasad</Text>
          <Text style={styles.role}>Photographer · Hyderabad</Text>
          <Text style={styles.bio}>
            Product &amp; catalog photography. Shooting for D2C brands across Hyderabad since 2021.
          </Text>
          <View style={styles.statsRow}>
            {STATS.map((st) => (
              <View key={st.label} style={styles.stat}>
                <Text style={styles.statNumber}>{st.value}</Text>
                <Text style={styles.statLabel}>{st.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>My listings</Text>
            <View style={{ gap: 9 }}>
              {MY_LISTINGS.map((l, i) => (
                <View key={l.title} style={styles.listingRow}>
                  <LinearGradient colors={gradientAt(i + 5)} style={styles.listingThumb} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.listingTitle}>{l.title}</Text>
                    <Text style={styles.listingPrice}>{l.price}</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Reviews received</Text>
            <View style={{ gap: 10 }}>
              {REVIEWS.map((r) => (
                <View key={r.author} style={styles.reviewCard}>
                  <View style={styles.reviewTop}>
                    <Text style={styles.reviewAuthor}>{r.author}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Text style={styles.star}>★</Text>
                      <Text style={styles.reviewRating}>{r.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{r.text}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.settingsBox}>
            {SETTINGS_LINKS.map((label, i) => (
              <ScalePressable
                key={label}
                style={[styles.settingsRow, i === SETTINGS_LINKS.length - 1 && styles.settingsRowLast]}
                scaleTo={0.97}
                haptic={false}
              >
                <Text style={styles.settingsLabel}>{label}</Text>
                <Text style={styles.chevron}>›</Text>
              </ScalePressable>
            ))}
            <ScalePressable
              style={[styles.settingsRow, styles.settingsRowLast]}
              onPress={() => setLogoutVisible(true)}
              scaleTo={0.97}
              haptic
            >
              <Text style={styles.logoutLabel}>Log out</Text>
            </ScalePressable>
          </View>
        </View>
      </ScrollView>

      <BottomNav active="profile" onNavigate={(tab) => onNavigate?.(tab)} />

      <ConfirmSheet
        visible={logoutVisible}
        onClose={() => setLogoutVisible(false)}
        title="Log out?"
        subtitle="You'll need to sign in again to access your account."
        primaryLabel="Log out"
        onPrimary={handleLogOut}
        primaryLoading={signingOut}
        secondaryLabel="Cancel"
        onSecondary={() => setLogoutVisible(false)}
        destructive
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingBottom: 130 },
  header: { paddingTop: 58, paddingBottom: 24, paddingHorizontal: 22, alignItems: 'center', gap: 10 },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  name: { fontFamily: fonts.semiBold, fontSize: 21, letterSpacing: -0.6, color: colors.textPrimary, marginTop: 4 },
  role: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textSecondary },
  bio: {
    fontFamily: fonts.regular,
    fontSize: 13.5,
    color: colors.chipTextAlt,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 290,
    marginTop: 4,
  },
  statsRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 16 },
  stat: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statNumber: { fontFamily: fonts.semiBold, fontSize: 19, letterSpacing: -0.5, color: colors.textPrimary },
  statLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginTop: 3 },
  body: { paddingHorizontal: 22, gap: 26 },
  section: { gap: 12 },
  sectionLabel: { fontFamily: fonts.semiBold, fontSize: 15, letterSpacing: -0.3, color: colors.textPrimary },
  listingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 11,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listingThumb: { width: 46, height: 46, borderRadius: 14 },
  listingTitle: { fontFamily: fonts.medium, fontSize: 14, letterSpacing: -0.2, color: colors.textPrimary },
  listingPrice: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 3 },
  chevron: { fontSize: 16, color: colors.textMuted },
  star: { fontSize: 10, color: colors.gold },
  reviewCard: { padding: 14, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 },
  reviewAuthor: { fontFamily: fonts.medium, fontSize: 13.5, color: colors.textPrimary },
  reviewRating: { fontFamily: fonts.regular, fontSize: 12, color: colors.chipTextAlt },
  reviewText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: '#A0A0A9' },
  settingsBox: { borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  settingsRowLast: { borderBottomWidth: 0 },
  settingsLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.textPrimary },
  logoutLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.orange },
});
