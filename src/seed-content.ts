import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import News from './models/News';
import Gallery from './models/Gallery';
import Application from './models/Application';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('MONGO_URI not set'); process.exit(1); }

// ── NEWS ──────────────────────────────────────────────────────────────────────

const newsData = [
  {
    title: 'ABHINA Conducts Free Medical Camp in Habsiguda — 400+ Patients Treated',
    content: 'ABHINA Charitable Trust organised a free medical camp at its Habsiguda centre on Sunday, providing consultations, medicines and diagnostic tests to over 400 residents from low-income families. The camp featured doctors from cardiology, general medicine, orthopaedics and gynaecology. All medicines were distributed free of charge. "We have been running these camps every quarter and the response from the community keeps growing," said the Trust coordinator. Volunteers from 8 departments participated to ensure smooth operations throughout the day.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    category: 'latest_news',
    source: 'ABHINA Trust',
    isLive: false,
    isPublished: true,
    publishedAt: new Date('2025-06-28'),
  },
  {
    title: 'Water Purification Units Installed in 5 Villages of Nalgonda District',
    content: 'In a significant step toward clean water access, ABHINA Charitable Trust has successfully installed solar-powered water purification units in five villages of Nalgonda district, Telangana. The project, completed over three months, now provides safe drinking water to approximately 3,200 families who previously relied on contaminated borewells. The Trust funded the initiative entirely through donations collected during its annual fundraiser. Community members have been trained to operate and maintain the units to ensure long-term sustainability.',
    imageUrl: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?w=800&q=80',
    category: 'latest_news',
    source: 'ABHINA Trust',
    isLive: false,
    isPublished: true,
    publishedAt: new Date('2025-06-20'),
  },
  {
    title: '120 Girls Awarded Scholarships Under ABHINA Education Drive 2025',
    content: 'ABHINA Charitable Trust disbursed scholarships to 120 girl students from Classes 6 through 12 at a ceremony held at its Hyderabad office. The scholarships, ranging from ₹5,000 to ₹15,000, cover tuition fees, books and stationery for the academic year. Priority was given to students from households below the poverty line in Hayathnagar, Maheshwaram and LB Nagar mandals. The Trust aims to expand the programme to 200 beneficiaries by 2026. Parents and students expressed deep gratitude, with several first-generation learners among the recipients.',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    category: 'latest_news',
    source: 'ABHINA Trust',
    isLive: false,
    isPublished: true,
    publishedAt: new Date('2025-06-10'),
  },
  {
    title: 'ABHINA Distributes Ration Kits to 800 Families Ahead of Monsoon Season',
    content: 'Ahead of the monsoon season, ABHINA Charitable Trust distributed essential ration kits — rice, dal, oil, salt and spices — to 800 families in flood-prone areas of Khammam and Suryapet districts. The initiative was carried out in coordination with local gram panchayats to identify the most vulnerable households. Each kit contains enough supplies for a family of four for one month. The Trust\'s disaster-preparedness committee has been monitoring flood forecasts and is ready with a second round of aid if required. Volunteers spent two days on ground to ensure fair distribution.',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    category: 'latest_news',
    source: 'ABHINA Trust',
    isLive: false,
    isPublished: true,
    publishedAt: new Date('2025-05-30'),
  },
  {
    title: 'LIVE: Annual Fundraiser Gala — Watch the Event as it Happens',
    content: 'ABHINA Charitable Trust is hosting its Annual Fundraiser Gala today, bringing together donors, volunteers and community leaders from across Telangana. The evening features cultural performances, a silent auction and live speeches from beneficiaries whose lives have been transformed through the Trust\'s programmes. All proceeds go directly toward healthcare, education and water projects for 2025-26. Watch the live stream and donate in real time.',
    videoUrl: 'https://www.youtube.com/watch?v=DHpQ1YuyOSM',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    category: 'videos',
    source: 'ABHINA Trust Live',
    isLive: true,
    isPublished: true,
    publishedAt: new Date('2025-07-06'),
  },
  {
    title: 'Documentary: Inside ABHINA\'s Tailoring Training Centre for Rural Women',
    content: 'This short documentary takes you inside ABHINA\'s tailoring and vocational training centre in Habsiguda, where over 200 rural women have learned a trade and earned financial independence. The centre runs three-month batch programmes, provides raw materials and connects graduates with local garment businesses. Watch how women from remote villages are transforming their families\' futures through skill and determination.',
    videoUrl: 'https://www.youtube.com/watch?v=DHpQ1YuyOSM',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'videos',
    source: 'ABHINA Trust Films',
    isLive: false,
    isPublished: true,
    publishedAt: new Date('2025-05-18'),
  },
  {
    title: 'Press Note: ABHINA Charitable Trust Completes 7 Years of Service',
    content: 'ABHINA Charitable Trust marks seven years of uninterrupted service to communities across Telangana and Andhra Pradesh. Since its founding in 2018, the Trust has impacted over 20,000 lives across 16 departments spanning healthcare, education, water, environment, disaster relief, legal aid and livelihoods. The Trust remains committed to full financial transparency and publishes audited accounts annually. The management committee has approved an expanded budget for 2025-26, with new initiatives planned in coastal Andhra and tribal areas of Telangana.',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    category: 'press_notes',
    source: 'ABHINA Communications',
    isLive: false,
    isPublished: true,
    publishedAt: new Date('2025-04-12'),
  },
  {
    title: 'Press Note: Partnership Signed with District Hospital for Free Specialist Camps',
    content: 'ABHINA Charitable Trust has signed a Memorandum of Understanding with a District Government Hospital to organise quarterly specialist medical camps for low-income patients. The MOU covers cardiology, ophthalmology and dental camps, with all consultations and medicines provided at no cost to patients. The partnership will benefit an estimated 1,500 patients per quarter. The Trust will mobilise volunteers for patient management while the hospital provides specialist doctors and diagnostic equipment.',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    category: 'press_notes',
    source: 'ABHINA Communications',
    isLive: false,
    isPublished: true,
    publishedAt: new Date('2025-03-22'),
  },
  {
    title: 'Debate: Should CSR Funds Be Directed to Local NGOs Over Large Foundations?',
    content: 'A roundtable discussion hosted by ABHINA Charitable Trust brought together corporate CSR heads, social workers and policy experts to debate whether Indian companies should prioritise directing their mandatory CSR spending toward grassroots local NGOs rather than large national foundations. Proponents argued that local organisations have deeper community knowledge and lower administrative overheads, while critics raised concerns about accountability and scale. The discussion produced a set of recommendations that ABHINA plans to submit to the Ministry of Corporate Affairs.',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    category: 'debates',
    source: 'ABHINA Forum',
    isLive: false,
    isPublished: true,
    publishedAt: new Date('2025-02-14'),
  },
  {
    title: 'Debate: Is Charitable Giving Enough, or Does Systemic Change Come First?',
    content: 'ABHINA\'s annual public dialogue this year tackled one of the most enduring tensions in development work: can charitable organisations meaningfully address poverty without tackling structural inequalities? Speakers ranged from community organisers who championed immediate relief as a moral imperative, to academics who argued that charity without policy change merely manages suffering rather than ending it. The audience — including donors, volunteers and beneficiaries — voted in a live poll, with results split almost evenly. ABHINA\'s Director called for a "both-and" approach: immediate relief paired with consistent advocacy.',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80',
    category: 'debates',
    source: 'ABHINA Forum',
    isLive: false,
    isPublished: true,
    publishedAt: new Date('2025-01-25'),
  },
];

