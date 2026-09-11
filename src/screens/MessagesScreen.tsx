import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../theme/colors';

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

const NAV_ITEMS = ['Explore', 'Bookings', 'Messages', 'Profile'];

type Props = {
  onNavigate?: (tab: 'explore' | 'bookings' | 'messages' | 'profile') => void;
};

export function MessagesScreen({ onNavigate }: Props) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const active = THREADS.find((t) => t.id === activeId) ?? null;

  return (
    <SafeAreaView style={styles.screen}>
      {active ? (
        <>
          <View style={styles.threadHeader}>
            <TouchableOpacity onPress={() => setActiveId(null)} hitSlop={10}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.avatarSmall} />
            <Text style={styles.threadName}>{active.name}</Text>
          </View>

          <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent}>
            {CONVERSATION.map((m, i) => (
              <View key={i} style={[styles.messageRow, m.from === 'me' && styles.messageRowMe]}>
                <View style={[styles.bubble, m.from === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={[styles.bubbleText, m.from === 'me' && styles.bubbleTextMe]}>{m.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.composer}>
            <View style={styles.composerInput}>
              <Text style={styles.composerPlaceholder}>Type a message…</Text>
            </View>
            <View style={styles.sendButton}>
              <Text style={styles.sendIcon}>➤</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.listHeader}>
            <Text style={styles.heading}>Messages</Text>
          </View>

          <ScrollView>
            {THREADS.map((t) => (
              <TouchableOpacity key={t.id} onPress={() => setActiveId(t.id)} style={styles.threadRow}>
                <View style={styles.avatar} />
                <View style={styles.threadInfo}>
                  <View style={styles.threadTopRow}>
                    <Text style={styles.threadRowName}>{t.name}</Text>
                    <Text style={styles.threadTime}>{t.time}</Text>
                  </View>
                  <Text style={styles.threadPreview} numberOfLines={1}>
                    {t.preview}
                  </Text>
                </View>
                {t.unread && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      <View style={styles.navBar}>
        {NAV_ITEMS.map((label) => (
          <TouchableOpacity
            key={label}
            style={styles.navItem}
            onPress={() => label !== 'Messages' && onNavigate?.(label.toLowerCase() as any)}
          >
            <Text style={[styles.navText, label === 'Messages' && styles.navTextActive]}>
              {label.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  listHeader: { padding: 22, paddingBottom: 14 },
  heading: {
    fontFamily: fonts.headingBold,
    fontSize: 26,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20,19,16,0.08)',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.violet },
  avatarSmall: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.violet },
  threadInfo: { flex: 1, minWidth: 0 },
  threadTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  threadRowName: { fontFamily: fonts.monoSemiBold, fontSize: 11.5, color: colors.ink },
  threadTime: { fontFamily: fonts.mono, fontSize: 8.5, color: colors.grey },
  threadPreview: { fontFamily: fonts.mono, fontSize: 10, color: colors.grey, marginTop: 2 },
  unreadDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.violet },
  threadHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20,19,16,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backIcon: { fontSize: 16, color: colors.ink },
  threadName: { fontFamily: fonts.monoSemiBold, fontSize: 12.5, color: colors.ink },
  messages: { flex: 1 },
  messagesContent: { padding: 14, paddingHorizontal: 16, gap: 10 },
  messageRow: { flexDirection: 'row', justifyContent: 'flex-start' },
  messageRowMe: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '75%', paddingVertical: 9, paddingHorizontal: 12 },
  bubbleThem: { backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(20,19,16,0.15)' },
  bubbleMe: { backgroundColor: colors.violet },
  bubbleText: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 15, color: colors.ink },
  bubbleTextMe: { color: colors.paper },
  composer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(20,19,16,0.15)',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  composerInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.ink,
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  composerPlaceholder: { fontFamily: fonts.mono, fontSize: 11, color: colors.grey },
  sendButton: {
    width: 38,
    height: 38,
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { fontSize: 13, color: colors.paper },
  navBar: {
    height: 78,
    backgroundColor: colors.paper,
    borderTopWidth: 1.5,
    borderTopColor: colors.ink,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 5 },
  navText: { fontFamily: fonts.mono, fontSize: 8, letterSpacing: 0.3, color: colors.grey },
  navTextActive: { color: colors.violet },
});
