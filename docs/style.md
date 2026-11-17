# Strengthened Voting — Editorial Style Guide

*Version 0.1 · Working conventions for drafting, reviewing and publishing the Explanation.*

## 1. Purpose and editorial philosophy

The Explanation presents Strengthened Voting (SV) as a reasoned proposal: a political argument developed into a mathematical model, examined for its consequences, and assessed against alternatives. It is neither a neutral textbook nor a promotional brochure.

The intended readers include motivated non-specialists and academics. The main narrative should be accessible without advanced mathematics; the complete reasoning and technical details must remain available for scrutiny.

**Primary rule:** explain the intuition, make the premises explicit, derive the consequences confidently, and show what each result means.

Accessibility does not require omitting mathematics. Rigour does not require placing every algebraic step in the main text.

### Advocacy and intellectual honesty

Derivation is entitled to **advocate** SV as the author's preferred conclusion. It need not repeatedly retreat to qualifications once a premise has been clearly introduced and defended. From that point, develop its consequences in a confident, logical voice.

However, distinguish:

| Claim | How to present it |
| --- | --- |
| **Definition** | “We define…” |
| **Normative premise** | “SV proposes…”, followed by the substantive justification |
| **Modelling assumption** | “We model this by…”, explaining the mathematical choice |
| **Deduction** | “Therefore…”, “It follows that…” |
| **Illustration** | “Consider…”, with assumptions and parameters stated |
| **Behavioural prediction** | “This may encourage…”, with any assumptions about voters or parties |
| **Empirical assertion** | Support it with evidence and a reference |

A consequence may be presented firmly when it genuinely follows from premises already established. Avoid repeating “under our assumptions” at every step. Reintroduce a premise when it changes, is controversial in a *new* way, or the reader has moved to a substantially different argument.

Do not portray a modelling choice as a theorem or a thought experiment as empirical evidence. Reserve the fuller criticism of SV's premises and alternatives for Evaluation.

## 2. Organisation and page structure

The planned top-level navigation is:

1. **Voting Systems**
2. **Derivation**
   - **2.1 From Votes to Seats**
   - **2.2 The Mandate Equation**
   - **2.3 The Mandate Coefficient**
   - **2.4 Implementation**
3. **Analysis**
4. **Evaluation**
5. **Glossary**

Derivation is a navigation folder containing **four webpages**, not a fifth overview article in addition to them. **Implementation is one webpage**; “The Complete SV Process” is its concluding subsection and the conclusion of Derivation as a whole.

Analysis and Evaluation remain single webpages provisionally; either may later become a folder if their developed content warrants it. Do not split pages merely because a section is long. Split where the argument has a meaningful conceptual boundary.

The Glossary is the current fifth navigation item. A future **Appendices** folder containing the Glossary, References and perhaps technical notes is a sensible possible evolution, **not a change to the present navigation**. Reference management should not wait for that decision.

### Responsibilities of the sections

- **Voting Systems:** the political problem, established alternatives and the criticisms or objectives motivating SV.
- **Derivation:** the premises, equations, calibration and practical rules required to specify SV.
- **Analysis:** what the model does and what conditional incentives emerge, including merger premiums, consolidation and differentiation.
- **Evaluation:** whether those properties are desirable, their institutional practicality, competing choices and relevant literature.
- **Glossary:** a reference to terms, notation and definitions, not a substitute for explaining them at first use.

An idea should normally have **one main home**. Introduce it fully where it first becomes necessary to advance the argument, not simply where it first happens to be relevant. Later sections should recall the result briefly and link back rather than restating the derivation.

**Look ahead while editing.** Before expanding a paragraph, check whether its natural home is a later subsection or another page. This is the principal way to prevent repetition.

## 3. Narrative voice and style

Use **British English**, present tense for the mathematical argument, and an active, direct explanatory voice where possible.

Use **“we”** to lead the reader through reasoning: “We can now examine…”, “Substituting this expression…”. Use **“SV proposes”** for the system's normative commitments. Use direct statements for results already established: “The Upper Bound increases…”.

Do **not** switch to “the author” as a regular narrative voice. Reserve first-person singular for a genuinely personal statement if one is ever needed; it should be rare.

The manuscript can be persuasive without pretending that the reader already agrees:

- Prefer: “SV proposes that broader political agreements should receive additional Mandate.”
- Avoid: “We all recognise that larger parties deserve more power.”
- Prefer: “We can now derive the consequence of this premise.”
- Avoid: “The author therefore claims that…”

Use passive constructions when the actor is irrelevant: “The opposition vote is divided equally…”.

