# Derivation of Strengthened Voting

*Status: Working manuscript — structure provisional, prose under development.*

## 1. From Votes to Seats

An electoral system converts votes cast by the electorate into legislative seats. Different voting systems accomplish this through different mathematical processes.

These processes can be represented as a sequence of transformations, beginning with the votes cast and ending with the seats awarded.

### First-Past-the-Post (FPTP)

In First-Past-the-Post, each constituency elects a single representative. The candidate receiving the most votes wins that constituency's seat.

Let \(v_{i,d}\) represent the votes received by party \(i\) in constituency \(d\), and \(s_i\) the total number of seats awarded to that party.

**Votes → Seats**

\[
v_{i,d}\longrightarrow s_i
\]

The distribution of votes across constituencies determines the result. National vote totals alone cannot establish how many seats a party wins.

### Proportional Representation (PR)

In Direct Proportional Representation, seats are allocated to parties according to their share of the vote.

Let \(v_i\) represent the votes received by party \(i\). We introduce Vote Share, \(x_i\):

\[
x_i=\frac{v_i}{\sum_j v_j}
\]

For a legislature containing \(S\) seats, the ideal allocation to party \(i\) is \(Sx_i\). Since seats are indivisible, an apportionment method must convert this into whole numbers.

**Votes → Vote Share → Seats**

\[
v_i\longrightarrow x_i\longrightarrow s_i
\]

Some PR systems introduce an electoral threshold. Parties below this threshold are excluded from representation, and their potential seats are redistributed among the remaining parties.

We therefore introduce the Fraction of Power, \(f_i\), representing a party's ideal proportion of legislative seats before apportionment.

**Votes → Vote Share → Fraction of Power → Seats**

\[
v_i\longrightarrow x_i\longrightarrow f_i\longrightarrow s_i
\]

In Direct PR, \(f_i=x_i\). In thresholded PR, these quantities can differ.

### Strengthened Voting (SV)

Strengthened Voting introduces an additional quantity: **Political Mandate**, \(M_i\).

Each party earns Political Mandate according to its Vote Share. Its Fraction of Power is then determined by its share of the total Political Mandate earned by all parties.

Seats are subsequently apportioned as closely as possible to these fractions.

**Votes → Vote Share → Political Mandate → Fraction of Power → Seats**

\[
v_i\longrightarrow x_i\longrightarrow M_i\longrightarrow f_i\longrightarrow s_i
\]

The defining feature of SV is therefore the introduction of Political Mandate as a distinct measure of electoral support.

The following sections derive this measure, establish how it determines legislative power, and justify the parameters chosen for SV.

---

## 2. The Mandate Equation

### Political Agreement

A political party represents an agreement between voters to support a common political platform, reconciling differences in their individual views and preferences.

As a party attracts broader support, its platform has demonstrated an ability to accommodate an increasingly large electorate.

Strengthened Voting recognises that extending an existing political agreement to encompass additional supporters represents a political achievement beyond merely increasing the number of voters.

This additional achievement is recognised through **Political Mandate**.

### Convexity

Let \(m(x)\) represent the Political Mandate earned by a party with Vote Share \(x\).

In order to reward broader political agreements disproportionately, SV adopts a strictly increasing, convex Mandate function.

This means that Mandate increases with Vote Share, and the slope of the curve also increases.

<!-- FIGURE: Compare several illustrative convex Mandate functions. Establish that convexity alone does not determine a unique mathematical relationship. -->

### Marginal Vote Strength

To derive the Mandate function, consider its slope: how much additional Mandate is earned for an increase in Vote Share?

This is the **marginal Vote Strength**, denoted \(\omega(x)\):

\[
\boxed{\omega(x)=\frac{dm}{dx}}
\]

For comparison, a linear relationship such as \(m(x)=x\) has constant marginal Strength. This corresponds to counting electoral support directly, without strengthening it.

In SV, marginal Vote Strength increases with the breadth of the political agreement.

The total Mandate earned by a party is the accumulation of marginal Strength across its Vote Share:

\[
\boxed{m(x)=\int_0^x\omega(t)\,dt}
\]

The area under the Strength curve therefore equals the Political Mandate earned.

### Proportional Strengthening

Consider what happens when additional voters support a party. Their contribution to its Mandate has two components:

1. **Independent support:** The additional voters contribute their own political support, regardless of the party's existing size.
2. **Strengthening of existing agreement:** Their inclusion extends the political agreement already achieved among the party's supporters.

SV proposes that each unit of previously accumulated Mandate contributes equally to this additional strengthening.

Consequently, marginal Vote Strength consists of a baseline contribution plus an amount proportional to existing Mandate:

\[
\boxed{\omega(x)=a+bm(x)}
\]

Here:

- \(a>0\) represents the baseline marginal contribution of additional electoral support.
- \(b>0\) determines the strengthening contributed by accumulated Mandate.

A party with no votes has no Mandate, so \(m(0)=0\). Therefore \(\omega(0)=a\): marginal Strength begins with the baseline contribution, before any existing agreement has accumulated.

### Deriving the Mandate Equation

We have already established that:

\[
\omega(x)=\frac{dm}{dx}
\]

Therefore:

\[
\frac{dm}{dx}=a+bm
\]

Solving this first-order differential equation, with \(m(0)=0\), produces:

\[
\boxed{m(x)=\frac{a}{b}(e^{bx}-1)}
\]

<!-- EXPANDABLE: Full solution of the first-order differential equation. -->

The coefficient \(a/b\) scales the numerical quantity of Mandate. However, the relative Mandates of parties are unaffected by a common scaling factor, which cancels when calculating their proportions of total Mandate.

We can therefore choose units such that \(a/b=1\), and denote the remaining coefficient \(b\) by \(k\).

This gives the **Mandate Equation**:

\[
\boxed{m(x)=e^{kx}-1}
\]

where \(k>0\) is the **Mandate Coefficient**.

The exponential form reflects the compounding recognition of political agreement: the Mandate accumulated from earlier support contributes to the strengthening earned from subsequent support.

### A Property of Marginal Strength

Differentiating the Mandate Equation gives:

\[
\omega(x)=ke^{kx}
\]

Differentiating again:

\[
\frac{d\omega}{dx}=k^2e^{kx}
\]

Therefore:

\[
\boxed{\frac{d\omega}{dx}=k\omega}
\]

