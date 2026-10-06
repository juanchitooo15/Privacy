import { UserProfile, MediaPost, ScanSession } from '../types/privacy';

export const AVATAR_PRESETS = [
  { id: 'art_1', url: '/src/assets/images/privacy_avatar_minimal_one_1791255356882.jpg', label: 'Silueta Clásica' },
  { id: 'art_2', url: '/src/assets/images/privacy_avatar_minimal_two_1791255365969.jpg', label: 'Sombras Botánicas' },
  { id: 'art_3', url: '/src/assets/images/privacy_avatar_minimal_three_1791255381348.jpg', label: 'Estudio Editorial' },
];

const INITIAL_USER: UserProfile = {
  id: 'usr_sample_01',
  username: 'Valeria_7@secret',
  firstName: 'Valeria',
  lastName: 'Montenegro',
  avatar: AVATAR_PRESETS[0].url,
  birthDate: '1998-04-12',
  age: 28,
  zodiacSign: 'Aries',
  zodiacElement: 'Fuego',
  description: 'Arquitecta de espacios intangibles. Amante del silencio visual, la tipografía editorial y los momentos que no necesitan ser fotografiados por multitudes.',
  backgroundColor: '#5A1827', // Rojo vino tinto oscuro oficial
  textColor: '#B4E197', // Verde pastel oficial
  secretKey: 'Secret*2026',
  biometricEnabled: false,
  autoLockOnBlur: true,
  createdAt: Date.now() - 86400000 * 5,
};

const INITIAL_POSTS: MediaPost[] = [
  {
    id: 'post_01',
    type: 'variety',
    title: 'Fragmentos de calma',
    caption: 'La verdadera privacidad no es esconderse, es elegir con quién compartirse.',
    createdAt: Date.now() - 86400000 * 2,
    files: [
      {
        url: AVATAR_PRESETS[1].url,
        type: 'image',
        name: 'calma_luz.jpg',
      },
      {
        url: AVATAR_PRESETS[2].url,
        type: 'image',
        name: 'editorial_silencio.jpg',
      },
    ],
  },
  {
    id: 'post_02',
    type: 'photo',
    title: 'Texturas del atardecer',
    caption: 'Luz natural filtrándose en el estudio a las 18:40.',
    createdAt: Date.now() - 86400000 * 1,
    files: [
      {
        url: AVATAR_PRESETS[0].url,
        type: 'image',
        name: 'textura_atardecer.jpg',
      },
    ],
  },
];

const USER_KEY = 'privacy_user_data_v1';
const POSTS_KEY = 'privacy_posts_data_v1';
const SCAN_SESSION_KEY = 'privacy_active_scan_session_v1';

export function loadUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      // Return default sample user for immediate rich testing
      saveUser(INITIAL_USER);
      return INITIAL_USER;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUser(user: UserProfile): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function deleteAccount(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(POSTS_KEY);
  localStorage.removeItem(SCAN_SESSION_KEY);
}

export function loadPosts(): MediaPost[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) {
      savePosts(INITIAL_POSTS);
      return INITIAL_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_POSTS;
  }
}

export function savePosts(posts: MediaPost[]): void {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function getScanSession(): ScanSession | null {
  try {
    const raw = localStorage.getItem(SCAN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveScanSession(session: ScanSession | null): void {
  if (!session) {
    localStorage.removeItem(SCAN_SESSION_KEY);
  } else {
    localStorage.setItem(SCAN_SESSION_KEY, JSON.stringify(session));
  }
}
