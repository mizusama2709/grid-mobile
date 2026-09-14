import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts, gradients } from '../theme/colors';

const HOLD_MS = 1750;
const OUT_MS = 500;
const haloEase = Easing.bezier(0.2, 0.7, 0.3, 1);
const markEase = Easing.bezier(0.2, 0.8, 0.25, 1);
const tileEase = Easing.bezier(0.25, 1.2, 0.4, 1);
const outEase = Easing.bezier(0.4, 0, 0.2, 1);

const TILE_DELAYS = [300, 380, 540, 460];

export function SplashSequence({ onDone }: { onDone: () => void }) {
  const haloScale = useSharedValue(0.7);
  const haloOpacity = useSharedValue(0);
  const markScale = useSharedValue(0.86);
  const markOpacity = useSharedValue(0);
  const tileScales = TILE_DELAYS.map(() => useSharedValue(0.4));
  const tileOpacities = TILE_DELAYS.map(() => useSharedValue(0));
  const wordTranslate = useSharedValue(8);
  const wordOpacity = useSharedValue(0);
  const tagTranslate = useSharedValue(6);
  const tagOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);

  useEffect(() => {
    haloScale.value = withSequence(
      withTiming(1, { duration: 880, easing: haloEase }),
      withTiming(1.25, { duration: 720, easing: haloEase }),
    );
    haloOpacity.value = withSequence(
      withTiming(1, { duration: 880, easing: haloEase }),
      withTiming(0.55, { duration: 720, easing: haloEase }),
    );

    markScale.value = withTiming(1, { duration: 620, easing: markEase });
    markOpacity.value = withTiming(1, { duration: 620, easing: markEase });

    tileScales.forEach((sv, i) => {
      sv.value = withDelay(
        TILE_DELAYS[i],
        withSequence(
          withTiming(1.08, { duration: 250, easing: tileEase }),
          withTiming(1, { duration: 170, easing: tileEase }),
        ),
      );
    });
    tileOpacities.forEach((sv, i) => {
      sv.value = withDelay(TILE_DELAYS[i], withTiming(1, { duration: 420, easing: tileEase }));
    });

    wordTranslate.value = withDelay(660, withTiming(0, { duration: 500 }));
    wordOpacity.value = withDelay(660, withTiming(1, { duration: 500 }));

    tagTranslate.value = withDelay(900, withTiming(0, { duration: 500 }));
    tagOpacity.value = withDelay(900, withTiming(0.85, { duration: 500 }));

    containerOpacity.value = withDelay(HOLD_MS, withTiming(0, { duration: OUT_MS, easing: outEase }));
    containerScale.value = withDelay(
      HOLD_MS,
      withTiming(1.06, { duration: OUT_MS, easing: outEase }, (finished) => {
        if (finished) runOnJS(onDone)();
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: haloOpacity.value,
    transform: [{ scale: haloScale.value }],
  }));
  const markStyle = useAnimatedStyle(() => ({
    opacity: markOpacity.value,
    transform: [{ scale: markScale.value }],
  }));
  const wordStyle = useAnimatedStyle(() => ({
    opacity: wordOpacity.value,
    transform: [{ translateY: wordTranslate.value }],
  }));
  const tagStyle = useAnimatedStyle(() => ({
    opacity: tagOpacity.value,
    transform: [{ translateY: tagTranslate.value }],
  }));
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const tileStyles = tileScales.map((sv, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedStyle(() => ({
      opacity: tileOpacities[i].value,
      transform: [{ scale: sv.value }],
    })),
  );

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.halo, haloStyle]}>
        <LinearGradient
          colors={['rgba(110,231,224,0.28)', 'rgba(110,231,224,0)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <View style={styles.center}>
        <Animated.View style={markStyle}>
          <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.mark}>
            <View style={styles.tileGrid}>
              {tileStyles.map((s, i) => (
                <Animated.View key={i} style={[styles.tile, s]} />
              ))}
            </View>
          </LinearGradient>
        </Animated.View>
        <Animated.Text style={[styles.word, wordStyle]}>Grid</Animated.Text>
      </View>
      <Animated.Text style={[styles.tag, tagStyle]}>Book & get booked</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  halo: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: 'hidden',
  },
  center: { alignItems: 'center', gap: 20 },
  mark: {
    width: 84,
    height: 84,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.blue,
    shadowOpacity: 0.34,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 18 },
  },
  tileGrid: {
    width: 36,
    height: 36,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tile: { width: 15, height: 15, borderRadius: 4.5, backgroundColor: 'rgba(8,8,10,0.85)' },
  word: { fontFamily: fonts.semiBold, fontSize: 26, color: colors.textPrimary },
  tag: {
    position: 'absolute',
    bottom: 56,
    fontFamily: fonts.regular,
    fontSize: 12.5,
    color: colors.textTertiary,
  },
});
