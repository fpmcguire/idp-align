import { documentIdentitySlice } from '../../domain/identity-slice';
import { DocumentObservation } from '../../domain/observation';
import { DocuWareDocumentRecord } from './docuware-replay.types';
import { parseDocuWareDate } from './docuware-value.parsers';
import { StreamReplayData, uniqueSlices } from './replay-fixture';

export const PLATFORM_API_SOURCE = 'docuware-platform-rest-api';

const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value : null);

const decimal = (value: unknown) => {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
};

/** Maps one document record to an observation, or null when a required index field is missing. */
export function mapDocumentRecord(record: DocuWareDocumentRecord): DocumentObservation | null {
  const item = (fieldName: string) => record.Fields.find(f => f.FieldName === fieldName)?.Item;

  const vendor = text(item('COMPANY'));
  const documentType = text(item('DOCUMENT_TYPE'));
  const amount = decimal(item('AMOUNT'));
  const currency = text(item('CURRENCY'));
  const documentDate = parseDocuWareDate(item('DOCUMENT_DATE'))?.slice(0, 10) ?? null;
  const observedAt = parseDocuWareDate(item('DWSTOREDATETIME'));

  if (
    vendor === null ||
    documentType === null ||
    amount === null ||
    currency === null ||
    documentDate === null ||
    observedAt === null
  ) {
    return null;
  }

  return {
    id: `document/${record.Id}`,
    streamKind: 'document',
    identitySliceId: documentIdentitySlice(vendor, documentType).id,
    observedAt,
    sources: [{ system: PLATFORM_API_SOURCE, resource: 'Document', recordId: String(record.Id) }],
    vendor,
    documentType,
    amount: { value: amount, currency },
    documentDate,
  };
}

export function mapDocumentReplay(
  records: readonly DocuWareDocumentRecord[],
): StreamReplayData<'document'> {
  const observations = records.flatMap(record => mapDocumentRecord(record) ?? []);
  return {
    slices: uniqueSlices(observations.map(o => documentIdentitySlice(o.vendor, o.documentType))),
    observations,
  };
}
