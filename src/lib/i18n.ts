import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcomeBack": "Welcome back.",
      "beginPulseid": "Begin your Pulseid.",
      "signInDescription": "Sign in to your dashboard, passport and QR key.",
      "createDescription": "Create a free account. Your data is encrypted and only ever yours.",
      "signIn": "Sign in",
      "createAccount": "Create account",
      "fullName": "Full name",
      "email": "Email",
      "password": "Password",
      "heroTitle1": "Your medical",
      "heroTitle2": "life, in one",
      "heroTitle3": "signal.",
      "heroSubtitle": "Pulseid weaves together a medical dashboard, an emergency passport, a revocable QR key, and AI guidance — built for Quebec patients and connected to Clic Santé, RVSQ and Bonjour-santé.",
      "enterPlatform": "Enter the platform",
      "dashboardTitle": "Hello",
      "healthOverview": "// Health overview",
      "activeMeds": "Active meds",
      "upcomingAppts": "Upcoming",
      "city": "City",
      "todaysMeds": "Today's medications",
      "allergiesConditions": "Allergies & conditions",
      "quickBook": "Quick book (Quebec)",
      "bookClicSante": "Book on Clic Santé",
      "aiAnalysisTitle": "AI analysis · live",
      "aiSummaryCommand": "Generate a weekly health summary from this profile.",
      "runAnalysis": "Run analysis",
      "openPassport": "Open passport",
      "openQr": "Open QR page",
      "medicalKey": "medical key",
      "active": "Active",
      "download": "Download",
      "rotate": "Rotate",
      "waitlistButton": "Join Waitlist",
      "supportButton": "Support the Cause"
    }
  },
  fr: {
    translation: {
      "welcomeBack": "De retour.",
      "beginPulseid": "Commencez votre Pulseid.",
      "signInDescription": "Connectez-vous à votre tableau de bord, votre passeport et votre clé QR.",
      "createDescription": "Créez un compte gratuit. Vos données sont chiffrées et vous appartiennent.",
      "signIn": "Se connecter",
      "createAccount": "Créer un compte",
      "fullName": "Nom complet",
      "email": "Courriel",
      "password": "Mot de passe",
      "heroTitle1": "Votre vie médicale,",
      "heroTitle2": "dans un seul",
      "heroTitle3": "signal.",
      "heroSubtitle": "Pulseid regroupe un tableau de bord médical, un passeport d'urgence, une clé QR révocable et des conseils par IA — conçus pour les patients québécois et connectés à Clic Santé, RVSQ et Bonjour-santé.",
      "enterPlatform": "Entrer sur la plateforme",
      "dashboardTitle": "Bonjour",
      "healthOverview": "// Aperçu santé",
      "activeMeds": "Médicaments actifs",
      "upcomingAppts": "Rendez-vous à venir",
      "city": "Ville",
      "todaysMeds": "Médicaments d'aujourd'hui",
      "allergiesConditions": "Allergies et conditions",
      "quickBook": "Réservation rapide (Québec)",
      "bookClicSante": "Réserver sur Clic Santé",
      "aiAnalysisTitle": "Analyse IA · en direct",
      "aiSummaryCommand": "Générer un résumé de santé hebdomadaire de ce profil.",
      "runAnalysis": "Lancer l'analyse",
      "openPassport": "Ouvrir le passeport",
      "openQr": "Ouvrir la page QR",
      "medicalKey": "clé médicale",
      "active": "Actif",
      "download": "Télécharger",
      "rotate": "Pivoter",
      "waitlistButton": "Rejoindre la liste",
      "supportButton": "Soutenir la cause"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
