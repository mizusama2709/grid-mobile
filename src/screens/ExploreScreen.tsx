import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { GridLogo } from '../components/GridLogo';
import { ScalePressable } from '../components/ScalePressable';
import { AmbientBackground } from '../components/AmbientBackground';
import { BottomNav, type NavTab } from '../components/BottomNav';
import { ListingCard, type Listing } from '../components/ListingCard';
import { ListingDetail } from './ListingDetail';
import { colors, fonts, gradients } from '../theme/colors';

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

type Props = {
  onNavigate?: (tab: NavTab, opts?: { threadId?: number }) => void;
};

export function ExploreScreen({ onNavigate }: Props) {
  const [activeCat, setActiveCat] = useState('All');
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [detailId, setDetailId] = useState<number | null>(null);

  const filtered = useMemo(
    () => (activeCat === 'All' ? LISTINGS : LISTINGS.filter((l) => l.category === activeCat)),
    [activeCat]
  );
  const detail = LISTINGS.find((l) => l.id === detailId) ?? null;

  if (detail) {
    return (
      <ListingDetail
        listing={detail}
        saved={!!saved[detail.id]}
        onToggleSave={() => setSaved((s) => ({ ...s, [detail.id]: !s[detail.id] }))}
        onClose={() => setDetailId(null)}
        onMessage={() => {
          setDetailId(null);
          onNavigate?.('messages', { threadId: 1 });
        }}
      />
    );
  }

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <View style={styles.headerRow}>
          <GridLogo size={17} />
          <View style={styles.bellButton}>
            <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
              <Path d="M6 10a6 6 0 0112 0v4l1.5 3h-15L6 14v-4z" stroke="#C9C9D1" strokeWidth={1.8} strokeLinejoin="round" />
            </Svg>
            <View style={styles.bellDot} />
          </View>
        </View>

        <Text style={styles.heading}>Explore</Text>
        <Text style={styles.tagline}>Photographers, studios and crew near you.</Text>

        <View style={styles.searchBar}>
          <View style={{ flex: 1.1, minWidth: 0 }}>
            <Text style={styles.searchLabel}>Who</Text>
            <Text style={styles.searchValue}>Any crew</Text>
          </View>
          <View style={styles.searchDivider} />
          <View style={{ flex: 1, minWidth: 0, paddingLeft: 13 }}>
            <Text style={styles.searchLabel}>When</Text>
            <Text style={styles.searchValue}>Any date</Text>
          </View>
          <ScalePressable scaleTo={0.88}>
            <LinearGradient colors={gradients.accentButton} style={styles.searchButton}>
              <Svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke={colors.onAccent} strokeWidth={2.1} strokeLinecap="round">
                <Circle cx={11} cy={11} r={7} />
                <Path d="M20 20l-3.6-3.6" />
              </Svg>
            </LinearGradient>
          </ScalePressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {CATEGORIES.map((cat) => {
            const active = cat === activeCat;
            return (
              <ScalePressable
                key={cat}
                onPress={() => setActiveCat(cat)}
                scaleTo={0.92}
                haptic={false}
                style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
              </ScalePressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={[styles.gridContent, { paddingBottom: insets.bottom + 118 }]}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            saved={!!saved[item.id]}
            onOpen={() => setDetailId(item.id)}
            onToggleSave={() => setSaved((s) => ({ ...s, [item.id]: !s[item.id] }))}
          />
        )}
      />

      <BottomNav active="explore" onNavigate={(tab) => onNavigate?.(tab)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 22, paddingTop: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.orange,
    borderWidth: 1.5,
    borderColor: colors.bg,
  },
  heading: { fontFamily: fonts.semiBold, fontSize: 30, letterSpacing: -1, lineHeight: 35, color: colors.textPrimary, marginBottom: 6 },
  tagline: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.textSecondary, marginBottom: 18 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingLeft: 18,
    paddingRight: 6,
    marginBottom: 16,
  },
  searchLabel: { fontFamily: fonts.semiBold, fontSize: 10.5, letterSpacing: 0.3, color: colors.textTertiary },
  searchValue: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.textPrimary },
  searchDivider: { width: 1, height: 26, backgroundColor: colors.borderStrong },
  searchButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  catRow: { gap: 8, paddingBottom: 14 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 18 },
  chipActive: { backgroundColor: colors.teal },
  chipInactive: { backgroundColor: colors.surfaceStrong, borderWidth: 1, borderColor: colors.border },
  chipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.chipText },
  chipTextActive: { color: colors.onAccent },
  gridContent: { paddingHorizontal: 22, paddingTop: 2, paddingBottom: 120 },
  gridRow: { gap: 14, marginBottom: 14 },
});
