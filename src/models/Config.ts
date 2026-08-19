import mongoose, { Schema } from 'mongoose';

export interface IConfig {
  trustName: string;
  tagline: string;
  logoUrl?: string;
  surveyLink?: string;
  surveyEnabled: boolean;
  phone: string;
  email: string;
  address: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  whatsappNumber?: string;
  whatsappChannelUrl?: string;
  mapLat: number;
  mapLng: number;
  privacyPolicy?: string;
  termsConditions?: string;
  // Hero section
  heroImageUrl?: string;
  heroHeading?: string;
  heroSubtitle?: string;
  heroOverlayTitle?: string;
  heroOverlaySubtitle?: string;
  // Welcome/About home section
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  welcomeImage1Url?: string;
  welcomeImage2Url?: string;
  welcomeImage3Url?: string;
  welcomePromise?: string;
  // Services section (What We Do)
  service1Icon?: string;
  service1Title?: string;
  service1Desc?: string;
  service2Icon?: string;
  service2Title?: string;
  service2Desc?: string;
  service3Icon?: string;
  service3Title?: string;
  service3Desc?: string;
  service4Icon?: string;
  service4Title?: string;
  service4Desc?: string;
  // Stats bar
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
  stat4Value?: string;
  stat4Label?: string;
  // About page
  aboutImageUrl?: string;
  visionText?: string;
  missionText?: string;
  aboutPara1?: string;
  aboutPara2?: string;
  // Bank details
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankIFSC?: string;
  bankBranch?: string;
  // Donation presets
  donationAmounts?: number[];
  // Volunteer skills
  volunteerSkills?: string[];
  // Donors section label
  donorsLabel?: string;
  // Hero Carousel — Slide 2 editable text
  slide2Badge?: string;
  slide2Heading?: string;
  slide2Subtitle?: string;
  slide2Caption?: string;
  slide2CaptionSub?: string;
  slide2PrimaryLabel?: string;
  slide2PrimaryTo?: string;
  slide2SecondaryLabel?: string;
  slide2SecondaryTo?: string;
  // Hero Carousel — Slide 3 editable text
  slide3Badge?: string;
  slide3Heading?: string;
  slide3Subtitle?: string;
  slide3Caption?: string;
  slide3CaptionSub?: string;
  slide3PrimaryLabel?: string;
  slide3PrimaryTo?: string;
  slide3SecondaryLabel?: string;
  slide3SecondaryTo?: string;
  // Homepage section visibility toggles
  sectionServicesEnabled?: boolean;
  sectionCausesEnabled?: boolean;
  sectionStatsEnabled?: boolean;
  sectionFeaturedEnabled?: boolean;
  sectionEventsEnabled?: boolean;
  sectionVolunteerEnabled?: boolean;
  sectionTestimonialsEnabled?: boolean;
  sectionDonorsEnabled?: boolean;
  // App languages
  appLanguages?: { code: string; name: string }[];
  // YouTube videos
  youtubeApiKey?: string;
  youtubeChannelId?: string;
  youtubeVideoUrls?: string[];
  // Meta social feed
  socialFeedEnabled?: boolean;
  facebookPageId?: string;
  instagramBusinessAccountId?: string;
  metaPageAccessToken?: string;
  // Donation payment
  qrCodeUrl?: string;
  onlineDonationUrl?: string;
}

