// Mock data for ADRRS prototype — realistic ASEAN geography

export type ZoneLevel = 'safe' | 'caution' | 'warning' | 'danger';
export type DisasterType = 'flood' | 'landslide';
export type AlertLevel = 1 | 2 | 3;

export interface DisasterZone {
  id: string;
  center: [number, number]; // [lat, lng]
  radius: number; // meters
  level: ZoneLevel;
  disasterType: DisasterType;
  name: string;
  country: string;
  description: string;
}

export interface PopulationCluster {
  id: string;
  position: [number, number];
  count: number;
  zoneId: string;
  disasterType: DisasterType;
  severity: ZoneLevel;
  areaName: string;
  country: string;
  snapshotUrl: string;
  sarContact: { name: string; phone: string; team: string };
}

export interface Alert {
  id: string;
  level: AlertLevel;
  title: string;
  disasterType: DisasterType;
  area: string;
  country: string;
  time: string;
  action: string;
  read: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  category: 'sar' | 'ambulance' | 'police' | 'fire' | 'hospital';
  phone: string;
  distance: string;
  status: 'active' | 'busy';
  country: string;
}

export interface DisasterReport {
  id: string;
  country: string;
  disasterType: DisasterType;
  severity: ZoneLevel;
  date: string;
  affectedPopulation: number;
  title: string;
  summary: string;
  timeline: { time: string; event: string }[];
}

// Jakarta area floods
export const disasterZones: DisasterZone[] = [
  {
    id: 'z1', center: [-6.200, 106.845], radius: 2500,
    level: 'danger', disasterType: 'flood', name: 'North Jakarta Flood Zone',
    country: 'Indonesia', description: 'Severe flooding from Ciliwung River overflow',
  },
  {
    id: 'z2', center: [-6.180, 106.830], radius: 1800,
    level: 'warning', disasterType: 'flood', name: 'Kelapa Gading Alert Area',
    country: 'Indonesia', description: 'Rising water levels detected by drone surveillance',
  },
  {
    id: 'z3', center: [-6.220, 106.860], radius: 2000,
    level: 'caution', disasterType: 'flood', name: 'East Jakarta Monitoring',
    country: 'Indonesia', description: 'Potential flood path from upstream',
  },
  {
    id: 'z4', center: [-6.260, 106.810], radius: 3000,
    level: 'safe', disasterType: 'flood', name: 'South Jakarta Safe Zone',
    country: 'Indonesia', description: 'Designated evacuation area with shelters',
  },
  // Philippines landslide
  {
    id: 'z5', center: [14.420, 121.040], radius: 1500,
    level: 'danger', disasterType: 'landslide', name: 'Rizal Province Landslide',
    country: 'Philippines', description: 'Active landslide zone after heavy rain',
  },
  {
    id: 'z6', center: [14.440, 121.060], radius: 2000,
    level: 'warning', disasterType: 'landslide', name: 'Antipolo Highland Warning',
    country: 'Philippines', description: 'Soil instability detected via drone imaging',
  },
  // Thailand floods
  {
    id: 'z7', center: [13.760, 100.520], radius: 2200,
    level: 'warning', disasterType: 'flood', name: 'Chao Phraya Overflow Risk',
    country: 'Thailand', description: 'River level approaching critical threshold',
  },
  {
    id: 'z8', center: [13.740, 100.500], radius: 2800,
    level: 'safe', disasterType: 'flood', name: 'Bangkok Central Safe Zone',
    country: 'Thailand', description: 'Protected area with flood barriers',
  },
];

