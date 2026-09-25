// Record shapes for replay fixtures, following the public DocuWare documentation cited in each
// fixture's metadata. These describe replay input only; the rest of the app uses domain types.

/**
 * Platform REST API index field. `FieldName` and the single `Item` value follow the cited page;
 * `ItemElementName` typing is a replay approximation that the cited page does not show.
 */
export interface DocuWareIndexField {
  readonly FieldName: string;
  readonly Item: string | number | null;
  readonly ItemElementName: 'String' | 'Decimal' | 'Int' | 'Date' | 'DateTime';
}

export interface DocuWareDocumentRecord {
  readonly Id: number;
  readonly Fields: readonly DocuWareIndexField[];
}

// Workflow Analytics API projections. Dates use the documented "/Date(ms)/" form and durations
// the documented "hh:mm:ss.fffffff" form. Durations of 24 hours or more add a "d." day prefix,
// an approximation (TimeSpan-style) that the cited page does not show.

/** Documented WorkflowRuntimes row. */
export interface WorkflowRuntimesRow {
  readonly instanceId: string;
  readonly workflowVersion: number;
  readonly docId: number;
  readonly runtime: string;
  readonly state: 'Completed' | 'Running' | 'Failed' | 'Stopped';
  readonly startTime: string;
  readonly timeOfCompletion: string | null;
}

// The task-level projections are named and described in the public documentation, but no example
// payload is published. Their field names below are approximations in the WorkflowRuntimes style.

interface TaskRowBase {
  readonly instanceId: string;
  readonly activityId: string;
  readonly activityName: string;
}

/** TaskExecutionTimes: task duration from assignment to confirmation. */
export interface TaskExecutionTimesRow extends TaskRowBase {
  readonly assignedTime: string;
  readonly confirmedTime: string;
  readonly executionTime: string;
}

/** TaskReactionTimes: time from assignment until a user picked the task up. */
export interface TaskReactionTimesRow extends TaskRowBase {
  readonly assignedTime: string;
  readonly pickedUpTime: string;
  readonly reactionTime: string;
}

/** TaskDecisions: decision chosen for a processed task. */
export interface TaskDecisionsRow extends TaskRowBase {
  readonly decisionName: string;
  readonly decisionTime: string;
}

/** TaskDecisionUsers: who took the decision for a processed task. */
export interface TaskDecisionUsersRow extends TaskRowBase {
  readonly userName: string;
  readonly decisionTime: string;
}

/** WorkflowErrorExits: error exit taken by the workflow. */
export interface WorkflowErrorExitsRow extends TaskRowBase {
  readonly errorExitName: string;
  readonly time: string;
}

export interface WorkflowAnalyticsProjections {
  readonly workflowName: string;
  readonly TaskExecutionTimes: readonly TaskExecutionTimesRow[];
  readonly TaskReactionTimes: readonly TaskReactionTimesRow[];
  readonly TaskDecisions: readonly TaskDecisionsRow[];
  readonly TaskDecisionUsers: readonly TaskDecisionUsersRow[];
  readonly WorkflowErrorExits: readonly WorkflowErrorExitsRow[];
  readonly WorkflowRuntimes: readonly WorkflowRuntimesRow[];
}
