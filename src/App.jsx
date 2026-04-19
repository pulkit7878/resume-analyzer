import { useRef, useState } from 'react';
import { ArrowRight, FileScan, Layers3, Radar, WandSparkles } from 'lucide-react';
import { AnalysisPanel } from './components/AnalysisPanel.jsx';
import { BackgroundOrbs } from './components/BackgroundOrbs.jsx';
import { LoadingOverlay } from './components/LoadingOverlay.jsx';
import { ResumeInputCard } from './components/ResumeInputCard.jsx';
import { RoleSelector } from './components/RoleSelector.jsx';
import { analyzeResumeForRole } from './utils/analysis.js';
import { extractTextFromPdf } from './utils/pdf.js';

const ANALYSIS_STEPS = [
  'Parsing resume...',
  'Extracting skills and sections...',
  'Matching with job role...',
  'Generating insights...',
];

function wait(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

export default function App() {
  const [selectedRole, setSelectedRole] = useState('frontend');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(ANALYSIS_STEPS[0]);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState(false);
  const resultRef = useRef(null);

  const runAnalysis = async (textToAnalyze, jobDescriptionToAnalyze = jobDescription) => {
    setLoading(true);
    setError('');
    setLoadingStage(ANALYSIS_STEPS[0]);
    setLoadingStepIndex(0);

    for (let index = 0; index < ANALYSIS_STEPS.length; index += 1) {
      setLoadingStage(ANALYSIS_STEPS[index]);
      setLoadingStepIndex(index);
      await wait(index === ANALYSIS_STEPS.length - 1 ? 420 : 320);
    }

    const result = analyzeResumeForRole(textToAnalyze, selectedRole, jobDescriptionToAnalyze);
    setAnalysisResult(result);
    await wait(180);
    setLoading(false);

    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleAnalyzeClick = async () => {
    if (!resumeText.trim()) {
      setError('Add resume text or upload a PDF before running the analyzer.');
      return;
    }

    await runAnalysis(resumeText, jobDescription);
  };

  const handleFile = async (file) => {
    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported for drag-and-drop upload.');
      return;
    }

    setError('');
    setUploadedFileName(file.name);
    setUploadStatus(true);
    setLoading(true);
    setLoadingStage(ANALYSIS_STEPS[0]);
    setLoadingStepIndex(0);

    try {
      const extractPromise = extractTextFromPdf(file);
      await wait(320);
      const extractedText = await extractPromise;
      setResumeText(extractedText);

      for (let index = 1; index < ANALYSIS_STEPS.length; index += 1) {
        setLoadingStage(ANALYSIS_STEPS[index]);
        setLoadingStepIndex(index);
        await wait(index === ANALYSIS_STEPS.length - 1 ? 420 : 320);
      }

      const result = analyzeResumeForRole(extractedText, selectedRole, jobDescription);
      setAnalysisResult(result);
    } catch (uploadError) {
      setError('Unable to read this PDF. Try a text-based PDF or paste the resume manually.');
      setUploadStatus(false);
    } finally {
      await wait(180);
      setLoading(false);
      setIsDragging(false);
    }
  };

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    if (resumeText.trim()) {
      setAnalysisResult(analyzeResumeForRole(resumeText, roleId, jobDescription));
    }
  };

  const handleClear = () => {
    setUploadedFileName('');
    setResumeText('');
    setJobDescription('');
    setUploadStatus(false);
    setError('');
    setAnalysisResult(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-40" />
      <BackgroundOrbs />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="glass-card-strong rounded-[2.25rem] px-6 py-8 shadow-soft sm:px-8 lg:px-10">
          <div className="flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-blue-100">
                <WandSparkles className="h-4 w-4" />
                AI-style frontend experience
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Resume Analyzer built for modern hiring signals
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Analyze resume fit with weighted keywords, synonym matching, section detection, and experience cues inside a polished SaaS-style interface.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[28rem]">
              {[
                {
                  icon: <FileScan className="h-5 w-5 text-blue-200" />,
                  title: 'PDF + Text',
                  description: 'Upload or paste resumes instantly.',
                },
                {
                  icon: <Layers3 className="h-5 w-5 text-violet-200" />,
                  title: 'Multi-Signal',
                  description: 'Weighted skills, sections, and experience.',
                },
                {
                  icon: <Radar className="h-5 w-5 text-cyan-200" />,
                  title: 'Targeted',
                  description: 'Job-description-aware analysis.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"
                >
                  <div className="mb-3 inline-flex rounded-2xl border border-white/10 bg-white/10 p-2">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 glass-card rounded-[2rem] p-6 shadow-soft">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200/80">Target Role</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Choose the benchmark role</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              Each role includes its own weighted skill map and synonym set, so scoring feels targeted rather than generic.
            </p>
          </div>

          <RoleSelector selectedRole={selectedRole} onSelect={handleRoleChange} />
        </section>

        <section className="relative mt-8 grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="relative">
            <LoadingOverlay
              visible={loading}
              stage={loadingStage}
              stages={ANALYSIS_STEPS}
              activeStep={loadingStepIndex}
            />
            <ResumeInputCard
              isDragging={isDragging}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFile(event.dataTransfer.files?.[0] ?? null);
              }}
              onFileSelect={handleFile}
              fileName={uploadedFileName}
              resumeText={resumeText}
              onTextChange={setResumeText}
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              onClear={handleClear}
              uploadStatus={uploadStatus}
            />

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {error ? (
                <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  Tip: keeping the job description in sync with the selected role will produce a much more realistic advanced analysis.
                </p>
              )}

              <button
                type="button"
                onClick={handleAnalyzeClick}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-blue-300/40"
              >
                Analyze Resume
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={resultRef}>
            <AnalysisPanel result={analysisResult} />
          </div>
        </section>
      </main>
    </div>
  );
}
