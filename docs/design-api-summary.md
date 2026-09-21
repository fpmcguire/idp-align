# IDP-Align Design — DocuWare API Integration Summary

**Date:** 2026-09-21  
**Purpose:** Reference document for Backend/Integration decisions during Architecture Definition  
**Audience:** Tech Lead, Backend Developer  
**Status:** Research output from Designer + Prototyper — advisory, not authoritative

---

## Overview

IDP-Align integrates with two DocuWare APIs to observe divergence in:
1. **Document stream:** Invoice index-field data (vendor, amount, date)
2. **Workflow stream:** Purchase-to-Pay execution metrics (task duration, routing, errors)

This document describes the likely API calls, response shapes, and backend aggregation strategy implied by the prototype design.

**Key constraint (R7):** Credentials never reside in browser. A thin backend proxy brokers all DocuWare calls.

---

## Architecture Pattern

```
┌─────────────────────┐
│  IDP-Align Frontend │
│   (Dashboard UI)    │
└──────────┬──────────┘
           │ HTTPS + Session cookie
           ↓
┌─────────────────────────────────┐
│  IDP-Align Backend/Proxy        │
│  - Brokers OAuth2 auth          │
│  - Fetches from DocuWare APIs   │
│  - Aggregates & detects divg.   │
│  - Computes baselines           │
│  - Returns findings (never data)│
└──────────┬──────────────────────┘
           │
           ├─→ GET /platform/...
           ├─→ GET /workflow/...
           │
        [DocuWare APIs]
```

**Golden rule:** Frontend never sees raw DocuWare data. Backend returns only computed divergence findings using CAV vocabulary.

---

## 1. DocuWare Platform REST API (Document Stream)

### Primary Call: Fetch Recent Document Observations

```http
GET https://docuware.cloud/platform/v7/Organizations/{orgId}/FileCabinets/{cabinetId}/Documents
?
  filter: (Status = 'Indexed' AND DocumentDate >= @StartDate)
  startIndex: 1
  count: 500
  fields: {VENDORNAME, AMOUNT, CURRENCY, INVOICEDATE, DOCUMENTTYPE}
  dateformat: ISO8601
```

**Query parameters implied by design:**
- `StartDate`: Last 7-30 days (configurable per baseline window)
- `count`: Fetch in batches of 500 to avoid timeout
- `fields`: Only the divergence dimensions (vendor, amount, date, currency, type)
- No field values or sensitive content beyond what's needed for baseline comparison

### Expected Response

```json
{
  "Documents": [
    {
      "ID": 12345,
      "Title": "INV-2026-09-19-001",
      "Fields": [
        {
          "FieldName": "VENDORNAME",
          "Item": [
            {
              "Value": "Acme Corp"
            }
          ]
        },
        {
          "FieldName": "AMOUNT",
          "Item": [
            {
              "Value": "15250.00"
            }
          ]
        },
        {
          "FieldName": "CURRENCY",
          "Item": [
            {
              "Value": "USD"
            }
          ]
        },
        {
          "FieldName": "INVOICEDATE",
          "Item": [
            {
              "Value": "2026-09-19T00:00:00Z"
            }
          ]
        },
        {
          "FieldName": "DOCUMENTTYPE",
          "Item": [
            {
              "Value": "Invoice"
            }
          ]
        }
      ],
      "ModificationDate": "2026-09-19T14:32:00Z",
      "SourceFileExtension": "pdf"
    }
  ],
  "Count": 347,
  "PageSize": 500,
  "NextStartIndex": 501
}
```

### Backend Processing

IDP-Align backend ingests this and:

```typescript
// Pseudo-code
interface DocumentObservation {
  id: string;
  vendor: string;
  amount: number;
  currency: string;
  invoiceDate: Date;
  documentType: string;
  extractedAt: Date;
  observedAt: Date; // when we fetched it
}

// For each document:
const obs = new DocumentObservation({
  id: doc.Title,
  vendor: doc.Fields.find(f => f.FieldName === 'VENDORNAME').Item[0].Value,
  amount: parseFloat(doc.Fields.find(f => f.FieldName === 'AMOUNT').Item[0].Value),
  // ... etc
  observedAt: new Date()
});

// Store in Observed Truth index
observedTruthIndex.add('document', obs);

// Group by identity slice: (vendor, documentType)
const slice = `vendor:${obs.vendor}/type:${obs.documentType}`;
baselineIndex.update(slice, obs);

// Detect divergence
const baseline = baselineIndex.get(slice);
const divergence = detectDivergence(obs, baseline);
if (divergence.isSustained) {
  divergenceLog.record(divergence);
}
```

