import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Hotel,
  Reservation,
  ShuttleDetails,
  ShuttleGroup,
  EmailLog,
  ReservationType,
  PaymentMethod,
  GroupMember,
  RoleType,
  ReservationUpsells
} from '../types/gp';
import { INITIAL_HOTELS, INITIAL_RESERVATIONS, INITIAL_SHUTTLE_GROUPS } from '../data/mockData';
import { toast } from 'sonner';

interface CreateReservationParams {
  type: ReservationType;
  hotelId: 'el-mouradi-gammarth' | 'golden-carthage';
  checkInDate: string;
  checkOutDate: string;
  nightsCount: number;
  singleRoomCount: number;
  doubleRoomCount: number;
  totalGuestsCount: number;
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
  federationGroup?: {
    federationName: string;
    country: string;
    contactPersonName: string;
    contactRole: string;
    contactEmail: string;
    contactPhone: string;
    members: GroupMember[];
  };
  paymentMethod: PaymentMethod;
  notes?: string;
  shuttle?: ShuttleDetails;
  upsells?: ReservationUpsells;
  upsellsAmount?: number;
  onsiteAdminSurcharge?: number;
  airportSurcharge?: number;
}

interface ReservationContextType {
  hotels: Record<'el-mouradi-gammarth' | 'golden-carthage', Hotel>;
  reservations: Reservation[];
  shuttleGroups: ShuttleGroup[];
  emailLogs: EmailLog[];
  createReservation: (params: CreateReservationParams) => Reservation;
  getReservation: (code: string) => Reservation | undefined;
  findReservationByEmailAndPassport: (email: string, passport: string) => Reservation | undefined;
  bookShuttle: (code: string, shuttle: ShuttleDetails) => boolean;
  updateFlightInfo: (code: string, updates: Partial<ShuttleDetails>) => boolean;
  acknowledgeFlightModification: (code: string) => void;
  updateHotelRates: (hotelId: 'el-mouradi-gammarth' | 'golden-carthage', singlePrice: number, doublePrice: number) => void;
  blockRooms: (hotelId: 'el-mouradi-gammarth' | 'golden-carthage', roomType: 'single' | 'double', count: number) => void;
  simulateSendEmail: (code: string, type: 'booking_confirmation' | 'shuttle_assignment' | 'reminder_48h') => void;
  exportReservationsCSV: () => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hotels State
  const [hotels, setHotels] = useState<Record<'el-mouradi-gammarth' | 'golden-carthage', Hotel>>(() => {
    const saved = localStorage.getItem('gps2027_hotels');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Always enforce the latest real photos and metadata from INITIAL_HOTELS
        if (parsed['el-mouradi-gammarth']) {
          parsed['el-mouradi-gammarth'].photos = INITIAL_HOTELS['el-mouradi-gammarth'].photos;
          parsed['el-mouradi-gammarth'].amenities = INITIAL_HOTELS['el-mouradi-gammarth'].amenities;
          parsed['el-mouradi-gammarth'].tagline = INITIAL_HOTELS['el-mouradi-gammarth'].tagline;
          parsed['el-mouradi-gammarth'].description = INITIAL_HOTELS['el-mouradi-gammarth'].description;
        }
        if (parsed['golden-carthage']) {
          parsed['golden-carthage'].photos = INITIAL_HOTELS['golden-carthage'].photos;
          parsed['golden-carthage'].amenities = INITIAL_HOTELS['golden-carthage'].amenities;
          parsed['golden-carthage'].tagline = INITIAL_HOTELS['golden-carthage'].tagline;
          parsed['golden-carthage'].description = INITIAL_HOTELS['golden-carthage'].description;
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_HOTELS;
  });

  // Reservations State
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('gps2027_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  // Shuttle Groups State
  const [shuttleGroups, setShuttleGroups] = useState<ShuttleGroup[]>(() => {
    const saved = localStorage.getItem('gps2027_shuttle_groups');
    return saved ? JSON.parse(saved) : INITIAL_SHUTTLE_GROUPS;
  });

  // Email Logs State
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    const saved = localStorage.getItem('gps2027_email_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'em-1',
        bookingCode: 'GPS2027-FR48',
        recipientEmail: 'contact.france@escrime-ffe.fr',
        recipientName: 'Jean-Christophe Durand (FFE France)',
        type: 'booking_confirmation',
        sentAt: '2026-10-15T10:35:00Z',
        status: 'delivered',
        subject: 'Confirmation Officielle • Grand Prix Sabre Tunis 2027 [GPS2027-FR48]',
        contentSnippet: 'Votre réservation hôtelière pour 10 personnes à l\'Hôtel El Mouradi Gammarth a été confirmée.'
      },
      {
        id: 'em-2',
        bookingCode: 'GPS2027-IT92',
        recipientEmail: 'delegazione.sciabola@federscherma.it',
        recipientName: 'Luigi Mazzone (FIS Italie)',
        type: 'booking_confirmation',
        sentAt: '2026-10-18T14:25:00Z',
        status: 'delivered',
        subject: 'Conferma Ufficiale • Grand Prix Sciabola Tunisi 2027 [GPS2027-IT92]',
        contentSnippet: 'Prenotazione confermata per la Federazione Italiana Scherma presso Golden Carthage.'
      }
    ];
  });

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem('gps2027_hotels', JSON.stringify(hotels));
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem('gps2027_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('gps2027_shuttle_groups', JSON.stringify(shuttleGroups));
  }, [shuttleGroups]);

  useEffect(() => {
    localStorage.setItem('gps2027_email_logs', JSON.stringify(emailLogs));
  }, [emailLogs]);

  // Unique Code Generator (Format: GPS2027-XXXX)
  const generateBookingCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const fullCode = `GPS2027-${code}`;
    // Check if duplicate
    if (reservations.some(r => r.id === fullCode)) {
      return generateBookingCode();
    }
    return fullCode;
  };

  // Create Reservation
  const createReservation = (params: CreateReservationParams): Reservation => {
    const code = generateBookingCode();
    const hotel = hotels[params.hotelId];

    const singlePrice = hotel.roomTypes.single.pricePerNight;
    const doublePrice = hotel.roomTypes.double.pricePerNight;

    const totalRooms = params.singleRoomCount + params.doubleRoomCount;
    const roomSubtotal = (params.singleRoomCount * singlePrice * params.nightsCount) +
                         (params.doubleRoomCount * doublePrice * params.nightsCount);

    // Upsells calculation
    let computedUpsells = params.upsellsAmount ?? 0;
    if (params.upsells && computedUpsells === 0) {
      if (params.upsells.lateCheckout) computedUpsells += 50 * totalRooms;
      if (params.upsells.vipShuttle) {
        const tripMultiplier = params.shuttle?.tripType === 'roundtrip' ? 2 : 1;
        computedUpsells += 90 * tripMultiplier;
      }
      if (params.upsells.physioRoomDays && params.upsells.physioRoomDays > 0) {
        computedUpsells += 100 * params.upsells.physioRoomDays;
      }
    }

    // Airport distance surcharge calculation
    let computedAirportSurcharge = params.airportSurcharge ?? 0;
    if (params.shuttle && computedAirportSurcharge === 0) {
      const isRoundTrip = params.shuttle.tripType === 'roundtrip';
      const roundMultiplier = isRoundTrip ? 2 : 1;
      if (params.shuttle.airport === 'NBE') {
        computedAirportSurcharge = params.shuttle.isVipVan 
          ? (160 * roundMultiplier) 
          : (35 * params.shuttle.passengerCount * roundMultiplier);
      } else if (params.shuttle.airport === 'MIR') {
        computedAirportSurcharge = params.shuttle.isVipVan 
          ? (220 * roundMultiplier) 
          : (45 * params.shuttle.passengerCount * roundMultiplier);
      }
    }

    // Onsite payment administrative surcharge (+15 EUR / room / night)
    const computedOnsiteSurcharge = params.onsiteAdminSurcharge !== undefined
      ? params.onsiteAdminSurcharge
      : (params.paymentMethod === 'onsite_federation' ? (15 * totalRooms * params.nightsCount) : 0);

    const cityTax = 3 * params.totalGuestsCount * params.nightsCount;
    const total = roomSubtotal + computedUpsells + computedAirportSurcharge + computedOnsiteSurcharge + cityTax;

    const newReservation: Reservation = {
      id: code,
      createdAt: new Date().toISOString(),
      type: params.type,
      hotelId: params.hotelId,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      nightsCount: params.nightsCount,
      singleRoomCount: params.singleRoomCount,
      doubleRoomCount: params.doubleRoomCount,
      totalGuestsCount: params.totalGuestsCount,
      individualLead: params.individualLead,
      federationGroup: params.federationGroup,
      singleRoomPricePerNight: singlePrice,
      doubleRoomPricePerNight: doublePrice,
      subtotalAmount: roomSubtotal,
      upsellsAmount: computedUpsells,
      airportSurcharge: computedAirportSurcharge,
      onsiteAdminSurcharge: computedOnsiteSurcharge,
      upsells: params.upsells,
      cityTaxAmount: cityTax,
      totalAmount: total,
      currency: 'EUR',
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'stripe_card' ? 'paid' : (params.paymentMethod === 'onsite_federation' ? 'pending_onsite' : 'pending_verification'),
      stripeTransactionId: params.paymentMethod === 'stripe_card' ? `ch_sim_${Date.now()}` : undefined,
      hasShuttle: !!params.shuttle,
      shuttle: params.shuttle ? {
        ...params.shuttle,
        bookingId: code,
        status: 'grouped',
        assignedGroupCode: `SHT-${params.shuttle.airport}-${params.hotelId === 'el-mouradi-gammarth' ? 'ELM' : 'GC'}`
      } : undefined,
      status: 'confirmed',
      notes: params.notes
    };

    setReservations(prev => [newReservation, ...prev]);

    // Add email log
    const recipientEmail = params.type === 'individual'
      ? params.individualLead?.email || ''
      : params.federationGroup?.contactEmail || '';

    const recipientName = params.type === 'individual'
      ? `${params.individualLead?.firstName} ${params.individualLead?.lastName}`
      : `${params.federationGroup?.contactPersonName} (${params.federationGroup?.federationName})`;

    const emailLog: EmailLog = {
      id: `em-${Date.now()}`,
      bookingCode: code,
      recipientEmail,
      recipientName,
      type: 'booking_confirmation',
      sentAt: new Date().toISOString(),
      status: 'delivered',
      subject: `Confirmation Officielle • Grand Prix Sabre Tunis 2027 [${code}]`,
      contentSnippet: `Votre réservation (${params.nightsCount} nuits, Hôtel ${hotel.name}) a été enregistrée avec succès. Total: ${total} EUR.`
    };

    setEmailLogs(prev => [emailLog, ...prev]);

    toast.success(`Réservation confirmée avec succès ! Code: ${code}`, {
      description: `Un email de confirmation et la facture officielle ont été expédiés à ${recipientEmail}.`,
      duration: 6000
    });

    return newReservation;
  };

  // Find Reservation by Booking Code
  const getReservation = (code: string): Reservation | undefined => {
    if (!code) return undefined;
    const cleanCode = code.trim().toUpperCase();
    return reservations.find(r => r.id.toUpperCase() === cleanCode);
  };

  // Find Reservation by Email + Passport Number (Dual Search)
  const findReservationByEmailAndPassport = (email: string, passport: string): Reservation | undefined => {
    if (!email && !passport) return undefined;
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassport = passport.trim().toLowerCase();

    return reservations.find(r => {
      // Individual check
      if (r.type === 'individual' && r.individualLead) {
        const emailMatch = cleanEmail ? r.individualLead.email?.toLowerCase().includes(cleanEmail) : true;
        const passportMatch = cleanPassport ? r.individualLead.passportNumber?.toLowerCase() === cleanPassport : true;
        if (cleanEmail && cleanPassport) return emailMatch && passportMatch;
        if (cleanEmail) return emailMatch;
        if (cleanPassport) return passportMatch;
      }
      // Group check
      if (r.type === 'group' && r.federationGroup) {
        const contactEmailMatch = cleanEmail ? r.federationGroup.contactEmail?.toLowerCase().includes(cleanEmail) : false;
        const memberPassportMatch = cleanPassport ? r.federationGroup.members?.some(m => m.passportNumber?.toLowerCase() === cleanPassport) : false;
        if (cleanEmail && cleanPassport) return contactEmailMatch || memberPassportMatch;
        if (cleanEmail) return contactEmailMatch;
        if (cleanPassport) return memberPassportMatch;
      }
      return false;
    });
  };

  // Book Shuttle for an existing reservation
  const bookShuttle = (code: string, shuttle: ShuttleDetails): boolean => {
    const reservation = getReservation(code);
    if (!reservation) {
      toast.error('Code de réservation introuvable.');
      return false;
    }

    const hotelAbbr = reservation.hotelId === 'el-mouradi-gammarth' ? 'ELM' : 'GC';
    const groupCode = `SHT-${shuttle.airport}-${hotelAbbr}-OPT`;

    const updatedShuttle: ShuttleDetails = {
      ...shuttle,
      bookingId: reservation.id,
      assignedGroupCode: groupCode,
      assignedVehicle: shuttle.passengerCount > 6 ? 'Minibus Mercedes Sprinter (Capacité 18)' : 'Van VIP Confort (Capacité 7)',
      status: 'grouped'
    };

    setReservations(prev => prev.map(r => {
      if (r.id === reservation.id) {
        return {
          ...r,
          hasShuttle: true,
          shuttle: updatedShuttle
        };
      }
      return r;
    }));

    // Add to shuttle groups
    const recipientEmail = reservation.type === 'individual'
      ? reservation.individualLead?.email || ''
      : reservation.federationGroup?.contactEmail || '';

    const newLog: EmailLog = {
      id: `em-sht-${Date.now()}`,
      bookingCode: reservation.id,
      recipientEmail,
      recipientName: reservation.type === 'individual' ? `${reservation.individualLead?.firstName} ${reservation.individualLead?.lastName}` : reservation.federationGroup?.federationName || '',
      type: 'shuttle_assignment',
      sentAt: new Date().toISOString(),
      status: 'delivered',
      subject: `Attribution Navette Officielle • GP Sabre Tunis 2027 [${reservation.id}]`,
      contentSnippet: `Votre navette au départ de ${shuttle.airport} vers ${reservation.hotelId} a été confirmée et regroupée.`
    };
    setEmailLogs(prev => [newLog, ...prev]);

    toast.success('Navette réservée & optimisée avec succès !', {
      description: `Regroupement automatique appliqué. Chauffeur notifié.`
    });

    return true;
  };

  // Update Flight Info & Trigger Instant Alert
  const updateFlightInfo = (code: string, updates: Partial<ShuttleDetails>): boolean => {
    const reservation = getReservation(code);
    if (!reservation || !reservation.shuttle) {
      toast.error('Aucune navette trouvée pour cette réservation.');
      return false;
    }

    const oldFlight = {
      flightNumber: reservation.shuttle.arrivalFlightNumber || 'N/A',
      airline: reservation.shuttle.arrivalAirline || 'N/A',
      dateTime: reservation.shuttle.arrivalDateTime ? reservation.shuttle.arrivalDateTime.replace('T', ' ') : 'Non renseigné',
      airport: reservation.shuttle.airport || 'TUN'
    };

    const newFlightNumber = updates.arrivalFlightNumber || oldFlight.flightNumber;
    const newAirline = updates.arrivalAirline || oldFlight.airline;
    const newDateTime = updates.arrivalDateTime ? updates.arrivalDateTime.replace('T', ' ') : oldFlight.dateTime;
    const newAirport = updates.airport || oldFlight.airport;

    const delegationName = reservation.type === 'group'
      ? (reservation.federationGroup?.federationName || 'Délégation Groupe')
      : `${reservation.individualLead?.firstName || ''} ${reservation.individualLead?.lastName || ''}`.trim() || 'Athlète Individuel';

    // 1. Update reservation state with modified flag and previous details
    setReservations(prev => prev.map(r => {
      if (r.id === reservation.id && r.shuttle) {
        return {
          ...r,
          flightModifiedRecently: true,
          flightModifiedAt: new Date().toISOString(),
          previousFlightDetails: oldFlight,
          shuttle: {
            ...r.shuttle,
            ...updates
          }
        };
      }
      return r;
    }));

    // 2. Instant automatic alert email to organization address
    const alertEmail: EmailLog = {
      id: `EML-ALERT-${Date.now()}`,
      bookingCode: reservation.id,
      recipientEmail: 'organisation@escrime-tunis2027.com',
      recipientName: 'Cellule Dispatching Navettes & Logistique FIE',
      type: 'flight_modified_alert',
      sentAt: new Date().toISOString(),
      status: 'delivered',
      subject: `[ALERTE NAVETTE] Vol modifié pour le dossier ${reservation.id}`,
      contentSnippet: `Dossier ${reservation.id} (${delegationName}) : Ancien vol [${oldFlight.flightNumber} - ${oldFlight.dateTime}] ➔ Nouvel horaire [${newFlightNumber} - ${newDateTime}] à l'aéroport ${newAirport}. Le planning chauffeur et les rotations de minibus ont été réajustés.`
    };
    setEmailLogs(prev => [alertEmail, ...prev]);

    // 3. Trigger live browser event & broadcast channel for SuperAdmin dashboard
    try {
      const alertPayload = {
        code: reservation.id,
        delegation: delegationName,
        oldFlight,
        newFlight: {
          flightNumber: newFlightNumber,
          airline: newAirline,
          dateTime: newDateTime,
          airport: newAirport
        }
      };

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gps2027_flight_alert', { detail: alertPayload }));
        if ('BroadcastChannel' in window) {
          const ch = new BroadcastChannel('gps2027_alerts');
          ch.postMessage({ type: 'flight_alert', payload: alertPayload });
          ch.close();
        }
      }
    } catch (e) {
      console.error('Error dispatching flight alert:', e);
    }

    toast.success('Horaires et coordonnées de vol mis à jour !', {
      description: `Notification d'alerte instantanée transmise à la cellule de dispatching FIE.`
    });

    return true;
  };

  // Acknowledge Flight Modification Alert in Admin
  const acknowledgeFlightModification = (code: string) => {
    setReservations(prev => prev.map(r => {
      if (r.id === code) {
        return {
          ...r,
          flightModifiedRecently: false
        };
      }
      return r;
    }));
    toast.info(`Alerte acquittée pour le dossier ${code}`);
  };

  // Update Hotel Room Rates
  const updateHotelRates = (
    hotelId: 'el-mouradi-gammarth' | 'golden-carthage',
    singlePrice: number,
    doublePrice: number
  ) => {
    setHotels(prev => ({
      ...prev,
      [hotelId]: {
        ...prev[hotelId],
        roomTypes: {
          single: {
            ...prev[hotelId].roomTypes.single,
            pricePerNight: singlePrice
          },
          double: {
            ...prev[hotelId].roomTypes.double,
            pricePerNight: doublePrice
          }
        }
      }
    }));

    toast.success(`Tarifs mis à jour pour ${hotels[hotelId].name}`, {
      description: `Single: ${singlePrice} € | Double: ${doublePrice} €`
    });
  };

  // Block Rooms Quota
  const blockRooms = (
    hotelId: 'el-mouradi-gammarth' | 'golden-carthage',
    roomType: 'single' | 'double',
    count: number
  ) => {
    setHotels(prev => ({
      ...prev,
      [hotelId]: {
        ...prev[hotelId],
        roomTypes: {
          ...prev[hotelId].roomTypes,
          [roomType]: {
            ...prev[hotelId].roomTypes[roomType],
            blockedInventory: count
          }
        }
      }
    }));

    toast.info(`Quota mis à jour`, {
      description: `${count} chambres ${roomType} bloquées pour ${hotels[hotelId].name}`
    });
  };

  // Simulate Send Email
  const simulateSendEmail = (code: string, type: 'booking_confirmation' | 'shuttle_assignment' | 'reminder_48h') => {
    const reservation = getReservation(code);
    if (!reservation) return;

    const email = reservation.type === 'individual'
      ? reservation.individualLead?.email
      : reservation.federationGroup?.contactEmail;

    const name = reservation.type === 'individual'
      ? `${reservation.individualLead?.firstName} ${reservation.individualLead?.lastName}`
      : reservation.federationGroup?.federationName;

    const subjects = {
      booking_confirmation: `[FIE Tunis 2027] Confirmation Officielle • ${reservation.id}`,
      shuttle_assignment: `[FIE Tunis 2027] Attribution de Navette & Chauffeur • ${reservation.id}`,
      reminder_48h: `[Rappel FIE Tunis 2027] Votre Arrivée dans 48 Heures • ${reservation.id}`
    };

    const newLog: EmailLog = {
      id: `em-sim-${Date.now()}`,
      bookingCode: reservation.id,
      recipientEmail: email || 'delegation@fie.ch',
      recipientName: name || 'Délégation',
      type,
      sentAt: new Date().toISOString(),
      status: 'delivered',
      subject: subjects[type],
      contentSnippet: `Email de type "${type}" expédié avec succès pour ${name} (${reservation.id}).`
    };

    setEmailLogs(prev => [newLog, ...prev]);

    toast.success(`Courriel automatique envoyé avec succès`, {
      description: `Envoyé à : ${email} | Sujet: ${subjects[type]}`
    });
  };

  // Export to CSV / Excel
  const exportReservationsCSV = () => {
    const headers = [
      'Code Réservation',
      'Date Création',
      'Type',
      'Hôtel',
      'Arrivée',
      'Départ',
      'Nuits',
      'Chambres Single',
      'Chambres Double',
      'Total Personnes',
      'Nom Délégation / Client',
      'Email Contact',
      'Téléphone',
      'Base Chambres EUR',
      'Options Upsells EUR',
      'Supplément Aéroport EUR',
      'Frais Sur Place EUR',
      'Taxe Séjour EUR',
      'Total Global EUR',
      'Mode Paiement',
      'Statut Paiement',
      'Navette Réservée',
      'Vol Arrivée',
      'Date Heure Vol',
      'Aéroport',
      'Groupe Navette'
    ];

    const rows = reservations.map(r => {
      const isGroup = r.type === 'group';
      const clientName = isGroup ? r.federationGroup?.federationName : `${r.individualLead?.firstName} ${r.individualLead?.lastName}`;
      const email = isGroup ? r.federationGroup?.contactEmail : r.individualLead?.email;
      const phone = isGroup ? r.federationGroup?.contactPhone : r.individualLead?.phone;
      const hotelName = r.hotelId === 'el-mouradi-gammarth' ? 'El Mouradi Gammarth' : 'Golden Carthage';

      return [
        r.id,
        r.createdAt.split('T')[0],
        r.type,
        hotelName,
        r.checkInDate,
        r.checkOutDate,
        r.nightsCount,
        r.singleRoomCount,
        r.doubleRoomCount,
        r.totalGuestsCount,
        `"${clientName || ''}"`,
        email || '',
        phone || '',
        r.subtotalAmount,
        r.upsellsAmount || 0,
        r.airportSurcharge || 0,
        r.onsiteAdminSurcharge || 0,
        r.cityTaxAmount,
        r.totalAmount,
        r.paymentMethod,
        r.paymentStatus,
        r.hasShuttle ? 'OUI' : 'NON',
        r.shuttle?.arrivalFlightNumber || 'N/A',
        r.shuttle?.arrivalDateTime || 'N/A',
        r.shuttle?.airport || 'N/A',
        r.shuttle?.assignedGroupCode || 'N/A'
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [
      headers.join(';'),
      ...rows.map(e => e.join(';'))
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FIE_GP_Tunis_2027_Reservations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Fichier Excel / CSV exporté avec succès !');
  };

  return (
    <ReservationContext.Provider
      value={{
        hotels,
        reservations,
        shuttleGroups,
        emailLogs,
        createReservation,
        getReservation,
        findReservationByEmailAndPassport,
        bookShuttle,
        updateFlightInfo,
        acknowledgeFlightModification,
        updateHotelRates,
        blockRooms,
        simulateSendEmail,
        exportReservationsCSV
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};
