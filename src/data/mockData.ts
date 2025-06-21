
import { NewsArticle, Author, Category } from '../types/news';

export const categories: Category[] = [
  { id: '1', name: 'Politics', slug: 'politics', description: 'Ghana politics and governance', color: '#1e40af', icon: '🏛️' },
  { id: '2', name: 'Business', slug: 'business', description: 'Business and economy news', color: '#059669', icon: '💼' },
  { id: '3', name: 'Sports', slug: 'sports', description: 'Sports news and updates', color: '#dc2626', icon: '⚽' },
  { id: '4', name: 'Technology', slug: 'technology', description: 'Tech and innovation', color: '#7c3aed', icon: '💻' },
  { id: '5', name: 'Entertainment', slug: 'entertainment', description: 'Entertainment and lifestyle', color: '#f59e0b', icon: '🎭' },
  { id: '6', name: 'Health', slug: 'health', description: 'Health and wellness', color: '#10b981', icon: '🏥' }
];

export const authors: Author[] = [
  {
    id: '1',
    name: 'Kwame Asante',
    bio: 'Senior Political Correspondent with over 10 years of experience covering Ghanaian politics.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    title: 'Senior Political Correspondent',
    social: { twitter: '@kwameasante', facebook: 'kwame.asante' }
  },
  {
    id: '2',
    name: 'Ama Osei',
    bio: 'Business Editor covering Ghana\'s economic landscape and corporate affairs.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b692?w=150&h=150&fit=crop&crop=face',
    title: 'Business Editor',
    social: { linkedin: 'ama-osei', twitter: '@amaosei' }
  },
  {
    id: '3',
    name: 'Kofi Mensah',
    bio: 'Sports journalist and former Black Stars player covering football and other sports.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    title: 'Sports Editor',
    social: { twitter: '@kofimensah', facebook: 'kofi.mensah.sports' }
  }
];