Prefer economical but complete paragraphs, precise verbs and clear transitions. Do not shorten a passage so far that a reader loses the causal connection between its steps. Avoid filler, repetitive rhetorical questions, unexplained jargon and unnecessary hedging.

Capitalise the formal names of SV quantities consistently (Vote Share, Political Mandate, Mandate Share, Seat Quota, Seat Share, Marginal Vote Strength, Mandate Coefficient, Innes Constant). Use lower case for ordinary descriptive uses.

## 4. Standard progression of an argument

Where suitable, present a new idea in this order:

**Political or intuitive problem → definition/premise → mathematics → result → interpretation.**

The order need not be mechanically repeated for every minor calculation.

Introduce significant equations with the question they answer. Follow them with the political or mathematical significance of the result, not a sentence merely reading the notation aloud.

A good worked example normally follows one coherent election through several steps. Change the example when the new concept needs different conditions, and explain the change.

At the end of each Derivation webpage, include a short **“What we have established”** paragraph or equivalent prose, followed where useful by the question motivating the next page. This is a synthesis, **not** a second summary of every subsection.

Provide navigational links underneath the conclusion:

**← Previous: [page title] · Next: [page title] →**

At the final Derivation page, the next link leads to Analysis. The website should generate the actual URLs and navigation presentation.

## 5. Mathematics for two levels of reader

The main text must be intelligible **without opening expandable algebra**. It should retain all equations necessary to understand the model and the logical progression, rather than merely asserting conclusions.

Put lengthy equation-solving, integrations, Taylor expansions and auxiliary proofs in titled, expandable sections. These are rigorous parts of the work, not disposable footnotes.

Each disclosure must:

1. Begin at a meaningful point immediately after the question or equation it supports.
2. Have a descriptive title, such as **“Show the differential-equation solution”** or **“Derive the opposition limit”**.
3. Include a self-contained proof with defined symbols and enough working to verify it.
4. End before the main narrative resumes with the resulting expression and interpretation.
5. Permit the reader who leaves it closed to continue without losing the argument.

The Word draft previously used Heading 5 “+Expand to see breakdown” and an empty Heading 5 to delimit these passages. This was intentional. In Markdown, use an **explicit disclosure structure**, not an empty heading, so the start and end cannot be mistaken for manuscript text.

A provisional portable convention is the HTML details element:

<details>
<summary>Show the differential-equation solution</summary>

The intermediate working and equations belong here.

</details>

Test mathematical rendering *inside* such elements in VS Code, GitHub and the eventual website before adopting this markup universally. If a renderer fails, implement an equivalent named disclosure in the Svelte publishing pipeline. **Do not silently discard hidden algebra during conversion.**

## 6. Mathematical notation and economy

Maintain one preferred symbol and one formal name for each quantity, recorded in the central Glossary. Use consistent subscripts, capitalisation, units and meanings.

### Generic variables versus particular parties

Use **\(x\)** when discussing a general Vote Share, a curve, a derivation applying to any party, or a single focal party whose identity is already clear. Use **\(x_i\)** when referring to a specified party in a multi-party election, defining per-party quantities, or writing sums and rules across parties.

Apply the same principle to **\(f\)** versus **\(f_i\)**:

- **\(f_i\)**: the Mandate Share of Party \(i\).
- **\(f(x)\)**: a general curve or Election Line, with fixed parameters explained nearby.
- **\(f_{\max}(x;k)\)**, **\(f_{\min}(x;k)\)**: functions whose dependence on Vote Share and Mandate Coefficient matters.
- **\(f\)**: the ordinate or a generic Mandate Share when no party-specific index is needed.

Do not add subscripts reflexively to every expression. Use enough notation to make the meaning unambiguous, and no more.

### Function notation versus variable notation

Use **\(M(x)\)** when defining or investigating the *function* that maps Vote Share to Mandate. Use **\(M_i=M(x_i)\)** when applying that function to Party \(i\). Thereafter, **\(M_i\)** is normally sufficient in an election table or apportionment equation.

An unindexed **\(M\)** may be used for the Mandate of a single clearly identified focal party, but do not use it if it could be confused with **Total Mandate**. Prefer **\(\Sigma M\)** or an explicit sum for Total Mandate.

Use **\(m(x)\)** only for the unscaled Mandate during the initial derivation; explain clearly when it becomes the scaled **\(M(x)\)**. Do not switch between lowercase and uppercase without signalling that distinction.

For example:

$$
M(x)=A(e^{kx}-1)
$$

defines the general function, while

$$
M_i=A(e^{kx_i}-1)
$$

applies it to Party \(i\).

It is usually unnecessary to write **\(M(x_i)\)** at every later occurrence.

### Initial definitions and later shorthand

