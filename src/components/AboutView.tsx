import React from 'react';
import { Resource } from '../types';
import { CATEGORY_DEFINITIONS } from '../data/categories';
import { INITIAL_ACTIVITY_LOG } from '../data/activityLog';
import { ArrowLeft } from 'lucide-react';

interface AboutViewProps {
  resources: Resource[];
  onNavigateHome: () => void;
  onNavigateSubmit: () => void;
  onOpenReportModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  resources,
  onNavigateHome,
  onNavigateSubmit,
  onOpenReportModal,
}) => {
  const totalResources = resources.length;
  const categoriesCount = CATEGORY_DEFINITIONS.length;

  // Added in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentCount = resources.filter(r => {
    if (!r.added_date) return false;
    const d = new Date(r.added_date);
    return d >= thirtyDaysAgo;
  }).length;

  const lastUpdate = '2026-09-15';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'IB Vault',
        text: 'Curated free study resources for the IB Diploma Programme',
        url: window.location.origin
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert('Vault link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#444444] hover:text-[#1A1A1A] underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Board</span>
        </button>
      </div>

      {/* Main Title */}
      <div className="mb-10 border-b border-[#E5E2DA] pb-6">
        <h1 className="font-logo text-3xl sm:text-4xl font-extrabold text-[#8B3A2F] tracking-tight">
          About IB Vault
        </h1>
        <p className="mt-2 text-base text-[#555555]">
          A clean, static-first directory of free study resources for International Baccalaureate (IB) Diploma candidates.
        </p>
      </div>

      {/* Live Database Stats Row: 4 equal-width boxes side by side */}
      {/* Spec: Big bold number on top, small gray label underneath, thin border, no fill color, no icons */}
      <div className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="border border-[#E5E2DA] p-4 text-center">
            <div className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              {totalResources}
            </div>
            <div className="text-xs text-[#777777] font-medium mt-1">
              Total Resources Listed
            </div>
          </div>

          <div className="border border-[#E5E2DA] p-4 text-center">
            <div className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              {recentCount}
            </div>
            <div className="text-xs text-[#777777] font-medium mt-1">
              Added in Last 30 Days
            </div>
          </div>

          <div className="border border-[#E5E2DA] p-4 text-center">
            <div className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              {categoriesCount}
            </div>
            <div className="text-xs text-[#777777] font-medium mt-1">
              Number of Categories
            </div>
          </div>

          <div className="border border-[#E5E2DA] p-4 text-center">
            <div className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] tracking-tight pt-1">
              {lastUpdate}
            </div>
            <div className="text-xs text-[#777777] font-medium mt-1">
              Last Update
            </div>
          </div>
        </div>
      </div>

      {/* Prose Sections */}
      <div className="space-y-10 text-[15px] leading-relaxed text-[#333333]">
        <section>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-3">
            About IB Vault
          </h2>
          <p className="mb-3">
            IB Vault is an open, community-curated index of the most effective free and freemium resources available for the International Baccalaureate Diploma Programme (IBDP).
          </p>
          <p>
            Rather than relying on closed chat threads, broken Google Drive folders, or Reddit megathreads that decay over time, IB Vault organizes essential learning assets into an intuitive, lightweight index-card board that loads instantly on any connection and works on all devices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-3">
            Why IB Vault exists
          </h2>
          <p className="mb-3">
            The IB Diploma is demanding, and commercial prep resources can be prohibitively expensive. At the same time, the global IB community has produced thousands of exceptional free materials: worked textbook solutions, interactive graphing simulators, teacher lecture series, paper analysis breakdowns, and exemplar investigations.
          </p>
          <p>
            However, these tools are often scattered across ephemeral repositories, changing mirror domains, Discord servers, and student personal blogs. IB Vault centralizes these links, continuously monitors mirror health, and preserves access so no student has to pay hundreds of dollars for study aids that community volunteers have already made accessible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-3">
            What kinds of resources are listed?
          </h2>
          <p className="mb-3">
            Every resource is categorized and ranked on a 1-to-5 scale based on accuracy, alignment with the current DP syllabus, and community feedback:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[#333333]">
            <li>
              <strong>Core Subject Hubs & Notes:</strong> Specific coverage for Mathematics AA HL, Physics HL, Chemistry HL, Geography SL, English Language & Literature SL, and German Language & Literature SL.
            </li>
            <li>
              <strong>Past Papers & Question Banks:</strong> Filterable topic banks (Pestle, SaveMyExams mirrors, official question banks) with mark schemes.
            </li>
            <li>
              <strong>Internal Assessment, Extended Essay & TOK Exemplars:</strong> Full-mark examiner-reviewed samples, topic guides, and research checklists.
            </li>
            <li>
              <strong>Calculators & Active Recall:</strong> Spaced-repetition Anki decks, historical grade boundary estimators, and 45-point prediction tools.
            </li>
            <li>
              <strong>Verified Mirrors:</strong> Live-updated textbook and file mirrors across pirateIB, LibGen, Anna's Archive, and academic search engines.
            </li>
          </ul>
        </section>

        {/* How to Contribute Section */}
        {/* Spec: plain bullet list of underlined links:
            - "Suggest a resource you think is missing"
            - "Report a bug or broken link"
            - "Share this with your community"
            followed by an outlined (not filled) "Back to Top" button */}
        <section className="pt-6 border-t border-[#E5E2DA]">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-3">
            How to Contribute
          </h2>
          <p className="mb-4">
            IB Vault is maintained through community submissions and automated link checking. You can help keep it accurate and complete:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-[#1A1A1A]">
            <li>
              <button
                type="button"
                onClick={onNavigateSubmit}
                className="vault-link text-left cursor-pointer"
              >
                Suggest a resource you think is missing
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenReportModal}
                className="vault-link text-left cursor-pointer"
              >
                Report a bug or broken link
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={handleShare}
                className="vault-link text-left cursor-pointer"
              >
                Share this with your community
              </button>
            </li>
          </ul>

          <div className="mt-6">
            <button
              type="button"
              onClick={scrollToTop}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
            >
              Back to Top
            </button>
          </div>
        </section>

        {/* Activity Log */}
        {/* Spec: reverse-chronological plain-text list at the bottom, format: YYYY-MM-DD: Added 3 resources to Chemistry HL */}
        <section className="pt-6 border-t border-[#E5E2DA]">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-3">
            Activity Log
          </h2>
          <div className="space-y-1.5 font-normal text-xs sm:text-sm text-[#444444] divide-y divide-[#EFECE5]">
            {INITIAL_ACTIVITY_LOG.map((entry) => (
              <div key={entry.id} className="pt-2 first:pt-0">
                <span className="font-semibold text-[#1A1A1A]">{entry.date}:</span>{' '}
                <span>{entry.text}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
