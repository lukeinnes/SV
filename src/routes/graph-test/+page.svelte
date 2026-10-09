<script lang="ts">
	import ConsolidationMultiplier from '$lib/components/graphs/ConsolidationMultiplier.svelte';
	import MandateCurve from '$lib/components/graphs/MandateCurve.svelte';
	import MandatePerVote from '$lib/components/graphs/MandatePerVote.svelte';
	import MuscleGraph from '$lib/components/graphs/MuscleGraph.svelte';
	import SeatBlocks, { type SeatBlocksParty } from '$lib/components/graphs/SeatBlocks.svelte';
	import { LAMBDA } from '$lib/sv/constants';
	import { calculateA } from '$lib/sv/parameters';

	type SampleParty = {
		id: string;
		label: string;
		shortLabel: string;
		colour: string;
		voteShare: number;
		actualWeight: number;
	};

	let k = $state(LAMBDA);
	let totalSeats = $state(100);

	const sampleParties: SampleParty[] = [
		{
			id: 'party-a',
			label: 'Party A',
			shortLabel: 'A',
			colour: '#E4003B',
			voteShare: 0.42,
			actualWeight: 0.52
		},
		{
			id: 'party-b',
			label: 'Party B',
			shortLabel: 'B',
			colour: '#0087DC',
			voteShare: 0.31,
			actualWeight: 0.34
		},
		{
			id: 'party-c',
			label: 'Party C',
			shortLabel: 'C',
			colour: '#FAA61A',
			voteShare: 0.17,
			actualWeight: 0.1
		},
		{
			id: 'party-d',
			label: 'Party D',
			shortLabel: 'D',
			colour: '#78B82A',
			voteShare: 0.1,
			actualWeight: 0.04
		}
	];

	let a = $derived(calculateA(k));
	let baselineTotalMandate = $derived(a * k);

	function mandate(x: number): number {
		return a * Math.expm1(k * x);
	}

	function allocateByWeights(weights: number[], seats: number): number[] {
		const totalWeight = weights.reduce((total, weight) => total + Math.max(0, weight), 0);

		if (totalWeight <= 0) {
			return weights.map(() => 0);
		}

		const quotas = weights.map((weight) => (Math.max(0, weight) / totalWeight) * seats);
		const floors = quotas.map((quota) => Math.floor(quota));
		let remaining = seats - floors.reduce((total, value) => total + value, 0);

		const order = quotas
			.map((quota, index) => ({
				index,
				remainder: quota - floors[index]
			}))
			.sort((left, right) => right.remainder - left.remainder);

		for (let i = 0; i < order.length && remaining > 0; i += 1) {
			floors[order[i].index] += 1;
			remaining -= 1;
		}

		return floors;
	}

	let actualSeatAllocation = $derived(
		allocateByWeights(
			sampleParties.map((party) => party.actualWeight),
			totalSeats
		)
	);

	let svSeatAllocation = $derived(
		allocateByWeights(
			sampleParties.map((party) => mandate(party.voteShare)),
			totalSeats
		)
	);

	let seatBlockParties = $derived(
		sampleParties.map((party, index): SeatBlocksParty => ({
			id: party.id,
			label: party.label,
			shortLabel: party.shortLabel,
			colour: party.colour,
			voteShare: party.voteShare,
			actualSeats: actualSeatAllocation[index],
			svSeats: svSeatAllocation[index]
		}))
	);

	let sampleTotalMandate = $derived(
		sampleParties.reduce((total, party) => total + mandate(party.voteShare), 0)
	);

	let sampleConsolidationIndex = $derived(
		(100 * (sampleTotalMandate - baselineTotalMandate)) / (2000 - baselineTotalMandate)
	);

	let musclePoints = $derived(
		sampleParties.map((party) => ({
			pointId: party.id,
			label: party.label,
			x: party.voteShare,
			f: mandate(party.voteShare) / sampleTotalMandate,
			colour: party.colour
		}))
	);

	function formatK(value: number): string {
		if (Math.abs(value - LAMBDA) < 1e-12) {
			return `Λ ${LAMBDA.toPrecision(7)}…`;
		}

		return value.toFixed(2);
	}

	function formatNumber(value: number): string {
		return value.toLocaleString(undefined, {
			maximumFractionDigits: 2
		});
	}
</script>

<svelte:head>
	<title>Graph test — Strengthened Voting</title>
</svelte:head>

