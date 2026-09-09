import React, { useState, useEffect } from 'react';
import { ChatMessage, ScreenType, SubjectTaken } from '../types';
import { INITIAL_SUBJECTS_TAKEN, deriveAreaOfExpertise } from '../expertiseData';
import { MemoryExpertiseGraph } from './MemoryExpertiseGraph';
import { SubjectSlideVault } from './SubjectSlideVault';
import { SubjectGradeModal } from './SubjectGradeModal';
import { playTacticalChirp } from '../utils/audio';

interface AiNetScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onStartDrill: () => void;
  isZeroData?: boolean;
}

export const AiNetScreen: React.FC<AiNetScreenProps> = ({
  onNavigate,
  onStartDrill,
  isZeroData = false,
}) => {
  // Sub-Navigation: Subject Slide Vault vs Memory Radar vs Neural Copilot
  const [activeTab, setActiveTab] = useState<'VAULT' | 'RADAR' | 'CHAT'>('VAULT');

  // Subjects & Grades State (Default includes Multimedia A+)
  const [subjects, setSubjects] = useState<SubjectTaken[]>(() => {
    try {
      const saved = localStorage.getItem('studynet_subjects_taken');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SUBJECTS_TAKEN;
  });

  // Modal states
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectTaken | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('studynet_subjects_taken', JSON.stringify(subjects));
    } catch (e) {}
  }, [subjects]);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      timestamp: '09:41 AM',
      text: 'Explain Multi-Level Paging, how it reduces memory footprint, and what happens on TLB miss.',
    },
    {
      id: 'msg-2',
      sender: 'ai-net',
      timestamp: '09:41 AM',
      references: 'Page 14 & 18 • View Reference',
      text: `Multi-level paging replaces a single monolithic flat page table with a hierarchical tree structure. The master outer page table points to subsequent second-level tables, resolving sparse memory allocation without having to allocate memory for unused virtual address regions.\n\nUnallocated memory blocks don’t require second-level tables to exist in RAM. Only the active root directory and explicitly mapped tables consume physical memory frames.`,
      breakdown: {
        outerBits: '10 bits',
        innerBits: '10 bits',
        offsetBits: '12 bits',
        pageSize: '4 KB',
      },
      sequence: [
        'MMU looks up TLB for translation tag. Tag absent; raises TLB Miss signal.',
        'Hardware page table walker fetches CR3 register base, accesses Level 1 and Level 2 page table entries.',
        'TLB is populated with resolved Physical Frame Number (PFN) and the original instruction re-executes.',
      ],
      examTip:
        'Midterm questions frequently test memory overhead for sparse address spaces. A flat 4MB table reduces to ~16KB in a 2-level scheme.',
    },
  ]);

  const [zeroModeMessages, setZeroModeMessages] = useState<ChatMessage[]>([]);
  const activeMessages = isZeroData ? zeroModeMessages : messages;

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Subject Management Handlers
  const handleSaveSubject = (newOrUpdated: SubjectTaken) => {
    setSubjects((prev) => {
      const exists = prev.some((s) => s.id === newOrUpdated.id);
      if (exists) {
        return prev.map((s) => (s.id === newOrUpdated.id ? newOrUpdated : s));
      }
      return [newOrUpdated, ...prev];
    });
    playTacticalChirp(880, 0.08);
    showToast(
      `Calibrated ${newOrUpdated.name} (${newOrUpdated.grade}) into Memory & Expertise Radar!`
    );
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    playTacticalChirp(440, 0.06);
    showToast('Subject removed from cognitive spectrum.');
  };

  const handleUpdateSubject = (updated: SubjectTaken) => {
    setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast(`Calibrated AI telemetry for ${updated.code || updated.name}!`);
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    playTacticalChirp(660, 0.08);
    showToast('AI analyzing subjects & calibrating area of expertise...');

    try {
      const res = await fetch('/api/analyze-expertise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.analyzedSubjects && Array.isArray(data.analyzedSubjects)) {
          setSubjects(data.analyzedSubjects);
          playTacticalChirp(990, 0.12);
          showToast(
            `AI Calibration Complete: Dominant Expertise is ${data.dominantDomain || 'Multimedia'}`
          );
          return;
        }
      }
    } catch (e) {
      console.warn('AI analysis fallback triggered:', e);
    } finally {
      setIsAnalyzing(false);
    }

    // Local fallback calibration
    setSubjects((prev) =>
      prev.map((s) => ({
        ...s,
        areaOfExpertise: deriveAreaOfExpertise(s.name, s.grade),
      }))
    );
    showToast('Telemetry matrix calibrated with academic standards.');
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputQuery;
    if (!promptToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: promptToSend,
    };

    const appendMessage = (newMsg: ChatMessage) => {
      if (isZeroData) {
        setZeroModeMessages((prev) => [...prev, newMsg]);
      } else {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    appendMessage(userMsg);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToSend, topic: 'CS301' }),
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai-net',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.reply || 'Analysis completed with verified memory telemetry.',
        references: isZeroData ? 'General Telemetry Grounding' : 'Page 22 & 27 • Grounded Excerpt',
        breakdown: data.breakdown || {
          outerBits: '10 bits',
          innerBits: '10 bits',
          offsetBits: '12 bits',
          pageSize: '4 KB',
        },
        sequence: data.tlbSequence || [
          'Memory management unit invokes translation pipeline.',
          'Hierarchical traversal parses Level 1 then Level 2 pages.',
          'Physical frame mapped into TLB cache.',
        ],
        examTip:
          data.examTip ||
          'Calculations regarding page table memory footprints are high-frequency targets for the CS301 Midterm.',
      };

      appendMessage(aiMsg);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai-net',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text:
          'Indexed telemetry confirms: Multi-level page tables eliminate empty entries by instantiating intermediate tables only when pages are active.',
        examTip:
          'Formula: Total bits = log2(Page Size) offset + log2(PTEs per page) directory.',
      };
      appendMessage(fallbackMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 pt-[72px] pb-28 space-y-5 sm:space-y-6 flex flex-col items-stretch">
      {/* 0. UNIFIED SCREEN HEADER & SUB-NAVIGATION */}
      <div className="bg-[#10141a] rounded-2xl p-4 sm:p-5 border border-[rgba(255,255,255,0.07)] space-y-3.5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ff3344]/15 border border-[#ff3344]/30 flex items-center justify-center shrink-0 text-[#ff3344]">
              <span className="material-symbols-outlined text-lg sm:text-xl">psychology</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold font-heading text-white tracking-tight truncate">
                AI-NET: COGNITIVE INTELLIGENCE
              </h1>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono-code text-[#8b949e] mt-0.5">
                <span className="text-[#00e599] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse"></span>
                  Online
                </span>
                <span>•</span>
                <span>Expertise &amp; Memory Spectrum</span>
              </div>
            </div>
          </div>

          {/* Header Sub-Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold uppercase bg-[#ff3344]/10 text-[#ff3344] border border-[#ff3344]/30">
              Cognitive Telemetry
            </span>
          </div>
        </div>

        {/* 3-Tab Segmented Control (Vault, Radar, Copilot) */}
        <div className="grid grid-cols-3 p-1 bg-[#161b22] rounded-xl border border-[#21262d] gap-1 select-none font-mono-code">
          <button
            onClick={() => setActiveTab('VAULT')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'VAULT'
                ? 'bg-[#ff3344] text-white shadow-[0_0_12px_rgba(255,51,68,0.3)]'
                : 'text-[#8b949e] hover:text-white hover:bg-[#1f2530]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">view_carousel</span>
            <span className="truncate">Slide Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('RADAR')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'RADAR'
                ? 'bg-[#ff3344] text-white shadow-[0_0_12px_rgba(255,51,68,0.3)]'
                : 'text-[#8b949e] hover:text-white hover:bg-[#1f2530]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">radar</span>
            <span className="truncate">Memory Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('CHAT')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'CHAT'
                ? 'bg-[#ff3344] text-white shadow-[0_0_12px_rgba(255,51,68,0.3)]'
                : 'text-[#8b949e] hover:text-white hover:bg-[#1f2530]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span className="truncate">Neural Copilot</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SUBJECT SLIDE VAULT */}
      {activeTab === 'VAULT' && (
        <SubjectSlideVault
          subjects={subjects}
          onAddSubject={() => {
            setEditingSubject(null);
            setIsSubjectModalOpen(true);
          }}
          onEditSubject={(subj) => {
            setEditingSubject(subj);
            setIsSubjectModalOpen(true);
          }}
          onDeleteSubject={handleDeleteSubject}
          onUpdateSubject={handleUpdateSubject}
          onRunBatchAiAnalysis={handleRunAiAnalysis}
          isBatchAnalyzing={isAnalyzing}
          onStartDrill={onStartDrill}
        />
      )}

      {/* TAB 2: MEMORY & EXPERTISE RADAR GRAPH */}
      {activeTab === 'RADAR' && (
        <MemoryExpertiseGraph
          subjects={subjects}
          onAddSubject={() => {
            setEditingSubject(null);
            setIsSubjectModalOpen(true);
          }}
          onEditSubject={(subj) => {
            setEditingSubject(subj);
            setIsSubjectModalOpen(true);
          }}
          onDeleteSubject={handleDeleteSubject}
          onRunAiAnalysis={handleRunAiAnalysis}
          isAnalyzing={isAnalyzing}
        />
      )}

      {/* TAB 2: NEURAL COPILOT CHAT & DOCUMENT CONTEXT */}
      {activeTab === 'CHAT' && (
        <div className="space-y-4">
          {/* 1. DOCUMENT CONTEXT CARD (With responsive mobile layout, no badge overflow) */}
          <div
            id="indexed-context-card"
            className="bg-[#10141a] rounded-2xl p-4 sm:p-5 border border-[rgba(255,255,255,0.07)] space-y-3 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isZeroData
                      ? 'bg-[#161b22] border-[#30363d] text-[#8b949e]'
                      : 'bg-[#ff3344]/10 border-[#ff3344]/30 text-[#ff3344]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">
                    {isZeroData ? 'folder_open' : 'description'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xs sm:text-sm font-bold font-heading text-white truncate">
                    {isZeroData ? 'No Dossier Ingested' : 'CS301: Lecture 08 — Virtual Memory'}
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono-code text-[#8b949e] mt-0.5 truncate">
                    <span>{isZeroData ? '0 Pages' : '42 Pages'}</span>
                    <span>•</span>
                    <span>{isZeroData ? 'Standalone Intelligence' : 'NotebookLM Grounded'}</span>
                  </div>
                </div>
              </div>

              {/* Secure responsive 100% Indexed badge: never overflows */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold uppercase border whitespace-nowrap ${
                    isZeroData
                      ? 'bg-[#161b22] border-[#30363d] text-[#8b949e]'
                      : 'bg-[#00e599]/10 border-[#00e599]/30 text-[#00e599]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isZeroData ? 'bg-[#8b949e]' : 'bg-[#00e599] animate-pulse'
                    }`}
                  ></span>
                  <span>{isZeroData ? '0% Indexed' : '100% Indexed'}</span>
                </span>
              </div>
            </div>

            {/* Quick action chips */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 select-none">
              {isZeroData ? (
                <>
                  <button
                    onClick={() => showToast('File picker opened: Select PDF / notes')}
                    className="px-3 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#1c222b] border border-[#21262d] hover:border-[#ff3344]/40 text-xs font-mono-code text-[#8b949e] hover:text-white flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm text-[#ff3344]">upload_file</span>
                    <span>Upload Lecture PDF</span>
                  </button>
                  <button
                    onClick={() => handleSendMessage('What are the fundamentals of operating system memory paging?')}
                    className="px-3 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#1c222b] border border-[#21262d] hover:border-[#ff3344]/40 text-xs font-mono-code text-[#8b949e] hover:text-white flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm text-[#ff3344]">help_center</span>
                    <span>Ask General OS Question</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSendMessage('Summarize key takeaways for CS301 Lecture 08')}
                    className="px-3 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#1c222b] border border-[#21262d] hover:border-[#ff3344]/40 text-xs font-mono-code text-[#8b949e] hover:text-white flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm text-[#ff3344]">chat</span>
                    <span>Summarize Key Takeaways</span>
                  </button>

                  <button
                    onClick={onStartDrill}
                    className="px-3 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#1c222b] border border-[#21262d] hover:border-[#ff3344]/40 text-xs font-mono-code text-[#8b949e] hover:text-white flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm text-[#ff3344]">bolt</span>
                    <span>Generate DP Drill</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 2. CHAT STREAM */}
          <div className="space-y-4">
            {activeMessages.length === 0 ? (
              <div className="bg-[#10141a] rounded-2xl p-5 sm:p-6 border border-[rgba(255,255,255,0.07)] text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#8b949e]">
                  <span className="material-symbols-outlined text-2xl">neurology</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-white">
                    NEURAL CITATION &amp; EXAM COPILOT: IDLE
                  </h3>
                  <p className="text-xs text-[#8b949e] mt-1 max-w-sm mx-auto leading-relaxed">
                    No active chat queries yet. Ask questions directly below or choose an instant prompt to test the tactical intelligence engine.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 max-w-sm mx-auto text-left">
                  {[
                    "What is Amdahl's Law in parallel architectures?",
                    "Explain the difference between paging and segmentation",
                    "How does Raft consensus elect a leader during network partitions?",
                  ].map((starter, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSendMessage(starter)}
                      className="p-2.5 rounded-xl bg-[#161b22] hover:bg-[#1c222b] border border-[#21262d] hover:border-[#ff3344]/50 text-xs font-mono-code text-[#8b949e] hover:text-white flex items-center justify-between transition-all group"
                    >
                      <span className="truncate">{starter}</span>
                      <span className="material-symbols-outlined text-sm text-[#ff3344] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                        arrow_forward
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              activeMessages.map((msg) => {
                if (msg.sender === 'user') {
                  return (
                    <div key={msg.id} className="flex flex-col items-end gap-1 pl-6 sm:pl-8">
                      <div className="bg-[#161b22] border border-[#21262d] text-white text-xs sm:text-sm p-3.5 sm:p-4 rounded-2xl rounded-tr-sm max-w-lg leading-relaxed shadow-sm">
                        {msg.text}
                      </div>
                      <span className="text-[10px] font-mono-code text-[#5c6370] pr-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                }

                // AI-NET Grounded Response Card
                return (
                  <div
                    key={msg.id}
                    className="bg-[#10141a] rounded-2xl p-4 sm:p-5 border border-[rgba(255,255,255,0.07)] space-y-4 shadow-sm"
                  >
                    {/* AI-NET Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ff3344] text-base">
                          psychology
                        </span>
                        <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-white">
                          AI-NET Response
                        </span>
                      </div>

                      {msg.references && (
                        <button
                          onClick={() => showToast(`Opening reference: ${msg.references}`)}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#161b22] hover:bg-[#1c222b] border border-[#ff3344]/30 rounded-lg text-[10px] font-mono-code text-[#ff5c6c] transition-colors"
                        >
                          <span className="material-symbols-outlined text-xs">menu_book</span>
                          <span>{msg.references}</span>
                        </button>
                      )}
                    </div>

                    {/* Body Text */}
                    <div className="text-xs sm:text-sm text-[#e6edf3] leading-relaxed space-y-2 whitespace-pre-line font-sans">
                      {msg.text}
                    </div>

                    {/* 32-Bit Virtual Address Split Visualizer */}
                    {msg.breakdown && (
                      <div className="bg-[#0d1117] rounded-xl p-3.5 border border-[#21262d] space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-mono-code">
                          <span className="font-bold text-white">32-Bit Virtual Address Split</span>
                          <span className="text-[#8b949e]">
                            Page Size: <span className="text-white">{msg.breakdown.pageSize}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-[#161b22] p-2.5 rounded-lg border border-[#21262d]">
                            <span className="block text-[10px] font-mono-code text-[#8b949e] uppercase">
                              Outer Directory
                            </span>
                            <span className="block font-mono-code text-xs font-bold text-white mt-0.5">
                              {msg.breakdown.outerBits}
                            </span>
                          </div>

                          <div className="bg-[#161b22] p-2.5 rounded-lg border border-[#21262d]">
                            <span className="block text-[10px] font-mono-code text-[#8b949e] uppercase">
                              Inner Table
                            </span>
                            <span className="block font-mono-code text-xs font-bold text-[#ff3344] mt-0.5">
                              {msg.breakdown.innerBits}
                            </span>
                          </div>

                          <div className="bg-[#161b22] p-2.5 rounded-lg border border-[#21262d]">
                            <span className="block text-[10px] font-mono-code text-[#8b949e] uppercase">
                              Offset
                            </span>
                            <span className="block font-mono-code text-xs font-bold text-white mt-0.5">
                              {msg.breakdown.offsetBits}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TLB Miss Step Sequence */}
                    {msg.sequence && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#8b949e]">
                          TLB Miss Sequence
                        </span>

                        <div className="space-y-1.5">
                          {msg.sequence.map((step, idx) => (
                            <div
                              key={idx}
                              className="bg-[#0d1117] p-3 rounded-xl border border-[#21262d] flex items-start gap-3"
                            >
                              <span className="w-5 h-5 rounded-full bg-[#161b22] text-[#ff3344] font-mono-code font-bold text-[11px] flex items-center justify-center shrink-0 border border-[#30363d] mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="text-xs text-[#8b949e] leading-snug">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exam Tip Card */}
                    {msg.examTip && (
                      <div className="bg-[#0d1117] p-3.5 rounded-xl border-l-4 border-l-[#ff3344] border-y border-r border-[#21262d] flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#ff3344] text-base shrink-0 mt-0.5">
                          lightbulb
                        </span>
                        <p className="text-xs text-[#8b949e] leading-relaxed">
                          <strong className="text-white font-medium">Exam Tip:</strong> {msg.examTip}
                        </p>
                      </div>
                    )}

                    {/* Tactical Next Steps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#21262d]">
                      <button
                        onClick={() => {
                          showToast('4 Flashcards Generated & Added to Deck!');
                          setTimeout(() => onNavigate('DECKS'), 1200);
                        }}
                        className="bg-[#ff3344] hover:bg-[#e62637] text-white py-2.5 px-3 rounded-xl font-mono-code text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 glow-crimson active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-sm">style</span>
                        <span>+ Create 4 Flashcards</span>
                      </button>

                      <button
                        onClick={onStartDrill}
                        className="bg-[#161b22] hover:bg-[#1c222b] text-white py-2.5 px-3 rounded-xl border border-[#21262d] hover:border-[#ff3344]/40 font-mono-code text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                      >
                        <span>Drill Me On This</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="bg-[#10141a] rounded-2xl p-4 border border-[#21262d] flex items-center gap-3 text-xs font-mono-code text-[#ff3344] animate-pulse">
                <span className="material-symbols-outlined text-base">sync</span>
                <span>AI-NET querying indexed knowledge vectors...</span>
              </div>
            )}
          </div>

          {/* CHAT INPUT HUD (Positioned cleanly) */}
          <div className="pt-2 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Attachment slot: Slide_08_Virtual_Mem.pdf linked')}
                className="w-10 h-10 rounded-xl bg-[#161b22] text-[#8b949e] hover:text-white border border-[#21262d] flex items-center justify-center shrink-0 transition-colors"
                title="Attach Document"
              >
                <span className="material-symbols-outlined text-[18px]">attach_file</span>
              </button>

              <div className="flex-1 relative">
                <input
                  id="ainet-query-input"
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask anything about CS301 Lecture 08..."
                  className="w-full h-10 bg-[#161b22] text-xs font-sans text-white placeholder-[#5c6370] rounded-xl pl-3 pr-9 border border-[#21262d] focus:outline-none focus:border-[#ff3344] transition-colors"
                />
                <button
                  onClick={() => showToast('Audio transcription active...')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white"
                  title="Voice Input"
                >
                  <span className="material-symbols-outlined text-[16px]">mic</span>
                </button>
              </div>

              <button
                id="ainet-send-btn"
                onClick={() => handleSendMessage()}
                className="w-10 h-10 rounded-xl bg-[#ff3344] hover:bg-[#e62637] text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,51,68,0.3)] transition-all active:scale-95"
                title="Send Query"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Input Subject & Grade */}
      <SubjectGradeModal
        isOpen={isSubjectModalOpen}
        onClose={() => {
          setIsSubjectModalOpen(false);
          setEditingSubject(null);
        }}
        onSave={handleSaveSubject}
        editingSubject={editingSubject}
      />

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#161b22] border border-[#ff3344] text-white font-mono-code text-xs px-4 py-2 rounded-xl shadow-2xl animate-fade-in flex items-center gap-2 max-w-sm text-center">
          <span className="w-2 h-2 rounded-full bg-[#00e599] animate-ping shrink-0"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
