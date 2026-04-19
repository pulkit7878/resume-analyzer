import { BriefcaseBusiness, FileText, RotateCcw, Sparkles, UploadCloud } from 'lucide-react';

export function ResumeInputCard({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  fileName,
  resumeText,
  onTextChange,
  jobDescription,
  onJobDescriptionChange,
  onLoadDemo,
  onClear,
  uploadStatus,
}) {
  return (
    <div className="glass-card rounded-[2rem] p-6 shadow-soft">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-blue-200/80">Resume Input</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Upload, target, and refine your resume</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Add both the resume and an optional job description to unlock deeper role targeting, demand-weighted scoring, and sharper recommendations.
          </p>
        </div>
        <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 sm:block">
          <FileText className="h-5 w-5" />
        </div>
      </div>

      <label
        className={`group relative flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed px-6 text-center transition-all duration-300 ${
          isDragging
            ? 'scale-[1.01] border-blue-400/80 bg-blue-500/10 shadow-glow'
            : 'border-white/15 bg-white/[0.04] hover:border-blue-300/50 hover:bg-white/[0.06]'
        }`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(event) => onFileSelect(event.target.files?.[0] ?? null)}
        />
        {isDragging && <div className="absolute inset-4 rounded-[1.45rem] border border-blue-300/30 bg-blue-400/5 animate-pulseSlow" />}
        <div className="mb-4 rounded-full border border-white/10 bg-white/10 p-4 text-blue-200 transition-transform duration-300 group-hover:-translate-y-1">
          <UploadCloud className="h-8 w-8" />
        </div>
        <p className="text-lg font-semibold text-white">Drop your PDF here</p>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
          Upload a resume PDF for automatic parsing with `pdf.js`, or use the textarea below for quick manual testing.
        </p>
        <span className="mt-5 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200 transition-colors duration-200 group-hover:bg-white/15">
          Browse PDF
        </span>
      </label>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-slate-300">
            <span className="mr-2 text-slate-500">File:</span>
            {fileName || 'No PDF selected yet'}
          </p>
          {uploadStatus && (
            <p className="text-sm text-emerald-200">Resume uploaded successfully</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onLoadDemo}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-slate-100 transition duration-200 hover:bg-white/15"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Load Demo Data
          </button>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition duration-200 hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="resume-text" className="text-sm font-medium uppercase tracking-[0.24em] text-slate-300">
              Resume Content
            </label>
            <span className="text-xs text-slate-500">{resumeText.trim().length} chars</span>
          </div>
          <textarea
            id="resume-text"
            value={resumeText}
            onChange={(event) => onTextChange(event.target.value)}
            placeholder="Paste resume text here to test the analyzer instantly..."
            className="scrollbar-slim min-h-64 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/50 px-4 py-4 text-sm leading-7 text-slate-100 outline-none transition duration-200 placeholder:text-slate-500 focus:border-blue-400/50 focus:bg-slate-950/60"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="job-description" className="text-sm font-medium uppercase tracking-[0.24em] text-slate-300">
              Job Description
            </label>
            <span className="inline-flex items-center gap-2 text-xs text-slate-500">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Optional but recommended
            </span>
          </div>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(event) => onJobDescriptionChange(event.target.value)}
            placeholder="Paste a target job description to unlock demand-weighted scoring and more targeted suggestions..."
            className="scrollbar-slim min-h-64 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/50 px-4 py-4 text-sm leading-7 text-slate-100 outline-none transition duration-200 placeholder:text-slate-500 focus:border-violet-400/50 focus:bg-slate-950/60"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          'Weighted matching gets stronger when the same skill appears in the right section.',
          'Job description input increases the priority of demanded skills and gaps.',
          'Section quality and quantified impact both influence the final score.',
        ].map((item) => (
          <div
            key={item}
            className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-slate-300"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
