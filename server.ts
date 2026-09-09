import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/chat", async (req, res) => {
    const { prompt, topic } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            systemInstruction: `You are AI-NET, the grounded tactical intelligence engine for university CS operators within the StudyNet Tactical HUD system.
Your current indexed context is: "CS301 Operating Systems: Lecture 08 - Virtual Memory, Paging & TLB Invalidation".
Tone: High-precision, mission-critical, diagnostic, direct, concise, academic yet tactical.
Provide responses structured with clear headings, bullet points, technical telemetry (such as bit allocations, cycles, or state matrices where applicable), and an "Exam Tip" or "Tactical Takeaway" callout. Keep responses focused and readable within a compact mobile/desktop card HUD.`,
          },
        });
        return res.json({
          reply: response.text,
          source: "gemini",
        });
      } catch (err: any) {
        console.error("Gemini query error:", err?.message);
      }
    }

    return res.json({
      reply: `Multi-level paging replaces a single monolithic flat page table with a hierarchical tree structure. The master outer page table points to subsequent second-level tables, resolving sparse memory allocation without having to allocate memory for unused virtual address regions.\n\nUnallocated memory blocks don't require second-level tables to exist in RAM. Only the active root directory and explicitly mapped tables consume physical memory frames.`,
      source: "cached-index",
      breakdown: {
        outerBits: "10 bits",
        innerBits: "10 bits",
        offsetBits: "12 bits",
        pageSize: "4 KB",
      },
      tlbSequence: [
        "MMU looks up TLB for translation tag. Tag absent; raises TLB Miss signal.",
        "Hardware page table walker fetches CR3 register base, accesses Level 1 and Level 2 page table entries.",
        "TLB is populated with resolved Physical Frame Number (PFN) and the original instruction re-executes.",
      ],
      examTip:
        "Midterm questions frequently test memory overhead for sparse address spaces. A flat 4MB table reduces to ~16KB in a 2-level scheme.",
    });
  });

  app.post("/api/analyze-expertise", async (req, res) => {
    const { subjects } = req.body;
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: "Missing subjects list" });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `Analyze this university student's academic history of taken subjects and achieved grades:
${JSON.stringify(subjects, null, 2)}

Provide an assessment formatted as JSON with the following structure:
{
  "analyzedSubjects": [
    {
      "id": "subject id",
      "name": "subject name",
      "grade": "grade",
      "areaOfExpertise": "refined domain area (e.g. Multimedia & Digital Signal Architecture for Multimedia with A+)",
      "proficiencyPercent": number (0-100 based on grade, A+ is 98%),
      "memoryRetentionPercent": number (0-100 based on spaced retention curve),
      "keyStrengths": ["strength 1", "strength 2"],
      "cognitiveNotes": "tactical insight"
    }
  ],
  "dominantDomain": "dominant area of expertise",
  "averageProficiency": number,
  "averageMemoryRetention": number,
  "recommendations": ["recommendation 1", "recommendation 2"]
}
Return only valid JSON.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const parsed = JSON.parse(response.text || "{}");
        if (parsed.analyzedSubjects) {
          return res.json({ source: "gemini", ...parsed });
        }
      } catch (err: any) {
        console.error("Gemini expertise analysis error:", err?.message);
      }
    }

    const gradeProfMap: Record<string, number> = {
      'A+': 98, 'A': 92, 'A-': 86, 'B+': 80, 'B': 74, 'B-': 68, 'C+': 62, 'C': 55, 'D': 45, 'F': 25
    };
    const gradeMemMap: Record<string, number> = {
      'A+': 95, 'A': 88, 'A-': 82, 'B+': 72, 'B': 64, 'B-': 56, 'C+': 48, 'C': 40, 'D': 30, 'F': 15
    };

    const analyzed = subjects.map((s: any) => {
      const prof = gradeProfMap[s.grade] || 75;
      const mem = gradeMemMap[s.grade] || 70;
      let area = s.areaOfExpertise || 'Specialized Technical Systems';
      const lower = (s.name || '').toLowerCase();
      if (lower.includes('multimedia') || lower.includes('media') || lower.includes('graphics')) {
        area = 'Multimedia & Digital Signal Architecture';
      } else if (lower.includes('os') || lower.includes('operating')) {
        area = 'Kernel Architecture & Memory Systems';
      } else if (lower.includes('algo')) {
        area = 'Dynamic Programming & Algorithmic Design';
      } else if (lower.includes('net') || lower.includes('distrib')) {
        area = 'Distributed Protocols & Network Concurrency';
      } else if (lower.includes('db') || lower.includes('data')) {
        area = 'Relational Engines & Storage Systems';
      }

      return {
        ...s,
        areaOfExpertise: area,
        proficiencyPercent: prof,
        memoryRetentionPercent: mem,
        cognitiveNotes: s.cognitiveNotes || `Calibrated via Grade ${s.grade}: Proficiency ${prof}%, Memory Retention ${mem}%.`,
      };
    });

    const avgProf = Math.round(analyzed.reduce((sum: number, s: any) => sum + s.proficiencyPercent, 0) / analyzed.length);
    const avgMem = Math.round(analyzed.reduce((sum: number, s: any) => sum + s.memoryRetentionPercent, 0) / analyzed.length);
    const sorted = [...analyzed].sort((a: any, b: any) => b.proficiencyPercent - a.proficiencyPercent);

    return res.json({
      source: "tactical-calibration",
      analyzedSubjects: analyzed,
      dominantDomain: `${sorted[0]?.name || 'Ingested Record'} (${sorted[0]?.grade || 'A+'}) — ${sorted[0]?.areaOfExpertise}`,
      averageProficiency: avgProf,
      averageMemoryRetention: avgMem,
      recommendations: [
        `Dominant area of expertise confirmed in ${sorted[0]?.name || 'Primary Subject'} with Grade ${sorted[0]?.grade || 'A+'} (${sorted[0]?.proficiencyPercent || 98}% proficiency).`,
        `Average active memory retention maintained at ${avgMem}%. Spaced repetition interval is healthy.`,
      ],
    });
  });

  app.post("/api/analyze-vault-subject", async (req, res) => {
    const { subject } = req.body;
    if (!subject || !subject.name) {
      return res.status(400).json({ error: "Missing subject information" });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `Perform a deep academic and cognitive telemetry analysis on this university subject stored in the student's cognitive vault:
Subject: ${subject.name} (${subject.code || 'N/A'})
Grade achieved: ${subject.grade || 'A'}
Term: ${subject.term || 'Current'}
Prior Notes: ${subject.cognitiveNotes || 'None'}

Return a JSON object strictly matching this schema:
{
  "areaOfExpertise": "refined high-tech domain title, e.g., 'Multimedia & Digital Signal Architecture' for Multimedia with A+",
  "proficiencyPercent": number between 20 and 100 based on grade,
  "memoryRetentionPercent": number between 20 and 100 based on spaced repetition curve,
  "aiInsight": {
    "status": "OPTIMAL_RETENTION" | "STABLE" | "DECAY_WARNING" | "CRITICAL_DRILL",
    "examReadiness": number between 0 and 100,
    "dominantConcepts": ["concept 1", "concept 2", "concept 3"],
    "focusWeaknesses": ["potential edge case or review topic 1", "topic 2"],
    "recommendedDrillTopic": "specific exercise recommendation",
    "verdict": "2-3 sentences of objective tactical advice regarding mastery and retention",
    "analyzedAt": "ISO date string or human readable"
  }
}
Return only valid JSON.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const parsed = JSON.parse(response.text || "{}");
        if (parsed.areaOfExpertise && parsed.aiInsight) {
          return res.json({ source: "gemini", ...parsed });
        }
      } catch (err: any) {
        console.error("Gemini vault subject analysis error:", err?.message);
      }
    }

    const gradeProfMap: Record<string, number> = {
      'A+': 98, 'A': 92, 'A-': 86, 'B+': 80, 'B': 74, 'B-': 68, 'C+': 62, 'C': 55, 'D': 45, 'F': 25
    };
    const gradeMemMap: Record<string, number> = {
      'A+': 95, 'A': 88, 'A-': 82, 'B+': 72, 'B': 64, 'B-': 56, 'C+': 48, 'C': 40, 'D': 30, 'F': 15
    };

    const prof = gradeProfMap[subject.grade] || 85;
    const mem = gradeMemMap[subject.grade] || 78;
    const lower = (subject.name || '').toLowerCase();
    let area = 'Advanced Computing Architecture';
    let concepts = ['Core Principles', 'Practical Problem Solving', 'Theoretical Frameworks'];
    let weaknesses = ['Edge case analysis', 'High-complexity synthesis'];
    let recommendedDrill = 'Timed problem set review';

    if (lower.includes('multimedia') || lower.includes('media') || lower.includes('graphics')) {
      area = 'Multimedia & Digital Signal Architecture';
      concepts = ['Fourier Transform & Discrete Cosine Transforms', 'Lossless/Lossy Entropy Coding (Huffman/LZW)', 'WebGL/Shader Pipeline Optimization'];
      weaknesses = ['Multi-channel audio compression latency', 'Color space conversions (YUV420 vs RGB)'];
      recommendedDrill = 'Video compression bitstream decoding matrix';
    } else if (lower.includes('os') || lower.includes('operating')) {
      area = 'Kernel Architecture & Memory Systems';
      concepts = ['Multi-level Paging & TLB Hit Rates', 'Semaphore & Mutex Concurrency Guards', 'Virtual File Systems & Inodes'];
      weaknesses = ['TLB shootdown overhead in SMP', 'Deadlock detection graph algorithms'];
      recommendedDrill = 'CR3 register page table walk drill';
    } else if (lower.includes('distrib') || lower.includes('net')) {
      area = 'Distributed Protocols & Network Concurrency';
      concepts = ['Raft / Paxos Consensus Proofs', 'Vector Clocks & Causality', 'gRPC Protocol Buffers & Zero-Copy'];
      weaknesses = ['Byzantine fault tolerance tolerances', 'Network partition quorum recovery'];
      recommendedDrill = 'Leader election partitioned node resolution';
    } else if (lower.includes('algo') || lower.includes('struct')) {
      area = 'Dynamic Programming & Algorithmic Design';
      concepts = ['State Space Memoization', 'Amortized Complexity Bounds', 'Flow Networks & Residual Graphs'];
      weaknesses = ['Knapsack NP-hard bounds', 'Topological DAG cycle edge cases'];
      recommendedDrill = 'Multi-state dynamic programming optimization';
    } else if (lower.includes('db') || lower.includes('data')) {
      area = 'Relational Engines & Storage Systems';
      concepts = ['B+ Tree Node Splitting & Disk I/O', 'ACID Isolation & Multi-Version Concurrency', 'Query Cost Estimation & Index Scans'];
      weaknesses = ['Write amplification in LSM-trees', 'Two-phase locking deadlocks'];
      recommendedDrill = 'B+ tree fill factor rebalancing exercise';
    }

    const readiness = Math.min(100, Math.round((prof * 0.6) + (mem * 0.4)));
    const status = mem >= 85 ? 'OPTIMAL_RETENTION' : mem >= 65 ? 'STABLE' : mem >= 45 ? 'DECAY_WARNING' : 'CRITICAL_DRILL';

    return res.json({
      source: "tactical-fallback",
      areaOfExpertise: area,
      proficiencyPercent: prof,
      memoryRetentionPercent: mem,
      aiInsight: {
        status,
        examReadiness: readiness,
        dominantConcepts: concepts,
        focusWeaknesses: weaknesses,
        recommendedDrillTopic: recommendedDrill,
        verdict: `Based on your ${subject.grade} standing, your ${area} profile exhibits ${prof}% mastery with ${mem}% active memory retention. Regular retrieval drills are recommended to stabilize the synaptic decay curve.`,
        analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    });
  });

  return app;
}

export async function startServer() {
  const app = createApp();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  if (process.env.NODE_ENV !== "production") {
    let vite;
    try {
      const mod = await import("vite");
      vite = mod.createServer;
    } catch {
      vite = null;
    }

    if (vite) {
      const viteServer = await vite({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(viteServer.middlewares);
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyNet HUD Server running on port ${PORT}`);
  });
}

if (process.env.NODE_ENV !== "production") {
  startServer();
}