Marginal Vote Strength increases at a rate proportional to its existing Strength. This is an emergent property of the Mandate Equation, and explains its exponential behaviour.

<!-- INTERACTIVE GRAPH:
Two synchronised panels.

LEFT: Marginal Vote Strength, omega(x).
RIGHT: Accumulated Political Mandate, m(x).

A shared Vote Share slider moves a vertical line on both graphs.
The region under omega(x), from 0 to the selected Vote Share, is shaded.
Its area equals the Mandate displayed on the right.
The selected Vote Share, marginal Strength and accumulated Mandate are shown numerically.

Include a linear comparison to illustrate constant marginal Strength.
Both graphs must use mathematically consistent units.
-->

### Arbitrary Coefficient

The absolute scale of Mandate does not affect the distribution of legislative power. We are therefore free to express Mandate in more convenient numerical units.

SV adopts the convention that a party receiving 50% of the vote earns exactly 1,000 points of Mandate.

Introduce an Arbitrary Coefficient, \(A\), such that:

\[
M(x)=A(e^{kx}-1)
\]

Requiring \(M(0.5)=1000\) gives:

\[
\boxed{A=\frac{1000}{e^{k/2}-1}}
\]

Our scaled Mandate Equation is therefore:

\[
\boxed{M(x)=1000\frac{e^{kx}-1}{e^{k/2}-1}}
\]

This convention remains valid for every positive value of \(k\).

It provides an intuitive reference: a party with 50% Vote Share earns 1,000 points, while a party with more than 50% earns more than 1,000 points.

### Fraction of Power

The remaining theoretical mechanism of SV is straightforward.

Each party earns Mandate according to its Vote Share. The Mandates of all parties are added to obtain the **Total Mandate**, \(\Sigma M\):

\[
\Sigma M=\sum_{j=1}^{n}M_j
\]

Each party's ideal Fraction of Power is then its proportion of Total Mandate:

\[
\boxed{f_i=\frac{M_i}{\Sigma M}}
\]

This is the ideal fraction of legislative seats awarded to that party, before thresholds and integer apportionment are considered.

### Worked Election

Consider a hypothetical election for 100 legislative seats, contested by five parties.

For illustration, let \(k=3\).

| Party | Vote Share | Mandate (points) | Fraction of Power | Example Seats |
|---|---:|---:|---:|---:|
| A | 40% | 666.4 | 47.74% | 48 |
| B | 30% | 419.2 | 30.03% | 30 |
| C | 15% | 163.2 | 11.69% | 12 |
| D | 10% | 100.5 | 7.20% | 7 |
| E | 5% | 46.5 | 3.33% | 3 |
| **Total** | **100%** | **1,395.8** | **100%** | **100** |

*The seat allocations above use the largest-remainder method for illustration only. The formal SV apportionment method will be addressed under Implementation.*

The relationship between votes and seats is therefore not determined by the size of an individual party alone. It also depends upon the Mandate earned by the other parties contesting the election.

<!-- INTERACTIVE GRAPH AND ELECTION:
A Mandate curve accompanied by the five-party election table.

Controls: Low / Intermediate / High k, with optional continuous slider.
Changing k updates:
- The Mandate curve.
- Each party's Mandate points.
- Total Mandate.
- Fraction of Power.
- Illustrative seat allocations.

Use the same five-party vote distribution across all settings.
Maintain M(0.5) = 1000 for every k.
Clearly indicate that the displayed values of k are illustrative.
-->

We have now established how Strengthened Voting converts votes into ideal legislative power.

However, the results depend substantially upon the Mandate Coefficient, \(k\).

Before selecting its value, we must examine how this coefficient changes the behaviour of the system.

---

## 3. The Mandate Coefficient

*Working outline — substantive text to develop.*

### Properties of \(k\)

Investigate how the Mandate Equation and resulting Fraction of Power change as \(k\) varies.

Topics:

- The effect of low, intermediate and high values of \(k\).
- As \(k\to0^+\), the ideal distribution of power approaches Direct PR.
- As \(k\) becomes large, Mandate becomes increasingly concentrated among the largest parties.
- The distinction between the shape of the Mandate curve and the resulting allocation of power.
- The significance of opposition party sizes and their combined Mandate.

<!-- FIGURE: A family of Mandate curves for different k, normalised at 50% Vote Share. -->

### Bounds of Power

#### Election Lines

We have established that a party's Fraction of Power is its proportion of the Total Mandate earned in an election:

\[
f_i=\frac{M_i}{\Sigma M}
\]

For a fixed Mandate Coefficient, \(k\), we can therefore plot a party's Fraction of Power, \(f\), against its Vote Share, \(x\), at different values of Total Mandate:

\[
\boxed{f(x)=\frac{M(x)}{\Sigma M}}
\]

Each value of \(\Sigma M\) produces a different **Election Line**, upon which every party in that election lies.

When votes are concentrated among fewer, larger parties, the Total Mandate increases, causing the Election Line to sit lower on the graph. Conversely, more fragmented elections have a lower Total Mandate, placing their Election Lines higher.

<!-- FIGURE: A family of Election Lines at a fixed k, labelled with different values of Total Mandate. Show how higher Total Mandate produces lower curves. Distinguish illustrative curve extensions from feasible election outcomes. -->

This reveals an important property of SV: **a party's Vote Share alone does not determine its Fraction of Power.** Its result also depends on how votes are distributed among the other parties.

However, there are limits to how much this distribution can affect the result.

#### The Bounds of Power

Consider a party, Party 1, with Vote Share \(x_1\) and Political Mandate \(M_1\).

Let \(O_1\) represent the combined **Opposition Mandate** earned by every other party:

\[
O_1=\sum_{j\neq1}M_j
\]

Party 1's Fraction of Power can be expressed as:

\[
\boxed{f_1=\frac{M_1}{M_1+O_1}}
\]

We can now investigate the greatest and smallest possible values of \(O_1\), and therefore the limits of Party 1's Fraction of Power.

#### The Upper Bound, \(f_{\max}\)

Suppose Party 1 receives 30% of the vote, with \(k=5\). The remaining 70% is divided among its opponents.

What happens if we divide this opposition into increasingly many, equally sized parties?

