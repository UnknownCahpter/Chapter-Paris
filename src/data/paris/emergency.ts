import type { EmergencyContact } from '../../config/trip.types';

export const emergencyContacts: EmergencyContact[] = [
    { icon: '🚨', label: 'Police', number: '17', action: 'call' },
    { icon: '🚑', label: 'SAMU (Ambulance)', number: '15', action: 'call' },
    { icon: '🔥', label: 'Fire / Pompiers', number: '18', action: 'call' },
    { icon: '🌍', label: 'EU Emergency', number: '112', action: 'call' },
    { icon: '🏥', label: 'Hotel-Dieu Hospital', number: '+33 1 42 34 82 34', action: 'call' },
    { icon: '🏨', label: 'Hotel Le Senat', number: '+33 1 43 54 62 62', action: 'call' },
];
