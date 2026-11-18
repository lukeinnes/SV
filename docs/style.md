# Strengthened Voting — Editorial Style Guide

*Version 0.3 · Working conventions for drafting, reviewing and publishing the SV Explanation.*

## 1. Purpose and editorial philosophy

The Explanation presents **Strengthened Voting (SV)** as a reasoned political proposal developed into a mathematical electoral system. It should be persuasive without disguising its premises, and mathematically rigorous without demanding advanced mathematics from every reader.

The audience includes the **motivated layperson**, who wants to understand the argument and its significance, and the **academic reader**, who wants to scrutinise the assumptions and verify the mathematics.

**Guiding principle:** explain the intuition, establish the premise or definition, derive the result, and explain what it means.

The main argument must be understandable without opening supplementary algebra. That algebra must nevertheless remain available for independent verification.

### Advocacy and intellectual honesty

Derivation advocates SV as the author's preferred proposal. It need **not** repeat a caveat about its premises at every mathematical step. Introduce and justify each premise clearly, then develop its consequences confidently.

A short statement near the beginning of Derivation should explain that its mathematical conclusions follow from premises established throughout, while those premises are normative judgements open to criticism in Evaluation.

Distinguish these kinds of statements:

| Claim | Appropriate treatment |
| --- | --- |
| **Definition** | “We define…”; specify the meaning of a quantity |
| **Normative premise** | “SV proposes…”; explain why the principle is advocated |
| **Modelling assumption** | “We model this as…”; identify the mathematical choice |
| **Mathematical deduction** | “It follows that…”; state the consequence confidently |
| **Worked example** | “Consider…”; state the conditions of the example |
| **Behavioural prediction** | “This may encourage…”; identify assumptions about voters or parties |
| **Empirical claim** | Support it with relevant evidence |

Do not portray a modelling choice as mathematically inevitable, or a thought experiment as empirical evidence. Equally, do not repeatedly weaken a valid deduction merely because it follows from an openly stated political premise. Systematic objections, alternative premises and the literature review belong primarily in **Evaluation**.

## 2. Organisation of the Explanation

The planned navigation is:

1. **Voting Systems**
2. **Derivation** (navigation folder)
   - **From Votes to Seats**
   - **The Mandate Equation**
   - **The Mandate Coefficient**
   - **Implementation**
3. **Analysis**
4. **Evaluation**
5. **Glossary**

The files may carry ordering prefixes such as `2.1)` and `2.2)` for editorial organisation, **without requiring those numbers in the reader-facing headings**. However, the major-section order (1, 2, 3, etc.) provides the numbering prefix for equations, figures and tables.

Derivation contains **four webpages**, not an additional introductory page at folder level. **Implementation is one webpage.** Its final subsection, “The Complete SV Process”, also concludes Derivation.

Analysis and Evaluation remain single webpages provisionally; either may be divided later if its content calls for it. The Glossary is presently a top-level entry. An **Appendices** folder containing Glossary, References and technical notes is a possibility, **not a settled change**.

### Responsibilities of the sections

- **Voting Systems:** the electoral problem, rival approaches and objectives motivating SV.
- **Derivation:** the premises, equations, calibration and practical rules specifying SV.
- **Analysis:** what the model does and what conditional incentives emerge, including merger premiums, consolidation and differentiation.
- **Evaluation:** whether the resulting properties are desirable, institutional choices, alternatives and relevant research.
- **Glossary:** definitions and notation for reference, not a substitute for explaining them at first use.

**One idea should have one principal home.** Before developing a passage, look ahead to later sections. A short forward reference is often preferable to prematurely introducing an idea and then repeating it.

## 3. Narrative voice and prose

Use **British English**, normally in the present tense, with an active, direct, explanatory voice.

Use **“we”** to guide the reader through reasoning: “We can now examine…”. Use **“SV proposes”** for political commitments. Use direct statements for established deductions: “The Upper Bound increases…”. Avoid repeatedly referring to **“the author”** in the third person.

