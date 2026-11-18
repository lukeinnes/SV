# Derivation of Strengthened Voting

*Working manuscript — mathematical foundations, calibration and implementation.*

Strengthened Voting (SV) proposes that legislative representation should recognise not only how many voters support a political position, but also the achievement of bringing different voters into a common political agreement. This derivation develops that principle into a mathematical model, establishes a reference value for its main parameter, and explains how its continuous results can be translated into whole legislative seats.

The mathematical conclusions follow from the premises stated here; the premises themselves are political judgements. Whether they are desirable, and how SV compares with other electoral systems, are questions for [Evaluation](/explanation/evaluation).

## 1. From Votes to Seats

Every electoral system must convert votes into representatives, but the rules connecting those quantities differ considerably. We begin with a simplified comparison of three approaches.

### First-Past-the-Post

In First-Past-the-Post (FPTP), each constituency elects one representative. The candidate with the most votes wins that constituency's seat, whether or not they receive an absolute majority.

If $v_{i,d}$ denotes the votes for party $i$ in constituency $d$, and $s_i$ the total seats won by that party, the broad process is:

**Constituency votes → Constituency winners → Seats**

$$
v_{i,d}\longrightarrow s_i
$$

The geographical distribution of votes is therefore essential: national vote totals alone cannot determine the seats a party wins.

### Proportional Representation

Under direct party-list Proportional Representation (PR), parties receive seats in proportion to their votes, subject to the practical rules of the system.

Let $v_i$ be the votes won by party $i$. We define its **Vote Share**, $x_i$, as:

$$
\boxed{x_i=\frac{v_i}{\sum_j v_j}}
$$

Vote Shares are expressed as fractions between zero and one and sum to one. In a legislature of $S$ seats, a directly proportional allocation would give party $i$ an ideal entitlement of $Sx_i$ seats. Since seats are indivisible, a rounding or apportionment rule is needed to produce whole numbers. Electoral thresholds can further modify which parties are eligible.

**Votes → Vote Share → Seat allocation**

$$
v_i\longrightarrow x_i\longrightarrow s_i
$$

### Strengthened Voting

SV adds an intermediate measure called **Political Mandate**, $M_i$. A party earns Mandate according to its Vote Share, and its proportion of the total Mandate determines the share of the legislature that SV intends it to receive.

We call this proportion **Mandate Share**, $f_i$.

**Votes → Vote Share → Political Mandate → Mandate Share → Seats**

$$
v_i\longrightarrow x_i\longrightarrow M_i\longrightarrow f_i\longrightarrow s_i
$$

The central question is how Political Mandate should be calculated. We turn first to the political principle motivating that additional step.

---

## 2. The Mandate Equation

### Political Agreement

A political party brings people with different beliefs, priorities and interests into support for a common programme. Its supporters need not agree about everything. Rather, they have reconciled enough of their differences to advance a shared political position.

SV proposes that broadening an existing agreement is a political achievement worth recognising. Adding voters to a large, established coalition is not treated as identical to adding the same number of voters to a small one: the larger agreement encompasses more competing preferences and commitments.

This is a normative premise, not a claim that large parties are necessarily wiser, more legitimate or better governed. SV seeks to reward the breadth of an *agreed* political programme, while preserving the electoral contribution of each individual voter.

### Convexity and Marginal Vote Strength

Let $m(x)$ denote a party's Mandate before choosing any numerical scale. We require $m(0)=0$ and propose that Mandate should increase both with Vote Share and at an increasing marginal rate. Mathematically, this means a strictly increasing, **convex** function.

<!-- FIGURE: Compare a linear relationship with several convex Mandate curves. Emphasise that convexity expresses the proposed strengthening principle but does not determine a unique formula. -->

The additional Mandate earned from a small increase in Vote Share is the function's slope. We call it **marginal Vote Strength**, $\omega(x)$:

$$
\boxed{\omega(x)=\frac{dm}{dx}}
$$

Accumulated Mandate is the area beneath this marginal-strength curve:

$$
\boxed{m(x)=\int_0^x\omega(t)\,dt}
$$

A linear Mandate function would have constant marginal Vote Strength. SV instead proposes that marginal Strength grows with the agreement already accumulated.

### Proportional Strengthening

Consider the additional support a party receives as its Vote Share grows. SV models its marginal contribution as consisting of two parts: a baseline contribution from the new support itself, and a further contribution proportional to the Mandate already accumulated by the party.

We express that assumption as:

$$
\boxed{\omega(x)=a+b\,m(x)}
$$

Here $a>0$ measures baseline marginal support, while $b>0$ controls the additional strengthening associated with existing Mandate. As $m(0)=0$, the initial marginal Strength is $\omega(0)=a$.

Combining this assumption with the definition of marginal Vote Strength gives:

$$
\frac{dm}{dx}=a+bm
$$

Solving the differential equation subject to $m(0)=0$:

$$
\boxed{m(x)=\frac ab\left(e^{bx}-1\right)}
$$

<!-- EXPANDABLE MATHEMATICS: Show the integrating-factor or separation-of-variables solution of dm/dx = a + bm. -->

