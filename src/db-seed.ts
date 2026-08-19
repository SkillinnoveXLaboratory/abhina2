import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  Department,
  Project,
  Event,
  Testimonial,
  Team,
  Donor,
  ImpactStory,
  Config,
  Theme,
  Translation
} from './models';
import Admin from './models/Admin';
import AnnualReport from './models/AnnualReport';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not specified in env variables.");
  process.exit(1);
}

const defaultDepartments = [
  {
    _id: "d1",
    slug: "housing-healthcare-family-welfare",
    name: "Housing, Healthcare, Nutrition, Livelihood and Family Welfare",
    shortName: "Healthcare & Family Welfare",
    icon: "health_and_safety",
    summary: "Shelter, primary healthcare, nutrition and livelihood support for vulnerable families across India.",
    content: "We work to ensure that every family has access to safe housing, essential healthcare, balanced nutrition and a stable livelihood. Through medical camps, ration drives and family-welfare counselling we reach communities that the formal system often misses."
  },
  {
    _id: "d2",
    slug: "water-sanitation-hygiene",
    name: "Drinking Water, Sanitation and Cleanliness",
    shortName: "Water & Sanitation",
    icon: "water_drop",
    summary: "Ensuring clean drinking water, building toilets and promoting community hygiene.",
    content: "Clean water and sanitation are basic rights. Our projects install community filtration systems, rebuild public toilets, and educate youth on safety and hygiene. Our rural-development work also supports community ownership of water sources so that the impact lasts well beyond our visit."
  },
  {
    _id: "d3",
    slug: "labor-employment",
    name: "Labor and Employment",
    shortName: "Labor & Employment",
    icon: "work",
    summary: "Connecting workers to fair, dignified employment and protecting labour rights.",
    content: "We help workers find dignified employment, understand their rights, and access social-security benefits. Through job fairs, awareness drives and placement support we reduce exploitation and improve livelihoods."
  },
  {
    _id: "d4",
    slug: "law-justice",
    name: "Law and Justice",
    shortName: "Law & Justice",
    icon: "gavel",
    summary: "Free legal aid and awareness so that justice is accessible to all.",
    content: "Access to justice should not depend on the ability to pay. We provide free legal aid, paralegal support and rights-awareness programmes to help people navigate the legal system with confidence."
  },
  {
    _id: "d5",
    slug: "women-child-development",
    name: "Women and Child Development",
    shortName: "Women & Child",
    icon: "pregnant_woman",
    summary: "Empowering women and nurturing children through education, health and skills.",
    content: "We invest in women and children as the foundation of strong communities. Our programmes span maternal health, early-childhood support, girls’ education and women’s skill development such as tailoring."
  },
  {
    _id: "d6",
    slug: "migration-urban-habitat",
    name: "Migration & Urban Habitat",
    shortName: "Migration & Urban Habitat",
    icon: "location_city",
    summary: "Support for migrant workers and improving urban living conditions.",
    content: "Migrant families often live on the margins of cities without documents, services or safe housing. We help them access entitlements, healthcare and education, and work to improve urban habitats."
  },
  {
    _id: "d7",
    slug: "social-justice-empowerment",
    name: "Social Justice and Empowerment",
    shortName: "Social Justice",
    icon: "diversity_3",
    summary: "Standing with marginalised groups to advance equality and dignity.",
    content: "We champion the rights and empowerment of marginalised and differently-abled communities through awareness, advocacy and direct support, helping them claim their rightful place in society."
  },
  {
    _id: "d8",
    slug: "environment-forest-climate",
    name: "Environment, Forest and Climate Change",
    shortName: "Environment & Climate",
    icon: "forest",
    summary: "Protecting nature through tree planting, clean-ups and climate awareness.",
    content: "A healthy environment is the basis of all wellbeing. We organise tree-planting drives, clean-up campaigns and climate-awareness programmes — including our annual World Environment Day event."
  },
  {
    _id: "d9",
    slug: "skill-development",
    name: "Skill Development",
    shortName: "Skill Development",
    icon: "construction",
    summary: "Equipping youth and adults with employable, future-ready skills.",
    content: "We run practical skill-development programmes — from computer and communication skills to vocational trades — that help people secure better livelihoods and become self-reliant."
  },
  {
    _id: "d10",
    slug: "youth-affairs-sports",
    name: "Youth Affairs and Sports",
    shortName: "Youth & Sports",
    icon: "sports_soccer",
    summary: "Nurturing young talent through sports, mentorship and leadership.",
    content: "We believe in the power of sport and mentorship to shape confident, disciplined young people. Our 'Supports for Sports' initiative provides equipment, coaching and opportunities to compete."
  },
  {
    _id: "d11",
    slug: "arts-culture",
    name: "Arts and Culture",
    shortName: "Arts & Culture",
    icon: "palette",
    summary: "Celebrating and preserving India’s rich artistic and cultural heritage.",
    content: "We promote local artists and preserve cultural traditions through workshops, exhibitions and community events that bring people together and keep heritage alive."
  },
  {
    _id: "d12",
    slug: "disaster-relief-rehabilitation",
    name: "Disaster Relief & Rehabilitation",
    shortName: "Disaster Relief",
    icon: "volunteer_activism",
    summary: "Rapid relief and long-term rehabilitation for communities hit by disaster.",
    content: "When disaster strikes, we respond quickly with food, water, shelter and medical aid, then stay to support rehabilitation and rebuilding so families can recover their lives."
  },
  {
    _id: "d13",
    slug: "science-technology-education",
    name: "Science and Technology Research and Educational Institutions",
    shortName: "Science & Education",
    icon: "science",
    summary: "Advancing science, technology and quality education for all.",
    content: "We support educational institutions and promote science and technology through scholarships, awareness schemes and learning resources that open doors for the next generation."
  },
  {
    _id: "d14",
    slug: "individual-grants",
    name: "Individual Grants Programme",
    shortName: "Individual Grants",
    icon: "card_giftcard",
    summary: "Direct grants to individuals facing urgent need or hardship.",
    content: "Sometimes a single timely grant changes a life. Our Individual Grants Programme provides direct financial assistance for medical emergencies, education and other urgent needs."
  },
  {
    _id: "d15",
    slug: "agriculture-farmers-welfare",
    name: "Agriculture and Farmers Welfare",
    shortName: "Agriculture & Farmers",
    icon: "agriculture",
    summary: "Supporting farmers with knowledge, resources and sustainable practices.",
    content: "Farmers feed the nation, and we stand with them. We provide training in sustainable agriculture, access to resources, and welfare support to improve farming livelihoods."
  },
  {
    _id: "d16",
    slug: "sc-st-welfare",
    name: "Scheduled Caste and Scheduled Tribes Welfare",
    shortName: "SC & ST Welfare",
    icon: "groups",
    summary: "Advancing the welfare, rights and opportunities of SC & ST communities.",
    content: "We work to uplift Scheduled Caste and Scheduled Tribe communities through education, livelihood support, rights awareness and access to government schemes they are entitled to."
  }
];

