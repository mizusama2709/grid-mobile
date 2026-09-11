import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../theme/colors';

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

const STATUS_COLOR: Record<Status, string> = {
  Upcoming: colors.violet,
  Pending: '#A6811F',
  Past: colors.grey,
  Cancelled: '#B04A3F',
};

const NAV_ITEMS = ['Explore', 'Bookings', 'Messages', 'Profile'] as const;

type Props = {
  onNavigate?: (tab: 'explore' | 'bookings' | 'messages' | 'profile') => void;
};

export function BookingsScreen({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<Status>('Upcoming');
  const filtered = useMemo(() => ALL.filter((b) => b.status === activeTab), [activeTab]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.heading}>Bookings</Text>
        <View style={styles.tabRow}>
          {TABS.map((t) => {
            const active = t === activeTab;
            return (
              <TouchableOpacity key={t} onPress={() => setActiveTab(t)} style={styles.tabItem}>
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.toUpperCase()}</Text>
                <View style={[styles.tabUnderline, active && styles.tabUnderlineActive]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((b) => (
          <View key={b.title} style={styles.card}>
            <View style={styles.thumb}>
              <Text style={styles.thumbText}>{b.title}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{b.title}</Text>
              <Text style={styles.cardProvider}>{b.provider}</Text>
              <Text style={styles.cardDate}>{b.date}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardPrice}>{b.price}</Text>
                <Text style={[styles.badge, { color: STATUS_COLOR[b.status], borderColor: STATUS_COLOR[b.status] }]}>
                  {b.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.navBar}>
        {NAV_ITEMS.map((label) => (
          <TouchableOpacity
            key={label}
            style={styles.navItem}
            onPress={() => label !== 'Bookings' && onNavigate?.(label.toLowerCase() as any)}
          >
            <Text style={[styles.navText, label === 'Bookings' && styles.navTextActive]}>
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
  header: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 0 },
  heading: {
    fontFamily: fonts.headingBold,
    fontSize: 26,
    letterSpacing: -0.4,
    color: colors.ink,
    marginBottom: 16,
  },
  tabRow: { flexDirection: 'row', gap: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(20,19,16,0.15)' },
  tabItem: { paddingBottom: 9 },
  tabText: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 0.3, color: colors.grey },
  tabTextActive: { fontFamily: fonts.monoSemiBold, color: colors.ink },
  tabUnderline: { height: 2, marginTop: 9, backgroundColor: 'transparent' },
  tabUnderlineActive: { backgroundColor: colors.violet },
  list: { padding: 20, paddingTop: 14, paddingBottom: 100, gap: 12 },
  card: { flexDirection: 'row', gap: 12, borderWidth: 1, borderColor: 'rgba(20,19,16,0.15)', padding: 12 },
  thumb: { width: 64, height: 64, backgroundColor: colors.paperDim, alignItems: 'center', justifyContent: 'center' },
  thumbText: { fontFamily: fonts.mono, fontSize: 6.5, color: colors.grey, textAlign: 'center', padding: 4 },
  cardBody: { flex: 1, gap: 3 },
  cardTitle: { fontFamily: fonts.headingBold, fontSize: 12.5, color: colors.ink },
  cardProvider: { fontFamily: fonts.mono, fontSize: 9, color: colors.grey },
  cardDate: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.textBody },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  cardPrice: { fontFamily: fonts.monoMedium, fontSize: 11, color: colors.ink },
  badge: { fontFamily: fonts.mono, fontSize: 8, letterSpacing: 0.3, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2 },
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
