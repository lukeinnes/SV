<script lang="ts">
	import ConsolidationMultiplier from '$lib/components/graphs/ConsolidationMultiplier.svelte';
	import MandateCurve from '$lib/components/graphs/MandateCurve.svelte';
	import MandatePerVote from '$lib/components/graphs/MandatePerVote.svelte';
	import MuscleGraph from '$lib/components/graphs/MuscleGraph.svelte';
	import SeatBlocks, { type SeatBlocksParty } from '$lib/components/graphs/SeatBlocks.svelte';
	import { countryDatasets, type CountryDataset } from '$lib/data/registry';
	import type { Election } from '$lib/data/types';
	import { enrichElectionResults } from '$lib/data/lookup';
	import { calculateRealElection, type RealElectionCalculation } from '$lib/sv/calculateRealElection';
	import { LAMBDA } from '$lib/sv/constants';
	import { calculateA } from '$lib/sv/parameters';

	type TestMode = 'real' | 'synthetic';

	type SampleParty = {
		id: string;
		label: string;
		shortLabel: string;
		colour: string;
		voteShare: number;
		actualWeight: number;
	};

	type MusclePoint = {
		pointId: string;
		label: string;
		x: number;
		f: number;
		colour: string;
	};

	let k = $state(LAMBDA);
	let testMode = $state<TestMode>('real');

	const initialDataset = countryDatasets[0];
	const initialElection =
		initialDataset?.elections[initialDataset.elections.length - 1] ?? initialDataset?.elections[0];

	let selectedCountryId = $state(initialDataset?.country.id ?? '');
	let selectedElectionId = $state(initialElection?.id ?? '');

	let syntheticSeats = $state(100);

	const minK = 0.01;
	const maxK = 12;
	const kStep = 0.01;

	const minSeats = 50;
	const maxSeats = 1000;
	const seatStep = 1;

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
			shortLabel: 'BBBB',
			colour: '#0087DC',
			voteShare: 0.31,
			actualWeight: 0.34
		},
		{
			id: 'party-c',
			label: 'Party C',
			shortLabel: 'CCC',
			colour: '#FAA61A',
			voteShare: 0.17,
			actualWeight: 0.1
		},
		{
			id: 'party-d',
			label: 'Party D',
			shortLabel: 'DDDDDD',
			colour: '#78B82A',
			voteShare: 0.1,
			actualWeight: 0.04
		}
	];

	let selectedDataset = $derived(
		countryDatasets.find((dataset) => dataset.country.id === selectedCountryId) ?? countryDatasets[0]
	);

	let electionOptions = $derived(selectedDataset?.elections ?? []);

	let selectedElection = $derived(
		electionOptions.find((election) => election.id === selectedElectionId) ??
			electionOptions[electionOptions.length - 1]
	);

	$effect(() => {
		if (!selectedDataset) return;

		const selectedElectionStillExists = selectedDataset.elections.some(
			(election) => election.id === selectedElectionId
		);

		if (!selectedElectionStillExists) {
			selectedElectionId = getDefaultElectionId(selectedDataset);
		}
	});

	let a = $derived(calculateA(k));
	let baselineTotalMandate = $derived(a * k);

	function getDefaultElectionId(dataset: CountryDataset): string {
		return dataset.elections[dataset.elections.length - 1]?.id ?? dataset.elections[0]?.id ?? '';
	}

	function handleCountryChange(event: Event) {
		const target = event.currentTarget as HTMLSelectElement;
		const nextCountryId = target.value;
		const nextDataset = countryDatasets.find((dataset) => dataset.country.id === nextCountryId);

		selectedCountryId = nextCountryId;

		if (nextDataset) {
			selectedElectionId = getDefaultElectionId(nextDataset);
		}
	}

	function mandate(x: number): number {
		return a * Math.expm1(k * x);
	}

	function clamp(value: number, min: number, max: number): number {
		return Math.min(max, Math.max(min, value));
	}

	function wheelDirection(event: WheelEvent): number {
		if (event.deltaY < 0) return 1;
		if (event.deltaY > 0) return -1;
		return 0;
	}

	function handleKWheel(event: WheelEvent) {
		const direction = wheelDirection(event);

		if (direction === 0) {
			return;
		}

		event.preventDefault();
		k = Number(clamp(k + direction * kStep, minK, maxK).toFixed(2));
	}

	function handleSeatWheel(event: WheelEvent) {
		if (testMode === 'real') {
			return;
		}

		const direction = wheelDirection(event);

		if (direction === 0) {
			return;
		}

		event.preventDefault();
		syntheticSeats = Math.round(clamp(syntheticSeats + direction * seatStep, minSeats, maxSeats));
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

	function visibleColour(colour: string): string {
		return colour.toLowerCase() === '#ffffff' ? '#94a3b8' : colour;
	}

	function makeRealSeatBlockParties(
		election: Election,
		dataset: CountryDataset,
		calculation: RealElectionCalculation
	): SeatBlocksParty[] {
		const calculationByPartyId = new Map(
			calculation.parties.map((party) => [party.partyId, party])
		);

		return enrichElectionResults(election, dataset.parties).map((row): SeatBlocksParty => {
			const calculatedParty = calculationByPartyId.get(row.partyId);

			return {
				id: row.partyId,
				label: row.usualName,
				shortLabel: row.shortName,
				colour: visibleColour(row.colour),
				voteShare: row.voteShare,
				actualSeats: row.seatsWon,
				svSeats: calculatedParty?.svSeats ?? 0
			};
		});
	}

	let syntheticActualSeatAllocation = $derived(
		allocateByWeights(
			sampleParties.map((party) => party.actualWeight),
			syntheticSeats
		)
	);

	let syntheticSvSeatAllocation = $derived(
		allocateByWeights(
			sampleParties.map((party) => mandate(party.voteShare)),
			syntheticSeats
		)
	);

	let syntheticSeatBlockParties = $derived(
		sampleParties.map((party, index): SeatBlocksParty => ({
			id: party.id,
			label: party.label,
			shortLabel: party.shortLabel,
			colour: party.colour,
			voteShare: party.voteShare,
			actualSeats: syntheticActualSeatAllocation[index],
			svSeats: syntheticSvSeatAllocation[index]
		}))
	);

	let syntheticTotalMandate = $derived(
		sampleParties.reduce((total, party) => total + mandate(party.voteShare), 0)
	);

	let realCalculation = $derived(
		selectedDataset && selectedElection
			? calculateRealElection(selectedElection, selectedDataset.parties, k)
			: undefined
	);

	let realSeatBlockParties = $derived(
		selectedDataset && selectedElection && realCalculation
			? makeRealSeatBlockParties(selectedElection, selectedDataset, realCalculation)
			: []
	);

	let activeSeatBlockParties = $derived(
		testMode === 'real' ? realSeatBlockParties : syntheticSeatBlockParties
	);

	let activeTotalSeats = $derived(
		testMode === 'real' && selectedElection ? selectedElection.totalSeats : syntheticSeats
	);

	let activeTotalMandate = $derived(
		testMode === 'real' && realCalculation ? realCalculation.totalMandate : syntheticTotalMandate
	);

	let activeConsolidationIndex = $derived(
		(100 * (activeTotalMandate - baselineTotalMandate)) / (2000 - baselineTotalMandate)
	);

	let syntheticMusclePoints = $derived(
		sampleParties.map((party): MusclePoint => ({
			pointId: party.id,
			label: party.label,
			x: party.voteShare,
			f: mandate(party.voteShare) / syntheticTotalMandate,
			colour: party.colour
		}))
	);

	let realMusclePoints = $derived(
		realCalculation
			? realCalculation.parties
					.filter((party) => party.eligible)
					.map((party): MusclePoint => ({
						pointId: party.partyId,
						label: party.usualName,
						x: party.voteShare,
						f: party.fractionOfPower,
						colour: visibleColour(party.colour)
					}))
			: []
	);

	let musclePoints = $derived(testMode === 'real' ? realMusclePoints : syntheticMusclePoints);

	let activeCaseLabel = $derived(
		testMode === 'real' && selectedDataset && selectedElection
			? `${selectedDataset.country.name} — ${selectedElection.briefName}`
			: 'Synthetic four-party test'
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
			This page tests the main explanatory and election-result graphs for Strengthened Voting.
			Use the header controls to switch between a clean synthetic case and real election data.
		</p>
	</section>

	<section class="controls">
		<div class="selector-block">
			<label for="test-mode">Test case</label>
			<select id="test-mode" bind:value={testMode}>
				<option value="real">Real election</option>
				<option value="synthetic">Synthetic</option>
			</select>
		</div>

		<div class="selector-block">
			<label for="country-selector">Country</label>
			<select
				id="country-selector"
				bind:value={selectedCountryId}
				onchange={handleCountryChange}
				disabled={testMode === 'synthetic'}
			>
				{#each countryDatasets as dataset (dataset.country.id)}
					<option value={dataset.country.id}>{dataset.country.name}</option>
				{/each}
			</select>
		</div>

		<div class="selector-block election-selector">
			<label for="election-selector">Election</label>
			<select
				id="election-selector"
				bind:value={selectedElectionId}
				disabled={testMode === 'synthetic'}
			>
				{#each electionOptions as election (election.id)}
					<option value={election.id}>{election.briefName}</option>
				{/each}
			</select>
		</div>

		<div>
			<span>Selected case</span>
			<strong>{activeCaseLabel}</strong>
		</div>

		<div>
			<label for="k-slider">Mandate parameter k</label>
			<strong>{formatK(k)}</strong>
		</div>

		<div>
			<span>Total seats</span>
			<strong>{activeTotalSeats}</strong>
		</div>

		<div>
			<span>Total mandate</span>
			<strong>{formatNumber(activeTotalMandate)}</strong>
		</div>

		<div>
			<span>CI</span>
			<strong>{formatNumber(activeConsolidationIndex)}</strong>
		</div>

		<button type="button" onclick={() => (k = LAMBDA)}>Reset to Λ</button>

		<div class="slider-row">
			<label for="k-slider">k</label>
			<input
				id="k-slider"
				type="range"
				min={minK}
				max={maxK}
				step={kStep}
				bind:value={k}
				onwheel={handleKWheel}
			/>
		</div>

		<div class:disabled-row={testMode === 'real'} class="slider-row">
			<label for="seat-slider">Synthetic seats</label>
			<input
				id="seat-slider"
				type="range"
				min={minSeats}
				max={maxSeats}
				step={seatStep}
				bind:value={syntheticSeats}
				onwheel={handleSeatWheel}
				disabled={testMode === 'real'}
			/>
		</div>
	</section>

	<section class="graph-section">
		<div class="section-heading">
			<p class="section-kicker">Election result display</p>
			<h2>Vote share and seat blocks</h2>
		</div>

		<SeatBlocks parties={activeSeatBlockParties} totalSeats={activeTotalSeats} />
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

		<MuscleGraph k={k} highlightTotalMandate={activeTotalMandate} points={musclePoints} />
	</section>
</main>

<style>
    main {
        max-width: min(1440px, calc(100vw - 48px));
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
		max-width: 820px;
		color: #475569;
		font-size: 1.08rem;
		line-height: 1.55;
	}

	.controls {
		position: sticky;
		top: 12px;
		z-index: 20;
		display: grid;
		grid-template-columns: 1.1fr 1.2fr 1.2fr 1.8fr 1fr;
		gap: 14px;
		align-items: end;
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
		color: #0f172a;
		font-size: 1.05rem;
		line-height: 1.2;
	}

	select {
		box-sizing: border-box;
		width: 100%;
		margin-top: 6px;
		border: 1px solid #cbd5e1;
		border-radius: 12px;
		background: white;
		color: #0f172a;
		padding: 9px 10px;
		font: inherit;
		font-weight: 800;
	}

	select:disabled,
	input:disabled {
		cursor: not-allowed;
		opacity: 0.45;
	}

	.election-selector {
		min-width: 0;
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
		grid-template-columns: 120px 1fr;
		gap: 12px;
		align-items: center;
	}

	.disabled-row label {
		opacity: 0.5;
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