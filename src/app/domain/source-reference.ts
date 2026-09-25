/**
 * Points an observation back to the source record it was built from, so observed behavior stays
 * traceable. `system` names the source interface, `resource` the record type within it (for
 * example a document or a workflow analytics projection), and `recordId` the record key.
 */
export interface SourceReference {
  readonly system: string;
  readonly resource: string;
  readonly recordId: string;
}
