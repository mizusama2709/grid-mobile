import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AmbientBackground } from '../components/AmbientBackground';
import { BottomNav, type NavTab } from '../components/BottomNav';
import { colors, fonts, gradientAt, gradients } from '../theme/colors';

type Thread = {
  id: number;
  name: string;
  preview: string;
  time: string;
  unread: boolean;
};

type Message = {
  from: 'me' | 'them';
  text: string;
};

const THREADS: Thread[] = [
  { id: 1, name: 'Kavya R.', preview: 'Sure, 4pm works great for me!', time: '2m', unread: true },
  { id: 2, name: 'Loft 9', preview: 'Studio is booked and confirmed.', time: '1h', unread: false },
  { id: 3, name: 'Sana K.', preview: 'Can you send reference photos?', time: '3h', unread: true },
  { id: 4, name: 'Arjun V.', preview: 'Sent the edited reel, check inbox.', time: 'Yesterday', unread: false },
  { id: 5, name: 'Neha S.', preview: 'Thank you for booking!', time: 'Mon', unread: false },
  { id: 6, name: 'Frame House', preview: 'We have a slot Friday if needed.', time: 'Sun', unread: false },
];

const CONVERSATION: Message[] = [
  { from: 'them', text: "Hi! I'd like to check availability for Sep 18." },
  { from: 'me', text: 'Yes, I have a slot at 4pm that day.' },
  { from: 'them', text: 'Sure, 4pm works great for me!' },
];

type Props = {
  onNavigate?: (tab: NavTab, opts?: { threadId?: number }) => void;
  initialThreadId?: number | null;
  onThreadConsumed?: () => void;
};

export function MessagesScreen({ onNavigate, initialThreadId, onThreadConsumed }: Props) {
  const insets = useSafeAreaInsets();
  const [activeId, setActiveId] = useState<number | null>(null);
  const active = THREADS.find((t) => t.id === activeId) ?? null;

  useEffect(() => {
    if (initialThreadId) {
      setActiveId(initialThreadId);
      onThreadConsumed?.();
    }
  }, [initialThreadId, onThreadConsumed]);

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      {active ? (
        <>
          <View style={[styles.threadHeader, { paddingTop: insets.top + 4 }]}>
            <TouchableOpacity onPress={() => setActiveId(null)} hitSlop={10} style={styles.backButton}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <LinearGradient colors={gradientAt(active.id)} style={styles.avatarSmall} />
            <View>
              <Text style={styles.threadName}>{active.name}</Text>
              <Text style={styles.activeNow}>Active now</Text>
            </View>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.messagesContent}>
            {CONVERSATION.map((m, i) => (
              <View key={i} style={[styles.messageRow, m.from === 'me' && styles.messageRowMe]}>
                {m.from === 'me' ? (
                  <LinearGradient colors={gradients.accentButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.bubble, styles.bubbleMe]}>
                    <Text style={[styles.bubbleText, styles.bubbleTextMe]}>{m.text}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.bubble, styles.bubbleThem]}>
                    <Text style={styles.bubbleText}>{m.text}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <View style={[styles.composer, { paddingBottom: insets.bottom + 12 }]}>
            <View style={styles.composerInput}>
              <Text style={styles.composerPlaceholder}>Message</Text>
            </View>
            <LinearGradient colors={gradients.accentButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sendButton}>
              <Text style={styles.sendIcon}>↑</Text>
            </LinearGradient>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.listHeader, { paddingTop: insets.top + 4 }]}>
            <Text style={styles.heading}>Messages</Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 118 }}>
            {THREADS.map((t) => (
              <TouchableOpacity key={t.id} onPress={() => setActiveId(t.id)} style={styles.threadRow}>
                <LinearGradient colors={gradientAt(t.id)} style={styles.avatar} />
                <View style={styles.threadInfo}>
                  <View style={styles.threadTopRow}>
                    <Text style={styles.threadRowName}>{t.name}</Text>
                    <Text style={styles.threadTime}>{t.time}</Text>
                  </View>
                  <Text style={[styles.threadPreview, { color: t.unread ? colors.chipTextAlt : colors.textSecondary }]} numberOfLines={1}>
                    {t.preview}
                  </Text>
                </View>
                {t.unread && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <BottomNav active="messages" onNavigate={(tab) => onNavigate?.(tab)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  listHeader: { paddingHorizontal: 22, paddingTop: 4, paddingBottom: 16 },
  heading: { fontFamily: fonts.semiBold, fontSize: 30, letterSpacing: -1, color: colors.textPrimary },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    marginHorizontal: 14,
    borderRadius: 20,
  },
  avatar: { width: 46, height: 46, borderRadius: 23 },
  avatarSmall: { width: 36, height: 36, borderRadius: 18 },
  threadInfo: { flex: 1, minWidth: 0 },
  threadTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  threadRowName: { fontFamily: fonts.semiBold, fontSize: 14.5, letterSpacing: -0.3, color: colors.textPrimary },
  threadTime: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.textTertiary },
  threadPreview: { fontFamily: fonts.regular, fontSize: 13, marginTop: 3 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.teal, flexShrink: 0 },
  threadHeader: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 15, color: colors.textPrimary },
  threadName: { fontFamily: fonts.semiBold, fontSize: 15, letterSpacing: -0.3, color: colors.textPrimary },
  activeNow: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.teal },
  messagesContent: { padding: 18, paddingHorizontal: 20, gap: 10 },
  messageRow: { flexDirection: 'row', justifyContent: 'flex-start' },
  messageRowMe: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '76%', paddingVertical: 11, paddingHorizontal: 15 },
  bubbleThem: {
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleMe: { borderRadius: 20, borderBottomRightRadius: 6 },
  bubbleText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 19, color: colors.textPrimary },
  bubbleTextMe: { color: colors.onAccent },
  composer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    flexDirection: 'row',
    gap: 9,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  composerInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  composerPlaceholder: { fontFamily: fonts.regular, fontSize: 14.5, color: colors.textTertiary },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { fontSize: 15, color: colors.onAccent },
});
