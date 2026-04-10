import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Wallet, Wrench, Copy, Home, X, Phone, Sun, Moon, UtensilsCrossed, Navigation, ExternalLink, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { expensesRef, itineraryRef, safeOnValue, transactRef } from './firebase';
import { tripConfig } from './config/tripConfig';
import type { Venue, Location, LocationType } from './config/trip.types';
import DiningSection from './components/DiningSection';
import './App.css';

type FontSize = 'normal' | 'large' | 'x-large';
const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  normal: 'font-size-normal',
  large: 'font-size-large',
  'x-large': 'font-size-xlarge',
};
const FONT_SIZES: FontSize[] = ['normal', 'large', 'x-large'];

type ExpenseEntry = { id: number; item: string; amount: string; currency: string; time: string; date?: string };

const formatTime = (rawTime: string) => {
  if (!rawTime) return '';
  return rawTime.replace(/am|pm/i, (match) => match.toLowerCase());
};

const normalizeLookupKey = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase();

const toTitleCase = (value: string) =>
  value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' · ');

const normalizeExpenses = (value: ExpenseEntry[] | Record<string, ExpenseEntry> | null | undefined): ExpenseEntry[] => {
  if (!value) return [];
  return (Array.isArray(value) ? value : Object.values(value)).sort((a, b) => b.id - a.id);
};

