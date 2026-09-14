import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients } from '../theme/colors';

export function GridLogo({ size = 20, showWord = true }: { size?: number; showWord?: boolean }) {
  const mark = size * 1.7;
  const cell = mark * 0.32;
  return (
    <View style={styles.row}>
      <LinearGradient
        colors={gradients.brand}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.mark, { width: mark, height: mark, borderRadius: mark * 0.32 }]}
      >
        <View style={[styles.dots, { gap: cell * 0.2 }]}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={[styles.dot, { width: cell, height: cell }]} />
          ))}
        </View>
      </LinearGradient>
      {showWord && <Text style={[styles.word, { fontSize: size }]}>Grid</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: { flexDirection: 'row', flexWrap: 'wrap' },
  dot: { backgroundColor: 'rgba(8,8,10,0.85)', borderRadius: 1.5 },
  word: {
    fontFamily: fonts.semiBold,
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
});