The manuscript may advocate a position without pretending that the reader already agrees. Prefer economical but complete sentences, precise verbs and clear transitions. Avoid repetitive rhetorical questions, unnecessary hedging and prose that merely reads a displayed equation aloud.

### Capitalisation: Party and party

Use **Party** when identifying a particular entity: **Party A**, **Party U**, **Party $i$**, **Party 1**.

Use **party** in the generic sense: “a political party”, “three parties”, “the largest party”, “the party's Mandate”. Do not capitalise an ordinary reference solely because the party is identifiable from context.

Capitalise the formal names of defined SV quantities where used as terms: **Raw Votes, Vote Share, Political Mandate, Mandate Share, Marginal Vote Strength, Mandate Coefficient, Innes Constant, Seat Quota, Seat Share, Advantage Ratio** and **Apportionment Ratio**. Use normal lower case for ordinary descriptive meanings.

### Useful political language

Retain **“winner-takes-all dynamic”** when explaining FPTP **within each constituency**. It provides a useful contrast with the increasingly concentrated Mandate Share produced by a very large $k$.

A very large $k$ can produce **winner-takes-most or winner-takes-all-like** Mandate outcomes. Do not suggest SV literally becomes FPTP, which also depends on constituency geography.

## 4. Structure and placement of arguments

Where useful, progress through **intuition → definition or premise → mathematics → result → interpretation**. This is a guide, not a rigid template.

Introduce important equations with the question they answer. Follow a result with its significance, not just a verbal repetition of its symbols.

Use worked elections to make abstract relationships tangible. Keep the same example across related subsections when continuity helps; change it when a different case reveals a new property.

Before adding material, ask whether it belongs **here** or in a later subsection, Analysis or Evaluation. Once an idea is established, provide a short reminder and a cross-reference rather than a second full explanation.

### Ending a webpage

End each page with a **natural synthesis or transition**, perhaps ending in a question that motivates the next page. **Do not require a heading called “What we have established”.** A longer page may warrant a descriptive conclusion heading; a short page may flow naturally into its final paragraph.

Do not mechanically repeat every subsection in a closing summary.

Place website navigation beneath the ending:

**← Previous: [page title] · Next: [page title] →**

At the end of Implementation, the next destination is Analysis. The website should eventually generate these links, rather than each manuscript maintaining its own URLs.

## 5. Mathematics and expandable workings

The main narrative must contain the **essential equations** and the reasoning necessary to understand their purpose. It must be followable without opening technical details.

Put lengthy integrations, differential-equation solutions, Taylor expansions and auxiliary proofs into expandable sections. These are rigorous parts of the manuscript, not disposable notes.

Each disclosure should have a **descriptive title**, such as “Show the differential-equation solution” or “Derive the opposition limit”; present complete and checkable workings; and close before the main narrative resumes with the result.

The Word draft used a Heading 5 “+Expand to see breakdown” and an empty Heading 5 to delimit these passages. This was an **intentional convention**. Markdown should use explicit opening and closing markup, not empty headings.

A possible portable convention is `<details>` with a `<summary>` title. **Test mathematics inside such disclosures in VS Code, GitHub and the website before standardising it.** If necessary, the Svelte publishing pipeline should provide an equivalent component. Never discard hidden workings when converting the manuscript.

Number an intermediate equation within a long derivation **when a later step needs to refer to or substitute it**. Such a reference does not automatically make the equation a named or boxed principal result. Avoid numbering every trivial algebraic line.

## 6. Mathematical notation and economy

Keep one consistent symbol and formal name for each quantity. The Glossary is the main reference, but symbols should be explained at first use.

### Generic variables and indexed quantities

Use **$x$** for a generic Vote Share, a graph variable or a derivation focused on one representative party. Use **$x_i$** for the Vote Share of **Party $i$** or when comparing multiple parties.

Likewise, use **$f$** for generic Mandate Share and **$f_i$** for the share of a specified party. Use **$f(x)$** for a curve where its other parameters are fixed, and **$f_{\min}(x;k)$** or **$f_{\max}(x;k)$** when the dependence on both parameters matters.