The common factor $a/b$ only changes the units in which Mandate is measured. It has no effect on each party's share of the total. We may therefore choose units in which $a/b=1$, and rename $b$ as the **Mandate Coefficient**, $k$.

This produces the unscaled **Mandate Equation**:

$$
\boxed{m(x)=e^{kx}-1},\qquad k>0
$$

Its derivative is $\omega(x)=ke^{kx}$, so:

$$
\boxed{\frac{d\omega}{dx}=k\omega}
$$

Marginal Vote Strength grows in proportion to its existing value. This is the compounding property that gives the equation its exponential form.

<!-- INTERACTIVE FIGURE: Two synchronised panels show marginal Vote Strength omega(x) and accumulated Mandate m(x), with a shared Vote Share slider. Shade the area beneath omega up to x; this equals m(x). Include a linear comparison and keep units consistent. -->

This derivation identifies an exponential function **given the proposed proportional-strengthening assumption**. It does not establish that all reasonable political theories must produce this particular equation.

### Choosing a Mandate Scale

Absolute Mandate points can be expressed in any convenient units. To make results easier to interpret, SV adopts a common scaling coefficient $A$, chosen so that a party receiving exactly 50% of the vote earns 1,000 Mandate points:

$$
M(x)=A(e^{kx}-1),\qquad M(0.5)=1000
$$

Consequently:

$$
\boxed{A=\frac{1000}{e^{k/2}-1}}
$$

The scaled Mandate Equation becomes:

$$
\boxed{M(x)=1000\frac{e^{kx}-1}{e^{k/2}-1}}
$$

This normalisation holds for every positive $k$; it does not alter the relative Mandates of parties.

### Mandate Share

The **Total Mandate**, $\Sigma M$, is the sum earned by all participating parties:

$$
\Sigma M=\sum_jM_j
$$

A party's **Mandate Share** is its Mandate as a proportion of that total:

$$
\boxed{f_i=\frac{M_i}{\Sigma M}}
$$

In words:

$$
\boxed{\text{Mandate Share}=\frac{\text{Party Mandate}}{\text{Total Mandate}}}
$$

Mandate Share is SV's intended proportion of legislative seats *before* eligibility rules and the allocation of whole seats. We use $f$ to denote this continuous quantity, while referring to the resulting political implications as the distribution of legislative power.

### A Worked Election

Consider five parties with Vote Shares of 40%, 30%, 15%, 10% and 5%. For now, choose the illustrative coefficient $k=3$; we have not yet calibrated its default value.

| Party | Vote Share $x_i$ | Political Mandate $M_i$ | Mandate Share $f_i$ |
|---|---:|---:|---:|
| A | 40% | 666.38 | 47.74% |
| B | 30% | 419.22 | 30.03% |
| C | 15% | 163.23 | 11.69% |
| D | 10% | 100.49 | 7.20% |
| E | 5% | 46.48 | 3.33% |
| **Total** | **100%** | **1,395.80** | **100%** |

Although A wins 40% of votes, it earns approximately 47.74% of Mandate Share. The advantage reflects both A's own size and the distribution of support among its opponents.

<!-- INTERACTIVE FIGURE: Show this five-party election alongside the Mandate curve. Vary k and update party Mandates, Total Mandate and Mandate Shares. Keep M(0.5) = 1000 at every setting; do not introduce integer seats yet. -->

The Mandate Equation and the rule for Mandate Share are now established. What remains undetermined is the coefficient $k$, which controls how strongly SV rewards larger political agreements.

---
## 3. The Mandate Coefficient

### What Does $k$ Change?

The Mandate Coefficient determines how quickly marginal Vote Strength increases with Vote Share. A small $k$ produces modest strengthening; a large $k$ strongly rewards parties that bring many voters into one agreement.

For positive $k$, Mandate remains strictly increasing and convex. At the limiting case $k\to0^+$, however, the exponential has an approximately linear form:

$$
e^{kx}-1\sim kx
$$

Consequently:

$$
\boxed{\lim_{k\to0^+}f_i=x_i}
$$

The continuous allocation approaches direct PR. As $k$ increases, the largest parties generally earn a greater Mandate Share, although their exact results continue to depend on how the remaining votes are distributed.

<!-- FIGURE: A family of Mandate curves for representative values of k, all normalised at M(0.5) = 1000. Accompany with a fixed multi-party election showing how its Mandate Shares change. -->

The key distinction is that $k$ affects both the Mandate earned by a party and the total earned by its opponents. To understand the possible range of outcomes, we must examine the distribution of Mandate across an entire election.

### The Bounds of Power

#### Election Lines

For a fixed $k$, a party's Mandate Share is:

$$
f_i=\frac{M(x_i)}{\Sigma M}
$$

Every party in the same election is evaluated using the same Total Mandate, $\Sigma M$. If we plot Mandate Share $f$ against Vote Share $x$, we therefore obtain a curve for each possible Total Mandate:

$$
\boxed{f(x)=\frac{M(x)}{\Sigma M}}
$$

