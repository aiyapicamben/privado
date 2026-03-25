// Vehicle image mapping
export const vehicleImages = {
  'TOGG T10X': '/privado/images/togg-t10x.png',
  'TOGG T10F': '/privado/images/togg-t10f.png',
};

export const vehicleMarkerImages = {
  'TOGG T10X': '/privado/images/marker-t10x.png',
  'TOGG T10F': '/privado/images/marker-t10f.png',
};

// ==========================================
//  GEMLİK, BURSA - Gerçek Koordinatlar
//  Harita: Sokak ve cadde bazlı yerleşim
// ==========================================

// TOGG araçları - Gemlik gerçek caddeleri üzerinde
export const mockVehicles = [
  {
    id: 'TOGG-001',
    model: 'TOGG T10X',
    plate: '16 TG 1001',
    battery: 87,
    range: 340,
    lat: 40.4338,    // Cumhuriyet Mahallesi, Gül Caddesi üzeri
    lng: 29.1572,
    color: 'Anadolu Mavisi',
    year: 2025,
    seats: 5,
    pricing: { driving: 10, waiting: 2 },
    features: ['Otonom Pilot', 'Kablosuz Şarj', 'Premium Ses'],
    location: 'Cumhuriyet Mah. Gül Cad.',
  },
  {
    id: 'TOGG-002',
    model: 'TOGG T10X',
    plate: '16 TG 2002',
    battery: 62,
    range: 245,
    lat: 40.4355,    // Hamidiye Mahallesi, Atatürk Bulvarı civarı
    lng: 29.1618,
    color: 'Gökyüzü Beyazı',
    year: 2025,
    seats: 5,
    pricing: { driving: 10, waiting: 2 },
    features: ['Hızlı Şarj', 'Panoramik Cam Tavan'],
    location: 'Hamidiye Mah. Atatürk Bulvarı',
  },
  {
    id: 'TOGG-003',
    model: 'TOGG T10F',
    plate: '16 TG 3003',
    battery: 95,
    range: 410,
    lat: 40.4312,    // Sahil Yolu, Gemlik Sahili
    lng: 29.1555,
    color: 'Karbon Gri',
    year: 2026,
    seats: 5,
    pricing: { driving: 12, waiting: 2.5 },
    features: ['Otonom Pilot+', 'AR Gösterge', 'Premium Ses'],
    location: 'Sahil Yolu, Gemlik Sahili',
  },
  {
    id: 'TOGG-004',
    model: 'TOGG T10X',
    plate: '16 TG 4004',
    battery: 34,
    range: 130,
    lat: 40.4281,    // Hamidiye Mah, Lumicle şarj istasyonu yanı
    lng: 29.1697,
    color: 'Lav Kırmızı',
    year: 2025,
    seats: 5,
    pricing: { driving: 10, waiting: 2 },
    features: ['Kablosuz Şarj'],
    location: 'Hamidiye Mah. No:136',
  },
  {
    id: 'TOGG-005',
    model: 'TOGG T10F',
    plate: '16 TG 5005',
    battery: 78,
    range: 310,
    lat: 40.4316,    // Eşref Dinçer Mah, Kanalboyu
    lng: 29.1607,
    color: 'Gece Siyahı',
    year: 2026,
    seats: 5,
    pricing: { driving: 12, waiting: 2.5 },
    features: ['Otonom Pilot+', 'Hızlı Şarj', 'Matrix LED'],
    location: 'Eşref Dinçer Mah. Kanalboyu',
  },
  {
    id: 'TOGG-006',
    model: 'TOGG T10X',
    plate: '16 TG 6006',
    battery: 55,
    range: 215,
    lat: 40.4372,    // Hisar Mah, Yalova Yolu Cad.
    lng: 29.1540,
    color: 'Okyanus Yeşili',
    year: 2025,
    seats: 5,
    pricing: { driving: 10, waiting: 2 },
    features: ['Panoramik Cam Tavan', 'Premium Ses'],
    location: 'Hisar Mah. Yalova Yolu Cad.',
  },
];

