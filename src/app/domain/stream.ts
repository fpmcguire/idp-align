/** One independent CAV Level 1 view: the Document stream or the Workflow stream. */
export type StreamKind = 'document' | 'workflow';

export const STREAM_KINDS: readonly StreamKind[] = ['document', 'workflow'];