We call these curves **Election Lines**. An election's parties all lie on its particular Election Line, although not every point on the extended line represents a feasible party distribution.

Because the Mandate function is convex, concentrating votes among fewer, larger parties increases Total Mandate. A larger denominator places the corresponding Election Line lower on the graph. A fragmented election has less Total Mandate and a higher Election Line.

<!-- FIGURE: Election Lines for several Total Mandates at fixed k. Show an example of party points lying on a single line, and distinguish mathematical extensions of the curves from feasible results. -->

Two parties with the same Vote Share can therefore receive different Mandate Shares in different elections. This dependence on the surrounding party system is one of SV's central properties.

#### Opposition Mandate

Consider one party with Vote Share $x$ and Mandate $M(x)$. Let **Opposition Mandate**, $O$, be the combined Mandate earned by all its opponents:

$$
O=\sum_{j\ne i}M_j
$$

The party's Mandate Share is:

$$
\boxed{f=\frac{M(x)}{M(x)+O}}
$$

For a fixed Vote Share, its own Mandate is fixed. Its Mandate Share is therefore largest when Opposition Mandate is smallest, and smallest when Opposition Mandate is largest.

#### Upper Bound: Maximally Divided Opposition

Suppose a party receives 30% of the vote and $k=5$. The remaining 70% could form one opposition party, or be divided into increasingly many smaller ones.

| Equal opposition parties | Vote Share per opponent | Mandate Share of the 30% party |
|---:|---:|---:|
| 1 | 70.0% | 9.78% |
| 2 | 35.0% | 26.80% |
| 3 | 23.3% | 34.42% |
| 5 | 14.0% | 40.72% |
| 10 | 7.0% | 45.38% |
| 20 | 3.5% | 47.65% |
| 100 | 0.7% | 49.43% |
| Approaching infinitely many | Approaching 0% | **49.87%** |

*These are continuous theoretical results, without electoral thresholds or whole-seat apportionment.*

<!-- INTERACTIVE FIGURE: Hold the focal party at x = 0.30 and k = 5. Let readers increase the number of equal opposition parties, updating Opposition Mandate and the focal party's Mandate Share. Show the convergence towards the upper bound. -->

As the opposition becomes more fragmented, its combined Mandate decreases. But it never falls to zero: even very small parties retain the baseline contribution of their voters.

If the remaining $1-x$ of the electorate is divided equally among $n$ opposing parties, their combined Mandate is:

$$
O(n)=nA\left(e^{k(1-x)/n}-1\right)
$$

As $n\to\infty$, using $e^t-1\sim t$ for small $t$:

$$
\boxed{\lim_{n\to\infty}O(n)=Ak(1-x)}
$$

Substituting this minimum limiting Opposition Mandate into the Mandate Share equation and cancelling $A$ gives the **Upper Bound of Power**:

$$
\boxed{f_{\max}(x;k)=\frac{e^{kx}-1}{e^{kx}-1+k(1-x)}}
$$

It is an upper *limit*: for a positive amount of opposition divided among finitely many positive-sized parties, the Mandate Share lies strictly below this bound. The bound can be approached arbitrarily closely as the number of opposing parties grows.

#### Lower Bound: Unified Opposition

At the opposite extreme, all voters outside the focal party could support a single opposing party with Vote Share $1-x$. Convexity makes this the greatest possible Opposition Mandate:

$$
O=M(1-x)
$$

The focal party then receives its lowest possible Mandate Share:

$$
\boxed{f_{\min}(x;k)=\frac{e^{kx}-1}{e^{kx}+e^{k(1-x)}-2}}
$$

Together, the **Bounds of Power** define the possible range of Mandate Share for a given Vote Share and coefficient:

$$
\boxed{f_{\min}(x;k)\leq f(x)\leq f_{\max}(x;k)}
$$

The lower curve corresponds to wholly unified opposition; the upper curve is the limit of maximally fragmented opposition. Neither depends on the chosen units of Mandate.

<!-- FIGURE: Show the family of Election Lines restricted to the feasible region between f_min and f_max. Label the two bounds and shade the enclosed region. Use 'Mandate Share' on the vertical axis while retaining 'Bounds of Power' as the name of the construction. -->

#### The Majority-Vote Boundary

The Bounds establish possible Mandate Shares, but one further curve distinguishes elections in which a party must have won an absolute majority of votes.

Consider two parties receiving 50% of the vote each. Our normalisation gives each 1,000 Mandate points, for a Total Mandate of 2,000.

Indeed, **2,000 is the maximum Total Mandate possible if no party wins more than half the vote**. To see why, note that convexity and $M(0)=0$ imply, for $0\leq x\leq0.5$:

$$
M(x)\leq\frac{x}{0.5}M(0.5)=2000x
$$

If every party has $x_i\leq0.5$, summing this inequality gives $\Sigma M\leq2000$.

The Election Line for this benchmark is the **Majority-Vote Boundary**:

$$
\boxed{f_{\mathrm{MV}}(x;k)=\frac{M(x)}{2000}
=\frac{e^{kx}-1}{2(e^{k/2}-1)}}
$$

