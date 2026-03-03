import { useState } from "react";
import type { AlgorithmCode, CodeLanguage } from "../algoritms/types";

interface CodePanelProps {
  code: AlgorithmCode;
  highlightedLine: number;
  algorithmName: string;
}

const LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  pseudo: "Pseudocode",
  javascript: "JavaScript",
  python: "Python",
  cpp: "C++",
  java: "Java",
};

const LANGUAGE_ICONS: Record<CodeLanguage, string> = {
  pseudo: "📝",
  javascript: "🟨",
  python: "🐍",
  cpp: "⚙️",
  java: "☕",
};

export function CodePanel({
  code,
  highlightedLine,
  algorithmName,
}: CodePanelProps) {
  const [language, setLanguage] = useState<CodeLanguage>("pseudo");
  const lines = code[language];

  return (
    <div className="flex flex-col rounded-3xl overflow-hidden bg-slate-900 border border-slate-700/50 shadow-2xl shadow-indigo-900/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-800/80 border-b border-slate-700/50">
        <div className="flex items-center gap-2 font-semibold text-slate-200">
          <span className="text-xl">💻</span>
          <span>{algorithmName} — Code</span>
        </div>
        <div className="flex flex-wrap gap-1 bg-slate-950/50 p-1 rounded-xl">
          {(Object.keys(LANGUAGE_LABELS) as CodeLanguage[]).map((lang) => (
            <button
              key={lang}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap \${
                language === lang
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              onClick={() => setLanguage(lang)}
              title={LANGUAGE_LABELS[lang]}
            >
              <span>{LANGUAGE_ICONS[lang]}</span>
              <span className="hidden md:inline">{LANGUAGE_LABELS[lang]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed h-[360px] overflow-y-auto custom-scrollbar">
        <pre className="font-mono text-slate-300">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`flex items-start px-2 py-0.5 rounded transition-colors group relative \${
                highlightedLine === i
                  ? 'bg-indigo-500/20 text-indigo-200 border-l-2 border-indigo-400 -ml-[2px]'
                  : 'hover:bg-slate-800/50'
              }`}
            >
              <span className="w-8 shrink-0 text-slate-600 text-right pr-4 select-none group-hover:text-slate-500">
                {i + 1}
              </span>
              <span className="whitespace-pre flex-1">{line || " "}</span>
              {highlightedLine === i && (
                <span className="absolute right-2 text-indigo-400 animate-pulse">
                  ◀
                </span>
              )}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
