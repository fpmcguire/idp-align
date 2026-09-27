# IDP-Align Research And References

**Requirement:** R10 - Domain Research and References
**Architecture:** D10 - Research Documentation Stays Separate
**Step:** STEP-08 - Quality Gate Completion And Documentation
**Sources consulted:** 2026-09-26, during STEP-08 implementation
**Status:** Development Team draft for Tech Lead review, QA, and Product Owner review

---

## Purpose And Boundaries

This document records the public sources consulted to document how IDP-Align frames its scope: the DocuWare domain, the two public DocuWare APIs that shape the replay data, the Purchase-to-Pay / invoice-processing scenario, adjacent prior art, the canonical CAV Manifesto, and the MOD-W methodology. The About view's References section is a short user-facing summary. It does not replace this document.

Boundary statements:

- IDP-Align is not affiliated with, reviewed by, or endorsed by DocuWare.
- No source here is private, internal, or confidential, and no confidential interview information is used.
- No source here was used to access a DocuWare system; IDP-Align does not connect to DocuWare.
- Nothing here claims that DocuWare has a product defect or gap.
- Nothing here claims that IDP-Align is production software or ready for production use.
- Adjacent tools are listed as prior art, not as gaps that IDP-Align fills; IDP-Align does not claim market novelty.
- Terms used by adjacent tools, such as "alert", "anomaly", "root cause", or "drift detected", are those tools' terms and do not describe IDP-Align behavior.

### How sources were verified

Every source listed under "Sources By Topic" was fetched and read on the date shown. A source that could not be retrieved, or that did not support the stated relevance, is listed under "Candidates Not Cited" instead. Page titles are quoted as retrieved. Summaries are limited to what each page states.

---

## Sources By Topic

Each table lists the source, where it is, who publishes it, when it was consulted, how it informed IDP-Align's scope, and the limit on what that relevance claims.

### 1. DocuWare AI Hub

| Source | URL | Publisher | Accessed | How it informed IDP-Align scope | Limits of the claim |
| --- | --- | --- | --- | --- | --- |
| DocuWare AI Hub | https://start.docuware.com/docuware-ai-hub | DocuWare | 2026-09-26 | Describes the AI Hub as DocuWare's AI research and development center, with Intelligent Document Processing among its focus areas. This supports the About view's statement that DocuWare applies AI-assisted processing through its AI Hub, and the choice of AI-extracted document data as one observed stream. | Public product page. IDP-Align does not use, evaluate, or integrate any AI Hub capability. |
| Introduction to Intelligent Document Processing | https://knowledgecenter.docuware.com/docs/intelligent-document-processing-introduction | DocuWare Knowledge Center | 2026-09-26 | Describes IDP splitting files, classifying document types, and extracting index data such as invoice numbers and vendor names into DocuWare index fields. This shaped the Document stream's focus on extracted index-field values per vendor and document type. | IDP-Align observes synthetic replay values shaped like extracted index fields. It does not run or assess DocuWare IDP. |

### 2. DocuWare Platform REST API

| Source | URL | Publisher | Accessed | How it informed IDP-Align scope | Limits of the claim |
| --- | --- | --- | --- | --- | --- |
| Default web service: DocuWare Platform API | https://knowledgecenter.docuware.com/docs/default-web-service-docuware-platform-api | DocuWare Knowledge Center | 2026-09-26 | Documents the REST web service for file cabinets and documents, including routes and sample JSON bodies. It is the public reference for the document and index-field shapes the Document stream replay data is modeled on, and it is linked from the About References section. | Replay data is synthetic and modeled on public documentation. IDP-Align makes no calls to this API. |

### 3. DocuWare Workflow Analytics API

| Source | URL | Publisher | Accessed | How it informed IDP-Align scope | Limits of the claim |
| --- | --- | --- | --- | --- | --- |
| Workflow Analytics API | https://knowledgecenter.docuware.com/docs/workflow-analytics-api | DocuWare Knowledge Center | 2026-09-26 | Documents historical workflow instance data (runtime durations, completion states, timestamps) and task data (execution times, user decisions, reaction times). This shaped the Workflow stream's Dimensions (task duration, response time, workflow runtime) and its factual Evidence context such as instance state and decision agent. It is linked from the About References section. | Replay data is synthetic and modeled on public documentation. IDP-Align makes no calls to this API. |

### 4. Purchase-to-Pay / Invoice Processing