It passes through $(x,f)=(0.5,0.5)$. Any *feasible* election point below this line has $\Sigma M>2000$, so that election must contain a party with more than 50% of the votes. A point above the line does not, by itself, establish whether such a party exists.

<!-- FIGURE: Add the Majority-Vote Boundary to the Bounds of Power, showing its intersection at (0.5, 0.5). Distinguish the feasible region below the boundary, which requires a majority-vote party. -->

#### Exploring the Bounds

All three curves depend on $k$. Increasing it generally widens the gap between the outcomes available under unified and fragmented opposition; decreasing it brings Mandate Shares closer to Vote Shares.

<!-- INTERACTIVE FIGURE: One combined Bounds of Power graph with f_min, f_max and the Majority-Vote Boundary. Allow k to vary. Mark the feasible region and use consistent Vote Share (horizontal) and Mandate Share (vertical) labels. -->

These curves allow us to ask a precise calibration question: **at what Vote Share should a unified political party first be capable, in the theoretical limit, of reaching half the legislative power?**

### Calibrating Majority Power

Let $x_*$ be the Vote Share at which the Upper Bound reaches one-half:

$$
\boxed{f_{\max}(x_*;k)=\frac12}
$$

Below $x_*$, a party cannot reach half the continuous Mandate Share even with maximally fragmented opposition. Above it, such a result becomes possible, depending on the opposition's organisation.

Our task is to find a defensible value of $x_*$ and then use it to determine $k$.

#### An Intuitive Starting Point

Begin with five equally supported parties, each holding 20% of the vote. If two form one agreed programme and merge, the election becomes $40\%,20\%,20\%,20\%$.

There is a reasonable case that this merged party, representing twice as many voters as any individual opponent, should be capable of obtaining half the Mandate Share. It reaches that point when:

$$
\frac{e^{0.4k}-1}{e^{0.4k}-1+3(e^{0.2k}-1)}=\frac12
$$

Solving for positive $k$:

$$
\boxed{k=5\ln2\approx3.466}
$$

Now begin with six equally supported parties. Merging two produces $1/3$ of the votes against four parties with $1/6$ each. We might reasonably judge that this second merger should *not* yet receive half the Mandate Share, despite being twice the size of any single opponent.

Its equality point is:

$$
\boxed{k=6\ln3\approx6.592}
$$

<!-- FIGURE: Two horizontal party-share diagrams: 20% + 20% merging in a five-party election; and 1/6 + 1/6 merging in a six-party election. Show each resulting distribution and the k at which its merged party reaches half the Mandate Share. -->

If we adopt both judgements, they suggest:

$$
\boxed{5\ln2\leq k<6\ln3}
$$

This is a **normative constraint**, not a mathematical discovery of the uniquely correct coefficient. It provides a plausible operating range but not a single value. To select a reference coefficient, we can consider a more general thought experiment.

### Unity versus Division

Imagine an electorate divided into two groups.

**Unity (U)** consists of voters who have reached a common political agreement. They may differ on many issues, but have negotiated a programme they are prepared to advance together through one party.

**Division (D)** consists of voters who have formed no equivalent collective agreement. In the limiting case, each supports a distinct political position and has undertaken no coordination with the others.

The distinction is not that U's voters are correct and D's voters are wrong. All voters retain legitimate views. It is that U has produced a shared, actionable programme, whereas D has not.

#### The Space of Political Encounters

Imagine choosing two voters independently from the electorate and considering the encounter between their political positions. We can represent all possible ordered pairs within a unit square, each axis covering the electorate from zero to one.

Let $x$ be the Vote Share belonging to Unity, with $1-x$ belonging to Division.

| Encounter | Proportion of all pairs | Political interpretation |
|---|---:|---|
| U–U | $x^2$ | Both support a common programme |
| U–D | $x(1-x)$ | One has a collective programme; the other an uncoordinated preference |
| D–U | $x(1-x)$ | The same encounter in reverse order |
| D–D | $(1-x)^2$ | Neither represents an established common programme |

<!-- INTERACTIVE FIGURE: The unit square partitioned into U×U, U×D, D×U and D×D, controlled by a slider for x. Colour the three regions involving U together, and show their combined area and the silver-ratio reference value. Explain the geometry before revealing the algebra. -->

We now make a further normative proposal: **in an encounter between an established collective agreement and an uncoordinated individual preference, the collective agreement has the greater capacity to advance a shared political programme**.

This does not mean the individual must agree, is less deserving of a vote, or loses a policy argument. It is a model of *organised political presence*, not a rule for deciding which opinion is true.

Under this premise, U has an actionable collective position in the U–U, U–D and D–U regions. Neither side of a D–D encounter represents an existing collective programme. We therefore attribute to U the fraction:

$$
P_U=x^2+2x(1-x)
$$

or:

$$
\boxed{P_U=2x-x^2}
$$

#### A Majority Criterion

We propose that, against maximally divided opposition, a unified party should be *capable* of reaching half the ideal legislative power once its established programme is present in at least half of these potential encounters.

Setting $P_U=1/2$:

$$
2x-x^2=\frac12
$$

