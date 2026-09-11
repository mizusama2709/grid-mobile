import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, type User } from 'firebase/auth';
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
import { ExploreScreen } from './src/screens/ExploreScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { BookingsScreen } from './src/screens/BookingsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { auth } from './src/lib/firebase';
import { colors } from './src/theme/colors';

export default function App() {
  const [headingLoaded] = useSpaceGrotesk({ SpaceGrotesk_700Bold });
  const [monoLoaded] = useIBMPlexMono({
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [tab, setTab] = useState<'explore' | 'bookings' | 'messages' | 'profile'>('explore');
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u);
    setAuthChecked(true);
  }), []);

  if (!headingLoaded || !monoLoaded || !authChecked) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {user ? (
        tab === 'explore' ? (
          <ExploreScreen onNavigate={setTab} />
        ) : tab === 'bookings' ? (
          <BookingsScreen onNavigate={setTab} />
        ) : tab === 'messages' ? (
          <MessagesScreen onNavigate={setTab} />
        ) : (
          <ProfileScreen onNavigate={setTab} />
        )
      ) : mode === 'login' ? (
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
