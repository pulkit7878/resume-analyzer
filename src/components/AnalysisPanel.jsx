import {
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  GraduationCap,
  LayoutPanelTop,
  Lightbulb,
  MinusCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import { ScoreRing } from './ScoreRing.jsx';

function SkillTag({ label, variant = 'success' }) {
  const styles =
    variant === 'danger'
      ? 'border-red-400/20 bg-red-500/10 text-red-100'
      : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100';

  return (
    <span className={`rounded-full border px-3 py-1.5 text-sm font-medium ${styles}`}>
      {label}
    </span>
  );
}

function PriorityBadge({ level }) {
  const styles =
    level === 'High'
      ? 'border-red-400/20 bg-red-500/10 text-red-100'
      : level === 'Medium'
        ? 'border-amber-400/20 bg-amber-500/10 text-amber-100'
        : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100';

  return <span className={`rounded-full border px-2.5 py-1 text-xs ${styles}`}>{level} Priority</span>;
}

function SeverityBadge({ severity }) {
  const styles =
    severity === 'High'
      ? 'border-red-400/20 bg-red-500/10 text-red-100'
      : severity === 'Medium'
        ? 'border-amber-400/20 bg-amber-500/10 text-amber-100'
        : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100';

  return <span className={`rounded-full border px-2.5 py-1 text-xs ${styles}`}>{severity}</span>;
}

function SectionBadge({ label, active, icon, score }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${
        active
          ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
          : 'border-white/10 bg-white/[0.04] text-slate-400'
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-xs">{score}%</span>
    </div>
  );
}

function MetricCard({ label, value, helper, icon, tone = 'from-blue-500/20 to-violet-500/20' }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
      <div
        className={`mb-4 inline-flex rounded-2xl border border-white/10 bg-gradient-to-br ${tone} p-2 text-slate-100`}
      >
        {icon}
      </div>
      <p className="text-2xl font-semibold text-white">{value}%</p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>
    </div>
  );
}