The solution within $0\leq x\leq1$ is:

$$
\boxed{x_*=1-\frac1{\sqrt2}\approx0.292893}
$$

Unity consequently represents approximately **29.29%** of voters, against **70.71%** in Division. The ratio of divided to united votes is:

$$
\boxed{\frac DU=\frac{1-x_*}{x_*}=1+\sqrt2}
$$

The value $1+\sqrt2$ is known as the **silver ratio**.

The importance of this result is not that the silver ratio itself confers democratic authority. Rather, a stated principle about collective political agreement has supplied a precise Vote Share threshold **independently of the Mandate Equation**. We can now use it to calibrate that equation.

### The Innes Constant

Recall the Upper Bound:

$$
f_{\max}(x;k)=\frac{e^{kx}-1}{e^{kx}-1+k(1-x)}
$$

We choose the Mandate Coefficient so that this curve reaches one-half at the Vote Share established above:

$$
f_{\max}\left(1-\frac1{\sqrt2};k\right)=\frac12
$$

Rearranging:

$$
e^{k(1-1/\sqrt2)}-1=\frac{k}{\sqrt2}
$$

This equation has a unique strictly positive solution:

$$
\boxed{k=\Lambda\approx5.33684511056\ldots}
$$

We call this value the **Innes Constant**, denoted by the uppercase Greek letter lambda, $\Lambda$. SV proposes $k=\Lambda$ as its reference Mandate Coefficient.

<!-- FIGURE: Bounds of Power at k = Lambda. Add lines f = 0.5 and x = 1 - 1/sqrt(2) to mark their intersection on f_max. An optional k-slider lets the reader move the upper bound away from the target and reset to Lambda. -->

Under this calibration, **a party with less than approximately 29.29% of the votes cannot reach half the theoretical, unthresholded Mandate Share**, however divided its opposition becomes. At exactly $x_*$, half is approached only in the limiting case of arbitrarily many infinitesimal opposing parties. Consolidated opposition requires greater electoral support for the same result.

The Innes Constant is therefore a reference choice justified by our proposed political criterion, not an unavoidable constant of nature. Alternative criteria could produce different coefficients; their merits belong in [Evaluation](/explanation/evaluation).

We have now established how SV determines continuous Mandate Shares. The final step is to turn those shares into whole legislative seats.

---
## 4. Implementation

### 4.1 From Mandate Share to Actual Seats

The reference coefficient provides a useful final check against our earlier merger examples.

With $k=\Lambda$, merging two of five initially equal parties produces one party with 40% of the votes and approximately **56.57% of Mandate Share**; each of the three remaining 20% parties receives approximately **14.48%**.

Merging two of six initially equal parties instead produces a party with one-third of the vote and approximately **46.19% of Mandate Share**, while each of its four opponents receives approximately **13.45%**.

<!-- FIGURE: Show both merger scenarios with their Vote Shares and Mandate Shares at k = Lambda, reusing the design of the calibration diagrams. -->

The results satisfy the two contrasting judgements used to identify a plausible range for $k$.

We can also revisit the Unity-versus-Division example in a finite setting. If Party U faces 325 equally supported opposing parties, the Vote Share needed to earn exactly half the continuous Mandate Share satisfies:

$$
e^{\Lambda x}-1=325\left(e^{\Lambda(1-x)/325}-1\right)
$$

Its solution is $x\approx29.3604\%$, just **0.0711 percentage points** above the limiting silver-ratio threshold of 29.2893%. In a hypothetical 650-seat legislature, this corresponds to ideal entitlements of 325 seats for U and one each for its opponents.

These examples concern *continuous* Mandate Share. Actual elections rarely divide into exact whole-seat entitlements. A party entitled to 24.6 seats cannot occupy six-tenths of a parliamentary seat. We therefore need a rule for translating Mandate Share into whole numbers, a process called **seat apportionment**.

### 4.2 Seat Apportionment

#### From Mandate Share to Seat Quotas

Consider a new five-party election for a legislature of $S=100$ seats, now using $k=\Lambda$.

| Party | Vote Share $x_i$ | Mandate points $M_i$ | Mandate Share $f_i$ | Seat Quota $q_i$ |
|---|---:|---:|---:|---:|
| A | 36% | 434.49 | 49.73% | 49.732 |
| B | 25% | 208.46 | 23.86% | 23.861 |
| C | 17% | 110.12 | 12.60% | 12.605 |
| D | 13% | 74.63 | 8.54% | 8.542 |
| E | 9% | 45.95 | 5.26% | 5.260 |
| **Total** | **100%** | **873.65** | **100%** | **100.000** |

The final column gives each party's **seat quota**, $q_i$: the number of seats it would receive if seats could be divided without restriction.

$$
\boxed{\text{Seat Quota}=\text{Legislature size}\times\text{Mandate Share}}
$$

$$
\boxed{q_i=Sf_i}
$$

Because $\sum_i f_i=1$, the quotas add up to exactly $S$. Unfortunately, rounding them individually to the nearest integer gives $(50,24,13,9,5)$, or **101 seats** in a 100-seat legislature. We need a coordinated allocation rule that awards exactly $S$ whole seats while remaining faithful to the intended shares.

