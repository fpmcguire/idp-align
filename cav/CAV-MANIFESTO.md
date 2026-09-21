# The CAV Manifesto

## Continuous Alignment Verification

**Canonical Manifesto — Version 1.0**

### 1. Systems Rarely Fail All at Once

Complex systems evolve continuously.

Services are upgraded. Devices change firmware. Schemas evolve. Models change. Vendors alter formats. Workflows are modified. Sites migrate at different times. New versions coexist with old ones.

The infrastructure may remain healthy.

Traffic continues to flow. APIs continue to respond. Dashboards remain green. Tests may continue to pass.

Yet the system can gradually stop behaving coherently.

**Systems drift.**

Continuous Alignment Verification (CAV) exists to make that divergence visible, measurable, explainable, and—at higher levels of maturity—correctable.

### 2. Monitoring Is Not Alignment

Traditional monitoring asks questions such as:

- Is the service running?
- Is traffic flowing?
- Are clients connected?
- Is latency acceptable?
- Are errors increasing?

These are necessary questions, but they are not alignment questions.

CAV asks:

> **Is the system still behaving coherently across the dimensions and identity slices that matter?**

A system may be operational and still be misaligned.

A single site may behave differently from every other site. One firmware version may emit a different domain value. One vendor's documents may begin producing different structured data. One workflow branch may gradually take longer than its peers. A model or agent version may behave differently from the version it replaced.

Monitoring detects operational condition.

**CAV verifies behavioral alignment.**

### 3. Alignment Is a Runtime Property

Alignment is not something established once during deployment and assumed thereafter.

It is a property that must be evaluated as the system operates and evolves.

At runtime, CAV observes whether:

- structures remain coherent;
- contracts remain compatible;
- domain values remain stable;
- cohorts continue behaving consistently;
- expected relationships remain intact;
- changes are explicit rather than accidental.

When these properties diverge persistently, the system is no longer fully aligned.

CAV therefore treats alignment as a **continuous verification problem**, not a release-time certification.

### 4. Observed Truth Comes First

CAV begins with evidence.

Before a system can reason about divergence, it must establish what is actually occurring.

CAV calls this **Observed Truth**.

Observed Truth is a structured, time-addressable representation of system behavior derived from available evidence such as:

- data payloads;
- events;
- execution traces;
- contract interactions;
- state transitions;
- performance measurements;
- errors;
- workflow activity;
- model or agent outputs.

Observed Truth is not declared intention.

It represents what the system **did**, not what somebody says it should have done.

This distinction is fundamental.

At the lower CAV maturity levels, meaningful alignment verification is possible using observed behavior alone.

Declared intention becomes necessary only when the system needs to compare observed behavior explicitly against what was intended.

### 5. Identity Is Essential

Global averages conceal local divergence.

CAV therefore evaluates behavior across meaningful **identity slices**.

Examples include:

- Site A vs. Site B;
- firmware v1 vs. firmware v2;
- Region EU vs. Region US;
- service version A vs. service version B;
- Vendor X vs. Vendor Y;
- workflow branch A vs. workflow branch B;
- model version A vs. model version B;
- protocol implementation A vs. protocol implementation B.

If one cohort diverges while aggregate metrics remain normal, the system is still misaligned.

Identity slicing transforms a stream of telemetry into evidence about **where divergence exists and whom or what it affects**.

### 6. Variation Is Not Divergence

Real systems vary.

CAV must not turn every fluctuation into a failure.

A useful alignment system distinguishes transient variation from sustained behavioral change.

CAV therefore looks for evidence such as:

- persistent structural change;
- sustained domain-value mutation;
- cohort-specific behavioral change;
- repeated contract deviation;
- continuing changes in timing or routing;
- movement away from established behavioral ranges.

The objective is not to eliminate variation.

The objective is to distinguish **noise from meaningful divergence**.

### 7. Baseline and Intent Are Different

CAV distinguishes between an **observed baseline** and **declared intent**.

An observed baseline is derived from system behavior.

It answers:

> What has this system, cohort, or stream actually been doing?

The baseline may be established from a selected historical period or inferred continuously from observed behavior.

