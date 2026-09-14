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
import { AmbientBackground } from '../components/AmbientBackground';
import { colors, fonts, gradients } from '../theme/colors';
import { signUp } from '../lib/auth';
import { UserRole } from '../types/models';

export function SignupScreen({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [role, setRole] = useState<UserRole>('freelancer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Hyderabad');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleCreate = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing info', 'Fill in your name, email and password.');
      return;
    }
    if (!agreed) {
      Alert.alert('Terms', 'Agree to the terms of service to continue.');
      return;
    }
    setLoading(true);
    try {
      await signUp({ email, password, name, role, location });
    } catch (err: any) {
      Alert.alert('Could not create account', err?.message ?? 'Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={onSwitchToLogin} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.tagline}>Join the Hyderabad creative network.</Text>

          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[styles.roleOption, role === 'freelancer' && styles.roleOptionActive]}
              onPress={() => setRole('freelancer')}
            >
              <Text style={[styles.roleText, role === 'freelancer' && styles.roleTextActive]}>
                I'm a freelancer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleOption, role === 'client' && styles.roleOptionActive]}
              onPress={() => setRole('client')}
            >
              <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>I'm hiring</Text>
            </TouchableOpacity>
          </View>

          <AuthTextInput label="Full name" placeholder="Meera Reddy" value={name} onChangeText={setName} />
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
          <AuthTextInput label="City" value={location} onChangeText={setLocation} />

          <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed((v) => !v)} activeOpacity={0.7}>
            {agreed ? (
              <LinearGradient colors={gradients.accentButton} style={styles.checkbox}>
                <Text style={styles.checkMark}>✓</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.checkbox, styles.checkboxEmpty]} />
            )}
            <Text style={styles.termsText}>I agree to the Terms of Service and Privacy Policy</Text>
          </TouchableOpacity>

          <AuthButton label="Create account" onPress={handleCreate} loading={loading} />

          <TouchableOpacity onPress={onSwitchToLogin} style={styles.switchWrap}>
            <Text style={styles.switchText}>
              Already have an account? <Text style={styles.switchLink}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 26, paddingTop: 62, paddingBottom: 44 },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  backIcon: { fontSize: 15, color: colors.textPrimary },
  heading: {
    fontFamily: fonts.semiBold,
    fontSize: 32,
    letterSpacing: -1,
    lineHeight: 38,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 26,
  },
  roleToggle: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
    backgroundColor: colors.surface,
    borderRadius: 22,
    marginBottom: 22,
  },
  roleOption: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleOptionActive: { backgroundColor: colors.teal },
  roleText: { fontFamily: fonts.medium, fontSize: 13.5, letterSpacing: -0.2, color: colors.textSecondary },
  roleTextActive: { fontFamily: fonts.semiBold, color: colors.onAccent },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 26 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxEmpty: { borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surfaceInput },
  checkMark: { fontSize: 11, color: colors.onAccent },
  termsText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.textSecondary },
  switchWrap: { alignItems: 'center' },
  switchText: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
  switchLink: { color: colors.teal, fontFamily: fonts.medium },
});
