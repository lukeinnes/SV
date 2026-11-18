# Strengthened Voting — Editorial Style Guide

*Version 0.2 · Working conventions for drafting, reviewing and publishing the SV Explanation.*

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
   - **2.1 From Votes to Seats**
   - **2.2 The Mandate Equation**
   - **2.3 The Mandate Coefficient**
   - **2.4 Implementation**
3. **Analysis**
4. **Evaluation**
5. **Glossary**

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

## 8. Equations, figures and references

### Equation numbering

**Number only a small number of important equations.** A number is useful where an equation defines a central quantity, establishes a major result or will be cited repeatedly.

Candidates include the Mandate Equation, Mandate Share, Upper and Lower Bounds, the Innes Constant calibration condition and the Sainte-Laguë rule. Intermediate calculations should ordinarily remain unnumbered.

Prefer **named references**, supplemented by numbers where helpful: “the Upper Bound of Power (Equation …)”. Give important equations stable semantic identifiers; the website should eventually generate displayed numbers and cross-references. Avoid hard-coding page-dependent equation numbers into manuscript prose.

### Figures and interactive content

**Every substantive graph, diagram and illustration should have a caption and stable identifier.** Small displayed mathematical arrow expressions need not be numbered as separate figures.

Every figure must serve an explanatory purpose. Introduce what to look for, and explain what the reader should notice. Prefer continuity of axes, colours, scales and layout when progressively revealing Election Lines and the Bounds of Power.

For important figures, retain a readable static **SVG or PNG** in Markdown, a concise caption, meaningful alternative text, clear axes and units, and a stable identifier. Provide an interactive Svelte equivalent where interaction genuinely improves understanding.

The static figure must communicate the essential result without interaction. Do not replace it with only a placeholder promising a future interactive figure. Number figures separately from equations and tables; generate numbering through the website when practical.

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

For each page, compare the latest Word draft, Markdown manuscript, style guide and relevant diagrams. Neither manuscript is automatically authoritative when they disagree.

Review in this order:

1. **Purpose and placement:** What must this passage establish, and what belongs later?
2. **Completeness:** Which necessary definitions, transitions or steps are missing?
3. **Mathematics:** Verify formulae and computed values; inspect rendered equations.
4. **Visuals:** Preserve useful diagrams and remove redundant presentations.
5. **Prose:** Apply the voice, capitalisation, terminology and clarity conventions.
6. **Publishing:** Check disclosures, figures, captions, navigation, links and rendering.

Before approval, check that the main argument is accessible without hidden proofs; its mathematics is verifiable; its premises are clear and not repeatedly requalified; its symbols distinguish Raw Votes, eligible Vote Share, Mandate, Mandate Share and seats; its examples are internally consistent; its visuals add real explanatory value; and its conclusion leads naturally to the next page.

**Overall principle:** produce one coherent, persuasive argument, readable at more than one level of mathematical depth, with its premises transparent and its mathematics open to scrutiny.