---

## 2. DocuWare Workflow Analytics API (Workflow Stream)

### Primary Call: Fetch Recent Workflow Executions

```http
GET https://docuware.cloud/analytics/v7/Organizations/{orgId}/WorkflowRuns
?
  filter: (WorkflowName = 'PurchaseToPay' AND StartDate >= @StartDate)
  startIndex: 1
  count: 1000
  dimensions: [Workflow, Step, RoutingAgent, DecisionAgent, ErrorCode]
  metrics: [Duration, TaskCount, ErrorCount, ResponseTime]
  dateformat: ISO8601
```

**Query parameters implied by design:**
- `WorkflowName`: "PurchaseToPay" or configurable per stream
- `count`: 1000 (more events than documents, less blocking)
- `dimensions`: Step, agent, routing decision, error type
- `metrics`: Duration (key for CAV divergence detection)

### Expected Response

```json
{
  "WorkflowRuns": [
    {
      "ID": "WF-2026-09-19-001",
      "WorkflowName": "PurchaseToPay",
      "StartDate": "2026-09-19T08:00:00Z",
      "EndDate": "2026-09-19T14:32:00Z",
      "TotalDuration_ms": 23520000,
      "Tasks": [
        {
          "StepName": "Manager Approval",
          "StartDate": "2026-09-19T08:00:00Z",
          "EndDate": "2026-09-19T14:32:00Z",
          "Duration_ms": 23520000,
          "RoutingAgent": "human_manager_001",
          "DecisionAgent": "AI_Classifier_v1.3",
          "DecisionCode": "approved",
          "ErrorCode": null,
          "ResponseTime_ms": 2400000,
          "Retries": 0
        },
        {
          "StepName": "Director Approval",
          "StartDate": "2026-09-19T14:35:00Z",
          "EndDate": "2026-09-19T15:02:00Z",
          "Duration_ms": 1620000,
          "RoutingAgent": "human_director_002",
          "DecisionAgent": "AI_Classifier_v1.3",
          "DecisionCode": "approved",
          "ErrorCode": null,
          "ResponseTime_ms": 300000,
          "Retries": 0
        },
        {
          "StepName": "Payment Processing",
          "StartDate": "2026-09-19T15:05:00Z",
          "EndDate": "2026-09-19T15:08:00Z",
          "Duration_ms": 180000,
          "RoutingAgent": "system_payment_service",
          "DecisionAgent": null,
          "DecisionCode": null,
          "ErrorCode": null,
          "ResponseTime_ms": null,
          "Retries": 0
        }
      ],
      "OverallStatus": "Completed"
    },
    {
      "ID": "WF-2026-09-19-002",
      "WorkflowName": "PurchaseToPay",
      "StartDate": "2026-09-19T09:15:00Z",
      "EndDate": "2026-09-19T18:22:00Z",
      "TotalDuration_ms": 32820000,
      "Tasks": [
        {
          "StepName": "Manager Approval",
          "Duration_ms": 32400000,
          "RoutingAgent": "human_manager_001",
          "DecisionAgent": "AI_Classifier_v1.3",
          "DecisionCode": "approved",
          "ErrorCode": null,
          "ResponseTime_ms": 3600000,
          "Retries": 1
        }
        // ... more tasks
      ],
      "OverallStatus": "Completed"
    }
  ],
  "Count": 487,
  "PageSize": 1000,
  "NextStartIndex": 1001
}
```

### Backend Processing

```typescript
interface WorkflowObservation {
  id: string;
  workflowName: string;
  step: string;
  duration_ms: number;
  routingAgent: string;
  decisionAgent: string;
  errorCode: string | null;
  responseTime_ms: number | null;
  observedAt: Date;
}

// For each task in each workflow run:
const obs = new WorkflowObservation({
  id: `${run.ID}:${task.StepName}`,
  workflowName: run.WorkflowName,
  step: task.StepName,
  duration_ms: task.Duration_ms,
  routingAgent: task.RoutingAgent,
  decisionAgent: task.DecisionAgent,
  errorCode: task.ErrorCode,
  responseTime_ms: task.ResponseTime_ms,
  observedAt: new Date()
});

// Store in Observed Truth index
observedTruthIndex.add('workflow', obs);

// Group by identity slice: (step, routingAgent, decisionAgent)
const slice = `step:${obs.step}/agent:${obs.decisionAgent}`;
baselineIndex.update(slice, obs);

// Detect divergence (e.g., duration spike)
const baseline = baselineIndex.get(slice);
const divergence = detectDivergence(obs, baseline);
if (divergence.isSustained) {
  divergenceLog.record(divergence);
}
```

