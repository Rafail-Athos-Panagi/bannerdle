import { Settlement } from '../types/Settlement.type';

// Settlement data for Calradia map
// Coordinates are normalized to a 1000x1000 grid system
// These are approximate positions based on the Bannerlord map layout
export const settlements: Settlement[] = [
  // Vlandia
  {
    id: 'ocs-hall',
    name: 'Ocs Hall',
    type: 'town',
    faction: 'Vlandia',
    center: [200, 50],
    radius: 5
  },
  {
    id: 'sargot',
    name: 'Sargot',
    type: 'town',
    faction: 'Vlandia',
    center: [150, 200],
    radius: 25
  },
  {
    id: 'charas',
    name: 'Charas',
    type: 'town',
    faction: 'Vlandia',
    center: [250, 250],
    radius: 25
  },
  {
    id: 'prawica',
    name: 'Prawica',
    type: 'town',
    faction: 'Vlandia',
    center: [300, 180],
    radius: 25
  },

  // Sturgia
  {
    id: 'varcheg',
    name: 'Varcheg',
    type: 'town',
    faction: 'Sturgia',
    center: [400, 100],
    radius: 25
  },
  {
    id: 'omur',
    name: 'Omur',
    type: 'town',
    faction: 'Sturgia',
    center: [450, 150],
    radius: 25
  },
  {
    id: 'talsh',
    name: 'Talsh',
    type: 'town',
    faction: 'Sturgia',
    center: [500, 200],
    radius: 25
  },

  // Empire
  {
    id: 'lageta',
    name: 'Lageta',
    type: 'town',
    faction: 'Empire',
    center: [350, 350],
    radius: 25
  },
  {
    id: 'poros',
    name: 'Poros',
    type: 'town',
    faction: 'Empire',
    center: [400, 400],
    radius: 25
  },
  {
    id: 'amitatys',
    name: 'Amitatys',
    type: 'town',
    faction: 'Empire',
    center: [450, 450],
    radius: 25
  },
  {
    id: 'danustica',
    name: 'Danustica',
    type: 'town',
    faction: 'Empire',
    center: [500, 500],
    radius: 25
  },

  // Battania
  {
    id: 'marunath',
    name: 'Marunath',
    type: 'town',
    faction: 'Battania',
    center: [200, 400],
    radius: 25
  },
  {
    id: 'seonon',
    name: 'Seonon',
    type: 'town',
    faction: 'Battania',
    center: [150, 450],
    radius: 25
  },
  {
    id: 'pen-cannoc',
    name: 'Pen Cannoc',
    type: 'town',
    faction: 'Battania',
    center: [250, 500],
    radius: 25
  },

  // Khuzait
  {
    id: 'ortongard',
    name: 'Ortongard',
    type: 'town',
    faction: 'Khuzait',
    center: [700, 300],
    radius: 25
  },
  {
    id: 'akkalat',
    name: 'Akkalat',
    type: 'town',
    faction: 'Khuzait',
    center: [750, 350],
    radius: 25
  },
  {
    id: 'makand',
    name: 'Makand',
    type: 'town',
    faction: 'Khuzait',
    center: [800, 400],
    radius: 25
  },

  // Aserai
  {
    id: 'hubyar',
    name: 'Hubyar',
    type: 'town',
    faction: 'Aserai',
    center: [600, 600],
    radius: 25
  },
  {
    id: 'quyaz',
    name: 'Quyaz',
    type: 'town',
    faction: 'Aserai',
    center: [650, 650],
    radius: 25
  },
  {
    id: 'sanala',
    name: 'Sanala',
    type: 'town',
    faction: 'Aserai',
    center: [700, 700],
    radius: 25
  },
  {
    id: 'askar',
    name: 'Askar',
    type: 'town',
    faction: 'Aserai',
    center: [750, 750],
    radius: 25
  }
];

// Helper function to get a random settlement for the daily challenge
export const getRandomSettlement = (): Settlement => {
  const randomIndex = Math.floor(Math.random() * settlements.length);
  return settlements[randomIndex];
};

// Helper function to calculate distance between two points
export const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  return Math.sqrt(dx * dx + dy * dy);
};

// Helper function to calculate direction from one point to another
export const calculateDirection = (from: [number, number], to: [number, number]): 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const angle = Math.atan2(dy, dx);
  const degrees = (angle * 180) / Math.PI;
  
  // Convert to 0-360 range
  const normalizedDegrees = (degrees + 360) % 360;
  
  if (normalizedDegrees >= 337.5 || normalizedDegrees < 22.5) return 'E';
  if (normalizedDegrees >= 22.5 && normalizedDegrees < 67.5) return 'NE';
  if (normalizedDegrees >= 67.5 && normalizedDegrees < 112.5) return 'N';
  if (normalizedDegrees >= 112.5 && normalizedDegrees < 157.5) return 'NW';
  if (normalizedDegrees >= 157.5 && normalizedDegrees < 202.5) return 'W';
  if (normalizedDegrees >= 202.5 && normalizedDegrees < 247.5) return 'SW';
  if (normalizedDegrees >= 247.5 && normalizedDegrees < 292.5) return 'S';
  if (normalizedDegrees >= 292.5 && normalizedDegrees < 337.5) return 'SE';
  
  return 'E'; // fallback
};
