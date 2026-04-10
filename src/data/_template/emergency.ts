import type { EmergencyContact } from '../../config/trip.types';

// ── Emergency Contacts ────────────────────────────────────
// Shown in the emergency panel (red floating button).
// action: 'call' renders as a tel: link.
// action: 'info' renders as non-tappable info text.

export const emergencyContacts: EmergencyContact[] = [
    // { icon: '🚨', label: 'Police', number: '999', action: 'call' },
    // { icon: '🚑', label: 'Ambulance', number: '999', action: 'call' },
    // { icon: '📞', label: 'Tour Operator', number: '+1-XXX-XXX-XXXX', action: 'call' },
];
