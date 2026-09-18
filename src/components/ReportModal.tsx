import React, { useState } from 'react';
import { Resource } from '../types';
import { updateResourceStatus } from '../lib/supabase';
import { X, AlertTriangle, CheckCircle2, Send } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  resource: Resource | null;
  onClose: () => void;
  onRefreshResources: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  resource,
  onClose,
  onRefreshResources,
}) => {
  const [issueType, setIssueType] = useState('broken_link');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resource) {
      // Flag resource as broken
      updateResourceStatus(resource.id, 'broken');
      onRefreshResources();
    }
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#1A1A1A]/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-[#FAFAF8] border border-[#E5E2DA] rounded-md shadow-xl p-5 text-[#1A1A1A]">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E2DA]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#C97064]" />
            <h2 className="text-base font-bold text-[#1A1A1A]">
              Report Broken Link / Mirror
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#777777] hover:text-[#1A1A1A] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#5FA39A] mx-auto" />
            <p className="text-sm font-semibold text-[#1A1A1A]">
              Thank you for reporting.
            </p>
            <p className="text-xs text-[#555555]">
              This link has been flagged with <code>status: "broken"</code> in the database. Our maintainers and link-checker robot will verify alternate mirrors.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-4 py-1.5 text-xs font-semibold rounded bg-[#1A1A1A] text-white hover:bg-[#8B3A2F] cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {resource && (
              <div className="p-2.5 bg-[#F4F2ED] border border-[#DDD9CF] rounded text-xs">
                <span className="font-semibold text-[#1A1A1A]">{resource.name}</span>
                <span className="block text-[#666666] truncate mt-0.5">{resource.url}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Issue Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#DDD9CF] rounded text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8B3A2F]"
              >
                <option value="broken_link">404 Not Found / Domain Inactive</option>
                <option value="paywall">Hit a strict paywall / No longer free</option>
                <option value="outdated">Outdated syllabus (old specs pre-2025)</option>
                <option value="incorrect_meta">Wrong subject category or description</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Additional Notes / Replacement Mirror URL
              </label>
              <textarea
                rows={2}
                placeholder="Optional: provide a working mirror URL or description of what failed..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#DDD9CF] rounded text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8B3A2F]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs rounded border border-[#DDD9CF] text-[#555555] bg-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#C97064] text-white hover:bg-[#b05c51] cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