Do not add subscripts and function arguments reflexively. Use enough notation to remove ambiguity, and no more.

### Function notation and the Mandate Equation

Use **$M(x)$** when defining or investigating Mandate *as a function* of Vote Share. Use **$M_i=M(x_i)$** when applying that function to Party $i$. Thereafter **$M_i$** usually suffices.

For example:

$$
M(x)=A(e^{kx}-1)
$$

and

$$
M_i=A(e^{kx_i}-1).
$$

An unindexed $M$ may refer to the Mandate of one clearly identified party, but must not be confused with **Total Mandate**, $\Sigma M$. Use lowercase $m(x)$ only for the initial unscaled Mandate; explain its transition to the scaled $M(x)$.

### Raw Votes, Vote Share and Electoral Threshold

Use **Raw Votes**, $v_i$, for valid votes cast for Party $i$ before thresholding and normalisation. For constituency Raw Votes use **$v_{i,c}$**, where $c$ indexes constituencies; $i,j$ index parties.

Use **Vote Share**, $x_i$, for the **normalised input** to the electoral calculation. Distinguish this from a party's share of *all* original valid party votes when thresholding changes the denominator.

With no threshold, define:

$$
x_i=\frac{v_i}{\sum_jv_j}.
$$

With an Electoral Threshold, determine eligibility **against the original valid vote total** $V=\sum_jv_j$. Keep $\tau$ as a proportion, and define:

$$
\mathcal E=\{i:v_i\geq\tau V\}.
$$

The same threshold expressed in **Raw Votes** is $\tau V$. For eligible parties, renormalise:

$$
x_i=\frac{v_i}{\sum_{j\in\mathcal E}v_j},\qquad i\in\mathcal E.
$$

Eligible Vote Shares sum to one. **Do not apply the threshold a second time to the renormalised shares.**

**SV applies its nonlinear Mandate Equation to the post-threshold, renormalised Vote Shares.** Do not calculate Mandates using original unfiltered shares and merely remove ineligible Mandates afterwards: the results generally differ.

Discuss the rationale, strategic consequences and effects on the Bounds and calibration in **Implementation: Electoral Threshold**. A brief introduction suffices in **From Votes to Seats**.

Distinguish spoilt or invalid ballots from valid votes for parties below the threshold; they do not necessarily enter the original vote total in the same way.

### Other quantities and apportionment

- $S$: total legislature size; $s_i$: integer seats awarded to Party $i$.
- $f_i$: Mandate Share before integer apportionment.
- $q_i=Sf_i$: Seat Quota, **introduced only where useful**, especially in Implementation.
- $N$: number of seats awarded so far in a sequential illustration, distinct from final $S$.
- $R_i=M_i/(2s_i+1)$: the **Seat Priority Score** for Sainte-Laguë, preferred over $P_i$.

**Seat Quota is not a mandatory intermediary** in introductory transformations. An apportionment rule may convert Mandate Share directly into integer seats; Sainte-Laguë can be implemented sequentially.

Distinguish a continuous majority of Mandate Share from a majority of actual whole seats.

### Exact equality and numerical approximation

Use **$=$** for an exact equality and **$\approx$** for a rounded or truncated numerical value.

$$
x_*=1-\frac{1}{\sqrt2}\approx0.292893
$$

$$
\Lambda\approx5.33684511056.
$$

**Do not routinely add an ellipsis after an approximation:** $\approx5.3368$ already indicates an approximate value. Avoid $=5.3368\ldots$ as the standard way of reporting a numerically solved root.

Use ellipses for continuing sequences, such as $1,3,5,7,\ldots$, or when the decimal expansion itself is being discussed. Where an exact expression is illuminating, state it before the approximation, as in $10\ln2\approx6.9315$. Keep decimal precision consistent within numerical tables.

## 7. Transformation diagrams: quantities and processes

**Every node represents a measurable, defined quantity; every arrow represents the process, operation or equation converting one quantity into another.**

