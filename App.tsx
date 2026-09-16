import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import {
  useFonts,
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
} from '@expo-google-fonts/instrument-sans';
import { SplashSequence } from './src/components/SplashSequence';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { MessagesScreen } from './src/screens/MessagesScreen';
import { BookingsScreen } from './src/screens/BookingsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { auth, db } from './src/lib/firebase';
import { colors } from './src/theme/colors';

export default function App() {
  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
  });
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [tab, setTab] = useState<'explore' | 'bookings' | 'messages' | 'profile'>('explore');
  const [pendingThreadId, setPendingThreadId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const screenOpacity = useSharedValue(0);
  const screenScale = useSharedValue(1.03);
  const screenInStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [{ scale: screenScale.value }],
  }));

  const handleSplashDone = () => {
    setSplashDone(true);
    screenOpacity.value = withTiming(1, { duration: 260, easing: Easing.out(Easing.ease) });
    screenScale.value = withTiming(1, { duration: 260, easing: Easing.out(Easing.ease) });
  };

  const navigate = (nextTab: typeof tab, opts?: { threadId?: number }) => {
    setTab(nextTab);
    if (opts?.threadId) setPendingThreadId(opts.threadId);
  };

  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u);
    setAuthChecked(true);
  }), []);

  useEffect(() => {
    if (!user) {
      setProfileReady(false);
      return;
    }
    return onSnapshot(doc(db, 'users', user.uid), (snap) => {
      setProfileReady(snap.exists());
    });
  }, [user]);

  if (!fontsLoaded || !authChecked || (user && !profileReady)) {
    return (
      <SafeAreaProvider>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.teal} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Animated.View style={[{ flex: 1 }, screenInStyle]}>
          {user ? (
            tab === 'explore' ? (
              <ExploreScreen onNavigate={navigate} />
            ) : tab === 'bookings' ? (
              <BookingsScreen onNavigate={navigate} />
            ) : tab === 'messages' ? (
              <MessagesScreen
                onNavigate={navigate}
                initialThreadId={pendingThreadId}
                onThreadConsumed={() => setPendingThreadId(null)}
              />
            ) : (
              <ProfileScreen onNavigate={navigate} />
            )
          ) : mode === 'login' ? (
            <LoginScreen onSwitchToSignup={() => setMode('signup')} />
          ) : (
            <SignupScreen onSwitchToLogin={() => setMode('login')} />
          )}
        </Animated.View>
        {!splashDone && <SplashSequence onDone={handleSplashDone} />}
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