| Source | URL | Publisher | Accessed | How it informed IDP-Align scope | Limits of the claim |
| --- | --- | --- | --- | --- | --- |
| Purchase-to-Pay Solutions | https://start.docuware.com/purchase-to-pay | DocuWare | 2026-09-26 | Describes requisitions, invoice capture, reconciliation of purchase orders, delivery notes, and invoices, and approval routing. This provided the realistic scenario framing for both streams: invoices as the Document stream subject and invoice approval as the Workflow stream subject. | Scenario framing only. IDP-Align does not implement purchasing, matching, or approval. |
| What Is Invoice Processing? How It Works | https://start.docuware.com/process-incoming-invoices | DocuWare | 2026-09-26 | Describes the invoice steps: arrival, capture and extraction of vendor name and amount, verification, and approval routing. This informed the Document stream's vendor, amount, currency, and date fields and the Workflow stream's review, approval, and payment-release steps. | Scenario framing only. Replay vendors and values are synthetic. |

### 4a. Population-Specific Document Patterns

These sources are external research evidence for Population-Specific Divergence. They motivate the generalized Identity Slice pattern `Producer x Document Type`; they are not product requirements, and IDP-Align does not reproduce customer data.

| Source | URL | Publisher | Accessed | How it informed IDP-Align scope | Limits of the claim |
| --- | --- | --- | --- | --- | --- |
| Case Study: Giebeler-Feuerschutz | https://start.docuware.com/case-studies/Giebeler-Feuerschutz | DocuWare | 2026-09-27 | Describes roughly 800 to 1,000 supplier invoices per month, invoices with many line items, supplier-specific peculiarities that can make automatic processing difficult, and supplier-specific AI training when a supplier's invoice causes problems. This directly supports `Supplier x Invoice` as a meaningful document population pattern. | Research motivation only. IDP-Align must not claim Giebeler-Feuerschutz experienced the sustained Divergence simulated by IDP-Align, and no customer data is reproduced. |
| Case Study: Piening Personal | https://start.docuware.com/case-studies/piening | DocuWare | 2026-09-27 | Describes time-tracking data and documents produced by numerous customer systems with varied formats, including cases that required more in-depth AI training. This directly supports `Customer x Timesheet` as a meaningful document population pattern. | Research motivation only. IDP-Align must not claim Piening Personal experienced the sustained Divergence simulated by IDP-Align, and no customer data is reproduced. |
| Case Study: Sport Auto Plus GmbH | https://start.docuware.com/case-studies/sport-auto-plus | DocuWare | 2026-09-27 | Describes official notices for minor traffic offences and other violations, including the absence of a single unified German notification form and state-authority-specific variations. This directly supports `Authority x Traffic Notice` as a meaningful document population pattern. | Research motivation only. IDP-Align must not claim Sport Auto Plus experienced the sustained Divergence simulated by IDP-Align, and no customer data is reproduced. |

The supported pattern is:

```text
Supplier  x Invoice
Customer  x Timesheet
Authority x Traffic Notice

         generalizes to

Producer x Document Type
```

These sources establish that producer-specific document populations occur in real DocuWare IDP environments. They do not establish that any cited customer experienced the particular sustained Divergence that IDP-Align will simulate. The initial `Supplier Invoice Population Divergence` replay scenario remains entirely synthetic.

### 5. Adjacent ML Drift Monitoring, Data Observability, And Streaming Drift Detection

These sources are prior art. They show that comparing current behavior with a reference and reporting sustained change is established practice. IDP-Align applies that idea to the CAV Level 1 model; it does not claim to improve on these tools.