Do not place “Threshold”, “Normalisation”, “Apportionment” or “Constituency plurality” in nodes: these are operations and belong on **arrows**.

The conceptual SV chain is:

$$
v_i
\xrightarrow{\text{Threshold and normalisation}}
x_i
\xrightarrow{\text{Mandate Equation}}
M_i
\xrightarrow{\text{Normalisation}}
f_i
\xrightarrow{\text{Apportionment}}
s_i.
$$

“Normalisation” may occur on two arrows because it describes distinct operations: producing eligible Vote Share from Raw Votes, then producing Mandate Share from party Mandates. Explain these in the adjacent prose.

**Do not insert Seat Quota solely because it is later useful in deriving an apportionment rule.** For FPTP, constituency Raw Votes become seats by constituency plurality and tallying.

Do **not** include a composite figure merely to repeat several adjacent transformation diagrams. A new figure must communicate something additional.

## 8. Equations, figures, tables and cross-references

### Three classes of mathematical expression

The display treatment depends on **what the expression is doing in the argument**:

| Class | Name shown above? | Boxed? | Numbered? | Use |
| --- | --- | --- | --- | --- |
| **Principal equation** | **Yes** | **Yes** | **Yes** | Central definition or major result likely to recur |
| **Referenced supporting equation** | No separate title required | No | **Yes** | Intermediate result needed for an explicit substitution or later calculation |
| **Ordinary working** | No | No | No | Algebraic steps that can be followed without formal cross-reference |

**Boxing, naming and numbering go together for principal equations.** But **numbering does not require boxing or naming**: intermediate equations may receive numbers when a lengthy derivation becomes clearer through precise references. Do not elevate those steps into principal results merely to cite them.

A principal equation should have its **descriptive name visibly introduced at the point where it appears**, ideally on a short bold line above the equation, without creating a Markdown heading or a table-of-contents entry. For example:

**Normalised Vote Share**

$$
\boxed{x_i=\frac{v_i}{\sum_{j\in\mathcal E}v_j}}\qquad(i\in\mathcal E)\tag{2.1}
$$

The accompanying prose must explain its symbols and purpose. Later references can call it **the Normalised Vote Share equation (2.1)**. The name need not be printed a second time as a caption below the equation.

A numbered supporting equation may have only its formula and reference number, without a bold name or a box. For example, a calculation may refer back to **equation (2.4)** before substituting it into **equation (2.6)**. Unnumbered working remains the norm.

### When and how to reference equations

**Not every numbered equation must be mentioned by number in the surrounding prose.** Numbering makes important results available for reference when a later passage needs them; do not manufacture references just to justify a number.

When referring to a principal equation, prefer its **name and number**: “the Mandate Share equation (2.7)”. When referring to an unnamed supporting equation, a numerical reference alone is fine: “substituting equation (2.5) into equation (2.6)”.

Numbering an equation must serve a real navigation or derivational purpose. Review occasional numbered steps that are never referenced and consider leaving them unnumbered.

### Numbering across major sections, not webpages

Number equations, figures and tables in **three independent sequences**. Each sequence is continuous within a major part of the Explanation, and **does not restart on a new webpage or subsection**.

Examples:

- **Equation (2.1)** in *From Votes to Seats* can be followed by **Equation (2.2)** in *The Mandate Equation*.
- **Figure 2.1** can be the first figure in *The Mandate Equation*, even if *From Votes to Seats* contains no figures.
- **Table 2.1** can appear on yet another Derivation webpage without affecting equation or figure numbering.
- If Voting Systems has no figures, there is no requirement to invent a Figure 1.1: the first figure in the entire Explanation may legitimately be **Figure 2.1**.

The **first digit denotes the major section** (1 Voting Systems, 2 Derivation, 3 Analysis, 4 Evaluation), while the second counts that kind of object **throughout the section**. The section numbering is an editorial and reference convention, whether or not numbers appear in the published headings.

Use **Equation (2.1)** or **equation (2.1)** in prose, **Figure 2.1**, and **Table 2.1**. Equation numbers conventionally appear in parentheses beside the formula; figure and table labels do not put their numbers in parentheses.

