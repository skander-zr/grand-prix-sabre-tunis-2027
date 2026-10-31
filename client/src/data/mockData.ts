import { Hotel, Reservation, ShuttleGroup } from '../types/gp';

export const INITIAL_HOTELS: Record<'el-mouradi-gammarth' | 'golden-carthage', Hotel> = {
  'el-mouradi-gammarth': {
    id: 'el-mouradi-gammarth',
    name: 'Hôtel El Mouradi Gammarth',
    category: '5 Étoiles Luxe Resort & Spa',
    stars: 5,
    tagline: {
      fr: 'Village Officiel des Athlètes & Délégations FIE en bord de mer',
      en: 'Official FIE Athletes Village & Beachfront Delegation Resort'
    },
    location: 'Les Côtes de Carthage, Gammarth, 2078 Tunis, Tunisie',
    competitionDistance: {
      venue: 'Salle Omnisports de Radès (Palais des Sports FIE)',
      distanceKm: 12.5,
      travelTimeMin: 16,
      shuttleFrequencyMin: 20
    },
    googleMapsEmbedUrl: 'https://maps.google.com/maps?q=El+Mouradi+Gammarth+Tunis&t=&z=15&ie=UTF8&iwloc=&output=embed',
    coordinates: { lat: 36.9214, lng: 10.2986 },
    description: {
      fr: 'Implanté directement en bord de mer sur les Côtes de Carthage, El Mouradi Gammarth est le village officiel d\'hébergement pour les athlètes et délégations du Grand Prix Sabre Tunis 2027. L\'établissement propose des buffets nutritionnels adaptés aux sportifs de haut niveau, un centre de balnéothérapie de 1200 m², une piscine couverte chauffée et un centre de remise en forme complet pour la récupération active.',
      en: 'Located on the seafront of the Carthage coast, El Mouradi Gammarth serves as the official Athletes Village for the Sabre Grand Prix Tunis 2027. Features high-performance athletic sports nutrition buffets, a 1,200 sqm balneotherapy and recovery center, heated indoor pool, and dedicated fencing logistics hub.'
    },
    photos: [
      {
        url: 'https://static21.com-hotel.com/uploads/hotel/58672/photo/lg_el-mouradi-gammarth_152983353811.jpg',
        caption: { fr: 'Façade & Grande piscine en bord de mer', en: 'Facade & Grand seafront swimming pool' }
      },
      {
        url: 'https://images.trvl-media.com/lodging/2000000/1510000/1507700/1507626/d1b12f5f.jpg',
        caption: { fr: 'Plage & Extérieurs des Côtes de Carthage', en: 'Beach & Carthage coast grounds' }
      },
      {
        url: 'https://pix10.agoda.net/hotelImages/34566410/0/dfdec0ec3d34adbd696d6e084f34376e.jpeg',
        caption: { fr: 'Chambre Double / Twin officielle pour athlètes', en: 'Official Double / Twin room for athletes' }
      }
    ],
    amenities: [
      { icon: 'Wifi', label: { fr: 'WiFi Fibre Dédié 1 Gbps', en: 'Dedicated 1 Gbps Fiber WiFi' } },
      { icon: 'Dumbbell', label: { fr: 'Centre Fitness & Musculation Pro', en: 'Pro Athletic Gym & Fitness Center' } },
      { icon: 'Waves', label: { fr: 'Piscine Olympique & Spa Balnéo', en: 'Olympic Pool & Recovery Spa' } },
      { icon: 'Utensils', label: { fr: 'Buffets Nutrition Spécial Escrime', en: 'Fencing Sports Nutrition Buffets' } },
      { icon: 'Bus', label: { fr: 'Navette Directe Salle Toutes les 20 min', en: 'Direct Venue Shuttle Every 20 mins' } },
      { icon: 'ShieldCheck', label: { fr: 'Sécurité & Accréditation FIE 24/7', en: '24/7 FIE Security & Accreditation Desk' } },
      { icon: 'Users', label: { fr: 'Salles de Briefing & Vidéo Tactique', en: 'Tactical Video & Briefing Rooms' } },
      { icon: 'Sparkles', label: { fr: 'Service Blanchisserie Tenues Express', en: 'Express Fencing Whites Laundry' } }
    ],
    roomTypes: {
      single: {
        id: 'single',
        name: { fr: 'Chambre Single Athlète / Officiel', en: 'Single Room (Athlete / Official)' },
        capacity: 1,
        pricePerNight: 130,
        description: {
          fr: 'Chambre individuelle tout confort avec lit King-size, bureau, salle de bain en marbre, balcon privatif et vue mer ou jardin.',
          en: 'Private single room featuring King-size bed, workstation, marble bathroom, private balcony, and sea or garden view.'
        },
        features: ['1 Lit King Size', 'Climatisation / Chauffage individuel', 'Room Service 24/7', 'Coffre-fort pour équipement'],
        totalInventory: 90,
        blockedInventory: 15
      },
      double: {
        id: 'double',
        name: { fr: 'Chambre Double / Twin (2 Lits Séparés)', en: 'Double / Twin Room (2 Separate Beds)' },
        capacity: 2,
        pricePerNight: 180,
        description: {
          fr: 'Chambre spacieuse spécialement agencée pour 2 athlètes avec lits jumeaux ergonomiques et espace sécurisé pour les sacs d\'escrime.',
          en: 'Spacious room tailored for 2 athletes with twin ergonomic beds and dedicated storage for fencing rollbags.'
        },
        features: ['2 Lits Simples Ergonomiques', 'Grand dressing & rangements sacs', 'Minibar & TV Satellite internationale', 'Double vasque'],
        totalInventory: 130,
        blockedInventory: 20
      }
    }
  },

  'golden-carthage': {
    id: 'golden-carthage',
    name: 'Hôtel Golden Carthage',
    category: '5 Étoiles Palace Panoramique',
    stars: 5,
    tagline: {
      fr: 'QG Officiel FIE, Corps Arbitral & Chefs de Délégations',
      en: 'Official FIE Headquarters, Referees & Delegations Executive Hub'
    },
    location: 'Avenue de la Promenade, Colline de Gammarth, 2078 Tunis, Tunisie',
    competitionDistance: {
      venue: 'Salle Omnisports de Radès (Palais des Sports FIE)',
      distanceKm: 14.2,
      travelTimeMin: 18,
      shuttleFrequencyMin: 20
    },
    googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Golden+Carthage+Tunis&t=&z=15&ie=UTF8&iwloc=&output=embed',
    coordinates: { lat: 36.9182, lng: 10.3127 },
    description: {
      fr: 'Perché sur les hauteurs de la colline de Gammarth avec un panorama majestueux sur tout le Golfe de Tunis, le Golden Carthage est l\'établissement de prestige retenu pour le directoire FIE, le corps arbitral international et les délégations officielles. Il propose des suites exécutives, des salons de travail diplomatiques, des installations de kinésithérapie avancées et une table gastronomique méditerranéenne.',
      en: 'Perched on the Gammarth cliff offering panoramic vistas across the Gulf of Tunis, Golden Carthage is the elite venue selected for the FIE Executive Board, international referee panel, and official delegates. Features executive suites, diplomatic lounges, sports physiotherapy clinics, and Mediterranean fine dining.'
    },
    photos: [
      {
        url: 'https://static21.com-hotel.com/uploads/hotel/58465/photo/lg_golden-tulip-carthage-tunis_15298728881.jpg',
        caption: { fr: 'Vue panoramique sur la Baie de Gammarth & Golfe de Tunis', en: 'Panoramic view over Gammarth Bay' }
      },
      {
        url: 'https://images.trvl-media.com/lodging/1000000/560000/558100/558059/5f9a3236.jpg',
        caption: { fr: 'Terrasse & Piscine extérieure panoramique', en: 'Terrace & Panoramic outdoor pool' }
      },
      {
        url: 'https://images.trvl-media.com/lodging/1000000/560000/558100/558059/56a1277b.jpg',
        caption: { fr: 'Chambre Executive VIP & Grand standing', en: 'Executive VIP Room' }
      }
    ],
    amenities: [
      { icon: 'Shield', label: { fr: 'Hub Exécutif FIE & Sécurité Diplomatique', en: 'FIE Executive Hub & VIP Security' } },
      { icon: 'Wifi', label: { fr: 'Connexion Haut Débit Cryptée', en: 'High-Speed Encrypted Network' } },
      { icon: 'HeartPulse', label: { fr: 'Pôle Kiné & Récupération Sportive', en: 'Physiotherapy & Athletic Recovery' } },
      { icon: 'Presentation', label: { fr: 'Amphithéâtre & Salles de Conférence FIE', en: 'FIE Conference & Video Auditoriums' } },
      { icon: 'Bus', label: { fr: 'Navettes VIP Privatisées vers la Salle', en: 'Privatized VIP Shuttles to Venue' } },
      { icon: 'Coffee', label: { fr: 'Lounge Délégations & Business Center', en: 'Delegations Lounge & Business Center' } },
      { icon: 'UtensilsCrossed', label: { fr: 'Restaurants Gastronomique & Diététique', en: 'Gastronomic & Dietary Restaurants' } },
      { icon: 'Car', label: { fr: 'Service Chauffeur Privé & Voiturier 24/7', en: '24/7 Private Chauffeur & Valet' } }
    ],
    roomTypes: {
      single: {
        id: 'single',
        name: { fr: 'Chambre Single Exécutive (Arbitres / VIP)', en: 'Executive Single Room (Referees / VIP)' },
        capacity: 1,
        pricePerNight: 145,
        description: {
          fr: 'Chambre single de grand standing avec literie premium, salon de repos, vue colline/mer et accès exclusif au Business Lounge.',
          en: 'High-standing single room with premium bedding, private sitting area, sea view, and VIP Lounge access.'
        },
        features: ['1 Grand Lit King Executive', 'Accès Lounge VIP FIE', 'Machine à café Espresso', 'Insonorisation phonique optimale'],
        totalInventory: 70,
        blockedInventory: 18
      },
      double: {
        id: 'double',
        name: { fr: 'Chambre Double / Twin Prestige', en: 'Prestige Double / Twin Room' },
        capacity: 2,
        pricePerNight: 195,
        description: {
          fr: 'Chambre double spacieuse équipée de 2 lits Queen-size, dressing indépendant, salle de bain italienne et terrasse panoramique.',
          en: 'Spacious double room equipped with 2 Queen-size beds, walk-in dressing, Italian shower, and panoramic terrace.'
        },
        features: ['2 Lits Queen-size Confort', 'Terrasse panoramique vue mer', 'Sèche-cheveux pro & peignoirs', 'Service de conciergerie dédié'],
        totalInventory: 95,
        blockedInventory: 15
      }
    }
  }
};

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'GPS2027-FR48',
    createdAt: '2026-10-15T10:30:00Z',
    type: 'group',
    hotelId: 'el-mouradi-gammarth',
    checkInDate: '2027-01-14',
    checkOutDate: '2027-01-18',
    nightsCount: 4,
    singleRoomCount: 2,
    doubleRoomCount: 4,
    totalGuestsCount: 10,
    federationGroup: {
      federationName: 'Fédération Française d\'Escrime (FFE)',
      country: 'France',
      contactPersonName: 'Jean-Christophe Durand',
      contactRole: 'Chef de Délégation & DTN Sabre',
      contactEmail: 'contact.france@escrime-ffe.fr',
      contactPhone: '+33 6 12 34 56 78',
      members: [
        { id: 'm1', firstName: 'Sébastien', lastName: 'Patrice', gender: 'M', role: 'athlete', passportNumber: '24FA19283', roomPreference: 'single' },
        { id: 'm2', firstName: 'Jean-Philippe', lastName: 'Patrice', gender: 'M', role: 'athlete', passportNumber: '24FA19284', roomPreference: 'single' },
        { id: 'm3', firstName: 'Maxime', lastName: 'Pianfetti', gender: 'M', role: 'athlete', passportNumber: '22FA77192', roomPreference: 'double', roommateName: 'Bolade Apithy' },
        { id: 'm4', firstName: 'Bolade', lastName: 'Apithy', gender: 'M', role: 'athlete', passportNumber: '21FA99182', roomPreference: 'double', roommateName: 'Maxime Pianfetti' },
        { id: 'm5', firstName: 'Sara', lastName: 'Balzer', gender: 'F', role: 'athlete', passportNumber: '23FA66102', roomPreference: 'double', roommateName: 'Manon Apithy-Brunet' },
        { id: 'm6', firstName: 'Manon', lastName: 'Apithy-Brunet', gender: 'F', role: 'athlete', passportNumber: '20FA44319', roomPreference: 'double', roommateName: 'Sara Balzer' },
        { id: 'm7', firstName: 'Vincent', lastName: 'Anstett', gender: 'M', role: 'coach', passportNumber: '19FA11009', roomPreference: 'double', roommateName: 'Mathieu Gourdain' },
        { id: 'm8', firstName: 'Mathieu', lastName: 'Gourdain', gender: 'M', role: 'coach', passportNumber: '18FA88231', roomPreference: 'double', roommateName: 'Vincent Anstett' },
        { id: 'm9', firstName: 'Dr. Philippe', lastName: 'Martin', gender: 'M', role: 'medical', passportNumber: '25FA00918', roomPreference: 'single' },
        { id: 'm10', firstName: 'Jean-Christophe', lastName: 'Durand', gender: 'M', role: 'delegate', passportNumber: '17FA55110', roomPreference: 'single' }
      ]
    },
    singleRoomPricePerNight: 130,
    doubleRoomPricePerNight: 180,
    subtotalAmount: (2 * 130 * 4) + (4 * 180 * 4), // 1040 + 2880 = 3920
    cityTaxAmount: 120, // 3 EUR x 10 guests x 4 nights
    totalAmount: 4040,
    currency: 'EUR',
    paymentMethod: 'stripe_card',
    paymentStatus: 'paid',
    stripeTransactionId: 'ch_3N82JkL9102X9s19',
    hasShuttle: true,
    shuttle: {
      bookingId: 'GPS2027-FR48',
      tripType: 'roundtrip',
      airport: 'TUN',
      arrivalAirline: 'Air France',
      arrivalFlightNumber: 'AF1184',
      arrivalDateTime: '2027-01-14T14:15',
      departureAirline: 'Air France',
      departureFlightNumber: 'AF1185',
      departureDateTime: '2027-01-18T17:30',
      passengerCount: 10,
      luggageCount: 16,
      weaponBagsCount: 8,
      driverWhatsApp: '+216 98 440 112',
      assignedGroupCode: 'SHT-TUN-ELM-14JAN-14H',
      assignedVehicle: 'Minibus Mercedes Sprinter #1 (Capacité 18)',
      status: 'grouped'
    },
    status: 'confirmed',
    notes: 'Arrivée délégation complète avec matériel sabre. Chambre single requise pour le médecin et le chef de délégation.'
  },

  {
    id: 'GPS2027-IT92',
    createdAt: '2026-10-18T14:20:00Z',
    type: 'group',
    hotelId: 'golden-carthage',
    checkInDate: '2027-01-14',
    checkOutDate: '2027-01-18',
    nightsCount: 4,
    singleRoomCount: 2,
    doubleRoomCount: 3,
    totalGuestsCount: 8,
    federationGroup: {
      federationName: 'Federazione Italiana Scherma (FIS)',
      country: 'Italy',
      contactPersonName: 'Luigi Mazzone',
      contactRole: 'Team Manager Sciabola',
      contactEmail: 'delegazione.sciabola@federscherma.it',
      contactPhone: '+39 347 112 9988',
      members: [
        { id: 'i1', firstName: 'Luigi', lastName: 'Samele', gender: 'M', role: 'athlete', passportNumber: 'YA1827361', roomPreference: 'single' },
        { id: 'i2', firstName: 'Luca', lastName: 'Curatoli', gender: 'M', role: 'athlete', passportNumber: 'YA9918231', roomPreference: 'double', roommateName: 'Michele Gallo' },
        { id: 'i3', firstName: 'Michele', lastName: 'Gallo', gender: 'M', role: 'athlete', passportNumber: 'YA5541829', roomPreference: 'double', roommateName: 'Luca Curatoli' },
        { id: 'i4', firstName: 'Michela', lastName: 'Battiston', gender: 'F', role: 'athlete', passportNumber: 'YA7712390', roomPreference: 'double', roommateName: 'Chiara Mormile' },
        { id: 'i5', firstName: 'Chiara', lastName: 'Mormile', gender: 'F', role: 'athlete', passportNumber: 'YA8812309', roomPreference: 'double', roommateName: 'Michela Battiston' },
        { id: 'i6', firstName: 'Nicola', lastName: 'Zanotti', gender: 'M', role: 'coach', passportNumber: 'YA1123498', roomPreference: 'single' },
        { id: 'i7', firstName: 'Andrea', lastName: 'Aquili', gender: 'M', role: 'coach', passportNumber: 'YA4419283', roomPreference: 'double', roommateName: 'Luigi Mazzone' },
        { id: 'i8', firstName: 'Luigi', lastName: 'Mazzone', gender: 'M', role: 'delegate', passportNumber: 'YA6651290', roomPreference: 'double', roommateName: 'Andrea Aquili' }
      ]
    },
    singleRoomPricePerNight: 145,
    doubleRoomPricePerNight: 195,
    subtotalAmount: (2 * 145 * 4) + (3 * 195 * 4), // 1160 + 2340 = 3500
    cityTaxAmount: 96,
    totalAmount: 3596,
    currency: 'EUR',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    hasShuttle: true,
    shuttle: {
      bookingId: 'GPS2027-IT92',
      tripType: 'roundtrip',
      airport: 'TUN',
      arrivalAirline: 'ITA Airways',
      arrivalFlightNumber: 'AZ864',
      arrivalDateTime: '2027-01-14T14:40',
      departureAirline: 'ITA Airways',
      departureFlightNumber: 'AZ865',
      departureDateTime: '2027-01-18T16:15',
      passengerCount: 8,
      luggageCount: 14,
      weaponBagsCount: 6,
      driverWhatsApp: '+216 98 440 115',
      assignedGroupCode: 'SHT-TUN-GC-14JAN-14H',
      assignedVehicle: 'Minibus VIP Golden #3 (Capacité 15)',
      status: 'grouped'
    },
    status: 'confirmed',
    notes: 'Paiement par virement officiel FIS reçu avec attestation bancaire. Réservation confirmée.'
  },

  {
    id: 'GPS2027-TN01',
    createdAt: '2026-10-20T09:15:00Z',
    type: 'individual',
    hotelId: 'el-mouradi-gammarth',
    checkInDate: '2027-01-14',
    checkOutDate: '2027-01-18',
    nightsCount: 4,
    singleRoomCount: 1,
    doubleRoomCount: 0,
    totalGuestsCount: 1,
    individualLead: {
      firstName: 'Farès',
      lastName: 'Ferjani',
      nationality: 'Tunisia',
      federation: 'Fédération Tunisienne d\'Escrime (FTE)',
      email: 'fares.ferjani@escrime-tunisie.tn',
      phone: '+216 20 889 900',
      passportNumber: 'TN8192837',
      role: 'athlete'
    },
    singleRoomPricePerNight: 130,
    doubleRoomPricePerNight: 180,
    subtotalAmount: 130 * 4,
    cityTaxAmount: 12,
    totalAmount: 532,
    currency: 'EUR',
    paymentMethod: 'onsite_federation',
    paymentStatus: 'pending_onsite',
    hasShuttle: true,
    shuttle: {
      bookingId: 'GPS2027-TN01',
      tripType: 'arrival',
      airport: 'TUN',
      arrivalAirline: 'Tunisair',
      arrivalFlightNumber: 'TU721',
      arrivalDateTime: '2027-01-14T14:20',
      passengerCount: 1,
      luggageCount: 2,
      weaponBagsCount: 2,
      driverWhatsApp: '+216 98 440 112',
      assignedGroupCode: 'SHT-TUN-ELM-14JAN-14H',
      assignedVehicle: 'Minibus Mercedes Sprinter #1 (Capacité 18)',
      status: 'grouped'
    },
    status: 'confirmed',
    notes: 'Médaillé Olympique Tunisien. Prise en charge officielle convention Ministère de la Jeunesse et des Sports.'
  },

  {
    id: 'GPS2027-US15',
    createdAt: '2026-10-21T16:45:00Z',
    type: 'group',
    hotelId: 'golden-carthage',
    checkInDate: '2027-01-14',
    checkOutDate: '2027-01-18',
    nightsCount: 4,
    singleRoomCount: 3,
    doubleRoomCount: 2,
    totalGuestsCount: 7,
    federationGroup: {
      federationName: 'USA Fencing Association',
      country: 'United States',
      contactPersonName: 'Donald Anthony Jr.',
      contactRole: 'High Performance Director',
      contactEmail: 'operations@usafencing.org',
      contactPhone: '+1 719 866 4511',
      members: [
        { id: 'u1', firstName: 'Eli', lastName: 'Dershwitz', gender: 'M', role: 'athlete', passportNumber: 'USA8891029', roomPreference: 'single' },
        { id: 'u2', firstName: 'Colin', lastName: 'Heathcock', gender: 'M', role: 'athlete', passportNumber: 'USA7719283', roomPreference: 'single' },
        { id: 'u3', firstName: 'Magda', lastName: 'Skabonkiewicz', gender: 'F', role: 'athlete', passportNumber: 'USA6619280', roomPreference: 'double', roommateName: 'Tatiana Nazlymov' },
        { id: 'u4', firstName: 'Tatiana', lastName: 'Nazlymov', gender: 'F', role: 'athlete', passportNumber: 'USA5519281', roomPreference: 'double', roommateName: 'Magda Skabonkiewicz' },
        { id: 'u5', firstName: 'Zoran', lastName: 'Tulum', gender: 'M', role: 'coach', passportNumber: 'USA4419282', roomPreference: 'single' },
        { id: 'u6', firstName: 'Sara', lastName: 'Kaufman', gender: 'F', role: 'medical', passportNumber: 'USA3319283', roomPreference: 'double', roommateName: 'Donald Anthony Jr.' },
        { id: 'u7', firstName: 'Donald', lastName: 'Anthony Jr.', gender: 'M', role: 'delegate', passportNumber: 'USA2219284', roomPreference: 'double', roommateName: 'Sara Kaufman' }
      ]
    },
    singleRoomPricePerNight: 145,
    doubleRoomPricePerNight: 195,
    subtotalAmount: (3 * 145 * 4) + (2 * 195 * 4), // 1740 + 1560 = 3300
    cityTaxAmount: 84,
    totalAmount: 3384,
    currency: 'EUR',
    paymentMethod: 'stripe_card',
    paymentStatus: 'paid',
    stripeTransactionId: 'ch_3N84KlP0912Y0t88',
    hasShuttle: true,
    shuttle: {
      bookingId: 'GPS2027-US15',
      tripType: 'roundtrip',
      airport: 'TUN',
      arrivalAirline: 'Lufthansa',
      arrivalFlightNumber: 'LH1322',
      arrivalDateTime: '2027-01-14T15:10',
      departureAirline: 'Lufthansa',
      departureFlightNumber: 'LH1323',
      departureDateTime: '2027-01-18T12:40',
      passengerCount: 7,
      luggageCount: 14,
      weaponBagsCount: 6,
      driverWhatsApp: '+216 98 440 115',
      assignedGroupCode: 'SHT-TUN-GC-14JAN-15H',
      assignedVehicle: 'Minibus VIP Golden #3 (Capacité 15)',
      status: 'grouped'
    },
    status: 'confirmed',
    notes: 'Paiement Stripe validé. Facture officielle générée pour US Olympic & Paralympic Committee.'
  },

  {
    id: 'GPS2027-EG33',
    createdAt: '2026-10-22T11:00:00Z',
    type: 'group',
    hotelId: 'el-mouradi-gammarth',
    checkInDate: '2027-01-14',
    checkOutDate: '2027-01-18',
    nightsCount: 4,
    singleRoomCount: 2,
    doubleRoomCount: 3,
    totalGuestsCount: 8,
    federationGroup: {
      federationName: 'Egyptian Fencing Federation',
      country: 'Egypt',
      contactPersonName: 'Abdelmonem Elhusseiny',
      contactRole: 'Fédération President & FIE Board Member',
      contactEmail: 'egypt.fencing@eff-fencing.eg',
      contactPhone: '+20 100 223 9988',
      members: [
        { id: 'e1', firstName: 'Ziad', lastName: 'Elsissy', gender: 'M', role: 'athlete', passportNumber: 'EG991827', roomPreference: 'single' },
        { id: 'e2', firstName: 'Mohamed', lastName: 'Amer', gender: 'M', role: 'athlete', passportNumber: 'EG881928', roomPreference: 'double', roommateName: 'Adham Moataz' },
        { id: 'e3', firstName: 'Adham', lastName: 'Moataz', gender: 'M', role: 'athlete', passportNumber: 'EG771929', roomPreference: 'double', roommateName: 'Mohamed Amer' },
        { id: 'e4', firstName: 'Nada', lastName: 'Hafez', gender: 'F', role: 'athlete', passportNumber: 'EG661930', roomPreference: 'double', roommateName: 'Mariam El-Deeb' },
        { id: 'e5', firstName: 'Mariam', lastName: 'El-Deeb', gender: 'F', role: 'athlete', passportNumber: 'EG551931', roomPreference: 'double', roommateName: 'Nada Hafez' },
        { id: 'e6', firstName: 'Vincent', lastName: 'Boulay', gender: 'M', role: 'coach', passportNumber: 'EG441932', roomPreference: 'single' },
        { id: 'e7', firstName: 'Dr. Tarek', lastName: 'Hassan', gender: 'M', role: 'medical', passportNumber: 'EG331933', roomPreference: 'double', roommateName: 'Abdelmonem Elhusseiny' },
        { id: 'e8', firstName: 'Abdelmonem', lastName: 'Elhusseiny', gender: 'M', role: 'delegate', passportNumber: 'EG221934', roomPreference: 'double', roommateName: 'Dr. Tarek Hassan' }
      ]
    },
    singleRoomPricePerNight: 130,
    doubleRoomPricePerNight: 180,
    subtotalAmount: (2 * 130 * 4) + (3 * 180 * 4), // 1040 + 2160 = 3200
    cityTaxAmount: 96,
    totalAmount: 3296,
    currency: 'EUR',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    hasShuttle: true,
    shuttle: {
      bookingId: 'GPS2027-EG33',
      tripType: 'roundtrip',
      airport: 'TUN',
      arrivalAirline: 'EgyptAir',
      arrivalFlightNumber: 'MS843',
      arrivalDateTime: '2027-01-14T14:35',
      departureAirline: 'EgyptAir',
      departureFlightNumber: 'MS844',
      departureDateTime: '2027-01-18T15:40',
      passengerCount: 8,
      luggageCount: 14,
      weaponBagsCount: 5,
      driverWhatsApp: '+216 98 440 112',
      assignedGroupCode: 'SHT-TUN-ELM-14JAN-14H',
      assignedVehicle: 'Minibus Mercedes Sprinter #1 (Capacité 18)',
      status: 'grouped'
    },
    status: 'confirmed',
    notes: 'Vol arrivant à 14:35, regroupé dans la navette officielle El Mouradi avec l\'équipe de France.'
  },

  {
    id: 'GPS2027-DE04',
    createdAt: '2026-10-23T15:10:00Z',
    type: 'individual',
    hotelId: 'golden-carthage',
    checkInDate: '2027-01-14',
    checkOutDate: '2027-01-18',
    nightsCount: 4,
    singleRoomCount: 1,
    doubleRoomCount: 0,
    totalGuestsCount: 1,
    individualLead: {
      firstName: 'Matthias',
      lastName: 'Szabo',
      nationality: 'Germany',
      federation: 'Fédération Internationale d\'Escrime (FIE)',
      email: 'm.szabo@fie.ch',
      phone: '+49 171 889 0012',
      passportNumber: 'C4982109',
      role: 'referee'
    },
    singleRoomPricePerNight: 145,
    doubleRoomPricePerNight: 195,
    subtotalAmount: 145 * 4,
    cityTaxAmount: 12,
    totalAmount: 592,
    currency: 'EUR',
    paymentMethod: 'stripe_card',
    paymentStatus: 'paid',
    stripeTransactionId: 'ch_3N89MnK7129P0w55',
    hasShuttle: false, // will book later!
    status: 'confirmed',
    notes: 'Membre officiel du jury arbitral FIE. Chambre single executive avec bureau pour rapport technique.'
  }
];

