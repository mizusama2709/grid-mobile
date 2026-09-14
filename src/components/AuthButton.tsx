import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients } from '../theme/colors';
import { ScalePressable } from './ScalePressable';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'filled' | 'outline';
};

export function AuthButton({ label, onPress, loading, variant = 'filled' }: Props) {
  const filled = variant === 'filled';
  const content = loading ? (
    <ActivityIndicator color={filled ? colors.onAccent : colors.textPrimary} />
  ) : (
    <Text style={[styles.label, filled ? styles.labelFilled : styles.labelOutline]}>{label}</Text>
  );

  if (filled) {
    return (
      <ScalePressable onPress={onPress} disabled={loading} style={styles.wrap} scaleTo={0.96}>
        <LinearGradient colors={gradients.accentButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.base}>
          {content}
        </LinearGradient>
      </ScalePressable>
    );
  }

  return (
    <ScalePressable style={[styles.wrap, styles.base, styles.outline]} onPress={onPress} disabled={loading} scaleTo={0.96}>
      {content}
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  base: {
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  labelFilled: { color: colors.onAccent },
  labelOutline: { color: colors.textPrimary },
});
