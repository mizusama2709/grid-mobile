import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { AmbientBackground } from '../components/AmbientBackground';
import { BottomNav, type NavTab } from '../components/BottomNav';
import { EmptyState } from '../components/EmptyState';
import { ScalePressable } from '../components/ScalePressable';
import { colors, fonts, gradientAt, gradients } from '../theme/colors';

type Thread = {
  id: number;
  name: string;
  preview: string;
  time: string;
  unread: boolean;
};

type MessageStatus = 'sending' | 'sent' | 'failed';

type Message = {
  id: string;
  from: 'me' | 'them';
  text: string;
  status?: MessageStatus;
};

const THREADS: Thread[] = [
  { id: 1, name: 'Kavya R.', preview: 'Sure, 4pm works great for me!', time: '2m', unread: true },
  { id: 2, name: 'Loft 9', preview: 'Studio is booked and confirmed.', time: '1h', unread: false },
  { id: 3, name: 'Sana K.', preview: 'Can you send reference photos?', time: '3h', unread: true },
  { id: 4, name: 'Arjun V.', preview: 'Sent the edited reel, check inbox.', time: 'Yesterday', unread: false },
  { id: 5, name: 'Neha S.', preview: 'Thank you for booking!', time: 'Mon', unread: false },
  { id: 6, name: 'Frame House', preview: 'We have a slot Friday if needed.', time: 'Sun', unread: false },
];

const INITIAL_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 'm1', from: 'them', text: "Hi! I'd like to check availability for Sep 18." },
    { id: 'm2', from: 'me', text: 'Yes, I have a slot at 4pm that day.', status: 'sent' },
    { id: 'm3', from: 'them', text: 'Sure, 4pm works great for me!' },
  ],
};

// No messages backend exists yet, so sends are simulated locally with a short
// delay. Typing "fail" as a message previews the failed/retry state.
function simulateSend(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => (/fail/i.test(text) ? reject(new Error('send failed')) : resolve()), 650);
  });
}

type Props = {
  onNavigate?: (tab: NavTab, opts?: { threadId?: number }) => void;
  initialThreadId?: number | null;
  onThreadConsumed?: () => void;
};

export function MessagesScreen({ onNavigate, initialThreadId, onThreadConsumed }: Props) {
  const insets = useSafeAreaInsets();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messagesByThread, setMessagesByThread] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const active = THREADS.find((t) => t.id === activeId) ?? null;
  const messages = (activeId && messagesByThread[activeId]) || [];

  useEffect(() => {
    if (initialThreadId) {
      setActiveId(initialThreadId);
      onThreadConsumed?.();
    }
  }, [initialThreadId, onThreadConsumed]);

  const updateMessage = (threadId: number, id: string, patch: Partial<Message>) => {
    setMessagesByThread((prev) => ({
      ...prev,
      [threadId]: (prev[threadId] ?? []).map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  };

  const attemptSend = async (threadId: number, id: string, text: string) => {
    updateMessage(threadId, id, { status: 'sending' });
    try {
      await simulateSend(text);
      updateMessage(threadId, id, { status: 'sent' });
    } catch {
      updateMessage(threadId, id, { status: 'failed' });
    }
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !active) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const id = `${Date.now()}`;
    setMessagesByThread((prev) => ({ ...prev, [active.id]: [...(prev[active.id] ?? []), { id, from: 'me', text, status: 'sending' }] }));
    setDraft('');
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    attemptSend(active.id, id, text);
  };

  const handleRetry = (id: string, text: string) => {
    if (!active) return;
    attemptSend(active.id, id, text);
  };

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      {active ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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

          {messages.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <EmptyState title="No messages yet" subtitle={`Say hello to ${active.name} to start the conversation.`} />
            </View>
          ) : (
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
            >
              {messages.map((m) => (
                <View key={m.id} style={[styles.messageRow, m.from === 'me' && styles.messageRowMe]}>
                  {m.from === 'me' ? (
                    <View style={{ alignItems: 'flex-end' }}>
                      <LinearGradient
                        colors={gradients.accentButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.bubble, styles.bubbleMe, m.status === 'sending' && styles.bubbleSending]}
                      >
                        <Text style={[styles.bubbleText, styles.bubbleTextMe]}>{m.text}</Text>
                      </LinearGradient>
                      {m.status === 'sending' && <Text style={styles.statusText}>Sending…</Text>}
                      {m.status === 'sent' && <Text style={styles.statusText}>Just now</Text>}
                      {m.status === 'failed' && (
                        <Text style={styles.statusTextFailed}>
                          Failed to send ·{' '}
                          <Text style={styles.retryLink} onPress={() => handleRetry(m.id, m.text)}>
                            Retry
                          </Text>
                        </Text>
                      )}
                    </View>
                  ) : (
                    <View style={[styles.bubble, styles.bubbleThem]}>
                      <Text style={styles.bubbleText}>{m.text}</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          <View style={[styles.composer, { paddingBottom: insets.bottom + 12 }]}>
            <View style={styles.composerInput}>
              <TextInput
                style={styles.composerTextInput}
                value={draft}
                onChangeText={setDraft}
                placeholder="Message"
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>
            <ScalePressable
              style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!draft.trim()}
              scaleTo={0.9}
            >
              {draft.trim() ? (
                <LinearGradient colors={gradients.accentButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
              ) : null}
              <Text style={[styles.sendIcon, !draft.trim() && styles.sendIconDisabled]}>↑</Text>
            </ScalePressable>
          </View>
        </KeyboardAvoidingView>
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
  bubbleSending: { opacity: 0.55 },
  bubbleText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 19, color: colors.textPrimary },
  bubbleTextMe: { color: colors.onAccent },
  statusText: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.textTertiary, marginTop: 4, marginRight: 2 },
  statusTextFailed: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.orange, marginTop: 4, marginRight: 2 },
  retryLink: { color: colors.teal, fontFamily: fonts.medium },
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
    minHeight: 44,
    maxHeight: 110,
    borderRadius: 22,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  composerTextInput: { fontFamily: fonts.regular, fontSize: 14.5, color: colors.textPrimary, padding: 0 },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: colors.surfaceStrong },
  sendButtonDisabled: {},
  sendIcon: { fontSize: 15, color: colors.onAccent },
  sendIconDisabled: { color: colors.textMuted },
});
