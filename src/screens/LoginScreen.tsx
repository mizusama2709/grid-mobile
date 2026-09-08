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
import { AuthButton } from '../components/AuthButton';
import { AuthTextInput } from '../components/AuthTextInput';
import { GridLogo } from '../components/GridLogo';
import { colors, fonts } from '../theme/colors';
import { signIn } from '../lib/auth';

export function LoginScreen({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logoRow}>
          <GridLogo size={20} />
        </View>

        <Text style={styles.heading}>Sign in</Text>
        <Text style={styles.tagline}>book &amp; get booked // hyderabad</Text>

        <AuthTextInput
          label="email"
          placeholder="you@studio.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <AuthTextInput
          label="password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          isPassword
        />

        <TouchableOpacity style={styles.forgotWrap}>
          <Text style={styles.forgot}>forgot password?</Text>
        </TouchableOpacity>

        <AuthButton label="SIGN IN" onPress={handleSignIn} loading={loading} />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <AuthButton label="Continue with Google" onPress={() => {}} variant="outline" />

        <TouchableOpacity onPress={onSwitchToSignup} style={styles.switchWrap}>
          <Text style={styles.switchText}>
            new here? <Text style={styles.switchLink}>create account</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: 26, paddingTop: 60, paddingBottom: 40 },
  logoRow: { marginBottom: 38 },
  heading: {
    fontFamily: fonts.headingBold,
    fontSize: 30,
    letterSpacing: -0.4,
    color: colors.ink,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.textMuted,
    marginBottom: 30,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: 26 },
  forgot: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.violet,
    borderBottomWidth: 1,
    borderBottomColor: colors.violet,
    paddingBottom: 1,
    textTransform: 'lowercase',
  },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.ink, opacity: 0.3 },
  dividerText: { fontFamily: fonts.mono, fontSize: 8.5, color: colors.grey },
  switchWrap: { alignItems: 'center' },
  switchText: { fontFamily: fonts.mono, fontSize: 10, color: colors.ink },
  switchLink: { color: colors.violet, textDecorationLine: 'underline' },
});
