// Firebase Configuration for Travel App Template
// Uses environment variables — see .env.example for setup
// Gracefully handles missing credentials (app works offline without Firebase)
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
    doc,
    getFirestore,
    onSnapshot,
    runTransaction as runFirestoreTransaction,
    setDoc,
    type DocumentReference,
    type Firestore,
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app: FirebaseApp | null = null;
let firestore: Firestore | null = null;

if (isFirebaseConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        firestore = getFirestore(app, 'default');
    } catch (error) {
        console.error('[firebase] initialization failed', error);
    }
} else {
    console.warn('[firebase] initialization skipped', {
        reason: 'Missing required Firebase config for current gate',
        projectId: firebaseConfig.projectId,
        hasApiKey: !!firebaseConfig.apiKey,
        hasProjectId: !!firebaseConfig.projectId,
    });
}

type SharedRef = {
    kind: 'firestore';
    path: string;
    ref: DocumentReference;
};

const createRef = (path: string): SharedRef | null => {
    if (firestore) {
        return {
            kind: 'firestore',
            path,
            ref: doc(firestore, 'sharedState', path.replace(/[^\w-]+/g, '__')),
        };
    }
    return null;
};

import { firebaseNamespace } from './config/city.config';

export const itineraryRef = createRef(`${firebaseNamespace}/itinerary`);
export const expensesRef = createRef(`${firebaseNamespace}/expenses`);

// Helper functions — silently no-op if Firebase is not configured
export const updateItinerary = async (data: any) => {
    if (!itineraryRef) return;
    try {
        await setDoc(itineraryRef.ref, {
            value: data,
            updatedAt: Date.now(),
        }, { merge: true });
    } catch (error) {
        console.error('Error updating itinerary:', error);
    }
};

export const updateExpenses = async (data: any) => {
    if (!expensesRef) return;
    try {
        await setDoc(expensesRef.ref, {
            value: data,
            updatedAt: Date.now(),
        }, { merge: true });
    } catch (error) {
        console.error('Error updating expenses:', error);
    }
};

export const transactRef = async <T,>(refObj: any, updater: (current: T | null) => T) => {
    if (!refObj) return;
    try {
        if (!firestore) return;
        await runFirestoreTransaction(firestore, async (transaction) => {
            const snapshot = await transaction.get(refObj.ref);
            const payload = snapshot.data() as { value?: T } | undefined;
            const current = snapshot.exists() ? (payload?.value ?? null) : null;
            const next = updater(current);
            transaction.set(refObj.ref, {
                value: next,
                updatedAt: Date.now(),
            }, { merge: true });
            return next;
        });
    } catch (error) {
        console.error('Error running Firebase transaction:', error);
    }
};

// Re-export with safe wrappers
export const safeOnValue = (refObj: any, callback: (snapshot: any) => void, errorCallback?: (error: any) => void) => {
    if (!refObj) {
        // No Firebase — trigger error callback so app falls back to config
        if (errorCallback) errorCallback(new Error('Firebase not configured'));
        return () => { };
    }
    return onSnapshot(refObj.ref, (snapshot) => {
        const payload = snapshot.data() as { value?: unknown } | undefined;
        callback({
            val: () => (snapshot.exists() ? payload?.value ?? null : null),
        });
    }, errorCallback);
};

export { firestore };
