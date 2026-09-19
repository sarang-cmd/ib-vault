import React from 'react';
import { Resource } from '../types';
import { ArrowRight, Library, Calculator, Globe, Users, Bot, Percent, FileText, BookOpen, ExternalLink } from 'lucide-react';
import { CATEGORY_DEFINITIONS } from '../data/categories';

const categoryGroups = [
  {
    title: 'All Subjects',
    description: 'Core repositories, past papers, textbooks, and research tools',
    icon: Library,
    color: '#D98B5F',
    categories: [
      { name: 'Master Hubs & Repositories', slug: 'master-hubs-repositories' },
      { name: 'Past Papers & Question Banks', slug: 'past-papers-question-banks' },
      { name: 'Textbooks & eBooks', slug: 'textbooks-ebooks' },
      { name: 'Document & Paywall Access', slug: 'document-paywall-access' },
      { name: 'Databases & Research', slug: 'databases-research' },
    ]
  },
  {
    title: 'Higher Level Subjects (HL)',
    description: 'Advanced level subjects for IB Diploma candidates',
    icon: BookOpen,
    color: '#C9B458',
    categories: [
      { name: 'Mathematics AA HL', slug: 'mathematics-aa-hl' },
      { name: 'Physics HL', slug: 'physics-hl' },
      { name: 'Chemistry HL', slug: 'chemistry-hl' },
    ]
  },
  {
    title: 'Standard Level Subjects (SL)',
    description: 'Standard level subjects for IB Diploma candidates',
    icon: Globe,
    color: '#7FC4C4',
    categories: [
      { name: 'Geography SL', slug: 'geography-sl' },
      { name: 'English Lang&Lit SL', slug: 'english-langlit-sl' },
      { name: 'German Lang&Lit SL', slug: 'german-langlit-sl' },
    ]
  },
  {
    title: 'Core & Tools',
    description: 'Essential tools for IB success',
    icon: Calculator,
    color: '#8FAE72',
    categories: [
      { name: 'IA / EE / TOK Exemplars', slug: 'ia-ee-tok-exemplars-guides' },
      { name: 'AI Study Tools', slug: 'ai-study-tools' },
      { name: 'Grade & Score Calculators', slug: 'grade-score-calculators' },
      { name: 'Flashcards & Active Recall', slug: 'flashcards-active-recall' },
      { name: 'YouTube Channels', slug: 'youtube-channels' },
      { name: 'Communities', slug: 'communities' },
      { name: 'University Application & Prep', slug: 'university-application-prep' },
    ]
  },
];