| Opposition parties | Vote Share each | Party 1 Power |
|---:|---:|---:|
| 1 | 70% | 9.8% |
| 2 | 35% | 26.8% |
| 3 | 23.3% | 34.4% |
| 5 | 14% | 40.7% |
| 10 | 7% | 45.4% |
| 20 | 3.5% | 47.7% |
| 100 | 0.7% | 49.4% |
| Approaching infinity | Approaching 0% | **49.9%** |

*Illustrative theoretical election, without thresholds or integer seat apportionment.*

<!-- INTERACTIVE FIGURE: Fix Party 1 at 30% and k=5. Allow the number of equally sized opposition parties to increase. Show the falling Opposition Mandate and Party 1's Fraction of Power converging towards its upper bound. -->

As the opposition becomes increasingly fragmented, its combined Mandate falls. Party 1 consequently receives a larger Fraction of Power, despite gaining no additional votes.

Yet this increase approaches a fixed limit. Even if the opposing vote were divided among an arbitrarily large number of tiny parties, their combined Mandate would not fall to zero.

To demonstrate this mathematically, suppose the remaining \(1-x_1\) of the vote is divided equally among \(n\) opposing parties.

Their combined Mandate is:

\[
O_1(n)=nM\left(\frac{1-x_1}{n}\right)
\]

Substituting the Mandate Equation:

\[
O_1(n)=nA\left(e^{k(1-x_1)/n}-1\right)
\]

As \(n\) approaches infinity:

\[
\boxed{\lim_{n\to\infty}O_1(n)=Ak(1-x_1)}
\]

<!-- EXPANDABLE: Derivation of the limit of Opposition Mandate. -->

Substituting this limiting Opposition Mandate into Party 1's Fraction of Power gives the **Upper Bound of Power**, \(f_{\max}\):

\[
f_{\max}(x)=\frac{A(e^{kx}-1)}{A(e^{kx}-1)+Ak(1-x)}
\]

Cancelling the Arbitrary Coefficient, \(A\):

\[
\boxed{f_{\max}(x)=\frac{e^{kx}-1}{e^{kx}-1+k(1-x)}}
\]

This is the greatest Fraction of Power a party can theoretically approach for a given Vote Share, regardless of how fragmented its opposition becomes.

#### The Lower Bound, \(f_{\min}\)

Now consider the opposite extreme.

Instead of being divided among many parties, suppose all opposing voters support a single party.

This creates the greatest possible Opposition Mandate:

\[
O_1=M(1-x_1)
\]

Party 1 therefore receives its smallest possible Fraction of Power:

\[
f_{\min}(x)=\frac{M(x)}{M(x)+M(1-x)}
\]

Substituting the Mandate Equation and cancelling \(A\):

\[
\boxed{f_{\min}(x)=\frac{e^{kx}-1}{e^{kx}+e^{k(1-x)}-2}}
\]

The **Bounds of Power** are therefore:

\[
\boxed{f_{\min}(x)\leq f(x)\leq f_{\max}(x)}
\]

For a given Vote Share and Mandate Coefficient, no theoretical election result can fall outside these bounds.

<!-- FIGURE: Show the Election Lines restricted to the region between f_min and f_max. Clearly distinguish the two bounding curves and shade the feasible region. -->

The Upper Bound rewards a party facing maximally divided opposition. The Lower Bound represents the same party facing maximally unified opposition.

Together, these curves establish the range of political power that SV can allocate at any particular Vote Share.

#### The Majority-Vote Boundary

There is one further boundary worth identifying within this region.

Consider an election in which two parties each receive exactly 50% of the vote.

Since the Arbitrary Coefficient was chosen so that \(M(0.5)=1000\), this election has:

\[
\Sigma M=1000+1000=2000
\]

In fact, **2,000 is the greatest possible Total Mandate in any election where no party receives more than 50% of the vote.**

<!-- EXPANDABLE: Proof using the convexity of the Mandate Equation. -->

We can therefore define the **Majority-Vote Boundary** as the Election Line corresponding to \(\Sigma M=2000\):

\[
\boxed{f_{\mathrm{MV}}(x)=\frac{M(x)}{2000}}
\]

Or, substituting the scaled Mandate Equation:

\[
\boxed{f_{\mathrm{MV}}(x)=\frac{e^{kx}-1}{2(e^{k/2}-1)}}
\]

This line passes through the point:

\[
(x,f)=(0.5,0.5)
\]

Any feasible result below the Majority-Vote Boundary necessarily belongs to an election in which at least one party has won more than 50% of the votes.

Conversely, results above the boundary do not require a party to hold an absolute majority of votes.

<!-- FIGURE: The complete Bounds of Power graph, now including the Majority-Vote Boundary. Distinguish the feasible region below this boundary and explain that it requires a majority-vote party. -->

#### Exploring the Bounds

The shapes of the Bounds of Power and the Majority-Vote Boundary depend upon the Mandate Coefficient, \(k\).

<!-- INTERACTIVE GRAPH:
Display the complete Bounds of Power, including:
- Upper Bound, f_max
- Lower Bound, f_min
- Majority-Vote Boundary
- Shaded feasible regions

Allow the user to vary k, using a slider and/or representative low, intermediate and high values.

Show how the feasible region changes, with the three boundary equations updating simultaneously.
-->

Increasing \(k\) widens the potential advantage of political unity, while decreasing \(k\) brings the Bounds of Power closer to the proportional relationship \(f=x\).

We are now equipped to address the central question of SV's calibration:

**How much additional legislative power should a unified political position be capable of earning?**

To answer this, we will return to the Upper Bound of Power and consider a hypothetical contest between one unified party and maximally divided opposition.

### Calibrating Majority Power

Having established the Bounds of Power, we can now consider the central question of calibration:

**How much electoral support should a unified political party require before it becomes capable of securing majority legislative power?**

The answer depends upon the Mandate Coefficient, \(k\).

Let \(x_*\) denote the Vote Share at which the Upper Bound of Power, \(f_{\max}\), reaches 50%:

\[
\boxed{f_{\max}(x_*;k)=\frac12}
\]

Below this Vote Share, no party can reach half of the ideal legislative power, even if every opposing voter belongs to a separate political party.

Above it, majority power becomes possible, depending upon how the remaining electorate is divided.

Our task is therefore to determine an appropriate value for \(x_*\), and then calculate the corresponding \(k\).

#### An Intuitive Starting Point

Before attempting a more general principle, consider two simple examples of political agreement.

Imagine an electorate initially divided among five equally supported political parties, each receiving 20% of the vote.