const defaultProjects = [
  {
    title: "Scholarships",
    category: "Education",
    description: "Financial support that keeps deserving students in school and college.",
    goal: 300000,
    raised: 120000,
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793119/abhina/proj-scholarships.jpg",
    featured: true
  },
  {
    title: "Educational Awareness Scheme",
    category: "Education",
    description: "Door-to-door campaigns that promote the lifelong value of education.",
    goal: 150000,
    raised: 45000,
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793120/abhina/proj-education-awareness.jpg",
    featured: false
  },
  {
    title: "Medical Camp",
    category: "Medical",
    description: "Free health screening, medicines and referrals for underserved communities.",
    goal: 500000,
    raised: 310000,
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793121/abhina/proj-medical-camp.jpg",
    featured: true
  },
  {
    title: "Tailoring Centre",
    category: "Women Empowerment",
    description: "Skill training that helps women earn an independent, dignified livelihood.",
    goal: 200000,
    raised: 95000,
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793123/abhina/proj-tailoring-centre.jpg",
    featured: true
  },
  {
    title: "Computer & Communication Skills",
    category: "Skills",
    description: "Digital literacy and spoken-English training for employable, future-ready youth.",
    goal: 250000,
    raised: 150000,
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793124/abhina/proj-computer-skills.jpg",
    featured: false
  },
  {
    title: "Supports for Sports",
    category: "Sports",
    description: "Equipment, coaching and opportunities for young athletes to thrive.",
    goal: 150000,
    raised: 75000,
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793125/abhina/proj-supports-for-sports.jpg",
    featured: false
  }
];

const defaultEvents = [
  {
    title: "World Environment Day",
    description: "Join us for tree plantation and a clean-up drive as we celebrate World Environment Day and renew our commitment to the planet.",
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793126/abhina/evt-world-env-day.jpg",
    date: "Jun 05",
    time: "10:00 - 12:00",
    venue: "Habsiguda, Hyderabad",
    category: "Environment",
    status: "upcoming"
  },
  {
    title: "Ambedkar Jayanti Celebration",
    description: "A community gathering honouring Dr. B. R. Ambedkar with talks, cultural performances and a shared meal.",
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793128/abhina/evt-ambedkar-jayanti.jpg",
    date: "Apr 14",
    time: "16:00 - 22:00",
    venue: "Community Hall, Hyderabad",
    category: "Social Justice",
    status: "completed"
  },
  {
    title: "International Women's Day Meet",
    description: "Celebrating the women of our community with skill showcases, health check-ups and recognition of changemakers.",
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793129/abhina/evt-womens-day.jpg",
    date: "Mar 08",
    time: "11:00 - 16:00",
    venue: "ABHINA Centre, Hyderabad",
    category: "Women Empowerment",
    status: "completed"
  }
];

