export interface BoardMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  bio: string[];
}

export interface OutreachEvent {
  id: string;
  slug: string;
  title: string;
  date: string;
  sortDate: string;
  category: 'local-fair' | 'international-mission' | 'youth-education' | 'announcement';
  categoryLabel: string;
  location: string;
  summary: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
  partners?: string[];
  sponsors?: string[];
  sections?: { heading: string; body: string }[];
  bodyParagraphs: string[];
  images: string[];
  featured?: boolean;
}

export interface AreaOfNeed {
  index: string;
  title: string;
  description: string;
}

export interface GalleryCollection {
  id: string;
  title: string;
  date: string;
  location: string;
  category: 'local-fair' | 'international-mission' | 'youth-education';
  categoryLabel: string;
  description: string;
  images: string[];
  linkedUpdateSlug?: string;
}

function galleryRange(prefix: string, start: number, end: number): string[] {
  const list: string[] = [];
  for (let i = start; i <= end; i += 1) {
    list.push(`/media/gallery/${prefix}-${String(i).padStart(2, '0')}.jpg`);
  }
  return list;
}

export const SITE_INFO = {
  name: 'Eagles Wings Network',
  shortName: 'EWN',
  tagline: 'Soaring for Health, Healing, and Hope, one flight at a time!',
  subtitle: 'Compassion Takes Flight',
  footerTagline: 'Eagles Wings Network – Health, Healing, & Hope',
  email: 'eagleswingsnetwork@gmail.com',
  zelleEmail: 'eagleswingsnetwork@gmail.com',
  facebookUrl:
    'https://www.facebook.com/people/Eagles-Wings-Network/61561639737214/?mibextid=LQQJ4d',
  logo: '/media/logo.png',
  missionBanner: '/media/mission-banner.png',
};

export const HERO_CONTENT = {
  kicker: 'Health, Healing, & Hope',
  headline: 'Soaring for Health, Healing, and Hope, one flight at a time.',
  paragraphs: [
    'Eagles Wings is dedicated to extending a lifeline of medical and food aid to those in need. Our mission is to bridge the gap between health disparities, delivering care, compassion, and hope to communities around the world.',
    'At Eagles Wings, we take flight to places where access to essential medicines and food is scarce, providing access to vital care and aid these communities often lack. We aim to be a heartbeat in our existing communities and support those who don’t have access to vital life resources. With your support, we can continue to bring medical miracles and food reprieve to these communities and be the difference they’ve been waiting for.',
  ],
};

export const MISSION_AND_PURPOSE = {
  missionStatement:
    'The mission of the Eagles Wings Network is to create, replicate, and support dynamic grassroots-based networks of assistance for individuals, families, and communities that are underserved medically, socially, and economically.',
  purposeStatement:
    'The purpose of the Eagles Wings Network (EWN) is to identify individuals, families, and communities with specific medical, social, and economic needs, and connect them with governmental and non-governmental facilitators of assistance to meet the needs.',
  operationalScope:
    'Eagles Wings Network will operate within the United States of America, as well as internationally by collaborating with local organizations in other countries to carry out its stated purpose.',
  donateCalloutHeading: 'DONATE TODAY!',
  donateCalloutBody:
    'Your donation to Eagles Wings is a lifeline of hope. With your support, we can continue to deliver vital medical aid to those in desperate need. Together, we can heal communities, transform lives, and make a lasting impact on the world. Join us in our mission today!',
};

export const AREAS_OF_NEED: AreaOfNeed[] = [
  {
    index: '01',
    title: 'Access to Food',
    description: 'Access to food especially the prioritizing provision of food for children.',
  },
  {
    index: '02',
    title: 'Access to Clean Water',
    description: 'Access to water, especially in poor rural communities.',
  },
  {
    index: '03',
    title: 'Clothing for Orphans & Widows',
    description: 'Help with clothing needs for orphans and widows in certain communities.',
  },
  {
    index: '04',
    title: 'Shelter Assistance',
    description: 'Help with shelter needs, especially in poor rural communities.',
  },
  {
    index: '05',
    title: 'Healthcare & Medicines',
    description: 'Access to healthcare and help with medicines.',
  },
  {
    index: '06',
    title: 'Education Support',
    description: 'Help with education, especially to orphans.',
  },
  {
    index: '07',
    title: 'Youth Mentoring',
    description:
      'Guiding young people with mentoring programs and community projects that build leadership and confidence.',
  },
];