// ── GALLERY ───────────────────────────────────────────────────────────────────

const galleryData = [
  {
    title: 'Free Medical Camp — Habsiguda, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    category: 'Medical Camps',
    date: '2025-06-28',
    order: 1,
  },
  {
    title: 'Water Purification Installation — Nalgonda',
    imageUrl: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?w=800&q=80',
    category: 'Water Projects',
    date: '2025-06-15',
    order: 2,
  },
  {
    title: 'Scholarship Distribution Ceremony 2025',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    category: 'Education',
    date: '2025-06-10',
    order: 3,
  },
  {
    title: 'Ration Kit Distribution — Khammam',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    category: 'Food & Nutrition',
    date: '2025-05-30',
    order: 4,
  },
  {
    title: 'Tailoring Training Centre — Women Empowerment',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Livelihoods',
    date: '2025-05-20',
    order: 5,
  },
  {
    title: 'Annual Fundraiser Gala — Hyderabad',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    category: 'Events',
    date: '2025-07-06',
    order: 6,
  },
  {
    title: 'Tree Plantation Drive — 500 Saplings',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80',
    category: 'Environment',
    date: '2025-04-22',
    order: 7,
  },
  {
    title: 'Sports Day for Underprivileged Children',
    imageUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&q=80',
    category: 'Youth',
    date: '2025-03-15',
    order: 8,
  },
  {
    title: 'Blood Donation Camp — 120 Units Collected',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&q=80',
    category: 'Medical Camps',
    date: '2025-02-28',
    order: 9,
  },
  {
    title: 'Sanitation Drive — Village Clean-up Initiative',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    category: 'Sanitation',
    date: '2025-01-18',
    order: 10,
  },
];