export const INITIAL_SHUTTLE_GROUPS: ShuttleGroup[] = [
  {
    id: 'SHT-TUN-ELM-14JAN-14H',
    date: '2027-01-14',
    timeWindow: '14:00 - 14:50',
    airport: 'Aéroport Tunis-Carthage (TUN)',
    destinationHotel: 'Hôtel El Mouradi Gammarth',
    assignedVehicle: 'Bus Mercedes Tourismo #B1 (Capacité 30)',
    vehicleCapacity: 30,
    totalPassengers: 19,
    driverName: 'Mohamed Trabelsi',
    driverPhone: '+216 98 440 112',
    reservations: [
      { bookingCode: 'GPS2027-FR48', delegationOrName: 'Fédération Française d\'Escrime', passengers: 10, flightNumber: 'AF1184', airline: 'Air France', arrivalTime: '14:15' },
      { bookingCode: 'GPS2027-TN01', delegationOrName: 'Farès Ferjani (FTE Tunisie)', passengers: 1, flightNumber: 'TU721', airline: 'Tunisair', arrivalTime: '14:20' },
      { bookingCode: 'GPS2027-EG33', delegationOrName: 'Egyptian Fencing Federation', passengers: 8, flightNumber: 'MS843', airline: 'EgyptAir', arrivalTime: '14:35' }
    ]
  },
  {
    id: 'SHT-TUN-GC-14JAN-14H',
    date: '2027-01-14',
    timeWindow: '14:30 - 15:20',
    airport: 'Aéroport Tunis-Carthage (TUN)',
    destinationHotel: 'Hôtel Golden Carthage',
    assignedVehicle: 'Minibus VIP Golden #3 (Capacité 18)',
    vehicleCapacity: 18,
    totalPassengers: 15,
    driverName: 'Khaled Ben Amor',
    driverPhone: '+216 98 440 115',
    reservations: [
      { bookingCode: 'GPS2027-IT92', delegationOrName: 'Federazione Italiana Scherma', passengers: 8, flightNumber: 'AZ864', airline: 'ITA Airways', arrivalTime: '14:40' },
      { bookingCode: 'GPS2027-US15', delegationOrName: 'USA Fencing Association', passengers: 7, flightNumber: 'LH1322', airline: 'Lufthansa', arrivalTime: '15:10' }
    ]
  }
];