For now, explicit `\tag{2.1}` labels can be used in Markdown when supported by the chosen maths renderer. Confirm rendering in VS Code, GitHub and the website. In the long term, generate numbering and references automatically to avoid renumbering by hand.

### Stable source identifiers

Give each **numbered equation** a persistent semantic identifier in a source comment. Give a **principal** equation its descriptive name in a comment as well as in the visible text. For example:

```md
<!-- equation-id: normalised-vote-share -->
<!-- equation-name: Normalised Vote Share -->

**Normalised Vote Share**

$$
\boxed{x_i=\frac{v_i}{\sum_{j\in\mathcal E}v_j}}\qquad(i\in\mathcal E)\tag{2.1}
$$
```

An intermediate numbered expression needs an `equation-id` but not necessarily an `equation-name`. The comments are **metadata conventions**, not functioning hyperlinks on their own; the website can later turn them into anchors and dynamic cross-references.

Stable identifiers should outlive visible numbering changes. The manuscript's important equations should be easy to find by **name**, not just by number.

### Figures, diagrams and interactive content

**Every substantive graph, diagram or illustration should have a descriptive, visibly numbered caption**, together with a stable figure identifier. The numbering follows the **major-section sequence** described above. Tiny decorative graphics and ordinary mathematical arrow expressions need not become separate numbered figures.

A figure must explain something beyond the adjacent text. Introduce what the reader should look for, then interpret the result. Preserve visual continuity across related graphs, including axes, colours and scales, while revealing new information such as Election Lines, the Upper Bound, the Lower Bound and the Majority-Vote Boundary.

For important figures retain:

- A readable static **SVG** (preferred for mathematical diagrams) or **PNG** in the Markdown.
- A descriptive caption, numbered **Figure 2.1 — …** where appropriate.
- Meaningful alternative text and clear labels, axes, units and parameters.
- A stable semantic identifier, for example `mandate-convexity`.
- An interactive Svelte version when interaction genuinely improves comprehension.

The static image must communicate the essential result without interaction. Do not leave a figure as only a placeholder comment once a suitable static image is available.

An illustration's semantic identifier is stable even if its visible number changes. The website may eventually generate captions and numbering automatically.

### Figure storage and relative Markdown paths

Keep the shared figure library at:

```text
docs/
  style.md
  explanation/
    figures/
      2.2-convexity.svg
      2.2-strength-and-mandate.svg
    2) Derivation/
      2.1) From Votes to Seats.md
      2.2) The Mandate Equation.md
```

A Markdown document within `docs/explanation/2) Derivation/` therefore references the common figures folder through **`../figures/`**, not `./figures/`:

```md
<!-- figure-id: mandate-convexity -->

![Illustrative convex Mandate functions](../figures/2.2-convexity.svg)

*Figure 2.1 — Illustrative convex Mandate functions.*
```

In filenames, an optional prefix such as `2.2-` is a **storage and editorial identifier**, not the displayed figure number. Figure numbering is continuous across Derivation, irrespective of which page stores the figure reference. Do not duplicate a shared figure merely because another page refers to it.

The website's asset handling may require path conversion; its published asset URLs must not be confused with manuscript-relative filesystem links.

### Tables

Give substantive tables descriptive captions numbered **Table 2.1 — …**, in their own sequence. Small layout tables or temporary scratch calculations need not become published numbered tables. Introduce and interpret meaningful tables just as for figures. Do not present the same data in both a nearby graph and a table unless the combination supplies useful additional detail.

## 9. Worked examples and verification

Use hypothetical elections deliberately. State Vote Shares, $k$, legislature size, threshold assumptions and whether outputs are continuous or integer-valued. Distinguish illustrative $k$ values from the reference Innes Constant $\Lambda$.

Reuse an example across related arguments when helpful; change it only to establish a genuinely new insight. Independently verify numerical tables, captions, graph coordinates and seat allocations against the governing equations, including totals and rounding.

