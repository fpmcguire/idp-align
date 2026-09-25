import { StreamKind } from './stream';

/** Document stream Identity Slice: one vendor and document type. */
export interface DocumentIdentitySlice {
  readonly id: string;
  readonly streamKind: 'document';
  readonly label: string;
  readonly vendor: string;
  readonly documentType: string;
}

/**
 * Workflow stream Identity Slice: one workflow step, or the whole workflow instance when `step`
 * is null (used for workflow runtime observations).
 */
export interface WorkflowIdentitySlice {
  readonly id: string;
  readonly streamKind: 'workflow';
  readonly label: string;
  readonly workflowName: string;
  readonly step: string | null;
}

export type IdentitySlice = DocumentIdentitySlice | WorkflowIdentitySlice;

export type IdentitySliceFor<K extends StreamKind> = Extract<IdentitySlice, { streamKind: K }>;

const WORKFLOW_RUNTIME_LABEL = 'Workflow runtime';

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function documentIdentitySlice(vendor: string, documentType: string): DocumentIdentitySlice {
  return {
    id: `document/${slug(vendor)}/${slug(documentType)}`,
    streamKind: 'document',
    label: `${vendor} · ${documentType}`,
    vendor,
    documentType,
  };
}

export function workflowIdentitySlice(
  workflowName: string,
  step: string | null,
): WorkflowIdentitySlice {
  return {
    id: `workflow/${slug(workflowName)}/${step === null ? 'runtime' : slug(step)}`,
    streamKind: 'workflow',
    label: `${workflowName} · ${step ?? WORKFLOW_RUNTIME_LABEL}`,
    workflowName,
    step,
  };
}