Declared intent answers a different question:

> What is this system supposed to do?

Declared intent must be explicit enough to be compared with observed state.

Depending on the domain, it may include:

- contracts;
- schemas;
- policies;
- expected values;
- invariants;
- business rules;
- KPI definitions;
- architectural constraints;
- acceptable operating envelopes.

CAV must not silently treat observed behavior as intention.

**Normal behavior is evidence of what has happened. It is not automatically evidence of what should happen.**

### 8. Alignment Must Be Explainable

A red or green indicator is insufficient.

Every meaningful CAV divergence should be traceable to evidence.

An alignment finding should be able to answer:

- What diverged?
- Which identity slice was affected?
- What was observed?
- What was it compared against?
- Which dimension diverged?
- When did divergence begin?
- How persistent is it?
- How significant is the difference?
- What evidence supports the finding?

At higher maturity levels it should additionally answer:

- What declared intention was violated?
- What alignment delta was measured?
- Was an alignment envelope breached?
- Is divergence increasing or decreasing?
- What corrective action was taken?
- Did the system converge afterward?

**Alignment without evidence is assertion, not verification.**

## 9. The CAV Maturity Model

CAV capability develops through seven canonical maturity levels.

Higher levels extend lower levels rather than invalidating them.

### Level 0 — No Continuous Alignment

The system may have monitoring, dashboards, tests, or episodic verification, but it maintains no persistent model of alignment.

There is no continuous CAV claim at this level.

### Level 1 — Observed-State Divergence

The system continuously constructs Observed Truth and detects sustained divergence against observed behavior.

Core capabilities include:

- continuous observation;
- observed-state modeling;
- identity slicing;
- observed baselines;
- sustained divergence detection;
- evidence persistence.

The system can answer:

> **Is part of the system behaving differently from established observed behavior?**

A qualifying implementation may claim:

**CAV Level 1 — Observed-State Divergence.**

### Level 2 — Multi-Dimensional Observed Alignment

The system extends observed-state verification across multiple environments, sources, cohorts, or behavioral dimensions.

Capabilities may include:

- cross-environment comparison;
- multi-source reconciliation;
- richer identity slicing;
- extended domain modeling;
- multi-dimensional observed-state comparison.

The system can answer:

> **Are related parts of the system still behaving coherently with one another?**

A qualifying implementation may claim:

**CAV Level 2 — Multi-Dimensional Observed Alignment.**

### Level 3 — Intent Registry

The system introduces explicit **Declared Intention**.

Intent artifacts must be sufficiently structured to support comparison with observed state.

They should be:

- explicit;
- machine-readable;
- versioned;
- queryable;
- time-addressable;
- linked to their applicable scope.

The system can now distinguish formally between **what happened** and **what should have happened**.

A qualifying implementation may claim:

**CAV Level 3 — Intent Registry (Declared Intention).**

### Level 4 — Formal Alignment Deltas and Envelopes

The system computes formal differences between declared intention and observed state.

For alignment dimension *k*:

**Δₖ(t) = Dₖ(iₖ(t), sₖ(t))**

where:

- *iₖ(t)* represents projected intention;
- *sₖ(t)* represents projected observed state;
- *Dₖ* is the defined distance or comparison function.

The system may define acceptable **alignment envelopes** around intention and identify envelope breaches.

Core capabilities include:

- formal alignment deltas;
- dimension-specific comparison functions;
- alignment envelopes;
- breach evaluation;
- evidence linkage;
- historical delta persistence.

The system can answer:

> **How far has observed reality moved from declared intention, and is that difference acceptable?**

A qualifying implementation may claim:

**CAV Level 4 — Formal Alignment Deltas + Envelopes.**

### Level 5 — Drift Velocity Modeling

The system models how alignment deltas change over time.

For dimension *k*:

**Vₖ(t) = dΔₖ(t)/dt**

This makes it possible to distinguish a stable misalignment from a system that is actively moving farther away from intention.

Capabilities include:

- delta time-series;
- drift velocity;
- drift acceleration where useful;
- persistent-drift modeling;
- trend analysis;
- drift events;
- optional forecasting of approaching envelope breaches.