export const populationClusters: PopulationCluster[] = [
  {
    id: 'p1', position: [-6.195, 106.850], count: 342, zoneId: 'z1',
    disasterType: 'flood', severity: 'danger', areaName: 'Kampung Melayu',
    country: 'Indonesia', snapshotUrl: '/placeholder.svg',
    sarContact: { name: 'BASARNAS Team Alpha', phone: '+62-21-6541-308', team: 'SAR Team A' },
  },
  {
    id: 'p2', position: [-6.205, 106.840], count: 187, zoneId: 'z1',
    disasterType: 'flood', severity: 'danger', areaName: 'Bidara Cina',
    country: 'Indonesia', snapshotUrl: '/placeholder.svg',
    sarContact: { name: 'BASARNAS Team Bravo', phone: '+62-21-6541-309', team: 'SAR Team B' },
  },
  {
    id: 'p3', position: [-6.175, 106.825], count: 95, zoneId: 'z2',
    disasterType: 'flood', severity: 'warning', areaName: 'Kelapa Gading Timur',
    country: 'Indonesia', snapshotUrl: '/placeholder.svg',
    sarContact: { name: 'Jakarta Rescue Unit', phone: '+62-21-6542-100', team: 'Rescue Unit 3' },
  },
  {
    id: 'p4', position: [14.425, 121.045], count: 78, zoneId: 'z5',
    disasterType: 'landslide', severity: 'danger', areaName: 'Barangay San Jose',
    country: 'Philippines', snapshotUrl: '/placeholder.svg',
    sarContact: { name: 'NDRRMC Rescue', phone: '+63-2-8911-1406', team: 'NDRRMC Unit 1' },
  },
  {
    id: 'p5', position: [13.755, 100.525], count: 210, zoneId: 'z7',
    disasterType: 'flood', severity: 'warning', areaName: 'Bang Kho Laem',
    country: 'Thailand', snapshotUrl: '/placeholder.svg',
    sarContact: { name: 'Thai DDPM Team', phone: '+66-2-637-3000', team: 'DDPM Unit 5' },
  },
];

export const alerts: Alert[] = [
  {
    id: 'a1', level: 3, title: 'EVACUATE NOW — North Jakarta', disasterType: 'flood',
    area: 'Kampung Melayu, North Jakarta', country: 'Indonesia',
    time: '2 min ago', action: 'Move to South Jakarta Safe Zone immediately. Follow marked evacuation routes.',
    read: false,
  },
  {
    id: 'a2', level: 2, title: 'Flood Warning — Kelapa Gading', disasterType: 'flood',
    area: 'Kelapa Gading, North Jakarta', country: 'Indonesia',
    time: '15 min ago', action: 'Prepare emergency kit. Be ready to evacuate within 30 minutes.',
    read: false,
  },
  {
    id: 'a3', level: 3, title: 'Landslide Alert — Rizal Province', disasterType: 'landslide',
    area: 'Barangay San Jose, Rizal', country: 'Philippines',
    time: '8 min ago', action: 'Evacuate uphill immediately. Avoid valleys and river paths.',
    read: true,
  },
  {
    id: 'a4', level: 1, title: 'Monitor — Chao Phraya River', disasterType: 'flood',
    area: 'Bang Kho Laem, Bangkok', country: 'Thailand',
    time: '1 hr ago', action: 'Stay informed. Monitor water levels and official announcements.',
    read: true,
  },
  {
    id: 'a5', level: 2, title: 'Prepare — Antipolo Highlands', disasterType: 'landslide',
    area: 'Antipolo, Rizal', country: 'Philippines',
    time: '25 min ago', action: 'Avoid steep slopes. Prepare to relocate to lower ground shelters.',
    read: true,
  },
];

export const emergencyContacts: EmergencyContact[] = [
  { id: 'c1', name: 'BASARNAS SAR HQ', category: 'sar', phone: '+62-21-6541-308', distance: '2.1 km', status: 'active', country: 'Indonesia' },
  { id: 'c2', name: 'RS Fatmawati Hospital', category: 'hospital', phone: '+62-21-7501-524', distance: '4.5 km', status: 'active', country: 'Indonesia' },
  { id: 'c3', name: 'Jakarta Police District', category: 'police', phone: '110', distance: '1.8 km', status: 'active', country: 'Indonesia' },
  { id: 'c4', name: 'Ambulance Emergency', category: 'ambulance', phone: '118', distance: '3.2 km', status: 'busy', country: 'Indonesia' },
  { id: 'c5', name: 'Fire Department', category: 'fire', phone: '113', distance: '2.7 km', status: 'active', country: 'Indonesia' },
  { id: 'c6', name: 'NDRRMC Philippines', category: 'sar', phone: '+63-2-8911-1406', distance: '—', status: 'active', country: 'Philippines' },
  { id: 'c7', name: 'Thai DDPM', category: 'sar', phone: '+66-2-637-3000', distance: '—', status: 'active', country: 'Thailand' },
];

