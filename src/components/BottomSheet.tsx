import { useEffect, useState, type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';

const SHEET_SPRING = { damping: 16, stiffness: 220, mass: 0.6 } as const;
const CLOSE_MS = 200;

type Props = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  dismissOnBackdrop?: boolean;
}>;

export function BottomSheet({ visible, onClose, dismissOnBackdrop = true, children }: Props) {
  const [mounted, setMounted] = useState(visible);
  const translateY = useSharedValue(420);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.value = withSpring(0, SHEET_SPRING);
      backdropOpacity.value = withTiming(1, { duration: 180 });
    } else if (mounted) {
      translateY.value = withTiming(420, { duration: CLOSE_MS });
      backdropOpacity.value = withTiming(0, { duration: CLOSE_MS });
      const t = setTimeout(() => setMounted(false), CLOSE_MS);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));

  if (!mounted) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismissOnBackdrop ? onClose : undefined}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.dim]} />
        </Pressable>
      </Animated.View>
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={styles.grabber} />
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  dim: { backgroundColor: 'rgba(8,8,10,0.6)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.sheetBg,
    borderTopWidth: 1,
    borderColor: colors.borderStrong,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 50,
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'center',
    marginBottom: 18,
  },
});
