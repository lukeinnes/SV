# SV Explanation — Decisions and Working Notes

*Status: Living document. Updated as the Explanation section develops.*

## 1. Purpose

The Explanation section of the SV website is intended to communicate:

1. What problems Strengthened Voting seeks to address, and how it operates.
2. Why SV has been designed with its particular mathematical properties and parameters.
3. Whether SV achieves its objectives, and how its assumptions and consequences compare with existing research.

The objective is both explanatory and analytical. Philosophical judgements, mathematical assumptions, derived results and empirical claims must be distinguishable.

## 2. Agreed Website Architecture

**Parent section: Explanation**

Three principal pages are proposed:

### Voting Systems

**Audience:** Curious visitors and general readers.

A concise explanation of:
- The problems associated with excessive political consolidation and fragmentation.
- SV's proposed response to these problems.
- The basic mechanism of votes, Political Mandate and seats.
- The intended benefits and consequences of SV.

This page explains **what SV does**, without attempting to justify every mathematical design decision.

### Derivation of SV

**Audience:** Engaged and technical readers.

A progressive construction of SV's theoretical and mathematical framework, explaining **why SV works in the particular way proposed**.

### Evaluation of SV

**Audience:** Engaged and technical readers.

Assessment of SV through:
- Its mathematical properties and performance against its own objectives.
- Existing political-science research.
- Historical election simulations, comparisons and practical limitations.

### Technical Appendices — Provisionally Optional

Long proofs, detailed mathematical investigations, notation references and implementation specifications may be moved to dedicated technical pages or progressively disclosed within the principal pages.

The final form has not been decided.

## 3. Derivation — Agreed Structure

Current provisional sequence:

1. **From Votes to Seats** — Introduce mathematical notation through FPTP, Direct PR, thresholded PR and SV.
2. **Political Mandate** — Establish the rationale for Mandate and derive its mathematical function.
3. **Mandate Coefficient** — Investigate the properties of \(k\).
4. **Bounds of Power** — Derive the upper and lower limits of power.
5. **Calibration of SV** — Develop Unity versus Division, the majority-power criterion and the silver-ratio argument.
6. **Implementing SV** — Discuss thresholds and seat apportionment.

These headings are working titles, not final website navigation.

## 4. Agreed Editorial and Mathematical Conventions

### Progressive introduction of notation

Introduce variables when their meaning becomes necessary rather than listing all variables at the outset.

The opening comparison develops the following sequence:

- FPTP: \(v\rightarrow s\)
- Direct PR: \(v\rightarrow x\rightarrow s\)
- Thresholded PR: \(v\rightarrow x\rightarrow f\rightarrow s\)
- SV: \(v\rightarrow x\rightarrow M\rightarrow f\rightarrow s\)

Direct PR does not require a separate Fraction of Power variable because its ideal allocation is proportional directly to Vote Share.

FPTP must be described using constituency-level vote information rather than national aggregate votes alone.

### Independent derivation

SV should not be characterised as a subgroup or extension of Proportional Representation.

The comparison with existing systems establishes a common mathematical vocabulary. The subsequent construction of SV must follow from its own motivations and design decisions.

Using a proportional apportionment mechanism does not imply that SV inherits the underlying political philosophy of PR.

### Principles and philosophical propositions

There will not initially be a dedicated Principles section.

Instead, philosophical propositions, design constraints and calibration arguments will be introduced at the points where they are relevant.

The manuscript should clearly distinguish:
- Normative propositions and design choices.
- Mathematical assumptions.
- Mathematical consequences established by derivation.
- Empirical hypotheses requiring evaluation.

The derivation should explain why particular mathematical choices are defensible without implying that normative assumptions can be proved mathematically.

### Separation of theory and implementation

The central mathematical derivation should initially deal with continuous vote shares and ideal fractions of legislative power.

Electoral thresholds, integer seat apportionment and associated practical complications will be considered after the main theoretical model has been established.

