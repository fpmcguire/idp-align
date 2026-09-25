import {
  TaskDecisionUsersRow,
  TaskDecisionsRow,
  TaskExecutionTimesRow,
  TaskReactionTimesRow,
  WorkflowAnalyticsProjections,
  WorkflowErrorExitsRow,
  WorkflowRuntimesRow,
} from '../docuware-replay.types';
import { ReplayFixture } from '../replay-fixture';

// Synthetic workflow replay data. The workflow, steps, agents, IDs, and times are invented for
// IDP-Align; only the projection shapes follow the public DocuWare Workflow Analytics API
// documentation.

const WORKFLOW_NAME = 'Invoice approval (synthetic)';

interface StepDefinition {
  readonly activityId: string;
  readonly activityName: string;
  readonly decisionName: string;
  readonly decisionAgent: string;
}

const REVIEW: StepDefinition = {
  activityId: 'activity-01',
  activityName: 'Invoice review',
  decisionName: 'Forward',
  decisionAgent: 'Accounts payable clerk role (synthetic)',
};
const APPROVAL: StepDefinition = {
  activityId: 'activity-02',
  activityName: 'Approval',
  decisionName: 'Approve',
  decisionAgent: 'Finance approver role (synthetic)',
};
const PAYMENT_RELEASE: StepDefinition = {
  activityId: 'activity-03',
  activityName: 'Payment release',
  decisionName: 'Release',
  decisionAgent: 'Automated rule (synthetic)',
};

/** Minutes a task waited for pickup and minutes from assignment to confirmation. */
type TaskTiming = readonly [reactionMinutes: number, durationMinutes: number];

interface InstanceSeed {
  readonly start: string;
  readonly review: TaskTiming;
  readonly approval: TaskTiming;
  /** Automated step: duration in minutes, no pickup by a user. */
  readonly paymentReleaseMinutes: number;
  readonly paymentReleaseErrorExit?: string;
}

const seed = (
  start: string,
  review: TaskTiming,
  approval: TaskTiming,
  paymentReleaseMinutes = 3,
  paymentReleaseErrorExit?: string,
): InstanceSeed => ({
  start,
  review,
  approval,
  paymentReleaseMinutes,
  paymentReleaseErrorExit,
});

const SEEDS: readonly InstanceSeed[] = [
  seed('2026-08-03T08:30:00Z', [22, 41], [48, 262]),
  seed('2026-08-05T08:30:00Z', [18, 37], [55, 281]),
  seed('2026-08-07T08:30:00Z', [25, 44], [41, 247]),
  seed('2026-08-10T08:30:00Z', [20, 39], [62, 305]),
  seed('2026-08-12T08:30:00Z', [16, 35], [50, 270]),
  seed('2026-08-14T08:30:00Z', [27, 46], [44, 256]),
  seed('2026-08-17T08:30:00Z', [19, 38], [58, 292]),
  seed('2026-08-19T08:30:00Z', [23, 42], [47, 265]),
  seed('2026-08-21T08:30:00Z', [21, 40], [53, 278], 2, 'Payment export error exit'),
  seed('2026-08-24T08:30:00Z', [17, 36], [60, 298]),
  seed('2026-08-26T08:30:00Z', [24, 43], [45, 251]),
  seed('2026-08-28T08:30:00Z', [20, 39], [52, 274]),
  seed('2026-09-01T08:30:00Z', [22, 41], [49, 268]),
  seed('2026-09-03T08:30:00Z', [18, 37], [56, 287]),
  seed('2026-09-04T08:30:00Z', [21, 40], [95, 1310]),
  seed('2026-09-07T08:30:00Z', [19, 38], [110, 1425]),
  seed('2026-09-08T08:30:00Z', [23, 42], [102, 1368]),
  seed('2026-09-09T08:30:00Z', [20, 39], [118, 1492]),
  seed('2026-09-10T08:30:00Z', [22, 41], [97, 1336]),
  seed('2026-09-11T08:30:00Z', [18, 37], [105, 1401]),
];

const MINUTE_MS = 60_000;
const FIRST_DOC_ID = 5001;

