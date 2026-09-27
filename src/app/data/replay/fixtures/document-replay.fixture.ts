import { DocuWareDocumentRecord } from '../docuware-replay.types';
import { ReplayFixture } from '../replay-fixture';

// Synthetic document replay data. Vendors, IDs, amounts, and dates are invented for IDP-Align.
// The FieldName / Item pair follows the public DocuWare Platform REST API documentation; the
// value typing, date encoding, and storage-time field are approximations recorded in metadata.

const ALPHA = 'Alpha Office Supplies (synthetic)';
const BETA = 'Beta Freight Services (synthetic)';
const GAMMA = 'Gamma Facilities Care (synthetic)';
const DELTA = 'Delta Packaging Supplies (synthetic)';
const EPSILON = 'Epsilon Print Services (synthetic)';
const INVOICE = 'Invoice';
const CREDIT_NOTE = 'Credit note';

type DocumentSeed = readonly [
  vendor: string,
  documentType: string,
  amount: number,
  currency: string,
  documentDate: string,
];

const SEEDS: readonly DocumentSeed[] = [
  [ALPHA, INVOICE, 1215.4, 'EUR', '2026-08-03'],
  [BETA, INVOICE, 4380.0, 'USD', '2026-08-04'],
  [GAMMA, INVOICE, 796.5, 'EUR', '2026-08-05'],
  [ALPHA, INVOICE, 1188.9, 'EUR', '2026-08-06'],
  [BETA, CREDIT_NOTE, 212.0, 'USD', '2026-08-06'],
  [ALPHA, CREDIT_NOTE, 84.2, 'EUR', '2026-08-07'],
  [ALPHA, INVOICE, 1242.0, 'EUR', '2026-08-10'],
  [GAMMA, CREDIT_NOTE, 56.0, 'EUR', '2026-08-10'],
  [BETA, INVOICE, 4512.75, 'USD', '2026-08-11'],
  [GAMMA, INVOICE, 812.0, 'EUR', '2026-08-12'],
  [ALPHA, INVOICE, 1201.3, 'EUR', '2026-08-13'],
  [BETA, INVOICE, 4295.5, 'USD', '2026-08-14'],
  [ALPHA, INVOICE, 1230.8, 'EUR', '2026-08-17'],
  [BETA, INVOICE, 4440.0, 'USD', '2026-08-18'],
  [GAMMA, INVOICE, 788.25, 'EUR', '2026-08-19'],
  [ALPHA, INVOICE, 1196.0, 'EUR', '2026-08-20'],
  [BETA, CREDIT_NOTE, 185.4, 'USD', '2026-08-20'],
  [ALPHA, CREDIT_NOTE, 97.6, 'EUR', '2026-08-21'],
  [ALPHA, INVOICE, 1255.1, 'EUR', '2026-08-24'],
  [GAMMA, CREDIT_NOTE, 71.9, 'EUR', '2026-08-24'],
  [BETA, INVOICE, 4608.2, 'USD', '2026-08-25'],
  [GAMMA, INVOICE, 804.6, 'EUR', '2026-08-26'],
  [ALPHA, INVOICE, 1219.7, 'EUR', '2026-08-27'],
  [ALPHA, INVOICE, 1872.4, 'EUR', '2026-08-31'],
  [BETA, INVOICE, 4351.9, 'USD', '2026-09-01'],
  [GAMMA, INVOICE, 819.4, 'EUR', '2026-09-02'],
  [ALPHA, INVOICE, 1905.0, 'EUR', '2026-09-03'],
  [BETA, CREDIT_NOTE, 264.8, 'USD', '2026-09-03'],
  [ALPHA, CREDIT_NOTE, 76.3, 'EUR', '2026-09-04'],
  [ALPHA, INVOICE, 1846.2, 'EUR', '2026-09-07'],
  [GAMMA, CREDIT_NOTE, 48.5, 'EUR', '2026-09-07'],
  [BETA, INVOICE, 4477.3, 'USD', '2026-09-08'],
  [GAMMA, INVOICE, 801.1, 'EUR', '2026-09-09'],
  [GAMMA, CREDIT_NOTE, 88.0, 'EUR', '2026-09-09'],
  [ALPHA, INVOICE, 1889.6, 'EUR', '2026-09-10'],
  [BETA, CREDIT_NOTE, 158.1, 'USD', '2026-09-10'],
  [ALPHA, CREDIT_NOTE, 112.4, 'EUR', '2026-09-11'],
  [BETA, INVOICE, 4529.0, 'USD', '2026-09-11'],
  // Two more supplier invoice populations, appended so earlier record IDs keep their values.
  // Together with Alpha, Beta, and Gamma they give five Supplier x Invoice Identity Slices.
  [DELTA, INVOICE, 2140.0, 'EUR', '2026-08-04'],
  [DELTA, INVOICE, 2215.5, 'EUR', '2026-08-11'],
  [DELTA, INVOICE, 2180.3, 'EUR', '2026-08-14'],
  [DELTA, INVOICE, 2105.8, 'EUR', '2026-08-18'],
  [DELTA, INVOICE, 2236.0, 'EUR', '2026-08-25'],
  [DELTA, INVOICE, 2162.4, 'EUR', '2026-08-28'],
  [DELTA, INVOICE, 2194.7, 'EUR', '2026-09-01'],
  [DELTA, INVOICE, 2128.9, 'EUR', '2026-09-04'],
  [DELTA, INVOICE, 2221.2, 'EUR', '2026-09-08'],
  [DELTA, INVOICE, 2157.6, 'EUR', '2026-09-11'],
  [EPSILON, INVOICE, 548.2, 'EUR', '2026-08-06'],
  [EPSILON, INVOICE, 531.9, 'EUR', '2026-08-10'],
  [EPSILON, INVOICE, 556.4, 'EUR', '2026-08-13'],
  [EPSILON, INVOICE, 540.0, 'EUR', '2026-08-20'],
  [EPSILON, INVOICE, 527.5, 'EUR', '2026-08-24'],
  [EPSILON, INVOICE, 552.8, 'EUR', '2026-08-27'],
  [EPSILON, INVOICE, 544.1, 'EUR', '2026-08-31'],
  [EPSILON, INVOICE, 536.7, 'EUR', '2026-09-03'],
  [EPSILON, INVOICE, 549.9, 'EUR', '2026-09-07'],
  [EPSILON, INVOICE, 533.2, 'EUR', '2026-09-10'],
];

