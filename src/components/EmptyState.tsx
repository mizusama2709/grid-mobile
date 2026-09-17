import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/colors';

type Props = {
  icon?: ReactNode;
  title: string;
  subtitle: string;
};

export function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8 },
  icon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.medium, fontSize: 15, color: colors.chipTextAlt, marginBottom: 6 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textTertiary, textAlign: 'center' },
});