When comparing Word and Markdown, inspect **rendered Word equations** before alleging algebraic mistakes: extraction may obscure superscripts, subscripts, fractions and symbols. Distinguish transcription errors from mathematical errors.

## 10. Mathematical connections and the silver ratio

Include mathematical connections that make the argument memorable or invite investigation. The appearance of the **silver ratio** is worth identifying, even though naming the constant is not necessary to complete the SV derivation.

Explain that its appearance follows from the proposed **pairwise-encounter majority criterion**, not that the existence of a named constant independently proves the political premise. Once the premise has been justified, continue confidently rather than continually qualifying its consequences.

Put extensive identities, geometric curiosities and auxiliary constructions into optional material when they would interrupt the main argument.

## 11. Website-aware writing and navigation

Write manuscripts as coherent essays suitable for webpage publication. Website design should **inform** content organisation without dictating the argument.

Each webpage needs a clear purpose, logical subsections and a natural concluding transition. Use a persistent contents panel where appropriate on large screens, with an accessible equivalent on mobile, to show both the overall journey and the reader's position within a page.

Use descriptive headings and stable anchors. Support a reader arriving through a direct link with concise reminders and links, not repeated derivations.

Maintain the Explanation in **Markdown**, using `$...$` for inline maths and `$$...$$` for displayed maths. Embed static illustrations through relative paths and use Svelte components to enhance interactivity, disclosures, navigation and cross-references.

Do not maintain divergent Word and Markdown “final” manuscripts. Word may remain useful for exploratory drafting and sketches.

## 12. Citations and references

Cite empirical political claims, historical facts, established electoral methods and consequential external research. Do not clutter self-contained elementary algebra with unnecessary references.

Distinguish SV's original arguments from established electoral literature. Evaluation should engage with objections and alternative approaches, not just supportive work. Collect bibliographic details as sections are drafted, even before deciding whether a References page belongs under a future Appendices folder.

## 13. Redrafting workflow and final checks

For each page, compare the **latest committed manuscript**, the latest Word draft, the style guide and relevant diagrams. Neither Word nor earlier Markdown drafts automatically override the current version.

When revising an **existing** draft, use a two-pass editorial workflow:

1. **Editorial review:** identify individual, text-anchored proposed changes, grouped into manageable batches. For each, show the existing passage, the proposed wording or structural action, and the reason. Give the user the ability to **accept, reject or modify** the proposal. Separate essential corrections from optional stylistic choices. Identify strong passages to retain.
2. **Consolidation:** after the substantive decisions have been reviewed, apply only the approved changes, perform a light consistency check, and provide the complete revised Markdown and, when helpful, a **unified diff** showing what changed.

For a genuinely **new** section without an existing draft, prepare a full draft rather than inventing an unnecessary change list.

Within either workflow, review in this order:

1. **Purpose and placement:** What must this passage establish, and what belongs later?
2. **Completeness:** Which necessary definitions, transitions or steps are missing?
3. **Mathematics:** Verify formulae and computed values; inspect rendered equations.
4. **Visuals:** Preserve useful diagrams and remove redundant presentations.
5. **Prose:** Apply the voice, capitalisation, terminology and clarity conventions.
6. **Publishing:** Check disclosures, named equations, captions, navigation, links and rendering.

Do not polish passages that should be moved or cut. Preserve the original author's deliberate choices unless there is a reason to propose changing them.

**Repository control:** generate files and suggested patches for local review. **Do not commit or push changes to GitHub unless the user explicitly requests it.**

Before approval, check that the main argument is accessible without hidden proofs; its mathematics is verifiable; its premises are clear and not repeatedly requalified; its symbols distinguish Raw Votes, eligible Vote Share, Mandate, Mandate Share and seats; its examples are internally consistent; its visualisations add explanatory value; its references follow the major-section numbering rule; and its conclusion leads naturally to the next page.

**Overall principle:** produce one coherent, persuasive argument, readable at more than one level of mathematical depth, with its premises transparent and its mathematics open to scrutiny.