const WeatherWidget = () => {
  const [forecast, setForecast] = useState<any[]>([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { latitude, longitude } = tripConfig.coordinates;
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await res.json();

        const days = data.daily.time.slice(0, 3).map((date: string, i: number) => {
          const dateObj = new Date(date);
          const dayLabel = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return {
            date: `${dayLabel} (${dateStr})`,
            code: data.daily.weathercode[i],
            max: Math.round(data.daily.temperature_2m_max[i]),
            min: Math.round(data.daily.temperature_2m_min[i])
          };
        });
        setForecast(days);
      } catch (e) {
        console.error("Weather fetch failed", e);
      }
    };
    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return '☀️';
    if ([1, 2, 3].includes(code)) return '⛅';
    if ([45, 48].includes(code)) return '🌫️';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
    if (code >= 95) return '⛈️';
    return '🌤️';
  };

  if (forecast.length === 0) return null;

  return (
    <div className="weather-widget">
      <div className="weather-grid">
        {forecast.map((day, i) => (
          <div key={i} className="weather-day">
            <span className="weather-label">{day.date}</span>
            <span className="weather-icon">{getWeatherIcon(day.code)}</span>
            <span className="weather-temp">{day.max}° / {day.min}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LOCATION_TYPE_OPTIONS: { value: LocationType; label: string; icon: string }[] = [
  { value: 'food', label: 'Food', icon: '🍽' },
  { value: 'attraction', label: 'Attraction', icon: '🎯' },
  { value: 'shopping', label: 'Shopping', icon: '🛍' },
  { value: 'transport', label: 'Transport', icon: '🚆' },
  { value: 'photo', label: 'Photo', icon: '📸' },
  { value: 'hotel', label: 'Hotel', icon: '🏨' },
  { value: 'activity', label: 'Activity', icon: '🎪' },
  { value: 'museum', label: 'Museum', icon: '🏛' },
  { value: 'bar', label: 'Bar', icon: '🍷' },
  { value: 'church', label: 'Church', icon: '⛪' },
  { value: 'flight', label: 'Flight', icon: '✈' },
  { value: 'relax', label: 'Relax', icon: '😌' },
];

interface ItemEditSheetProps {
  item: Location | null;
  onSave: (item: Location) => void;
  onDelete: () => void;
  onClose: () => void;
}

const ItemEditSheet = ({ item, onSave, onDelete, onClose }: ItemEditSheetProps) => {
  const [time, setTime] = useState(item?.time ?? '');
  const [name, setName] = useState(item?.name ?? '');
  const [type, setType] = useState<LocationType>(item?.type ?? 'activity');
  const isNew = item === null;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ time: time.trim() || 'TBD', name: name.trim(), type });
    onClose();
  };

  return (
    <div className="edit-sheet-overlay" onClick={onClose}>
      <motion.div
        className="edit-sheet"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      >
        <div className="edit-sheet-header">
          <span className="edit-sheet-title">{isNew ? 'Add Item' : 'Edit Item'}</span>
          <button className="btn-close-modal" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="edit-sheet-body">
          <label className="edit-field-label">Time</label>
          <input
            className="edit-field-input"
            placeholder="e.g. 10:00am, Morning, Lunch"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <label className="edit-field-label">Name</label>
          <input
            className="edit-field-input"
            placeholder="Activity name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="edit-field-label">Type</label>
          <div className="edit-type-grid">
            {LOCATION_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`edit-type-pill ${type === opt.value ? 'active' : ''}`}
                onClick={() => setType(opt.value)}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="edit-sheet-footer">
          {!isNew ? (
            <button className="edit-btn-delete" onClick={() => { onDelete(); onClose(); }}>
              <Trash2 size={14} /> Delete
            </button>
          ) : <div />}
          <button
            className="edit-btn-save"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const JourneyView = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [mapTitle, setMapTitle] = useState('');
  const [itineraryOverrides, setItineraryOverrides] = useState<Record<string, Location[]>>({});
  const [editSheet, setEditSheet] = useState<{ dayId: string; item: Location | null; index: number | null } | null>(null);

  const baseItinerary = tripConfig.itinerary;
  const localItinerary = baseItinerary.map((day) => ({
    ...day,
    locations: itineraryOverrides[day.id] ?? day.locations,
  }));
  const selectedDay = localItinerary[selectedDayIndex];

  // Firebase sync
  useEffect(() => {
    const unsubscribe = safeOnValue(itineraryRef, (snapshot) => {
      const data = snapshot.val() as Record<string, Location[]> | null;
      if (data) setItineraryOverrides(data);
    });
    return () => unsubscribe();
  }, []);

  const saveDay = (dayId: string, locations: Location[]) => {
    setItineraryOverrides((prev) => ({ ...prev, [dayId]: locations }));
    transactRef(itineraryRef, (current: Record<string, Location[]> | null) => ({
      ...(current ?? {}),
      [dayId]: locations,
    }));
  };

  const handleSaveItem = (dayId: string, index: number | null, updated: Location) => {
    const base = localItinerary.find((d) => d.id === dayId)?.locations ?? [];
    const next = index === null
      ? [...base, updated]
      : base.map((loc, i) => (i === index ? updated : loc));
    saveDay(dayId, next);
  };

  const handleDeleteItem = (dayId: string, index: number) => {
    const base = localItinerary.find((d) => d.id === dayId)?.locations ?? [];
    saveDay(dayId, base.filter((_, i) => i !== index));
  };

  const handleResetDay = (dayId: string) => {
    setItineraryOverrides((prev) => {
      const next = { ...prev };
      delete next[dayId];
      return next;
    });
    transactRef(itineraryRef, (current: Record<string, Location[]> | null) => {
      const next = { ...(current ?? {}) };
      delete next[dayId];
      return next;
    });
  };
  const venueLookup = (tripConfig.venues ?? []).reduce<Record<string, Venue>>((acc, venue) => {
    if (venue) {
      acc[normalizeLookupKey(venue.name)] = venue;
    }
    return acc;
  }, {});

  useEffect(() => {
    if (mapUrl) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [mapUrl]);

  const openMap = (locationName: string) => {
    const address = tripConfig.locationAddresses[locationName] || `${locationName} ${tripConfig.defaultMapFallback}`;
    setMapTitle(locationName);
    const isTrustedMapsUrl = address.startsWith('https://maps.google.com/') || address.startsWith('https://www.google.com/maps/');
    const embedUrl = (address.startsWith('https://') && isTrustedMapsUrl)
      ? `${address}&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
    setMapUrl(embedUrl);
  };

  const openExternal = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="day-list">
        <WeatherWidget />

        <div className="day-selector">
          {localItinerary.map((day, index) => (
            <button
              key={day.id}
              className={`day-tab ${selectedDayIndex === index ? 'active' : ''}`}
              onClick={() => setSelectedDayIndex(index)}
            >
              <span className="day-tab-title">{day.title}</span>
              <span className="day-tab-date">{day.date.split('·').slice(0, 2).join(' · ').trim()}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={selectedDay.id}
          className="day-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="day-header">
            <div>
              <span className="day-title">{selectedDay.title}</span>
              <span className="day-date">{selectedDay.date}</span>
            </div>
            <div className="day-header-actions">
              {itineraryOverrides[selectedDay.id] ? (
                <button
                  className="btn-day-action btn-day-reset"
                  onClick={() => handleResetDay(selectedDay.id)}
                  title="Reset to default"
                >
                  <RotateCcw size={13} />
                </button>
              ) : null}
              <button
                className="btn-day-action btn-day-add"
                onClick={() => setEditSheet({ dayId: selectedDay.id, item: null, index: null })}
                title="Add item"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="location-list timeline">
            {selectedDay.locations.map((loc, locIdx) => {
              const details = tripConfig.attractionData[loc.name];
              const optionCards = details?.options?.map((option) => {
                const matchedVenue = option.venueName ? venueLookup[normalizeLookupKey(option.venueName)] : undefined;
                return {
                  label: option.label,
                  title: option.title ?? matchedVenue?.name ?? option.venueName ?? '',
                  category: option.category ?? (matchedVenue?.category ? toTitleCase(matchedVenue.category) : ''),
                  priceRange: option.priceRange ?? matchedVenue?.priceRange ?? '',
                  rating: option.rating ?? matchedVenue?.googleRating,
                  address: option.address ?? matchedVenue?.address ?? '',
                  reservationUrl: option.reservationUrl ?? matchedVenue?.reservationUrl,
                  googleMapsUrl: option.googleMapsUrl ?? matchedVenue?.googleMapsUrl,
                  isMarcosPick: option.isMarcosPick ?? matchedVenue?.isMarcosPick ?? false,
                };
              }) ?? [];
              return (
                <div key={`${selectedDay.id}-${loc.time}-${loc.name}-${locIdx}`} className={`location-item timeline-item ${loc.isOptional ? 'optional-item' : ''}`}>
                  <div className="time-column">
                    <span className="time-text">{formatTime(loc.time)}</span>
                  </div>

                  <div className="timeline-connector">
                    <div className="timeline-dot"></div>
                    <div className="timeline-line"></div>
                  </div>

                  <div className="location-info">
                    <div className="location-details">
                      <div className="location-header">
                        <div>
                          <span className="location-name">{loc.name}</span>
                          {loc.tags && loc.tags.length > 0 ? (
                            <div className="location-tags">
                              {loc.tags.map((tag) => (
                                <span key={tag}>{tag}</span>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        <div className="location-header-actions">
                          {!loc.disableNavigation ? (
                            <button
                              className="btn-matcha"
                              onClick={() => openMap(loc.name)}
                            >
                              <Navigation size={12} />
                              Navigate
                            </button>
                          ) : null}
                          <button
                            className="btn-edit-item"
                            onClick={() => setEditSheet({ dayId: selectedDay.id, item: loc, index: locIdx })}
                            aria-label="Edit item"
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                      </div>

                      {details ? (
                        <div className="story-block">
                          {details.image ? (
                            <img
                              className="story-image"
                              src={details.image}
                              alt={loc.name}
                              loading="lazy"
                              style={details.imagePosition ? { objectPosition: details.imagePosition } : undefined}
                            />
                          ) : null}
                          <div className="story-content">
                            <p className="story-desc">{details.desc}</p>
                            <p className="story-tips">{details.tips}</p>
                            {optionCards.length > 0 ? (
                              <div className="story-options">
                                <div className={`story-options-grid ${optionCards.length === 1 ? 'single' : ''}`}>
                                  {optionCards.map((option) => (
                                    <article key={`${loc.name}-${option.label}-${option.title}`} className="journey-option-card">
                                      <div className="journey-option-topline">
                                        <span className="journey-option-label">{option.label}</span>
                                        {option.isMarcosPick ? (
                                          <span className="journey-option-badge">Marco&apos;s Pick</span>
                                        ) : null}
                                      </div>
                                      <h4 className="journey-option-title">{option.title}</h4>
                                      <div className="journey-option-tags">
                                        {option.category ? <span>{option.category}</span> : null}
                                        {option.priceRange ? <span>{option.priceRange}</span> : null}
                                        {option.rating ? <span>{`★ ${option.rating.toFixed(1)}`}</span> : null}
                                      </div>
                                      {option.address ? <p className="journey-option-address">{option.address}</p> : null}
                                      <div className="journey-option-actions">
                                        {option.googleMapsUrl ? (
                                          <button className="journey-option-button secondary" onClick={() => openExternal(option.googleMapsUrl)}>
                                            <Navigation size={12} />
                                            Map
                                          </button>
                                        ) : null}
                                        {option.reservationUrl ? (
                                          <button className="journey-option-button primary" onClick={() => openExternal(option.reservationUrl)}>
                                            <ExternalLink size={12} />
                                            Reserve
                                          </button>
                                        ) : null}
                                      </div>
                                    </article>
                                  ))}
                                </div>
                                {details.optionNote ? <p className="story-option-note">{details.optionNote}</p> : null}
                              </div>
                            ) : null}
                            {details.funFacts && details.funFacts.length > 0 ? (
                              <div className="story-facts">
                                <span className="story-facts-title">Fun facts</span>
                                <ul className="story-facts-list">
                                  {details.funFacts.slice(0, 3).map((fact) => (
                                    <li key={fact}>{fact}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {editSheet ? (
          <ItemEditSheet
            item={editSheet.item}
            onSave={(updated) => handleSaveItem(editSheet.dayId, editSheet.index, updated)}
            onDelete={() => { if (editSheet.index !== null) handleDeleteItem(editSheet.dayId, editSheet.index); }}
            onClose={() => setEditSheet(null)}
          />
        ) : null}
      </AnimatePresence>

      {mapUrl ? (
        <div className="map-modal-overlay" onClick={() => setMapUrl(null)}>
          <motion.div
            className="map-modal-content"
            onClick={(event) => event.stopPropagation()}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="map-modal-header">
              <span className="map-modal-title">{mapTitle}</span>
              <button className="btn-close-modal" onClick={() => setMapUrl(null)} aria-label="Close Map">
                <X size={18} />
              </button>
            </div>
            <iframe
              className="map-iframe"
              src={mapUrl}
              allowFullScreen
              loading="lazy"
              title="Google Map"
              sandbox="allow-scripts allow-same-origin allow-popups"
            ></iframe>
          </motion.div>
        </div>
      ) : null}
    </>
  );
};

const ToolsView = () => {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const fallbackTimeoutRef = useRef<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (message: string) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2000);
  };

  // Cache voices so the first tap doesn't depend on getVoices racing the browser.
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    synth.addEventListener('voiceschanged', loadVoices);

    return () => {
      synth.removeEventListener('voiceschanged', loadVoices);
      if (fallbackTimeoutRef.current !== null) {
        window.clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Sorry, your browser doesn't support text-to-speech.");
      return;
    }

    const synth = window.speechSynthesis;
    const langCode = tripConfig.ttsLanguageCode;
    const excludedVoiceNames = new Set((tripConfig.ttsExcludedVoiceNames ?? []).map((voiceName) => voiceName.toLowerCase()));
    const voices = (availableVoices.length > 0 ? availableVoices : synth.getVoices())
      .filter((voice) => !excludedVoiceNames.has(voice.name.toLowerCase()));
    const frenchVoice = voices.find((voice) => voice.lang.includes('fr-FR') || voice.lang.includes('fr'));

    synth.resume();
    synth.cancel();

    if (fallbackTimeoutRef.current !== null) {
      window.clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }

    let didStartSpeaking = false;
    const buildUtterance = (selectedVoice?: SpeechSynthesisVoice, fallbackMode = false) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      if (selectedVoice && !fallbackMode) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        didStartSpeaking = true;
      };

      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance error:', event.error, {
          requestedLanguage: langCode,
          selectedVoice: selectedVoice?.name ?? 'none',
          selectedVoiceLanguage: selectedVoice?.lang ?? 'none',
          fallbackMode,
          availableVoices: voices.map(v => `${v.name} (${v.lang})`),
        });
      };

      return utterance;
    };

    if (synth.speaking || synth.pending) {
      synth.cancel();
    }

    synth.speak(buildUtterance(frenchVoice));

    fallbackTimeoutRef.current = window.setTimeout(() => {
      if (didStartSpeaking || synth.speaking) {
        fallbackTimeoutRef.current = null;
        return;
      }

      synth.cancel();
      synth.speak(buildUtterance(undefined, true));
      fallbackTimeoutRef.current = null;
    }, 700);
  };

  const { hotel, survivalPhrases, survivalPhrasesTitle, cheatSheet, cheatSheetTitle } = tripConfig;

  const copyAddress = () => {
    navigator.clipboard.writeText(hotel.fullAddress).then(() => {
      showToast('Address copied to clipboard');
    });
  };

  return (
    <div className="tools-view">
      <AnimatePresence>
        {toast ? (
          <motion.div
            className="copy-toast"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Hotel Card */}
      <div className="hotel-card">
        <span className="hotel-label"><Home size={12} /> {hotel.driverLabel || 'Take me home'}</span>
        <div className="hotel-info">
          <div className="hotel-name">{hotel.name}</div>
          <div className="hotel-address">{hotel.addressLine1}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{hotel.addressLine2}</div>
        </div>
        <button className="btn-copy" onClick={copyAddress} aria-label="Copy Address">
          <Copy size={18} />
        </button>
      </div>

      {/* Section A: Survival Phrases */}
      <div className="tools-card">
        <div className="tools-title">
          <span>{survivalPhrasesTitle}</span>
        </div>
        <div className="phrase-grid">
          {survivalPhrases.map((p, i) => (
            <motion.div
              key={i}
              className="phrase-btn"
              whileTap={{ scale: 0.95 }}
              onClick={() => speak(p.phrase)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
                <span style={{ fontSize: '1rem', color: 'var(--color-gold)' }}>🔊</span>
              </div>
              <span className="phrase-word">{p.phrase}</span>
              <span className="phrase-pronunciation">{p.pronunciation}</span>
              <span className="phrase-english">{p.english}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section B: Cheat Sheet */}
      <div className="tools-card">
        <div className="tools-title">
          <span>{cheatSheetTitle}</span>
        </div>
        <div className="cheat-sheet">
          {cheatSheet.map((c, i) => (
            <div key={i} className="cheat-item">
              <span className="cheat-label">
                <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
                {c.label}
              </span>
              <span className="cheat-value">{c.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WalletView = () => {
  const { currencies } = tripConfig;
  const summaryCurrencyOrder = ['GBP', 'NZD', 'EUR'].filter((code) => currencies.codes.includes(code));
  const currencySymbols: Record<string, string> = {
    EUR: '€',
    GBP: '£',
    NZD: 'NZ$',
  };

  // Currency State
  const [rates, setRates] = useState<Record<string, number>>(currencies.fallbackRates);
  const [rateStatus, setRateStatus] = useState<'live' | 'offline'>('offline');
  const [convertAmount, setConvertAmount] = useState<string>('100');
  const [baseCurrency, setBaseCurrency] = useState<string>(currencies.defaultConverterBase);
  const [summaryCurrency, setSummaryCurrency] = useState<string>(summaryCurrencyOrder[0] ?? currencies.homeCurrency);

  // Expense State with Firebase sync
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newItem, setNewItem] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCurrency, setNewCurrency] = useState(currencies.defaultExpenseCurrency);

  // Expense edit state
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editExpenseDate, setEditExpenseDate] = useState('');
  const [editExpenseItem, setEditExpenseItem] = useState('');
  const [editExpenseAmount, setEditExpenseAmount] = useState('');
  const [editExpenseCurrency, setEditExpenseCurrency] = useState(currencies.defaultExpenseCurrency);

  // Firebase listener for expenses — single source of truth
  useEffect(() => {
    const unsubscribe = safeOnValue(expensesRef, (snapshot) => {
      const data = snapshot.val() as ExpenseEntry[] | Record<string, ExpenseEntry> | null;
      setExpenses(normalizeExpenses(data));
    }, (error) => {
      console.error('Firebase expenses error:', error);
      // Fallback: load from localStorage only when Firebase is unavailable
      const saved = localStorage.getItem('trip_expenses');
      if (saved) {
        try {
          setExpenses(normalizeExpenses(JSON.parse(saved)));
        } catch {
          localStorage.removeItem('trip_expenses');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Cache to localStorage as backup
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('trip_expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  // Load Rates on Mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${currencies.apiBaseCurrency}`);
        if (!res.ok) throw new Error('API Failed');
        const data = await res.json();
        const newRates: Record<string, number> = {};
        for (const code of currencies.codes) {
          newRates[code] = code === currencies.apiBaseCurrency ? 1 : data.rates[code];
        }
        setRates(newRates);
        setRateStatus('live');
        localStorage.setItem('cached_rates', JSON.stringify(newRates));
      } catch (e) {
        console.log('Using cached rates');
        const cached = localStorage.getItem('cached_rates');
        if (cached) {
          try {
            setRates(JSON.parse(cached));
          } catch {
            localStorage.removeItem('cached_rates');
          }
        }
      }
    };
    fetchRates();
  }, []);

  // Conversion Logic
  const getConvertedVal = (targetCurr: string) => {
    const val = parseFloat(convertAmount) || 0;
    const valInBase = val / rates[baseCurrency];
    const valInTarget = valInBase * rates[targetCurr];
    return valInTarget.toFixed(2);
  };

  const addExpense = () => {
    if (!newItem || !newAmount) return;
    const expense = {
      id: Date.now(),
      date: newDate,
      item: newItem,
      amount: newAmount,
      currency: newCurrency,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [expense, ...expenses];
    setExpenses(updated);
    localStorage.setItem('trip_expenses', JSON.stringify(updated));
    transactRef<ExpenseEntry[]>(expensesRef, (current) => {
      const currentExpenses = normalizeExpenses(current);
      return [expense, ...currentExpenses];
    });
    setNewItem('');
    setNewAmount('');
    setNewDate(new Date().toISOString().split('T')[0]);
  };

  const deleteExpense = (id: number) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    localStorage.setItem('trip_expenses', JSON.stringify(updated));
    transactRef<ExpenseEntry[]>(expensesRef, (current) => {
      const currentExpenses = normalizeExpenses(current);
      return currentExpenses.filter((expense) => expense.id !== id);
    });
  };

  const startEditExpense = (expense: ExpenseEntry) => {
    setEditingExpenseId(expense.id);
    setEditExpenseDate(expense.date || new Date().toISOString().split('T')[0]);
    setEditExpenseItem(expense.item);
    setEditExpenseAmount(expense.amount);
    setEditExpenseCurrency(expense.currency);
  };

  const saveExpenseEdit = () => {
    if (!editingExpenseId) return;
    const updated = expenses.map(e =>
      e.id === editingExpenseId
        ? { ...e, date: editExpenseDate, item: editExpenseItem, amount: editExpenseAmount, currency: editExpenseCurrency }
        : e
    );
    setExpenses(updated);
    localStorage.setItem('trip_expenses', JSON.stringify(updated));
    transactRef<ExpenseEntry[]>(expensesRef, (current) => {
      const currentExpenses = normalizeExpenses(current);
      return currentExpenses.map((expense) =>
        expense.id === editingExpenseId
          ? { ...expense, date: editExpenseDate, item: editExpenseItem, amount: editExpenseAmount, currency: editExpenseCurrency }
          : expense,
      );
    });
    setEditingExpenseId(null);
  };

  const cancelExpenseEdit = () => {
    setEditingExpenseId(null);
  };

  const getSummaryTotal = () => {
    const totalInBase = expenses.reduce((acc, curr) => {
      const val = parseFloat(curr.amount) || 0;
      const rate = rates[curr.currency] || 1;
      return acc + (val / rate);
    }, 0);
    return (totalInBase * rates[summaryCurrency]).toFixed(2);
  };

  const getSummaryCurrencySymbol = (code: string) => currencySymbols[code] ?? code;

  const getNextSummaryCurrency = () => {
    if (summaryCurrencyOrder.length === 0) return currencies.homeCurrency;
    const currentIndex = summaryCurrencyOrder.indexOf(summaryCurrency);
    if (currentIndex === -1) return summaryCurrencyOrder[0];
    return summaryCurrencyOrder[(currentIndex + 1) % summaryCurrencyOrder.length];
  };

  const cycleSummaryCurrency = () => {
    setSummaryCurrency(getNextSummaryCurrency());
  };

  return (
    <div className="wallet-view">
      {/* Feature 1: Converter */}
      <div className="wallet-card">
        <div className="wallet-title">
          <span>💱 Quick Converter</span>
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '12px',
            background: rateStatus === 'live' ? 'rgba(201, 169, 110, 0.12)' : 'rgba(157, 150, 142, 0.12)',
            color: rateStatus === 'live' ? 'var(--color-gold)' : 'var(--color-muted)',
            border: '1px solid currentColor'
          }}>
            {rateStatus === 'live' ? '🟢 Live Rates' : '🟠 Offline Mode'}
          </span>
        </div>

        <div className="converter-grid">
          <div className="currency-input">
            <span className="currency-flag">{currencies.flags[baseCurrency] || '💰'}</span>
            <input
              type="number"
              className="currency-field"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
            />
            <select
              className="currency-select"
              style={{ border: 'none', background: 'transparent', fontWeight: 600, color: 'var(--color-ink-light)' }}
              value={baseCurrency}
              onChange={(e: any) => setBaseCurrency(e.target.value)}
            >
              {currencies.codes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {currencies.codes.filter(c => c !== baseCurrency).map(curr => (
              <div key={curr} style={{ padding: '0.75rem', background: 'var(--color-soft-surface)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{curr}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-ink)' }}>
                  {getConvertedVal(curr)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature 2: Expense Tracker */}
      <div className="wallet-card">
        <div className="wallet-title">
          <span>📝 Spending Log</span>
        </div>

        <div className="expense-form">
          <div className="form-row" style={{ marginBottom: '8px' }}>
            <input
              type="date"
              className="input-date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              style={{ flex: 1, padding: '8px', border: '1px solid var(--color-stone)', borderRadius: '8px', fontSize: '1rem' }}
            />
          </div>
          <input
            type="text"
            placeholder="Item (e.g. Dinner)"
            className="input-text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <div className="form-row">
            <input
              type="number"
              placeholder="Amount"
              className="input-number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
            <select
              className="input-select"
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value)}
            >
              {currencies.codes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <button className="btn-add" onClick={addExpense}>+</button>
          </div>
        </div>

        <div className="expense-list">
          {expenses.length === 0 && <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontStyle: 'italic' }}>No expenses yet</p>}
          {expenses.map(item => (
            <div key={item.id} className="expense-item">
              {editingExpenseId === item.id ? (
                // Edit Mode
                <>
                  <div className="expense-edit-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                      <input
                        type="date"
                        className="expense-edit-input"
                        value={editExpenseDate}
                        onChange={(e) => setEditExpenseDate(e.target.value)}
                      />
                      <input
                        type="text"
                        className="expense-edit-input"
                        value={editExpenseItem}
                        onChange={(e) => setEditExpenseItem(e.target.value)}
                        placeholder="Item"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        className="expense-edit-amount"
                        value={editExpenseAmount}
                        onChange={(e) => setEditExpenseAmount(e.target.value)}
                        placeholder="Amount"
                        style={{ flex: 1 }}
                      />
                      <select
                        className="expense-edit-currency"
                        value={editExpenseCurrency}
                        onChange={(e) => setEditExpenseCurrency(e.target.value)}
                        style={{ width: '80px' }}
                      >
                        {currencies.codes.map(code => (
                          <option key={code} value={code}>{code}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="expense-edit-actions">
                    <button className="btn-save-expense" onClick={saveExpenseEdit}>✓</button>
                    <button className="btn-cancel-expense" onClick={cancelExpenseEdit}>✕</button>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  <div className="expense-details">
                    <span className="expense-name">{item.item}</span>
                    <span className="expense-time">
                      {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      {item.date && ' • '}
                      {item.time}
                    </span>
                  </div>
                  <div className="expense-right">
                    <span className="expense-amount">{item.amount} <small>{item.currency}</small></span>
                    <span className="btn-edit-expense" onClick={() => startEditExpense(item)}>✎</span>
                    <span className="btn-delete" onClick={() => deleteExpense(item.id)}>×</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="total-summary">
          <div className="total-label">Total Spent</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <span
              className="total-amount"
              style={{ cursor: 'pointer' }}
              onClick={cycleSummaryCurrency}
            >
              {getSummaryCurrencySymbol(summaryCurrency)}
              {getSummaryTotal()}
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-ink-light)',
                cursor: 'pointer',
                opacity: 0.7,
              }}
              onClick={cycleSummaryCurrency}
            >
              ≈ {getSummaryCurrencySymbol(getNextSummaryCurrency())}
              {(() => {
                const otherCurrency = getNextSummaryCurrency();
                const totalInBase = expenses.reduce((acc, curr) => {
                  const val = parseFloat(curr.amount) || 0;
                  const rate = rates[curr.currency] || 1;
                  return acc + (val / rate);
                }, 0);
                return (totalInBase * rates[otherCurrency]).toFixed(2);
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [showIntro, setShowIntro] = useState(!!tripConfig.introVideo);
  const [activeTab, setActiveTab] = useState<'journey' | 'wallet' | 'tools' | 'food'>('journey');
  // New cross-generation features
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('trip_font_size') as FontSize) || 'normal';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('trip_dark_mode') === 'true';
  });
  const [showEmergency, setShowEmergency] = useState(false);

  // Dynamically set page title
  useEffect(() => {
    document.title = tripConfig.meta.title;
  }, []);

  // Dark mode effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('trip_dark_mode', String(darkMode));
  }, [darkMode]);

  // Font size effect
  useEffect(() => {
    localStorage.setItem('trip_font_size', fontSize);
  }, [fontSize]);

  const cycleFontSize = (direction: 'up' | 'down') => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    if (direction === 'up' && currentIndex < FONT_SIZES.length - 1) {
      setFontSize(FONT_SIZES[currentIndex + 1]);
    } else if (direction === 'down' && currentIndex > 0) {
      setFontSize(FONT_SIZES[currentIndex - 1]);
    }
  };

  const LogoComponent = tripConfig.LogoComponent;

  return (
    <>
      <AnimatePresence>
        {showIntro && tripConfig.introVideo && (
          <motion.div
            className="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <video
              className="intro-video"
              autoPlay
              muted
              playsInline
              onEnded={() => setShowIntro(false)}
            >
              <source src={tripConfig.introVideo} type="video/mp4" />
            </video>
            <button
              className="btn-skip-intro"
              onClick={() => setShowIntro(false)}
            >
              Skip Intro →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`container ${FONT_SIZE_CLASSES[fontSize]}`}>
        <header className="header">
          {/* Top controls: font size + dark mode */}
          <div className="header-controls">
            <div className="font-size-controls">
              <button
                className="btn-font-size"
                onClick={() => cycleFontSize('down')}
                disabled={fontSize === 'normal'}
                aria-label="Decrease font size"
              >
                A-
              </button>
              <button
                className="btn-font-size"
                onClick={() => cycleFontSize('up')}
                disabled={fontSize === 'x-large'}
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>
            <button
              className="btn-dark-mode"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {LogoComponent && <LogoComponent />}
          <motion.h1
            className="title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {tripConfig.meta.title}
          </motion.h1>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {tripConfig.meta.subtitle}
          </motion.p>
        </header>

        {activeTab === 'journey' && <JourneyView />}

        {activeTab === 'wallet' && <WalletView />}

        {activeTab === 'tools' && <ToolsView />}

        {activeTab === 'food' && (
          <DiningSection />
        )}

        {/* Emergency Overlay */}
        <AnimatePresence>
          {showEmergency && (
            <motion.div
              className="emergency-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmergency(false)}
            >
              <motion.div
                className="emergency-panel"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="emergency-close" onClick={() => setShowEmergency(false)}>
                  <X size={20} />
                </button>
                <div className="emergency-title">{tripConfig.emergencyTitle}</div>
                <div className="emergency-list">
                  {tripConfig.emergencyContacts.map((contact, i) => (
                    <a
                      key={i}
                      className="emergency-item"
                      href={contact.action === 'call' ? `tel:${contact.number.replace(/[^+\d]/g, '')}` : '#'}
                    >
                      <span className="emergency-icon">{contact.icon}</span>
                      <div className="emergency-info">
                        <span className="emergency-label">{contact.label}</span>
                        <span className="emergency-number">{contact.number}</span>
                      </div>
                      <Phone size={18} className="emergency-phone" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Emergency Button */}
        <button
          className="btn-emergency-float"
          onClick={() => setShowEmergency(true)}
          aria-label="Emergency contacts"
        >
          🆘
        </button>

        {/* Bottom Navigation */}
        <nav className="bottom-nav">
          <button
            className={`nav-tab ${activeTab === 'journey' ? 'active' : ''}`}
            onClick={() => setActiveTab('journey')}
          >
            <Map size={24} />
            <span>Journey</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            <Wallet size={24} />
            <span>Wallet</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            <Wrench size={24} />
            <span>Tools</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            <UtensilsCrossed size={24} />
            <span>Dining</span>
          </button>
        </nav>
      </div>
    </>
  );
}

export default App;