const defaultTestimonials = [
  {
    name: "Mariya Jude",
    role: "Beneficiary",
    quote: "ABHINA Charitable Trust gave my family hope when we had nowhere to turn. Their medical camp treated my mother free of cost.",
    avatarUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793131/abhina/testimonial-1.jpg"
  },
  {
    name: "Jyosna M",
    role: "Tailoring Student",
    quote: "The tailoring programme changed my life. I now run a small stitching business and support my children’s education.",
    avatarUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793133/abhina/testimonial-2.jpg"
  },
  {
    name: "Bhargavi A",
    role: "Volunteer",
    quote: "Volunteering with ABHINA has been the most meaningful work I’ve done. The team truly lives its motto — gives hope.",
    avatarUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793135/abhina/testimonial-3.jpg"
  }
];

const defaultTeam = [
  {
    name: "Founder & Chairperson",
    role: "Founder & Chairperson",
    bio: "Leading ABHINA’s mission to make charitable giving part of everyone’s life.",
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793136/abhina/team-founder.jpg"
  },
  {
    name: "Programme Director",
    role: "Programme Director",
    bio: "Oversees all 16 departments and on-ground delivery across India.",
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793137/abhina/team-programme-director.jpg"
  },
  {
    name: "Volunteer Coordinator",
    role: "Volunteer Coordinator",
    bio: "Builds and supports our growing network of volunteers.",
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793138/abhina/team-volunteer-coordinator.jpg"
  },
  {
    name: "Finance & Compliance Lead",
    role: "Finance & Compliance Lead",
    bio: "Ensures transparency, accountability and trust in every rupee.",
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793140/abhina/team-finance-lead.jpg"
  }
];

const defaultDonors = [
  {
    name: "Muthoot Finance",
    tier: "platinum",
    logoUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793141/abhina/donor-muthoot.jpg",
    website: "https://www.muthootfinance.com"
  },
  {
    name: "3shadz Software Solutions",
    tier: "gold",
    logoUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793142/abhina/donor-3shadz.jpg",
    website: ""
  },
  {
    name: "Creativ Sparks",
    tier: "gold",
    logoUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793144/abhina/donor-creativ-sparks.jpg",
    website: ""
  },
  {
    name: "Babu",
    tier: "silver",
    logoUrl: "",
    website: ""
  }
];

const defaultImpactStories = [
  {
    slug: "a-second-chance-at-school",
    title: "A Second Chance at School",
    summary: "How student Lakshmi returned to school through our academic scholarships.",
    author: "ABHINA Team",
    date: "May 15, 2025",
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793145/abhina/story-second-chance.jpg",
    content: "When Lakshmi's father fell ill, she was pulled out of school to help at home. Through our Scholarships programme she returned to class, received books and uniforms, and is now top of her grade. Her story is one of hundreds — proof that the right skill, at the right time, changes everything."
  },
  {
    slug: "tailoring-success-hayathnagar",
    title: "Stitching Together a Livelihood",
    summary: "Empowering rural women through tailoring and self-employment initiatives.",
    author: "ABHINA Team",
    date: "Apr 22, 2025",
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793146/abhina/story-tailoring-hayathnagar.jpg",
    content: "In Hayathnagar, forty women completed our free tailoring program. ABHINA provided each graduate with a sewing machine. Today, most are self-employed tailoring business owners, earning enough to support their households independently."
  },
  {
    slug: "clean-water-for-a-village",
    title: "Clean Water for a Whole Village",
    summary: "Drop in waterborne illness following our water-filtration drive.",
    author: "ABHINA Team",
    date: "Jun 10, 2025",
    imageUrl: "https://res.cloudinary.com/des50gqzc/image/upload/v1781793147/abhina/story-clean-water.jpg",
    content: "A village on the outskirts of Hyderabad had relied on contaminated water for years. After our water-delivery and sanitation drive, waterborne illness dropped sharply and children returned to school. The community now maintains its own water source — sustainable impact that outlasts our visit."
  }
];

const defaultThemes = [
  {
    lang: "en",
    primaryColor: "21 72 158",
    primaryDarkColor: "14 53 118",
    primaryGradientStart: "#2e6fc2",
    primaryGradientMiddle: "#15489e",
    primaryGradientEnd: "#0e3576",
    orangeColor: "232 115 28",
    orangeSoftColor: "#fbd9be",
    accentColor: "108 19 196",
    accentGradientStart: "#6c13c4",
    accentGradientEnd: "#4e0e91"
  },
  {
    lang: "te", // Teal Theme for Telugu
    primaryColor: "13 148 136",
    primaryDarkColor: "15 118 110",
    primaryGradientStart: "#14b8a6",
    primaryGradientMiddle: "#0d9488",
    primaryGradientEnd: "#0f766e",
    orangeColor: "225 29 72",
    orangeSoftColor: "#ffe4e6",
    accentColor: "79 70 229",
    accentGradientStart: "#6366f1",
    accentGradientEnd: "#4f46e5"
  },
  {
    lang: "ta", // Green Theme for Tamil
    primaryColor: "22 163 74",
    primaryDarkColor: "21 128 61",
    primaryGradientStart: "#4ade80",
    primaryGradientMiddle: "#16a34a",
    primaryGradientEnd: "#15803d",
    orangeColor: "217 119 6",
    orangeSoftColor: "#fef3c7",
    accentColor: "13 148 136",
    accentGradientStart: "#14b8a6",
    accentGradientEnd: "#0d9488"
  },
  {
    lang: "kn", // Purple Theme for Kannada
    primaryColor: "147 51 234",
    primaryDarkColor: "126 34 206",
    primaryGradientStart: "#c084fc",
    primaryGradientMiddle: "#9333ea",
    primaryGradientEnd: "#7e22ce",
    orangeColor: "220 38 38",
    orangeSoftColor: "#fee2e2",
    accentColor: "219 39 119",
    accentGradientStart: "#ec4899",
    accentGradientEnd: "#db2777"
  },
  {
    lang: "ml", // Crimson Theme for Malayalam
    primaryColor: "220 38 38",
    primaryDarkColor: "185 28 28",
    primaryGradientStart: "#ef4444",
    primaryGradientMiddle: "#dc2626",
    primaryGradientEnd: "#b91717",
    orangeColor: "217 119 6",
    orangeSoftColor: "#fef3c7",
    accentColor: "79 70 229",
    accentGradientStart: "#6366f1",
    accentGradientEnd: "#4f46e5"
  }
];

