import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradientAt, gradients } from '../theme/colors';
import type { Listing } from '../components/ListingCard';
import { ScalePressable } from '../components/ScalePressable';

const DETAIL_META: Record<string, string> = {
  Photographer: '142 shoots · On Grid since 2021',
  Studio: '2,400 sq ft · Responds within an hour',
  MUA: '96 bookings · Responds within an hour',
  Model: '58 bookings · On Grid since 2023',
  Videographer: '74 shoots · On Grid since 2022',
};

const INCLUDES: Record<string, string[]> = {
  Photographer: ['2 hours of shooting time', '25 edited high-res images', 'One outfit or product set', 'Delivery within 5 days'],
  Studio: ['Cyclorama wall and blackout curtains', 'Strobe kit with 3 heads and modifiers', 'Changing room and makeup station', 'Parking for two vehicles'],
  MUA: ['Full glam application', 'Lashes and touch-up kit', 'Travel within city limits', 'One trial session'],
  Model: ['Up to 8 hours on set', 'Three look changes', 'Usage rights for social and web', 'Own travel to location'],
  Videographer: ['Half-day shoot with crew of two', 'Two edited vertical reels', 'Licensed music and colour grade', 'Delivery within 7 days'],
};

const REVIEWS = [
  { author: 'Ritika S.', rating: '4.5', text: 'Delivered clean, well-lit product shots fast. Would book again.' },
  { author: 'Vivek N.', rating: '4.8', text: 'Great communication and understood the brand look immediately.' },
];

type Props = {
  listing: Listing;
  saved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
  onMessage: () => void;
};

export function ListingDetail({ listing, saved, onToggleSave, onClose, onMessage }: Props) {
  const includes = INCLUDES[listing.category] || INCLUDES.Photographer;
  const hostMeta = DETAIL_META[listing.category] || 'On Grid since 2022';
  const reviewCount = 40 + listing.id * 7;
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <LinearGradient colors={gradientAt(listing.id - 1)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)', 'rgba(8,8,10,0.9)']}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.heroTopRow, { top: insets.top + 12 }]}>
            <ScalePressable style={styles.iconButton} onPress={onClose} scaleTo={0.85}>
              <Text style={styles.iconButtonText}>‹</Text>
            </ScalePressable>
            <ScalePressable style={styles.iconButton} onPress={onToggleSave} scaleTo={0.85}>
              <Text style={[styles.iconButtonText, saved && styles.saveActive]}>{saved ? '♥' : '♡'}</Text>
            </ScalePressable>
          </View>
          <View style={styles.dots}>
            {[1, 0.4, 0.4, 0.25].map((op, i) => (
              <View key={i} style={[styles.dot, { opacity: op }]} />
            ))}
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.ratingValue}>{listing.rating}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{reviewCount} reviews</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{listing.location}</Text>
          </View>

          <View style={styles.hostRow}>
            <LinearGradient colors={gradientAt(listing.id + 3)} style={styles.hostAvatar} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.hostTitle}>Booking with {listing.provider}</Text>
              <Text style={styles.hostMeta}>{hostMeta}</Text>
            </View>
            <ScalePressable style={styles.messageButton} onPress={onMessage} scaleTo={0.94}>
              <Text style={styles.messageButtonText}>Message</Text>
            </ScalePressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's included</Text>
            <View style={{ gap: 11 }}>
              {includes.map((inc) => (
                <View key={inc} style={styles.includeRow}>
                  <View style={styles.includeDot} />
                  <Text style={styles.includeText}>{inc}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.section, { borderBottomWidth: 0 }]}>
            <Text style={styles.sectionTitle}>Recent reviews</Text>
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
        </View>
      </ScrollView>

      <View style={[styles.bookBar, { paddingBottom: insets.bottom + 14 }]}>
        <View style={{ minWidth: 0 }}>
          <Text style={styles.bookPrice}>{listing.price}</Text>
          <Text style={styles.bookDate}>Sep 18, 4:00 PM</Text>
        </View>
        <ScalePressable style={{ flex: 1, maxWidth: 170 }} scaleTo={0.96}>
          <LinearGradient colors={gradients.accentButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Request booking</Text>
          </LinearGradient>
        </ScalePressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: { height: 330, justifyContent: 'flex-end' },
  heroTopRow: {
    position: 'absolute',
    top: 56,
    left: 18,
    right: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(8,8,10,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: { fontSize: 16, color: '#FFFFFF' },
  saveActive: { color: colors.orange },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 5, paddingBottom: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
  body: { paddingHorizontal: 22, paddingTop: 20 },
  title: { fontFamily: fonts.semiBold, fontSize: 25, letterSpacing: -0.8, lineHeight: 30, color: colors.textPrimary, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  star: { fontSize: 12, color: colors.gold },
  ratingValue: { fontFamily: fonts.medium, fontSize: 13, color: colors.textPrimary },
  metaDot: { color: '#A0A0A9' },
  metaText: { fontFamily: fonts.regular, fontSize: 13, color: '#A0A0A9' },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  hostAvatar: { width: 46, height: 46, borderRadius: 23 },
  hostTitle: { fontFamily: fonts.medium, fontSize: 14.5, letterSpacing: -0.2, color: colors.textPrimary },
  hostMeta: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.textSecondary, marginTop: 2 },
  messageButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  messageButtonText: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.textPrimary },
  section: { paddingVertical: 20, borderBottomWidth: 1, borderColor: colors.border },
  sectionTitle: { fontFamily: fonts.semiBold, fontSize: 16, letterSpacing: -0.3, color: colors.textPrimary, marginBottom: 12 },
  includeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  includeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.teal },
  includeText: { flex: 1, fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 19, color: colors.chipTextAlt },
  reviewCard: { padding: 14, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 },
  reviewAuthor: { fontFamily: fonts.medium, fontSize: 13.5, color: colors.textPrimary },
  reviewRating: { fontFamily: fonts.regular, fontSize: 12, color: colors.chipTextAlt },
  reviewText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: '#A0A0A9' },
  bookBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    backgroundColor: colors.sheetBg,
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
  },
  bookPrice: { fontFamily: fonts.semiBold, fontSize: 17, letterSpacing: -0.4, color: colors.textPrimary },
  bookDate: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2, textDecorationLine: 'underline' },
  bookButton: { height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  bookButtonText: { fontFamily: fonts.semiBold, fontSize: 15.5, letterSpacing: -0.2, color: colors.onAccent },
});