---

## 3. IDP-Align Backend Internal APIs

These are what the **frontend calls** (via the proxy). The backend handles DocuWare auth and aggregation.

### A. Divergence Summary

**Endpoint:**
```http
GET /api/streams/{stream}/divergences/summary?period=7d
```

**Path parameters:**
- `stream`: "document" | "workflow"

**Query parameters:**
- `period`: "7d" | "30d" | "custom"
- `startDate` (optional): ISO8601 if period=custom
- `endDate` (optional): ISO8601 if period=custom

**Response:**
```json
{
  "stream": "document",
  "period": "7d",
  "summary": {
    "total": 8,
    "ongoing": 5,
    "resolved": 3,
    "trend": [3, 4, 5, 6, 6, 5, 8],
    "topIdentitySlices": [
      "vendor:AcmeCorp",
      "vendor:GlobalSupplies"
    ],
    "topDimensions": [
      "amount",
      "vendor_format",
      "date_format"
    ]
  }
}
```

**Frontend use:** Populates KPI cards (DS-003)

---

### B. Divergence List

**Endpoint:**
```http
GET /api/streams/{stream}/divergences
```

**Query parameters:**
- `period`: "7d" (default)
- `status`: "ongoing" | "resolved" | "all" (default)
- `identitySlice`: (optional) filter by vendor/step/agent
- `sort`: "onset" | "magnitude" | "slice" (default: onset descending)
- `limit`: 20 (default), `offset`: 0 (for pagination)

**Response:**
```json
{
  "stream": "document",
  "divergences": [
    {
      "id": "div_001",
      "identitySlice": "vendor:AcmeCorp/type:Invoice",
      "dimension": "amount",
      "baseline": {
        "referenceStart": "2026-08-01T00:00:00Z",
        "referenceEnd": "2026-09-18T23:59:59Z",
        "sampleSize": 240,
        "method": "historical_mean_2sd",
        "mean": 12000,
        "std": 1200,
        "value_range": [9600, 14400]
      },
      "observed": {
        "currentValue": 15450,
        "percentile": 98,
        "distance_from_baseline": 2.875
      },
      "magnitude": {
        "percentage_change": 0.288,
        "absolute_change": 3450
      },
      "timeline": {
        "onset": "2026-09-19T14:32:00Z",
        "duration_ms": 259200000,
        "status": "ongoing"
      },
      "evidence": {
        "affected_count": 8,
        "total_in_slice": 12,
        "ratio": 0.667
      }
    },
    {
      "id": "div_002",
      "identitySlice": "vendor:GlobalSupplies/type:Invoice",
      "dimension": "date_format",
      "baseline": {
        "referenceStart": "2026-08-01T00:00:00Z",
        "referenceEnd": "2026-09-18T23:59:59Z",
        "sampleSize": 156,
        "method": "mode",
        "value": "YYYY-MM-DD",
        "frequency": 0.98
      },
      "observed": {
        "currentValue": "MM/DD/YYYY",
        "frequency": 0.40
      },
      "magnitude": {
        "frequency_shift": 0.40
      },
      "timeline": {
        "onset": "2026-09-18T09:15:00Z",
        "duration_ms": 345600000,
        "status": "ongoing"
      },
      "evidence": {
        "affected_count": 42,
        "total_in_slice": 105,
        "ratio": 0.40
      }
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 8
  }
}
```

**Frontend use:** Populates divergence card list (DS-004, left pane)

---

### C. Divergence Detail

**Endpoint:**
```http
GET /api/divergences/{divergenceId}
```

