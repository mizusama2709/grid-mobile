import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradientAt, fonts } from '../theme/colors';
import { ScalePressable } from './ScalePressable';

export type Listing = {
  id: number;
  category: string;
  title: string;
  provider: string;
  location: string;
  price: string;
  rating: string;
};

type Props = {
  listing: Listing;
  saved: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
};

export function ListingCard({ listing, saved, onOpen, onToggleSave }: Props) {
  return (
    <ScalePressable style={styles.card} onPress={onOpen} scaleTo={0.965}>
      <LinearGradient colors={gradientAt(listing.id - 1)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.image}>
        <LinearGradient
          colors={['rgba(0,0,0,0.28)', 'rgba(0,0,0,0)', 'rgba(8,8,10,0.65)']}
          locations={[0, 0.38, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.categoryTag}>
          <Text style={styles.categoryTagText}>{listing.category}</Text>
        </View>
        <ScalePressable style={styles.saveButton} onPress={onToggleSave} scaleTo={0.8} hitSlop={6}>
          <Text style={[styles.saveIcon, saved && styles.saveIconActive]}>{saved ? '♥' : '♡'}</Text>
        </ScalePressable>
        <Text style={styles.imageTitle} numberOfLines={2}>
          {listing.title}
        </Text>
        <View style={styles.dots}>
          {[1, 0.45, 0.45, 0.3].map((op, i) => (
            <View key={i} style={[styles.dot, { opacity: op }]} />
          ))}
        </View>
      </LinearGradient>
      <View style={styles.body}>
        <Text style={styles.meta}>
          {listing.provider} · {listing.location}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{listing.price}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.rating}>{listing.rating}</Text>
          </View>
        </View>
      </View>
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 5,
    justifyContent: 'flex-end',
  },
  categoryTag: {
    position: 'absolute',
    top: 9,
    left: 9,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 11,
    backgroundColor: 'rgba(8,8,10,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  categoryTagText: { fontFamily: fonts.medium, fontSize: 9.5, letterSpacing: 0.3, color: '#FFFFFF' },
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(8,8,10,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: { fontSize: 13, color: '#FFFFFF' },
  saveIconActive: { color: colors.orange },
  imageTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 13.5,
    letterSpacing: -0.3,
    lineHeight: 17,
    color: '#FFFFFF',
    marginHorizontal: 11,
    marginBottom: 26,
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#FFFFFF' },
  body: { padding: 12, paddingTop: 10 },
  meta: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.textSecondary, marginBottom: 7 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.textPrimary },
  star: { fontSize: 10, color: colors.gold },
  rating: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.chipTextAlt },
});
