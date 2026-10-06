export interface UserProfile {
  id: string;
  username: string; // Rules: Starts with uppercase, >=1 number, >=1 special char, <= 20 chars
  firstName: string;
  lastName: string;
  avatar: string; // URL or Data URL
  birthDate: string; // YYYY-MM-DD
  age: number;
  zodiacSign: string;
  zodiacElement: 'Fuego' | 'Tierra' | 'Aire' | 'Agua';
  description: string; // Max 500 characters
  backgroundColor: string; // Hex from options
  textColor: string; // Hex from options
  secretKey: string; // Max 20 characters
  biometricEnabled: boolean;
  autoLockOnBlur: boolean;
  createdAt: number;
}

export interface MediaFile {
  url: string;
  type: 'image' | 'video';
  name: string;
}

export interface MediaPost {
  id: string;
  type: 'variety' | 'photo' | 'video';
  files: MediaFile[];
  title?: string;
  caption?: string;
  createdAt: number;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  contrastWhite: boolean;
}

export const COLOR_PALETTE: ColorOption[] = [
  { id: 'rojo_oscuro', name: 'Rojo oscuro', hex: '#5A1827', contrastWhite: true },
  { id: 'rojo_claro', name: 'Rojo claro', hex: '#EF5350', contrastWhite: true },
  { id: 'naranja_oscuro', name: 'Naranja oscuro', hex: '#D35400', contrastWhite: true },
  { id: 'naranja_claro', name: 'Naranja claro', hex: '#FFB74D', contrastWhite: false },
  { id: 'amarillo_oscuro', name: 'Amarillo oscuro', hex: '#C59B27', contrastWhite: true },
  { id: 'amarillo_claro', name: 'Amarillo claro', hex: '#FFF176', contrastWhite: false },
  { id: 'verde_oscuro', name: 'Verde oscuro', hex: '#1B5E20', contrastWhite: true },
  { id: 'verde_claro', name: 'Verde claro', hex: '#B4E197', contrastWhite: false },
  { id: 'azul_oscuro', name: 'Azul oscuro', hex: '#1A365D', contrastWhite: true },
  { id: 'azul_claro', name: 'Azul claro', hex: '#81D4FA', contrastWhite: false },
  { id: 'morado_oscuro', name: 'Morado oscuro', hex: '#3B185F', contrastWhite: true },
  { id: 'morado_claro', name: 'Morado claro', hex: '#CE93D8', contrastWhite: false },
  { id: 'rosado_oscuro', name: 'Rosado oscuro', hex: '#AD1457', contrastWhite: true },
  { id: 'rosado_claro', name: 'Rosado claro', hex: '#F8BBD0', contrastWhite: false },
  { id: 'gris_oscuro', name: 'Gris oscuro', hex: '#374151', contrastWhite: true },
  { id: 'blanco', name: 'Blanco', hex: '#FFFFFF', contrastWhite: false },
  { id: 'negro_oscuro', name: 'Negro oscuro', hex: '#0F0F11', contrastWhite: true },
  { id: 'negro_claro', name: 'Negro claro', hex: '#262626', contrastWhite: true },
];

export type ProrrogaDuration = 5 | 10 | 20 | 30 | 1440 | -1; // in minutes (-1 = Sin límites)

export interface ScanSession {
  id: string;
  ownerUsername: string;
  visitorName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'revoked';
  durationMinutes: ProrrogaDuration;
  expiresAt: number | null; // timestamp
  createdAt: number;
}
