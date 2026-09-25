// Test-only guardrail patterns. Constants only: specs import this file, production code must not.

/** Overclaim patterns for rendered claim copy; the same set the About view spec checks. */
export const CLAIM_GUARDRAIL_PATTERNS = {
  endorsement: /endors|sponsor|partner|affiliat|official|on behalf of|(approved|reviewed|requested) by DocuWare/i,
  privateAccess: /private|internal DocuWare|customer data|confidential|proprietary|insider/i,
  productionReadiness: /production[- ]?(ready|grade)|ready for production|in production|enterprise[- ]grade/i,
  defectOrGap: /\bdefect|\bflaw|shortcoming|product gap|fills? (a|the) gap|fix(es)? DocuWare/i,
  higherCavLevels: /Levels? [2-6]\b|Levels? 2[–-]6/i,
  attribution: /Attribution|root[- ]cause/i,
  certification: /certif|benchmark/i,
  businessJudgment: /bad data|failure|defect|non[- ]conform|violation of business intent/i,
  reservedTerms: /Declared Intention|Alignment Delta|Envelope|Breach|Drift Velocity|Convergence/i,
  nonCanonicalFindingNames: /\balert|\banomal/i,
} as const;

/**
 * Severity or risk wording the dashboard must avoid: filters and sorting narrow and order findings
 * by lifecycle status, not importance. Kept out of CLAIM_GUARDRAIL_PATTERNS so the About spec, which
 * iterates that set, is unchanged.
 */
export const SEVERITY_RISK_PATTERN = /severit|\brisk|critical|\burgen|priorit|\bhigh[- ]impact/i;

/** Words the replay source copy must avoid so it cannot read as a finding (A-018). */
export const REPLAY_SOURCE_AVOID_WORDS =
  /\b(detected|flagged|changed|issues?|anomal\w*|alerts?|violations?|bad|defects?|gaps?|affected|severity|rank\w*)\b/i;

/** Credential-like and live-access strings that must never appear in replay fixtures. */
export const FIXTURE_SECRET_PATTERNS = {
  credentials: /bearer|access[_-]?token|refresh[_-]?token|client[_-]?secret|password|passwd|api[_-]?key|authorization|secret/i,
  emailAddress: /[\w.+-]+@[\w-]+\.[\w.-]+/,
  liveHost: /docuware\.cloud|localhost|\b\d{1,3}(\.\d{1,3}){3}\b/i,
} as const;

/** The only URLs replay fixtures may contain: public DocuWare documentation. */
export const PUBLIC_DOCUMENTATION_URL = /^https:\/\/knowledgecenter\.docuware\.com\/docs\//;
