// Type definitions for authentication forms based on schema

export type Gender = 'female' | 'male' | 'transsexual';

export type Ethnicity =
  | 'georgian'
  | 'russian'
  | 'black'
  | 'turk'
  | 'armenian'
  | 'azerbaijan'
  | 'kazakh'
  | 'greek'
  | 'ukraine'
  | 'other';

export type HairColor =
  | 'black'
  | 'blonde'
  | 'brown'
  | 'brunette'
  | 'chestnut'
  | 'auburn'
  | 'dark_blonde'
  | 'golden'
  | 'red'
  | 'grey'
  | 'silver'
  | 'other';

export type BustSize =
  | 'very_small'
  | 'small_a'
  | 'medium_b'
  | 'large_c'
  | 'very_large_d'
  | 'enormous_e_plus';

export type Build =
  | 'skinny'
  | 'slim'
  | 'regular'
  | 'sport'
  | 'fat';

export interface RegisterFormData {
  // Auth fields
  email: string;
  password: string;
  confirmPassword: string;

  // Basic Info
  name: string;
  phone: string;
  whatsappAvailable?: boolean;
  viberAvailable?: boolean;

  // Social Media
  website?: string;
  instagram?: string;
  snapchat?: string;
  twitter?: string;
  facebook?: string;

  // Location
  city: string;
  district?: string;

  // Personal Info (required)
  gender: Gender;
  dateOfBirth: string;
  ethnicity: Ethnicity;
  height: string;
  weight: string;
  aboutYou: string;

  // Optional Personal Info
  hairColor?: HairColor;
  bustSize?: BustSize;
  build?: Build;

  // Availability
  incallAvailable?: boolean;
  outcallAvailable?: boolean;

  // Rates
  currency?: string;
  incallRates?: {
    thirtyMin?: string;
    oneHour?: string;
    twoHours?: string;
    threeHours?: string;
    sixHours?: string;
    twelveHours?: string;
    twentyFourHours?: string;
  };
  outcallRates?: {
    thirtyMin?: string;
    oneHour?: string;
    twoHours?: string;
    threeHours?: string;
    sixHours?: string;
    twelveHours?: string;
    twentyFourHours?: string;
  };

  // Languages
  languages?: Array<{
    name: string;
    level: string;
  }>;

  // Services
  services?: string[];
}
