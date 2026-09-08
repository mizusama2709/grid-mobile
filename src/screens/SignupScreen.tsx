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
import { colors, fonts } from '../theme/colors';
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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={onSwitchToLogin} style={styles.backWrap}>
          <Text style={styles.back}>{'<-- back to sign in'}</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Create account</Text>
        <Text style={styles.tagline}>join the hyderabad creative network</Text>

        <View style={styles.roleToggle}>
          <TouchableOpacity
            style={[styles.roleOption, role === 'freelancer' && styles.roleOptionActive]}
            onPress={() => setRole('freelancer')}
          >
            <Text style={[styles.roleText, role === 'freelancer' && styles.roleTextActive]}>
              I'M A FREELANCER
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleOption,
              styles.roleOptionRight,
              role === 'client' && styles.roleOptionActive,
            ]}
            onPress={() => setRole('client')}
          >
            <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>
              I'M HIRING
            </Text>
          </TouchableOpacity>
        </View>

        <AuthTextInput
          label="full name"
          placeholder="e.g. Meera Reddy"
          value={name}
          onChangeText={setName}
        />
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
        <AuthTextInput label="city" value={location} onChangeText={setLocation} />

        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAgreed((v) => !v)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]} />
          <Text style={styles.termsText}>
            i agree to the terms of service and privacy policy
          </Text>
        </TouchableOpacity>

        <AuthButton label="CREATE ACCOUNT" onPress={handleCreate} loading={loading} />

        <TouchableOpacity onPress={onSwitchToLogin} style={styles.switchWrap}>
          <Text style={styles.switchText}>
            already have an account? <Text style={styles.switchLink}>sign in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: 26, paddingTop: 48, paddingBottom: 40 },
  backWrap: { marginBottom: 20 },
  back: { fontFamily: fonts.mono, fontSize: 10, color: colors.ink },
  heading: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    letterSpacing: -0.4,
    color: colors.ink,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.textMuted,
    marginBottom: 22,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  roleToggle: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors.ink,
    marginBottom: 22,
  },
  roleOption: {
    flex: 1,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleOptionRight: { borderLeftWidth: 1.5, borderLeftColor: colors.ink },
  roleOptionActive: { backgroundColor: colors.ink },
  roleText: { fontFamily: fonts.monoSemiBold, fontSize: 10, color: colors.grey },
  roleTextActive: { color: colors.paper },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 24 },
  checkbox: { width: 15, height: 15, borderWidth: 1.5, borderColor: colors.ink, marginTop: 1 },
  checkboxChecked: { backgroundColor: colors.violet, borderColor: colors.violet },
  termsText: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 9.5,
    lineHeight: 15,
    color: colors.textMuted,
  },
  switchWrap: { alignItems: 'center' },
  switchText: { fontFamily: fonts.mono, fontSize: 10, color: colors.ink },
  switchLink: { color: colors.violet, textDecorationLine: 'underline' },
});
