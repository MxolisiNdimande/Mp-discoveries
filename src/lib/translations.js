export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'fr', name: 'French', flag: '🇫🇷' }
];

export const translations = {
  en: {
    back: 'Back',
    discoverMpumalanga: 'Discover Mpumalanga',
    touchToExplore: 'Touch any destination to explore activities, accommodation, and travel information',
    myRoute: 'My Route',
    activities: 'Activities',
    travelInfo: 'Travel Info',
    accommodation: 'Accommodation',
    liveTracking: 'Live Tracking',
    nearbyAccommodation: 'Nearby Accommodation',
    addToRoute: 'Add to Route',
    emailInfo: 'Email Info',
    getQRCode: 'Get QR Code'
  },
  af: {
    back: 'Terug',
    discoverMpumalanga: 'Ontdek Mpumalanga',
    touchToExplore: 'Raak enige bestemming aan om aktiwiteite, akkommodasie en reisinligting te verken',
    myRoute: 'My Roete',
    activities: 'Aktiwiteite',
    travelInfo: 'Reisinligting',
    accommodation: 'Akkommodasie',
    liveTracking: 'Lewendige Opvolging',
    nearbyAccommodation: 'Nabygeleë Akkommodasie',
    addToRoute: 'Voeg by Roete',
    emailInfo: 'E-pos Inligting',
    getQRCode: 'Kry QR-kode'
  },
  zu: {
    back: 'Emuva',
    discoverMpumalanga: 'Thola i-Mpumalanga',
    touchToExplore: 'Thepha noma iyiphi indawo ukuze uhlole imisebenzi, indawo yokuhlala, nolwazi lwezohambo',
    myRoute: 'Indlela Yami',
    activities: 'Imisebenzi',
    travelInfo: 'Ulwazi Lohambo',
    accommodation: 'Indawo Yokuhlala',
    liveTracking: 'Ukulandelela Okuphephile',
    nearbyAccommodation: 'Indawo Yokuhlala Eseduze',
    addToRoute: 'Yengeza Endleleni',
    emailInfo: 'Ulwazi Lwe-imeyili',
    getQRCode: 'Thola Ikhodi Ye-QR'
  }
};

export function translate(key, language = 'en') {
  return translations[language]?.[key] || translations.en[key] || key;
}