function ScoreBar({ label, value, tone = 'from-blue-400 to-violet-500' }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-medium text-white">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${tone} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function InsightList({ title, icon, items, emptyMessage, tone = 'default', layout = 'stack' }) {
  const toneClasses =
    tone === 'danger'
      ? 'border-red-400/15 bg-red-500/10 text-red-50'
      : tone === 'success'
        ? 'border-emerald-400/15 bg-emerald-500/10 text-emerald-50'
        : 'border-white/10 bg-white/[0.04] text-slate-200';
  const layoutClasses = layout === 'grid' ? 'grid gap-3 sm:grid-cols-2' : 'space-y-3';

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center gap-3">
        {icon}
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      <div className={layoutClasses}>
        {items.length ? (
          items.map((item, index) => (
            <div key={`${title}-${index}`} className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${toneClasses}`}>
              {typeof item === 'string' ? item : item.text || item.detail}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}

function VerdictCard({ result }) {
  const readinessTone =
    result.hiringReadiness === 'High'
      ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
      : result.hiringReadiness === 'Medium'
        ? 'border-amber-400/20 bg-amber-500/10 text-amber-100'
        : 'border-red-400/20 bg-red-500/10 text-red-100';

  return (
    <div className="rounded-[1.9rem] border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-violet-100">
            <Trophy className="h-4 w-4" />
            Recruiter Verdict
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Overall Score</p>
            <h2 className="mt-2 text-4xl font-semibold text-white">{result.overallScore}%</h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-300">{result.summary}</p>
          <div className="flex flex-wrap gap-3">
            <span className={`rounded-full border px-4 py-2 text-sm ${readinessTone}`}>
              Hiring Readiness: {result.hiringReadiness}
            </span>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100">
              Chance of getting shortlisted: {result.shortlistChance}%
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-200">
              {result.role.label}
            </span>
          </div>
        </div>

        <ScoreRing score={result.overallScore} label="Overall Score" />
      </div>
    </div>
  );
}

function AtsRiskPanel({ analysis }) {
  const badgeTone =
    analysis.rejectionProbability >= 60
      ? 'border-red-400/20 bg-red-500/10 text-red-100'
      : analysis.rejectionProbability >= 35
        ? 'border-amber-400/20 bg-amber-500/10 text-amber-100'
        : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100';
  const barTone =
    analysis.rejectionProbability >= 60
      ? 'from-red-500 to-rose-400'
      : analysis.rejectionProbability >= 35
        ? 'from-amber-400 to-yellow-300'
        : 'from-emerald-400 to-cyan-400';

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-cyan-300" />
          <h3 className="text-base font-semibold text-white">ATS Risk Analysis</h3>
        </div>
        <span className={`rounded-full border px-3 py-1.5 text-sm ${badgeTone}`}>
          Rejection Risk: {analysis.rejectionProbability}%
        </span>
      </div>

      <div className="h-3 rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barTone} transition-all duration-700`}
          style={{ width: `${analysis.rejectionProbability}%` }}
        />
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-400">{analysis.level}</p>

      <div className="mt-5">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Formatting Issues</p>
        <div className="space-y-2">
          {analysis.formattingIssues.length ? (
            analysis.formattingIssues.map((issue) => (
              <div
                key={issue}
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-sm text-slate-300"
              >
                {issue}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">No major formatting issues detected.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CriticalIssuesPanel({ issues }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center gap-3">
        <CircleAlert className="h-5 w-5 text-red-300" />
        <h3 className="text-base font-semibold text-white">Critical Issues</h3>
      </div>
      <div className="space-y-3">
        {issues.length ? (
          issues.map((issue, index) => (
            <div key={`${issue.title}-${index}`} className="rounded-2xl border border-red-400/15 bg-red-500/8 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{issue.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{issue.detail}</p>
                </div>
                <SeverityBadge severity={issue.severity} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No critical issues detected.</p>
        )}
      </div>
    </div>
  );
}

function RewriteSuggestionsPanel({ suggestions }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-violet-300" />
        <h3 className="text-base font-semibold text-white">AI Rewrite Suggestions</h3>
      </div>
      <div className="space-y-4">
        {suggestions.length ? (
          suggestions.map((suggestion) => (
            <div key={suggestion.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{suggestion.section}</p>
                <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs text-slate-300">
                  Before vs After
                </span>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div className="rounded-2xl border border-red-400/15 bg-red-500/8 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-red-200">Before</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{suggestion.before}</p>
                </div>
                <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/8 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">After</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{suggestion.after}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-400">{suggestion.reason}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No weak bullets were found that need rewriting.</p>
        )}
      </div>
    </div>
  );
}

function JobMatchPanel({ result }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center gap-3">
        <Target className="h-5 w-5 text-cyan-300" />
        <h3 className="text-base font-semibold text-white">Job Match Intelligence</h3>
      </div>
      <p className="text-sm leading-6 text-slate-400">{result.jobMatchIntelligence.summary}</p>

      <div className="mt-5 space-y-3">
        {result.jobMatchIntelligence.prioritizedMissing.length ? (
          result.jobMatchIntelligence.prioritizedMissing.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3"
            >
              <span className="font-medium text-white">{item.name}</span>
              <PriorityBadge level={item.priority} />
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No missing job-match keywords were detected.</p>
        )}
      </div>
    </div>
  );
}

function DeepAnalysisPanel({ result }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center gap-3">
        <BarChart3 className="h-5 w-5 text-violet-300" />
        <h3 className="text-base font-semibold text-white">Deep Analysis</h3>
      </div>
      <div className="space-y-4">
        <ScoreBar label="Action Verb Quality" value={result.actionVerbSummary.score} tone="from-violet-400 to-fuchsia-500" />
        <ScoreBar label="Measurable Impact" value={result.impactSummary.score} tone="from-emerald-400 to-cyan-500" />
      </div>
    </div>
  );
}

export function AnalysisPanel({ result }) {
  if (!result) {
    return (
      <div className="glass-card-strong flex min-h-[42rem] flex-col justify-between rounded-[2rem] p-6 shadow-soft">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">Analysis Output</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Your expert review appears here</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
            Upload a resume and optionally paste a job description to generate a recruiter-style report with critical issues, ATS risk, rewrite suggestions, and shortlist potential.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {['Critical resume issues', 'ATS rejection risk', 'AI rewrite suggestions', 'Job match intelligence'].map(
            (item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-slate-300 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"
              >
                <div className="mb-4 inline-flex rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-violet-500/20 p-2">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <p className="font-medium text-white">{item}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Structured to feel like a real recruiter personally reviewed the resume.
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  const sectionItems = [
    { key: 'education', label: 'Education', icon: <GraduationCap className="h-4 w-4" /> },
    { key: 'experience', label: 'Experience', icon: <BadgeCheck className="h-4 w-4" /> },
    { key: 'projects', label: 'Projects', icon: <Sparkles className="h-4 w-4" /> },
  ];

  return (
    <div className="glass-card-strong animate-slideUp rounded-[2rem] p-6 shadow-soft">
      <div className="space-y-6">
        <VerdictCard result={result} />

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Skill Match Score"
            value={result.visibleScores.skillMatch}
            helper="How strongly the resume surfaces the skills expected for the role."
            icon={<Target className="h-5 w-5" />}
            tone="from-blue-500/20 to-cyan-500/20"
          />
          <MetricCard
            label="ATS Compatibility Score"
            value={result.visibleScores.atsCompatibility}
            helper="How readable, structured, and keyword-complete the resume looks to ATS systems."
            icon={<ShieldCheck className="h-5 w-5" />}
            tone="from-emerald-500/20 to-cyan-500/20"
          />
          <MetricCard
            label="Job Relevance Score"
            value={result.visibleScores.jobRelevance}
            helper="How well the resume aligns with the selected role and target job description."
            icon={<Trophy className="h-5 w-5" />}
            tone="from-violet-500/20 to-fuchsia-500/20"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <CriticalIssuesPanel issues={result.criticalIssues} />
          <AtsRiskPanel analysis={result.atsRiskAnalysis} />
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[1fr_1fr_0.95fr]">
          <InsightList
            title="Strengths"
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-300" />}
            items={result.strengths}
            emptyMessage="No standout strengths were detected yet."
            tone="success"
            layout="grid"
          />
          <InsightList
            title="Weaknesses"
            icon={<MinusCircle className="h-5 w-5 text-red-300" />}
            items={result.weaknesses}
            emptyMessage="No major weaknesses were detected."
            tone="danger"
            layout="grid"
          />
          <DeepAnalysisPanel result={result} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr_0.95fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 text-emerald-300" />
              <h3 className="text-base font-semibold text-white">Matched Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.matchedSkills.length ? (
                result.matchedSkills.map((skill) => <SkillTag key={skill.name} label={skill.name} />)
              ) : (
                <p className="text-sm text-slate-400">No strong role-aligned skills were detected yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-3">
              <CircleAlert className="h-5 w-5 text-red-300" />
              <h3 className="text-base font-semibold text-white">Missing Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.length ? (
                result.missingSkills.map((skill) => (
                  <SkillTag key={skill.name} label={skill.name} variant="danger" />
                ))
              ) : (
                <p className="text-sm text-slate-400">No major role-specific skill gaps were found.</p>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-3">
              <LayoutPanelTop className="h-5 w-5 text-cyan-300" />
              <h3 className="text-base font-semibold text-white">Section Quality</h3>
            </div>
            <div className="space-y-3">
              {sectionItems.map((section) => {
                const detail = result.sectionDetails.find((item) => item.key === section.key);

                return (
                  <SectionBadge
                    key={section.key}
                    label={section.label}
                    icon={section.icon}
                    active={result.sections[section.key]}
                    score={detail?.score ?? 0}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <RewriteSuggestionsPanel suggestions={result.rewriteSuggestions} />
          <JobMatchPanel result={result} />
        </div>

        <InsightList
          title="Top Improvement Suggestions"
          icon={<Lightbulb className="h-5 w-5 text-amber-300" />}
          items={result.suggestions}
          emptyMessage="No new improvement suggestions right now."
        />
      </div>
    </div>
  );
}