export const BOARD_OF_DIRECTORS: BoardMember[] = [
  {
    id: 'onyeka-ihezie',
    name: 'Dr. Onyeka Ihezie',
    role: 'Board of Directors',
    specialty: 'Pharmacist & Community Health Educator',
    image: '/media/board-onyeka-ihezie.jpg',
    bio: [
      'A passionate pharmacist, embarked on a natural hair care journey over a decade ago. Frustrated by the lack of suitable and clean products, she delved into extensive research, crafting clean, all-natural hair, skin, and body care items.',
      'Driven by a mission to educate, she partnered with organizations like Commonground and The Black Girl Tribe, providing over $2,000 worth of handmade products to empower women. With a thriving impact, her creations have reached diverse locations, generating over $50,000 in revenue and emphasizing the importance of embracing natural beauty and health.',
    ],
  },
  {
    id: 'vivian-nzedu',
    name: 'Dr. Vivian Nzedu',
    role: 'Board of Directors',
    specialty: 'Board-Certified Pediatrician, FAAP',
    image: '/media/board-vivian-nzedu.jpg',
    bio: [
      'A board certified pediatrician with special interests in both acute care and preventive care pediatrics. She is particularly passionate about immunization and disease prevention but also enjoys partnering with families to provide timely, evidenced based and compassionate care to sick patients.',
      'Dr Nzedu is a fellow of the American Academy of Pediatrics. She brings her vast clinical experience that spans across more than 2 decades to each child and family she is privileged to care for. Since completing her medical training and the subsequent Pediatric Residency and Chief residency in New York, Dr Nzedu has held numerous faculty positions prior to moving to the northern Virginia area where she currently resides with her family.',
      'When she is not working, Dr Nzedu enjoys youth sports, reading, being outdoors and traveling with her family. She is a proud member of the African Christian Fellowship where she volunteers and continues to serve in various capacities at her local chapter and regional levels.',
    ],
  },
  {
    id: 'ijeoma-ozed-williams',
    name: 'Dr. Ijeoma Ozed-Williams',
    role: 'Board of Directors',
    specialty: 'Obstetrician-Gynecologist (Retired)',
    image: '/media/board-ijeoma-ozed-williams.jpg',
    bio: [
      'A seasoned obstetrician-gynecologist whose profound dedication to women’s health has been a hallmark of a distinguished career in medicine. Having recently retired from clinical practice after several decades, she brings a wealth of experience and unwavering commitment to advancing women and children’s health through a transition into a non-profit sector.',
      'Ijeoma is dedicated to the holistic care of women across diverse cultural and socio-economic backgrounds. She is passionately dedicated to community outreach programs and healthcare initiatives that seek to breach healthcare access for everyone by empowering them at the grassroot level.',
      'Currently, Dr. Ozed-Williams is engaged in the training and mentoring of the next generation of healthcare professionals. She brings a passion and drive to enrich a global initiative and create meaningful and sustainable impacts that leaves a legacy of care.',
    ],
  },
  {
    id: 'veronica-archibong-david',
    name: 'Veronica Archibong David',
    role: 'Board of Directors',
    specialty: 'Family Nurse Practitioner, MSN, RN',
    image: '/media/board-veronica-david.jpg',
    bio: [
      'Veronica was born in Nigeria, west Africa and was raised by a single parent. She migrated to United States after graduation from college in Africa with BA in Eng/Ed. In the US, she started a career in nursing as a nurse aide. She later obtained an associate degree in nursing from Montgomery Community College, worked for some years, went back to school in 2016 and obtained her BSN and MSN from Chamberlain University.',
      'Her experience growing up as a child instilled in her the spirit of appreciation, hard work, and an interest in serving the underprivileged population. She is particularly passionate about caring for the elderly and children, especially disadvantaged and special need children. Her work experience with Prince George’s County Public Schools as a school nurse for many years, caring for special-needs children developed in her a deep passion for helping the disadvantaged population.',
      'She has extensive experience in nursing. She is currently working in a community hospital, and also works as a Family Nurse Practitioner for an insurance organization. She recently completed a post-master’s certification Program from GWU in Geriatric complex care.',
      'Within her own community, Veronica served in her local church as a council member for nine years under the leadership of Late Dr, Rev. Basil Osuji. She currently serves as youth mentor and occasionally acts as the youth chaperone in her local church. She enjoys cooking, reading, and traveling.',
    ],
  },
  {
    id: 'abigail-osuji',
    name: 'Pastor Abigail Osuji',
    role: 'Board of Directors',
    specialty: 'Ordained Minister & Food Bank Coordinator',
    image: '/media/board-abigail-osuji.jpg',
    bio: [
      'Reverend Abigail Osuji stands as a seasoned and ordained minister with an enriching journey spanning more than three decades. Currently serving as a pastor in the Atlantic District of the International Church of the Foursquare Gospel, Pastor Abigail brings a profound wealth of spiritual wisdom and a heartfelt commitment to her congregation.',
      'While working as a Christian missionary in Hong Kong for 15 years, Pastor Abigail also served as Senior Pastor of her church. In addition to her work in Hong Kong, Pastor Abigail went on short mission trips to Taiwan, South Korea, the Philippines, and other far East Asian countries.',
      'Pastor Abigail serves as a diligent leader and coordinator of the food bank operated by the local Foursquare church in Beltsville, Maryland. Over the years, she has served as the head of Women Ministry in her local Foursquare Church. Beyond the local community, Pastor Abigail has continued to be an active participant in Christian mission trips, extending the reach of her ministry to places like Nicaragua.',
      'Family holds a special place in Pastor Abigail’s heart, and she is a dedicated mother to three children. Pastor Abigail Osuji’s life is a testament to her enduring faith, compassionate service, and dedication to both her local and global communities. As a leader, mother, and humanitarian, she embodies the principles of love, hospitality, and faith. Pastor Abigail stands as a pillar of inspiration and compassion in the Prince George’s County community and beyond.',
    ],
  },
  {
    id: 'fred-hutchinson',
    name: 'Fred Hutchinson',
    role: 'Board of Directors',
    specialty: 'Community Operations & Business Advisor',
    image: '/media/board-fred-hutchinson.jpg',
    bio: [
      'Fred Hutchinson was born in Washington D.C. in the United States. He was raised in the suburbs of Maryland. While attending high school, he studied graphic arts and printing.',
      'After graduating high school, he held various jobs, including driving buses and electrical apprenticeship. He retired in 2018, having worked for Giant Food for thirty-seven years. Fred’s life interests include being with people, business, and flower gardening.',
    ],
  },
  {
    id: 'hajara-mdurvwa',
    name: 'Hajara Mdurvwa',
    role: 'Financial Secretary & Board Member',
    specialty: 'Registered Nurse & Medical Missions Veteran',
    image: '/media/board-hajara-mdurvwa.png',
    bio: [
      'Our Financial Secretary, Hajara Mdurvwa, was born and raised in Nigeria and attended ATC Maiduguri, Borno state. Then she moved to the USA in 1986.',
      'She attended Tuskegee University Alabama and earned a nursing diploma at Tuskegee Community College, and has worked as a nurse since then.',
      '“I have participated in few medical term missions, founder and co-founders of some NGOs in the past.”',
    ],
  },
  {
    id: 'ugonma-okparaocha',
    name: 'Dr. Ugonma Okparaocha',
    role: 'Board of Directors',
    specialty: 'Board-Certified Pediatrician & Missions Leader',
    image: '/media/board-ugonma-okparaocha.jpg',
    bio: [
      'Dr. Ugonma Okparaocha is a distinguished and highly experienced board-certified pediatrician with an impressive career spanning over 30 years. She is also a Fellow of the West African College of Physicians, showcasing her commitment to excellence and expertise in the field of pediatrics. Throughout her extensive journey in pediatrics, Dr. Okparaocha has not only provided exceptional medical care but has also become a beacon of compassion and empathy.',
      'In addition to her professional achievements, Dr. Okparaocha has been a steadfast pillar in the Prince George’s County area of Maryland, USA, for the past 11 years. She has passionately served as a youth coordinator and mentor, dedicating her time to guiding and inspiring the next generation. Through various initiatives, she has brought together community members, local organizations, and healthcare professionals to work towards common goals, creating a network of support for the overall well-being of the community.',
      'Recognizing the importance of healthcare outreach, Dr. Okparaocha has been a driving force behind numerous medical missions. She is a diligent organizer and leader of medical missions both in Africa and the United States, contributing to the improvement of healthcare in underserved communities. Notably, Dr. Okparaocha has been an active participant in Christian mission trips to Cuba and Nicaragua.',
      'Outside of her professional and philanthropic endeavors, Dr. Okparaocha is a dedicated mother of three children. In her free time, she is an avid gardener and enjoys engaging in intellectually stimulating indoor games, with Scrabble being one of her favorites.',
    ],
  },
];