const FIRST_DOCUMENT_ID = 1001;

const docuWareDate = (iso: string) => `/Date(${Date.parse(iso)})/`;

function toDocumentRecord(seed: DocumentSeed, index: number): DocuWareDocumentRecord {
  const [vendor, documentType, amount, currency, documentDate] = seed;
  return {
    Id: FIRST_DOCUMENT_ID + index,
    Fields: [
      { FieldName: 'COMPANY', Item: vendor, ItemElementName: 'String' },
      { FieldName: 'DOCUMENT_TYPE', Item: documentType, ItemElementName: 'String' },
      { FieldName: 'AMOUNT', Item: amount, ItemElementName: 'Decimal' },
      { FieldName: 'CURRENCY', Item: currency, ItemElementName: 'String' },
      { FieldName: 'DOCUMENT_DATE', Item: docuWareDate(`${documentDate}T00:00:00Z`), ItemElementName: 'Date' },
      {
        FieldName: 'DWSTOREDATETIME',
        Item: docuWareDate(`${documentDate}T15:00:00Z`),
        ItemElementName: 'DateTime',
      },
    ],
  };
}

export const DOCUMENT_REPLAY_FIXTURE: ReplayFixture<readonly DocuWareDocumentRecord[]> = {
  metadata: {
    fixtureId: 'document-replay-v1',
    streamKind: 'document',
    description: 'Synthetic invoice and credit note index-field records for five synthetic suppliers.',
    synthetic: true,
    shapedFrom: [
      {
        title: 'DocuWare Platform REST API',
        url: 'https://knowledgecenter.docuware.com/docs/default-web-service-docuware-platform-api',
      },
    ],
    notes: [
      'The cited page documents index fields as a FieldName with a single Item value.',
      'COMPANY and DOCUMENT_DATE follow the documented sample field names; DOCUMENT_TYPE, AMOUNT, and CURRENCY are synthetic.',
      'Approximation: ItemElementName typing (String, Decimal, Date, DateTime) is a source-shape assumption not shown on the cited page.',
      'Approximation: date values use the /Date(ms)/ encoding; the cited DOCUMENT_DATE sample is an ISO date string.',
      'Approximation: DWSTOREDATETIME is an assumed storage-time field not shown on the cited page; it becomes the observation time.',
    ],
  },
  records: SEEDS.map(toDocumentRecord),
};