<main>
	<section class="hero">
		<p class="eyebrow">Development graph test</p>
		<h1>Graph test</h1>
		<p>
			This page tests the main explanatory and election-result graphs for Strengthened Voting. The
			k slider updates the mathematical graphs and the SV seat allocation. The seat slider tests
			whether discrete seat bars remain legible from small to large assemblies.
		</p>
	</section>

	<section class="controls">
		<div>
			<label for="k-slider">Mandate parameter k</label>
			<strong>{formatK(k)}</strong>
		</div>

		<div>
			<label for="seat-slider">Total seats</label>
			<strong>{totalSeats}</strong>
		</div>

		<div>
			<span>Sample total mandate</span>
			<strong>{formatNumber(sampleTotalMandate)}</strong>
		</div>

		<div>
			<span>Sample CI</span>
			<strong>{formatNumber(sampleConsolidationIndex)}</strong>
		</div>

		<button type="button" onclick={() => (k = LAMBDA)}>Reset to Λ</button>

		<div class="slider-row">
			<label for="k-slider">k</label>
			<input id="k-slider" type="range" min="0.5" max="12" step="0.01" bind:value={k} />
		</div>

		<div class="slider-row">
			<label for="seat-slider">Seats</label>
			<input
				id="seat-slider"
				type="range"
				min="50"
				max="1000"
				step="1"
				bind:value={totalSeats}
			/>
		</div>
	</section>

	<section class="graph-section">
		<div class="section-heading">
			<p class="section-kicker">Election result display</p>
			<h2>Vote share and seat blocks</h2>
		</div>

		<SeatBlocks parties={seatBlockParties} totalSeats={totalSeats} />
	</section>

	<section class="graph-section">
		<div class="section-heading">
			<p class="section-kicker">Mandate equation</p>
			<h2>Mandate curve</h2>
		</div>

		<MandateCurve k={k} />
	</section>

	<section class="graph-section">
		<div class="section-heading">
			<p class="section-kicker">Consolidation reward</p>
			<h2>Consolidation multiplier</h2>
		</div>

		<ConsolidationMultiplier k={k} />
	</section>

	<section class="graph-section">
		<div class="section-heading">
			<p class="section-kicker">Mandate efficiency</p>
			<h2>Mandate per vote share</h2>
		</div>

		<MandatePerVote k={k} />
	</section>

	<section class="graph-section">
		<div class="section-heading">
			<p class="section-kicker">Bounds of power</p>
			<h2>Muscle graph</h2>
		</div>

		<MuscleGraph
			k={k}
			highlightTotalMandate={sampleTotalMandate}
			points={musclePoints}
		/>
	</section>
</main>

<style>
	main {
		max-width: 980px;
		margin: 0 auto;
		padding: 32px 20px 64px;
	}

	.hero {
		margin-bottom: 20px;
	}

	.eyebrow,
	.section-kicker {
		margin: 0 0 8px;
		color: #2563eb;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	h1 {
		margin: 0 0 10px;
		font-size: clamp(2.4rem, 6vw, 4.4rem);
		letter-spacing: -0.05em;
	}

	.hero p {
		max-width: 780px;
		color: #475569;
		font-size: 1.08rem;
		line-height: 1.55;
	}

	.controls {
		position: sticky;
		top: 12px;
		z-index: 20;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr auto;
		gap: 14px;
		align-items: center;
		margin-bottom: 24px;
		border: 1px solid #cbd5e1;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.94);
		padding: 18px;
		box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
		backdrop-filter: blur(12px);
	}

	label,
	.controls span {
		display: block;
		color: #475569;
		font-weight: 900;
	}

	.controls strong {
		display: block;
		margin-top: 4px;
		font-size: 1.25rem;
	}

	button {
		border: 1px solid #cbd5e1;
		border-radius: 999px;
		background: white;
		color: #0f172a;
		padding: 10px 14px;
		font: inherit;
		font-weight: 900;
		cursor: pointer;
	}

	button:hover {
		border-color: #93c5fd;
		background: #eff6ff;
		color: #1d4ed8;
	}

	.slider-row {
		display: grid;
		grid-column: 1 / -1;
		grid-template-columns: 82px 1fr;
		gap: 12px;
		align-items: center;
	}

	input[type='range'] {
		box-sizing: border-box;
		width: 100%;
	}

	.graph-section {
		display: grid;
		gap: 12px;
		margin-top: 28px;
	}

	.section-heading {
		display: grid;
		gap: 2px;
	}

	.graph-section h2 {
		margin: 0;
		color: #0f172a;
		font-size: clamp(1.7rem, 3vw, 2.4rem);
		letter-spacing: -0.04em;
	}

	@media (max-width: 1040px) {
		.controls {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 620px) {
		.controls {
			grid-template-columns: 1fr;
		}

		button {
			width: fit-content;
		}

		.slider-row {
			grid-template-columns: 1fr;
			gap: 6px;
		}
	}
</style>