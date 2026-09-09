import React, { useState } from 'react';

interface CognitiveRadarProps {
  onDeficitClick?: () => void;
  isZeroData?: boolean;
}

export const CognitiveRadar: React.FC<CognitiveRadarProps> = ({
  onDeficitClick,
  isZeroData = false,
}) => {
  const [selectedAxis, setSelectedAxis] = useState<string | null>('DP');

  // Axis values
  const stats = [
    {
      name: 'CONCURRENCY',
      val: isZeroData ? 0 : 92,
      angle: -90,
      isDeficit: false,
      desc: isZeroData
        ? 'Uncalibrated. Complete asynchronous & multi-threading drill.'
        : 'High multi-threading and asynchronous pipeline proficiency.',
    },
    {
      name: 'MEMORY',
      val: isZeroData ? 0 : 88,
      angle: -30,
      isDeficit: false,
      desc: isZeroData
        ? 'Uncalibrated. Paging & virtual memory drills required.'
        : 'Robust understanding of hardware paging and virtual address spaces.',
    },
    {
      name: 'DP',
      val: isZeroData ? 0 : 42,
      angle: 30,
      isDeficit: !isZeroData,
      desc: isZeroData
        ? 'Uncalibrated. Run memoization formulation drill.'
        : 'Critical deficit in 2D memoization state transition latency.',
    },
    {
      name: 'QUERIES',
      val: isZeroData ? 0 : 78,
      angle: 90,
      isDeficit: false,
      desc: isZeroData
        ? 'Uncalibrated. Relational algebra vector uninitialized.'
        : 'Relational algebra and indexing structures well retained.',
    },
    {
      name: 'PROB',
      val: isZeroData ? 0 : 51,
      angle: 150,
      isDeficit: false,
      desc: isZeroData
        ? 'Uncalibrated. Bayesian & probability tests needed.'
        : 'Bayesian conditioning and Markov chains require review.',
    },
    {
      name: 'GRAPH',
      val: isZeroData ? 0 : 85,
      angle: 210,
      isDeficit: false,
      desc: isZeroData
        ? 'Uncalibrated. Graph traversal & MST drills pending.'
        : 'Strong mastery of topological sorts, Dijkstra, and MSTs.',
    },
  ];

  const activeStat = stats.find((s) => s.name === selectedAxis);

  return (
    <div id="cognitive-attributes-radar" className="bg-[#10141a] rounded-2xl p-5 border border-[rgba(255,255,255,0.07)] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#21262d]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ff3344] text-base">radar</span>
          <span className="text-xs font-mono-code font-bold tracking-wider uppercase text-white">
            Cognitive Attributes
          </span>
        </div>
        <span className="text-[10px] font-mono-code text-[#8b949e] uppercase tracking-wider">
          6-Axis Model
        </span>
      </div>

      {/* SVG Radar Graphic */}
      <div className="w-full flex justify-center py-2 relative overflow-hidden">
        <svg
          className="w-full max-w-[340px] h-auto overflow-hidden select-none"
          viewBox="0 0 400 300"
        >
          {/* Concentric Hexagons (Center at 200, 150) Radius: 95, 71, 47.5, 23.75 */}
          <polygon
            fill="none"
            points="200,55 282.3,102.5 282.3,197.5 200,245 117.7,197.5 117.7,102.5"
            stroke="#21262d"
            strokeWidth="1.2"
          />
          <polygon
            fill="none"
            points="200,79 261.5,114.5 261.5,185.5 200,221 138.5,185.5 138.5,114.5"
            stroke="#21262d"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
          <polygon
            fill="none"
            points="200,102.5 241.1,126.25 241.1,173.75 200,197.5 158.9,173.75 158.9,126.25"
            stroke="#21262d"
            strokeWidth="1"
          />
          <polygon
            fill="none"
            points="200,126 220.6,138 220.6,162 200,174 179.4,162 179.4,138"
            stroke="#21262d"
            strokeDasharray="2 2"
            strokeWidth="0.8"
          />

          {/* Axis Spokes */}
          <line stroke="#21262d" strokeWidth="1" x1="200" y1="150" x2="200" y2="55" />
          <line stroke="#21262d" strokeWidth="1" x1="200" y1="150" x2="282.3" y2="102.5" />
          <line stroke="#21262d" strokeWidth="1" x1="200" y1="150" x2="282.3" y2="197.5" />
          <line stroke="#21262d" strokeWidth="1" x1="200" y1="150" x2="200" y2="245" />
          <line stroke="#21262d" strokeWidth="1" x1="200" y1="150" x2="117.7" y2="197.5" />
          <line stroke="#21262d" strokeWidth="1" x1="200" y1="150" x2="117.7" y2="102.5" />

          {/* Data Polygon: Concurrency, Memory, DP, Queries, Prob, Graph */}
          {!isZeroData ? (
            <>
              <polygon
                fill="rgba(255, 51, 68, 0.16)"
                points="200,63 272.4,108.2 234.6,170 200,224 158.0,174.2 130.1,109.6"
                stroke="#ff3344"
                strokeWidth="2"
              />

              {/* Standard Data Points */}
              <circle
                cx="200"
                cy="63"
                fill="#ffffff"
                r="3.5"
                stroke="#0a0e14"
                strokeWidth="1.5"
                className="cursor-pointer hover:r-5 transition-all"
                onClick={() => setSelectedAxis('CONCURRENCY')}
              />
              <circle
                cx="272.4"
                cy="108.2"
                fill="#ffffff"
                r="3.5"
                stroke="#0a0e14"
                strokeWidth="1.5"
                className="cursor-pointer hover:r-5 transition-all"
                onClick={() => setSelectedAxis('MEMORY')}
              />
              <circle
                cx="200"
                cy="224"
                fill="#ffffff"
                r="3.5"
                stroke="#0a0e14"
                strokeWidth="1.5"
                className="cursor-pointer hover:r-5 transition-all"
                onClick={() => setSelectedAxis('QUERIES')}
              />
              <circle
                cx="158.0"
                cy="174.2"
                fill="#8b949e"
                r="3.5"
                stroke="#0a0e14"
                strokeWidth="1.5"
                className="cursor-pointer hover:r-5 transition-all"
                onClick={() => setSelectedAxis('PROB')}
              />
              <circle
                cx="130.1"
                cy="109.6"
                fill="#ffffff"
                r="3.5"
                stroke="#0a0e14"
                strokeWidth="1.5"
                className="cursor-pointer hover:r-5 transition-all"
                onClick={() => setSelectedAxis('GRAPH')}
              />

              {/* Highlight Deficit DP (42) with glowing pulse */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  setSelectedAxis('DP');
                  if (onDeficitClick) onDeficitClick();
                }}
              >
                <circle cx="234.6" cy="170" fill="#ff3344" r="5.5" stroke="#0a0e14" strokeWidth="1.5" />
                <circle
                  cx="234.6"
                  cy="170"
                  fill="none"
                  r="9.5"
                  stroke="#ff3344"
                  strokeDasharray="2 2"
                  strokeWidth="1.2"
                  className="animate-spin origin-[234.6px_170px]"
                />
              </g>
            </>
          ) : (
            <circle
              cx="200"
              cy="150"
              fill="none"
              r="12"
              stroke="#ff3344"
              strokeDasharray="3 3"
              strokeWidth="1.2"
              className="animate-pulse"
            />
          )}

          {/* Axis Labels */}
          <text
            fill={isZeroData ? '#8b949e' : '#ffffff'}
            fontFamily="Space Mono, monospace"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            x="200"
            y="35"
            className="cursor-pointer hover:fill-[#ff3344] transition-colors"
            onClick={() => setSelectedAxis('CONCURRENCY')}
          >
            {isZeroData ? 'CONCURRENCY 0' : 'CONCURRENCY 92'}
          </text>
          <text
            fill={isZeroData ? '#8b949e' : '#ffffff'}
            fontFamily="Space Mono, monospace"
            fontSize="10"
            fontWeight="bold"
            textAnchor="start"
            x="292"
            y="102"
            className="cursor-pointer hover:fill-[#ff3344] transition-colors"
            onClick={() => setSelectedAxis('MEMORY')}
          >
            {isZeroData ? 'MEMORY 0' : 'MEMORY 88'}
          </text>
          <text
            fill={isZeroData ? '#8b949e' : '#ff3344'}
            fontFamily="Space Mono, monospace"
            fontSize="10"
            fontWeight="bold"
            textAnchor="start"
            x="245"
            y="196"
            className="cursor-pointer hover:brightness-125 transition-all"
            onClick={() => {
              setSelectedAxis('DP');
              if (onDeficitClick) onDeficitClick();
            }}
          >
            {isZeroData ? 'DP 0' : 'DP 42 (DEFICIT)'}
          </text>
          <text
            fill={isZeroData ? '#8b949e' : '#ffffff'}
            fontFamily="Space Mono, monospace"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            x="200"
            y="272"
            className="cursor-pointer hover:fill-[#ff3344] transition-colors"
            onClick={() => setSelectedAxis('QUERIES')}
          >
            {isZeroData ? 'QUERIES 0' : 'QUERIES 78'}
          </text>
          <text
            fill="#8b949e"
            fontFamily="Space Mono, monospace"
            fontSize="10"
            fontWeight="bold"
            textAnchor="end"
            x="148"
            y="196"
            className="cursor-pointer hover:fill-white transition-colors"
            onClick={() => setSelectedAxis('PROB')}
          >
            {isZeroData ? 'PROB 0' : 'PROB 51'}
          </text>
          <text
            fill={isZeroData ? '#8b949e' : '#ffffff'}
            fontFamily="Space Mono, monospace"
            fontSize="10"
            fontWeight="bold"
            textAnchor="end"
            x="108"
            y="102"
            className="cursor-pointer hover:fill-[#ff3344] transition-colors"
            onClick={() => setSelectedAxis('GRAPH')}
          >
            {isZeroData ? 'GRAPH 0' : 'GRAPH 85'}
          </text>
        </svg>
      </div>

      {/* Interactive telemetry callout for selected axis */}
      {activeStat && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-[#0d1117] border border-[#21262d] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                activeStat.isDeficit
                  ? 'bg-[#ff3344] animate-ping'
                  : isZeroData
                  ? 'bg-[#8b949e]'
                  : 'bg-[#00e599]'
              }`}
            ></span>
            <span className="font-mono-code font-bold text-white">
              {activeStat.name}: {activeStat.val}%
            </span>
          </div>
          <span className="text-[11px] text-[#8b949e] font-sans truncate max-w-[200px]">
            {activeStat.desc}
          </span>
        </div>
      )}

      {/* Summary Matrix */}
      <div className="grid grid-cols-3 gap-2 pt-3.5 border-t border-[#21262d] text-center">
        <div>
          <span className="block text-[10px] font-mono-code text-[#8b949e] uppercase tracking-wider">
            Affinity
          </span>
          <span className="font-mono-code text-xs font-bold text-white mt-0.5 block">
            {isZeroData ? '0 Core' : '3 Core'}
          </span>
        </div>
        <div className="border-x border-[#21262d]">
          <span
            className={`block text-[10px] font-mono-code uppercase tracking-wider ${
              isZeroData ? 'text-[#8b949e]' : 'text-[#ff3344]'
            }`}
          >
            Deficit
          </span>
          <span
            className={`font-mono-code text-xs font-bold mt-0.5 block ${
              isZeroData ? 'text-[#8b949e]' : 'text-[#ff3344]'
            }`}
          >
            {isZeroData ? '0 Critical' : '1 Critical'}
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-mono-code text-[#8b949e] uppercase tracking-wider">
            Vulnerable
          </span>
          <span className="font-mono-code text-xs font-bold text-[#8b949e] mt-0.5 block">
            {isZeroData ? '0 Zones' : '1 Zone'}
          </span>
        </div>
      </div>
    </div>
  );
};
