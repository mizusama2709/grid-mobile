import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthButton } from '../components/AuthButton';
import { AuthTextInput } from '../components/AuthTextInput';
import { GridLogo } from '../components/GridLogo';
import { AmbientBackground } from '../components/AmbientBackground';
import { BottomSheet } from '../components/BottomSheet';
import { ScalePressable } from '../components/ScalePressable';
import { colors, fonts, gradients } from '../theme/colors';
import { signIn, resetPassword } from '../lib/auth';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ForgotStage = 'form' | 'submitting' | 'sent' | 'invalid' | 'network';

export function LoginScreen({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStage, setForgotStage] = useState<ForgotStage>('form');

  const { signIn: signInWithGoogle } = useGoogleSignIn();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState(false);

  const openForgotPassword = () => {
    setForgotEmail(email);
    setForgotStage('form');
    setForgotVisible(true);
  };

  const handleForgotEmailChange = (text: string) => {
    setForgotEmail(text);
    if (forgotStage === 'invalid' || forgotStage === 'network') setForgotStage('form');
  };

  const submitForgotPassword = async () => {
    if (!EMAIL_RE.test(forgotEmail.trim())) {
      setForgotStage('invalid');
      return;
    }
    setForgotStage('submitting');
    try {
      await resetPassword(forgotEmail);
      setForgotStage('sent');
    } catch {
      setForgotStage('network');
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

  const handleGoogleSignIn = async () => {
    setGoogleError(false);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setGoogleError(true);
    } finally {
      setGoogleLoading(false);
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

          <TouchableOpacity style={styles.forgotWrap} onPress={openForgotPassword}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>

          <AuthButton label="Sign in" onPress={handleSignIn} loading={loading} />

          <ScalePressable
            style={[styles.googleButton, googleLoading && styles.googleButtonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={googleLoading}
            scaleTo={0.97}
            haptic={false}
          >
            {googleLoading ? (
              <>
                <ActivityIndicator size="small" color={colors.textPrimary} />
                <Text style={styles.googleLabel}>Signing in…</Text>
              </>
            ) : (
              <>
                <LinearGradient
                  colors={gradients.google}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.googleDot}
                />
                <Text style={styles.googleLabel}>Continue with Google</Text>
              </>
            )}
          </ScalePressable>
          {googleError && (
            <Text style={styles.googleError}>Google sign-in failed. Try again or use your email.</Text>
          )}

          <TouchableOpacity onPress={onSwitchToSignup} style={styles.switchWrap}>
            <Text style={styles.switchText}>
              New here? <Text style={styles.switchLink}>Create an account</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomSheet visible={forgotVisible} onClose={() => setForgotVisible(false)} dismissOnBackdrop={forgotStage !== 'submitting'}>
        {forgotStage === 'sent' ? (
          <View style={{ alignItems: 'center' }}>
            <View style={styles.sentIconWrap}>
              <Text style={styles.sentIcon}>✓</Text>
            </View>
            <Text style={styles.sheetTitle}>Check your email</Text>
            <Text style={[styles.sheetSubtitle, { textAlign: 'center' }]}>
              We sent a reset link to {forgotEmail.trim()}. Follow the link to set a new password.
            </Text>
            <ScalePressable style={styles.doneButton} onPress={() => setForgotVisible(false)} scaleTo={0.97} haptic={false}>
              <Text style={styles.doneButtonText}>Done</Text>
            </ScalePressable>
            <TouchableOpacity onPress={submitForgotPassword}>
              <Text style={styles.resendText}>Resend link</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sheetTitle}>Reset your password</Text>
            <Text style={styles.sheetSubtitle}>We'll send a link to reset your password.</Text>
            <View style={[styles.forgotInputBox, forgotStage === 'invalid' && styles.forgotInputBoxError]}>
              <Text style={styles.forgotInputLabel}>Email</Text>
              <TextInput
                style={styles.forgotInput}
                value={forgotEmail}
                onChangeText={handleForgotEmailChange}
                placeholder="you@studio.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={forgotStage !== 'submitting'}
              />
            </View>
            {forgotStage === 'invalid' && <Text style={styles.forgotErrorText}>Enter a valid email address.</Text>}
            {forgotStage === 'network' && (
              <View style={styles.networkBanner}>
                <Text style={styles.networkBannerTitle}>Could not send reset link</Text>
                <Text style={styles.networkBannerText}>Check your connection and try again.</Text>
              </View>
            )}
            <ScalePressable
              style={styles.sendButton}
              onPress={submitForgotPassword}
              disabled={forgotStage === 'submitting'}
              scaleTo={0.97}
            >
              {forgotStage === 'submitting' ? (
                <ActivityIndicator color={colors.onAccent} />
              ) : (
                <LinearGradient colors={gradients.accentButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
              )}
              {forgotStage !== 'submitting' && <Text style={styles.sendButtonText}>Send reset link</Text>}
            </ScalePressable>
            <TouchableOpacity onPress={() => setForgotVisible(false)} disabled={forgotStage === 'submitting'}>
              <Text style={styles.backToSignIn}>Back to sign in</Text>
            </TouchableOpacity>
          </>
        )}
      </BottomSheet>
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
    marginBottom: 8,
  },
  googleButtonDisabled: { opacity: 0.7 },
  googleDot: { width: 17, height: 17, borderRadius: 8.5 },
  googleLabel: { fontFamily: fonts.medium, fontSize: 15, color: colors.textPrimary },
  googleError: { fontFamily: fonts.regular, fontSize: 12, color: colors.orange, marginBottom: 20 },
  switchWrap: { alignItems: 'center' },
  switchText: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
  switchLink: { color: colors.teal, fontFamily: fonts.medium },

  sheetTitle: { fontFamily: fonts.semiBold, fontSize: 20, letterSpacing: -0.4, color: colors.textPrimary, marginBottom: 6 },
  sheetSubtitle: { fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 19, color: colors.textSecondary, marginBottom: 22 },
  forgotInputBox: {
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 18,
    padding: 13,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  forgotInputBoxError: { borderColor: colors.orange },
  forgotInputLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.textTertiary, marginBottom: 3 },
  forgotInput: { fontFamily: fonts.regular, fontSize: 15, color: colors.textPrimary, padding: 0 },
  forgotErrorText: { fontFamily: fonts.regular, fontSize: 12, color: colors.orange, marginBottom: 14 },
  networkBanner: {
    backgroundColor: 'rgba(224,118,79,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(224,118,79,0.35)',
    borderRadius: 16,
    padding: 13,
    marginTop: 8,
    marginBottom: 14,
  },
  networkBannerTitle: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.textPrimary, marginBottom: 3 },
  networkBannerText: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.chipTextAlt },
  sendButton: {
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sendButtonText: { fontFamily: fonts.semiBold, fontSize: 16, letterSpacing: -0.2, color: colors.onAccent },
  backToSignIn: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.textSecondary, textAlign: 'center' },
  sentIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 18,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentIcon: { fontSize: 24, fontWeight: '700', color: colors.onAccent },
  doneButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  doneButtonText: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.textPrimary },
  resendText: { fontFamily: fonts.medium, fontSize: 13, color: colors.teal },
});
