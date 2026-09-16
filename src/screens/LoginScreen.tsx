import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthButton } from '../components/AuthButton';
import { AuthTextInput } from '../components/AuthTextInput';
import { GridLogo } from '../components/GridLogo';
import { AmbientBackground } from '../components/AmbientBackground';
import { colors, fonts, gradients } from '../theme/colors';
import { signIn } from '../lib/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function LoginScreen({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Enter your email', 'Type your email above, then tap "Forgot password?" again.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Check your inbox', `We sent a password reset link to ${email.trim()}.`);
    } catch (err: any) {
      Alert.alert('Could not send reset email', err?.message ?? 'Try again.');
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      Alert.alert('Could not sign in', err?.message ?? 'Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoRow}>
            <GridLogo size={19} />
          </View>

          <Text style={styles.heading}>Sign in</Text>
          <Text style={styles.tagline}>Book and get booked across Hyderabad.</Text>

          <AuthTextInput
            label="Email"
            placeholder="you@studio.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <AuthTextInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <TouchableOpacity style={styles.forgotWrap} onPress={handleForgotPassword}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>

          <AuthButton label="Sign in" onPress={handleSignIn} loading={loading} />

          <View style={[styles.googleButton, styles.googleButtonDisabled]}>
            <LinearGradient
              colors={gradients.google}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.googleDot}
            />
            <Text style={styles.googleLabel}>Continue with Google (coming soon)</Text>
          </View>

          <TouchableOpacity onPress={onSwitchToSignup} style={styles.switchWrap}>
            <Text style={styles.switchText}>
              New here? <Text style={styles.switchLink}>Create an account</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 26, paddingTop: 72, paddingBottom: 44 },
  logoRow: { marginBottom: 56 },
  heading: {
    fontFamily: fonts.semiBold,
    fontSize: 34,
    letterSpacing: -1.1,
    lineHeight: 40,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 34,
  },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: 28 },
  forgot: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  googleButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginBottom: 28,
  },
  googleButtonDisabled: { opacity: 0.45 },
  googleDot: { width: 17, height: 17, borderRadius: 8.5 },
  googleLabel: { fontFamily: fonts.medium, fontSize: 15, color: colors.textPrimary },
  switchWrap: { alignItems: 'center' },
  switchText: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
  switchLink: { color: colors.teal, fontFamily: fonts.medium },
});
