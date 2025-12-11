// User cache management for localStorage
const USER_CACHE_KEY = 'user_info';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

interface CachedUser {
  data: {
    id: string;
    email: string;
    name: string | null;
    role: 'escort' | 'admin';
    status: 'public' | 'private';
    phone: string;
    whatsappAvailable?: boolean;
    viberAvailable?: boolean;
    website?: string | null;
    instagram?: string | null;
    snapchat?: string | null;
    twitter?: string | null;
    facebook?: string | null;
    city: string;
    district?: string | null;
    gender: string;
    dateOfBirth: string;
    ethnicity: string;
    hairColor?: string | null;
    bustSize?: string | null;
    height: number;
    weight: string;
    build?: string | null;
    incallAvailable?: boolean;
    outcallAvailable?: boolean;
    aboutYou: string;
    languages?: Array<{ name: string; level: string }>;
    currency?: string;
    rates?: {
      incall?: Record<string, string>;
      outcall?: Record<string, string>;
    };
    services?: string[];

    isGold?: boolean;
    isFeatured?: boolean;
    isSilver?: boolean;
    verifiedPhotos: boolean;
    createdAt: string;
    updatedAt: string;
  };
  timestamp: number;
}

export function getCachedUser() {
  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (!cached) return null;

    const parsed: CachedUser = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is expired
    if (now - parsed.timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(USER_CACHE_KEY);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error('Error reading user cache:', error);
    return null;
  }
}

export function setCachedUser(user: CachedUser['data']) {
  try {
    const cached: CachedUser = {
      data: user,
      timestamp: Date.now(),
    };
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.error('Error setting user cache:', error);
  }
}

export function clearCachedUser() {
  try {
    localStorage.removeItem(USER_CACHE_KEY);
  } catch (error) {
    console.error('Error clearing user cache:', error);
  }
}
