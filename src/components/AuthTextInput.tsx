import { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../theme/colors';

type Props = TextInputProps & {
  label: string;
  isPassword?: boolean;
};

export function AuthTextInput({ label, isPassword, secureTextEntry, ...rest }: Props) {
  const [hidden, setHidden] = useState(!!isPassword);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>[ {label} ]</Text>
      <View style={styles.box}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.grey}
          secureTextEntry={isPassword ? hidden : secureTextEntry}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setHidden((v) => !v)}>
            <Text style={styles.show}>{hidden ? 'SHOW' : 'HIDE'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    color: colors.violet,
    marginBottom: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  box: {
    borderWidth: 1.5,
    borderColor: colors.ink,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.ink,
    padding: 0,
  },
  show: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    color: colors.grey,
    letterSpacing: 0.5,
  },
});
