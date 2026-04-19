import { ROLES } from '../data/roles.js';

const SECTION_PATTERNS = {
  skills: /(skills|technical skills|core competencies|tech stack)/,
  projects: /(projects|personal projects|academic projects|key projects)/,
  education: /(education|academic background|qualifications)/,
  experience: /(experience|work experience|employment|internship|internships)/,
  certifications: /(certifications|licenses|courses)/,
};

const SECTION_LABELS = {
  summary: 'Summary',
  skills: 'Skills',
  projects: 'Projects',
  education: 'Education',
  experience: 'Experience',
  certifications: 'Certifications',
};

const ACTION_VERBS = [
  'built',
  'developed',
  'designed',
  'implemented',
  'led',
  'optimized',
  'improved',
  'launched',
  'created',
  'delivered',
  'managed',
  'analyzed',
  'automated',
  'increased',
  'reduced',
  'scaled',
  'owned',
  'collaborated',
];

const ROLE_TUNING = {
  'software-developer': {
    minYears: 1,
    preferredSections: ['skills', 'projects', 'experience'],
  },
  'web-developer': {
    minYears: 1,
    preferredSections: ['skills', 'projects', 'experience'],
  },
  'data-analyst': {
    minYears: 1,
    preferredSections: ['skills', 'projects', 'experience', 'education'],
  },
  frontend: {
    minYears: 1,
    preferredSections: ['skills', 'projects', 'experience'],
  },
  backend: {
    minYears: 2,
    preferredSections: ['skills', 'projects', 'experience'],
  },
  'full-stack': {
    minYears: 2,
    preferredSections: ['skills', 'projects', 'experience'],
  },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeResumeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .replace(/\b(curriculum vitae|resume)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCleanLines(rawText) {
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function getSectionHeading(line) {
  const normalizedLine = normalizeResumeText(line);

  return Object.entries(SECTION_PATTERNS).find(([, pattern]) => pattern.test(normalizedLine))?.[0] ?? null;
}

export function extractSectionMap(rawText) {
  const lines = getCleanLines(rawText);
  const initialMap = {
    summary: [],
    skills: [],
    projects: [],
    education: [],
    experience: [],
    certifications: [],
  };
  let currentSection = 'summary';

  lines.forEach((line) => {
    const detectedSection = getSectionHeading(line);

    if (detectedSection) {
      currentSection = detectedSection;
      return;
    }

    initialMap[currentSection].push(line);
  });

  return Object.fromEntries(
    Object.entries(initialMap).map(([section, content]) => [section, content.join(' ')])
  );
}

export function detectSections(rawText) {
  const lines = getCleanLines(rawText);
  const sectionMap = extractSectionMap(rawText);

  return Object.entries(SECTION_PATTERNS).reduce((accumulator, [section, pattern]) => {
    accumulator[section] =
      lines.some((line) => pattern.test(line.toLowerCase())) || sectionMap[section].length > 24;
    return accumulator;
  }, {});
}

export function detectExperienceLevel(text) {
  const normalized = normalizeResumeText(text);
  const years = [...normalized.matchAll(/(\d+)\+?\s*(?:years|year|yrs)/g)].map((match) =>
    Number(match[1]),
  );

  if (/\b(fresher|entry level|entry-level|graduate|recent graduate)\b/.test(normalized)) {
    return {
      label: 'Fresher',
      confidence: 'High',
      years: 0,
      summary: 'Profile signals entry-level positioning or recent graduation.',
    };
  }

  if (/\b(intern|internship|trainee)\b/.test(normalized) && years.length === 0) {
    return {
      label: 'Intern / Early Career',
      confidence: 'Medium',
      years: 0,
      summary: 'Resume suggests internship or early-career experience.',
    };
  }

  const highestYears = years.length ? Math.max(...years) : 0;

  if (highestYears >= 5) {
    return {
      label: 'Experienced',
      confidence: 'High',
      years: highestYears,
      summary: `Detected roughly ${highestYears}+ years of professional experience.`,
    };
  }

  if (highestYears >= 2) {
    return {
      label: 'Mid Level',
      confidence: 'Medium',
      years: highestYears,
      summary: `Detected approximately ${highestYears} years of experience.`,
    };
  }

  if (highestYears > 0) {
    return {
      label: 'Junior',
      confidence: 'Medium',
      years: highestYears,
      summary: `Detected around ${highestYears} year${highestYears > 1 ? 's' : ''} of experience.`,
    };
  }

  return {
    label: 'Undetermined',
    confidence: 'Low',
    years: 0,
    summary: 'No clear years-of-experience signal was detected.',
  };
}

function synonymMatched(text, synonym) {
  const escaped = synonym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`\\b${escaped.replace(/\s+/g, '\\s+')}\\b`, 'i');
  return pattern.test(text);
}

function countSynonymMentions(text, synonym) {
  const escaped = synonym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`\\b${escaped.replace(/\s+/g, '\\s+')}\\b`, 'gi');
  return (text.match(pattern) || []).length;
}

function findBestSynonym(text, synonyms) {
  return synonyms.find((synonym) => synonymMatched(text, synonym)) ?? null;
}

function countKeywordMentions(text, synonyms) {
  return synonyms.reduce((count, synonym) => count + countSynonymMentions(text, synonym), 0);
}

function findEvidenceSection(sectionMap, synonyms) {
  return Object.entries(sectionMap).find(([, sectionText]) => findBestSynonym(sectionText, synonyms))?.[0] ?? null;
}

function getRoleById(roleId) {
  return ROLES.find((role) => role.id === roleId) ?? ROLES[0];
}

function analyzeImpactSignals(rawText, normalizedText, sections) {
  const bulletCount = (rawText.match(/^\s*(?:[-*]|\u2022|\d+\.)/gm) || []).length;
  const metricMatches = [
    ...(rawText.match(/\b\d+%/g) || []),
    ...(rawText.match(/\b\d+\+?\s*(?:users|clients|customers|projects|teams|features|months|weeks|days)\b/gi) || []),
    ...(rawText.match(/\$[\d,.]+/g) || []),
  ];
  const actionVerbCount = ACTION_VERBS.reduce(
    (count, verb) => count + countSynonymMentions(normalizedText, verb),
    0,
  );
  const impactScore = clamp(
    metricMatches.length * 18 +
      actionVerbCount * 6 +
      (sections.projects ? 12 : 0) +
      (sections.experience ? 10 : 0) +
      (bulletCount >= 3 ? 10 : 0),
    18,
    100,
  );

  return {
    bulletCount,
    metricCount: metricMatches.length,
    actionVerbCount,
    score: impactScore,
  };
}

function buildSectionDetails(sectionMap, sections, tuning) {
  const detailKeys = ['skills', 'projects', 'experience', 'education', 'certifications'];

  return detailKeys.map((sectionKey) => {
    const charCount = sectionMap[sectionKey].length;
    const preferred = tuning.preferredSections.includes(sectionKey);
    const qualityScore = clamp(
      preferred ? charCount / 2.8 : charCount / 3.8,
      sections[sectionKey] ? (preferred ? 58 : 48) : 16,
      100,
    );
    const note = sections[sectionKey]
      ? charCount > 100
        ? `${SECTION_LABELS[sectionKey]} has enough content to support stronger parsing.`
        : `${SECTION_LABELS[sectionKey]} exists but could use more depth and examples.`
      : `${SECTION_LABELS[sectionKey]} is not clearly detected.`;

    return {
      key: sectionKey,
      label: SECTION_LABELS[sectionKey],
      present: sections[sectionKey],
      preferred,
      charCount,
      score: Math.round(qualityScore),
      note,
    };
  });
}

function calculateSectionScore(sectionDetails) {
  const weightedTotal = sectionDetails.reduce((sum, section) => sum + (section.preferred ? 1.2 : 0.7), 0);
  const achieved = sectionDetails.reduce(
    (sum, section) => sum + section.score * (section.preferred ? 1.2 : 0.7),
    0,
  );

  return Math.round(achieved / weightedTotal);
}

function calculateExperienceScore(experience, sections, roleId) {
  const tuning = ROLE_TUNING[roleId] ?? { minYears: 1, preferredSections: ['skills', 'projects', 'experience'] };

  if (!sections.experience && !sections.projects) {
    return 28;
  }

  if (experience.label === 'Experienced') {
    return experience.years >= tuning.minYears ? 94 : 82;
  }

  if (experience.label === 'Mid Level') {
    return experience.years >= tuning.minYears ? 82 : 68;
  }

  if (experience.label === 'Junior' || experience.label === 'Intern / Early Career') {
    return tuning.minYears <= 1 ? 72 : 54;
  }

  if (experience.label === 'Fresher') {
    return tuning.minYears <= 1 ? 66 : 44;
  }

  return sections.experience ? 52 : 38;
}

function getFitLabel(score) {
  if (score >= 85) {
    return 'Outstanding Fit';
  }

  if (score >= 72) {
    return 'Strong Fit';
  }

  if (score >= 58) {
    return 'Promising Fit';
  }

  if (score >= 42) {
    return 'Partial Fit';
  }

  return 'Needs More Signal';
}

function getRoleSeniority(experience) {
  if (experience.label === 'Experienced') {
    return 'senior-level';
  }

  if (experience.label === 'Mid Level') {
    return 'mid-level';
  }

  return 'entry-level';
}

function buildSummary(role, overallScore, topGap, experience) {
  const seniority = getRoleSeniority(experience);

  if (overallScore >= 78) {
    return `Strong match for ${seniority} ${role.label} roles, with only a few refinements needed.`;
  }

  if (overallScore >= 60) {
    return `Good for ${seniority} roles, but missing key skills for ${role.label}${topGap ? ` like ${topGap}` : ''}.`;
  }

  return `Not yet competitive for ${role.label} roles because the resume is missing several core signals.`;
}

function buildRiskList({ sections, diagnostics, impact, skillsScore, jobDescriptionInsights }) {
  const risks = [];

  if (!sections.skills) {
    risks.push({
      title: 'No dedicated skills section',
      severity: 'High',
      detail: 'Recruiters and ATS scanners may miss your strongest technologies without a clear skills block.',
    });
  }

  if (!sections.projects && !sections.experience) {
    risks.push({
      title: 'Low proof of execution',
      severity: 'High',
      detail: 'Without projects or experience sections, the resume lacks evidence that skills were applied in real work.',
    });
  }

  if (impact.metricCount < 2) {
    risks.push({
      title: 'Weak measurable impact',
      severity: 'Medium',
      detail: 'Add quantified outcomes such as percentages, user counts, revenue, or delivery scale.',
    });
  }

  if (diagnostics.wordCount < 180) {
    risks.push({
      title: 'Resume may be too short',
      severity: 'Medium',
      detail: 'The document likely needs more project depth, accomplishments, and technology context.',
    });
  }

  if (diagnostics.wordCount > 950) {
    risks.push({
      title: 'Resume may be too dense',
      severity: 'Medium',
      detail: 'A long resume can hide the strongest signals. Compress weaker bullets and surface top-value work earlier.',
    });
  }

  if (skillsScore < 48) {
    risks.push({
      title: 'Role-specific keyword coverage is low',
      severity: 'High',
      detail: 'The current resume does not surface enough of the expected role vocabulary to score competitively.',
    });
  }

  if (jobDescriptionInsights.enabled && jobDescriptionInsights.missingKeywords.length >= 3) {
    risks.push({
      title: 'Job description mismatch',
      severity: 'High',
      detail: 'Several requirements from the target job description are not clearly reflected in the resume.',
    });
  }

  return risks.slice(0, 4);
}

function buildRecommendations({ missingSkills, sectionDetails, impact, jobDescriptionInsights, diagnostics, role }) {
  const recommendations = [];
  const topSkills = missingSkills.slice(0, 3).map((skill) => skill.name);

  if (topSkills.length) {
    recommendations.push({
      id: 'top-skills',
      impact: 100,
      type: 'High Impact',
      text: `Add ${topSkills.join(', ')} for ${role.label} roles, ideally in both the skills section and project bullets.`,
    });
  }

  const missingPreferredSection = sectionDetails.find((section) => section.preferred && !section.present);
  if (missingPreferredSection) {
    recommendations.push({
      id: 'missing-section',
      impact: 96,
      type: 'High Impact',
      text: `Add a ${missingPreferredSection.label.toLowerCase()} section if missing so recruiters can quickly verify relevant experience.`,
    });
  }

  if (impact.metricCount < 2) {
    recommendations.push({
      id: 'metrics',
      impact: 92,
      type: 'High Impact',
      text: 'Include measurable achievements such as improved performance by 30%, reduced response time, or increased user engagement.',
    });
  }

  const weakSection = sectionDetails.find((section) => section.present && section.score < 65);
  if (weakSection) {
    recommendations.push({
      id: 'section-depth',
      impact: 76,
      type: 'Content Depth',
      text: `Strengthen the ${weakSection.label.toLowerCase()} section with more tools, ownership, and business outcomes so it feels less generic.`,
    });
  }

  if (jobDescriptionInsights.enabled && jobDescriptionInsights.missingKeywords.length) {
    recommendations.push({
      id: 'job-description',
      impact: 88,
      type: 'Targeting',
      text: `Reflect more of the target job language, especially ${jobDescriptionInsights.missingKeywords
        .slice(0, 2)
        .map((skill) => skill.name)
        .join(' and ')}.`,
    });
  }

  if (diagnostics.wordCount < 180) {
    recommendations.push({
      id: 'depth',
      impact: 70,
      type: 'Content Depth',
      text: 'Add one or two richer project bullets with architecture, tools, ownership, and measurable outcomes.',
    });
  }

  return recommendations.sort((first, second) => second.impact - first.impact).slice(0, 5);
}

function buildRoadmap({ matchedSkills, missingSkills, impact, sections }) {
  const roadmap = [];

  if (missingSkills.length) {
    roadmap.push(`Prioritize ${missingSkills[0].name} and ${missingSkills[1]?.name ?? 'another missing core skill'} in your next resume revision.`);
  }

  if (!sections.projects) {
    roadmap.push('Add a projects section with product, tooling, and outcome-focused bullets.');
  }

  if (impact.metricCount < 2) {
    roadmap.push('Introduce quantified results to make the resume feel senior and execution-oriented.');
  }

  if (matchedSkills.length >= 3) {
    roadmap.push(`Keep ${matchedSkills
      .slice(0, 3)
      .map((skill) => skill.name)
      .join(', ')} near the top of the resume because they are already scoring well.`);
  }

  return roadmap.slice(0, 4);
}

function calculateAtsCompatibility({ sectionDetails, sections, diagnostics, impact, matchedSkills }) {
  const sectionScore = calculateSectionScore(sectionDetails);
  const structureCoverage =
    [sections.skills, sections.projects, sections.experience, sections.education].filter(Boolean).length / 4;
  const formatScore =
    diagnostics.wordCount >= 180 && diagnostics.wordCount <= 850
      ? 88
      : diagnostics.wordCount >= 120 && diagnostics.wordCount <= 1000
        ? 72
        : 55;
  const keywordSupport = clamp(42 + matchedSkills.length * 8, 42, 92);
  const measurableImpact = impact.metricCount >= 2 ? 86 : impact.metricCount === 1 ? 72 : 58;

  return Math.round(
    clamp(
      sectionScore * 0.42 +
        structureCoverage * 100 * 0.28 +
        formatScore * 0.16 +
        keywordSupport * 0.08 +
        measurableImpact * 0.06,
      18,
      100,
    ),
  );
}

function calculateJobRelevanceScore({ skillsScore, experienceScore, impactScore, jobDescriptionScore, jobDescriptionUsed }) {
  const targetSignal = jobDescriptionUsed ? jobDescriptionScore : skillsScore;

  return Math.round(
    clamp(targetSignal * 0.5 + skillsScore * 0.2 + experienceScore * 0.18 + impactScore * 0.12, 18, 100),
  );
}

function calculateOverallScore({ skillMatchScore, atsCompatibilityScore, jobRelevanceScore }) {
  return Math.round(
    clamp(skillMatchScore * 0.4 + atsCompatibilityScore * 0.28 + jobRelevanceScore * 0.32, 18, 98),
  );
}

function calculateAtsPassProbability({ atsCompatibilityScore, skillMatchScore, jobRelevanceScore }) {
  return Math.round(
    clamp(atsCompatibilityScore * 0.7 + skillMatchScore * 0.16 + jobRelevanceScore * 0.14, 12, 99),
  );
}

function getHiringReadinessLevel({ overallScore, atsPassProbability }) {
  if (overallScore >= 76 && atsPassProbability >= 70) {
    return 'High';
  }

  if (overallScore >= 55 && atsPassProbability >= 45) {
    return 'Medium';
  }

  return 'Low';
}

function buildStrengths({ matchedSkills, sections, impact, experience, role }) {
  const strengths = [];

  if (matchedSkills.length) {
    strengths.push(`Shows strong alignment with ${matchedSkills.slice(0, 2).map((skill) => skill.name).join(' and ')} for ${role.label}.`);
  }

  if (sections.projects) {
    strengths.push('Includes a projects section, which helps validate hands-on experience.');
  }

  if (sections.experience) {
    strengths.push('Has a clear experience section, which improves recruiter confidence and ATS parsing.');
  }

  if (impact.metricCount >= 1) {
    strengths.push('Contains measurable outcomes, which makes the resume feel more results-driven.');
  }

  if (experience.label !== 'Undetermined') {
    strengths.push(`Experience level reads as ${experience.label.toLowerCase()}, which helps position the profile more clearly.`);
  }

  return strengths.slice(0, 4);
}

function buildWeaknesses({ missingSkills, sections, impact, jobDescriptionInsights }) {
  const weaknesses = [];

  if (missingSkills.length) {
    weaknesses.push(`Missing or under-emphasizing key skills such as ${missingSkills.slice(0, 2).map((skill) => skill.name).join(' and ')}.`);
  }

  if (!sections.projects) {
    weaknesses.push('No dedicated projects section was detected, which weakens proof of execution.');
  }

  if (!sections.skills) {
    weaknesses.push('A clear skills section is missing, which can lower ATS readability.');
  }

  if (impact.metricCount < 2) {
    weaknesses.push('The resume needs more quantified achievements to feel competitive in real hiring flows.');
  }

  if (jobDescriptionInsights.enabled && jobDescriptionInsights.missingKeywords.length >= 2) {
    weaknesses.push(`The target role still expects stronger evidence around ${jobDescriptionInsights.missingKeywords
      .slice(0, 2)
      .map((skill) => skill.name)
      .join(' and ')}.`);
  }

  return weaknesses.slice(0, 4);
}

function scoreRole({
  role,
  normalizedText,
  sectionMap,
  sections,
  experience,
  impact,
  jobDescription,
  diagnostics,
}) {
  const tuning = ROLE_TUNING[role.id] ?? {
    minYears: 1,
    preferredSections: ['skills', 'projects', 'experience'],
  };
  const normalizedJobDescription = normalizeResumeText(jobDescription || '');
  const jobDescriptionUsed = Boolean(normalizedJobDescription.trim());

  let matchedWeight = 0;
  let totalWeightedDemand = 0;
  let matchedJdWeight = 0;
  let totalJdWeight = 0;

  const matchedSkills = [];
  const missingSkills = [];

  role.keywords.forEach((keyword) => {
    const resumeMatch = findBestSynonym(normalizedText, keyword.synonyms);
    const mentionCount = countKeywordMentions(normalizedText, keyword.synonyms);
    const evidenceSection = findEvidenceSection(sectionMap, keyword.synonyms);
    const demandedByJobDescription =
      jobDescriptionUsed && keyword.synonyms.some((synonym) => synonymMatched(normalizedJobDescription, synonym));
    const weightedDemand = keyword.weight * (demandedByJobDescription ? 1.28 : 1);

    totalWeightedDemand += weightedDemand;
    if (demandedByJobDescription) {
      totalJdWeight += keyword.weight;
    }

    if (resumeMatch) {
      const sectionBoost = evidenceSection ? 1.08 : 1;
      const repetitionBoost = mentionCount >= 3 ? 1.08 : mentionCount === 2 ? 1.04 : 1;
      const earnedWeight = Math.min(weightedDemand, keyword.weight * sectionBoost * repetitionBoost * (demandedByJobDescription ? 1.16 : 1));

      matchedWeight += earnedWeight;
      if (demandedByJobDescription) {
        matchedJdWeight += keyword.weight;
      }

      matchedSkills.push({
        name: keyword.name,
        weight: Math.round(earnedWeight * 10) / 10,
        match: resumeMatch,
        mentions: mentionCount,
        evidenceSection: evidenceSection ?? 'summary',
        priority: demandedByJobDescription ? 'Critical' : 'Matched',
      });
      return;
    }

    missingSkills.push({
      name: keyword.name,
      weight: Math.round(weightedDemand * 10) / 10,
      suggestion: keyword.suggestion,
      priority: demandedByJobDescription ? 'Critical' : 'Recommended',
    });
  });

  const sectionDetails = buildSectionDetails(sectionMap, sections, tuning);
  const skillsScore = Math.round((matchedWeight / Math.max(totalWeightedDemand, 1)) * 100);
  const experienceScore = calculateExperienceScore(experience, sections, role.id);
  const jobDescriptionScore = jobDescriptionUsed
    ? totalJdWeight
      ? Math.round((matchedJdWeight / totalJdWeight) * 100)
      : 68
    : null;
  const atsCompatibilityScore = calculateAtsCompatibility({
    sectionDetails,
    sections,
    diagnostics,
    impact,
    matchedSkills,
  });
  const jobRelevanceScore = calculateJobRelevanceScore({
    skillsScore,
    experienceScore,
    impactScore: impact.score,
    jobDescriptionScore: jobDescriptionScore ?? skillsScore,
    jobDescriptionUsed,
  });
  const score = calculateOverallScore({
    skillMatchScore: skillsScore,
    atsCompatibilityScore,
    jobRelevanceScore,
  });
  const fitLabel = getFitLabel(score);
  const atsPassProbability = calculateAtsPassProbability({
    atsCompatibilityScore,
    skillMatchScore: skillsScore,
    jobRelevanceScore,
  });
  const hiringReadiness = getHiringReadinessLevel({
    overallScore: score,
    atsPassProbability,
  });

  const jobDescriptionInsights = {
    enabled: jobDescriptionUsed,
    matchedKeywords: matchedSkills.filter((skill) => skill.priority === 'Critical'),
    missingKeywords: missingSkills.filter((skill) => skill.priority === 'Critical'),
    score: jobDescriptionScore,
    summary: jobDescriptionUsed
      ? totalJdWeight
        ? `${matchedSkills.filter((skill) => skill.priority === 'Critical').length} of ${Math.max(
            matchedSkills.filter((skill) => skill.priority === 'Critical').length +
              missingSkills.filter((skill) => skill.priority === 'Critical').length,
            1,
          )} tracked job requirements are clearly reflected in the resume.`
        : 'A job description was provided, but very few tracked role keywords were detected from it.'
      : 'Add a job description to make the analysis more targeted.',
  };

  const recommendations = buildRecommendations({
    missingSkills,
    sectionDetails,
    impact,
    jobDescriptionInsights,
    diagnostics,
    role,
  });

  const risks = buildRiskList({
    sections,
    diagnostics,
    impact,
    skillsScore,
    jobDescriptionInsights,
  });

  const roadmap = buildRoadmap({
    matchedSkills,
    missingSkills,
    impact,
    sections,
  });
  const strengths = buildStrengths({
    matchedSkills,
    sections,
    impact,
    experience,
    role,
  });
  const weaknesses = buildWeaknesses({
    missingSkills,
    sections,
    impact,
    jobDescriptionInsights,
  });

  return {
    role,
    score,
    fitLabel,
    summary: buildSummary(role, score, missingSkills[0]?.name, experience),
    overallScore: score,
    hiringReadiness,
    atsPassProbability,
    visibleScores: {
      skillMatch: skillsScore,
      atsCompatibility: atsCompatibilityScore,
      jobRelevance: jobRelevanceScore,
    },
    matchedSkills: matchedSkills.sort((first, second) => second.weight - first.weight),
    missingSkills: missingSkills.sort((first, second) => second.weight - first.weight),
    suggestions: recommendations,
    strengths,
    weaknesses,
    risks,
    roadmap,
    sections,
    sectionDetails,
    experience,
    impact,
    diagnostics,
    jobDescriptionInsights,
    subscores: {
      skills: skillsScore,
      sections: calculateSectionScore(sectionDetails),
      experience: experienceScore,
      impact: impact.score,
      jobDescription: jobDescriptionScore,
      atsCompatibility: atsCompatibilityScore,
      jobRelevance: jobRelevanceScore,
    },
    normalizedText,
  };
}

export function analyzeResumeForRole(rawText, roleId, jobDescription = '') {
  const role = getRoleById(roleId);
  const normalizedText = normalizeResumeText(rawText);
  const sections = detectSections(rawText);
  const sectionMap = extractSectionMap(rawText);
  const experience = detectExperienceLevel(rawText);
  const impact = analyzeImpactSignals(rawText, normalizedText, sections);
  const diagnostics = {
    wordCount: normalizedText ? normalizedText.split(/\s+/).filter(Boolean).length : 0,
    characterCount: rawText.length,
    sectionCount: Object.values(sections).filter(Boolean).length,
    keywordLibrarySize: role.keywords.length,
  };

  const roleAnalysis = scoreRole({
    role,
    normalizedText,
    sectionMap,
    sections,
    experience,
    impact,
    jobDescription,
    diagnostics,
  });

  const benchmarks = ROLES.map((candidateRole) => {
    const benchmarkResult = scoreRole({
      role: candidateRole,
      normalizedText,
      sectionMap,
      sections,
      experience,
      impact,
      jobDescription,
      diagnostics,
    });

    return {
      roleId: candidateRole.id,
      label: candidateRole.label,
      score: benchmarkResult.score,
      fitLabel: benchmarkResult.fitLabel,
    };
  }).sort((first, second) => second.score - first.score);

  return {
    ...roleAnalysis,
    role,
    benchmarks,
    benchmarkRank: benchmarks.findIndex((candidate) => candidate.roleId === role.id) + 1,
  };
}