**Response:**
```json
{
  "id": "div_001",
  "identitySlice": "vendor:AcmeCorp/type:Invoice",
  "dimension": "amount",
  "baseline": {
    "referenceStart": "2026-08-01T00:00:00Z",
    "referenceEnd": "2026-09-18T23:59:59Z",
    "sampleSize": 240,
    "method": "historical_mean_2sd",
    "mean": 12000,
    "std": 1200,
    "confidence_lower": 9600,
    "confidence_upper": 14400
  },
  "observed": {
    "currentValue": 15450,
    "percentile": 98,
    "samples": [15250, 15450, 15800, 16200, 15950, 15650, 15450]
  },
  "magnitude": {
    "percentage_change": 0.288,
    "absolute_change": 3450,
    "standard_deviations": 2.875
  },
  "timeline": {
    "onset": "2026-09-19T14:32:00Z",
    "duration_ms": 259200000,
    "status": "ongoing"
  },
  "cohort": {
    "total_in_slice": 12,
    "affected_count": 8,
    "within_baseline": 4,
    "ratio_affected": 0.667
  },
  "quality": {
    "confidence": "high",
    "sample_size_adequate": true,
    "calculation_method": "historical_mean_2sd"
  }
}
```

**Frontend use:** Populates detail pane (DS-005)

---

### D. Evidence Trace (Observations)

**Endpoint:**
```http
GET /api/divergences/{divergenceId}/observations
```

**Response:**
```json
{
  "divergenceId": "div_001",
  "observations": [
    {
      "timestamp": "2026-09-19T14:32:00Z",
      "type": "onset",
      "description": "First observation above 95th percentile threshold",
      "value": 15250,
      "percentile": 96,
      "documentId": "INV-2026-09-19-001",
      "evidence": "Single invoice from Acme Corp exceeded baseline by 27%"
    },
    {
      "timestamp": "2026-09-19T16:45:00Z",
      "type": "cohort_threshold_crossed",
      "description": "Multiple observations above baseline in same cohort",
      "cohort_size": 3,
      "pattern": "All 3 invoices from Acme Corp exceed 90th percentile",
      "evidence": "INV-2026-09-19-001, INV-2026-09-19-002, INV-2026-09-19-003"
    },
    {
      "timestamp": "2026-09-20T12:30:00Z",
      "type": "sustained_divergence_confirmed",
      "description": "Divergence meets sustained threshold (8+ samples over 24h)",
      "sample_count": 8,
      "duration_hours": 22,
      "pattern": "Consistent 25-30% above baseline across all Acme Corp invoices",
      "confirmed": true
    },
    {
      "timestamp": "2026-09-21T08:15:00Z",
      "type": "ongoing",
      "description": "Divergence remains sustained",
      "sample_count": 12,
      "duration_hours": 42,
      "pattern": "Persistent elevation, no sign of reversal"
    }
  ]
}
```

**Frontend use:** Populates evidence trace timeline (DS-007, evidence trace component)

---

### E. Time-Series Data for Charts

**Endpoint:**
```http
GET /api/divergences/{divergenceId}/metrics/{metric}/timeseries
?
  resolution=6h
  window=7d
```

**Path parameters:**
- `divergenceId`: "div_001"
- `metric`: "amount" | "duration" | "error_rate" | etc.

**Query parameters:**
- `resolution`: "1h" | "6h" | "1d" (time bucket size)
- `window`: "7d" | "30d" (lookback period)

**Response:**
```json
{
  "divergenceId": "div_001",
  "metric": "amount",
  "resolution": "6h",
  "window": "7d",
  "timeseries": [
    {
      "timestamp": "2026-09-14T00:00:00Z",
      "bucket": "2026-09-14T00-06",
      "observed_mean": 12150,
      "observed_median": 12100,
      "observed_min": 11500,
      "observed_max": 13200,
      "observed_samples": 4,
      "baseline_mean": 12000,
      "baseline_upper_2sd": 14400,
      "baseline_lower_2sd": 9600,
      "divergence_detected": false
    },
    {
      "timestamp": "2026-09-19T14:00:00Z",
      "bucket": "2026-09-19T14-20",
      "observed_mean": 15367,
      "observed_median": 15450,
      "observed_min": 15250,
      "observed_max": 15800,
      "observed_samples": 3,
      "baseline_mean": 12000,
      "baseline_upper_2sd": 14400,
      "baseline_lower_2sd": 9600,
      "divergence_detected": true
    },
    // ... 28 total points for 7 days at 6h resolution
  ],
  "summary": {
    "pre_divergence_mean": 12000,
    "post_divergence_mean": 15450,
    "change_percentage": 0.288,
    "change_onset_index": 44
  }
}
```

