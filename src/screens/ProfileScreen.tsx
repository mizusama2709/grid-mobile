import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../theme/colors';

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

const SETTINGS_LINKS = ['Account settings', 'Payment methods', 'Notifications', 'Help & support'];

const NAV_ITEMS = ['Explore', 'Bookings', 'Messages', 'Profile'] as const;

type Props = {
  onNavigate?: (tab: 'explore' | 'bookings' | 'messages' | 'profile') => void;
};

export function ProfileScreen({ onNavigate }: Props) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatar} />
          <Text style={styles.name}>Meher Prasad</Text>
          <Text style={styles.role}>PHOTOGRAPHER · HYDERABAD</Text>
          <Text style={styles.bio}>
            Product &amp; catalog photography. Shooting for D2C brands across Hyderabad since 2021.
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>37</Text>
              <Text style={styles.statLabel}>BOOKINGS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>4.6</Text>
              <Text style={styles.statLabel}>RATING</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>LISTINGS</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>My Listings</Text>
            <View style={{ gap: 8 }}>
              {MY_LISTINGS.map((l) => (
                <View key={l.title} style={styles.listingRow}>
                  <View style={styles.listingThumb}>
                    <Text style={styles.listingThumbText}>{l.title}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listingTitle}>{l.title}</Text>
                    <Text style={styles.listingPrice}>{l.price}</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Reviews Received</Text>
            <View style={{ gap: 12 }}>
              {REVIEWS.map((r) => (
                <View key={r.author} style={styles.reviewCard}>
                  <View style={styles.reviewTop}>
                    <Text style={styles.reviewAuthor}>{r.author}</Text>
                    <Text style={styles.reviewRating}>★ {r.rating}</Text>
                  </View>
                  <Text style={styles.reviewText}>{r.text}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.settingsBox}>
            {SETTINGS_LINKS.map((label) => (
              <TouchableOpacity key={label} style={styles.settingsRow}>
                <Text style={styles.settingsLabel}>{label}</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.settingsRow, styles.settingsRowLast]}>
              <Text style={styles.logoutLabel}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.navBar}>
        {NAV_ITEMS.map((label) => (
          <TouchableOpacity
            key={label}
            style={styles.navItem}
            onPress={() => label !== 'Profile' && onNavigate?.(label.toLowerCase() as any)}
          >
            <Text style={[styles.navText, label === 'Profile' && styles.navTextActive]}>
              {label.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  scrollContent: { paddingBottom: 100 },
  header: {
    paddingTop: 26,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20,19,16,0.15)',
  },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.violet },
  name: { fontFamily: fonts.headingBold, fontSize: 18, color: colors.ink },
  role: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.grey, letterSpacing: 0.3 },
  bio: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    textAlign: 'center',
    maxWidth: 280,
    marginTop: 6,
  },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 4, alignItems: 'center' },
  stat: { alignItems: 'center', paddingHorizontal: 6 },
  statNumber: { fontFamily: fonts.monoSemiBold, fontSize: 14, color: colors.ink },
  statLabel: { fontFamily: fonts.mono, fontSize: 7.5, color: colors.grey, marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(20,19,16,0.15)' },
  body: { padding: 20, gap: 20 },
  section: { gap: 10 },
  sectionLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: 8.5,
    color: colors.violet,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(20,19,16,0.15)',
    padding: 10,
  },
  listingThumb: { width: 44, height: 44, backgroundColor: colors.paperDim, alignItems: 'center', justifyContent: 'center' },
  listingThumbText: { fontFamily: fonts.mono, fontSize: 5.5, color: colors.grey, textAlign: 'center', padding: 2 },
  listingTitle: { fontFamily: fonts.monoSemiBold, fontSize: 11.5, color: colors.ink },
  listingPrice: { fontFamily: fonts.mono, fontSize: 9, color: colors.grey, marginTop: 2 },
  chevron: { fontSize: 14, color: colors.grey },
  reviewCard: { borderWidth: 1, borderColor: 'rgba(20,19,16,0.12)', padding: 12 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewAuthor: { fontFamily: fonts.monoSemiBold, fontSize: 11, color: colors.ink },
  reviewRating: { fontFamily: fonts.mono, fontSize: 10, color: colors.violet },
  reviewText: { fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, lineHeight: 16 },
  settingsBox: { borderWidth: 1, borderColor: 'rgba(20,19,16,0.15)' },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20,19,16,0.1)',
  },
  settingsRowLast: { borderBottomWidth: 0 },
  settingsLabel: { fontFamily: fonts.mono, fontSize: 11.5, color: colors.ink },
  logoutLabel: { fontFamily: fonts.mono, fontSize: 11.5, color: '#B04A3F' },
  navBar: {
    height: 78,
    backgroundColor: colors.paper,
    borderTopWidth: 1.5,
    borderTopColor: colors.ink,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 5 },
  navText: { fontFamily: fonts.mono, fontSize: 8, letterSpacing: 0.3, color: colors.grey },
  navTextActive: { color: colors.violet },
});