export const COUNTRIES_LIST = [
  { code: 'TN', nameFr: 'Tunisie', nameEn: 'Tunisia', flag: '🇹🇳' },
  { code: 'FR', nameFr: 'France', nameEn: 'France', flag: '🇫🇷' },
  { code: 'IT', nameFr: 'Italie', nameEn: 'Italy', flag: '🇮🇹' },
  { code: 'US', nameFr: 'États-Unis', nameEn: 'United States', flag: '🇺🇸' },
  { code: 'EG', nameFr: 'Égypte', nameEn: 'Egypt', flag: '🇪🇬' },
  { code: 'HU', nameFr: 'Hongrie', nameEn: 'Hungary', flag: '🇭🇺' },
  { code: 'KR', nameFr: 'Corée du Sud', nameEn: 'South Korea', flag: '🇰🇷' },
  { code: 'JP', nameFr: 'Japon', nameEn: 'Japan', flag: '🇯🇵' },
  { code: 'DE', nameFr: 'Allemagne', nameEn: 'Germany', flag: '🇩🇪' },
  { code: 'ES', nameFr: 'Espagne', nameEn: 'Spain', flag: '🇪🇸' },
  { code: 'GB', nameFr: 'Royaume-Uni', nameEn: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CN', nameFr: 'Chine', nameEn: 'China', flag: '🇨🇳' },
  { code: 'CA', nameFr: 'Canada', nameEn: 'Canada', flag: '🇨🇦' },
  { code: 'RO', nameFr: 'Roumanie', nameEn: 'Romania', flag: '🇷🇴' },
  { code: 'GE', nameFr: 'Géorgie', nameEn: 'Georgia', flag: '🇬🇪' },
  { code: 'DZ', nameFr: 'Algérie', nameEn: 'Algeria', flag: '🇩🇿' },
  { code: 'MA', nameFr: 'Maroc', nameEn: 'Morocco', flag: '🇲🇦' },
  { code: 'SA', nameFr: 'Arabie Saoudite', nameEn: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'TR', nameFr: 'Turquie', nameEn: 'Turkey', flag: '🇹🇷' },
  { code: 'PL', nameFr: 'Pologne', nameEn: 'Poland', flag: '🇵🇱' },
  { code: 'OTHER', nameFr: 'Autre Pays / FIE', nameEn: 'Other Nation / FIE', flag: '🌐' }
];

export const AIRPORTS = [
  {
    code: 'TUN',
    name: 'Aéroport International de Tunis-Carthage (TUN)',
    distanceToGammarthKm: 18,
    typicalTransferTimeMin: 20,
    groupSurchargeEur: 0,
    privateVanEur: 90,
    description: 'Inclus dans le pack officiel (0 € en navette groupée)'
  },
  {
    code: 'NBE',
    name: 'Aéroport International d\'Enfidha-Hammamet (NBE - 100 km)',
    distanceToGammarthKm: 100,
    typicalTransferTimeMin: 75,
    groupSurchargeEur: 35,
    privateVanEur: 160,
    description: 'Supplément transfert longue distance : +35 € / passager (ou 160 € en Van VIP privatif)'
  },
  {
    code: 'MIR',
    name: 'Aéroport International de Monastir Habib-Bourguiba (MIR - 165 km)',
    distanceToGammarthKm: 165,
    typicalTransferTimeMin: 120,
    groupSurchargeEur: 45,
    privateVanEur: 220,
    description: 'Supplément transfert longue distance : +45 € / passager (ou 220 € en Van VIP privatif)'
  }
];