**Frontend use:** Populates Chart.js area chart (DS-015, Analysis view)

---

## 4. Authentication & Authorization

### OAuth2 Flow

**Step 1: Browser requests login**
```http
POST /api/auth/docuware/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "***"
}
```

**Backend action:**
- Exchanges credentials with DocuWare OAuth2 endpoint
- Stores access token server-side (never returned to browser)
- Returns session cookie

**Step 2: Subsequent requests**
```http
GET /api/streams/document/divergences
Cookie: sid=abc123...
```

**Backend action:**
- Validates session cookie
- Uses stored access token to fetch from DocuWare APIs
- Returns aggregated findings to browser

---

## 5. Data Retention & Refresh Policy

**Implied by design (not specified, for Tech Lead to decide):**

| Data | Retention | Refresh | Rationale |
| ---- | --------- | ------- | --------- |
| Document observations | 90 days | Daily (batch) | Baseline computation + audit trail |
| Workflow observations | 90 days | Daily (batch) | Baseline computation + audit trail |
| Computed divergences | 1 year | Real-time (streaming) or polling | Divergence history + evidence traceability |
| Baselines | Current only | Recalculate weekly | Adaptive baseline per identity slice |

---

## 6. Error Handling Strategy

**Not shown in prototype; needs Architecture Definition:**

- **DocuWare API timeout** → Return stale cached data + warning banner
- **Authentication failure** → Return 401, prompt re-login
- **Rate limit exceeded** → Implement exponential backoff, queue requests
- **Missing fields in DocuWare** → Log warning, skip observation (don't fail divergence)
- **Baseline not yet computed** → Return "insufficient data" state

---

## 7. Performance Assumptions

**From prototype, implied for Tech Lead:**

| Operation | Expected behavior | Optimization |
| --------- | ------------------- | ------------- |
| Fetch 500 documents | < 2s API call + 1s processing | Batch fetch, parallel processing |
| Fetch 1000 workflow runs | < 2s API call + 2s processing | Batch fetch, async processing |
| Compute divergence list (50 items) | < 500ms | Cache baseline index in memory |
| Render divergence list (50 cards) | < 100ms frontend | Virtual scrolling if >100 items |
| Render Chart.js with 168 points | < 500ms | Lazy-load Chart.js, pre-compute series |

---

## 8. Summary: What the Backend Must Do

```
┌─ OBSERVE
│  ├─ Fetch documents from DocuWare Platform API
│  ├─ Fetch workflow runs from DocuWare Workflow Analytics API
│  └─ Store raw observations in Observed Truth index
│
├─ CONSTRUCT BASELINES
│  ├─ Group observations by identity slice (vendor/step/agent)
│  ├─ Calculate historical mean/mode/percentile per slice
│  └─ Store baseline metadata (reference period, method, sample size)
│
├─ DETECT DIVERGENCE
│  ├─ Compare new observations against baseline
│  ├─ Flag if sustained (not one-off variation)
│  └─ Record observation timeline (onset → sustained → ongoing)
│
└─ SERVE TO FRONTEND
   ├─ Summary API: KPI counts and trends
   ├─ List API: Divergence cards with identity slices + magnitudes
   ├─ Detail API: Full baseline + stats + cohort breakdown
   ├─ Observations API: Evidence trace timeline
   └─ TimeSeries API: Pre-computed data for Chart.js
```

---

## 9. Open Questions for Tech Lead

1. **Real-time vs. batch?** Should observations be fetched continuously (WebSocket/SSE) or in daily batches?
2. **Baseline versioning?** When reference period changes, should old baselines be versioned or discarded?
3. **Caching strategy?** How long to cache baseline calculations? Baseline index in memory or persistent?
4. **Pagination?** How many divergences per request? Should frontend paginate or virtual-scroll?
5. **Error recovery?** If DocuWare API is down, serve stale cached findings or error state?
6. **Data minimization?** Store only computed divergences, or also raw observations for audit trail?
7. **Chart.js bundling?** CDN (as prototype) or bundled with app?

---

MOD-W v5.0.1 — Design API Summary

**Next:** Tech Lead uses this during Architecture Definition to design production data models, API contracts, and backend services.