export const DashboardView: React.FC<{
  resources: Resource[];
  onNavigateBoard: () => void;
  onNavigateCategory: (slug: string) => void;
}> = ({ resources, onNavigateBoard, onNavigateCategory }) => {
  return (
    <div className="min-h-screen bg-bg-page text-text-body">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-logo/10 text-brand-logo text-sm font-medium mb-6">
            <span>Vault IB</span>
            <span className="px-2 py-0.5 bg-brand-logo text-white rounded text-xs font-bold">v3.0</span>
          </div>
          <h1 className="font-logo text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight mb-6 leading-tight">
            Your IB Diploma
            <br />
            <span className="text-brand-logo">Resource Vault</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            A curated, community-driven directory of 168+ free and freemium study resources 
            for the IB Diploma Programme. Organized by subject, verified by students.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onNavigateBoard}
              className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold rounded-lg bg-brand-logo text-white hover:bg-brand-logo/90 transition-colors cursor-pointer shadow-lg"
            >
              <span>Explore Resources</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#categories"
              className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold rounded-lg bg-white border border-border-color text-text-primary hover:bg-muted transition-colors cursor-pointer"
            >
              Browse Categories
            </a>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 bg-card border border-border-color rounded-lg">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-logo">{resources.length}+</div>
              <div className="text-sm text-muted">Curated Resources</div>
            </div>
            <div className="p-4 bg-card border border-border-color rounded-lg">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-logo">18</div>
              <div className="text-sm text-muted">Subject Categories</div>
            </div>
            <div className="p-4 bg-card border border-border-color rounded-lg">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-logo">3</div>
              <div className="text-sm text-muted">Column Groups</div>
            </div>
            <div className="p-4 bg-card border border-border-color rounded-lg">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-logo">Free</div>
              <div className="text-sm text-muted">Forever Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-logo text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Browse by Category
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Resources organized into three main groups: All Subjects hubs, Higher Level subjects, 
              Standard Level subjects, plus essential tools and communities.
            </p>
          </div>

          <div className="space-y-12">
            {categoryGroups.map((group, groupIndex) => (
              <div key={group.title} className="animate-fade-in-up" style={{ animationDelay: `${groupIndex * 100}ms` }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: group.color }}>
                    <group.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-logo text-2xl font-bold text-text-primary">{group.title}</h3>
                    <p className="text-sm text-muted">{group.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.categories.map((cat, catIndex) => (
                    <button
                      key={cat.slug}
                      onClick={() => onNavigateCategory(cat.slug)}
                      className="group relative p-5 bg-card border border-border-color rounded-xl hover:border-brand-logo/50 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
                      style={{ animationDelay: `${catIndex * 50}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: group.color + '20' }}>
                          <span className="w-5 h-5 rounded-full" style={{ backgroundColor: group.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-text-primary group-hover:text-brand-logo transition-colors">
                            {cat.name}
                          </h4>
                          <p className="text-sm text-muted mt-0.5 line-clamp-2">
                            {CATEGORY_DEFINITIONS.find(c => c.slug === cat.slug)?.description || 'Browse resources'}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted group-hover:text-brand-logo transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-logo text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
              Quick Actions
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Jump straight to what you need
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <button
              onClick={() => onNavigateCategory('master-hubs-repositories')}
              className="group p-5 bg-card border border-border-color rounded-xl hover:border-brand-logo/50 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-terracotta/20 flex items-center justify-center mb-3">
                <Library className="w-6 h-6" style={{ color: '#D98B5F' }} />
              </div>
              <h4 className="font-semibold text-text-primary group-hover:text-brand-logo transition-colors">Master Hubs</h4>
              <p className="text-sm text-muted mt-1">Central IB repositories & mirrors</p>
            </button>

            <button
              onClick={() => onNavigateCategory('past-papers-question-banks')}
              className="group p-5 bg-card border border-border-color rounded-xl hover:border-brand-logo/50 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-peach/20 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" style={{ color: '#E0A96D' }} />
              </div>
              <h4 className="font-semibold text-text-primary group-hover:text-brand-logo transition-colors">Past Papers</h4>
              <p className="text-sm text-muted mt-1">Topic-sorted question banks</p>
            </button>

            <button
              onClick={() => onNavigateCategory('ai-study-tools')}
              className="group p-5 bg-card border border-border-color rounded-xl hover:border-brand-logo/50 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-mustard/20 flex items-center justify-center mb-3">
                <Bot className="w-6 h-6" style={{ color: '#C9B458' }} />
              </div>
              <h4 className="font-semibold text-text-primary group-hover:text-brand-logo transition-colors">AI Study Tools</h4>
              <p className="text-sm text-muted mt-1">AI-assisted practice & revision</p>
            </button>

            <button
              onClick={() => onNavigateCategory('grade-score-calculators')}
              className="group p-5 bg-card border border-border-color rounded-xl hover:border-brand-logo/50 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-sage/20 flex items-center justify-center mb-3">
                <Percent className="w-6 h-6" style={{ color: '#8FAE72' }} />
              </div>
              <h4 className="font-semibold text-text-primary group-hover:text-brand-logo transition-colors">Grade Calculator</h4>
              <p className="text-sm text-muted mt-1">Predict your 45 points</p>
            </button>
          </div>
        </div>
      </section>

      {/* Community & Mirrors */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-card border border-border-color rounded-2xl">
              <h3 className="font-logo text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-brand-logo" />
                Community Mirrors
              </h3>
              <p className="text-muted mb-6">
                Access verified community mirrors for when primary sources are down. 
                Maintained by the IB student community.
              </p>
              <div className="space-y-3">
                <a href="https://github.com/pirateIB" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <span className="w-8 h-8 rounded bg-brand-logo/10 flex items-center justify-center text-brand-logo">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-medium text-text-primary">pirateIB Repository</p>
                    <p className="text-sm text-muted">Main community mirror hub</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted ml-auto" />
                </a>
                <a href="https://ibresources.github.io/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <span className="w-8 h-8 rounded bg-brand-logo/10 flex items-center justify-center text-brand-logo">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-medium text-text-primary">IB Resources Guide</p>
                    <p className="text-sm text-muted">Comprehensive resource directory</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted ml-auto" />
                </a>
              </div>
            </div>

            <div className="p-8 bg-card border border-border-color rounded-2xl">
              <h3 className="font-logo text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-logo" />
                Join the Community
              </h3>
              <p className="text-muted mb-6">
                Connect with thousands of IB students worldwide. Share resources, 
                ask questions, and stay updated.
              </p>
              <div className="space-y-3">
                <a href="https://www.reddit.com/r/IBO/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <span className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-medium text-text-primary">r/IBO</p>
                    <p className="text-sm text-muted">Main IB subreddit • 100k+ members</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted ml-auto" />
                </a>
                <a href="https://discord.gg/IBO" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <span className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-medium text-text-primary">IBO Discord</p>
                    <p className="text-sm text-muted">Real-time chat & study sessions</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted ml-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-logo text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Ready to Start?
          </h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            Join thousands of IB students who use Vault IB for their revision. 
            Free forever, community-driven, no ads.
          </p>
          <button
            onClick={onNavigateBoard}
            className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold rounded-lg bg-brand-logo text-white hover:bg-brand-logo/90 transition-colors cursor-pointer shadow-lg"
          >
            <span>Enter the Vault</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};