// ==========================================
//  GERÇEK ŞARJ İSTASYONLARI - Gemlik
//  Veriler: PlugShare, Voltmeta, onLIFE
// ==========================================
export const chargingStations = [
  {
    id: 'cs-1',
    name: 'Zes - Cumhuriyet Mah. Şarj',
    address: 'Cumhuriyet Mah., Gül Cad., 198CA, Gemlik',
    lat: 40.4340,
    lng: 29.1580,
    power: '22 kW AC',
    available: 2,
    total: 2,
    type: 'normal',
    operator: 'Zes',
  },
  {
    id: 'cs-2',
    name: 'Lumicle - Hamidiye Şarj',
    address: 'Hamidiye Mahallesi No:136, Gemlik',
    lat: 40.4281,
    lng: 29.1697,
    power: '150 kW DC',
    available: 1,
    total: 2,
    type: 'fast',
    operator: 'Lumicle',
  },
  {
    id: 'cs-3',
    name: 'onLIFE - Kanalboyu Şarj',
    address: 'Eşref Dinçer Mah. Irmak Sok. No:61/A, Gemlik',
    lat: 40.4316,
    lng: 29.1607,
    power: '22 kW AC',
    available: 2,
    total: 2,
    type: 'normal',
    operator: 'onLIFE',
  },
  {
    id: 'cs-4',
    name: 'ŞarjStart - Hisar Mah.',
    address: 'Hisar Mah., Yalova Yolu Cad. 30/1, Gemlik',
    lat: 40.4368,
    lng: 29.1530,
    power: '60 kW DC',
    available: 3,
    total: 5,
    type: 'fast',
    operator: 'ŞarjStart',
  },
  {
    id: 'cs-5',
    name: 'Oksijen O68 Supercharger',
    address: 'Engürücük Mah. İstanbul Otoyolu, Gemlik',
    lat: 40.3892,
    lng: 29.1398,
    power: '360 kW DC',
    available: 6,
    total: 8,
    type: 'supercharger',
    operator: 'Tesla / Zes',
  },
];

// Park Alanları - Gemlik gerçek bölgeleri
export const parkingZones = [
  {
    id: 'zone-1',
    name: 'Sahil Park Alanı',
    type: 'allowed',
    color: 'rgba(46, 213, 115, 0.2)',
    borderColor: '#2ed573',
    coords: [
      [40.4302, 29.1535],
      [40.4302, 29.1575],
      [40.4322, 29.1575],
      [40.4322, 29.1535],
    ],
  },
  {
    id: 'zone-2',
    name: 'Belediye Otopark',
    type: 'allowed',
    color: 'rgba(46, 213, 115, 0.2)',
    borderColor: '#2ed573',
    coords: [
      [40.4348, 29.1600],
      [40.4348, 29.1635],
      [40.4365, 29.1635],
      [40.4365, 29.1600],
    ],
  },
  {
    id: 'zone-3',
    name: 'Cumhuriyet Mah. Şarj & Park',
    type: 'allowed',
    color: 'rgba(0, 212, 170, 0.2)',
    borderColor: '#00d4aa',
    coords: [
      [40.4332, 29.1565],
      [40.4332, 29.1595],
      [40.4348, 29.1595],
      [40.4348, 29.1565],
    ],
  },
  {
    id: 'zone-4',
    name: 'Yasak Bölge - Liman Giriş',
    type: 'restricted',
    color: 'rgba(255, 71, 87, 0.15)',
    borderColor: '#ff4757',
    coords: [
      [40.4270, 29.1480],
      [40.4270, 29.1515],
      [40.4290, 29.1515],
      [40.4290, 29.1480],
    ],
  },
  {
    id: 'zone-5',
    name: 'Yasak Bölge - Sanayi Bölgesi',
    type: 'restricted',
    color: 'rgba(255, 71, 87, 0.15)',
    borderColor: '#ff4757',
    coords: [
      [40.4400, 29.1680],
      [40.4400, 29.1720],
      [40.4420, 29.1720],
      [40.4420, 29.1680],
    ],
  },
];

// Kullanıcı konumu - Gemlik Merkez (Cumhuriyet Meydanı civarı)
export const userLocation = {
  lat: 40.4340,
  lng: 29.1575,
};

// Pricing config
export const pricingConfig = {
  reservationFreeMinutes: 15,
  drivingPerMinute: 10,
  waitingPerMinute: 2,
  minimumCharge: 25,
  currency: '₺',
};

// Helper
export function getVehicleImage(model) {
  return vehicleImages[model] || vehicleImages['TOGG T10X'];
}

export function getVehicleMarker(model) {
  return vehicleMarkerImages[model] || vehicleMarkerImages['TOGG T10X'];
}
