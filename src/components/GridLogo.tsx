import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/colors';

export function GridLogo({ size = 20 }: { size?: number }) {
  const cell = size / 2;
  return (
    <View style={styles.row}>
      <View style={[styles.mark, { width: cell * 3 + 3, height: cell * 3 + 3 }]}>
        {Array.from({ length: 9 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.cell,
              { width: cell, height: cell },
              i === 4 ? styles.center : styles.border,
            ]}
          />
        ))}
      </View>
      <Text style={[styles.word, { fontSize: size }]}>GRID</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1.5,
  },
  cell: {},
  border: { borderWidth: 1.5, borderColor: colors.ink },
  center: { backgroundColor: colors.violet },
  word: {
    fontFamily: fonts.headingBold,
    letterSpacing: -0.3,
    color: colors.ink,
  },
});