export const OUTREACH_EVENTS: OutreachEvent[] = [
  {
    id: 'riverdale-sept-2025',
    slug: 'food-and-health-fair-riverdale-maryland-september-2025',
    title: 'Food and Health Fair: Riverdale, Maryland – September 2025',
    date: 'September 22, 2025',
    sortDate: '2025-09-22',
    category: 'local-fair',
    categoryLabel: 'Local Community Outreach',
    location: 'Parkview Gardens Apartments · Riverdale, Maryland',
    featured: true,
    summary:
      'On Saturday, September 13, 2025, Eagles Wings Network partnered with Glory of Christ Church to serve 135 people—including refugees and recent immigrants from Afghanistan, Somalia, and Eritrea—with groceries, health screenings, and wellness education.',
    highlights: [
      'Nutritious groceries: Families received free bags of food, helping address the urgent need for access to food in vulnerable households.',
      'Healthcare access: Volunteer medical professionals conducted free blood pressure and blood sugar screenings, ensuring attendees could take steps toward better health.',
      'Wellness support: Free healthcare products such as vitamins, and first-aid supplies were distributed to support ongoing wellness.',
      'Health education: Attendees received guidance on nutrition, disease prevention, and daily wellness practices, reinforcing the importance of health education.',
    ],
    metrics: [
      { label: 'Individuals Served', value: '135' },
      { label: 'Event Date', value: 'Sept 13, 2025' },
      { label: 'Partner Church', value: 'Glory of Christ' },
    ],
    partners: ['Glory of Christ Church'],
    bodyParagraphs: [
      'On Saturday, September 13, 2025, Eagles Wings Network partnered with Glory of Christ Church to host a Food and Health Fair at Parkview Gardens Apartments in Riverdale, Maryland. This outreach provided practical support and compassion to families who often face barriers to access to food and access to healthcare.',
      'A total of 135 people were served, many of them refugees and recent immigrants from Afghanistan, Somalia, Eritrea, and other underserved communities. For the attendees, this event provided groceries and health screenings.',
      'Eagles Wings Network thrives through volunteers and donors who help us expand access to food, access to healthcare, and health education for more families. Your partnership enables us to continue delivering food, screenings, and education to underserved neighbors.',
    ],
    images: [
      '/media/riverdale-2025-1.jpg',
      '/media/riverdale-2025-2.jpg',
      '/media/riverdale-2025-3.jpg',
      ...galleryRange('food-and-health-fair-riverdale-maryland-september-2025', 1, 6),
    ],
  },
  {
    id: 'supporting-healthcare-2025',
    slug: 'supporting-healthcare-and-nutrition-in-underserved-communities',
    title: 'Supporting Healthcare and Nutrition in Underserved Communities',
    date: 'September 11, 2025',
    sortDate: '2025-09-11',
    category: 'announcement',
    categoryLabel: 'Program Brief',
    location: 'United States & International',
    summary:
      'An overview of Eagles Wings Network’s four core pillars—Access to Food, Access to Healthcare, Education Support, and Youth Mentoring & Empowerment—and how community partnerships bridge health disparities.',
    highlights: [
      'Access to Food – Supplying nutritious meals and groceries, especially prioritizing children’s needs.',
      'Access to Healthcare – Offering free clinics, medical screenings, and donated medicines so that families can receive care and prescriptions.',
      'Education Support – Providing school supplies and health education to students and orphans, empowering them to learn and stay healthy.',
      'Youth Mentoring & Empowerment – Guiding young people with mentoring programs and community projects that build leadership and confidence.',
    ],
    metrics: [
      { label: 'Core Focus Pillars', value: '4' },
      { label: 'Reach', value: 'Local & Global' },
    ],
    partners: ['Glory of Christ Church', 'Local Churches & Sponsors'],
    bodyParagraphs: [
      'Eagles Wings Network is dedicated to extending a lifeline of medical and food aid to those in need. Our mission is “to create, replicate, and support dynamic grassroots-based networks of assistance” for individuals, families, and communities that are underserved medically, socially, and economically.',
      'In practice, we seek to bridge health disparities by providing essential resources where they’re scarce: delivering food, medicines, and compassionate care to communities lacking access to food and healthcare. By working closely with local churches and partners, Eagles Wings brings hope and practical support directly to neighborhoods in need.',
      'Each initiative is volunteer-driven, with donations of food, hygiene products, and medicines fueling the work. With your help, we can continue to bring “medical miracles and food reprieve” to communities in need.',
    ],
    images: ['/media/mission-banner.png'],
  },
  {
    id: 'nigeria-outreach-2024',
    slug: 'nigeria-health-outreach-2024',
    title: 'Nigeria Health Outreach 2024',
    date: 'December 26, 2024',
    sortDate: '2024-12-26',
    category: 'international-mission',
    categoryLabel: 'International Medical Mission',
    location: 'Mbato Ofeme, Umuahia, Nigeria',
    featured: true,
    summary:
      'A 12-person team of four providers, two nurses, and six volunteers treated 205 individuals at no cost—offering blood sugar and blood pressure testing, medications, reading glasses, dental supplies, and multivitamins.',
    highlights: [
      'Treated malaria, parasitic infestations, skin infections, hypertension, diabetes, and ear infections.',
      'Conducted blood testing for diabetes and blood pressure measurements.',
      'Provided all medical services and medications at no cost until all medications were finished.',
      'Distributed free reading glasses, toothbrushes, toothpastes, and multivitamin supplements.',
    ],
    metrics: [
      { label: 'Individuals Assisted', value: '205' },
      { label: 'Providers & Nurses', value: '6' },
      { label: 'Additional Volunteers', value: '6' },
    ],
    sponsors: [
      'Apex Pharmacy, Washington DC (donated medications)',
      'Growing Smiles Dentistry, Bel Air, Maryland (donated toothbrushes and toothpastes)',
    ],
    bodyParagraphs: [
      'The health fair at Mbato Ofeme, Umuahia, Nigeria took place on December 26, 2024. There were four providers, two nurses and six other volunteers. A total of 205 individuals received healthcare assistance.',
      'Common ailments were treated including malaria, parasitic infestations, skin infections, hypertension, diabetes, and ear infections. Blood testing for diabetes was done and blood pressure measurements were done. All services and medications were provided at no cost to the participants.',
      'Additionally, free items given out include reading glasses, toothbrushes, toothpastes, and multivitamin supplements. The health outreach continued until all medications were finished. We are grateful to all sponsors including Apex Pharmacy, Washington DC that donated some medications; and Growing Smiles Dentistry, Bel Air, Maryland that donated toothbrushes and toothpastes.',
    ],
    images: [
      '/media/nigeria-2024-1.jpg',
      '/media/nigeria-2024-2.jpg',
      '/media/nigeria-2024-3.jpg',
      '/media/nigeria-2024-4.jpg',
      ...galleryRange('nigeria-health-outreach-2024', 1, 22),
    ],
  },
  {
    id: 'back-to-school-2024',
    slug: '2024-back-to-school-drive',
    title: '2024 Back to School Drive',
    date: 'August 2024',
    sortDate: '2024-08-15',
    category: 'youth-education',
    categoryLabel: 'Education & Youth Drive',
    location: 'Maryland Community Outreach',
    summary:
      'In August 2024, Eagles Wings Network held its first annual Back to School Drive—combining free food distribution, blood pressure and sugar measurement, and health education with pens, pencils, folders, and notebooks for students.',
    highlights: [
      'Distributed school supplies including pens, pencils, folders, notebooks, and more.',
      'Provided free food distribution alongside student supply kits.',
      'Offered blood pressure and blood sugar measurements plus community health education.',
    ],
    metrics: [
      { label: 'Inaugural Edition', value: 'Aug 2024' },
      { label: 'Services', value: 'Supplies + Health' },
    ],
    bodyParagraphs: [
      'This August, we held our first ever annual Back to School Drive! In addition to our usual free food distribution, blood pressure and sugar measurement, and health education, we gave out school supplies like the following: pens and pencils, folders, notebooks, and so much more!',
    ],
    images: [
      '/media/back-to-school-1.jpg',
      '/media/back-to-school-2.jpg',
      '/media/back-to-school-3.jpg',
      ...galleryRange('2024-back-to-school-drive', 1, 12),
    ],
  },
  {
    id: 'victoria-park-manor-2024',
    slug: 'victoria-park-manor-outreach',
    title: 'Victoria Park Manor Outreach',
    date: '2024',
    sortDate: '2024-08-01',
    category: 'local-fair',
    categoryLabel: 'Local Community Outreach',
    location: 'Victoria Park Manor, Maryland',
    summary:
      'Community outreach gathering bringing food resources, health wellness support, and neighborhood fellowship directly to residents at Victoria Park Manor.',
    highlights: [
      'Direct on-site neighborhood distribution of essential provisions and wellness resources.',
      'Community engagement led by Eagles Wings Network volunteers.',
    ],
    metrics: [{ label: 'Initiative Year', value: '2024' }],
    bodyParagraphs: [
      'Eagles Wings Network volunteers connected directly with residents at Victoria Park Manor to share vital food aid, neighborhood hospitality, and health outreach resources.',
    ],
    images: [
      '/media/victoria-park-1.jpg',
      '/media/victoria-park-2.jpg',
      ...galleryRange('victoria-park-manor-outreach', 1, 14),
    ],
  },
  {
    id: 'first-fruits-collaboration-2024',
    slug: 'first-fruits-collaboration',
    title: 'First Fruits Collaboration',
    date: '2024',
    sortDate: '2024-07-20',
    category: 'local-fair',
    categoryLabel: 'Food Security Partnership',
    location: 'Maryland',
    summary:
      'Collaborative food supply partnership with First Fruit Farms providing fresh agricultural produce and groceries for local Maryland health and food fairs.',
    highlights: [
      'Fresh produce and groceries supplied in partnership with First Fruit Farms.',
      'Distributed at regional Maryland food and health fairs to support families and children.',
    ],
    metrics: [{ label: 'Partner', value: 'First Fruit Farms' }],
    partners: ['First Fruit Farms'],
    bodyParagraphs: [
      'Eagles Wings Network collaborates with First Fruit Farms to supply fresh food and groceries distributed across our Maryland community health and food fairs.',
    ],
    images: [
      '/media/first-fruits-1.jpg',
      '/media/first-fruits-2.jpg',
      ...galleryRange('firsts-fruits-collaboration', 1, 10),
    ],
  },
  {
    id: 'nicaragua-mission-2024',
    slug: 'nicaragua-mission-2024',
    title: 'Nicaragua Mission Trip Report: July 3–12, 2024',
    date: 'July 3–12, 2024',
    sortDate: '2024-07-12',
    category: 'international-mission',
    categoryLabel: 'International Medical & Construction Mission',
    location: 'Managua, Nicaragua',
    featured: true,
    summary:
      'Four EWN-sponsored team members joined 16 mission partners under Pastor Jeff Lamont in Managua—serving an average of 100 patients daily across five communities while completing the roof of a local church.',
    highlights: [
      'Medical team (Hajara, Abigail, and Dr. Ugonma) visited five communities in Managua over five days.',
      'Saw an average of 100 patients daily, diagnosing illnesses, dispensing medications, and providing counseling.',
      'Construction team (including Dabi) completed roofing a church whose walls were erected the prior year.',
    ],
    metrics: [
      { label: 'Daily Clinic Average', value: '~100 pts' },
      { label: 'Communities Visited', value: '5' },
      { label: 'Combined Mission Team', value: '20' },
    ],
    partners: ['Foursquare International Atlantic District (Pastor Jeff Lamont)'],
    sections: [
      {
        heading: 'Arrival and Team Composition',
        body: 'On July 3, 2024, a group of four of us sponsored by the Eagles Wings Network arrived in Managua, Nicaragua. We joined 16 other individuals under the leadership of Pastor Jeff Lamont, Foursquare International Atlantic District Missions Director.',
      },
      {
        heading: 'Initial Days and Team Organization',
        body: 'After a day of rest, we began preparations for our mission work on the third day. The team was divided into three groups: Medical, Construction, and Youth. Hajara, Abigail, and I, Ugonma, served on the Medical team, while Dabi joined the Construction team.',
      },
      {
        heading: 'Medical Team Activities',
        body: 'The Medical team visited five different communities in Managua over five days, conducting clinics and providing medical care to the local population. We saw an average of 100 patients daily, diagnosing illnesses, dispensing medications, offering counseling, and providing anticipatory guidance. The gratitude of the people we served was overwhelming. One memorable moment was when a woman in her 40s hugged me, expressing her deep appreciation for the thorough examination her child received, which she said was unlike anything they had experienced at their local hospital. Many patients had run out of their medications and were thankful for the medicines we provided. Overall, it was a deeply fulfilling experience, and we are grateful to God for the opportunity to serve others.',
      },
      {
        heading: 'Construction Team Achievements',
        body: 'Dabi and the Construction team worked diligently on roofing a church whose walls had been erected by the same team the previous year. Their hard work and dedication were instrumental in completing this significant project.',
      },
      {
        heading: 'Conclusion',
        body: 'The mission trip to Nicaragua was a rewarding experience for all involved. We are thankful for the opportunity to make a positive impact in the communities we served and look forward to future missions.',
      },
    ],
    bodyParagraphs: [
      'On July 3, 2024, a group of four of us sponsored by the Eagles Wings Network arrived in Managua, Nicaragua. We joined 16 other individuals under the leadership of Pastor Jeff Lamont, Foursquare International Atlantic District Missions Director.',
    ],
    images: [
      '/media/nicaragua-2024-1.jpg',
      '/media/nicaragua-2024-2.jpg',
      '/media/nicaragua-2024-3.jpg',
      ...galleryRange('nicaragua-mission-2024', 1, 23),
    ],
  },
  {
    id: 'owings-mills-2024',
    slug: 'food-and-health-fair-owings-mills-2024',
    title: 'Owings Mills Health and Food Fair',
    date: 'March 30, 2024',
    sortDate: '2024-03-30',
    category: 'local-fair',
    categoryLabel: 'Local Community Outreach',
    location: 'Owings Mills, Maryland',
    featured: true,
    summary:
      'In collaboration with Sanctuary of Peace Church and food partner First Fruit Farms, 12 volunteers including a Spanish interpreter served 135 adults and 50 children with food, clothes, baby essentials, and health education.',
    highlights: [
      'Served 135 adults and 50 children (185 neighbors total).',
      'Staffed by 12 volunteers including one Spanish interpreter.',
      'Distributed free food, clothes, feminine products, baby wipes, formula, cough and cold medicine, and personal care items.',
      'Healthcare professionals provided on-site health education.',
    ],
    metrics: [
      { label: 'Adults Served', value: '135' },
      { label: 'Children Served', value: '50' },
      { label: 'Volunteers', value: '12' },
    ],
    partners: ['Sanctuary of Peace Church', 'First Fruit Farms'],
    bodyParagraphs: [
      'Eagles Wings Network in collaboration with Sanctuary of Peace Church held a health and food fair on 3/30/2024 at Owings Mills, MD. There were 12 volunteers including one Spanish interpreter. We were able to cater to 135 adults and 50 children.',
      'Free food, clothes, feminine products, baby products and personal care products were distributed. There were healthcare professionals providing health education. We are grateful to First Fruit Farms for supplying the food for the event. We are also grateful to all the volunteers and our sponsors.',
    ],
    images: [
      '/media/owings-mills-1.jpg',
      '/media/owings-mills-2.jpg',
      '/media/owings-mills-3.jpg',
      ...galleryRange('nicaragua-mission-2024', 24, 46),
    ],
  },
  {
    id: 'refiners-church-2023',
    slug: 'refiners-church-outreach',
    title: 'Health Fair: Beltsville, MD (Refiners Church Outreach)',
    date: 'December 10, 2023',
    sortDate: '2023-12-10',
    category: 'local-fair',
    categoryLabel: 'Local Community Outreach',
    location: 'Beltsville, Maryland',
    summary:
      'Held in collaboration with Refiners Church on December 10, 2023, bringing 14 EWN volunteers and ~12 Refiners Church volunteers together to serve ~50 community members with food, clothes, baby supplies, and cold medicines.',
    highlights: [
      '14 volunteers from Eagles Wings Network and ~12 volunteers from Refiners Church.',
      'Served approximately 50 community members.',
      'Distributed free clothes, health products, health education, food, baby wipes, diapers, formula, and cough and cold medicines.',
      'Preceded by neighborhood flyer distribution to invite local families.',
    ],
    metrics: [
      { label: 'Neighbors Served', value: '~50' },
      { label: 'Total Volunteers', value: '~26' },
      { label: 'Partner', value: 'Refiners Church' },
    ],
    partners: ['Refiners Church'],
    bodyParagraphs: [
      'Eagles Wings Network in collaboration with Refiners Church conducted a food and health fair on December 10, 2023. We opened our hearts to give to the community vital resources including free clothes, health products and education, food, baby wipes and diapers, formula, cough and cold medicines, and so much more.',
      'The week preceding the event we printed and distributed flyers inviting people to the event. There were 14 volunteers from Eagles Wings Network and about 12 volunteers from Refiners Church. About 50 people came around to be catered to. Overall, it was a successful outing!',
    ],
    images: [
      '/media/refiners-2023-1.jpg',
      '/media/refiners-2023-2.jpg',
      '/media/refiners-2023-3.jpg',
      ...galleryRange('nigeria-2023-outreach', 20, 36),
    ],
  },
  {
    id: 'nigeria-outreach-2023',
    slug: 'nigeria-2023-outreach',
    title: 'Nigeria 2023 Outreach',
    date: 'January 2023',
    sortDate: '2023-01-15',
    category: 'international-mission',
    categoryLabel: 'International Medical Mission',
    location: 'Nigeria',
    summary:
      'In January 2023, Eagles Wings Network doctors, nurses, and volunteers traveled to Nigeria to set up temporary clinics, diagnose ailments, and deliver vital healthcare to underserved residents.',
    highlights: [
      'Doctors, nurses, and volunteers traveled to Nigeria in January 2023.',
      'Established temporary community clinics to expand access to medical care.',
      'Diagnosed ailments and provided treatments and healing care to underserved families.',
    ],
    metrics: [
      { label: 'Mission Date', value: 'Jan 2023' },
      { label: 'Location', value: 'Nigeria' },
    ],
    bodyParagraphs: [
      'In January 2023, we travelled to Nigeria to deliver vital health care not easily accessible to those in need. Doctors, nurses, and volunteers set up temporary clinics and worked tirelessly to see people, diagnose their ailments, and provide the healing they deserve.',
    ],
    images: [
      '/media/nigeria-2023-1.jpg',
      '/media/nigeria-2023-2.jpg',
      ...galleryRange('nigeria-2023-outreach', 1, 19),
    ],
  },
];