#### Advantage and Apportionment Ratios

Two ratios help us distinguish the effect SV *intends* from any additional effect caused by rounding.

The established **Advantage Ratio**, $\alpha_i$, compares a party's actual Seat Share with its Vote Share:

$$
\boxed{\alpha_i=\frac{\text{Seat Share}}{\text{Vote Share}}=\frac{s_i/S}{x_i}}
$$

If $\alpha_i=1$, representation is proportional to votes. Values above one indicate more seats per voter than direct PR; values below one indicate fewer. SV intentionally allows this ratio to vary, rewarding larger political agreements.

The **Apportionment Ratio**, $\beta_i$, instead compares actual Seat Share with the Mandate Share SV intended:

$$
\boxed{\beta_i=\frac{\text{Seat Share}}{\text{Mandate Share}}=\frac{s_i/S}{f_i}=\frac{s_i}{q_i}}
$$

Here the target is $\beta_i=1$. An allocation above or below one has given a party more or less than its ideal seat entitlement.

The two ratios are connected:

$$
\boxed{\alpha_i=\underbrace{\frac{f_i}{x_i}}_{\text{intended advantage}}\,\underbrace{\beta_i}_{\text{apportionment effect}}}
$$

The Mandate Equation sets the intended advantage; apportionment should introduce as little additional distortion as possible. For parties with positive votes but no seats, $\alpha_i=0$. Apportionment Ratios are considered only where the target Mandate Share is positive.

#### Measuring Apportionment Error

To see what an accurate allocation means, imagine plotting each party as a point with its Mandate Share $f_i$ on the horizontal axis and its actual Seat Share $s_i/S$ on the vertical axis.

Every point would lie on the diagonal $s_i/S=f_i$ if whole seats could reproduce the intended shares exactly. A point above the line is over-allocated; a point below is under-allocated. The vertical distance is the difference between actual and intended Seat Share.

<!-- INTERACTIVE FIGURE: APPORTIONMENT ERROR. Plot the five party points on axes (f_i, s_i/S) with the fixed identity line y = x. Reveal vertical deviations, their squares and the weight 1/f_i. Allow alternative integer allocations and show the changing total weighted squared error. This is not a fitted regression line. -->

We want a single measure that penalises deviations in either direction and recognises that the same seat error is proportionally more important for a party entitled to two seats than one entitled to fifty.

We therefore choose to minimise the **total weighted squared apportionment error**:

$$
\boxed{\mathcal L=\sum_i q_i(\beta_i-1)^2}
$$

The quantity $\beta_i-1$ is the relative deviation from target. Squaring removes its sign and gives greater deviations larger penalties. Weighting each squared relative deviation by $q_i$ reflects the party's intended entitlement.

Because $\beta_i=s_i/q_i$, the same loss can be written:

$$
\mathcal L=\sum_iq_i\left(\frac{s_i}{q_i}-1\right)^2
$$

and therefore:

$$
\boxed{\mathcal L=\sum_i\frac{(s_i-q_i)^2}{q_i}}
$$

Our task is to find non-negative integer seats $s_i$ such that:

$$
\boxed{\min\mathcal L\quad\text{subject to}\quad\sum_i s_i=S}
$$

This is a **weighted least-squares allocation problem**. We are not fitting a line to observations: the ideal relationship is already known, and we are choosing the integer allocation closest to it under the specified loss function. The choice of weighting is itself a design decision; it is not uniquely dictated by the Mandate Equation.

#### Deriving the Allocation Rule

Suppose party $i$ currently holds $s_i$ seats and has quota $q_i$. Its contribution to the loss is:

$$
\mathcal L_i=\frac{(s_i-q_i)^2}{q_i}
$$

If we award it one more seat, its contribution becomes:

$$
\mathcal L_i'=\frac{(s_i+1-q_i)^2}{q_i}
$$

The change in total loss caused by this one seat is:

$$
\begin{aligned}
\Delta\mathcal L_i
&=\mathcal L_i'-\mathcal L_i\\
&=\frac{(s_i+1-q_i)^2-(s_i-q_i)^2}{q_i}\\
&=\frac{2s_i+1}{q_i}-2
\end{aligned}
$$

To keep the total loss as small as possible, the next seat must go to the party with the **smallest increase in loss**, or the greatest reduction. Since $-2$ is common to all parties, we can ignore it when comparing priorities.

Minimising $(2s_i+1)/q_i$ is equivalent to maximising:

$$
\boxed{\frac{q_i}{2s_i+1}}
$$

Substituting $q_i=SM_i/\Sigma M$, and cancelling the common factor $S/\Sigma M$, gives the seat priority:

$$
\boxed{P_i=\frac{M_i}{2s_i+1}}
$$

A party's first seat is therefore assessed at priority $M_i/1$, its second at $M_i/3$, its third at $M_i/5$, and so on through the odd numbers.

