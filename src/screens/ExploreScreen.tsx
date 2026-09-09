import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GridLogo } from '../components/GridLogo';
import { colors, fonts } from '../theme/colors';

type Listing = {
  id: number;
  category: string;
  title: string;
  provider: string;
  location: string;
  price: string;
  rating: string;
};

const CATEGORIES = ['All', 'Photographer', 'Studio', 'Model', 'MUA', 'Videographer'];

const LISTINGS: Listing[] = [
  { id: 1, category: 'Photographer', title: 'Golden Hour Portraits', provider: 'Kavya R.', location: 'Jubilee Hills', price: '₹3,500/hr', rating: '4.9' },
  { id: 2, category: 'Studio', title: 'Loft 9 Cyclorama Studio', provider: 'Loft 9', location: 'Gachibowli', price: '₹1,800/hr', rating: '4.8' },
  { id: 3, category: 'MUA', title: 'Editorial Glam Makeup', provider: 'Sana K.', location: 'Banjara Hills', price: '₹2,200', rating: '5.0' },
  { id: 4, category: 'Model', title: 'Runway & Lookbook Model', provider: 'Ishaan T.', location: 'Kondapur', price: '₹4,000/day', rating: '4.7' },
  { id: 5, category: 'Videographer', title: 'Cinematic Reel Shoots', provider: 'Arjun V.', location: 'Madhapur', price: '₹6,000/hr', rating: '4.9' },
  { id: 6, category: 'Photographer', title: 'Product & Catalog Shoots', provider: 'Meher P.', location: 'Hitech City', price: '₹2,900/hr', rating: '4.6' },
  { id: 7, category: 'Studio', title: 'Daylight Infinity Studio', provider: 'Frame House', location: 'Banjara Hills', price: '₹2,400/hr', rating: '4.9' },
  { id: 8, category: 'MUA', title: 'Bridal & HD Makeup', provider: 'Neha S.', location: 'Jubilee Hills', price: '₹5,500', rating: '5.0' },
];

const NAV_ITEMS = ['Explore', 'Bookings', 'Saved', 'Profile'];

export function ExploreScreen() {
  const [activeCat, setActiveCat] = useState('All');
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  const filtered = useMemo(
    () => (activeCat === 'All' ? LISTINGS : LISTINGS.filter((l) => l.category === activeCat)),
    [activeCat]
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <GridLogo size={18} />
          <View style={styles.bellButton}>
            <Text style={styles.bellIcon}>🔔</Text>
          </View>
        </View>

        <Text style={styles.heading}>Explore</Text>
        <Text style={styles.tagline}>book &amp; get booked // hyderabad</Text>

        <Text style={styles.searchLabel}>[ SEARCH ]</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>search photographers, studios, MUAs…</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {CATEGORIES.map((cat) => {
            const active = cat === activeCat;
            return (
              <TouchableOpacity key={cat} onPress={() => setActiveCat(cat)} style={styles.catItem}>
                <Text style={[styles.catText, active && styles.catTextActive]}>
                  {cat.toUpperCase()}
                </Text>
                <View style={[styles.catUnderline, active && styles.catUnderlineActive]} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>{item.title}</Text>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{item.category.toUpperCase()}</Text>
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setSaved((s) => ({ ...s, [item.id]: !s[item.id] }))}
              >
                <Text style={[styles.saveIcon, saved[item.id] && styles.saveIconActive]}>
                  {saved[item.id] ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.cardMeta}>
                {item.provider} · {item.location}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardPrice}>{item.price}</Text>
                <Text style={styles.cardRating}>★ {item.rating}</Text>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.navBar}>
        {NAV_ITEMS.map((label, i) => (
          <View key={label} style={styles.navItem}>
            <Text style={[styles.navText, i === 0 && styles.navTextActive]}>
              {label.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 0 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  bellButton: {
    width: 34,
    height: 34,
    borderWidth: 1.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: { fontSize: 14 },
  heading: {
    fontFamily: fonts.headingBold,
    fontSize: 26,
    letterSpacing: -0.4,
    color: colors.ink,
    marginBottom: 4,
  },
  tagline: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 18,
  },
  searchLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: 8.5,
    color: colors.violet,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 7,
  },
  searchBar: {
    borderWidth: 1.5,
    borderColor: colors.ink,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  searchIcon: { fontSize: 12 },
  searchPlaceholder: { fontFamily: fonts.mono, fontSize: 12, color: colors.grey },
  catRow: {
    gap: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20,19,16,0.15)',
  },
  catItem: { alignItems: 'center' },
  catText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.3,
    color: colors.grey,
    marginBottom: 8,
  },
  catTextActive: { fontFamily: fonts.monoSemiBold, color: colors.ink },
  catUnderline: { height: 2, width: '100%', backgroundColor: 'transparent' },
  catUnderlineActive: { backgroundColor: colors.violet },
  gridContent: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 100 },
  gridRow: { gap: 14, marginBottom: 14 },
  card: { flex: 1, borderWidth: 1, borderColor: 'rgba(20,19,16,0.15)', backgroundColor: '#fff' },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: colors.paperDim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  imagePlaceholderText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.grey,
    textAlign: 'center',
  },
  categoryTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(237,234,226,0.92)',
    borderWidth: 1,
    borderColor: colors.ink,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  categoryTagText: { fontFamily: fonts.mono, fontSize: 7.5, letterSpacing: 0.4, color: colors.ink },
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    backgroundColor: 'rgba(237,234,226,0.92)',
    borderWidth: 1,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: { fontSize: 12, color: colors.ink },
  saveIconActive: { color: colors.violet },
  cardBody: { padding: 9, paddingTop: 8, paddingBottom: 10, gap: 4 },
  cardTitle: { fontFamily: fonts.headingBold, fontSize: 12, letterSpacing: -0.2, color: colors.ink, lineHeight: 15 },
  cardMeta: { fontFamily: fonts.mono, fontSize: 8.5, color: colors.grey },
  cardFooter: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 2 },
  cardPrice: { fontFamily: fonts.monoMedium, fontSize: 11, color: colors.ink },
  cardRating: { fontFamily: fonts.mono, fontSize: 8.5, color: colors.violet },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
