import { WorkflowRuntimeObservation, WorkflowTaskObservation } from '../../domain/observation';
import { WorkflowAnalyticsProjections } from './docuware-replay.types';
import { WORKFLOW_ANALYTICS_SOURCE, mapWorkflowReplay } from './workflow-replay.mapper';

const INSTANCE = '00000000-0000-4000-8000-000000000001';
const task = { instanceId: INSTANCE, activityName: 'Approval', activityId: 'activity-02' };
const other = { instanceId: INSTANCE, activityName: 'Payment release', activityId: 'activity-03' };

const projections = (overrides: Partial<WorkflowAnalyticsProjections> = {}): WorkflowAnalyticsProjections => ({
  workflowName: 'Invoice approval (synthetic)',
  TaskExecutionTimes: [
    {
      ...task,
      assignedTime: '/Date(1788165000000)/',
      confirmedTime: '/Date(1788183000000)/',
      executionTime: '05:00:00.0000000',
    },
    {
      ...other,
      assignedTime: '/Date(1788183000000)/',
      confirmedTime: '/Date(1788183120000)/',
      executionTime: '00:02:00.0000000',
    },
  ],
  TaskReactionTimes: [
    {
      ...task,
      assignedTime: '/Date(1788165000000)/',
      pickedUpTime: '/Date(1788168000000)/',
      reactionTime: '00:50:00.0000000',
    },
  ],
  TaskDecisions: [{ ...task, decisionName: 'Approve', decisionTime: '/Date(1788183000000)/' }],
  TaskDecisionUsers: [
    { ...task, userName: 'Finance approver role (synthetic)', decisionTime: '/Date(1788183000000)/' },
  ],
  WorkflowErrorExits: [
    { ...other, errorExitName: 'Payment export error exit', time: '/Date(1788183120000)/' },
  ],
  WorkflowRuntimes: [
    {
      instanceId: INSTANCE,
      workflowVersion: 1,
      docId: 5001,
      runtime: '05:02:00.0000000',
      state: 'Failed',
      startTime: '/Date(1788165000000)/',
      timeOfCompletion: '/Date(1788183120000)/',
    },
  ],
  ...overrides,
});

const tasks = (data: ReturnType<typeof mapWorkflowReplay>) =>
  data.observations.filter((o): o is WorkflowTaskObservation => o.recordType === 'task');
const runtimes = (data: ReturnType<typeof mapWorkflowReplay>) =>
  data.observations.filter((o): o is WorkflowRuntimeObservation => o.recordType === 'runtime');

describe('mapWorkflowReplay', () => {
  it('should join task projections into one task observation', () => {
    const [approval] = tasks(mapWorkflowReplay(projections()));

    expect(approval).toMatchObject({
      streamKind: 'workflow',
      recordType: 'task',
      identitySliceId: 'workflow/invoice-approval-synthetic/approval',
      observedAt: '2026-08-31T13:30:00.000Z',
      instanceId: INSTANCE,
      step: 'Approval',
      taskDurationMs: 5 * 3_600_000,
      decision: 'Approve',
      decisionAgent: 'Finance approver role (synthetic)',
    });
    expect(approval.errorExit).toBeUndefined();
  });

  it('should read responseTimeMs from the TaskReactionTimes projection', () => {
    const [approval, paymentRelease] = tasks(mapWorkflowReplay(projections()));

    expect(approval.responseTimeMs).toBe(50 * 60_000);
    expect(approval.sources).toContainEqual({
      system: WORKFLOW_ANALYTICS_SOURCE,
      resource: 'TaskReactionTimes',
      recordId: `${INSTANCE}/activity-02`,
    });
    expect(paymentRelease.responseTimeMs).toBeUndefined();
  });

  it('should keep route context from WorkflowErrorExits', () => {
    const [, paymentRelease] = tasks(mapWorkflowReplay(projections()));

    expect(paymentRelease.errorExit).toBe('Payment export error exit');
    expect(paymentRelease.decision).toBeUndefined();
    expect(paymentRelease.sources.map(s => s.resource)).toEqual([
      'TaskExecutionTimes',
      'WorkflowErrorExits',
    ]);
  });

  it('should map WorkflowRuntimes rows to runtime observations on a runtime slice', () => {
    const [runtime] = runtimes(mapWorkflowReplay(projections()));

    expect(runtime).toMatchObject({
      recordType: 'runtime',
      identitySliceId: 'workflow/invoice-approval-synthetic/runtime',
      observedAt: '2026-08-31T13:32:00.000Z',
      runtimeMs: (5 * 60 + 2) * 60_000,
      state: 'failed',
    });
    expect(runtime.sources).toEqual([
      { system: WORKFLOW_ANALYTICS_SOURCE, resource: 'WorkflowRuntimes', recordId: INSTANCE },
    ]);
  });

  it('should return one slice per step plus the workflow runtime slice', () => {
    const { slices } = mapWorkflowReplay(projections());

    expect(slices.map(s => s.step)).toEqual(['Approval', 'Payment release', null]);
  });

  it('should skip rows with unreadable required values', () => {
    const base = projections();
    const data = mapWorkflowReplay(
      projections({
        TaskExecutionTimes: [{ ...base.TaskExecutionTimes[0], executionTime: 'unknown' }],
        WorkflowRuntimes: [{ ...base.WorkflowRuntimes[0], runtime: '' }],
      }),
    );

    expect(data.observations).toEqual([]);
    expect(data.slices).toEqual([]);
  });
});
