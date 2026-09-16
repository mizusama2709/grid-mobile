import assert from 'node:assert/strict';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

let passed = 0;
async function check(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`ok - ${name}`);
  } catch (err) {
    console.error(`FAIL - ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

const testEnv = await initializeTestEnvironment({
  projectId: 'grid-mobile-rules-test',
  firestore: {
    rules: readFileSync('firestore.rules', 'utf8'),
    host: '127.0.0.1',
    port: 8080,
  },
});

// Seed as admin, bypassing rules.
async function seed(fn) {
  await testEnv.withSecurityRulesDisabled(async (ctx) => fn(ctx.firestore()));
}

const freelancerUid = 'freelancer-1';
const clientUid = 'client-1';
const otherUid = 'other-1';

await seed(async (db) => {
  await setDoc(doc(db, 'users', freelancerUid), {
    email: 'freelancer@example.com',
    role: 'freelancer',
    name: 'Freelancer One',
    created_at: serverTimestamp(),
  });
  await setDoc(doc(db, 'users', clientUid), {
    email: 'client@example.com',
    role: 'client',
    name: 'Client One',
    phone: '+91-9999999999',
    created_at: serverTimestamp(),
  });
  await setDoc(doc(db, 'jobs', 'job-1'), {
    client_id: clientUid,
    title: 'Product shoot',
    description: 'Need product photos',
    category: 'Photographer',
    status: 'open',
    created_at: serverTimestamp(),
  });
  await setDoc(doc(db, 'gigs', 'gig-1'), {
    freelancer_id: freelancerUid,
    title: 'Portrait session',
    description: 'Golden hour portraits',
    category: 'Photographer',
    rate: 3500,
    rate_type: 'hourly',
    created_at: serverTimestamp(),
  });
});

// --- Role escalation ---
await check('user cannot escalate their own role on update', async () => {
  const db = testEnv.authenticatedContext(clientUid, { email: 'client@example.com' }).firestore();
  await assertFails(
    updateDoc(doc(db, 'users', clientUid), { role: 'freelancer' })
  );
});

await check('user can update allowed fields without touching role', async () => {
  const db = testEnv.authenticatedContext(clientUid, { email: 'client@example.com' }).firestore();
  await assertSucceeds(
    updateDoc(doc(db, 'users', clientUid), { name: 'Client One Updated' })
  );
});

// --- PII reads ---
await check('a user cannot read another user\'s private profile (PII)', async () => {
  const db = testEnv.authenticatedContext(freelancerUid, { email: 'freelancer@example.com' }).firestore();
  await assertFails(getDoc(doc(db, 'users', clientUid)));
});

await check('a user can read their own profile', async () => {
  const db = testEnv.authenticatedContext(clientUid, { email: 'client@example.com' }).firestore();
  await assertSucceeds(getDoc(doc(db, 'users', clientUid)));
});

// --- Application creation: forged parent id / forged status / extra fields ---
await check('application create rejects forged freelancer_id', async () => {
  const db = testEnv.authenticatedContext(freelancerUid, { email: 'freelancer@example.com' }).firestore();
  await assertFails(
    setDoc(doc(db, 'jobs/job-1/applications/app-1'), {
      job_id: 'job-1',
      freelancer_id: otherUid,
      status: 'pending',
      created_at: serverTimestamp(),
    })
  );
});

await check('application create rejects forged job_id (parent mismatch)', async () => {
  const db = testEnv.authenticatedContext(freelancerUid, { email: 'freelancer@example.com' }).firestore();
  await assertFails(
    setDoc(doc(db, 'jobs/job-1/applications/app-2'), {
      job_id: 'some-other-job',
      freelancer_id: freelancerUid,
      status: 'pending',
      created_at: serverTimestamp(),
    })
  );
});

await check('application create rejects forged initial status', async () => {
  const db = testEnv.authenticatedContext(freelancerUid, { email: 'freelancer@example.com' }).firestore();
  await assertFails(
    setDoc(doc(db, 'jobs/job-1/applications/app-3'), {
      job_id: 'job-1',
      freelancer_id: freelancerUid,
      status: 'accepted',
      created_at: serverTimestamp(),
    })
  );
});

await check('application create rejects extra fields', async () => {
  const db = testEnv.authenticatedContext(freelancerUid, { email: 'freelancer@example.com' }).firestore();
  await assertFails(
    setDoc(doc(db, 'jobs/job-1/applications/app-4'), {
      job_id: 'job-1',
      freelancer_id: freelancerUid,
      status: 'pending',
      created_at: serverTimestamp(),
      admin_note: 'sneaky field',
    })
  );
});

await check('application create succeeds with correct owner/parent/status', async () => {
  const db = testEnv.authenticatedContext(freelancerUid, { email: 'freelancer@example.com' }).firestore();
  await assertSucceeds(
    setDoc(doc(db, 'jobs/job-1/applications/app-ok'), {
      job_id: 'job-1',
      freelancer_id: freelancerUid,
      status: 'pending',
      created_at: serverTimestamp(),
    })
  );
});

// --- Booking creation: forged parent id / forged status / extra fields ---
await check('booking create rejects forged client_id', async () => {
  const db = testEnv.authenticatedContext(clientUid, { email: 'client@example.com' }).firestore();
  await assertFails(
    setDoc(doc(db, 'gigs/gig-1/bookings/booking-1'), {
      gig_id: 'gig-1',
      client_id: otherUid,
      status: 'requested',
      created_at: serverTimestamp(),
    })
  );
});

await check('booking create rejects forged gig_id (parent mismatch)', async () => {
  const db = testEnv.authenticatedContext(clientUid, { email: 'client@example.com' }).firestore();
  await assertFails(
    setDoc(doc(db, 'gigs/gig-1/bookings/booking-2'), {
      gig_id: 'some-other-gig',
      client_id: clientUid,
      status: 'requested',
      created_at: serverTimestamp(),
    })
  );
});

await check('booking create rejects forged initial status', async () => {
  const db = testEnv.authenticatedContext(clientUid, { email: 'client@example.com' }).firestore();
  await assertFails(
    setDoc(doc(db, 'gigs/gig-1/bookings/booking-3'), {
      gig_id: 'gig-1',
      client_id: clientUid,
      status: 'confirmed',
      created_at: serverTimestamp(),
    })
  );
});

await check('booking create rejects extra fields', async () => {
  const db = testEnv.authenticatedContext(clientUid, { email: 'client@example.com' }).firestore();
  await assertFails(
    setDoc(doc(db, 'gigs/gig-1/bookings/booking-4'), {
      gig_id: 'gig-1',
      client_id: clientUid,
      status: 'requested',
      created_at: serverTimestamp(),
      discount_code: 'sneaky',
    })
  );
});

await check('booking create succeeds with correct owner/parent/status', async () => {
  const db = testEnv.authenticatedContext(clientUid, { email: 'client@example.com' }).firestore();
  await assertSucceeds(
    setDoc(doc(db, 'gigs/gig-1/bookings/booking-ok'), {
      gig_id: 'gig-1',
      client_id: clientUid,
      status: 'requested',
      created_at: serverTimestamp(),
    })
  );
});

// --- Status transition validation on update ---
await check('gig owner can confirm a requested booking', async () => {
  const db = testEnv.authenticatedContext(freelancerUid, { email: 'freelancer@example.com' }).firestore();
  await assertSucceeds(
    updateDoc(doc(db, 'gigs/gig-1/bookings/booking-ok'), { status: 'confirmed' })
  );
});

await check('client cannot self-confirm their own booking', async () => {
  const db = testEnv.authenticatedContext(clientUid, { email: 'client@example.com' }).firestore();
  await assertFails(
    updateDoc(doc(db, 'gigs/gig-1/bookings/booking-4'), { status: 'confirmed' })
  );
});

await testEnv.cleanup();

console.log(`\n${passed} check(s) passed.`);
if (process.exitCode) {
  console.error('Some rules regression checks failed.');
  process.exit(1);
}
