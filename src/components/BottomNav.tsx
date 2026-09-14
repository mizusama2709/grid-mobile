import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, gradients } from '../theme/colors';
import { ScalePressable } from './ScalePressable';

export type NavTab = 'explore' | 'bookings' | 'messages' | 'profile';

const ICONS: Record<NavTab, (color: string) => React.ReactNode> = {
  explore: (color) => (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round">
      <Circle cx={11} cy={11} r={7} />
      <Path d="M20 20l-3.6-3.6" />
    </Svg>
  ),
  bookings: (color) => (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round">
      <Rect x={3.5} y={5} width={17} height={15.5} rx={3.5} />
      <Path d="M8 3v4M16 3v4M3.5 10h17" />
    </Svg>
  ),
  messages: (color) => (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20.5 11.7c0 4-3.8 7.2-8.5 7.2-1 0-2-.15-2.9-.42L4 20.5l1.5-3.6C4.25 15.5 3.5 13.7 3.5 11.7c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2z" />
    </Svg>
  ),
  profile: (color) => (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round">
      <Circle cx={12} cy={8.2} r={3.9} />
      <Path d="M4.8 20c.7-3.7 3.7-5.8 7.2-5.8s6.5 2.1 7.2 5.8" />
    </Svg>
  ),
};

const ORDER: NavTab[] = ['explore', 'bookings', 'messages', 'profile'];

const ITEM = 50;
const GAP = 6;
const PAD = 7;
const STEP = ITEM + GAP;

export function BottomNav({ active, onNavigate }: { active: NavTab; onNavigate: (tab: NavTab) => void }) {
  const insets = useSafeAreaInsets();
  const activeIndex = ORDER.indexOf(active);
  const pillX = useSharedValue(activeIndex * STEP);

  useEffect(() => {
    pillX.value = withSpring(activeIndex * STEP, { damping: 16, stiffness: 220, mass: 0.6 });
  }, [activeIndex, pillX]);

  const pillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: pillX.value }] }));

  return (
    <>
      <LinearGradient colors={['rgba(8,8,10,0)', colors.bg]} locations={[0, 0.34]} style={styles.fade} pointerEvents="none" />
      <View style={[styles.wrapOuter, { bottom: insets.bottom + 14 }]} pointerEvents="box-none">
        <BlurView
          intensity={80}
          tint="systemUltraThinMaterialDark"
          blurMethod={Platform.OS === 'android' ? 'dimezisBlurViewSdk31Plus' : undefined}
          style={styles.wrap}
        >
          <View style={[StyleSheet.absoluteFill, styles.wrapTint]} pointerEvents="none" />
          <Animated.View style={[styles.pillTrack, pillStyle]}>
            <LinearGradient colors={gradients.accentButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.itemGradient} />
          </Animated.View>
          {ORDER.map((key) => {
            const isActive = key === active;
            return (
              <ScalePressable key={key} onPress={() => onNavigate(key)} scaleTo={0.82} style={styles.itemHit}>
                <View style={styles.item}>{ICONS[key](isActive ? colors.onAccent : '#B4B4BC')}</View>
              </ScalePressable>
            );
          })}
        </BlurView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  wrapOuter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  wrap: {
    flexDirection: 'row',
    gap: 6,
    padding: 7,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  wrapTint: {
    backgroundColor: colors.navBg,
  },
  pillTrack: {
    position: 'absolute',
    left: PAD,
    top: PAD,
    width: ITEM,
    height: ITEM,
  },
  itemHit: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
