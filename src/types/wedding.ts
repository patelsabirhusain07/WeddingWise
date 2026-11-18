export type WeddingTier = 'budget' | 'moderate' | 'luxury' | 'royal';

export interface WeddingParameters {
  coupleName: string;
  weddingDate: string;
  totalBudget: number;
  guestCount: number;
  totalDays: number;
  city: string;
  currency: string;
  foodPreference: 'pure_veg' | 'non_veg' | 'multi_cuisine' | 'gourmet_organic';
  decorStyle: 'minimalist' | 'traditional' | 'floral_extravaganza' | 'royal_regal' | 'boho_chic';
  venueType: 'banquet_hall' | 'resort_destination' | 'heritage_palace' | 'beachfront' | 'community_hall';
  photographyStyle: 'standard' | 'candid_cinematic' | 'drone_multi_team' | 'celebrity_studio';
  clothingStyle: 'ready_to_wear' | 'designer_couture' | 'custom_tailored' | 'heritage_silks';
  invitationType: 'digital_only' | 'standard_print' | 'luxury_boxed' | 'handmade_eco';
  transportTier: 'self_standard' | 'shuttle_coaches' | 'vintage_luxury_cars';
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  eventId: string; // 'all' or specific event ID
  estimatedCost: number;
  actualCost: number;
  advancePaid: number;
  dueDate?: string;
  vendorName?: string;
  notes?: string;
  status: 'planned' | 'partially_paid' | 'paid_in_full';
}

export type ExpenseCategory =
  | 'venue'
  | 'food_catering'
  | 'decoration'
  | 'photography_video'
  | 'clothing_jewelry'
  | 'invitations_stationery'
  | 'transport_logistics'
  | 'entertainment_music'
  | 'makeup_beauty'
  | 'gifts_favors'
  | 'miscellaneous';

export interface WeddingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  dayNumber: number;
  venue: string;
  guestCount: number;
  theme: string;
  dressCode?: string;
  estimatedBudget: number;
  notes?: string;
}

export interface VendorQuote {
  id: string;
  vendorId: string;
  vendorName: string;
  category: ExpenseCategory;
  quotedAmount: number;
  packageDetails: string;
  contactNumber: string;
  email?: string;
  rating: number; // 1-5
  status: 'in_discussion' | 'selected' | 'rejected' | 'backup';
  notes?: string;
}

export interface Guest {
  id: string;
  name: string;
  side: 'bride' | 'groom' | 'mutual';
  relation: string;
  email?: string;
  phone?: string;
  rsvpStatus: 'attending' | 'not_attending' | 'tentative' | 'invited';
  eventsInvited: string[]; // event IDs
  plusOnes: number;
  dietaryNotes?: string;
  tableOrRoom?: string;
  giftReceived?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  timeline: string; // e.g. '6-12 Months Before', '2-3 Months Before', '1 Week Before', 'Wedding Day'
  isCompleted: boolean;
  assignedTo?: string;
  dueDate?: string;
}

export interface AISuggestion {
  id: string;
  type: 'saving_tip' | 'risk_warning' | 'optimization' | 'recommendation';
  title: string;
  description: string;
  potentialSavings?: number;
  category?: ExpenseCategory;
  actionableStep?: string;
}