export const disasterReports: DisasterReport[] = [
  {
    id: 'r1', country: 'Indonesia', disasterType: 'flood', severity: 'danger',
    date: '2026-02-23', affectedPopulation: 12500,
    title: 'Jakarta Metropolitan Flooding',
    summary: 'Ciliwung River overflow caused severe flooding across North Jakarta affecting 12,500+ residents.',
    timeline: [
      { time: '06:00', event: 'Heavy rainfall begins across Greater Jakarta' },
      { time: '09:30', event: 'Ciliwung River reaches critical level' },
      { time: '10:15', event: 'Flooding reported in Kampung Melayu' },
      { time: '11:00', event: 'Evacuation order issued for North Jakarta' },
      { time: '12:30', event: 'Drone surveillance deployed for population mapping' },
    ],
  },
  {
    id: 'r2', country: 'Philippines', disasterType: 'landslide', severity: 'danger',
    date: '2026-02-22', affectedPopulation: 3200,
    title: 'Rizal Province Landslide',
    summary: 'Continuous rainfall triggered landslide in Rizal Province highlands.',
    timeline: [
      { time: '14:00', event: 'Soil cracks detected by drone patrol' },
      { time: '16:00', event: 'Warning level raised to Siaga 2' },
      { time: '18:30', event: 'Landslide occurred in Barangay San Jose' },
      { time: '19:00', event: 'Emergency response teams deployed' },
    ],
  },
  {
    id: 'r3', country: 'Thailand', disasterType: 'flood', severity: 'warning',
    date: '2026-02-23', affectedPopulation: 5800,
    title: 'Chao Phraya River Rising',
    summary: 'River levels approaching critical threshold in Bangkok metropolitan area.',
    timeline: [
      { time: '08:00', event: 'Water level monitoring shows steady rise' },
      { time: '12:00', event: 'Siaga 1 issued for riverside communities' },
      { time: '15:00', event: 'Preventive sandbagging initiated' },
    ],
  },
];

export const educationGuides = [
  {
    id: 'e1', title: 'What to Do During a Flood',
    icon: '🌊', items: [
      'Move to higher ground immediately',
      'Avoid walking through flowing water',
      'Do not drive through flooded roads',
      'Disconnect electrical equipment if safe',
      'Follow official evacuation routes',
      'Keep emergency kit ready at all times',
    ],
  },
  {
    id: 'e2', title: 'Landslide Warning Signs',
    icon: '⛰️', items: [
      'New cracks in ground or pavement',
      'Tilting trees or utility poles',
      'Sudden increase or decrease in water flow',
      'Rumbling sounds from the hillside',
      'Doors or windows sticking for first time',
      'Bulging ground at base of slope',
    ],
  },
  {
    id: 'e3', title: 'Emergency Preparedness Checklist',
    icon: '✅', items: [
      'Store 3-day supply of water (1 gallon/person/day)',
      'Pack essential medications',
      'Keep important documents in waterproof bag',
      'Charge phone and portable battery',
      'Know your evacuation route',
      'Establish family meeting point',
    ],
  },
];

export const aseanCountries = [
  'Indonesia', 'Philippines', 'Thailand', 'Malaysia', 'Vietnam',
  'Myanmar', 'Cambodia', 'Laos', 'Singapore', 'Brunei',
];

export const countryDefaultCenters: Record<string, [number, number]> = {
  'Indonesia': [-6.200, 106.845],
  'Philippines': [14.420, 121.040],
  'Thailand': [13.760, 100.520],
  'Malaysia': [3.139, 101.687],
  'Vietnam': [21.028, 105.854],
  'Myanmar': [16.866, 96.196],
  'Cambodia': [11.562, 104.888],
  'Laos': [17.975, 102.633],
  'Singapore': [1.352, 103.820],
  'Brunei': [4.930, 114.950],
};