export const GALLERY_COLLECTIONS: GalleryCollection[] = [
  {
    id: 'riverdale-sept-2025-gallery',
    title: 'Food and Health Fair: Riverdale, Maryland – September 2025',
    date: 'September 13, 2025',
    location: 'Parkview Gardens Apartments · Riverdale, MD',
    category: 'local-fair',
    categoryLabel: 'Local Community Outreach',
    description:
      'Eagles Wings Network and Glory of Christ Church served 135 neighbors—including refugees and recent immigrants—with free groceries, blood pressure and blood sugar screenings, vitamins, first-aid supplies, and wellness education.',
    images: galleryRange('food-and-health-fair-riverdale-maryland-september-2025', 1, 6),
    linkedUpdateSlug: 'food-and-health-fair-riverdale-maryland-september-2025',
  },
  {
    id: 'nigeria-outreach-2024-gallery',
    title: 'Nigeria Health Outreach 2024',
    date: 'December 26, 2024',
    location: 'Mbato Ofeme, Umuahia, Nigeria',
    category: 'international-mission',
    categoryLabel: 'International Medical Mission',
    description:
      'Four healthcare providers, two nurses, and six volunteers assisted 205 individuals at no cost—treating malaria, hypertension, diabetes, and infections while distributing reading glasses, dental hygiene kits, and multivitamins.',
    images: galleryRange('nigeria-health-outreach-2024', 1, 22),
    linkedUpdateSlug: 'nigeria-health-outreach-2024',
  },
  {
    id: 'back-to-school-2024-gallery',
    title: '2024 Back to School Drive',
    date: 'August 2024',
    location: 'Maryland Community Outreach',
    category: 'youth-education',
    categoryLabel: 'Education & Youth Drive',
    description:
      'Eagles Wings Network’s inaugural annual Back to School Drive distributed pens, pencils, folders, and notebooks alongside free groceries, blood pressure and sugar screenings, and health education.',
    images: galleryRange('2024-back-to-school-drive', 1, 12),
    linkedUpdateSlug: '2024-back-to-school-drive',
  },
  {
    id: 'victoria-park-manor-2024-gallery',
    title: 'Victoria Park Manor Outreach',
    date: '2024',
    location: 'Victoria Park Manor, Maryland',
    category: 'local-fair',
    categoryLabel: 'Local Community Outreach',
    description:
      'On-site community outreach connecting directly with Victoria Park Manor residents through grocery distribution, hospitality, and health wellness resources.',
    images: galleryRange('victoria-park-manor-outreach', 1, 14),
    linkedUpdateSlug: 'victoria-park-manor-outreach',
  },
  {
    id: 'first-fruits-collaboration-2024-gallery',
    title: 'First Fruits Collaboration',
    date: '2024',
    location: 'Maryland',
    category: 'local-fair',
    categoryLabel: 'Food Security Partnership',
    description:
      'Produce and food supply collaboration with First Fruit Farms providing fresh agricultural goods for Maryland community food and health fairs.',
    images: galleryRange('firsts-fruits-collaboration', 1, 10),
    linkedUpdateSlug: 'first-fruits-collaboration',
  },
  {
    id: 'nicaragua-mission-2024-gallery',
    title: 'Nicaragua Mission 2024',
    date: 'July 3–12, 2024',
    location: 'Managua, Nicaragua',
    category: 'international-mission',
    categoryLabel: 'International Medical & Construction Mission',
    description:
      'EWN-sponsored Medical and Construction mission members served alongside Foursquare International Atlantic District partners—seeing ~100 patients daily across five Managua communities and completing a local church roof.',
    images: galleryRange('nicaragua-mission-2024', 1, 23),
    linkedUpdateSlug: 'nicaragua-mission-2024',
  },
  {
    id: 'owings-mills-2024-gallery',
    title: 'Food and Health Fair: Owings Mills, MD 2024',
    date: 'March 30, 2024',
    location: 'Owings Mills, Maryland',
    category: 'local-fair',
    categoryLabel: 'Local Community Outreach',
    description:
      'Held in collaboration with Sanctuary of Peace Church and First Fruit Farms, 12 volunteers including a Spanish interpreter served 135 adults and 50 children with food, clothing, baby products, and health education.',
    images: galleryRange('nicaragua-mission-2024', 24, 46),
    linkedUpdateSlug: 'food-and-health-fair-owings-mills-2024',
  },
  {
    id: 'refiners-church-2023-gallery',
    title: 'Refiners Church Outreach · Beltsville, MD',
    date: 'December 10, 2023',
    location: 'Beltsville, Maryland',
    category: 'local-fair',
    categoryLabel: 'Local Community Outreach',
    description:
      'Fourteen EWN volunteers joined ~12 Refiners Church volunteers to distribute groceries, free clothes, health products, health education, baby wipes, diapers, formula, and cold medicines to ~50 neighbors.',
    images: galleryRange('nigeria-2023-outreach', 20, 36),
    linkedUpdateSlug: 'refiners-church-outreach',
  },
  {
    id: 'nigeria-outreach-2023-gallery',
    title: 'Nigeria 2023 Outreach',
    date: 'January 2023',
    location: 'Nigeria',
    category: 'international-mission',
    categoryLabel: 'International Medical Mission',
    description:
      'Eagles Wings Network doctors, nurses, and volunteers set up temporary clinics across underserved Nigerian communities to diagnose ailments and provide essential medical care.',
    images: galleryRange('nigeria-2023-outreach', 1, 19),
    linkedUpdateSlug: 'nigeria-2023-outreach',
  },
];

