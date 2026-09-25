import { workflowIdentitySlice } from '../../domain/identity-slice';
import {
  WorkflowInstanceState,
  WorkflowRuntimeObservation,
  WorkflowTaskObservation,
} from '../../domain/observation';
import { SourceReference } from '../../domain/source-reference';
import {
  TaskExecutionTimesRow,
  WorkflowAnalyticsProjections,
  WorkflowRuntimesRow,
} from './docuware-replay.types';
import { parseDocuWareDate, parseTimeSpan } from './docuware-value.parsers';
import { StreamReplayData, uniqueSlices } from './replay-fixture';

export const WORKFLOW_ANALYTICS_SOURCE = 'docuware-workflow-analytics-api';

interface TaskKey {
  readonly instanceId: string;
  readonly activityId: string;
}

const taskKey = (row: TaskKey) => `${row.instanceId}/${row.activityId}`;

const indexByTask = <T extends TaskKey>(rows: readonly T[]) =>
  new Map(rows.map(row => [taskKey(row), row]));

const source = (resource: string, recordId: string): SourceReference => ({
  system: WORKFLOW_ANALYTICS_SOURCE,
  resource,
  recordId,
});

const RUNTIME_STATES: Record<WorkflowRuntimesRow['state'], WorkflowInstanceState> = {
  Completed: 'completed',
  Running: 'running',
  Failed: 'failed',
  Stopped: 'stopped',
};

/**
 * Maps workflow analytics projections to observations: one task observation per TaskExecutionTimes
 * row, joined with the matching TaskReactionTimes, TaskDecisions, TaskDecisionUsers, and
 * WorkflowErrorExits rows, plus one runtime observation per WorkflowRuntimes row. Rows with
 * missing or unreadable required values are skipped.
 */
export function mapWorkflowReplay(
  projections: WorkflowAnalyticsProjections,
): StreamReplayData<'workflow'> {
  const { workflowName } = projections;
  const reactions = indexByTask(projections.TaskReactionTimes);
  const decisions = indexByTask(projections.TaskDecisions);
  const decisionUsers = indexByTask(projections.TaskDecisionUsers);
  const errorExits = indexByTask(projections.WorkflowErrorExits);

  const mapTask = (row: TaskExecutionTimesRow): WorkflowTaskObservation | null => {
    const observedAt = parseDocuWareDate(row.confirmedTime);
    const taskDurationMs = parseTimeSpan(row.executionTime);
    if (observedAt === null || taskDurationMs === null) return null;

    const key = taskKey(row);
    const reaction = reactions.get(key);
    const responseTimeMs = parseTimeSpan(reaction?.reactionTime);
    const decision = decisions.get(key);
    const decisionUser = decisionUsers.get(key);
    const errorExit = errorExits.get(key);

    return {
      id: `workflow/task/${key}`,
      streamKind: 'workflow',
      recordType: 'task',
      identitySliceId: workflowIdentitySlice(workflowName, row.activityName).id,
      observedAt,
      sources: [
        source('TaskExecutionTimes', key),
        ...(reaction ? [source('TaskReactionTimes', key)] : []),
        ...(decision ? [source('TaskDecisions', key)] : []),
        ...(decisionUser ? [source('TaskDecisionUsers', key)] : []),
        ...(errorExit ? [source('WorkflowErrorExits', key)] : []),
      ],
      workflowName,
      instanceId: row.instanceId,
      step: row.activityName,
      taskDurationMs,
      ...(responseTimeMs !== null && { responseTimeMs }),
      ...(decision && { decision: decision.decisionName }),
      ...(decisionUser && { decisionAgent: decisionUser.userName }),
      ...(errorExit && { errorExit: errorExit.errorExitName }),
    };
  };

  const mapRuntime = (row: WorkflowRuntimesRow): WorkflowRuntimeObservation | null => {
    const observedAt = parseDocuWareDate(row.timeOfCompletion) ?? parseDocuWareDate(row.startTime);
    const runtimeMs = parseTimeSpan(row.runtime);
    const state = RUNTIME_STATES[row.state];
    if (observedAt === null || runtimeMs === null || state === undefined) return null;

    return {
      id: `workflow/runtime/${row.instanceId}`,
      streamKind: 'workflow',
      recordType: 'runtime',
      identitySliceId: workflowIdentitySlice(workflowName, null).id,
      observedAt,
      sources: [source('WorkflowRuntimes', row.instanceId)],
      workflowName,
      instanceId: row.instanceId,
      runtimeMs,
      state,
    };
  };

  const observations = [
    ...projections.TaskExecutionTimes.flatMap(row => mapTask(row) ?? []),
    ...projections.WorkflowRuntimes.flatMap(row => mapRuntime(row) ?? []),
  ];

  return {
    slices: uniqueSlices(
      observations.map(o =>
        workflowIdentitySlice(workflowName, o.recordType === 'task' ? o.step : null),
      ),
    ),
    observations,
  };
}