const configSchema = new Schema<IConfig>({
  trustName: { type: String, default: 'ABHINA Charitable Trust' },
  tagline: { type: String, default: 'gives hope' },
  logoUrl: { type: String, default: '' },
  surveyLink: { type: String, default: '' },
  surveyEnabled: { type: Boolean, default: false },
  phone: { type: String, default: '+91 83 415 01 569' },
  email: { type: String, default: 'support@abhina.net' },
  address: { type: String, default: '#308, Raghavendra Complex, Habsiguda Cross Road, Habsiguda, Hyderabad – 500007, Telangana, India' },
  youtubeUrl: { type: String, default: 'https://www.youtube.com/@abhinacharitabletrust' },
  facebookUrl: { type: String, default: 'https://www.facebook.com/abhinatrust' },
  instagramUrl: { type: String, default: '' },
  twitterUrl: { type: String, default: '' },
  whatsappNumber: { type: String, default: '' },
  whatsappChannelUrl: { type: String, default: '' },
  mapLat: { type: Number, default: 17.4065 },
  mapLng: { type: Number, default: 78.5505 },
  privacyPolicy: { type: String, default: '' },
  termsConditions: { type: String, default: '' },
  heroImageUrl: { type: String, default: '' },
  heroHeading: { type: String, default: 'We help all people in need around India' },
  heroSubtitle: { type: String, default: 'Healthcare, education, water and food — delivered with dignity to those who need it most.' },
  heroOverlayTitle: { type: String, default: 'Tailoring Centre, Hyderabad' },
  heroOverlaySubtitle: { type: String, default: 'Livelihood support training center for rural women.' },
  welcomeTitle: { type: String, default: 'Welcome to ABHINA' },
  welcomeSubtitle: { type: String, default: 'Help is Our Main Goal' },
  welcomeImage1Url: { type: String, default: '' },
  welcomeImage2Url: { type: String, default: '' },
  welcomeImage3Url: { type: String, default: '' },
  welcomePromise: { type: String, default: 'Every contribution reaches the ground, with full transparency.' },
  service1Icon: { type: String, default: 'medication' },
  service1Title: { type: String, default: 'Medicine Help' },
  service1Desc: { type: String, default: 'Essential medicines and medical aid for those who cannot afford treatment.' },
  service2Icon: { type: String, default: 'construction' },
  service2Title: { type: String, default: 'We Build & Create' },
  service2Desc: { type: String, default: 'Building shelters, sanitation and the infrastructure communities need.' },
  service3Icon: { type: String, default: 'water_drop' },
  service3Title: { type: String, default: 'Water Delivery' },
  service3Desc: { type: String, default: 'Safe drinking water delivered to communities facing scarcity.' },
  service4Icon: { type: String, default: 'favorite' },
  service4Title: { type: String, default: 'We Care' },
  service4Desc: { type: String, default: 'Compassionate support for the elderly, children and the vulnerable.' },
  stat1Value: { type: String, default: '20K+' },
  stat1Label: { type: String, default: 'People Helped' },
  stat2Value: { type: String, default: '₹10L+' },
  stat2Label: { type: String, default: 'Funds Collected' },
  stat3Value: { type: String, default: '16' },
  stat3Label: { type: String, default: 'Departments' },
  stat4Value: { type: String, default: '2,018' },
  stat4Label: { type: String, default: 'Serving Since' },
  aboutImageUrl: { type: String, default: '' },
  visionText: { type: String, default: 'We envision an inclusive society where every individual has access to dignified livelihoods, clean habitats, health facilities, education, and legal protection.' },
  missionText: { type: String, default: 'Make charitable giving a part of everyone\'s life.' },
  aboutPara1: { type: String, default: 'ABHINA Charitable Trust was founded in 2018 with a simple belief — that charitable giving should be a part of everyone\'s life. We connect contributors, volunteers and beneficiaries across India, delivering help where it is needed most.' },
  aboutPara2: { type: String, default: 'Through 16 dedicated departments — from healthcare and education to water, environment and disaster relief — we bring hope to thousands of families every year.' },
  bankAccountName: { type: String, default: 'ABHINA Charitable Trust' },
  bankAccountNumber: { type: String, default: '921020045622119' },
  bankName: { type: String, default: 'Axis Bank Ltd' },
  bankIFSC: { type: String, default: 'UTIB0000108' },
  bankBranch: { type: String, default: 'Madhapur, Hyderabad' },
  donationAmounts: { type: [Number], default: [500, 1000, 2500, 5000] },
  donorsLabel: { type: String, default: 'Proudly supported by' },
  slide2Badge: { type: String, default: 'Education & Empowerment' },
  slide2Heading: { type: String, default: 'Educating the next generation' },
  slide2Subtitle: { type: String, default: 'Scholarships, tuition and skills training that open doors for children and women across India.' },
  slide2Caption: { type: String, default: 'Education & Empowerment' },
  slide2CaptionSub: { type: String, default: 'Educating the next generation' },
  slide2PrimaryLabel: { type: String, default: 'Support Education' },
  slide2PrimaryTo: { type: String, default: '/donate' },
  slide2SecondaryLabel: { type: String, default: 'Our Programs' },
  slide2SecondaryTo: { type: String, default: '/our-work' },
  slide3Badge: { type: String, default: 'Water & Sanitation' },
  slide3Heading: { type: String, default: 'Clean water for every village' },
  slide3Subtitle: { type: String, default: 'Safe drinking water and sanitation delivered to communities facing scarcity and hardship.' },
  slide3Caption: { type: String, default: 'Water & Sanitation' },
  slide3CaptionSub: { type: String, default: 'Clean water for every village' },
  slide3PrimaryLabel: { type: String, default: 'Fund Clean Water' },
  slide3PrimaryTo: { type: String, default: '/donate' },
  slide3SecondaryLabel: { type: String, default: 'See Our Work' },
  slide3SecondaryTo: { type: String, default: '/our-work' },
  sectionServicesEnabled: { type: Boolean, default: true },
  sectionCausesEnabled: { type: Boolean, default: true },
  sectionStatsEnabled: { type: Boolean, default: true },
  sectionFeaturedEnabled: { type: Boolean, default: true },
  sectionEventsEnabled: { type: Boolean, default: true },
  sectionVolunteerEnabled: { type: Boolean, default: true },
  sectionTestimonialsEnabled: { type: Boolean, default: true },
  sectionDonorsEnabled: { type: Boolean, default: true },
  youtubeApiKey: { type: String, default: '' },
  youtubeChannelId: { type: String, default: '' },
  youtubeVideoUrls: { type: [String], default: [] },
  socialFeedEnabled: { type: Boolean, default: false },
  facebookPageId: { type: String, default: '' },
  instagramBusinessAccountId: { type: String, default: '' },
  metaPageAccessToken: { type: String, default: '' },
  qrCodeUrl: { type: String, default: '' },
  onlineDonationUrl: { type: String, default: '' },
  appLanguages: { type: [{ code: String, name: String, _id: false }], default: [
    { code: 'te', name: 'Telugu (తెలుగు)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
    { code: 'ml', name: 'Malayalam (മലയാളം)' },
  ]},
  volunteerSkills: { type: [String], default: [
    'Legal Aid & Consulting',
    'Medical Camp Support & Nursing',
    'Sanitation & Cleansing Drives',
    'Tailoring Instruction & Vocational Skills',
    'Youth Sports Coordination',
    'Water System Maintenance',
    'General Field Labor / Logistics',
    'Social Media & Documentation'
  ]}
});

export default mongoose.model<IConfig>('Config', configSchema);
