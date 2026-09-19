import React, { useMemo, useState } from 'react';
import { Resource } from '../types';
import { CATEGORY_DEFINITIONS, PINNED_COLUMNS } from '../data/categories';
import { Column } from './Column';
import { Filter, ArrowUp } from 'lucide-react';

interface BoardViewProps {
  resources: Resource[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectResource: (resource: Resource) => void;
  onOpenAddFavoriteModal: () => void;
  onViewCategory: (slug: string) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  resources,
  favorites,
  onToggleFavorite,
  onSelectResource,
  onOpenAddFavoriteModal,
  onViewCategory,
}) => {
  const [selectedSubjectGroup, setSelectedSubjectGroup] = useState<string>('all');

  // 1. Trending This Week: top 5 highest-rank resources across the entire dataset
  const trendingResources = useMemo(() => {
    const curatedTopIds = [
      'pirateib-master-hubs-repositories',
      'pestle-current-past-papers-question-banks',
      'christos-nikolaidis-practice-questions-mathematics-aa-hl',
      'richard-thornley-ib-chem-vids-chemistry-hl',
      'ibenglishguys-com-english-langlit-sl'
    ];
    const top = resources.filter(r => curatedTopIds.includes(r.id));
    if (top.length < 5) {
      const others = resources
        .filter(r => r.rank === 5 && !curatedTopIds.includes(r.id))
        .slice(0, 5 - top.length);
      return [...top, ...others];
    }
    return top.slice(0, 5);
  }, [resources]);

  // 2. Favorites column resources
  const favoriteResources = useMemo(() => {
    return resources.filter(r => favorites.includes(r.id));
  }, [resources, favorites]);

  // 3. New Tools column: entries flagged is_new: true, sorted by added_date desc
  const newToolsResources = useMemo(() => {
    return resources
      .filter(r => r.is_new)
      .sort((a, b) => (b.added_date || '').localeCompare(a.added_date || ''))
      .slice(0, 7);
  }, [resources]);

  // Subject group filtering for fast navigation across the 18 columns
  const subjectGroups = [
    { id: 'all', label: 'All Columns' },
    { id: 'maths-science', label: 'Maths & Sciences' },
    { id: 'humanities-lang', label: 'Humanities & Languages' },
    { id: 'core-hubs', label: 'Core, Repos & Exemplars' },
    { id: 'tools-media', label: 'Calculators, AI & Media' },
  ];

  const filteredCategories = useMemo(() => {
    if (selectedSubjectGroup === 'all') {
      return CATEGORY_DEFINITIONS;
    }
    if (selectedSubjectGroup === 'maths-science') {
      return CATEGORY_DEFINITIONS.filter(c =>
        ['mathematics-aa-hl', 'physics-hl', 'chemistry-hl'].includes(c.slug)
      );
    }
    if (selectedSubjectGroup === 'humanities-lang') {
      return CATEGORY_DEFINITIONS.filter(c =>
        ['geography-sl', 'english-langlit-sl', 'german-langlit-sl'].includes(c.slug)
      );
    }
    if (selectedSubjectGroup === 'core-hubs') {
      return CATEGORY_DEFINITIONS.filter(c =>
        [
          'master-hubs-repositories',
          'past-papers-question-banks',
          'ia-ee-tok-exemplars-guides',
          'textbooks-ebooks',
          'document-paywall-access'
        ].includes(c.slug)
      );
    }
    if (selectedSubjectGroup === 'tools-media') {
      return CATEGORY_DEFINITIONS.filter(c =>
        [
          'ai-study-tools',
          'grade-score-calculators',
          'flashcards-active-recall',
          'youtube-channels',
          'communities',
          'databases-research',
          'university-application-prep'
        ].includes(c.slug)
      );
    }
    return CATEGORY_DEFINITIONS;
  }, [selectedSubjectGroup]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pb-16 pt-4 px-4 sm:px-6 max-w-[1720px] mx-auto">
      {/* Subject Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E2DA]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-[#666666] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Filter board:</span>
          </span>
          {subjectGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelectedSubjectGroup(group.id)}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                selectedSubjectGroup === group.id
                  ? 'bg-[#1A1A1A] text-white font-medium'
                  : 'bg-white text-[#444444] border border-[#DDD9CF] hover:bg-[#EBE8E0] hover:text-[#1A1A1A]'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#666666]">
          <span>
            Showing <strong>{filteredCategories.length + 3}</strong> columns • <strong>{resources.length}</strong> resources
          </span>
        </div>
      </div>

      {/* Masonry / Grid of Trello-Style Columns */}
      <div className="flex flex-row flex-wrap items-start gap-4 sm:gap-5 justify-start">
        {/* Pinned Column 1: Trending This Week */}
        <Column
          id="col-trending"
          title={PINNED_COLUMNS.trending.name}
          color={PINNED_COLUMNS.trending.color}
          textColor={PINNED_COLUMNS.trending.textColor}
          iconName={PINNED_COLUMNS.trending.iconName}
          resources={trendingResources}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onSelectResource={onSelectResource}
          isPinned={true}
        />

        {/* Pinned Column 2: Favorites */}
        <Column
          id="col-favorites"
          title={PINNED_COLUMNS.favorites.name}
          color={PINNED_COLUMNS.favorites.color}
          textColor={PINNED_COLUMNS.favorites.textColor}
          iconName={PINNED_COLUMNS.favorites.iconName}
          resources={favoriteResources}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onSelectResource={onSelectResource}
          onOpenAddFavoriteModal={onOpenAddFavoriteModal}
          isPinned={true}
          isFavoritesColumn={true}
        />

        {/* Pinned Column 3: New Tools */}
        <Column
          id="col-new-tools"
          title={PINNED_COLUMNS.newTools.name}
          color={PINNED_COLUMNS.newTools.color}
          textColor={PINNED_COLUMNS.newTools.textColor}
          iconName={PINNED_COLUMNS.newTools.iconName}
          resources={newToolsResources}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onSelectResource={onSelectResource}
          isPinned={true}
          isNewToolsColumn={true}
        />

        {/* Category Columns in specified order */}
        {filteredCategories.map((cat) => {
          const catResources = resources.filter(
            r => r.category.toLowerCase() === cat.name.toLowerCase()
          );

          return (
            <Column
              key={cat.slug}
              id={`col-${cat.slug}`}
              title={cat.name}
              slug={cat.slug}
              color={cat.color}
              textColor={cat.textColor}
              iconName={cat.iconName}
              resources={catResources}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onSelectResource={onSelectResource}
              onViewCategory={onViewCategory}
            />
          );
        })}
      </div>

      {/* Floating Back to Top Button */}
      <div className="mt-12 pt-6 border-t border-[#E5E2DA] flex items-center justify-between text-xs text-[#777777]">
        <p>
          Vault-IB is a free, non-commercial directory for IB Diploma Programme candidates.
        </p>
        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#DDD9CF] rounded text-[#333333] hover:text-[#1A1A1A] hover:border-[#1A1A1A] bg-white transition-colors cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5 text-[#1A1A1A]" />
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  );
};
