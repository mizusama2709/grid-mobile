import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  useFonts as useSpaceGrotesk,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  useFonts as useIBMPlexMono,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { colors } from './src/theme/colors';

export default function App() {
  const [headingLoaded] = useSpaceGrotesk({ SpaceGrotesk_700Bold });
  const [monoLoaded] = useIBMPlexMono({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  if (!headingLoaded || !monoLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {mode === 'login' ? (
        <LoginScreen onSwitchToSignup={() => setMode('signup')} />
      ) : (
        <SignupScreen onSwitchToLogin={() => setMode('login')} />
      )}
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