export const DONATION_DESIGNATIONS = [
  {
    id: 'general-lifeline',
    label: 'Where Most Needed (General Lifeline Fund)',
    description:
      'Supports urgent medical supplies, groceries, and grassroots outreach across the U.S. and partner nations.',
  },
  {
    id: 'food-health-fairs',
    label: 'Local Food & Health Fairs (Maryland)',
    description:
      'Funds free groceries, blood pressure & diabetes screenings, baby supplies, and health education.',
  },
  {
    id: 'global-medical-missions',
    label: 'International Medical Missions (Nigeria & Nicaragua)',
    description:
      'Equips volunteer doctors, nurses, and clinics with free medications, testing supplies, and reading glasses.',
  },
  {
    id: 'back-to-school-youth',
    label: 'Back-to-School Drive & Youth Mentoring',
    description:
      'Provides notebooks, pens, pencils, folders, and youth mentoring resources for children and students.',
  },
  {
    id: 'water-shelter-orphans',
    label: 'Clean Water, Shelter & Orphan Care',
    description:
      'Advances EWN’s core areas of clean water, clothing, shelter, and educational support for orphans and widows.',
  },
];

export const DOCUMENTED_SPONSORS_AND_PARTNERS = [
  'Glory of Christ Church (Riverdale, MD)',
  'Sanctuary of Peace Church (Owings Mills, MD)',
  'Refiners Church (Beltsville, MD)',
  'First Fruit Farms',
  'Apex Pharmacy (Washington, DC)',
  'Growing Smiles Dentistry (Bel Air, MD)',
  'Foursquare International Atlantic District',
];
