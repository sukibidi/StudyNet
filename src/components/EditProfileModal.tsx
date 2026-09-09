import React, { useState } from 'react';
import { OperatorProfile } from '../types';
import { DEFAULT_AVATARS } from '../data';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: OperatorProfile;
  onSave: (updatedProfile: OperatorProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  if (!isOpen || !profile) return null;

  const [formData, setFormData] = useState<OperatorProfile>({ ...profile });
  const [customAvatarUrl, setCustomAvatarUrl] = useState(
    DEFAULT_AVATARS.some((a) => a.url === profile.avatarUrl) ? '' : profile.avatarUrl
  );
  const [showCustomInput, setShowCustomInput] = useState(
    !DEFAULT_AVATARS.some((a) => a.url === profile.avatarUrl)
  );

  const handleSelectAvatar = (url: string) => {
    setFormData((prev) => ({ ...prev, avatarUrl: url }));
    setCustomAvatarUrl('');
    setShowCustomInput(false);
  };

  const handleCustomAvatarChange = (url: string) => {
    setCustomAvatarUrl(url);
    if (url.trim()) {
      setFormData((prev) => ({ ...prev, avatarUrl: url.trim() }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      id="edit-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="edit-profile-modal-card"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#10141a] rounded-2xl border border-[#ff3344]/40 shadow-2xl p-5 sm:p-6 space-y-5 my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff3344] text-xl">manage_accounts</span>
            <div>
              <h2 className="text-base font-bold font-heading text-white uppercase tracking-tight">
                Edit Operator Dossier
              </h2>
              <span className="text-[11px] font-mono-code text-[#8b949e]">
                StudyNet Personnel Registry • Local Encrypted Storage
              </span>
            </div>
          </div>
          <button
            id="close-edit-profile-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#161b22] hover:bg-[#1f2530] text-[#8b949e] hover:text-white flex items-center justify-center border border-[#21262d] transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-code">
          {/* Avatar Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider block">
              Operator Avatar
            </label>

            <div className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#ff3344] shrink-0 bg-[#161b22]">
                <img
                  src={formData.avatarUrl}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_AVATARS[0].url;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-white font-bold block truncate">{formData.name || 'Operator'}</span>
                <span className="text-[#8b949e] text-[10px] block truncate">
                  {formData.role || 'CS-CORE OPERATOR'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="text-[#ff3344] hover:underline text-[10px] mt-1 inline-flex items-center gap-1 font-bold"
                >
                  <span className="material-symbols-outlined text-[12px]">link</span>
                  <span>{showCustomInput ? 'Select preset avatar' : 'Use custom image URL'}</span>
                </button>
              </div>
            </div>

            {/* Presets Grid */}
            {!showCustomInput ? (
              <div className="grid grid-cols-6 gap-2 pt-1">
                {DEFAULT_AVATARS.map((avatar) => {
                  const isSelected = formData.avatarUrl === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => handleSelectAvatar(avatar.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                        isSelected
                          ? 'border-[#ff3344] scale-105 shadow-[0_0_10px_rgba(255,51,68,0.4)]'
                          : 'border-[#21262d] opacity-70 hover:opacity-100 hover:border-[#8b949e]'
                      }`}
                      title={avatar.name}
                    >
                      <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#ff3344]/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-xs font-bold">check</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-1 pt-1">
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => handleCustomAvatarChange(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full h-9 bg-[#161b22] text-xs text-white px-3 rounded-lg border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
                />
              </div>
            )}
          </div>

          {/* Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-[#8b949e] uppercase tracking-wider block">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Maya Lin"
                className="w-full h-9 bg-[#161b22] text-xs text-white px-3 rounded-lg border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#8b949e] uppercase tracking-wider block">
                Callsign / Handle
              </label>
              <input
                type="text"
                value={formData.handle || ''}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder="e.g. @mayalin_cs"
                className="w-full h-9 bg-[#161b22] text-xs text-white px-3 rounded-lg border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
              />
            </div>
          </div>

          {/* Email / Identifier */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#8b949e] uppercase tracking-wider block">
              University Email / Terminal ID
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. maya.lin@univ.edu"
              className="w-full h-9 bg-[#161b22] text-xs text-white px-3 rounded-lg border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
            />
          </div>

          {/* Role & Academic Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-[#8b949e] uppercase tracking-wider block">
                Operational Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. CS-CORE OPERATOR"
                className="w-full h-9 bg-[#161b22] text-xs text-white px-3 rounded-lg border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#8b949e] uppercase tracking-wider block">
                Academic Division / Dept
              </label>
              <input
                type="text"
                value={formData.institution || ''}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g. Dept of Computer Science"
                className="w-full h-9 bg-[#161b22] text-xs text-white px-3 rounded-lg border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
              />
            </div>
          </div>

          {/* Current CGPA & Target CGPA */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-[#8b949e] uppercase tracking-wider block">
                Current CGPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0.00"
                max="4.00"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                className="w-full h-9 bg-[#161b22] text-xs text-white px-3 rounded-lg border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#8b949e] uppercase tracking-wider block">
                Target CGPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0.00"
                max="4.00"
                value={formData.targetCgpa}
                onChange={(e) => setFormData({ ...formData, targetCgpa: parseFloat(e.target.value) || 4.0 })}
                className="w-full h-9 bg-[#161b22] text-xs text-white px-3 rounded-lg border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
              />
            </div>
          </div>

          {/* Target Boss Exam & Focus Area */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#8b949e] uppercase tracking-wider block">
              Primary Target / Boss Exam
            </label>
            <input
              type="text"
              value={formData.targetExam || ''}
              onChange={(e) => setFormData({ ...formData, targetExam: e.target.value })}
              placeholder="e.g. CS301 Midterm Exam"
              className="w-full h-9 bg-[#161b22] text-xs text-white px-3 rounded-lg border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#8b949e] uppercase tracking-wider block">
              Cognitive Deficit Focus Area
            </label>
            <input
              type="text"
              value={formData.focusArea || ''}
              onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
              placeholder="e.g. Dynamic Programming: Memoization Tables"
              className="w-full h-9 bg-[#161b22] text-xs text-white px-3 rounded-lg border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
            />
          </div>

          {/* Submit / Cancel CTAs */}
          <div className="pt-3 border-t border-[#21262d] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#161b22] hover:bg-[#1f2530] text-[#8b949e] hover:text-white rounded-xl border border-[#21262d] text-xs font-bold uppercase transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-operator-profile-btn"
              type="submit"
              className="px-5 py-2.5 bg-[#ff3344] hover:bg-[#e62637] text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,51,68,0.3)] active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Save Dossier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
