import React, { useState } from 'react';
import { CATEGORY_DEFINITIONS } from '../data/categories';
import { submitResource, SubmitResourcePayload } from '../lib/supabase';
import { X, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
  isStandalonePage?: boolean;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  onNavigateHome,
  isStandalonePage = false,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(CATEGORY_DEFINITIONS[0].name);
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState<'Free' | 'Freemium'>('Free');
  const [suggestedBy, setSuggestedBy] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen && !isStandalonePage) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !url.trim() || !description.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    try {
      new URL(url);
    } catch {
      setErrorMsg('Please enter a valid URL (starting with https:// or http://).');
      return;
    }

    setIsSubmitting(true);

    const payload: SubmitResourcePayload = {
      name: name.trim(),
      url: url.trim(),
      category,
      description: description.trim(),
      cost,
      suggested_by: suggestedBy.trim() || 'Anonymous'
    };

    const res = await submitResource(payload);
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      setName('');
      setUrl('');
      setDescription('');
      setSuggestedBy('');
    } else {
      setErrorMsg(res.error || 'Failed to submit resource. Please try again.');
    }
  };

  const content = (
    <div className="bg-[#FAFAF8] border border-[#E5E2DA] rounded-md shadow-md max-w-xl w-full mx-auto p-6 text-[#1A1A1A]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E2DA]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#8B3A2F]">
            Suggest a Resource
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            Know a valuable free textbook, question bank, or revision tool? Submit it.
          </p>
        </div>
        {!isStandalonePage && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#777777] hover:text-[#1A1A1A] hover:bg-[#EBE8E0] cursor-pointer"
          >
            <X className="w-5 h-5 text-[#1A1A1A]" />
          </button>
        )}
      </div>

      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-[#1A1A1A] mx-auto" />
          <h3 className="text-lg font-bold text-[#1A1A1A]">
            Resource Queued for Review
          </h3>
          <p className="text-xs text-[#555555] max-w-md mx-auto leading-relaxed">
            Your submission has been inserted into the database with <code>status: "pending"</code>. Maintainers review link stability and syllabus alignment before publishing.
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className="px-4 py-2 text-xs font-semibold rounded border border-[#DDD9CF] bg-white text-[#1A1A1A] hover:border-[#1A1A1A] cursor-pointer"
            >
              Submit Another
            </button>
            <button
              type="button"
              onClick={isStandalonePage ? onNavigateHome : onClose}
              className="px-4 py-2 text-xs font-semibold rounded bg-[#1A1A1A] text-white hover:bg-[#8B3A2F] cursor-pointer"
            >
              Return to Board
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {errorMsg && (
            <div className="p-2.5 rounded bg-[#C97064]/15 border border-[#C97064]/30 text-[#8B3A2F] text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-[#333333] mb-1">
              Resource Name <span className="text-[#8B3A2F]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Christos Nikolaidis Practice Questions"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DDD9CF] rounded text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8B3A2F]"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-bold text-[#333333] mb-1">
              Website URL <span className="text-[#8B3A2F]">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://example.com/ib-maths"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DDD9CF] rounded text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8B3A2F]"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-[#333333] mb-1">
              Category <span className="text-[#8B3A2F]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DDD9CF] rounded text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8B3A2F]"
            >
              {CATEGORY_DEFINITIONS.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cost Radio */}
          <div>
            <label className="block text-xs font-bold text-[#333333] mb-1.5">
              Cost Tier <span className="text-[#8B3A2F]">*</span>
            </label>
            <div className="flex items-center gap-5 text-xs text-[#333333]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="cost"
                  value="Free"
                  checked={cost === 'Free'}
                  onChange={() => setCost('Free')}
                  className="accent-[#8B3A2F]"
                />
                <span className="font-medium">Free</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="cost"
                  value="Freemium"
                  checked={cost === 'Freemium'}
                  onChange={() => setCost('Freemium')}
                  className="accent-[#8B3A2F]"
                />
                <span className="font-medium">Freemium</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#333333] mb-1">
              One-Line Description <span className="text-[#8B3A2F]">*</span>
            </label>
            <textarea
              required
              rows={2}
              maxLength={200}
              placeholder="Concise overview of what this resource provides"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DDD9CF] rounded text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8B3A2F]"
            />
            <div className="text-[11px] text-[#777777] text-right">
              {description.length}/200
            </div>
          </div>

          {/* Suggested by */}
          <div>
            <label className="block text-xs font-bold text-[#333333] mb-1">
              Your Name or Email (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. u/IB_Student_2025 or email@example.com"
              value={suggestedBy}
              onChange={(e) => setSuggestedBy(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DDD9CF] rounded text-sm text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8B3A2F]"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={isStandalonePage ? onNavigateHome : onClose}
              className="px-4 py-2 text-xs font-semibold rounded border border-[#DDD9CF] text-[#444444] hover:text-[#1A1A1A] bg-white cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded bg-[#1A1A1A] text-white hover:bg-[#8B3A2F] transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Resource'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );

  if (isStandalonePage) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">
        <div className="mb-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#444444] hover:text-[#1A1A1A] underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Back to Board</span>
          </button>
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#1A1A1A]/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {content}
      </div>
    </div>
  );
};