// ── APPLICATIONS ──────────────────────────────────────────────────────────────

const applicationData = [
  {
    title: 'PM Kisan Samman Nidhi',
    description: 'Check your PM-KISAN beneficiary status and receive ₹6,000 annual direct benefit transfer for eligible farmers.',
    link: 'https://pmkisan.gov.in',
    icon: 'agriculture',
    order: 1,
    isActive: true,
  },
  {
    title: 'Aarogya Setu',
    description: 'Official Government of India health app for COVID-19 tracking, vaccination certificates and Ayushman Bharat health services.',
    link: 'https://www.aarogyasetu.gov.in',
    icon: 'health_and_safety',
    order: 2,
    isActive: true,
  },
  {
    title: 'DigiLocker',
    description: 'Store and access your official documents — Aadhaar, PAN, driving licence, education certificates — digitally and securely.',
    link: 'https://www.digilocker.gov.in',
    icon: 'folder_special',
    order: 3,
    isActive: true,
  },
  {
    title: 'UMANG — Govt Services',
    description: 'Unified Mobile Application for New-age Governance. Access 2000+ government services including PF, passport, EPFO and more.',
    link: 'https://web.umang.gov.in',
    icon: 'account_balance',
    order: 4,
    isActive: true,
  },
  {
    title: 'Ayushman Bharat — PMJAY',
    description: 'Check your eligibility for the Pradhan Mantri Jan Arogya Yojana health insurance scheme covering ₹5 lakh per family.',
    link: 'https://pmjay.gov.in',
    icon: 'medical_services',
    order: 5,
    isActive: true,
  },
  {
    title: 'National Scholarship Portal',
    description: 'Apply for central and state government scholarships for students from SC, ST, OBC and minority communities.',
    link: 'https://scholarships.gov.in',
    icon: 'school',
    order: 6,
    isActive: true,
  },
];

// ── MULTILINGUAL NEWS ─────────────────────────────────────────────────────────