const defaultTranslations = [
  // ────────────────────────── TELUGU ──────────────────────────
  { lang: "te", key: "Home", value: "హోమ్" },
  { lang: "te", key: "About", value: "మా గురించి" },
  { lang: "te", key: "About ABHINA", value: "అభిన గురించి" },
  { lang: "te", key: "Our Team", value: "మా బృందం" },
  { lang: "te", key: "Annual Reports", value: "వార్షిక నివేదికలు" },
  { lang: "te", key: "Our Donors", value: "మా దాతలు" },
  { lang: "te", key: "Our Work", value: "మా పని" },
  { lang: "te", key: "View all departments", value: "అన్ని విభాగాలు చూడండి" },
  { lang: "te", key: "Impact Stories", value: "ప్రభావ కథనాలు" },
  { lang: "te", key: "Events", value: "కార్యక్రమాలు" },
  { lang: "te", key: "Projects", value: "ప్రాజెక్టులు" },
  { lang: "te", key: "News", value: "వార్తలు" },
  { lang: "te", key: "Contacts", value: "సంప్రదించండి" },
  { lang: "te", key: "Donate", value: "విరాళం ఇవ్వండి" },
  { lang: "te", key: "Donate Now", value: "ఇప్పుడే విరాళం ఇవ్వండి" },
  { lang: "te", key: "Become a Volunteer", value: "స్వచ్ఛంద సేవకుడిగా మారండి" },
  { lang: "te", key: "gives hope", value: "ఆశను కలిగిస్తుంది" },
  { lang: "te", key: "Learn More", value: "మరింత తెలుసుకోండి" },
  { lang: "te", key: "Read Impact Stories", value: "ప్రభావ కథనాలు చదవండి" },
  { lang: "te", key: "Upcoming Events", value: "రాబోయే కార్యక్రమాలు" },
  { lang: "te", key: "Our Services", value: "మా సేవలు" },
  { lang: "te", key: "Our Causes", value: "మా కారణాలు" },
  { lang: "te", key: "Featured Projects", value: "ముఖ్యమైన ప్రాజెక్టులు" },
  { lang: "te", key: "Stories of Hope", value: "ఆశా కథలు" },
  { lang: "te", key: "Join Us as a Volunteer", value: "స్వచ్ఛందంగా చేరండి" },
  { lang: "te", key: "Our Happy Donors", value: "మా సంతోషకరమైన దాతలు" },
  { lang: "te", key: "Join our newsletter", value: "వార్తాలేఖకు చందా పొందండి" },
  { lang: "te", key: "Subscribe", value: "సబ్స్క్రైబ్" },
  { lang: "te", key: "Get Involved", value: "పాలుపంచుకోండి" },
  { lang: "te", key: "Explore", value: "అన్వేషించండి" },
  { lang: "te", key: "Contact Us", value: "మమ్మల్ని సంప్రదించండి" },
  { lang: "te", key: "Privacy Policy", value: "గోప్యతా విధానం" },
  { lang: "te", key: "Terms & Conditions", value: "నిబంధనలు & షరతులు" },
  { lang: "te", key: "World Environment Day", value: "ప్రపంచ పర్యావరణ దినోత్సవం" },
  { lang: "te", key: "Read More", value: "మరింత చదవండి" },
  { lang: "te", key: "View All", value: "అన్నీ చూడండి" },
  { lang: "te", key: "People Helped", value: "సహాయం పొందిన వ్యక్తులు" },
  { lang: "te", key: "Funds Collected", value: "సేకరించిన నిధులు" },
  { lang: "te", key: "Departments", value: "విభాగాలు" },
  { lang: "te", key: "Serving Since", value: "సేవలో ఉన్నారు" },

  // ────────────────────────── TAMIL ──────────────────────────
  { lang: "ta", key: "Home", value: "முகப்பு" },
  { lang: "ta", key: "About", value: "எங்களைப் பற்றி" },
  { lang: "ta", key: "About ABHINA", value: "அபினா பற்றி" },
  { lang: "ta", key: "Our Team", value: "எங்கள் குழு" },
  { lang: "ta", key: "Annual Reports", value: "வருடாந்திர அறிக்கைகள்" },
  { lang: "ta", key: "Our Donors", value: "எங்கள் நன்கொடையாளர்கள்" },
  { lang: "ta", key: "Our Work", value: "எங்கள் பணி" },
  { lang: "ta", key: "View all departments", value: "அனைத்து துறைகளையும் காண்க" },
  { lang: "ta", key: "Impact Stories", value: "தாக்க கதைகள்" },
  { lang: "ta", key: "Events", value: "நிகழ்வுகள்" },
  { lang: "ta", key: "Projects", value: "திட்டங்கள்" },
  { lang: "ta", key: "News", value: "செய்திகள்" },
  { lang: "ta", key: "Contacts", value: "தொடர்புகள்" },
  { lang: "ta", key: "Donate", value: "நன்கொடை" },
  { lang: "ta", key: "Donate Now", value: "இப்போதே நன்கொடை அளிக்கவும்" },
  { lang: "ta", key: "Become a Volunteer", value: "தன்னார்வலராகுங்கள்" },
  { lang: "ta", key: "gives hope", value: "நம்பிக்கை அளிக்கிறது" },
  { lang: "ta", key: "Learn More", value: "மேலும் அறிக" },
  { lang: "ta", key: "Read Impact Stories", value: "தாக்க கதைகளை படிக்கவும்" },
  { lang: "ta", key: "Upcoming Events", value: "வரவிருக்கும் நிகழ்வுகள்" },
  { lang: "ta", key: "Our Services", value: "எங்கள் சேவைகள்" },
  { lang: "ta", key: "Our Causes", value: "எங்கள் காரணங்கள்" },
  { lang: "ta", key: "Featured Projects", value: "சிறப்பு திட்டங்கள்" },
  { lang: "ta", key: "Stories of Hope", value: "நம்பிக்கை கதைகள்" },
  { lang: "ta", key: "Join Us as a Volunteer", value: "தன்னார்வலராக சேருங்கள்" },
  { lang: "ta", key: "Our Happy Donors", value: "எங்கள் மகிழ்ச்சியான நன்கொடையாளர்கள்" },
  { lang: "ta", key: "Join our newsletter", value: "எங்கள் செய்திமடலில் சேரவும்" },
  { lang: "ta", key: "Subscribe", value: "குழுசேர்" },
  { lang: "ta", key: "Get Involved", value: "பங்கு பெறுங்கள்" },
  { lang: "ta", key: "Explore", value: "ஆராயுங்கள்" },
  { lang: "ta", key: "Contact Us", value: "எங்களை தொடர்புகொள்ளுங்கள்" },
  { lang: "ta", key: "Privacy Policy", value: "தனியுரிமை கொள்கை" },
  { lang: "ta", key: "Terms & Conditions", value: "விதிமுறைகள் மற்றும் நிபந்தனைகள்" },
  { lang: "ta", key: "Read More", value: "மேலும் படிக்கவும்" },
  { lang: "ta", key: "View All", value: "அனைத்தையும் காண்க" },
  { lang: "ta", key: "People Helped", value: "உதவி பெற்றவர்கள்" },
  { lang: "ta", key: "Funds Collected", value: "திரட்டப்பட்ட நிதி" },
  { lang: "ta", key: "Departments", value: "துறைகள்" },
  { lang: "ta", key: "Serving Since", value: "சேவையில் இருந்து" },

  // ────────────────────────── KANNADA ──────────────────────────
  { lang: "kn", key: "Home", value: "ಮುಖಪುಟ" },
  { lang: "kn", key: "About", value: "ನಮ್ಮ ಬಗ್ಗೆ" },
  { lang: "kn", key: "About ABHINA", value: "ಅಭಿನ ಬಗ್ಗೆ" },
  { lang: "kn", key: "Our Team", value: "ನಮ್ಮ ತಂಡ" },
  { lang: "kn", key: "Annual Reports", value: "ವಾರ್ಷಿಕ ವರದಿಗಳು" },
  { lang: "kn", key: "Our Donors", value: "ನಮ್ಮ ದಾನಿಗಳು" },
  { lang: "kn", key: "Our Work", value: "ನಮ್ಮ ಕಾರ್ಯಗಳು" },
  { lang: "kn", key: "View all departments", value: "ಎಲ್ಲಾ ವಿಭಾಗಗಳನ್ನು ನೋಡಿ" },
  { lang: "kn", key: "Impact Stories", value: "ಪ್ರಭಾವದ ಕಥೆಗಳು" },
  { lang: "kn", key: "Events", value: "ಕಾರ್ಯಕ್ರಮಗಳು" },
  { lang: "kn", key: "Projects", value: "ಯೋಜನೆಗಳು" },
  { lang: "kn", key: "News", value: "ಸುದ್ದಿ" },
  { lang: "kn", key: "Contacts", value: "ಸಂಪರ್ಕಿಸಿ" },
  { lang: "kn", key: "Donate", value: "ದೇಣಿಗೆ" },
  { lang: "kn", key: "Donate Now", value: "ಈಗಲೇ ದೇಣಿಗೆ ನೀಡಿ" },
  { lang: "kn", key: "Become a Volunteer", value: "ಸ್ವಯಂಸೇವಕರಾಗಿ" },
  { lang: "kn", key: "gives hope", value: "ಭರವಸೆ ನೀಡುತ್ತದೆ" },
  { lang: "kn", key: "Learn More", value: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ" },
  { lang: "kn", key: "Read Impact Stories", value: "ಪ್ರಭಾವದ ಕಥೆಗಳನ್ನು ಓದಿ" },
  { lang: "kn", key: "Upcoming Events", value: "ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು" },
  { lang: "kn", key: "Our Services", value: "ನಮ್ಮ ಸೇವೆಗಳು" },
  { lang: "kn", key: "Our Causes", value: "ನಮ್ಮ ಉದ್ದೇಶಗಳು" },
  { lang: "kn", key: "Featured Projects", value: "ಮುಖ್ಯ ಯೋಜನೆಗಳು" },
  { lang: "kn", key: "Stories of Hope", value: "ಆಶಾ ಕಥೆಗಳು" },
  { lang: "kn", key: "Join Us as a Volunteer", value: "ಸ್ವಯಂಸೇವಕರಾಗಿ ಸೇರಿ" },
  { lang: "kn", key: "Our Happy Donors", value: "ನಮ್ಮ ಸಂತೋಷದ ದಾನಿಗಳು" },
  { lang: "kn", key: "Join our newsletter", value: "ನ್ಯೂಸ್ಲೆಟರ್ಗೆ ಸೇರಿ" },
  { lang: "kn", key: "Subscribe", value: "ಚಂದಾದಾರರಾಗಿ" },
  { lang: "kn", key: "Get Involved", value: "ಭಾಗವಹಿಸಿ" },
  { lang: "kn", key: "Explore", value: "ಅನ್ವೇಷಿಸಿ" },
  { lang: "kn", key: "Contact Us", value: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ" },
  { lang: "kn", key: "Privacy Policy", value: "ಗೌಪ್ಯತಾ ನೀತಿ" },
  { lang: "kn", key: "Terms & Conditions", value: "ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು" },
  { lang: "kn", key: "Read More", value: "ಇನ್ನಷ್ಟು ಓದಿ" },
  { lang: "kn", key: "View All", value: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ" },
  { lang: "kn", key: "People Helped", value: "ಸಹಾಯ ಪಡೆದ ಜನರು" },
  { lang: "kn", key: "Funds Collected", value: "ಸಂಗ್ರಹಿಸಿದ ಹಣ" },
  { lang: "kn", key: "Departments", value: "ವಿಭಾಗಗಳು" },
  { lang: "kn", key: "Serving Since", value: "ಸೇವೆಯಲ್ಲಿ ಇರುವ ಸಮಯ" },

  // ────────────────────────── MALAYALAM ──────────────────────────
  { lang: "ml", key: "Home", value: "ഹോം" },
  { lang: "ml", key: "About", value: "ഞങ്ങളെ കുറിച്ച്" },
  { lang: "ml", key: "About ABHINA", value: "അഭിനയെ കുറിച്ച്" },
  { lang: "ml", key: "Our Team", value: "ഞങ്ങളുടെ ടീം" },
  { lang: "ml", key: "Annual Reports", value: "വാർഷിക റിപ്പോർട്ടുകൾ" },
  { lang: "ml", key: "Our Donors", value: "ഞങ്ങളുടെ ദാതാക്കൾ" },
  { lang: "ml", key: "Our Work", value: "ഞങ്ങളുടെ പ്രവർത്തനങ്ങൾ" },
  { lang: "ml", key: "View all departments", value: "എല്ലാ വകുപ്പുകളും കാണുക" },
  { lang: "ml", key: "Impact Stories", value: "പ്രതികരണ കഥകൾ" },
  { lang: "ml", key: "Events", value: "പരിപാടികൾ" },
  { lang: "ml", key: "Projects", value: "പദ്ധതികൾ" },
  { lang: "ml", key: "News", value: "വാർത്ത" },
  { lang: "ml", key: "Contacts", value: "ബന്ധപ്പെടുക" },
  { lang: "ml", key: "Donate", value: "സംഭാവന ചെയ്യുക" },
  { lang: "ml", key: "Donate Now", value: "ഇപ്പോൾ സംഭാവന ചെയ്യുക" },
  { lang: "ml", key: "Become a Volunteer", value: "വോളന്റിയർ ആകുക" },
  { lang: "ml", key: "gives hope", value: "പ്രതീക്ഷ നൽകുന്നു" },
  { lang: "ml", key: "Learn More", value: "കൂടുതൽ അറിയുക" },
  { lang: "ml", key: "Read Impact Stories", value: "പ്രതികരണ കഥകൾ വായിക്കുക" },
  { lang: "ml", key: "Upcoming Events", value: "വരാനിരിക്കുന്ന പരിപാടികൾ" },
  { lang: "ml", key: "Our Services", value: "ഞങ്ങളുടെ സേവനങ്ങൾ" },
  { lang: "ml", key: "Our Causes", value: "ഞങ്ങളുടെ ലക്ഷ്യങ്ങൾ" },
  { lang: "ml", key: "Featured Projects", value: "പ്രധാന പദ്ധതികൾ" },
  { lang: "ml", key: "Stories of Hope", value: "പ്രത്യാശ കഥകൾ" },
  { lang: "ml", key: "Join Us as a Volunteer", value: "വോളന്റിയറായി ചേരുക" },
  { lang: "ml", key: "Our Happy Donors", value: "ഞങ്ങളുടെ സന്തുഷ്ടരായ ദാതാക്കൾ" },
  { lang: "ml", key: "Join our newsletter", value: "ന്യൂസ്ലെറ്ററിൽ ചേരുക" },
  { lang: "ml", key: "Subscribe", value: "സബ്സ്ക്രൈബ് ചെയ്യുക" },
  { lang: "ml", key: "Get Involved", value: "പങ്കെടുക്കുക" },
  { lang: "ml", key: "Explore", value: "പര്യവേക്ഷണം ചെയ്യുക" },
  { lang: "ml", key: "Contact Us", value: "ഞങ്ങളെ ബന്ധപ്പെടുക" },
  { lang: "ml", key: "Privacy Policy", value: "സ്വകാര്യതാ നയം" },
  { lang: "ml", key: "Terms & Conditions", value: "നിബന്ധനകളും വ്യവസ്ഥകളും" },
  { lang: "ml", key: "Read More", value: "കൂടുതൽ വായിക്കുക" },
  { lang: "ml", key: "View All", value: "എല്ലാം കാണുക" },
  { lang: "ml", key: "People Helped", value: "സഹായം ലഭിച്ചവർ" },
  { lang: "ml", key: "Funds Collected", value: "ശേഖരിച്ച ഫണ്ട്" },
  { lang: "ml", key: "Departments", value: "വകുപ്പുകൾ" },
  { lang: "ml", key: "Serving Since", value: "സേവനം ആരംഭിച്ചത്" }
];

const defaultPrivacyPolicy = `
# Privacy Policy - ABHINA Charitable Trust
*Last Updated: June 18, 2026*

At ABHINA Charitable Trust, we respect your privacy and are committed to protecting the personal data you share with us.

## 1. Information We Collect
* **Donations:** Name, email, phone number, and transaction references.
* **Volunteer Applications:** Name, contact info, availability, skills, and optional browser geolocation coordinates (to link you with local activities).
* **Subscriptions:** Email address for our newsletter.

## 2. How We Use Information
We use your data strictly to administer donation receipts, coordinate volunteer activities, distribute our newsletter, and improve our services. We do not sell or trade your details with third parties.
`;

const defaultTermsConditions = `
# Terms and Conditions - ABHINA Charitable Trust
*Last Updated: June 18, 2026*

Welcome to ABHINA Charitable Trust. By using our website and services, you agree to comply with these terms.

## 1. Donations
All donations made through our payment gateway are voluntary and non-refundable. Funds are utilized directly for trust initiatives.

## 2. Volunteer Code of Conduct
By registering as a volunteer, you agree to coordinate with local trust leaders, respect community beneficiaries, and act in good faith representing the trust.
`;

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI!);
  console.log("Connected successfully!");

  console.log("Clearing existing data...");
  await Promise.all([
    Admin.deleteMany({}),
    Department.deleteMany({}),
    Project.deleteMany({}),
    Event.deleteMany({}),
    Testimonial.deleteMany({}),
    Team.deleteMany({}),
    Donor.deleteMany({}),
    ImpactStory.deleteMany({}),
    Config.deleteMany({}),
    Theme.deleteMany({}),
    Translation.deleteMany({}),
    AnnualReport.deleteMany({})
  ]);

  console.log("Seeding Admin User...");
  const hashedPassword = await bcrypt.hash('abhina2026', 10);
  await Admin.create({ username: 'admin', password: hashedPassword, role: 'administrator' });

  console.log("Seeding Config & Policies...");
  const configDoc = new Config({
    trustName: 'ABHINA Charitable Trust',
    tagline: 'gives hope',
    logoUrl: 'https://res.cloudinary.com/des50gqzc/image/upload/v1781793115/abhina/logo.jpg',
    surveyLink: 'https://forms.gle/4G7Vshw6r5c4n8d9C',
    surveyEnabled: true,
    phone: '+91 83 415 01 569',
    email: 'support@abhina.net',
    address: '#308, Raghavendra Complex, Habsiguda Cross Road, Habsiguda, Hyderabad – 500007, Telangana, India',
    youtubeUrl: 'https://www.youtube.com/@abhinacharitabletrust',
    facebookUrl: 'https://www.facebook.com/abhinatrust',
    instagramUrl: '',
    twitterUrl: '',
    whatsappNumber: '',
    mapLat: 17.4065,
    mapLng: 78.5505,
    privacyPolicy: defaultPrivacyPolicy,
    termsConditions: defaultTermsConditions,
    heroImageUrl: 'https://res.cloudinary.com/des50gqzc/image/upload/v1781793116/abhina/hero.jpg',
    heroHeading: 'We help all people in need around India',
    heroSubtitle: 'Healthcare, education, water and food — delivered with dignity to those who need it most.',
    heroOverlayTitle: 'Tailoring Centre, Hyderabad',
    heroOverlaySubtitle: 'Livelihood support training center for rural women.',
    welcomeTitle: 'Welcome to ABHINA',
    welcomeSubtitle: 'Help is Our Main Goal',
    welcomeImage1Url: 'https://res.cloudinary.com/des50gqzc/image/upload/v1781793116/abhina/hero.jpg',
    welcomeImage2Url: 'https://res.cloudinary.com/des50gqzc/image/upload/v1781793117/abhina/about.jpg',
    welcomeImage3Url: 'https://res.cloudinary.com/des50gqzc/image/upload/v1781793118/abhina/team-founder.jpg',
    welcomePromise: 'Every contribution reaches the ground, with full transparency.',
    service1Icon: 'medication',
    service1Title: 'Medicine Help',
    service1Desc: 'Essential medicines and medical aid for those who cannot afford treatment.',
    service2Icon: 'construction',
    service2Title: 'We Build & Create',
    service2Desc: 'Building shelters, sanitation and the infrastructure communities need.',
    service3Icon: 'water_drop',
    service3Title: 'Water Delivery',
    service3Desc: 'Safe drinking water delivered to communities facing scarcity.',
    service4Icon: 'favorite',
    service4Title: 'We Care',
    service4Desc: 'Compassionate support for the elderly, children and the vulnerable.',
    stat1Value: '20K+', stat1Label: 'People Helped',
    stat2Value: '₹10L+', stat2Label: 'Funds Collected',
    stat3Value: '16', stat3Label: 'Departments',
    stat4Value: '2,018', stat4Label: 'Serving Since',
    aboutImageUrl: 'https://res.cloudinary.com/des50gqzc/image/upload/v1781793117/abhina/about.jpg',
    visionText: 'We envision an inclusive society where every individual has access to dignified livelihoods, clean habitats, health facilities, education, and legal protection.',
    missionText: "Make charitable giving a part of everyone's life.",
    aboutPara1: "ABHINA Charitable Trust was founded in 2018 with a simple belief — that charitable giving should be a part of everyone's life. We connect contributors, volunteers and beneficiaries across India, delivering help where it is needed most.",
    aboutPara2: 'Through 16 dedicated departments — from healthcare and education to water, environment and disaster relief — we bring hope to thousands of families every year.',
    bankAccountName: 'ABHINA Charitable Trust',
    bankAccountNumber: '921020045622119',
    bankName: 'Axis Bank Ltd',
    bankIFSC: 'UTIB0000108',
    bankBranch: 'Madhapur, Hyderabad',
    donationAmounts: [500, 1000, 2500, 5000],
    volunteerSkills: [
      'Legal Aid & Consulting',
      'Medical Camp Support & Nursing',
      'Sanitation & Cleansing Drives',
      'Tailoring Instruction & Vocational Skills',
      'Youth Sports Coordination',
      'Water System Maintenance',
      'General Field Labor / Logistics',
      'Social Media & Documentation'
    ]
  });
  await configDoc.save();

  console.log("Seeding Departments...");
  await Department.insertMany(defaultDepartments);

  console.log("Seeding Projects...");
  await Project.insertMany(defaultProjects);

  console.log("Seeding Events...");
  await Event.insertMany(defaultEvents);

  console.log("Seeding Testimonials...");
  await Testimonial.insertMany(defaultTestimonials);

  console.log("Seeding Team Members...");
  await Team.insertMany(defaultTeam);

  console.log("Seeding Donors...");
  await Donor.insertMany(defaultDonors);

  console.log("Seeding Impact Stories...");
  await ImpactStory.insertMany(defaultImpactStories);

  console.log("Seeding Themes...");
  await Theme.insertMany(defaultThemes);

  console.log("Seeding Translations...");
  await Translation.insertMany(defaultTranslations);

  console.log("Seeding Annual Reports...");
  await AnnualReport.insertMany([
    { year: 2024, title: 'Annual Report 2024', summary: 'A year of expanding reach across all 16 departments and 20K+ lives touched.', fileUrl: '', coverUrl: '' },
    { year: 2023, title: 'Annual Report 2023', summary: 'Strengthening healthcare, education and water programmes across Telangana and beyond.', fileUrl: '', coverUrl: '' },
    { year: 2022, title: 'Annual Report 2022', summary: 'Recovery, rehabilitation and renewed community partnerships.', fileUrl: '', coverUrl: '' }
  ]);

  console.log("Admin credentials: username=admin, password=abhina2026");
  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding failed: ", err);
  process.exit(1);
});