The system can answer:

> **Is alignment improving, remaining stable, or deteriorating?**

A qualifying implementation may claim:

**CAV Level 5 — Drift Velocity Modeling.**

### Level 6 — Convergence Enforcement

The system closes the alignment loop.

A detected divergence can result in a defined corrective response, and the effectiveness of that response is subsequently measured.

Capabilities include:

- defined corrective actions;
- control or orchestration interfaces;
- policy hooks;
- logged remediation;
- post-action measurement;
- convergence-rate tracking;
- enforcement mechanisms;
- complete alignment audit trails.

The system can answer:

> **What action reduced the divergence, and can we demonstrate that the system returned toward alignment?**

Only implementations satisfying the complete Level 6 definition may claim:

**Full CAV Compliance.**

## 10. CAV Is Cumulative

The levels describe increasing semantic depth.

A higher level inherits the requirements of the levels below it.

The progression is:

**Observe → Compare → Declare → Measure → Track → Converge**

Or, expressed as system capability:

**Observed Truth → Observed Divergence → Multi-Dimensional Alignment → Declared Intention → Formal Delta → Drift Velocity → Convergence**

The objective is not to force every implementation immediately toward Level 6.

The appropriate CAV level depends on the system, its risks, and what can legitimately be known about its intended behavior.

### 11. CAV Is Domain-Agnostic

CAV does not prescribe a particular protocol, industry, transport mechanism, database, AI model, or application architecture.

The evidence changes by domain. The alignment principle does not.

In an industrial messaging system, Observed Truth may consist of message schemas, domain values, firmware versions, topics, and device cohorts.

In a document-processing system, it may consist of extracted fields, document classes, vendors, workflow events, processing routes, and model outputs.

In a biological process, it may consist of measurements, phases, samples, environmental conditions, and expected biological ranges.

In a software system, it may consist of contracts, runtime behavior, architectural boundaries, schemas, dependencies, and deployment state.

CAV asks the same fundamental question:

> **Is the system remaining aligned as it evolves?**

### 12. CAV Is Not Monitoring

Monitoring tells us whether a system is operating.

CAV tells us whether the system remains behaviorally coherent.

Monitoring may provide evidence to CAV, but monitoring alone is not CAV.

A dashboard is not CAV. Telemetry collection is not CAV. An anomaly detector alone is not CAV. A test suite is not CAV. A compliance framework is not CAV.

CAV requires persistent reasoning about **alignment and divergence**.

### 13. CAV Builds on Established Disciplines

CAV does not claim to have invented baseline comparison, anomaly detection, concept-drift detection, change-point detection, runtime verification, process conformance, statistical distance, continuous assurance, reconciliation, or control theory.

These are mature disciplines with established research, standards, and implementation techniques. CAV implementations should reuse them where appropriate rather than invent weaker substitutes.

CAV's purpose is different: it provides a **domain-agnostic alignment-verification model and vocabulary** that organizes several recurring concerns into one cumulative structure:

**Observed Truth → Identity → Observed Baseline → Divergence → Declared Intention → Formal Delta → Drift Velocity → Convergence**

The relationship is complementary:

- **Concept-drift and change-detection methods** can implement parts of observed-baseline and sustained-divergence detection at Levels 1–2.
- **Process mining and conformance checking** provide methods for relating observed event behavior to descriptive or normative process models.
- **Runtime verification and formal methods** provide techniques for evaluating execution traces against explicit specifications, closely related to the intent-versus-observation problem introduced at Levels 3–4.
- **Continuous assurance** provides methods for turning runtime observations and verification results into persistent evidence and continuously maintained assurance arguments.
- **Control and reconciliation systems** provide established patterns for moving observed/current state toward desired state, closely related to Level 6 convergence.

CAV does not replace these disciplines and does not claim novelty for their individual mechanisms.

Its distinguishing proposition is the **unified, cumulative alignment model**: a system can begin with evidence-backed observed-state divergence when no declared intent exists, later introduce explicit intention, formalize measurable differences, model their change over time, and—where appropriate—close the loop through measured convergence.

