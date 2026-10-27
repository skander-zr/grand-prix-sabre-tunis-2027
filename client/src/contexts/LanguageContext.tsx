import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types/gp';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Header & Brand
    'app.headerTitle': 'GRAND PRIX SABRE TUNIS 2027 - Official Accommodation & Transfer Platform',
    'app.subtitle': 'Plateforme Officielle d\'Hébergement & Transport • Fédération Tunisienne d\'Escrime & FIE',
    'nav.hotels': 'Hôtels Officiels',
    'nav.booking': 'Réserver',
    'nav.shuttle': 'Navette Aéroport',
    'nav.myBookings': 'Mes Réservations',
    'nav.admin': 'Super Admin',
    'event.dates': '15 - 17 Janvier 2027',
    'event.location': 'Tunis, Tunisie • Salle Omnisports de Radès',
    'event.countdown.days': 'Jours',
    'event.countdown.hours': 'Heures',
    'event.countdown.mins': 'Min',
    'event.countdown.secs': 'Sec',
    'hero.badge': 'FIE GRAND PRIX SABRE 2026/27 • SÉRIE MONDIALE',
    'hero.cta.book': 'Réserver un Hôtel',
    'hero.cta.shuttle': 'Réserver ma Navette',
    'hero.cta.manage': 'Accéder à mes Réservations',

    // Hotels Section
    'hotels.title': 'Les 2 Hôtels Officiels de la Compétition',
    'hotels.subtitle': 'Hébergements 5 étoiles haut de gamme sélectionnés par la FIE et la FTE, avec navettes régulières directes vers la salle de compétition.',
    'hotels.distanceLabel': 'Distance de la Salle de Compétition',
    'hotels.shuttleFreq': 'Navette toutes les 20 minutes',
    'hotels.viewMap': 'Voir sur Google Maps',
    'hotels.amenitiesTitle': 'Équipements & Services Délégations',
    'hotels.pricingTitle': 'Tarifs Officiels Négociés par Nuit',
    'hotels.singleRoom': 'Chambre Single',
    'hotels.doubleRoom': 'Chambre Double / Twin',
    'hotels.night': '/ nuit',
    'hotels.selectBtn': 'Choisir cet Hôtel',
    'hotels.photosBtn': 'Galerie Photos',
    'hotels.stockRemaining': 'chambres disponibles',

    // Booking Module
    'booking.title': 'Module de Réservation Hôtelière',
    'booking.subtitle': 'Réservez votre séjour aux tarifs préférentiels officiels FIE. Disponibilité en temps réel pour El Mouradi Gammarth et Golden Carthage.',
    'booking.datesLabel': 'Dates de Séjour (Arrivée / Départ)',
    'booking.checkIn': 'Date d\'Arrivée',
    'booking.checkOut': 'Date de Départ',
    'booking.nights': 'Nuit(s)',
    'booking.type.individual': 'A) Réservation Individuelle (Athlète / Officiel)',
    'booking.type.group': 'B) Réservation Groupe / Fédération',
    'booking.roomsConfig': 'Choix & Quantité des Chambres',
    'booking.singleQty': 'Chambres Single (1 personne)',
    'booking.doubleQty': 'Chambres Double / Twin (2 personnes)',
    'booking.leadInfo': 'Coordonnées de l\'Athlète / Officiel',
    'booking.firstName': 'Prénom',
    'booking.lastName': 'Nom',
    'booking.nationality': 'Nationalité',
    'booking.federation': 'Fédération Nationale / Club (Optionnel)',
    'booking.email': 'Email de Contact',
    'booking.phone': 'Téléphone / Mobile',
    'booking.passport': 'Numéro de Passeport',
    'booking.role': 'Fonction / Rôle',
    'booking.role.athlete': 'Athlète',
    'booking.role.coach': 'Entraîneur / Coach',
    'booking.role.referee': 'Arbitre FIE',
    'booking.role.medical': 'Staff Médical / Kiné',
    'booking.role.delegate': 'Chef de Délégation',
    'booking.role.guest': 'Accompagnateur / Invité',

    // Group / Federation Booking
    'group.fedName': 'Nom Officiel de la Fédération / Équipe',
    'group.country': 'Pays Représenté',
    'group.contactPerson': 'Personne de Contact (Chef de Délégation)',
    'group.contactRole': 'Fonction du Contact',
    'group.contactEmail': 'Email du Contact',
    'group.contactPhone': 'Téléphone WhatsApp du Contact',
    'group.rosterTitle': 'Composition de la Délégation (Membres)',
    'group.rosterDesc': 'Ajoutez chaque membre de votre délégation. Le système calcule automatiquement le nombre exact de chambres Single et Double requises.',
    'group.addMember': '+ Ajouter un Membre de la Délégation',
    'group.colName': 'Nom & Prénom',
    'group.colGender': 'Genre',
    'group.colRole': 'Rôle',
    'group.colPassport': 'N° Passeport',
    'group.colRoom': 'Chambre Souhaitée',
    'group.colRoommate': 'Partage avec (Colocataire si Double)',
    'group.calcSummary': 'Calcul Automatique des Chambres du Groupe',
    'group.calcText': 'Total membres :',
    'group.autoSingle': 'Chambre(s) Single requise(s) :',
    'group.autoDouble': 'Chambre(s) Double requise(s) :',
    'group.singleInvoiceNote': 'Un seul paiement et une seule facture officielle seront émis pour l\'ensemble du groupe.',

    // Payment Section
    'payment.title': 'Modalités de Paiement & Facturation',
    'payment.method.stripe': 'Carte Bancaire Internationale (Stripe Sécurisé)',
    'payment.method.bank': 'Virement Bancaire Officiel (Fédération Tunisienne d\'Escrime)',
    'payment.method.onsite': 'Paiement sur Place (Accréditation FIE à Gammarth)',
    'payment.stripeDesc': 'Paiement immédiat par Visa, Mastercard, American Express via plateforme cryptée 3D Secure.',
    'payment.bankDesc': 'Ordre de virement officiel avec RIB/IBAN Banque Nationale Agricole (BNA Tunis) fourni avec la confirmation.',
    'payment.onsiteDesc': 'Réservé aux délégations officielles munies d\'un ordre de mission ou garantie fédérale.',
    'payment.summary': 'Récapitulatif Financier',
    'payment.subtotal': 'Sous-total Hébergement',
    'payment.cityTax': 'Taxe de Séjour & Frais FIE',
    'payment.total': 'Total à Payer',
    'payment.confirmBtn': 'Confirmer la Réservation & Procéder au Paiement',
    'payment.successTitle': 'Réservation Validée avec Succès !',
    'payment.bookingCode': 'Votre Code de Réservation Unique :',
    'payment.codeNotice': 'Conservez ce code. Il est indispensable pour réserver votre navette aéroport et accéder à votre espace.',
    'payment.goToShuttle': 'Réserver la Navette Aéroport Maintenant →',
    'payment.viewVoucher': 'Voir et Télécharger le Voucher Officiel',

    // Shuttle Module
    'shuttle.title': 'Module de Réservation Navette Aéroport - Hôtel',
    'shuttle.subtitle': 'Ce service officiel est exclusivement réservé aux participants ayant une réservation hôtelière confirmée.',
    'shuttle.enterCode': 'Saisissez votre code de réservation (ex: GPS2027-FR48)',
    'shuttle.verifyCode': 'Vérifier mon Code',
    'shuttle.codeValid': 'Réservation vérifiée ! Hôtel :',
    'shuttle.codeInvalid': 'Code de réservation introuvable. Veuillez vérifier votre référence (format: GPS2027-XXXX).',
    'shuttle.tripType': 'Type de Trajet',
    'shuttle.trip.arrival': 'Arrivée (Aéroport → Hôtel)',
    'shuttle.trip.departure': 'Départ (Hôtel → Aéroport)',
    'shuttle.trip.roundtrip': 'Aller-Retour (Aéroport ⇄ Hôtel)',
    'shuttle.airport': 'Aéroport d\'Atterrissage / Décollage',
    'shuttle.flightNo': 'Numéro de Vol',
    'shuttle.airline': 'Compagnie Aérienne',
    'shuttle.dateTime': 'Date et Heure d\'Arrivée / Départ',
    'shuttle.passengers': 'Nombre de Passagers',
    'shuttle.luggage': 'Nombre de Valises Standards',
    'shuttle.weaponBags': 'Nombre de Sacs d\'Escrime / Housses de Sabre',
    'shuttle.whatsapp': 'Numéro WhatsApp pour le Chauffeur (avec indicatif)',
    'shuttle.notes': 'Remarques & Besoins Particuliers (ex: grand sac d\'armes, fauteuil roulant)',
    'shuttle.confirmBtn': 'Enregistrer & Optimiser ma Navette',
    'shuttle.optimizationBadge': 'Regroupement Intelligent Actif',
    'shuttle.optimizationDesc': 'Le système analyse les vols des délégations arrivant dans la même tranche horaire de 45 minutes pour mutualiser les navettes et vous garantir un départ immédiat avec un véhicule adapté.',

    // Client Portal
    'client.title': 'Espace Client • Mes Réservations',
    'client.subtitle': 'Consultez vos réservations d\'hôtel et de navettes, mettez à jour vos horaires de vol et téléchargez votre voucher officiel avec QR Code.',
    'client.searchPlaceholder': 'Code de Réservation (ex: GPS2027-FR48)',
    'client.searchBtn': 'Rechercher',
    'client.editFlight': 'Modifier mes infos de vol',
    'client.downloadVoucher': 'Télécharger Voucher / Confirmation PDF',
    'client.shuttleStatus': 'Statut de la Navette :',
    'client.driverContact': 'Contact Chauffeur Coordinateur :',
    'client.flightUpdated': 'Informations de vol mises à jour avec succès !',

    // Super Admin Dashboard
    'admin.title': 'Espace Super Admin • Comité d\'Organisation FIE/FTE',
    'admin.kpi.bookings': 'Total Réservations',
    'admin.kpi.guests': 'Athlètes & Officiels',
    'admin.kpi.single': 'Chambres Single',
    'admin.kpi.double': 'Chambres Double',
    'admin.kpi.revenue': 'Chiffre d\'Affaires Hébergement',
    'admin.tab.reservations': 'Toutes les Réservations',
    'admin.tab.shuttles': 'Dispatch Navettes & Arrivées Aéroport',
    'admin.tab.prices': 'Gestion des Tarifs & Quotas',
    'admin.tab.export': 'Export Excel & Emails Automatiques',
    'admin.occupancy': 'Taux d\'Occupation par Hôtel',
    'admin.exportCsv': 'Exporter en Fichier Excel / CSV',
    'admin.filterHotel': 'Tous les Hôtels',
    'admin.filterStatus': 'Tous les Statuts',
    'admin.search': 'Rechercher par code, nom, délégation...',
    'admin.savePrices': 'Enregistrer les Nouveaux Tarifs',
    'admin.blockRooms': 'Bloquer des Chambres (Quotas FIE / Arbitres)',
    'admin.sendEmail': 'Simuler Envoi Email Confirmation',
    'admin.sendReminder': 'Envoyer Rappel 48h Avant Compétition',

    // Common
    'btn.close': 'Fermer',
    'btn.save': 'Enregistrer',
    'btn.cancel': 'Annuler',
    'btn.print': 'Imprimer / Sauvegarder en PDF',
    'status.confirmed': 'Confirmée',
    'status.paid': 'Payée',
    'status.pending': 'En attente',
    'status.grouped': 'Navette Regroupée',
    'status.assigned': 'Véhicule Assigné'
  },

  en: {
    // Header & Brand
    'app.headerTitle': 'GRAND PRIX SABRE TUNIS 2027 - Official Accommodation & Transfer Platform',
    'app.subtitle': 'Official Accommodation & Transfer Platform • Tunisian Fencing Federation & FIE',
    'nav.hotels': 'Official Hotels',
    'nav.booking': 'Book Now',
    'nav.shuttle': 'Airport Transfer',
    'nav.myBookings': 'My Bookings',
    'nav.admin': 'Super Admin',
    'event.dates': '15 - 17 January 2027',
    'event.location': 'Tunis, Tunisia • Rades Sports Arena',
    'event.countdown.days': 'Days',
    'event.countdown.hours': 'Hours',
    'event.countdown.mins': 'Mins',
    'event.countdown.secs': 'Secs',
    'hero.badge': 'FIE SABRE GRAND PRIX 2026/27 • WORLD SERIES',
    'hero.cta.book': 'Book Official Hotel',
    'hero.cta.shuttle': 'Book Airport Shuttle',
    'hero.cta.manage': 'Access My Bookings',

    // Hotels Section
    'hotels.title': 'The 2 Official Competition Hotels',
    'hotels.subtitle': 'Exclusive 5-star luxury accommodations designated by FIE & FTE with frequent direct shuttles to the tournament arena.',
    'hotels.distanceLabel': 'Distance to Competition Hall',
    'hotels.shuttleFreq': 'Shuttle every 20 minutes',
    'hotels.viewMap': 'View on Google Maps',
    'hotels.amenitiesTitle': 'Delegation Amenities & Services',
    'hotels.pricingTitle': 'Official Negotiated Rates per Night',
    'hotels.singleRoom': 'Single Room',
    'hotels.doubleRoom': 'Double / Twin Room',
    'hotels.night': '/ night',
    'hotels.selectBtn': 'Select this Hotel',
    'hotels.photosBtn': 'Photo Gallery',
    'hotels.stockRemaining': 'rooms available',

    // Booking Module
    'booking.title': 'Hotel Reservation Module',
    'booking.subtitle': 'Secure your stay at official preferential FIE rates. Real-time availability for El Mouradi Gammarth and Golden Carthage.',
    'booking.datesLabel': 'Stay Dates (Check-in / Check-out)',
    'booking.checkIn': 'Check-in Date',
    'booking.checkOut': 'Check-out Date',
    'booking.nights': 'Night(s)',
    'booking.type.individual': 'A) Individual Reservation (Athlete / Official)',
    'booking.type.group': 'B) Federation / Group Reservation',
    'booking.roomsConfig': 'Room Selection & Quantities',
    'booking.singleQty': 'Single Rooms (1 person)',
    'booking.doubleQty': 'Double / Twin Rooms (2 persons)',
    'booking.leadInfo': 'Athlete / Official Contact Details',
    'booking.firstName': 'First Name',
    'booking.lastName': 'Last Name',
    'booking.nationality': 'Nationality',
    'booking.federation': 'National Federation / Club (Optional)',
    'booking.email': 'Contact Email',
    'booking.phone': 'Phone / Mobile',
    'booking.passport': 'Passport Number',
    'booking.role': 'Function / Role',
    'booking.role.athlete': 'Athlete',
    'booking.role.coach': 'Coach / Trainer',
    'booking.role.referee': 'FIE Referee',
    'booking.role.medical': 'Medical Staff / Physio',
    'booking.role.delegate': 'Team Leader / Delegate',
    'booking.role.guest': 'Accompanying / Guest',

    // Group / Federation Booking
    'group.fedName': 'Official Federation / Team Name',
    'group.country': 'Country Represented',
    'group.contactPerson': 'Contact Person (Head of Delegation)',
    'group.contactRole': 'Contact Role',
    'group.contactEmail': 'Contact Email',
    'group.contactPhone': 'WhatsApp Phone Number',
    'group.rosterTitle': 'Delegation Roster (Members)',
    'group.rosterDesc': 'Add all members of your delegation. The platform automatically computes the exact Single and Double rooms required.',
    'group.addMember': '+ Add Delegation Member',
    'group.colName': 'Full Name',
    'group.colGender': 'Gender',
    'group.colRole': 'Role',
    'group.colPassport': 'Passport No.',
    'group.colRoom': 'Room Type',
    'group.colRoommate': 'Roommate (if Double)',
    'group.calcSummary': 'Automatic Room Calculation for Delegation',
    'group.calcText': 'Total members:',
    'group.autoSingle': 'Single Room(s) Required:',
    'group.autoDouble': 'Double Room(s) Required:',
    'group.singleInvoiceNote': 'A single unified invoice and payment receipt will be generated for the whole group.',

    // Payment Section
    'payment.title': 'Payment Terms & Billing',
    'payment.method.stripe': 'International Credit Card (Secure Stripe)',
    'payment.method.bank': 'Official Bank Transfer (Tunisian Fencing Federation)',
    'payment.method.onsite': 'On-site Payment (FIE Accreditation Desk in Gammarth)',
    'payment.stripeDesc': 'Instant payment via Visa, Mastercard, American Express with 3D Secure encrypted protection.',
    'payment.bankDesc': 'Official bank transfer order with BNA Tunis IBAN/SWIFT provided upon confirmation.',
    'payment.onsiteDesc': 'Restricted to official delegations presenting federation mission order or bank guarantee.',
    'payment.summary': 'Financial Breakdown',
    'payment.subtotal': 'Accommodation Subtotal',
    'payment.cityTax': 'City Tax & FIE Service Fee',
    'payment.total': 'Total to Pay',
    'payment.confirmBtn': 'Confirm Booking & Proceed to Payment',
    'payment.successTitle': 'Reservation Successfully Confirmed!',
    'payment.bookingCode': 'Your Unique Booking Code:',
    'payment.codeNotice': 'Keep this reference safely. It is required to book your airport transfer and access your bookings portal.',
    'payment.goToShuttle': 'Book Airport Shuttle Now →',
    'payment.viewVoucher': 'View and Download Official Voucher',

    // Shuttle Module
    'shuttle.title': 'Airport Shuttle Booking Module (Airport - Hotel)',
    'shuttle.subtitle': 'This official service is strictly reserved for participants with a confirmed hotel reservation.',
    'shuttle.enterCode': 'Enter your booking code (e.g., GPS2027-FR48)',
    'shuttle.verifyCode': 'Verify My Code',
    'shuttle.codeValid': 'Reservation verified! Hotel:',
    'shuttle.codeInvalid': 'Booking reference not found. Please verify your code format (GPS2027-XXXX).',
    'shuttle.tripType': 'Trip Type',
    'shuttle.trip.arrival': 'Arrival (Airport → Hotel)',
    'shuttle.trip.departure': 'Departure (Hotel → Airport)',
    'shuttle.trip.roundtrip': 'Round-Trip (Airport ⇄ Hotel)',
    'shuttle.airport': 'Arrival / Departure Airport',
    'shuttle.flightNo': 'Flight Number',
    'shuttle.airline': 'Airline Company',
    'shuttle.dateTime': 'Arrival / Departure Date & Time',
    'shuttle.passengers': 'Passenger Count',
    'shuttle.luggage': 'Standard Luggage Count',
    'shuttle.weaponBags': 'Fencing Rollbags / Sabre Bag Count',
    'shuttle.whatsapp': 'WhatsApp Contact for Driver (with country code)',
    'shuttle.notes': 'Special Requests (e.g. oversize weapon bag, wheelchair)',
    'shuttle.confirmBtn': 'Save & Optimize Shuttle',
    'shuttle.optimizationBadge': 'Smart Grouping Active',
    'shuttle.optimizationDesc': 'The system groups arrivals landing within the same 45-minute window for the same hotel to minimize waiting time and optimize coaches.',

    // Client Portal
    'client.title': 'Client Portal • My Bookings',
    'client.subtitle': 'Review your hotel and transfer arrangements, edit flight details, and download your official QR-coded confirmation voucher.',
    'client.searchPlaceholder': 'Booking Code (e.g. GPS2027-FR48)',
    'client.searchBtn': 'Search',
    'client.editFlight': 'Edit Flight Details',
    'client.downloadVoucher': 'Download Official Voucher / PDF',
    'client.shuttleStatus': 'Shuttle Status:',
    'client.driverContact': 'Coordinator Driver Contact:',
    'client.flightUpdated': 'Flight details successfully updated!',

    // Super Admin Dashboard
    'admin.title': 'Super Admin • FIE / FTE Organizing Committee',
    'admin.kpi.bookings': 'Total Bookings',
    'admin.kpi.guests': 'Athletes & Officials',
    'admin.kpi.single': 'Single Rooms',
    'admin.kpi.double': 'Double Rooms',
    'admin.kpi.revenue': 'Accommodation Revenue',
    'admin.tab.reservations': 'All Reservations',
    'admin.tab.shuttles': 'Airport Arrivals & Shuttle Dispatch',
    'admin.tab.prices': 'Rates & Inventory Management',
    'admin.tab.export': 'Excel Export & Automated Emails',
    'admin.occupancy': 'Hotel Occupancy Rates',
    'admin.exportCsv': 'Export to Excel / CSV',
    'admin.filterHotel': 'All Hotels',
    'admin.filterStatus': 'All Statuses',
    'admin.search': 'Search by code, name, delegation...',
    'admin.savePrices': 'Save Updated Rates',
    'admin.blockRooms': 'Block Room Quotas (FIE Referees / VIPs)',
    'admin.sendEmail': 'Simulate Confirmation Email',
    'admin.sendReminder': 'Send 48h Pre-Event Reminder',

    // Common
    'btn.close': 'Close',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.print': 'Print / Save as PDF',
    'status.confirmed': 'Confirmed',
    'status.paid': 'Paid',
    'status.pending': 'Pending',
    'status.grouped': 'Grouped Shuttle',
    'status.assigned': 'Vehicle Assigned'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('gps2027_lang');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('gps2027_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['fr']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
