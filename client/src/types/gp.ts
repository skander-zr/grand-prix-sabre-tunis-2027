export type Language = 'fr' | 'en';

export interface RoomTypeDetail {
  id: 'single' | 'double';
  name: { fr: string; en: string };
  capacity: number; // 1 for single, 2 for double
  pricePerNight: number; // in EUR
  description: { fr: string; en: string };
  features: string[];
  totalInventory: number;
  blockedInventory: number;
}

export interface Hotel {
  id: 'el-mouradi-gammarth' | 'golden-carthage';
  name: string;
  category: string;
  stars: number;
  tagline: { fr: string; en: string };
  location: string;
  competitionDistance: {
    venue: string;
    distanceKm: number;
    travelTimeMin: number;
    shuttleFrequencyMin: number;
  };
  googleMapsEmbedUrl: string;
  coordinates: { lat: number; lng: number };
  description: { fr: string; en: string };
  photos: {
    url: string;
    caption: { fr: string; en: string };
  }[];
  amenities: {
    icon: string;
    label: { fr: string; en: string };
  }[];
  roomTypes: {
    single: RoomTypeDetail;
    double: RoomTypeDetail;
  };
}

export type ReservationType = 'individual' | 'group';

export type RoleType = 'athlete' | 'coach' | 'referee' | 'medical' | 'delegate' | 'guest';

export interface GroupMember {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  role: RoleType;
  passportNumber: string;
  roomPreference: 'single' | 'double';
  roommateName?: string; // If double room
}

export interface ShuttleDetails {
  bookingId?: string;
  tripType: 'arrival' | 'departure' | 'roundtrip';
  airport: 'TUN' | 'NBE' | 'MIR';
  isVipVan?: boolean;
  surchargeEur?: number;
  arrivalFlightNumber?: string;
  arrivalAirline?: string;
  arrivalDateTime?: string;
  departureFlightNumber?: string;
  departureAirline?: string;
  departureDateTime?: string;
  passengerCount: number;
  luggageCount: number;
  weaponBagsCount: number; // escrime / sabre bags
  driverWhatsApp: string;
  specialRequests?: string;
  assignedGroupCode?: string; // Grouping optimization code
  assignedVehicle?: string; // e.g. Mercedes Sprinter #2
  status: 'pending' | 'grouped' | 'assigned' | 'completed';
}

export type PaymentMethod = 'stripe_card' | 'bank_transfer' | 'onsite_federation';

export type PaymentStatus = 'paid' | 'pending_verification' | 'pending_onsite';

export interface ReservationUpsells {
  lateCheckout?: boolean;
  lateCheckoutPrice?: number; // 50 EUR per room
  vipShuttle?: boolean;
  vipShuttlePrice?: number; // 90 EUR per trip
  physioRoomDays?: number; // 100 EUR per day
  physioRoomPrice?: number;
  trainingCamp?: boolean; // Pre-competition training camp Jan 11-14
}

export interface Reservation {
  id: string; // GPS2027-XXXX
  createdAt: string;
  type: ReservationType;
  hotelId: 'el-mouradi-gammarth' | 'golden-carthage';
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nightsCount: number;
  singleRoomCount: number;
  doubleRoomCount: number;
  totalGuestsCount: number;

  // Individual Booking
  individualLead?: {
    firstName: string;
    lastName: string;
    nationality: string;
    federation?: string;
    email: string;
    phone: string;
    passportNumber: string;
    role: RoleType;
  };

  // Group / Federation Booking
  federationGroup?: {
    federationName: string;
    country: string;
    contactPersonName: string;
    contactRole: string;
    contactEmail: string;
    contactPhone: string;
    members: GroupMember[];
  };

  // Financials
  singleRoomPricePerNight: number;
  doubleRoomPricePerNight: number;
  subtotalAmount: number; // in EUR (Room base cost)
  upsellsAmount?: number; // Total additional options
  onsiteAdminSurcharge?: number; // +15 EUR / room / night for onsite payment
  airportSurcharge?: number; // NBE / MIR distance fee
  cityTaxAmount: number; // Taxe de séjour (~3 EUR / nuit / pers)
  totalAmount: number; // in EUR (Grand Total)
  currency: 'EUR';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  stripeTransactionId?: string;

  // Upsells detailed
  upsells?: ReservationUpsells;

  // Shuttle Transfer
  hasShuttle: boolean;
  shuttle?: ShuttleDetails;

  // Status & Notes
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

export interface ShuttleGroup {
  id: string; // ex: SHT-TUN-ELM-14JAN-14H
  date: string;
  timeWindow: string; // e.g., "14:00 - 14:45"
  airport: string;
  destinationHotel: string;
  assignedVehicle: string;
  vehicleCapacity: number;
  totalPassengers: number;
  driverName: string;
  driverPhone: string;
  reservations: {
    bookingCode: string;
    delegationOrName: string;
    passengers: number;
    flightNumber: string;
    airline: string;
    arrivalTime: string;
  }[];
}

export interface EmailLog {
  id: string;
  bookingCode: string;
  recipientEmail: string;
  recipientName: string;
  type: 'booking_confirmation' | 'shuttle_assignment' | 'reminder_48h';
  sentAt: string;
  status: 'sent' | 'delivered';
  subject: string;
  contentSnippet: string;
}