The relationship between ideal theoretical properties and their implementation must be examined explicitly.

### Avoid unnecessary repetition

The problems of FPTP and PR belong primarily on the Voting Systems page.

Derivation may reference these problems where relevant, but should not repeat their extended criticism.

### Working prose

The manuscript may contain:
- Finished and unfinished text.
- Equations and mathematical results.
- Notes for diagrams or interactions.
- Unresolved questions.
- Editorial annotations.

Conceptual agreement and editorial completion are separate milestones. Material may be mathematically or philosophically settled before its wording is finalised.

## 5. Mathematical Context and Versioning

The original SV Word document is an older draft and should be treated as source material, not as an authoritative current specification.

In particular, its use of the former calibration value \(3.769293625\ldots\) is obsolete.

The current proposal uses the silver-ratio calibration, with the chosen Mandate Coefficient denoted by \(\lambda\), approximately \(5.338\).

The symbol \(k\) denotes the general variable Mandate Coefficient. The chosen SV calibration is \(k=\lambda\).

The derivation and justification of this value are to be developed in the Calibration section.

Historical examples and numerical results from the earlier Word document must be reviewed before reuse.

## 6. Outstanding Questions

### Political Mandate

- How should the philosophical rationale for disproportionately rewarding unified political support be expressed?
- What assumptions justify the exponential form of the Mandate Equation, rather than another convex function?
- Which mathematical properties should be treated as requirements, and which as consequences of the chosen model?

### Bounds and Calibration

- How should the Unity versus Division thought experiment be presented most convincingly?
- How should the silver-ratio criterion be distinguished from the mathematical consequences of choosing it?
- Which additional properties of \(k\), \(f_{\min}\) and \(f_{\max}\) deserve inclusion in the main narrative versus technical appendices?

### Thresholds and Apportionment

- How should raw and threshold-adjusted Vote Share be distinguished in notation?
- What exact representation principle motivates the threshold?
- Which properties of the idealised system survive thresholds and integer apportionment?
- How should the final apportionment method be justified?

### Evaluation

- Which of SV's claimed benefits can be demonstrated mathematically?
- Which require empirical support or simulation?
- What are the most important criticisms and competing explanations in political-science literature?
- How should results from historical elections be interpreted given that voters and parties might behave differently under SV?

## 7. Working Process

1. Discuss and examine one part of the derivation at a time.
2. Consolidate agreed material into `derivation.md`.
3. Record significant decisions and unresolved questions in this file.
4. Keep the main manuscript current while retaining earlier versions through Git.
5. Refine the website's presentation only as the content and its visual requirements become clearer.

**Current point of progress:** The broad Explanation architecture and Derivation sequence are agreed provisionally. Section 1, *From Votes to Seats*, has an initial working draft. The next substantive topic is Section 2, *Political Mandate*.

## Development Notes

*These notes are editorial and are not intended for the published page.*

- The four principal sections are provisional but broadly agreed.
- Section 1 establishes notation using other electoral systems; it does not present SV as a derivative of PR.
- Section 2 is the current working manuscript. The philosophical justification for proportional strengthening remains open to refinement.
- The distinction between unscaled Mandate \(m\) and scaled Mandate \(M\) should remain consistent.
- Use \(\omega\) exclusively for marginal Vote Strength.
- The first major interactive visual should demonstrate the relationship between marginal Strength and accumulated Mandate.
- The second should demonstrate the effects of varying \(k\) on a complete election.
- The worked election is illustrative, not a definitive specification of seat apportionment.
- The original calibration using \(k\approx3.76929\) is obsolete. The current proposal uses the silver-ratio calibration, \(\lambda\).
- The Consolidation Index, Advantage Ratio, extended mathematical properties and historical election comparisons will primarily be developed in Evaluation, with references from Derivation where appropriate.
- Formal proofs may be placed into expandable sections or dedicated technical appendices.