If two parties negotiate a common programme and merge, the resulting election consists of one party with 40% of the vote and three parties with 20% each.

Should the merged party be capable of securing majority legislative power?

It has brought together two previously independent political positions into one agreement, and now represents twice as many voters as any other party. There is a reasonable argument that this achievement should be sufficient.

Under SV, the merged party reaches 50% of legislative power when:

\[
\frac{e^{0.4k}-1}
{e^{0.4k}-1+3(e^{0.2k}-1)}
=\frac12
\]

Solving:

\[
\boxed{k=5\ln2\approx3.466}
\]

Now consider six initially equal parties, each representing one-sixth of the electorate.

Again, two parties merge. The combined party now holds one-third of the vote, while four independent parties each hold one-sixth.

Has the merger achieved enough agreement to warrant majority legislative power?

We might reasonably judge that it has not. Although the merged party is twice the size of any individual opponent, it still represents only one-third of voters, against four other substantial political organisations.

The coefficient at which this party reaches 50% power is:

\[
\boxed{k=6\ln3\approx6.592}
\]

<!-- FIGURE:
Two simple horizontal vote-share diagrams:

A. Five equal parties become 40%, 20%, 20%, 20%.
B. Six equal parties become 33.33%, 16.67%, 16.67%, 16.67%, 16.67%.

In both diagrams, show the merger of two parties visually. Below each, identify the value of k at which the merged party reaches 50% power.
-->

If we accept the judgement that the first merger should be sufficient to reach half the legislative power, but the second should not, we obtain:

\[
\boxed{5\ln2\leq k<6\ln3}
\]

Or approximately:

\[
\boxed{3.466\leq k<6.592}
\]

This is not a mathematical proof of an ideal coefficient. It illustrates how a judgement about what political agreement *should* achieve can be translated into a constraint on \(k\).

The examples suggest a plausible range, but do not determine a unique value.

To establish a more precise calibration, we will consider a limiting thought experiment about the nature of political agreement itself.

### Unity versus Division

Imagine an electorate divided into two groups.

The first is **Unity**, represented by Party U. Its supporters possess different opinions and priorities, but have negotiated a common political programme. They have reconciled their differences sufficiently to form an agreement that they are prepared to advance collectively.

The second is **Division**, represented by D. These voters have not formed a common political agreement. In the most extreme case, each voter supports only their own political position, effectively constituting a party of one.

Divided voters do not merely disagree with U. They also disagree with one another, and have undertaken none of the negotiation or compromise necessary to establish a shared political programme.

This distinction is central to SV. Political unity is not the absence of disagreement, but the achievement of agreement despite differences.

Our thought experiment asks how much political authority that achievement should confer when it faces an electorate that has formed no competing collective agreements.

#### The Space of Political Debate

Imagine selecting two individuals independently from the electorate and considering an encounter between their political positions.

We can represent every possible pairing within a square. Both axes cover the entire electorate, ranging from 0 to 1.

Let \(x\) be the Vote Share of Party U, with the remaining \(1-x\) belonging to D.

The square is divided into four regions:

| Encounter | Area | Interpretation |
|---|---|---|
| U with U | \(x^2\) | Both individuals support an established common programme |
| U with D | \(x(1-x)\) | U possesses a common programme; D represents an individual preference |
| D with U | \(x(1-x)\) | The same relationship, with the individuals reversed |
| D with D | \((1-x)^2\) | Neither participant represents an established collective agreement |

<!-- INTERACTIVE FIGURE: THE SPACE OF POLITICAL DEBATE

Display a unit square with both axes divided into U and D, controlled by a shared Vote Share slider.

Colour U×U, U×D and D×U together, while distinguishing D×D.

Show the area of each rectangle and the combined area attributed to U.

Include a marker or preset for x = 1 - 1/sqrt(2), where U's combined area reaches exactly 50%.

This diagram should visually communicate the argument before introducing its algebra.
-->

Consider what occurs within each region.

In a U–U encounter, both individuals have already accepted the party's negotiated programme. They may retain personal disagreements, but these have been reconciled into a position they are prepared to support collectively.

In a U–D encounter, U brings an established political agreement, while D brings an individual preference that has not been reconciled with anyone else's.

For the purposes of this thought experiment, we propose that **an established collective agreement prevails over an uncoordinated individual preference when determining the capacity to advance a common political programme**.

This is not a claim that U's opinions are necessarily more correct or persuasive. Rather, U has accomplished the political task of constructing an actionable agreement.

The D–D region is different. Both individuals possess legitimate political preferences, but neither represents a common programme. Their encounter cannot therefore be attributed to an established collective agreement.

We consequently attribute the U–U, U–D and D–U regions to Unity, while retaining D–D as the space in which no collective agreement has emerged.

#### The Majority Criterion

The total proportion of potential political encounters in which U's established agreement prevails is:

\[
P_U=x^2+2x(1-x)
\]

Simplifying:

\[
\boxed{P_U=2x-x^2}
\]

We now propose a principle for calibrating majority legislative power:

**A unified political party should be capable of securing majority power when its established agreement prevails across at least half the space of potential political encounters.**

This principle concerns the minimum Vote Share at which majority power becomes possible. It does not guarantee majority power in an actual election, since opposing voters may themselves have formed substantial political agreements.

At the threshold:

\[
P_U=\frac12
\]

Therefore:

\[
2x-x^2=\frac12
\]

Rearranging and solving:

\[
x^2-2x+\frac12=0
\]

\[
\boxed{x_*=1-\frac1{\sqrt2}}
\]

This gives:

\[
U\approx29.2893\%
\]

\[
D\approx70.7107\%
\]

The ratio between the divided and united electorates is:

\[
\frac DU=\frac{1-x_*}{x_*}
\]

Substituting:

\[
\frac DU=\frac{1}{\sqrt2-1}
\]

Hence:

\[
\boxed{\frac DU=1+\sqrt2}
\]

The quantity \(1+\sqrt2\) is known as the **silver ratio**.

Our thought experiment therefore provides a precise criterion for SV:

**A party holding approximately 29.29% of the vote should be capable of reaching 50% legislative power when the remainder of the electorate is maximally divided.**

The result is a consequence of our proposed interpretation of political agreement within the space of potential encounters. It has been established independently of the Mandate Equation.

### The Innes Constant