const multiLangNews = [
  // ── Telugu ──
  {
    title: 'అభిన చారిటబుల్ ట్రస్ట్ హబ్సిగూడలో ఉచిత వైద్య శిబిరం — 400+ మంది రోగులకు సేవ',
    content: 'అభిన చారిటబుల్ ట్రస్ట్ ఆదివారం హబ్సిగూడ కేంద్రంలో ఉచిత వైద్య శిబిరాన్ని నిర్వహించింది. కార్డియాలజీ, జనరల్ మెడిసిన్, ఆర్థోపెడిక్స్ మరియు గైనకాలజీ నుండి వైద్యులు ఈ శిబిరంలో పాల్గొన్నారు. 400 మంది రోగులకు వైద్య సేవలు, మందులు ఉచితంగా అందించబడ్డాయి. ట్రస్ట్ కో-ఆర్డినేటర్ మాట్లాడుతూ ప్రతి త్రైమాసికం ఈ శిబిరాలు నిర్వహిస్తున్నామని, ప్రజల స్పందన పెరుగుతుందని తెలిపారు.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    category: 'latest_news', source: 'అభిన ట్రస్ట్', language: 'te', isLive: false, isPublished: true,
    publishedAt: new Date('2025-07-01'),
  },
  {
    title: 'అభిన ట్రస్ట్ — మహిళా సాధికారత: టైలరింగ్ శిక్షణా కేంద్రం వీడియో',
    content: 'ఈ వీడియో అభిన చారిటబుల్ ట్రస్ట్ హబ్సిగూడ టైలరింగ్ శిక్షణా కేంద్రాన్ని మీకు పరిచయం చేస్తుంది. ఇక్కడ 200 కంటే ఎక్కువ మంది గ్రామీణ మహిళలు నైపుణ్యాన్ని నేర్చుకుని ఆర్థిక స్వాతంత్ర్యం సాధించారు. మూడు నెలల బ్యాచ్ కార్యక్రమాలు, ముడి సామగ్రి సరఫరా మరియు స్థానిక దుస్తుల వ్యాపారాలతో అనుసంధానం చేయడం జరుగుతుంది.',
    videoUrl: 'https://www.youtube.com/watch?v=DHpQ1YuyOSM',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'videos', source: 'అభిన ట్రస్ట్ ఫిల్మ్స్', language: 'te', isLive: false, isPublished: true,
    publishedAt: new Date('2025-06-15'),
  },
  {
    title: 'అభిన చారిటబుల్ ట్రస్ట్ 7 సంవత్సరాల నిస్వార్థ సేవ పూర్తి',
    content: 'అభిన చారిటబుల్ ట్రస్ట్ తెలంగాణ మరియు ఆంధ్రప్రదేశ్ అంతటా సమాజాలకు ఏడేళ్ళ నిరంతర సేవ పూర్తి చేసింది. 2018 నుండి ట్రస్ట్ ఆరోగ్యం, విద్య, నీరు, పర్యావరణం, విపత్తు సహాయం, న్యాయ సహాయం మరియు జీవనాధారాలు వంటి 16 విభాగాలలో 20,000 మంది జీవితాలను ప్రభావితం చేసింది. ట్రస్ట్ పూర్తి ఆర్థిక పారదర్శకత మరియు వార్షిక ఆడిటెడ్ ఖాతాలను ప్రచురిస్తుంది.',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    category: 'press_notes', source: 'అభిన కమ్యూనికేషన్స్', language: 'te', isLive: false, isPublished: true,
    publishedAt: new Date('2025-04-12'),
  },
  {
    title: 'చర్చ: CSR నిధులు స్థానిక NGOలకు దారి మళ్ళించాలా?',
    content: 'అభిన చారిటబుల్ ట్రస్ట్ నిర్వహించిన రౌండ్‌టేబుల్ చర్చలో కార్పొరేట్ CSR నిర్వాహకులు, సామాజిక కార్యకర్తలు మరియు విధాన నిపుణులు పాల్గొన్నారు. స్థానిక NGOలకు CSR నిధులు అందించడం వల్ల సమాజానికి ఎక్కువ ప్రయోజనం చేకూరుతుందా అనే అంశంపై లోతైన చర్చ జరిగింది. నిర్దిష్ట సిఫార్సులు కార్పొరేట్ వ్యవహారాల మంత్రిత్వ శాఖకు సమర్పించనున్నారు.',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    category: 'debates', source: 'అభిన ఫోరం', language: 'te', isLive: false, isPublished: true,
    publishedAt: new Date('2025-02-14'),
  },

  // ── Tamil ──
  {
    title: 'அபினா அறக்கட்டளை இலவச மருத்துவ முகாம் — 400+ நோயாளிகளுக்கு சேவை',
    content: 'அபினா சாரிட்டபிள் ட்ரஸ்ட் ஞாயிற்றுக்கிழமை ஹப்சிகுடா மையத்தில் இலவச மருத்துவ முகாம் நடத்தியது. இதயவியல், பொது மருத்துவம், எலும்பியல் மற்றும் மகளிர் மருத்துவம் ஆகிய துறைகளிலிருந்து மருத்துவர்கள் கலந்துகொண்டனர். 400க்கும் மேற்பட்ட நோயாளிகளுக்கு ஆலோசனை, மருந்துகள் மற்றும் நோயறிதல் சோதனைகள் இலவசமாக வழங்கப்பட்டன.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    category: 'latest_news', source: 'அபினா ட்ரஸ்ட்', language: 'ta', isLive: false, isPublished: true,
    publishedAt: new Date('2025-07-01'),
  },
  {
    title: 'அபினா ட்ரஸ்ட் — பெண்கள் வலுவூட்டல்: தையல் பயிற்சி மையம் வீடியோ',
    content: 'இந்த வீடியோ அபினா சாரிட்டபிள் ட்ரஸ்டின் ஹப்சிகுடா தையல் மற்றும் தொழிற்கல்வி பயிற்சி மையத்தை உங்களுக்கு அறிமுகப்படுத்துகிறது. 200க்கும் மேற்பட்ட கிராமப்புற பெண்கள் ஒரு தொழிலை கற்று நிதி சுதந்திரம் பெற்றுள்ளனர். மூன்று மாத தொகுதி திட்டங்கள் நடத்தப்படுகின்றன.',
    videoUrl: 'https://www.youtube.com/watch?v=DHpQ1YuyOSM',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'videos', source: 'அபினா ட்ரஸ்ட் திரைப்படங்கள்', language: 'ta', isLive: false, isPublished: true,
    publishedAt: new Date('2025-06-15'),
  },
  {
    title: 'அபினா சாரிட்டபிள் ட்ரஸ்ட் 7 ஆண்டுகள் சேவை நிறைவு',
    content: 'அபினா சாரிட்டபிள் ட்ரஸ்ட் தெலங்கானா மற்றும் ஆந்திரப் பிரதேசம் முழுவதும் 7 ஆண்டுகள் தடைவிலா சேவையை நிறைவு செய்கிறது. 2018 முதல் ட்ரஸ்ட் சுகாதாரம், கல்வி, நீர், சுற்றுச்சூழல் உட்பட 16 துறைகளில் 20,000க்கும் மேற்பட்ட வாழ்வுகளை பாதித்துள்ளது.',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    category: 'press_notes', source: 'அபினா தகவல்தொடர்பு', language: 'ta', isLive: false, isPublished: true,
    publishedAt: new Date('2025-04-12'),
  },
  {
    title: 'விவாதம்: CSR நிதிகள் உள்ளூர் தன்னார்வ நிறுவனங்களுக்கு திருப்பிவிட வேண்டுமா?',
    content: 'அபினா சாரிட்டபிள் ட்ரஸ்ட் நடத்திய கலந்தாய்வில் கார்ப்பரேட் CSR தலைவர்கள், சமூக பணியாளர்கள் மற்றும் கொள்கை நிபுணர்கள் கலந்துகொண்டனர். இந்திய நிறுவனங்கள் தங்களது கட்டாய CSR செலவினங்களை தேசிய அடிப்படையிலான பெரிய அறக்கட்டளைகளை விட உள்ளூர் NGOக்களுக்கு திருப்பிவிட வேண்டுமா என்று விவாதிக்கப்பட்டது.',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    category: 'debates', source: 'அபினா மன்றம்', language: 'ta', isLive: false, isPublished: true,
    publishedAt: new Date('2025-02-14'),
  },

  // ── Kannada ──
  {
    title: 'ಅಭಿನ ಚಾರಿಟೇಬಲ್ ಟ್ರಸ್ಟ್ ಹಬ್ಸಿಗೂಡದಲ್ಲಿ ಉಚಿತ ವೈದ್ಯಕೀಯ ಶಿಬಿರ — 400+ ರೋಗಿಗಳಿಗೆ ಸೇವೆ',
    content: 'ಅಭಿನ ಚಾರಿಟೇಬಲ್ ಟ್ರಸ್ಟ್ ಭಾನುವಾರ ತನ್ನ ಹಬ್ಸಿಗೂಡ ಕೇಂದ್ರದಲ್ಲಿ ಉಚಿತ ವೈದ್ಯಕೀಯ ಶಿಬಿರವನ್ನು ಆಯೋಜಿಸಿತು. ಕಾರ್ಡಿಯಾಲಜಿ, ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ, ಆರ್ಥೋಪೆಡಿಕ್ಸ್ ಮತ್ತು ಗೈನಕಾಲಜಿ ವಿಭಾಗಗಳ ವೈದ್ಯರು ಭಾಗವಹಿಸಿದರು. 400 ಕ್ಕಿಂತ ಹೆಚ್ಚು ರೋಗಿಗಳಿಗೆ ಸಮಾಲೋಚನೆ, ಔಷಧಗಳು ಮತ್ತು ರೋಗನಿರ್ಣಯ ಪರೀಕ್ಷೆಗಳನ್ನು ಉಚಿತವಾಗಿ ನೀಡಲಾಯಿತು.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    category: 'latest_news', source: 'ಅಭಿನ ಟ್ರಸ್ಟ್', language: 'kn', isLive: false, isPublished: true,
    publishedAt: new Date('2025-07-01'),
  },
  {
    title: 'ಅಭಿನ ಟ್ರಸ್ಟ್ — ಮಹಿಳಾ ಸಬಲೀಕರಣ: ಟೈಲರಿಂಗ್ ತರಬೇತಿ ಕೇಂದ್ರ ವೀಡಿಯೊ',
    content: 'ಈ ವೀಡಿಯೊ ಅಭಿನ ಚಾರಿಟೇಬಲ್ ಟ್ರಸ್ಟ್‌ನ ಹಬ್ಸಿಗೂಡ ಟೈಲರಿಂಗ್ ಮತ್ತು ವೃತ್ತಿಪರ ತರಬೇತಿ ಕೇಂದ್ರವನ್ನು ನಿಮಗೆ ಪರಿಚಯಿಸುತ್ತದೆ. 200 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಗ್ರಾಮೀಣ ಮಹಿಳೆಯರು ಒಂದು ಕೌಶಲ್ಯ ಕಲಿತು ಆರ್ಥಿಕ ಸ್ವಾತಂತ್ರ್ಯ ಪಡೆದಿದ್ದಾರೆ.',
    videoUrl: 'https://www.youtube.com/watch?v=DHpQ1YuyOSM',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'videos', source: 'ಅಭಿನ ಟ್ರಸ್ಟ್ ಚಲನಚಿತ್ರಗಳು', language: 'kn', isLive: false, isPublished: true,
    publishedAt: new Date('2025-06-15'),
  },
  {
    title: 'ಅಭಿನ ಚಾರಿಟೇಬಲ್ ಟ್ರಸ್ಟ್ 7 ವರ್ಷಗಳ ಸೇವೆ ಪೂರ್ಣ',
    content: 'ಅಭಿನ ಚಾರಿಟೇಬಲ್ ಟ್ರಸ್ಟ್ ತೆಲಂಗಾಣ ಮತ್ತು ಆಂಧ್ರಪ್ರದೇಶದಾದ್ಯಂತ ಸಮಾಜಗಳಿಗೆ ಏಳು ವರ್ಷಗಳ ನಿರಂತರ ಸೇವೆಯನ್ನು ಗುರುತಿಸಿದೆ. 2018 ರಿಂದ ಟ್ರಸ್ಟ್ ಆರೋಗ್ಯ, ಶಿಕ್ಷಣ, ನೀರು ಸೇರಿದಂತೆ 16 ವಿಭಾಗಗಳಲ್ಲಿ 20,000 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಜೀವನಗಳ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರಿದೆ.',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    category: 'press_notes', source: 'ಅಭಿನ ಸಂವಹನ', language: 'kn', isLive: false, isPublished: true,
    publishedAt: new Date('2025-04-12'),
  },
  {
    title: 'ಚರ್ಚೆ: CSR ನಿಧಿಗಳನ್ನು ಸ್ಥಳೀಯ NGO ಗಳಿಗೆ ನಿರ್ದೇಶಿಸಬೇಕೇ?',
    content: 'ಅಭಿನ ಚಾರಿಟೇಬಲ್ ಟ್ರಸ್ಟ್ ಆಯೋಜಿಸಿದ ಸುತ್ತಲು ಮೇಜಿನ ಚರ್ಚೆಯಲ್ಲಿ ಕಾರ್ಪೊರೇಟ್ CSR ಮುಖ್ಯಸ್ಥರು, ಸಮಾಜ ಕಾರ್ಯಕರ್ತರು ಮತ್ತು ನೀತಿ ತಜ್ಞರು ಭಾಗವಹಿಸಿದರು. ಭಾರತೀಯ ಕಂಪನಿಗಳು ತಮ್ಮ ಕಡ್ಡಾಯ CSR ವೆಚ್ಚವನ್ನು ಸ್ಥಳೀಯ NGO ಗಳಿಗೆ ತಿರುಗಿಸಬೇಕೇ ಎಂದು ಚರ್ಚಿಸಲಾಯಿತು.',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    category: 'debates', source: 'ಅಭಿನ ವೇದಿಕೆ', language: 'kn', isLive: false, isPublished: true,
    publishedAt: new Date('2025-02-14'),
  },

  // ── Malayalam ──
  {
    title: 'അഭിന ചാരിറ്റബിൾ ട്രസ്റ്റ് ഹബ്സിഗൂഡയിൽ സൗജന്യ മെഡിക്കൽ ക്യാമ്പ് — 400+ രോഗികൾക്ക് സേവനം',
    content: 'അഭിന ചാരിറ്റബിൾ ട്രസ്റ്റ് ഞായറാഴ്ച ഹബ്സിഗൂഡ കേന്ദ്രത്തിൽ ഒരു സൗജന്യ മെഡിക്കൽ ക്യാമ്പ് സംഘടിപ്പിച്ചു. കാർഡിയോളജി, ജനറൽ മെഡിസിൻ, ഓർത്തോപീഡിക്സ്, ഗൈനക്കോളജി വിഭാഗങ്ങളിൽ നിന്നുള്ള ഡോക്ടർമാർ പങ്കെടുത്തു. 400-ലധികം ആളുകൾക്ക് കൂടിയാലോചനകളും മരുന്നുകളും ഡയഗ്നോസ്റ്റിക് പരിശോധനകളും സൗജന്യമായി നൽകി.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    category: 'latest_news', source: 'അഭിന ട്രസ്റ്റ്', language: 'ml', isLive: false, isPublished: true,
    publishedAt: new Date('2025-07-01'),
  },
  {
    title: 'അഭിന ട്രസ്റ്റ് — സ്ത്രീ ശാക്തീകരണം: തയ്യൽ പരിശീലന കേന്ദ്രം വീഡിയോ',
    content: 'ഈ വീഡിയോ അഭിന ചാരിറ്റബിൾ ട്രസ്റ്റിന്റെ ഹബ്സിഗൂഡ തയ്യൽ, തൊഴിൽ പരിശീലന കേന്ദ്രം നിങ്ങൾക്ക് പരിചയപ്പെടുത്തുന്നു. 200-ലധികം ഗ്രാമീണ സ്ത്രീകൾ ഒരു തൊഴിൽ പഠിച്ചു സാമ്പത്തിക സ്വാതന്ത്ര്യം നേടി. മൂന്ന് മാസ ബാച്ച് പ്രോഗ്രാമുകൾ, അസംസ്‌കൃത വസ്തുക്കൾ വിതരണം ചെയ്യുകയും ബിരുദ ധാരികളെ തദ്ദേശ വ്യവസായങ്ങളുമായി ബന്ധിപ്പിക്കുകയും ചെയ്യുന്നു.',
    videoUrl: 'https://www.youtube.com/watch?v=DHpQ1YuyOSM',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'videos', source: 'അഭിന ട്രസ്റ്റ് ഫിലിംസ്', language: 'ml', isLive: false, isPublished: true,
    publishedAt: new Date('2025-06-15'),
  },
  {
    title: 'അഭിന ചാരിറ്റബിൾ ട്രസ്റ്റ് 7 വർഷത്തെ സേവനം പൂർത്തിയാക്കി',
    content: 'അഭിന ചാരിറ്റബിൾ ട്രസ്റ്റ് തെലങ്കാനയിലും ആന്ധ്രാ പ്രദേശിലുമുള്ള കമ്മ്യൂണിറ്റികൾക്ക് ഏഴ് വർഷത്തെ നിരന്തര സേവനം അടയാളപ്പെടുത്തുന്നു. 2018 മുതൽ ട്രസ്റ്റ് ആരോഗ്യം, വിദ്യാഭ്യാസം, ജലം, പരിസ്ഥിതി, ദുരന്ത നിവാരണം, നിയമ സഹായം, ഉപജീവനം എന്നിവ ഉൾക്കൊള്ളുന്ന 16 വകുപ്പുകളിൽ 20,000-ലധികം ജീവിതങ്ങളെ ബാധിച്ചിട്ടുണ്ട്.',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    category: 'press_notes', source: 'അഭിന കമ്മ്യൂണിക്കേഷൻസ്', language: 'ml', isLive: false, isPublished: true,
    publishedAt: new Date('2025-04-12'),
  },
  {
    title: 'ചർച്ച: CSR ഫണ്ടുകൾ പ്രാദേശിക NGO-കൾക്ക് നൽകണമോ?',
    content: 'അഭിന ചാരിറ്റബിൾ ട്രസ്റ്റ് ആതിഥ്യം വഹിച്ച ഒരു വൃത്താകൃതിയിലുള്ള ചർച്ചയിൽ കോർപ്പറേറ്റ് CSR തലവന്മാർ, സോഷ്യൽ വർക്കർമാർ, നയ വിദഗ്ദ്ധർ എന്നിവർ ഒത്തുചേർന്നു. ഇന്ത്യൻ കമ്പനികൾ അവരുടെ നിർബന്ധിത CSR ചെലവ് വലിയ ദേശീയ ഫൗണ്ടേഷനുകളേക്കാൾ പ്രാദേശിക NGO-കൾക്ക് നൽകണമോ എന്ന് ചർച്ച ചെയ്തു.',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    category: 'debates', source: 'അഭിന ഫോറം', language: 'ml', isLive: false, isPublished: true,
    publishedAt: new Date('2025-02-14'),
  },
];