| Source | URL | Publisher | Accessed | How it informed IDP-Align scope | Limits of the claim |
| --- | --- | --- | --- | --- | --- |
| Data Drift (DataDriftPreset) | https://docs.evidentlyai.com/metrics/preset_data_drift | Evidently AI | 2026-09-26 | ML drift monitoring prior art: compares a current dataset with a reference dataset, choosing per-column statistical tests by column type. It supports the product's positioning that reference comparison is mature and that IDP-Align is not novel in this respect. | Evidently reports "drift detected" results. IDP-Align instead surfaces sustained Divergence from an Observed Baseline with Evidence and does not use Evidently's methods. |
| Drift tracing | https://arize.com/docs/ax/machine-learning/machine-learning/how-to-ml/drift-tracing | Arize AI | 2026-09-26 | ML drift monitoring prior art: measures drift against a reference data set, either training data or historical data, then narrows it to features and slices. It supports the per-Identity-Slice view and the historical reference window as familiar practice. | Arize describes impactful features "degrading your model". IDP-Align makes no degradation, importance, or Attribution claim. An Arize screenshot in `design-refs/` was a design reference only. |
| Data Observability | https://docs.soda.io/data-observability | Soda | 2026-09-26 | Data observability prior art: monitors track data-quality metrics over time and compare them with baselines from historical patterns. It supports tracking per-slice metrics over time against a history-derived baseline. | Soda uses anomaly detection and alerting. IDP-Align does not use those terms or behaviors for its findings. A Soda screenshot in `design-refs/` was a design reference only. |
| ADWIN | https://riverml.xyz/dev/api/drift/ADWIN/ | River (open-source project) | 2026-09-26 | Streaming drift-detection prior art: keeps an adaptive window and compares sub-window averages using a significance parameter, citing Bifet and Gavaldà (2007). It supports the product statement that change detection over streams has established methods. | IDP-Align does not implement ADWIN. Its sustained-Divergence rule is its own documented method. |
| PageHinkley | https://riverml.xyz/dev/api/drift/PageHinkley/ | River (open-source project) | 2026-09-26 | Streaming drift-detection prior art: a two-sided Page-Hinkley (CUSUM-style) test for increases and decreases in the mean, with a minimum number of instances before detection. It supports treating a sustained shift in the mean, not a single outlier, as the signal worth surfacing. | IDP-Align does not implement Page-Hinkley. |

### 6. Canonical CAV Manifesto v1.0

| Source | URL | Publisher | Accessed | How it informed IDP-Align scope | Limits of the claim |
| --- | --- | --- | --- | --- | --- |
| continuous-alignment-verification repository (CAV Manifesto v1.0); in-repo copy at `cav/CAV-MANIFESTO.md` | https://github.com/fpmcguire/continuous-alignment-verification | Frank McGuire | 2026-09-26 | The canonical source for CAV terms and levels. The repository identifies CAV Manifesto v1.0 as the canonical definition and names Level 1 as Observed-State Divergence. The in-repo copy defines Observed Truth, Identity, Observed Baseline, Divergence, and the separation of observed baseline from declared intent. IDP-Align implements Level 1 only, and `mod-w/domain-language.md` follows these terms. It is linked from the About view. | IDP-Align implements only CAV Level 1 - Observed-State Divergence. |

### 7. MOD-W Methodology

| Source | URL | Publisher | Accessed | How it informed IDP-Align scope | Limits of the claim |
| --- | --- | --- | --- | --- | --- |
| MOD-W (Moderated AI Development Workflow) repository; in-repo templates under `mod-w/` (v5.0.1) | https://github.com/fpmcguire/mod-w | Frank McGuire | 2026-09-26 | Defines the role-based, human-moderated workflow IDP-Align follows: Product Owner, Tech Lead, Development Team, QA, and Moderator; small Steps; plan approval, Tech Lead review, QA, and Moderator gates. This governs how every IDP-Align Step, including STEP-08, is scoped, reviewed, and accepted. | IDP-Align is a practical exercise of the current MOD-W version and is not a formal evaluation of it. |

---

## Candidates Not Cited

These candidates were considered during STEP-08 but are not cited, because they were not fetched and read successfully.

| Candidate | Reason not cited |
| --- | --- |
| Gama, Žliobaitė, Bifet, Pechenizkiy, Bouchachia, "A Survey on Concept Drift Adaptation", ACM Computing Surveys (DOI 10.1145/2523813) | The ACM Digital Library page returned HTTP 403, so the source could not be read. It is not cited from memory. |
| NannyML drift-monitoring documentation | Not fetched. The Evidently and Arize sources cover ML drift monitoring prior art. |
| DocuWare developer portal | Not fetched. The Knowledge Center pages for both APIs were retrieved and are cited instead. |
| `docs/design-api-summary.md` (repository) | Not an external source. It is marked "advisory, not authoritative" and describes assumed endpoints, so it is not cited as API documentation. |

---

## Unrecorded Pre-Build Research

The `product.md` change log records domain and market research on 2026-09-16 and 2026-09-17, before the build. The specific sources of that research were not recorded in the repository. This document does not reconstruct them and does not claim that any source above was used then. Every source above was consulted on 2026-09-26 to document the scope framing during STEP-08. If the original research notes are provided later, they can be added in a separate, approved update.

---

## Change Log

| Date | Change |
| --- | --- |
| 2026-09-26 | Created in STEP-08 under A-060 and A-062. |

---

MOD-W v5.0.1