Each successive seat for a given party has a greater incremental error cost than the preceding seat. Selecting the lowest available cost at every step consequently selects the $S$ lowest incremental costs overall, and **minimises the total loss globally**, apart from possible ties.

#### Discovering Sainte-Laguë

The procedure we have derived already exists. It is the **Sainte-Laguë** method of apportionment, also called the Webster method.

Sainte-Laguë is normally presented as a means of distributing seats in proportion to votes. SV applies the same rule to Political Mandate instead.

The method has several well-studied properties beyond the weighted-error result just derived. It is **house-monotone** when eligible parties and their relative weights remain fixed: increasing the legislature by one seat cannot cause an existing party to lose a seat. It also exhibits little systematic size bias and has a useful consistency property. These qualities fit SV's aim of introducing its deliberate size advantage through the Mandate Equation rather than through another rounding bias.

The qualifications, quota-rule exceptions and comparison with other apportionment methods are addressed in [Evaluation: Apportionment Methods](/explanation/evaluation#apportionment-methods).

#### An Equivalent Common Divisor

In practice, Sainte-Laguë need not award seats individually. The ideal quota can be written:

$$
q_i=\frac{M_i}{d_0},\qquad d_0=\frac{\Sigma M}{S}
$$

Here $d_0$ is the **standard divisor**: Mandate points per ideal seat. Rounding each $M_i/d_0$ independently may produce the wrong total, as in our 101-seat example.

Sainte-Laguë adjusts this *common* divisor to a value $d>0$ until:

$$
\boxed{\sum_i\operatorname{round}\left(\frac{M_i}{d}\right)=S}
$$

If too many seats are awarded, increase $d$; if too few, decrease it. Nearest-integer rounding is used, with consistent handling of exact half-integer ties.

For the five-party election, $d\approx8.7786$ produces:

$$
\boxed{(49,24,13,9,5)}
$$

This is exactly the allocation produced by the sequential priorities. The equivalence follows because a party crosses the threshold for its next rounded seat when $M_i/d=s_i+1/2$, or $d=2M_i/(2s_i+1)$. The common-divisor method is therefore a computationally efficient way to obtain the same result.

<!-- OPTIONAL FIGURE: Common divisor slider starting at d_0, where nearest-integer rounding allocates 101 seats, and moving to a divisor yielding exactly 100. -->

#### Watching Seats Accumulate

The sequential interpretation offers an intuitive view of rounding. After the first seat, one party controls the entire legislature; after the second, two parties might each control half. Early allocations fluctuate sharply. As the legislature grows, each subsequent seat changes the proportions by less, and parties' Seat Shares converge towards their fixed target Mandate Shares.

<!-- LINKED INTERACTIVE FIGURES: At each interim legislature size N, allocate the first N Sainte-Laguë seats from the five-party example. Plot (1) actual Seat Share s_i/N versus N, with horizontal target lines f_i; and (2) Advantage Ratio (s_i/N)/x_i versus N, with target lines f_i/x_i. Share Play/Pause, step controls and party colours. N is the temporary legislature size; S is the final target size. Hold party eligibility fixed. -->

The same convergence appears in the Advantage Ratio, whose continuous target is:

$$
\boxed{\alpha_i^{\mathrm{ideal}}=\frac{f_i}{x_i}}
$$

But the first seat won by a small party can cause an exceptionally large jump in its advantage. If that first seat arrives close to the final legislature size, there may be no further seats to moderate the effect. This motivates one final eligibility rule.

### 4.3 The Electoral Threshold

#### A Small-Party Anomaly

Consider six parties competing for 100 seats, again with $k=\Lambda$, and initially **no Electoral Threshold**.

| Party | Vote Share $x_i$ | Seat Quota $q_i$ | Sainte-Laguë seats $s_i$ | Advantage Ratio $\alpha_i$ | Apportionment Ratio $\beta_i$ |
|---|---:|---:|---:|---:|---:|
| A | 24.9% | 28.375 | 28 | 1.124 | 0.987 |
| B | 21.7% | 22.316 | 22 | 1.014 | 0.986 |
| C | 21.4% | 21.799 | 22 | 1.028 | 1.009 |
| D | 18.5% | 17.208 | 17 | 0.919 | 0.988 |
| E | 12.6% | 9.800 | 10 | 0.794 | 1.020 |
| **F** | **0.9%** | **0.503** | **1** | **1.111** | **1.989** |

Party F earns approximately half a seat's worth of Mandate Share. Yet under Sainte-Laguë it receives the **100th and final seat**.

Before that seat, F has no representation. Afterwards, it has 1% of the legislature on just 0.9% of the vote:

$$
\boxed{\alpha_F=\frac{0.01}{0.009}\approx1.111}
$$

Its Apportionment Ratio is $\beta_F\approx1.989$: almost twice its intended entitlement. It now has a higher Advantage Ratio than several substantially larger parties, despite SV's deliberate preference for broader political agreements.

<!-- FIGURE: Replay the linked graphs for this six-party election. Pause at seat 99 and award seat 100 to F. Highlight the sudden jump from alpha_F = 0 to approximately 1.111, compared with its ideal target f_F/x_F approximately 0.559. -->

Sainte-Laguë has not failed to perform its stated task. It has selected the allocation with the smallest **total** weighted squared error. The difficulty is that a party entitled to roughly half a seat must receive either zero or one whole seat; no rounding method can remove that indivisibility.

#### A Vote-Share Threshold

Suppose a party receives exactly one seat in a legislature of $S$ seats. Its Advantage Ratio is:

$$
\alpha_i=\frac{1/S}{x_i}=\frac1{Sx_i}
$$

For this one-seat party not to be over-represented relative to its votes, we require $\alpha_i\leq1$, which is equivalent to:

$$
\boxed{x_i\geq\frac1S}
$$

This gives a mathematical motivation for an **Electoral Threshold**, $\tau$, of at least one seat's proportional share of the electorate:

$$
\boxed{\tau\geq\frac1S}
$$

For reference, $1/S$ is 1% in a 100-seat legislature, 0.5% in a 200-seat legislature and approximately 0.154% in a 650-seat legislature.

A threshold of $1/S$ prevents a party winning a seat with a smaller Vote Share than that seat represents. It **does not** guarantee perfectly ordered Advantage Ratios across all parties, or remove every rounding anomaly. A higher threshold may be chosen as an additional political requirement, but is not forced by this argument.

SV therefore adopts $\tau=1/S$ as its **reference threshold**, while recommending that any chosen threshold satisfy $\tau\geq1/S$. The trade-offs of higher or fixed-percentage thresholds are discussed in [Evaluation: Electoral Thresholds](/explanation/evaluation#electoral-thresholds).

#### Applying the Threshold

The threshold is applied to the party's original Vote Share, **before** the allocation of Mandate Shares and seats. Define the eligible set:

$$
\boxed{\mathcal E=\{i:x_i\geq\tau\}}
$$

An ineligible party receives no seats and its Mandate is excluded from the denominator used to allocate seats. Eligible parties keep their original Vote Shares: their excluded opponents' votes are **not** reassigned before calculating Mandate.

To distinguish this practical result from the unthresholded theoretical model, write the **eligible Mandate Share** as:

$$
\boxed{f_i^{\mathcal E}=\frac{M_i}{\displaystyle\sum_{j\in\mathcal E}M_j}},\qquad i\in\mathcal E
$$

The corresponding eligible seat quotas are:

$$
\boxed{q_i^{\mathcal E}=Sf_i^{\mathcal E}}
$$

Sainte-Laguë then distributes all $S$ seats among eligible parties. In the six-party example, F's 0.9% falls below the 1% reference threshold. Excluding its Mandate and recalculating gives:

$$
\boxed{(29,22,22,17,10,0)}
$$

Because $M(x)$ is strictly increasing, an equivalent threshold may be expressed in Mandate points:

$$
\boxed{M_\tau=A(e^{k\tau}-1)
=1000\frac{e^{k\tau}-1}{e^{k/2}-1}}
$$

The threshold prevents the particular first-seat anomaly that motivated it, but excluding Mandate can also shift power substantially towards qualifying parties. Consequently, the theoretical Bounds of Power and the 29.29% calibration threshold concern the **unthresholded continuous model**; they are not automatic guarantees about actual seats after exclusions and rounding. These effects are examined in Evaluation.

### 4.4 The Complete SV Process

For an election with Vote Shares $x_i$, legislature size $S$, Mandate Coefficient $k$ and threshold $\tau\geq1/S$, the proposed process is:

1. **Determine eligibility:** identify parties with $x_i\geq\tau$.
2. **Calculate Political Mandate:** for eligible parties, apply $M_i=A(e^{kx_i}-1)$.
3. **Calculate eligible Mandate Share:** divide each eligible party's Mandate by the Total Mandate of all eligible parties.
4. **Calculate Seat Quotas:** multiply eligible Mandate Shares by $S$.
5. **Apportion whole seats:** apply Sainte-Laguë to award exactly $S$ seats, with a specified rule for exact ties.

The **reference implementation** uses $k=\Lambda$ and $\tau=1/S$.

<!-- IMPLEMENTATION QUESTIONS FOR THE TECHNICAL SPECIFICATION: Define a deterministic tie-breaking rule for exact Sainte-Laguë priority ties, and a fallback if no party meets the selected Electoral Threshold. Neither rule is determined by the derivation above. -->

<!-- FIGURE: SUMMARY OF SV. Votes → Vote Share → Electoral Threshold → Eligible Political Mandate → Eligible Mandate Share → Seat Quota → Sainte-Laguë → Whole Seats. Label each stage with its mathematical symbol and principal equation. -->

Political Mandate expresses SV's proposed reward for collective agreement. Mandate Share translates that reward into an intended distribution of legislative power. Sainte-Laguë converts the continuous target into whole seats, and the Electoral Threshold limits a specific distortion affecting very small parties.

This completes the proposed mechanism. The mathematical consequences of consolidation, party mergers and the wider electoral distribution belong in [Analysis](/explanation/analysis). Whether those consequences justify the political and institutional choices made here belongs in [Evaluation](/explanation/evaluation).
