import {
  CLAIM_GUARDRAIL_PATTERNS,
  FIXTURE_SECRET_PATTERNS,
  PUBLIC_DOCUMENTATION_URL,
} from '../../../../testing/claim-guardrail-patterns';
import { parseTimeSpan } from '../docuware-value.parsers';
import { DOCUMENT_REPLAY_FIXTURE } from './document-replay.fixture';
import { WORKFLOW_REPLAY_FIXTURE } from './workflow-replay.fixture';

// Fixture guardrails cover safety and CAV finding terminology only. Source-shaped values such as
// the documented workflow state "Failed" are ordinary replay data, not IDP-Align claims (A-018).

const FIXTURES = [DOCUMENT_REPLAY_FIXTURE, WORKFLOW_REPLAY_FIXTURE];
const SYNTHETIC_INSTANCE_ID = /^00000000-0000-4000-8000-\d{12}$/;
const DAY_MS = 86_400_000;
/** Customers named in mod-w/docs/research-references.md; research motivation only, never replay data. */
const CASE_STUDY_CUSTOMER_NAMES = /giebeler|feuerschutz|piening|sport ?auto/i;

describe('replay fixtures', () => {
  for (const fixture of FIXTURES) {
    describe(fixture.metadata.fixtureId, () => {
      const serialized = JSON.stringify(fixture);

      it('should be marked synthetic and cite public DocuWare documentation', () => {
        expect(fixture.metadata.synthetic).toBe(true);
        expect(fixture.metadata.shapedFrom.length).toBeGreaterThan(0);
        for (const reference of fixture.metadata.shapedFrom) {
          expect(reference.url).toMatch(PUBLIC_DOCUMENTATION_URL);
        }
      });

      for (const [name, pattern] of Object.entries(FIXTURE_SECRET_PATTERNS)) {
        it(`should not contain ${name} strings`, () => {
          expect(serialized).not.toMatch(pattern);
        });
      }

      it('should contain no URLs other than public DocuWare documentation', () => {
        const urls = serialized.match(/https?:\/\/[^\s"]+/g) ?? [];
        expect(urls.length).toBeGreaterThan(0);
        for (const url of urls) {
          expect(url).toMatch(PUBLIC_DOCUMENTATION_URL);
        }
      });

      it('should not use reserved CAV terms or non-canonical finding names', () => {
        expect(serialized).not.toMatch(CLAIM_GUARDRAIL_PATTERNS.reservedTerms);
        expect(serialized).not.toMatch(CLAIM_GUARDRAIL_PATTERNS.nonCanonicalFindingNames);
      });

      it('should not name any customer from the research case studies', () => {
        expect(serialized).not.toMatch(CASE_STUDY_CUSTOMER_NAMES);
      });

      it('should not label any replay data as a Divergence, Observed Baseline, or expected output', () => {
        expect(serialized).not.toMatch(/divergen|baseline|expected/i);
      });
    });
  }

  describe('document fixture', () => {
    const { records } = DOCUMENT_REPLAY_FIXTURE;
    const item = (fieldName: string) =>
      records.map(r => r.Fields.find(f => f.FieldName === fieldName)?.Item);

    it('should use synthetic document IDs and vendor names', () => {
      for (const record of records) {
        expect(record.Id).toBeGreaterThanOrEqual(1001);
        expect(record.Id).toBeLessThan(2000);
      }
      for (const vendor of item('COMPANY')) {
        expect(vendor).toMatch(/\(synthetic\)$/);
      }
    });

    // STEP-09: Supplier Invoice Population Divergence stays synthetic (A-070, A-072).
    it('should hold 58 records with five fictional invoice suppliers, IDs 1001 to 1058 in order', () => {
      expect(records.map(r => r.Id)).toEqual(records.map((_, i) => 1001 + i));
      expect(records.length).toBe(58);

      const invoiceSuppliers = new Set(
        records
          .filter(r => r.Fields.find(f => f.FieldName === 'DOCUMENT_TYPE')?.Item === 'Invoice')
          .map(r => r.Fields.find(f => f.FieldName === 'COMPANY')?.Item),
      );
      expect([...invoiceSuppliers].sort()).toEqual([
        'Alpha Office Supplies (synthetic)',
        'Beta Freight Services (synthetic)',
        'Delta Packaging Supplies (synthetic)',
        'Epsilon Print Services (synthetic)',
        'Gamma Facilities Care (synthetic)',
      ]);
    });

    it('should append the STEP-09 peer suppliers after the accepted records', () => {
      const vendorOf = (r: (typeof records)[number]) => r.Fields.find(f => f.FieldName === 'COMPANY')?.Item;
      const peers = /^(Delta|Epsilon) /;

      expect(records.slice(0, 38).some(r => peers.test(String(vendorOf(r))))).toBe(false);
      expect(records.slice(38).every(r => peers.test(String(vendorOf(r))))).toBe(true);
    });

    it('should use the documented FieldName and Item pair on every index field', () => {
      for (const record of records) {
        for (const field of record.Fields) {
          expect(typeof field.FieldName).toBe('string');
          expect(field).toHaveProperty('Item');
        }
        const fieldNames = record.Fields.map(f => f.FieldName);
        expect(fieldNames).toContain('COMPANY');
        expect(fieldNames).toContain('DOCUMENT_DATE');
      }
    });

    it('should add only the approximated ItemElementName to the documented pair', () => {
      for (const field of records.flatMap(r => r.Fields)) {
        expect(Object.keys(field).sort()).toEqual(['FieldName', 'Item', 'ItemElementName']);
      }
    });

    it('should record approximated typing, date encoding, and DWSTOREDATETIME in metadata', () => {
      const { notes } = DOCUMENT_REPLAY_FIXTURE.metadata;
      const approximations = notes.filter(note => note.startsWith('Approximation:')).join(' ');
      for (const term of ['ItemElementName', 'Decimal', '/Date(ms)/', 'DWSTOREDATETIME']) {
        expect(approximations).toContain(term);
      }
      for (const note of notes.filter(n => /documented/i.test(n))) {
        expect(note).not.toMatch(/ItemElementName|Decimal|\/Date\(|DWSTOREDATETIME/);
      }
    });
  });

  describe('workflow fixture', () => {
    const { records } = WORKFLOW_REPLAY_FIXTURE;

    it('should use a synthetic workflow name, instance IDs, and decision agents', () => {
      expect(records.workflowName).toMatch(/\(synthetic\)$/);
      for (const row of records.WorkflowRuntimes) {
        expect(row.instanceId).toMatch(SYNTHETIC_INSTANCE_ID);
      }
      for (const row of records.TaskDecisionUsers) {
        expect(row.userName).toMatch(/role \(synthetic\)$|^Automated rule \(synthetic\)$/);
      }
    });

    it('should use the documented WorkflowRuntimes fields', () => {
      for (const row of records.WorkflowRuntimes) {
        expect(Object.keys(row).sort()).toEqual(
          ['docId', 'instanceId', 'runtime', 'startTime', 'state', 'timeOfCompletion', 'workflowVersion'].sort(),
        );
      }
    });

    it('should use the documented duration form below 24 hours and a day prefix only above it', () => {
      const durations = [
        ...records.WorkflowRuntimes.map(r => r.runtime),
        ...records.TaskExecutionTimes.map(r => r.executionTime),
        ...records.TaskReactionTimes.map(r => r.reactionTime),
      ];
      for (const duration of durations) {
        expect(duration).toMatch(/^(\d+\.)?\d{2}:\d{2}:\d{2}\.\d{7}$/);
        expect(/^\d+\./.test(duration)).toBe((parseTimeSpan(duration) ?? 0) >= DAY_MS);
      }
    });

    it('should record the duration day prefix as an approximation in metadata', () => {
      const { notes } = WORKFLOW_REPLAY_FIXTURE.metadata;
      expect(notes.filter(note => note.startsWith('Approximation:')).join(' ')).toMatch(/d\. day prefix/);
      for (const note of notes.filter(n => /documented/i.test(n))) {
        expect(note).not.toMatch(/d\. day prefix|value formats/);
      }
    });

    it('should note that responseTimeMs comes from the TaskReactionTimes projection', () => {
      expect(WORKFLOW_REPLAY_FIXTURE.metadata.notes.join(' ')).toMatch(
        /responseTimeMs is read from the TaskReactionTimes projection/,
      );
    });
  });
});
