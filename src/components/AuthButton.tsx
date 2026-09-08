import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../theme/colors';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'filled' | 'outline';
};

export function AuthButton({ label, onPress, loading, variant = 'filled' }: Props) {
  const filled = variant === 'filled';
  return (
    <TouchableOpacity
      style={[styles.base, filled ? styles.filled : styles.outline]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={filled ? colors.paper : colors.ink} />
      ) : (
        <Text style={[styles.label, filled ? styles.labelFilled : styles.labelOutline]}>
          [ {label} ]
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  filled: { backgroundColor: colors.ink },
  outline: { borderWidth: 1.5, borderColor: colors.ink },
  label: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  labelFilled: { color: colors.paper },
  labelOutline: { color: colors.ink },
});