Define a symbol at first use within the relevant argument. On a later webpage, give a short reminder when needed, not a full second derivation. A reader should be able to enter a page directly and obtain the needed context, supported by links to the Glossary.

Use **\(R_i\)** for the **Seat Priority Score** in Sainte-Laguë, rather than **\(P_i\)**, which risks confusion with other meanings of \(P\). The ranking rule is

$$
R_i=\frac{M_i}{2s_i+1}.
$$

Avoid introducing Greek letters merely to avoid an English-letter collision if the result is likely to confuse a general reader.

### Exact equality and approximation

Use **\(=\)** for exact mathematical equalities, and **\(\approx\)** for rounded or truncated numerical values.

Preferred:

$$
x_*=1-\frac{1}{\sqrt{2}}\approx0.292893
$$

$$
\Lambda\approx5.33684511056
$$

Do **not** routinely append an ellipsis after an approximate decimal: **\(\approx5.3368\)** already says that the displayed digits are approximate. Avoid **\(=5.3368\ldots\)** as the default way of reporting a computed root, since the unspecified continuation does not provide an exact mathematical definition.

Use ellipses naturally for continuing sequences (such as the Sainte-Laguë divisors \(1,3,5,7,\ldots\)), or when the decimal expansion itself is the object of discussion.

Where an exact form is illuminating, give it **before** the approximation: **\(10\ln2\approx6.9315\)**. Specify the desired precision for numerical tables; use consistent decimal places within a comparison.

Use fractions in exact theoretical equations and percentages in explanatory prose where that helps the reader.

### Other notation conventions

Retain **\(S\)** for the final legislature size and **\(N\)** for the number of seats allocated so far in an animated allocation example. Distinguish pre-threshold theoretical Mandate Share from post-threshold eligible Mandate Share when eligibility changes the denominator.

Do not silently substitute a practical integer-seat majority for a continuous majority of Mandate Share.

## 7. Equations and references

**Do not number every displayed equation.** The threshold for numbering should be high: an equation merits a stable reference when it defines a central quantity, states a major result, or is likely to be cited repeatedly in later sections.

Likely candidates include the Mandate Equation, Mandate Share, the Bounds of Power, the calibration condition for the Innes Constant and the Sainte-Laguë allocation rule. Routine algebraic substitutions and intermediate working should remain unnumbered.

Use the **name** of an important equation as the principal reader-facing reference. Where a number is helpful for academic citation, accompany it with the name: “the Upper Bound of Power (Equation …)”.

Give significant equations stable *semantic identifiers* in the source (for example, an identifier meaning “mandate-equation”), independent of whatever display number the website eventually assigns.

The final numbering scheme can follow the page hierarchy, but **do not hard-code page-dependent numbers into manuscript prose** until the website can manage cross-references reliably.

Equations, figures and tables have **separate numbering sequences**.

## 8. Figures, diagrams and interactive content

Figures are integral to the explanation, not decorative extras. **Every graph, diagram and substantive illustration should have a caption** and a stable source identifier. Use figure numbers on the published website, ideally generated from the structure rather than typed manually into Markdown.

A figure should answer a particular question or make a specific relationship visible. Introduce it in the prose, and explain the observation that the reader should draw from it.

Prefer **visual continuity** across a sequence of related graphs. Retain axes, scales, colours and layout where possible, while revealing new information: for example, Election Lines → Upper Bound → Lower Bound → Majority-Vote Boundary.

For every important figure, maintain:

- A readable static SVG or PNG in the manuscript.
- A descriptive caption and useful alternative text.
- Clearly identified variables, units, axes and assumptions.
- A stable identifier suitable for an interactive replacement.
- An interactive Svelte implementation where controls materially improve understanding.

The static image must convey the essential claim without requiring interaction. The Svelte component may add sliders, annotations, animation or linked plots, but must not change the mathematics.

For example, a Markdown source can contain:

    <!-- figure-id: bounds-of-power -->
    ![Upper and Lower Bounds of Mandate Share against Vote Share](./figures/bounds-of-power.svg)

    *Bounds of Power at a fixed Mandate Coefficient.*

Keep figure assets in a predictable folder. Prefer **SVG** for mathematical diagrams and **PNG** for temporary raster illustrations. Do not leave a figure specification as the *only* visual in a reader-facing manuscript when a usable static illustration is available.

## 9. Worked elections and numerical verification

Use hypothetical elections deliberately. State the Vote Shares, \(k\), legislature size where relevant, threshold assumptions and whether an allocation is continuous or rounded.

Distinguish **illustrative** values of \(k\) from the reference Innes Constant \(\Lambda\). Reuse an example across adjacent subsections when that aids comprehension; change examples to expose a genuinely new property.