We can now translate the majority criterion into a Mandate Coefficient.

Recall the Upper Bound of Power:

\[
f_{\max}(x;k)=
\frac{e^{kx}-1}{e^{kx}-1+k(1-x)}
\]

We require this curve to pass through the point established by the Unity-versus-Division thought experiment:

\[
\boxed{
\left(x_*,\frac12\right)
=
\left(1-\frac1{\sqrt2},\frac12\right)
}
\]

Therefore:

\[
f_{\max}(x_*;k)=\frac12
\]

Substituting:

\[
\frac{e^{kx_*}-1}
{e^{kx_*}-1+k(1-x_*)}
=\frac12
\]

Rearranging gives:

\[
e^{kx_*}-1=k(1-x_*)
\]

And substituting the silver-ratio threshold:

\[
\boxed{
e^{k(1-1/\sqrt2)}-1=\frac{k}{\sqrt2}
}
\]

This equation has a unique strictly positive numerical solution:

\[
\boxed{k\approx5.33684511056\ldots}
\]

We name this value the **Innes Constant**, denoted by the uppercase Greek letter lambda, \(\Lambda\):

\[
\boxed{\Lambda\approx5.33684511056\ldots}
\]

SV proposes the Innes Constant as its default Mandate Coefficient:

\[
\boxed{k=\Lambda}
\]

<!-- FIGURE: THE CALIBRATION OF THE INNES CONSTANT

Plot the complete Bounds of Power at k = Lambda, including:
- f_max(x; Lambda)
- f_min(x; Lambda)
- The Majority-Vote Boundary
- A horizontal line f = 0.5
- A vertical line x = x_*
- The highlighted intersection (x_*, 0.5), lying exactly on f_max

Label the intersection with x_* = 1 - 1/sqrt(2).

The graph should show that the coefficient has been selected specifically so that f_max passes through the intersection of the horizontal and vertical reference lines.

Optionally provide an interactive k-slider allowing the reader to move f_max above or below the intersection, then reset to Lambda.
-->

The consequence of this calibration is that **no party with less than approximately 29.29% of the vote can receive 50% or more of the ideal legislative power**, even when facing maximally divided opposition.

At the silver-ratio Vote Share itself, half the legislative power is reached only at the theoretical Upper Bound. When opposing voters form larger political agreements, their additional Mandate reduces U's Fraction of Power.

The Innes Constant therefore establishes both the default strength of SV's reward for unity and a theoretical lower limit on the electoral support required to secure majority power.

With the Mandate Equation and its default coefficient established, we can now turn to the practical implementation of electoral thresholds and the allocation of whole legislative seats.

## 4. Implementation

### 4.1 From Ideal Power to Actual Seats

We have established the Mandate Equation and proposed the Innes Constant, \(\Lambda\), as its default coefficient. Before translating our mathematical model into an electoral system, we can revisit our earlier thought experiments to see what this calibration produces.

First, consider five equally supported parties, each initially holding 20% of the vote. Two merge, producing a new party with 40%, while three independent parties retain 20% each.

With \(k=\Lambda\), the merged party receives **56.57% of legislative power**, while the remaining parties each receive 14.48%.

Now consider six initially equal parties, each holding one-sixth of the vote. Again, two merge, forming a party with one-third of the votes, against four parties holding one-sixth each.

This time, the merged party receives **46.19% of legislative power**, while its opponents each receive 13.45%.

<!-- FIGURE: Revisit the two merger scenarios with k = Lambda. For each, compare Vote Share and Fraction of Power. -->

These results confirm the distinction introduced during calibration: combining two of five equally supported political positions is sufficient to obtain majority power, while combining two of six is not.

#### Returning to Unity versus Division

We can also revisit our silver-ratio thought experiment.

We established that a party facing maximally divided opposition could reach 50% of legislative power with a Vote Share of:

\[
x_*=1-\frac{1}{\sqrt2}\approx29.2893\%
\]

However, this theoretical limit assumes arbitrarily many opposing parties, each with an increasingly small Vote Share.

What happens when we consider a finite legislature?

Imagine a parliament containing 650 seats, with Party U facing 325 equally supported opposition parties.

We can calculate the Vote Share at which U earns exactly half the ideal legislative power, leaving each opposing party with precisely one seat's worth of power:

\[
e^{\Lambda x}-1
=325\left(e^{\Lambda(1-x)/325}-1\right)
\]

Solving gives:

\[
\boxed{x\approx29.3604\%}
\]

This is just **0.0711 percentage points above** our theoretical silver-ratio threshold.

<!-- FIGURE: Compare the theoretical 29.2893% threshold with the finite 650-seat example at 29.3604%. Show U receiving half the ideal power against 325 equal opponents. -->

The result demonstrates how closely the theoretical Upper Bound can describe a finite election.

#### The Need for Whole Seats

So far, SV has operated with continuous Fractions of Power, \(f_i\).

Our 650-seat example was deliberately chosen to divide neatly into whole seats. Real elections rarely produce such convenient results.

A party might earn 24.6% of the legislative power in a 100-seat parliament, corresponding to an entitlement of 24.6 seats. But a legislature cannot allocate six-tenths of a seat.

We must therefore translate the continuous Fraction of Power into an integer number of seats, \(s_i\).

This process is called **seat apportionment**.

### 4.2 Seat Apportionment

#### From Mandate to Seat Quotas

Consider a hypothetical election contested by five political parties, competing for 100 legislative seats.

Using the default Mandate Coefficient \(k=\Lambda\), and our normalisation \(M(0.5)=1000\), we obtain:

| Party | Vote Share \(x_i\) | Mandate \(M_i\) | Power \(f_i\) | Ideal seats |
|---|---:|---:|---:|---:|
| A | 36% | 434.49 | 49.73% | 49.732 |
| B | 25% | 208.46 | 23.86% | 23.861 |
| C | 17% | 110.12 | 12.60% | 12.605 |
| D | 13% | 74.63 | 8.54% | 8.542 |
| E | 9% | 45.95 | 5.26% | 5.260 |
| **Total** | **100%** | **873.65** | **100%** | **100.000** |

The final column is calculated by multiplying each party's Fraction of Power by the size of the legislature.

For a legislature containing \(S\) seats, we define a party's **seat quota**, \(q_i\), as:

\[
\boxed{q_i=Sf_i}
\]

Because the Fractions of Power sum to one:

\[
\sum_iq_i=S
\]

The quotas therefore describe an ideal distribution of exactly \(S\) seats.

However, they are rarely whole numbers.

We might initially attempt to round each quota to the nearest integer.

For our five-party election, this produces:

\[
(50,\ 24,\ 13,\ 9,\ 5)
\]

But these add up to **101 seats**, even though only 100 are available.

Rounding each party independently cannot guarantee the correct overall allocation. We need a method that distributes exactly \(S\) whole seats while remaining as faithful as possible to the intended Fractions of Power.

#### Measuring Representation

Before selecting an apportionment method, it is useful to distinguish two different measures of representation.

The first compares a party's actual Seat Share with its original Vote Share.

We call this the **Advantage Ratio**, \(\alpha_i\):

\[
\boxed{\alpha_i=\frac{s_i/S}{x_i}}
\]

An Advantage Ratio of one indicates exactly proportional representation. A value above one indicates over-representation relative to Vote Share; a value below one indicates under-representation.

SV deliberately introduces differences in this ratio, rewarding larger political agreements with greater legislative power per voter.

The second measure compares a party's actual Seat Share with the Fraction of Power calculated by SV.

We call this the **Apportionment Ratio**, \(\beta_i\):

\[
\boxed{\beta_i=\frac{s_i/S}{f_i}=\frac{s_i}{q_i}}
\]

An Apportionment Ratio of one means that a party has received precisely its ideal entitlement. Values above or below one indicate that the allocation of whole seats has increased or reduced its representation relative to the intended result.

Unlike the Advantage Ratio, **we want the Apportionment Ratio to remain as close to one as possible**.

The two measures are related:

\[
\boxed{\alpha_i=\frac{f_i}{x_i}\beta_i}
\]

This separates a party's actual representation advantage into two components: the intentional strengthening produced by the Mandate Equation, \(f_i/x_i\), and the additional effect of apportionment, \(\beta_i\).

SV deliberately shapes the first. We want the second to introduce as little distortion as possible.

#### Visualising Apportionment Error

We can visualise the difference between intended and actual representation on a graph.

Place each party's Fraction of Power, \(f_i\), on the horizontal axis, and its actual Seat Share, \(s_i/S\), on the vertical axis.

An ideal allocation would place every party on the diagonal line:

\[
\boxed{\frac{s_i}{S}=f_i}
\]

Points above this line represent parties receiving more seats than intended; those below represent parties receiving fewer.

The vertical distance between a party's point and the diagonal is its absolute deviation from the intended Seat Share.

<!-- INTERACTIVE FIGURE: APPORTIONMENT ERROR

Using the five-party election:

1. Plot Fraction of Power (horizontal) against actual Seat Share (vertical), with identity line y = x.
2. Reveal vertical deviations connecting the points to the line.
3. Illustrate how squaring these deviations penalises larger errors.
4. Introduce weighting by 1/f_i, explaining why the same absolute Seat Share error matters more for parties with smaller entitlements.
5. Display the total weighted squared error and allow the reader to compare alternative whole-seat allocations.

The diagonal is a fixed ideal relationship, not a fitted regression line.
-->

Our challenge is to find the allocation that minimises the collective effect of these deviations.

#### Minimising Apportionment Error

For each party, the relative deviation from its intended allocation is:

\[
\beta_i-1
\]

Squaring this quantity ensures that both over-allocation and under-allocation contribute positive error, while larger deviations receive greater penalties.

However, parties have different ideal entitlements. A difference of one seat is proportionally much more significant for a party entitled to two seats than for a party entitled to fifty.

We therefore weight each party's squared relative error by its seat quota, \(q_i\).

Adding these contributions across the election gives our **total weighted squared apportionment error**, \(\mathcal L\):

\[
\boxed{
\mathcal L=\sum_iq_i(\beta_i-1)^2
}
\]

Substituting \(\beta_i=s_i/q_i\):

\[
\mathcal L
=\sum_iq_i\left(\frac{s_i}{q_i}-1\right)^2
\]

Simplifying:

\[
\boxed{
\mathcal L=\sum_i\frac{(s_i-q_i)^2}{q_i}
}
\]

Each party contributes the squared difference between its actual and ideal seat allocation, divided by its ideal quota.

Our objective is to minimise this total error, subject to the requirement that exactly \(S\) whole seats are allocated:

\[
\boxed{
\min\mathcal L
}
\]

subject to:

\[
\sum_i s_i=S,
\qquad s_i\in\mathbb Z_{\geq0}
\]

This is a **weighted least-squares problem**.

We are not attempting to discover an unknown relationship between two variables, as in a regression. We already know the intended relationship: actual Seat Share should equal the Fraction of Power calculated by SV.

Instead, we seek the integer allocation that deviates as little as possible from that target, according to our chosen measure of error.

#### Deriving the Allocation Rule

We can solve this problem by considering how the total error changes whenever we award another seat.

Suppose Party \(i\) currently holds \(s_i\) seats, with an ideal quota \(q_i\).

Its contribution to the total error is:

\[
\mathcal L_i=\frac{(s_i-q_i)^2}{q_i}
\]

If we award it another seat, this becomes:

\[
\mathcal L_i'=\frac{(s_i+1-q_i)^2}{q_i}
\]

The change in error is:

\[
\Delta\mathcal L_i
=\mathcal L_i'-\mathcal L_i
\]

Therefore:

\[
\Delta\mathcal L_i
=\frac{(s_i+1-q_i)^2-(s_i-q_i)^2}{q_i}
\]

Expanding and simplifying gives:

\[
\boxed{
\Delta\mathcal L_i=\frac{2s_i+1}{q_i}-2
}
\]

This tells us precisely how the total error would change if we awarded the next seat to a particular party.

We want to award that seat where it produces the smallest increase in error, or the greatest reduction.

Because the final term, \(-2\), is identical for every party, it has no effect on which party we choose.

We therefore seek the smallest:

\[
\frac{2s_i+1}{q_i}
\]

Equivalently, the largest:

\[
\boxed{\frac{q_i}{2s_i+1}}
\]

Recall that the seat quota is:

\[
q_i=S\frac{M_i}{\Sigma M}
\]

The factors \(S\) and \(1/\Sigma M\) are common to every party, so they do not affect their relative priorities.

Removing these common factors leaves:

\[
\boxed{
P_i=\frac{M_i}{2s_i+1}
}
\]

where \(P_i\) is the party's priority for receiving the next seat.

This produces a straightforward allocation process:

| Seat sought | Priority |
|---|---|
| First seat | \(M_i/1\) |
| Second seat | \(M_i/3\) |
| Third seat | \(M_i/5\) |
| Fourth seat | \(M_i/7\) |
| Fifth seat | \(M_i/9\) |
| … | … |

We award each successive seat to the party with the greatest remaining priority.

As a party accumulates seats, the denominator increases, reducing the priority of its next seat.

Importantly, the incremental error associated with successive seats for the same party increases strictly. By selecting the smallest available increase at every step, we obtain the allocation that minimises the total weighted squared error across the legislature.

**We have therefore derived a method of allocating whole seats directly from the requirement to minimise apportionment error.**

#### The Sainte-Laguë Method

This method is not unique to Strengthened Voting.

It is an established method of electoral apportionment called **Sainte-Laguë**, also known as the Webster method.

Sainte-Laguë traditionally allocates seats in proportion to votes. SV instead applies it to Political Mandate, allocating seats in proportion to the Fractions of Power generated by the Mandate Equation.

Beyond minimising the weighted squared error we have just derived, Sainte-Laguë possesses several well-studied properties:

- **House monotonicity:** with fixed party weights and eligibility, increasing the number of seats cannot cause a party to lose a seat.
- **Little systematic size bias:** unlike some alternative methods, Sainte-Laguë does not systematically favour larger parties through its rounding rule.
- **Consistency:** the allocation rule remains coherent when comparing the relative seat allocations of subsets of parties.

These properties are particularly attractive for SV. The Mandate Equation already provides our intended strengthening of larger parties; we do not want apportionment to introduce an additional systematic bias.