export const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Ghana\'s Economy Shows Strong Recovery Signs in Q4 2024',
    slug: 'ghana-economy-recovery-q4-2024',
    excerpt: 'Latest economic indicators suggest Ghana\'s economy is on a steady recovery path with improved fiscal performance and increased investor confidence.',
    content: `Ghana's economy is showing remarkable signs of recovery in the fourth quarter of 2024, according to the latest data from the Ghana Statistical Service and the Bank of Ghana.

## Key Economic Indicators

The country's Gross Domestic Product (GDP) grew by 3.2% in Q4, marking the strongest quarterly performance since the beginning of 2023. This growth has been driven primarily by:

- **Agricultural sector**: 4.1% growth due to favorable weather conditions
- **Mining and quarrying**: 2.8% increase in gold and oil production
- **Services sector**: 3.5% expansion, particularly in telecommunications and financial services

## Fiscal Performance

The government's fiscal position has also improved significantly:

> "We are seeing a gradual stabilization of our fiscal accounts, with revenue collection exceeding targets by 8% in the last quarter," said Finance Minister Ken Ofori-Atta.

The country's debt-to-GDP ratio has stabilized at 76.5%, down from a peak of 81.2% in early 2023.

## Investment Climate

Foreign direct investment (FDI) inflows increased by 15% year-on-year, reaching $2.3 billion in 2024. Key sectors attracting investment include:

1. Renewable energy projects
2. Agricultural processing
3. Digital technology and fintech
4. Tourism and hospitality

## Challenges Ahead

Despite these positive developments, challenges remain:

- Inflation, though declining, still stands at 18.2%
- High unemployment rate among youth
- Infrastructure gaps in rural areas
- Climate change impacts on agriculture

## Future Outlook

Economic analysts project continued growth momentum into 2025, with GDP growth expected to reach 4.5-5.0% if current policies are maintained and global conditions remain favorable.

The Bank of Ghana has indicated it may consider gradual monetary policy adjustments as inflation continues its downward trajectory.`,
    featuredImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop',
    author: authors[1],
    category: categories[1],
    tags: ['economy', 'GDP', 'investment', 'recovery'],
    publishedAt: '2024-12-14T08:00:00Z',
    updatedAt: '2024-12-14T08:00:00Z',
    readTime: 6,
    views: 1250,
    reactions: { likes: 89, hearts: 45, laughs: 3, angry: 12 },
    comments: [],
    featured: true,
    trending: true
  },
  {
    id: '2',
    title: 'Black Stars Qualify for AFCON 2025 After Thrilling Victory',
    slug: 'black-stars-qualify-afcon-2025',
    excerpt: 'Ghana\'s national football team secures their spot in the 2025 Africa Cup of Nations with a dramatic 2-1 victory over Niger in Kumasi.',
    content: `The Black Stars of Ghana have officially qualified for the 2025 Africa Cup of Nations following a nail-biting 2-1 victory over Niger at the Baba Yara Sports Stadium in Kumasi.

## Match Highlights

The crucial qualifier saw Ghana dominate possession but struggle to break down a resilient Niger defense for most of the match. The breakthrough came in the 67th minute when captain Andre Ayew converted from the penalty spot after being fouled in the box.

Niger equalized against the run of play in the 78th minute through striker Amadou Sabo, sending shockwaves through the packed stadium. However, substitute Fatawu Issahaku became the hero when he scored the winner in the 89th minute with a brilliant solo effort.

## Road to Morocco 2025

Ghana's qualification ensures they will be part of the continental showpiece to be held in Morocco from December 2025 to January 2026. This will be Ghana's 24th appearance at the AFCON, where they have won the tournament four times (1963, 1965, 1978, 1982).

## Coach's Reaction

Head coach Chris Hughton expressed his satisfaction with the team's performance:

> "I'm proud of the boys. We showed character and determination when it mattered most. The journey to Morocco starts now, and we'll use this momentum to build a competitive squad."

## Key Statistics

- Ghana finished top of Group B with 14 points from 6 matches
- The Black Stars scored 12 goals and conceded only 4 in the qualifying campaign
- This marks Ghana's return to AFCON after missing the 2021 edition

## Looking Ahead

With qualification secured, attention now turns to preparation for the tournament. The Ghana Football Association has announced plans for several international friendlies to fine-tune the squad.

The draw for AFCON 2025 is scheduled for early 2025, where Ghana will discover their group stage opponents.`,
    featuredImage: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop',
    author: authors[2],
    category: categories[2],
    tags: ['football', 'AFCON', 'Black Stars', 'qualification'],
    publishedAt: '2024-12-13T20:30:00Z',
    updatedAt: '2024-12-13T20:30:00Z',
    readTime: 4,
    views: 2100,
    reactions: { likes: 156, hearts: 89, laughs: 12, angry: 5 },
    comments: [],
    featured: true,
    trending: true
  },
  {
    id: '3',
    title: 'Ghana Launches National Digital ID System Rollout',
    slug: 'ghana-digital-id-system-launch',
    excerpt: 'The government officially launches the comprehensive digital identity system aimed at improving service delivery and financial inclusion across the country.',
    content: `Ghana has officially launched its national digital identity system, marking a significant milestone in the country's digital transformation agenda.

## Revolutionary Digital Infrastructure

The new system, developed in partnership with international technology firms, will provide every Ghanaian with a unique digital identity that can be used for various services including banking, healthcare, education, and government services.

Key features of the system include:

- Biometric authentication
- Blockchain-secured data storage
- Mobile-first accessibility
- Multi-language support (English, Twi, Ga, Ewe, Hausa)

## Implementation Timeline

The rollout will be conducted in phases:

**Phase 1 (Q1 2025)**: Greater Accra and Ashanti regions
**Phase 2 (Q2 2025)**: Northern, Upper East, and Upper West regions  
**Phase 3 (Q3 2025)**: Remaining regions
**Phase 4 (Q4 2025)**: Full integration with all government services

## Expected Benefits

Government officials project significant improvements in:

1. **Financial Inclusion**: Easier access to banking and mobile money services
2. **Healthcare**: Streamlined patient records and telemedicine
3. **Education**: Digital certificates and remote learning capabilities
4. **Governance**: Reduced bureaucracy and faster service delivery

## Privacy and Security

The system incorporates advanced security measures including end-to-end encryption and strict data protection protocols compliant with international standards.

## Public Reception

Early user testing has shown positive response rates, with 87% of participants rating the system as user-friendly and secure.`,
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
    author: authors[0],
    category: categories[3],
    tags: ['technology', 'digital ID', 'innovation', 'government'],
    publishedAt: '2024-12-12T10:15:00Z',
    updatedAt: '2024-12-12T10:15:00Z',
    readTime: 5,
    views: 980,
    reactions: { likes: 67, hearts: 23, laughs: 2, angry: 8 },
    comments: [],
    featured: false,
    trending: true
  }
];