Different CAV implementations may therefore use different algorithms, formal methods, statistical techniques, or control mechanisms while preserving the same canonical semantics.

### 14. Relationship to Adjacent Fields

CAV overlaps deliberately with several established fields, but the overlap occurs at different points in the maturity model.

**Runtime Verification** generally evaluates observed execution traces against formal specifications. This is closely related to CAV Levels 3–4, where Declared Intention becomes explicit and comparable with Observed Truth.

**Process Mining and Conformance Checking** relate event data to discovered or normative process models in order to identify commonalities and deviations. CAV can use these techniques in process-oriented domains, while retaining a broader domain model and allowing Level 1 verification before a normative model exists.

**Concept Drift and Data/ML Drift Monitoring** detect changes in observed distributions or behavior over time. These techniques are natural implementation candidates for CAV Levels 1–2, but CAV is not limited to statistical distributions, machine-learning systems, or data quality.

**Continuous Assurance** continuously collects and evaluates runtime evidence so that confidence or assurance claims can evolve as a system and its environment change. CAV shares the emphasis on persistent runtime evidence; CAV's narrower concern is alignment between observed behavior, baselines, and—at higher levels—declared intention.

**Reconciliation and Control Systems** compare desired and current state and apply corrective action to reduce the difference. This pattern is closely related to CAV Level 6, but CAV does not require automated control at lower levels.

These relationships are foundations and adjacent disciplines, not competitors that CAV attempts to rename.

CAV should therefore be presented as a **synthesis and generalization of alignment concerns across domains**, with a canonical vocabulary and cumulative maturity model, rather than as a claim that its underlying detection, verification, assurance, or control mechanisms are individually new.

### 15. Evidence Must Persist

Alignment findings must be auditable.

A CAV implementation should preserve the evidence necessary to reconstruct significant alignment decisions.

Depending on maturity level, this may include:

- observed-state history;
- baseline versions;
- identity-slice definitions;
- divergence events;
- intent versions;
- alignment deltas;
- envelope breaches;
- drift history;
- corrective actions;
- convergence measurements.

Historical persistence turns an alignment finding from an ephemeral alert into **verifiable evidence**.

### 16. Security, Privacy, and Compliance Are Cross-Cutting

A CAV level describes alignment capability.

It does not certify security, privacy, safety, or regulatory compliance.

Those concerns apply independently across all CAV levels.

A CAV implementation should apply appropriate controls for its domain, including:

- authentication and authorization;
- tenant isolation where applicable;
- secret protection;
- data minimization;
- retention controls;
- auditability;
- deletion and export mechanisms where required;
- secure deployment practices.

CAV evidence may support compliance activities.

**CAV compliance is not regulatory certification.**

## 17. Canonical CAV Vocabulary

**Observed Truth** — Evidence-backed representation of what the system is actually doing.

**Identity Slice** — A meaningful cohort or scope across which behavior can be compared.

**Observed Baseline** — A reference derived from historical or continuously inferred observed behavior.

**Divergence** — A sustained, meaningful departure from an observed baseline or relevant comparison.

**Declared Intention / Intent** — An explicit, machine-readable statement of expected system behavior.

**Alignment Delta** — A measurable difference between declared intention and observed state.

**Envelope** — The acceptable tolerance around declared intention for an alignment dimension.

**Breach** — An alignment delta that exceeds its applicable envelope.

**Drift Velocity** — The rate at which an alignment delta changes over time.

**Convergence** — A measurable reduction in alignment delta following corrective action.

**Evidence** — The persisted observations and relationships supporting an alignment finding.

These terms should retain the same semantic meaning across CAV implementations even when domain-specific UI language is used.

## 18. The CAV Principle

Continuous Alignment Verification rests on a simple observation:

> **A system can be healthy without being aligned.**

Therefore:

> **Observe what the system actually does.  
> Preserve the identities that make differences meaningful.  
> Distinguish sustained divergence from noise.  
> Keep observed behavior separate from declared intention.  
> Make differences measurable when intention exists.  
> Track whether those differences are growing or shrinking.  
> Preserve the evidence.  
> And, where appropriate, close the loop by measuring convergence.**

That is Continuous Alignment Verification.
