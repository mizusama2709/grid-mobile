import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function AmbientBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['rgba(110,231,224,0.22)', 'rgba(110,231,224,0)']}
        style={styles.tealBlob}
      />
      <LinearGradient
        colors={['rgba(255,138,91,0.16)', 'rgba(255,138,91,0)']}
        style={styles.orangeBlob}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tealBlob: {
    position: 'absolute',
    top: -140,
    left: -80,
    width: 340,
    height: 340,
    borderRadius: 170,
  },
  orangeBlob: {
    position: 'absolute',
    top: 60,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
});
