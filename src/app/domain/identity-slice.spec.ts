import { documentIdentitySlice, workflowIdentitySlice } from './identity-slice';

describe('Identity Slice', () => {
  it('should build a document stream slice from vendor and document type', () => {
    const slice = documentIdentitySlice('Alpha Office Supplies (synthetic)', 'Credit note');

    expect(slice).toEqual({
      id: 'document/alpha-office-supplies-synthetic/credit-note',
      streamKind: 'document',
      label: 'Alpha Office Supplies (synthetic) · Credit note',
      vendor: 'Alpha Office Supplies (synthetic)',
      documentType: 'Credit note',
    });
  });

  it('should build a workflow stream slice for a step', () => {
    const slice = workflowIdentitySlice('Invoice approval (synthetic)', 'Payment release');

    expect(slice.id).toBe('workflow/invoice-approval-synthetic/payment-release');
    expect(slice.streamKind).toBe('workflow');
    expect(slice.step).toBe('Payment release');
    expect(slice.label).toBe('Invoice approval (synthetic) · Payment release');
  });

  it('should build a workflow runtime slice when there is no step', () => {
    const slice = workflowIdentitySlice('Invoice approval (synthetic)', null);

    expect(slice.id).toBe('workflow/invoice-approval-synthetic/runtime');
    expect(slice.step).toBeNull();
    expect(slice.label).toBe('Invoice approval (synthetic) · Workflow runtime');
  });

  it('should give the same slice the same id every time', () => {
    expect(documentIdentitySlice('V', 'Invoice').id).toBe(documentIdentitySlice('V', 'Invoice').id);
    expect(documentIdentitySlice('V', 'Invoice').id).not.toBe(documentIdentitySlice('W', 'Invoice').id);
  });
});
