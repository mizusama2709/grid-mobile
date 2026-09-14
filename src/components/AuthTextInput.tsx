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
    <View style={styles.box}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.chipTextAlt}
          secureTextEntry={isPassword ? hidden : secureTextEntry}
          autoCapitalize="none"
          {...rest}
        />
      </View>
      {isPassword && (
        <TouchableOpacity onPress={() => setHidden((v) => !v)}>
          <Text style={styles.show}>{hidden ? 'Show' : 'Hide'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textTertiary,
    marginBottom: 3,
  },
  input: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textPrimary,
    padding: 0,
  },
  show: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.teal,
  },
});
