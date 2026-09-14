import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AmbientBackground } from '../components/AmbientBackground';
import { BottomNav, type NavTab } from '../components/BottomNav';
import { ScalePressable } from '../components/ScalePressable';
import { colors, fonts, gradientAt, gradients, statusTint } from '../theme/colors';

type Status = 'Upcoming' | 'Pending' | 'Past' | 'Cancelled';

type Booking = {
  title: string;
  provider: string;
  date: string;
  price: string;
  status: Status;
};

const TABS: Status[] = ['Upcoming', 'Pending', 'Past', 'Cancelled'];

const ALL: Booking[] = [
  { title: 'Golden Hour Portraits', provider: 'Kavya R.', date: 'Sep 18, 4:00 PM', price: '₹3,500', status: 'Upcoming' },
  { title: 'Loft 9 Cyclorama Studio', provider: 'Loft 9', date: 'Sep 22, 10:00 AM', price: '₹11,000', status: 'Upcoming' },
  { title: 'Bridal & HD Makeup', provider: 'Neha S.', date: 'Sep 14, 9:00 AM', price: '₹5,500', status: 'Pending' },
  { title: 'Cinematic Reel Shoots', provider: 'Arjun V.', date: 'Aug 30, 2:00 PM', price: '₹6,000', status: 'Past' },
];

type Props = {
  onNavigate?: (tab: NavTab, opts?: { threadId?: number }) => void;
};

export function BookingsScreen({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<Status>('Upcoming');
  const filtered = useMemo(() => ALL.filter((b) => b.status === activeTab), [activeTab]);

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Text style={styles.heading}>Bookings</Text>
        <View style={styles.tabRow}>
          {TABS.map((t) => {
            const active = t === activeTab;
            return (
              <ScalePressable key={t} onPress={() => setActiveTab(t)} scaleTo={0.94} haptic={false} style={{ flex: 1 }}>
                {active ? (
                  <LinearGradient colors={gradients.accentButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tab}>
                    <Text style={[styles.tabText, styles.tabTextActive]}>{t}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.tab}>
                    <Text style={styles.tabText}>{t}</Text>
                  </View>
                )}
              </ScalePressable>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 118 }]}>
        {filtered.map((b, i) => {
          const tint = statusTint[b.status];
          return (
            <View key={b.title} style={styles.card}>
              <LinearGradient colors={gradientAt(i + 2)} style={styles.thumb} />
              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardTitle}>{b.title}</Text>
                  <View style={[styles.badge, { backgroundColor: tint.bg }]}>
                    <Text style={[styles.badgeText, { color: tint.fg }]}>{b.status}</Text>
                  </View>
                </View>
                <Text style={styles.cardProvider}>{b.provider}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardDate}>{b.date}</Text>
                  <Text style={styles.cardPrice}>{b.price}</Text>
                </View>
              </View>
            </View>
          );
        })}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <View style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptyText}>Bookings in this state will show up here.</Text>
          </View>
        )}
      </ScrollView>

      <BottomNav active="bookings" onNavigate={(tab) => onNavigate?.(tab)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 22, paddingTop: 4 },
  heading: { fontFamily: fonts.semiBold, fontSize: 30, letterSpacing: -1, color: colors.textPrimary, marginBottom: 18 },
  tabRow: { flexDirection: 'row', gap: 6, padding: 4, backgroundColor: colors.surface, borderRadius: 20 },
  tab: { height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.textSecondary },
  tabTextActive: { fontFamily: fonts.semiBold, color: colors.onAccent },
  list: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 120, gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 13,
    padding: 13,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: { width: 70, height: 70, borderRadius: 16 },
  cardBody: { flex: 1, minWidth: 0, gap: 4 },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  cardTitle: { flex: 1, fontFamily: fonts.semiBold, fontSize: 14.5, letterSpacing: -0.3, lineHeight: 18, color: colors.textPrimary },
  cardProvider: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 },
  cardDate: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.chipTextAlt },
  cardPrice: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.textPrimary },
  badge: { flexShrink: 0, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 11 },
  badgeText: { fontFamily: fonts.medium, fontSize: 10.5 },
  empty: { paddingVertical: 56, paddingHorizontal: 20, alignItems: 'center' },
  emptyIcon: { width: 54, height: 54, borderRadius: 18, marginBottom: 16, backgroundColor: colors.surfaceStrong, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { fontFamily: fonts.medium, fontSize: 15, color: colors.chipTextAlt, marginBottom: 6 },
  emptyText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textTertiary, textAlign: 'center' },
});
