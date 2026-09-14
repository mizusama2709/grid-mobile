import type { PropsWithChildren } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PropsWithChildren<{
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptic?: boolean;
  disabled?: boolean;
  hitSlop?: number;
}>;

const PRESS_SPRING = { damping: 14, stiffness: 260, mass: 0.4 } as const;
const RELEASE_SPRING = { damping: 12, stiffness: 220, mass: 0.5 } as const;

export function ScalePressable({
  onPress,
  style,
  children,
  scaleTo = 0.94,
  haptic = true,
  disabled,
  hitSlop,
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={() => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      onPressIn={() => {
        scale.value = withSpring(scaleTo, PRESS_SPRING);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, RELEASE_SPRING);
      }}
      disabled={disabled}
      hitSlop={hitSlop}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