const instanceId = (index: number) =>
  `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;

const docuWareDate = (ms: number) => `/Date(${ms})/`;

const pad = (value: number) => String(value).padStart(2, '0');

/** Formats milliseconds in the documented "[d.]hh:mm:ss.fffffff" duration form. */
function timeSpan(ms: number): string {
  const totalSeconds = Math.floor(ms / 1_000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.0000000`;
  return days > 0 ? `${days}.${clock}` : clock;
}

function buildProjections(): WorkflowAnalyticsProjections {
  const TaskExecutionTimes: TaskExecutionTimesRow[] = [];
  const TaskReactionTimes: TaskReactionTimesRow[] = [];
  const TaskDecisions: TaskDecisionsRow[] = [];
  const TaskDecisionUsers: TaskDecisionUsersRow[] = [];
  const WorkflowErrorExits: WorkflowErrorExitsRow[] = [];
  const WorkflowRuntimes: WorkflowRuntimesRow[] = [];

  SEEDS.forEach((instance, index) => {
    const id = instanceId(index);
    const startMs = Date.parse(instance.start);
    let assignedMs = startMs;

    const addTask = (
      step: StepDefinition,
      durationMinutes: number,
      reactionMinutes: number | null,
      errorExitName?: string,
    ) => {
      const confirmedMs = assignedMs + durationMinutes * MINUTE_MS;
      const task = { instanceId: id, activityId: step.activityId, activityName: step.activityName };
      TaskExecutionTimes.push({
        ...task,
        assignedTime: docuWareDate(assignedMs),
        confirmedTime: docuWareDate(confirmedMs),
        executionTime: timeSpan(confirmedMs - assignedMs),
      });
      if (reactionMinutes !== null) {
        const pickedUpMs = assignedMs + reactionMinutes * MINUTE_MS;
        TaskReactionTimes.push({
          ...task,
          assignedTime: docuWareDate(assignedMs),
          pickedUpTime: docuWareDate(pickedUpMs),
          reactionTime: timeSpan(pickedUpMs - assignedMs),
        });
      }
      if (errorExitName) {
        WorkflowErrorExits.push({ ...task, errorExitName, time: docuWareDate(confirmedMs) });
      } else {
        TaskDecisions.push({
          ...task,
          decisionName: step.decisionName,
          decisionTime: docuWareDate(confirmedMs),
        });
        TaskDecisionUsers.push({
          ...task,
          userName: step.decisionAgent,
          decisionTime: docuWareDate(confirmedMs),
        });
      }
      assignedMs = confirmedMs;
    };

    addTask(REVIEW, instance.review[1], instance.review[0]);
    addTask(APPROVAL, instance.approval[1], instance.approval[0]);
    addTask(
      PAYMENT_RELEASE,
      instance.paymentReleaseMinutes,
      null,
      instance.paymentReleaseErrorExit,
    );

    WorkflowRuntimes.push({
      instanceId: id,
      workflowVersion: 1,
      docId: FIRST_DOC_ID + index,
      runtime: timeSpan(assignedMs - startMs),
      state: instance.paymentReleaseErrorExit ? 'Failed' : 'Completed',
      startTime: docuWareDate(startMs),
      timeOfCompletion: docuWareDate(assignedMs),
    });
  });

  return {
    workflowName: WORKFLOW_NAME,
    TaskExecutionTimes,
    TaskReactionTimes,
    TaskDecisions,
    TaskDecisionUsers,
    WorkflowErrorExits,
    WorkflowRuntimes,
  };
}

export const WORKFLOW_REPLAY_FIXTURE: ReplayFixture<WorkflowAnalyticsProjections> = {
  metadata: {
    fixtureId: 'workflow-replay-v1',
    streamKind: 'workflow',
    description: 'Synthetic runs of a three-step invoice approval workflow.',
    synthetic: true,
    shapedFrom: [
      {
        title: 'DocuWare Workflow Analytics API',
        url: 'https://knowledgecenter.docuware.com/docs/workflow-analytics-api',
      },
    ],
    notes: [
      'Projection names match the documented projection types.',
      'WorkflowRuntimes rows use the documented fields and value formats.',
      'Task-level projections have no published example payload; their field names are approximations.',
      'responseTimeMs is read from the TaskReactionTimes projection (assignment until pickup).',
      'decisionAgent is read from the TaskDecisionUsers projection and holds synthetic role labels, not people.',
    ],
  },
  records: buildProjections(),
};
