import { DocuWareDocumentRecord, DocuWareIndexField } from './docuware-replay.types';
import { PLATFORM_API_SOURCE, mapDocumentRecord, mapDocumentReplay } from './document-replay.mapper';

const STORED = '/Date(1788188400000)/'; // 2026-08-31T15:00:00Z
const DOCUMENT_DATE = '/Date(1788220800000)/'; // 2026-09-01T00:00:00Z

const fields = (overrides: Partial<Record<string, DocuWareIndexField['Item']>> = {}) => {
  const values: Record<string, DocuWareIndexField['Item']> = {
    COMPANY: 'Alpha (synthetic)',
    DOCUMENT_TYPE: 'Invoice',
    AMOUNT: 1215.4,
    CURRENCY: 'EUR',
    DOCUMENT_DATE,
    DWSTOREDATETIME: STORED,
    ...overrides,
  };
  return Object.entries(values).map(
    ([FieldName, Item]): DocuWareIndexField => ({ FieldName, Item, ItemElementName: 'String' }),
  );
};

const record = (Id: number, overrides?: Parameters<typeof fields>[0]): DocuWareDocumentRecord => ({
  Id,
  Fields: fields(overrides),
});

describe('mapDocumentRecord', () => {
  it('should map index fields to a document observation', () => {
    expect(mapDocumentRecord(record(1001))).toEqual({
      id: 'document/1001',
      streamKind: 'document',
      identitySliceId: 'document/alpha-synthetic/invoice',
      observedAt: '2026-08-31T15:00:00.000Z',
      sources: [{ system: PLATFORM_API_SOURCE, resource: 'Document', recordId: '1001' }],
      vendor: 'Alpha (synthetic)',
      documentType: 'Invoice',
      amount: { value: 1215.4, currency: 'EUR' },
      documentDate: '2026-09-01',
    });
  });

  it('should read a decimal amount given as a string', () => {
    expect(mapDocumentRecord(record(1002, { AMOUNT: '99.50' }))?.amount.value).toBe(99.5);
  });

  for (const field of ['COMPANY', 'DOCUMENT_TYPE', 'AMOUNT', 'CURRENCY', 'DOCUMENT_DATE', 'DWSTOREDATETIME']) {
    it(`should skip a record whose ${field} field is empty`, () => {
      expect(mapDocumentRecord(record(1003, { [field]: null }))).toBeNull();
    });
  }
});

describe('mapDocumentReplay', () => {
  it('should return one slice per vendor and document type', () => {
    const { slices, observations } = mapDocumentReplay([
      record(1),
      record(2),
      record(3, { DOCUMENT_TYPE: 'Credit note' }),
      record(4, { COMPANY: null }),
    ]);

    expect(observations.length).toBe(3);
    expect(slices.map(s => s.id)).toEqual([
      'document/alpha-synthetic/invoice',
      'document/alpha-synthetic/credit-note',
    ]);
  });
});
