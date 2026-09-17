import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { auth, db } from './firebase';

export type BookingRequest = {
  listingId: number;
  provider: string;
  dateLabel: string;
  timeLabel: string;
  note: string;
};

// Thrown when the provider already has a booking for the same slot, so the
// caller can show the "unavailable" outcome instead of a generic failure.
export class SlotUnavailableError extends Error {}

export async function requestBooking({ listingId, provider, dateLabel, timeLabel, note }: BookingRequest) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('You need to be signed in to request a booking.');

  const bookings = collection(db, 'listing_bookings');
  const conflict = await getDocs(
    query(
      bookings,
      where('listing_id', '==', listingId),
      where('provider', '==', provider),
      where('date_label', '==', dateLabel),
      where('time_label', '==', timeLabel),
      where('status', '==', 'requested'),
    ),
  );
  if (!conflict.empty) {
    throw new SlotUnavailableError('That slot was just booked by someone else.');
  }

  await addDoc(bookings, {
    listing_id: listingId,
    provider,
    date_label: dateLabel,
    time_label: timeLabel,
    note: note.trim(),
    client_id: uid,
    status: 'requested',
    created_at: serverTimestamp(),
  });
}