The mathematical advantages, limitations and alternatives to Sainte-Laguë are examined further in [Evaluation: Apportionment Methods](/explanation/evaluation#apportionment-methods).

#### A Common Divisor

Although we derived Sainte-Laguë through sequential seat allocation, it can also be implemented using a common divisor.

Recall:

\[
q_i=S\frac{M_i}{\Sigma M}
\]

This can be rewritten:

\[
q_i=\frac{M_i}{d_0},
\qquad
d_0=\frac{\Sigma M}{S}
\]

Here, \(d_0\) is the **standard divisor**, representing the amount of Mandate corresponding to one ideal seat.

As we have seen, rounding every quota independently may produce too many or too few seats.

Sainte-Laguë resolves this by adjusting the divisor to a value \(d\) such that:

\[
\boxed{
\sum_i\operatorname{round}\left(\frac{M_i}{d}\right)=S
}
\]

If the rounded total is too high, we increase \(d\). If it is too low, we decrease it.

For our five-party election, a divisor of approximately \(8.7786\) produces exactly 100 seats:

\[
\boxed{(49,\ 24,\ 13,\ 9,\ 5)}
\]

This is precisely the allocation produced by the sequential method.

The two approaches are mathematically equivalent: the common-divisor method provides an efficient way of calculating the same result without awarding every seat individually.

<!-- OPTIONAL FIGURE: A common-divisor slider showing how adjusting d changes rounded seat allocations until exactly 100 seats are awarded. -->

#### Seat Allocation as the Legislature Grows

There is another useful way to understand how Sainte-Laguë behaves.

Imagine beginning with an empty legislature and awarding seats sequentially.

At one seat, the leading party holds 100% of the legislature. At two seats, two parties might each hold 50%. At three, the first party might receive another seat, giving it two-thirds of the total.

Initially, these proportions fluctuate dramatically because every additional seat represents a substantial fraction of the legislature.

As more seats are awarded, each additional seat has a progressively smaller effect, and the distribution approaches the intended Fractions of Power.

<!-- LINKED INTERACTIVE GRAPHS: SEQUENTIAL SEAT ALLOCATION

Using the five-party election and Sainte-Laguë:

Graph 1:
- Horizontal axis: number of seats allocated, N
- Vertical axis: each party's Seat Share, s_i/N
- Display horizontal target lines at f_i

Graph 2:
- Horizontal axis: N
- Vertical axis: Advantage Ratio, alpha_i = (s_i/N)/x_i
- Display horizontal target lines at f_i/x_i

Both graphs share a seat counter, party colours and Play/Pause controls.
Allow the reader to step through individual seats and inspect changes in representation.

The horizontal-axis variable N denotes seats allocated so far; S remains the final intended legislature size.
-->

The first graph illustrates how Seat Share approaches the intended Fraction of Power.

The second illustrates how the Advantage Ratio approaches its intended continuous value:

\[
\alpha_i^{\mathrm{ideal}}=\frac{f_i}{x_i}
\]

But the graphs also reveal something important: **awarding the first seat to a small party can cause an exceptionally large jump in its representation**.

Sainte-Laguë minimises overall apportionment error, but cannot eliminate the discontinuities created by whole seats.

This brings us to the final component of SV.

### 4.3 The Electoral Threshold

#### The Problem of Very Small Parties

Consider a second hypothetical election, with six political parties and a legislature of 100 seats.

Once again, we use the Innes Constant and apply Sainte-Laguë, initially without any Electoral Threshold.

| Party | Vote Share | Ideal seats | Actual seats | Advantage \(\alpha_i\) | Apportionment \(\beta_i\) |
|---|---:|---:|---:|---:|---:|
| A | 24.9% | 28.375 | 28 | 1.124 | 0.987 |
| B | 21.7% | 22.316 | 22 | 1.014 | 0.986 |
| C | 21.4% | 21.799 | 22 | 1.028 | 1.009 |
| D | 18.5% | 17.208 | 17 | 0.919 | 0.988 |
| E | 12.6% | 9.800 | 10 | 0.794 | 1.020 |
| **F** | **0.9%** | **0.503** | **1** | **1.111** | **1.989** |

Party F receives only 0.9% of the votes, corresponding to approximately half a seat's worth of ideal power.

Under Sainte-Laguë, it receives its first seat only when the **100th seat** is awarded.

Before that award, Party F holds no seats and has an Advantage Ratio of zero.

After receiving the final seat, it holds 1% of the legislature despite receiving only 0.9% of the vote:

\[
\boxed{
\alpha_F=\frac{0.01}{0.009}\approx1.111
}
\]

Its Apportionment Ratio becomes:

\[
\boxed{\beta_F\approx1.989}
\]

Party F has received almost twice its intended entitlement. Moreover, its Advantage Ratio is now higher than those of several substantially larger parties.

This is contrary to the strengthening intended by the Mandate Equation.

<!-- FIGURE: Return to the linked allocation graphs using the six-party election. Pause at 99 seats, then award the 100th to Party F. Highlight the jump in its Advantage Ratio from zero to 1.111, compared with its intended value of approximately 0.559. -->

Sainte-Laguë has not made a mistake. It has correctly minimised the total weighted squared apportionment error.

The problem is that a party entitled to approximately half a seat must receive either zero or one whole seat.

When this happens at the very end of the allocation, there are insufficient additional seats for its representation to approach the intended continuous result.

This motivates an additional requirement.

#### Establishing an Electoral Threshold

Suppose a party receives exactly one seat in a legislature of \(S\) seats.

Its Advantage Ratio is:

\[
\alpha_i=\frac{1}{Sx_i}
\]

For that party to avoid being over-represented relative to its Vote Share, we require:

\[
\alpha_i\leq1
\]

Therefore:

\[
\frac{1}{Sx_i}\leq1
\]

Rearranging:

\[
\boxed{x_i\geq\frac1S}
\]

This establishes a useful boundary: **a party receiving one seat cannot be over-represented relative to its votes if its Vote Share is at least \(1/S\)**.

SV therefore proposes an **Electoral Threshold**, \(\tau\), satisfying:

\[
\boxed{\tau\geq\frac1S}
\]

The minimum value, \(\tau=1/S\), prevents a party with less than one seat's proportional share of the electorate from acquiring a whole seat.

For example:

| Legislature | Minimum threshold \(1/S\) |
|---|---:|
| 100 seats | 1.0000% |
| 200 seats | 0.5000% |
| 650 seats | 0.153846% |

A higher threshold may be selected as an additional institutional requirement. However, unlike the mathematical argument for the minimum, choosing a higher threshold is a normative decision about the level of electoral support required for representation.

SV adopts \(1/S\) as its reference threshold, while permitting higher values.

The consequences of alternative thresholds, including their effects on representation and political diversity, are explored in [Evaluation: Electoral Thresholds](/explanation/evaluation#electoral-thresholds).

#### Expressing the Threshold in Mandate

The Mandate Equation is strictly increasing, so any threshold in Vote Share can also be expressed in Mandate points.

Recall:

\[
M(x)=A(e^{kx}-1)
\]

For an Electoral Threshold \(\tau\), the corresponding minimum Mandate is:

\[
\boxed{M_\tau=A(e^{k\tau}-1)}
\]

Using our default coefficient and normalisation:

\[
\boxed{
M_\tau=
1000\frac{e^{\Lambda\tau}-1}{e^{\Lambda/2}-1}
}
\]

Thus, the Electoral Threshold can be applied equivalently through Vote Share or Mandate.

#### Excluding Ineligible Parties

Let \(\mathcal E\) denote the set of parties meeting the Electoral Threshold:

\[
\boxed{\mathcal E=\{i:x_i\geq\tau\}}
\]

Parties that fail to qualify receive no seats, and their Mandate is excluded from the total used for seat allocation.

For each eligible party, its Fraction of Power becomes:

\[
\boxed{
f_i=\frac{M_i}{\displaystyle\sum_{j\in\mathcal E}M_j}
}
\]

Its seat quota is therefore:

\[
\boxed{
q_i=S\frac{M_i}{\displaystyle\sum_{j\in\mathcal E}M_j}
}
\]

The quotas are then apportioned through Sainte-Laguë.

Crucially, the eligible parties retain their original Vote Shares and Mandates. We do not redistribute excluded votes and then recalculate the Mandate Equation.

Instead, we exclude ineligible Mandate from the denominator, allowing qualifying parties to divide the available seats according to their relative political power.

Returning to our six-party example, Party F's Vote Share of 0.9% falls below the reference threshold of 1%.

It is therefore excluded.

Recalculating the eligible parties' Fractions of Power and applying Sainte-Laguë gives:

\[
\boxed{(29,\ 22,\ 22,\ 17,\ 10,\ 0)}
\]

All 100 seats are allocated among the five qualifying parties.

The threshold addresses our first-seat anomaly, but it introduces its own consequences by changing which political Mandates participate in the final allocation.

Those consequences require separate examination in Evaluation.

### 4.4 The Complete SV Process

We can now summarise the procedure for converting an election's votes into legislative seats.

Given party Vote Shares \(x_i\), a legislature containing \(S\) seats, a Mandate Coefficient \(k\), and an Electoral Threshold \(\tau\geq1/S\):

1. **Determine eligibility.** Identify parties satisfying \(x_i\geq\tau\).
2. **Calculate Political Mandate.** Apply \(M_i=A(e^{kx_i}-1)\) to each eligible party.
3. **Calculate Fraction of Power.** Divide each eligible party's Mandate by the combined Mandate of all eligible parties.
4. **Calculate seat quotas.** Multiply each Fraction of Power by \(S\).
5. **Apportion whole seats.** Apply Sainte-Laguë to distribute exactly \(S\) seats while minimising total weighted squared apportionment error.

The reference implementation uses the Innes Constant, \(k=\Lambda\), and the minimum Electoral Threshold, \(\tau=1/S\).

<!-- FIGURE: CONCLUDING SV PROCESS

Votes
  ↓
Electoral Threshold (tau)
  ↓
Eligible Political Mandate (M)
  ↓
Fraction of Power (f)
  ↓
Seat Quota (q)
  ↓
Sainte-Laguë Apportionment
  ↓
Whole Seats (s)

Display the governing equation beside each stage.
-->

The Mandate Equation determines how political agreement is rewarded.

The Innes Constant establishes SV's proposed default strength of that reward.

Sainte-Laguë translates the resulting Fractions of Power into whole legislative seats with minimal weighted squared apportionment error.

The Electoral Threshold prevents a particular form of disproportionate representation arising from the indivisibility of seats.

Together, these rules establish the proposed mechanism for translating electoral support into legislative representation.

We can now examine whether the results fulfil the political objectives that motivated Strengthened Voting, how they compare with alternative electoral systems, and what compromises they introduce.

That is the subject of **Evaluation of Strengthened Voting**.