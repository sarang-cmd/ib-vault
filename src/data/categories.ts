import { CategoryMeta } from '../types';

export const CATEGORY_DEFINITIONS: CategoryMeta[] = [
  {
    name: 'Master Hubs & Repositories',
    slug: 'master-hubs-repositories',
    color: '#D98B5F', // Terracotta
    textColor: '#FFFFFF',
    iconName: 'Library',
    description: 'Central IB repositories, mirrors, download hubs, and comprehensive index guides.'
  },
  {
    name: 'Past Papers & Question Banks',
    slug: 'past-papers-question-banks',
    color: '#E0A96D', // Peach
    textColor: '#1A1A1A',
    iconName: 'FileText',
    description: 'Topic-sorted question banks, mark schemes, and official past exam papers.'
  },
  {
    name: 'Mathematics AA HL',
    slug: 'mathematics-aa-hl',
    color: '#C9B458', // Mustard/olive
    textColor: '#1A1A1A',
    iconName: 'Calculator',
    description: 'Analysis & Approaches HL practice problem sets, calculus notes, and Paper 3 investigations.'
  },
  {
    name: 'Physics HL',
    slug: 'physics-hl',
    color: '#8FAE72', // Sage green
    textColor: '#FFFFFF',
    iconName: 'Atom',
    description: 'Physics HL syllabus notes, worked textbook solutions, and interactive simulations.'
  },
  {
    name: 'Chemistry HL',
    slug: 'chemistry-hl',
    color: '#5FA39A', // Teal
    textColor: '#FFFFFF',
    iconName: 'FlaskConical',
    description: 'Topic tutorials, IA lab guides, and deep concept notes for Chemistry HL.'
  },
  {
    name: 'Geography SL',
    slug: 'geography-sl',
    color: '#7FC4C4', // Light cyan
    textColor: '#1A1A1A',
    iconName: 'Globe',
    description: 'Core and option summaries, case study banks, and global statistical datasets.'
  },
  {
    name: 'English Lang&Lit SL',
    slug: 'english-langlit-sl',
    color: '#8E8CC7', // Periwinkle/lavender
    textColor: '#FFFFFF',
    iconName: 'BookOpen',
    description: 'Paper 1 non-literary text guides, Paper 2 comparative models, and Individual Oral rubrics.'
  },
  {
    name: 'German Lang&Lit SL',
    slug: 'german-langlit-sl',
    color: '#D98B5F', // Terracotta
    textColor: '#FFFFFF',
    iconName: 'Languages',
    description: 'Thematic vocabulary, audio oral prep, grammar references, and simplified news texts.'
  },
  {
    name: 'IA / EE / TOK Exemplars & Guides',
    slug: 'ia-ee-tok-exemplars-guides',
    color: '#E0A96D', // Peach
    textColor: '#1A1A1A',
    iconName: 'GraduationCap',
    description: 'Examiner-scored Internal Assessments, Extended Essay exemplars, and Theory of Knowledge guides.'
  },
  {
    name: 'AI Study Tools',
    slug: 'ai-study-tools',
    color: '#C9B458', // Mustard/olive
    textColor: '#1A1A1A',
    iconName: 'Bot',
    description: 'AI-assisted practice questions, document querying, and automated revision workflows.'
  },
  {
    name: 'Grade & Score Calculators',
    slug: 'grade-score-calculators',
    color: '#8FAE72', // Sage green
    textColor: '#FFFFFF',
    iconName: 'Percent',
    description: 'Official historical grade boundary calculators and predicted 45-point tools.'
  },
  {
    name: 'Flashcards & Active Recall',
    slug: 'flashcards-active-recall',
    color: '#5FA39A', // Teal
    textColor: '#FFFFFF',
    iconName: 'Layers',
    description: 'Spaced repetition decks and active recall question banks for DP subjects.'
  },
  {
    name: 'YouTube Channels',
    slug: 'youtube-channels',
    color: '#C97064', // Coral/dusty red
    textColor: '#FFFFFF',
    iconName: 'Video',
    description: 'Curated teacher channels with topic explanations and past paper walkthroughs.'
  },
  {
    name: 'Communities',
    slug: 'communities',
    color: '#7FC4C4', // Light cyan
    textColor: '#1A1A1A',
    iconName: 'Users',
    description: 'Active student communities, discussion forums, and peer-to-peer study groups.'
  },
  {
    name: 'Document & Paywall Access',
    slug: 'document-paywall-access',
    color: '#6E7A99', // Slate blue-gray
    textColor: '#FFFFFF',
    iconName: 'Unlock',
    description: 'Open access mirrors and document unlocking tools for academic papers and books.'
  },
  {
    name: 'Textbooks & eBooks',
    slug: 'textbooks-ebooks',
    color: '#8E8CC7', // Periwinkle/lavender
    textColor: '#FFFFFF',
    iconName: 'BookMarked',
    description: 'Authorized syllabus coursebooks, question packs, and textbook PDF directories.'
  },
  {
    name: 'Databases & Research',
    slug: 'databases-research',
    color: '#C9B458', // Mustard/olive
    textColor: '#1A1A1A',
    iconName: 'Database',
    description: 'Peer-reviewed scholarly sources and citation managers for EE bibliography.'
  },
  {
    name: 'University Application & Prep',
    slug: 'university-application-prep',
    color: '#5FA39A', // Teal
    textColor: '#FFFFFF',
    iconName: 'Compass',
    description: 'Admissions portals, UCAS/Common App guides, and university course primers.'
  }
];

export const PINNED_COLUMNS = {
  trending: {
    id: 'trending',
    name: 'Trending This Week',
    color: '#C97064', // Coral/dusty red
    textColor: '#FFFFFF',
    iconName: 'Flame',
    description: 'Top hand-picked resources most utilized by IB Diploma candidates this week.'
  },
  favorites: {
    id: 'favorites',
    name: 'Favorites',
    color: '#B85C8A', // Magenta/pink
    textColor: '#FFFFFF',
    iconName: 'Bookmark',
    description: 'Your personal shortlist of bookmarked tools and study repositories.'
  },
  newTools: {
    id: 'new-tools',
    name: 'New Tools',
    color: '#6E7A99', // Slate blue-gray
    textColor: '#FFFFFF',
    iconName: 'Sparkles',
    description: 'Recently indexed revision tools, updated question banks, and platforms.'
  }
};

export function getCategoryMeta(categoryName: string): CategoryMeta {
  const found = CATEGORY_DEFINITIONS.find(
    c => c.name.toLowerCase() === categoryName.toLowerCase() || c.slug === categoryName.toLowerCase()
  );
  if (found) return found;
  return {
    name: categoryName,
    slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    color: '#6E7A99',
    textColor: '#FFFFFF',
    iconName: 'Folder',
    description: `Curated resources for ${categoryName}`
  };
}
