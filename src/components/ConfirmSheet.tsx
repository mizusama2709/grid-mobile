import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { ScalePressable } from './ScalePressable';
import { colors, fonts } from '../theme/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  primaryLabel: string;
  onPrimary: () => void;
  primaryLoading?: boolean;
  secondaryLabel: string;
  onSecondary: () => void;
  destructive?: boolean;
};

export function ConfirmSheet({
  visible,
  onClose,
  title,
  subtitle,
  primaryLabel,
  onPrimary,
  primaryLoading,
  secondaryLabel,
  onSecondary,
  destructive,
}: Props) {
  return (
    <BottomSheet visible={visible} onClose={onClose} dismissOnBackdrop={!primaryLoading}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <ScalePressable
        style={[styles.button, destructive ? styles.destructiveButton : styles.primaryButton]}
        onPress={onPrimary}
        disabled={primaryLoading}
        haptic={destructive}
        scaleTo={0.97}
      >
        {primaryLoading ? (
          <ActivityIndicator color={destructive ? colors.orange : colors.textPrimary} />
        ) : (
          <Text style={[styles.buttonLabel, destructive && styles.destructiveLabel]}>{primaryLabel}</Text>
        )}
      </ScalePressable>
      <ScalePressable style={styles.button} onPress={onSecondary} disabled={primaryLoading} scaleTo={0.97} haptic={false}>
        <Text style={styles.buttonLabel}>{secondaryLabel}</Text>
      </ScalePressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.semiBold, fontSize: 20, letterSpacing: -0.4, color: colors.textPrimary, marginBottom: 8 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 19, color: colors.textSecondary, marginBottom: 24 },
  button: {
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    marginBottom: 12,
  },
  primaryButton: {},
  destructiveButton: { borderColor: colors.orange },
  buttonLabel: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.textPrimary },
  destructiveLabel: { color: colors.orange },
});