// ── SEED ──────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGO_URI!);
  console.log('Connected to MongoDB');

  // News (English)
  const existingNews = await News.countDocuments();
  if (existingNews > 0) {
    console.log(`Skipping News — ${existingNews} records already exist. Delete them first if you want to re-seed.`);
  } else {
    await News.insertMany(newsData);
    console.log(`Seeded ${newsData.length} news articles.`);
  }

  // Multilingual news — insert per language if not already seeded
  for (const lang of ['te', 'ta', 'kn', 'ml']) {
    const existingLang = await News.countDocuments({ language: lang });
    if (existingLang > 0) {
      console.log(`Skipping ${lang} news — ${existingLang} records already exist.`);
    } else {
      const langData = multiLangNews.filter(n => n.language === lang);
      await News.insertMany(langData);
      console.log(`Seeded ${langData.length} ${lang} news articles.`);
    }
  }

  // Gallery
  const existingGallery = await Gallery.countDocuments();
  if (existingGallery > 0) {
    console.log(`Skipping Gallery — ${existingGallery} records already exist. Delete them first if you want to re-seed.`);
  } else {
    await Gallery.insertMany(galleryData);
    console.log(`Seeded ${galleryData.length} gallery images.`);
  }

  // Applications
  const existingApps = await Application.countDocuments();
  if (existingApps > 0) {
    console.log(`Skipping Applications — ${existingApps} records already exist. Delete them first if you want to re-seed.`);
  } else {
    await Application.insertMany(applicationData);
    console.log(`Seeded ${applicationData.length} applications.`);
  }

  console.log('Content seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
