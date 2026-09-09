import React, { useState } from 'react';
import { OperatorProfile, ScreenType } from '../types';
import { PRESET_OPERATORS } from '../data';

interface LoginScreenProps {
  onLoginSuccess: (profile: OperatorProfile) => void;
  onNavigate: (screen: ScreenType) => void;
  currentProfile: OperatorProfile;
  isAlreadyAuthenticated?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigate,
  currentProfile,
  isAlreadyAuthenticated = false,
}) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [identifier, setIdentifier] = useState('AshFuryz@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regCallsign, setRegCallsign] = useState('');
  const [regInstitution, setRegInstitution] = useState('Dept of Computer Science');
  const [regTargetExam, setRegTargetExam] = useState('CS301 Midterm Exam');

  // Loading & status sequence
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleQuickDeploy = (preset: OperatorProfile) => {
    setIsVerifying(true);
    setStatusMessage(`Verifying biometric hash for ${preset.name}...`);
    setTimeout(() => {
      setStatusMessage('Access granted. Synchronizing cognitive telemetry...');
      setTimeout(() => {
        setIsVerifying(false);
        onLoginSuccess(preset);
        onNavigate('HOME');
      }, 600);
    }, 600);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setStatusMessage('Querying StudyNet security subsystem...');

    setTimeout(() => {
      setStatusMessage('Decrypting neural credentials...');
      setTimeout(() => {
        setIsVerifying(false);

        if (authMode === 'LOGIN') {
          // Check if matches a preset or default
          const matchingPreset = PRESET_OPERATORS.find(
            (p) =>
              p.email?.toLowerCase() === identifier.toLowerCase() ||
              p.handle?.toLowerCase() === identifier.toLowerCase() ||
              p.name.toLowerCase() === identifier.toLowerCase()
          );

          if (matchingPreset) {
            onLoginSuccess(matchingPreset);
          } else {
            // Log in with customized profile based on identifier
            const customProfile: OperatorProfile = {
              ...currentProfile,
              name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
              email: identifier,
              handle: `@${identifier.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
              isZeroData: false,
            };
            onLoginSuccess(customProfile);
          }
        } else {
          // Register new operator (defaults to zero-data baseline for new account)
          const newProfile: OperatorProfile = {
            name: regName.trim() || 'New Operator',
            email: identifier.trim() || 'operator@studynet.internal',
            handle: regCallsign.trim() ? `@${regCallsign.replace(/^@/, '')}` : '@operator_cs',
            role: 'CADET OPERATOR',
            institution: regInstitution.trim() || 'Dept of Computer Science',
            level: 1,
            xp: 0,
            xpMax: 1000,
            rank: 'Recruit Class 2026',
            cgpa: 3.80,
            targetCgpa: 4.00,
            avatarUrl: PRESET_OPERATORS[2].avatarUrl,
            targetExam: regTargetExam.trim() || 'Diagnostic Benchmark',
            focusArea: 'Core Systems & Data Structures',
            isZeroData: true,
          };
          onLoginSuccess(newProfile);
        }

        onNavigate('HOME');
      }, 700);
    }, 600);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-[72px] pb-28 space-y-6 flex flex-col items-stretch">
      {/* Return to HUD shortcut if already authenticated */}
      {isAlreadyAuthenticated && (
        <div className="flex items-center justify-between bg-[#10141a] p-3 rounded-xl border border-[#21262d]">
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#8b949e]">
            <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse"></span>
            <span>Current Terminal: <strong className="text-white">{currentProfile.name}</strong></span>
          </div>
          <button
            onClick={() => onNavigate('HOME')}
            className="text-xs font-mono-code text-[#ff3344] hover:underline inline-flex items-center gap-1 font-bold"
          >
            <span>Resume HUD Session</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Main Terminal Box */}
      <div className="bg-[#10141a] rounded-2xl p-5 sm:p-7 border border-[rgba(255,255,255,0.07)] space-y-5 shadow-2xl relative overflow-hidden">
        {/* Corner Cyber Accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff3344]/5 rounded-bl-full pointer-events-none"></div>

        {/* Security Subsystem Header */}
        <div className="flex items-start justify-between border-b border-[#21262d] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff3344] animate-pulse"></span>
              <span className="text-[11px] font-mono-code font-bold tracking-widest text-[#ff3344] uppercase">
                STUDYNET // SECURITY GATEWAY
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              {authMode === 'LOGIN' ? 'OPERATOR AUTHENTICATION' : 'CADET INITIALIZATION'}
            </h1>
            <p className="text-xs font-mono-code text-[#8b949e]">
              Encrypted Academic Performance Terminal • v4.2.0
            </p>
          </div>

          <div className="px-2 py-1 rounded bg-[#161b22] border border-[#30363d] text-[10px] font-mono-code text-[#00e599] uppercase tracking-wider shrink-0">
            GATEWAY: ONLINE
          </div>
        </div>

        {/* Quick Deploy Roster Selection */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono-code">
            <span className="text-[#8b949e] uppercase tracking-wider font-bold">
              Instant Deployment Roster
            </span>
            <span className="text-[#5c6370]">Click to Switch</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_OPERATORS.map((preset) => {
              const isSelected = currentProfile.name === preset.name;
              return (
                <button
                  key={preset.name}
                  type="button"
                  disabled={isVerifying}
                  onClick={() => handleQuickDeploy(preset)}
                  className={`p-2.5 rounded-xl border flex flex-col items-start gap-1.5 transition-all text-left group ${
                    isSelected
                      ? 'bg-[#1c222b] border-[#ff3344] shadow-[0_0_12px_rgba(255,51,68,0.25)]'
                      : 'bg-[#0d1117] border-[#21262d] hover:border-[#30363d] hover:bg-[#161b22]'
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <img
                      src={preset.avatarUrl}
                      alt={preset.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#21262d] group-hover:border-[#ff3344] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-white block truncate">
                        {preset.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[8px] font-mono-code font-bold px-1 py-0.2 rounded uppercase ${
                            preset.isZeroData
                              ? 'bg-[#21262d] text-[#8b949e]'
                              : 'bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30'
                          }`}
                        >
                          {preset.isZeroData ? 'Zero Data' : 'Dummy Data'}
                        </span>
                        <span className="text-[9px] font-mono-code text-[#8b949e] truncate">
                          LVL {preset.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Auth Mode Toggle (Login vs Register) */}
        <div className="flex rounded-xl bg-[#0d1117] p-1 border border-[#21262d]">
          <button
            type="button"
            onClick={() => setAuthMode('LOGIN')}
            className={`flex-1 py-2 text-xs font-mono-code font-bold uppercase rounded-lg transition-all ${
              authMode === 'LOGIN'
                ? 'bg-[#ff3344] text-white shadow-[0_0_10px_rgba(255,51,68,0.3)]'
                : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Authenticate Operator
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('REGISTER')}
            className={`flex-1 py-2 text-xs font-mono-code font-bold uppercase rounded-lg transition-all ${
              authMode === 'REGISTER'
                ? 'bg-[#ff3344] text-white shadow-[0_0_10px_rgba(255,51,68,0.3)]'
                : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Enroll New Cadet
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authMode === 'LOGIN' ? (
            <>
              {/* Operator Identifier */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono-code text-[#8b949e] uppercase tracking-wider block">
                  Operator Identifier or Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e] text-base">
                    badge
                  </span>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. AshFuryz@gmail.com or Maya Lin"
                    className="w-full h-11 bg-[#0d1117] text-xs font-mono-code text-white pl-9 pr-3 rounded-xl border border-[#21262d] focus:outline-none focus:border-[#ff3344] transition-colors"
                  />
                </div>
              </div>

              {/* Password / Cipher */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono-code text-[#8b949e] uppercase tracking-wider block">
                    Security Passkey / Cipher
                  </label>
                  <span className="text-[10px] font-mono-code text-[#ff3344] hover:underline cursor-pointer">
                    Forgot cipher?
                  </span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e] text-base">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security passkey"
                    className="w-full h-11 bg-[#0d1117] text-xs font-mono-code text-white pl-9 pr-10 rounded-xl border border-[#21262d] focus:outline-none focus:border-[#ff3344] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white"
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Register Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono-code text-[#8b949e] uppercase tracking-wider block">
                    Cadet Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Alex Chen"
                    className="w-full h-10 bg-[#0d1117] text-xs font-mono-code text-white px-3 rounded-xl border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono-code text-[#8b949e] uppercase tracking-wider block">
                    Terminal Callsign
                  </label>
                  <input
                    type="text"
                    value={regCallsign}
                    onChange={(e) => setRegCallsign(e.target.value)}
                    placeholder="e.g. @alexchen_cs"
                    className="w-full h-10 bg-[#0d1117] text-xs font-mono-code text-white px-3 rounded-xl border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono-code text-[#8b949e] uppercase tracking-wider block">
                  University / Academic Institution
                </label>
                <input
                  type="text"
                  value={regInstitution}
                  onChange={(e) => setRegInstitution(e.target.value)}
                  placeholder="e.g. Dept of Computer Science"
                  className="w-full h-10 bg-[#0d1117] text-xs font-mono-code text-white px-3 rounded-xl border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono-code text-[#8b949e] uppercase tracking-wider block">
                  Primary Target Boss Exam
                </label>
                <input
                  type="text"
                  value={regTargetExam}
                  onChange={(e) => setRegTargetExam(e.target.value)}
                  placeholder="e.g. CS301 Midterm Exam"
                  className="w-full h-10 bg-[#0d1117] text-xs font-mono-code text-white px-3 rounded-xl border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono-code text-[#8b949e] uppercase tracking-wider block">
                  Access Email
                </label>
                <input
                  type="email"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. operator@univ.edu"
                  className="w-full h-10 bg-[#0d1117] text-xs font-mono-code text-white px-3 rounded-xl border border-[#21262d] focus:outline-none focus:border-[#ff3344]"
                />
              </div>
            </>
          )}

          {/* Remember Me checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#21262d] bg-[#0d1117] accent-[#ff3344]"
              />
              <span className="text-xs font-mono-code text-[#8b949e]">
                Persist Neural Session on Terminal
              </span>
            </label>

            <span className="text-[10px] font-mono-code text-[#00e599] flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">shield</span>
              <span>256-bit AES</span>
            </span>
          </div>

          {/* Status message while authenticating */}
          {statusMessage && (
            <div className="p-3 rounded-xl bg-[#161b22] border border-[#ff3344]/50 flex items-center gap-2.5 text-xs font-mono-code text-[#ff3344] animate-pulse">
              <span className="material-symbols-outlined text-sm">sync</span>
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="authenticate-btn"
            type="submit"
            disabled={isVerifying}
            className="w-full h-12 rounded-xl bg-[#ff3344] hover:bg-[#e62637] disabled:bg-[#ff3344]/50 text-white font-mono-code font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 glow-crimson transition-all active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-base">
              {isVerifying ? 'hourglass_top' : 'vpn_key'}
            </span>
            <span>
              {isVerifying
                ? 'AUTHENTICATING NEURAL HASH...'
                : authMode === 'LOGIN'
                ? 'AUTHENTICATE & DEPLOY TO HUD'
                : 'INITIALIZE CADET PROFILE'}
            </span>
          </button>
        </form>

        {/* Guest access footer */}
        <div className="pt-3 border-t border-[#21262d] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-code text-[#8b949e]">
          <button
            type="button"
            onClick={() => {
              onLoginSuccess(PRESET_OPERATORS[0], 'POPULATED');
              onNavigate('HOME');
            }}
            className="hover:text-white transition-colors underline"
          >
            Bypass &amp; Continue as Maya Lin (Guest)
          </button>

          <span className="text-[10px] text-[#5c6370]">
            System Node: HK-47 // Asia-SE1
          </span>
        </div>
      </div>
    </div>
  );
};