A worked example should deliver a named insight, not simply demonstrate arithmetic.

Before publication, independently recompute **every** numerical table, threshold example, captioned value and plotted coordinate from the stated equations. Check that totals and rounded displays are mutually consistent.

If a figure or table was transcribed from Word, inspect the original equation object or a rendered page before alleging an algebraic error: text extraction can omit subscripts, fractions and superscripts.

Never treat a successful transcription as mathematical verification; these are separate checks.

## 10. The silver ratio and other mathematical connections

It is legitimate to mention the **silver ratio**, even though identifying a familiar mathematical constant is not necessary to complete the derivation. This is a memorable and potentially persuasive connection, and can enrich the explanation.

Present it accurately as a **consequence of the chosen pairwise-encounter calibration criterion**, not as independent proof that the criterion is politically correct. One well-placed explanation of the connection is sufficient; avoid repeatedly undercutting or re-justifying it thereafter.

Related identities, geometric constructions and supplementary mathematics may appear in optional notes when they reward curiosity without interrupting the core argument.

The same principle applies elsewhere: include mathematically interesting details when they illuminate the model or make its ideas memorable, but keep the argument's main route visible.

## 11. Website-aware writing and navigation

Write each manuscript as a webpage-ready argument, but do not allow implementation details to dictate its logic.

Each page should have a clear opening purpose, an internally coherent sequence of sections, and an ending that establishes what has been learned. A fixed left-side contents navigation on larger screens, and an accessible equivalent on mobile, should identify the reader's position in the overall Explanation and within the current page.

Use descriptive headings and stable anchors for sections, figures and important equations. Avoid headings such as “Further Thoughts” or “Some Mathematics” when a subject-specific title would work.

A reader arriving at any page through a direct link should understand its immediate purpose and find a route to any required earlier definition. Do not copy lengthy previous sections merely to make the page self-contained.

The maintained manuscript should remain **readable in GitHub and VS Code**, including mathematics and images. The website may replace static figures with Svelte components and enhance cross-references and disclosures.

Use Markdown as the primary source of prose, equations and image references; keep figure assets and interactive Svelte components separately. Do not maintain diverging Word and Markdown “final” versions.

The manuscript uses standard Markdown mathematics delimiters: **single dollar signs for inline maths and double dollar signs for displayed maths**. Verify rendering in the chosen preview and publishing environments.

## 12. Citations and references

Cite historical facts, empirical political claims, literature comparisons and established technical results where a source materially supports the point. Do not clutter elementary, self-contained algebra with citations.

Distinguish what SV proposes originally from concepts already present in electoral systems research. In Evaluation, engage directly with relevant objections and alternative approaches rather than presenting only supportive literature.

Use descriptive hyperlinks where helpful. Keep enough bibliographic information to support a later consolidated **References** page. The exact citation style can be settled when Evaluation's literature review takes shape, but source attribution should be collected during drafting, not retrofitted.

References may eventually live under an **Appendices** navigation folder with Glossary and technical notes; for now, this remains an open information-architecture decision.

## 13. Redrafting and review workflow

For each section, work from the latest Word material, the Markdown manuscript and any relevant diagrams. Treat neither as automatically authoritative when they disagree.

Review in this order:

1. **Argument and placement:** What does this passage establish, and is this the right place for it? What belongs in a later section?
2. **Completeness:** Are definitions, transitions or critical reasoning steps missing?
3. **Mathematical accuracy:** Verify the formulae and examples independently; check the rendered equations, not only extracted text.
4. **Visual explanation:** Preserve useful diagrams and identify missing static or interactive illustrations.
5. **Prose:** Apply the voice, terminology, brevity and accessibility conventions.
6. **Publishing:** Check captions, named disclosures, references, navigation and rendering.

Avoid polishing passages that should be moved or removed. Editorial consistency is a whole-document responsibility: changes to a definition or example may require adjustments to later sections.

### Final approval checklist

A revised page should pass the following tests:

- Can a motivated non-specialist follow the core argument without opening supplementary algebra?
- Could a technically trained reader verify each significant derivation?
- Are premises clearly introduced, then used confidently rather than continually requalified?
- Is every major idea introduced in its best location, with minimal duplication?
- Are Vote Share, Mandate, Mandate Share, quotas and actual seats kept distinct?
- Are all numerical examples and diagrams consistent with the equations?
- Does each figure contribute a clear insight and have a caption?
- Are the next conceptual step and the page-to-page navigation obvious?
- Can the Markdown stand alone, while also supporting richer presentation on the website?
- Are claims drawn from outside research properly attributable?

**The aim is one coherent argument, readable at more than one level of mathematical depth, with the author's political reasoning made clear and open to examination.**
