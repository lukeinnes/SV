<script lang="ts">
	import { get } from 'svelte/store';
	import ElectionTransformationGraph from '$lib/components/elections/ElectionTransformationGraph.svelte';
	import ElectionWorkings from '$lib/components/elections/ElectionWorkings.svelte';
	import PageControls from '$lib/components/layout/PageControls.svelte';
	import SvControlPanel from '$lib/components/layout/SvControlPanel.svelte';
	import SeatBlocks, { type SeatBlocksParty } from '$lib/components/graphs/SeatBlocks.svelte';
	import {
		countryDatasets,
		getCountryDataset,
		type CountryDataset
	} from '$lib/data/registry';
	import type { Election } from '$lib/data/types';
	import { LAMBDA } from '$lib/sv/constants';
	import {
		calculateRealElection,
		type RealElectionCalculation
	} from '$lib/sv/calculateRealElection';
	import CountrySelect from '$lib/components/layout/CountrySelect.svelte';
	import {
		controlBarState,
		DEFAULT_COUNTRY_ID
	} from '$lib/state/controlBarState';

	type CalculatedParty = RealElectionCalculation['parties'][number];

	function firstDataset(): CountryDataset {
		const dataset = countryDatasets[0];

		if (!dataset) {
			throw new Error('No country datasets are registered.');
		}

		return dataset;
	}

	function firstElection(dataset: CountryDataset): Election {
		const election = dataset.elections[0];

		if (!election) {
			throw new Error(
				`Dataset ${dataset.country.id} has no elections.`
			);
		}

		return election;
	}

	function electionSortValue(election: Election): number {
		const possibleValues = [
			election.id,
			election.briefName,
			election.fullName
		];

		for (const value of possibleValues) {
			if (value === undefined || value === null) continue;

			const match = String(value).match(/\d{4}/);

			if (match) return Number(match[0]);
		}

		return 0;
	}

	function getDefaultElectionId(dataset: CountryDataset): string {
		const election = [...dataset.elections].sort(
			(left, right) =>
				electionSortValue(right) - electionSortValue(left)
		)[0];

		return election?.id ?? firstElection(dataset).id;
	}

	function datasetOrDefault(countryId: string): CountryDataset {
		try {
			if (countryId) return getCountryDataset(countryId);
		} catch {
			// Fall through to default.
		}

		try {
			return getCountryDataset(DEFAULT_COUNTRY_ID);
		} catch {
			return firstDataset();
		}
	}

	function selectedOrDefaultElection(
		dataset: CountryDataset,
		electionId: string
	): Election {
		return (
			dataset.elections.find(
				(election) => election.id === electionId
			) ?? firstElection(dataset)
		);
	}

	function countryFlag(countryId: string): string {
		const flags: Record<string, string> = {
			gb: '🇬🇧',
			jp: '🇯🇵',
			fi: '🇫🇮',
			us: '🇺🇸',
			nl: '🇳🇱',
			ca: '🇨🇦',
			pl: '🇵🇱',
			lt: '🇱🇹'
		};

		return flags[countryId] ?? '🏳️';
	}

	function electionDisplayName(election: Election): string {
		return (
			election.briefName ??
			election.fullName ??
			election.id
		);
	}

	function formatInteger(value: number): string {
		return Math.round(value).toLocaleString();
	}

	function formatNumber(value: number): string {
		return value.toLocaleString(undefined, {
			maximumFractionDigits: 2
		});
	}

	function calculateConsolidationIndex(
		totalMandate: number,
		A: number,
		kValue: number
	): number {
		const minimumMandate = A * kValue;
		const benchmarkMandate = 2000;
		const denominator = benchmarkMandate - minimumMandate;

		if (Math.abs(denominator) < 1e-12) return 0;

		return (
			(100 * (totalMandate - minimumMandate)) /
			denominator
		);
	}

	const initialControlState = get(controlBarState);
	const initialDataset = datasetOrDefault(
		initialControlState.countryId
	);

	const initialElectionId =
		initialControlState.electionId &&
		initialDataset.elections.some(
			(election) =>
				election.id === initialControlState.electionId
		)
			? initialControlState.electionId
			: getDefaultElectionId(initialDataset);

	let selectedCountryId = $state(initialDataset.country.id);
	let selectedElectionId = $state(initialElectionId);
	let previousCountryId = $state(selectedCountryId);

	let k = $state(
		Number.isFinite(initialControlState.k)
			? initialControlState.k
			: LAMBDA
	);

	let useEnglishNames = $state(
		initialControlState.useEnglishNames ?? false
	);

	let selectedDataset = $derived(
		getCountryDataset(selectedCountryId)
	);

	let selectedElection = $derived(
		selectedOrDefaultElection(
			selectedDataset,
			selectedElectionId
		)
	);

	let orderedElections = $derived(
		[...selectedDataset.elections].sort(
			(left, right) =>
				electionSortValue(right) - electionSortValue(left)
		)
	);

	let calculation = $derived(
		calculateRealElection(
			selectedElection,
			selectedDataset.parties,
			k
		)
	);

	let consolidationIndex = $derived(
		calculateConsolidationIndex(
			calculation.totalMandate,
			calculation.A,
			k
		)
	);

	function displayPartyName(party: CalculatedParty): string {
		if (useEnglishNames && party.englishName?.trim()) {
			return party.englishName;
		}

		return party.usualName;
	}

	function makeSeatBlocksParties(): SeatBlocksParty[] {
		return calculation.parties.map((party) => ({
			id: party.partyId,
			label: displayPartyName(party),
			shortLabel: party.shortName,
			colour: party.colour,
			voteShare: party.voteShare,
			actualSeats: party.actualSeats,
			svSeats: party.svSeats
		}));
	}

	function makeMusclePoints() {
		return calculation.parties
			.filter(
				(party) =>
					party.eligible &&
					party.fractionOfPower > 0
			)
			.map((party) => ({
				id: party.partyId,
				x: party.x,
				fractionOfPower: party.fractionOfPower,
				colour: party.colour
			}));
	}

	let seatBlocksParties = $derived(makeSeatBlocksParties());
	let musclePoints = $derived(makeMusclePoints());

	$effect(() => {
		if (selectedCountryId !== previousCountryId) {
			previousCountryId = selectedCountryId;
			selectedElectionId =
				getDefaultElectionId(selectedDataset);
			return;
		}

		if (
			!selectedDataset.elections.some(
				(election) =>
					election.id === selectedElectionId
			)
		) {
			selectedElectionId =
				getDefaultElectionId(selectedDataset);
		}
	});

	$effect(() => {
		controlBarState.set({
			countryId: selectedCountryId,
			electionId: selectedElectionId,
			k,
			seats: selectedElection.totalSeats,
			useEnglishNames
		});
	});
</script>

<svelte:head>
	<title>Elections — Strengthened Voting</title>
</svelte:head>

<main class="elections-page">
	<PageControls ariaLabel="Election controls">
		<SvControlPanel
			bind:k
			bind:useEnglishNames
			showEnglishToggle
			currentTotalMandate={calculation.totalMandate}
			musclePoints={musclePoints}
			electionVotes={selectedElection.totalVotes}
			electionSeats={selectedElection.totalSeats}
		>
			{#snippet selectors()}
				<div class="sv-selector-row">
					<label for="country-select">Country</label>

					<CountrySelect
						id="country-select"
						bind:value={selectedCountryId}
					/>
				</div>
				
				<div class="sv-selector-row">
					<label for="election-select">Election</label>
					<select
						id="election-select"
						bind:value={selectedElectionId}
					>
						{#each orderedElections as election (election.id)}
							<option value={election.id}>
								{electionDisplayName(election)}
							</option>
						{/each}
					</select>
				</div>
			{/snippet}
		</SvControlPanel>
	</PageControls>

	<section class="summary-panel">
		<div class="summary-heading">
			<div>
				<p class="eyebrow">Election browser</p>
				<h1>{selectedElection.fullName}</h1>
			</div>

			<div class="summary-country">
				<span>
					{countryFlag(selectedDataset.country.id)}
				</span>
				<strong>
					{selectedDataset.country.name}
				</strong>
			</div>
		</div>

		<div class="summary-grid">
			<div class="summary-card wide">
				<span>Actual allocation</span>
				<strong>
					{selectedElection.actualSeatAllocation ??
						'Not recorded'}
				</strong>
			</div>

			<div class="summary-card">
				<span>Total votes</span>
				<strong>
					{formatInteger(selectedElection.totalVotes)}
				</strong>
			</div>

			<div class="summary-card">
				<span>Total seats</span>
				<strong>
					{formatInteger(selectedElection.totalSeats)}
				</strong>
			</div>

			<div class="summary-card">
				<span>τ</span>
				<strong>
					{formatNumber(calculation.tau)}
				</strong>
			</div>

			<div class="summary-card">
				<span>A</span>
				<strong>
					{formatNumber(calculation.A)}
				</strong>
			</div>

			<div class="summary-card">
				<span>Eligible votes</span>
				<strong>
					{formatInteger(calculation.eligibleVoteTotal)}
				</strong>
			</div>

			<div class="summary-card">
				<span>Total mandate</span>
				<strong>
					{formatNumber(calculation.totalMandate)}
				</strong>
			</div>

			<div class="summary-card">
				<span>Consolidation Index</span>
				<strong>
					{formatNumber(consolidationIndex)}
				</strong>
			</div>

			<div class="summary-card">
				<span>k</span>
				<strong>{k.toFixed(2)}</strong>
			</div>
		</div>
	</section>

	<section class="graph-panel">
		<div class="section-heading">
			<div>
				<h2>
					Actual seats, votes, and SV seats
				</h2>
				<p>
					The left block shows actual seats, the centre
					bar shows vote share, and the right block
					shows seats after applying Strengthened Voting.
				</p>
			</div>
		</div>

		<SeatBlocks
			parties={seatBlocksParties}
			totalSeats={selectedElection.totalSeats}
			actualLegendGroupingThreshold={0.025}
			svLegendGroupingThreshold={0.025}
		/>
	</section>

	<section class="graph-panel">
		<div class="section-heading">
			<div>
				<h2>Election transformation</h2>
				<p>
					This view compares vote share with the
					final SV share of seats for parties
					receiving mandate.
				</p>
			</div>
		</div>

		<ElectionTransformationGraph
			{calculation}
			{useEnglishNames}
		/>
	</section>

	<section class="workings-panel">
		<div class="section-heading">
			<div>
				<h2>SV workings</h2>
				<p>
					Rows below τ receive zero mandate.
					Other, independent, and special rows
					are excluded from mandate allocation.
				</p>
			</div>
		</div>

		<ElectionWorkings
			{calculation}
			{useEnglishNames}
			stickyTop={0}
		/>
	</section>
</main>

<style>
	.elections-page {
		display: grid;
		gap: 22px;
	}

	.elections-page > :global(section:not(.page-controls)) {
		width: var(--page-width);
		margin-inline: auto;
	}

	.summary-panel,
	.graph-panel,
	.workings-panel {
		border: 1px solid #cbd5e1;
		border-radius: 22px;
		background: #ffffff;
		box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);
	}

	.summary-panel {
		padding: 22px;
	}

	.summary-heading {
		display: flex;
		gap: 20px;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.eyebrow {
		margin: 0 0 7px;
		color: var(--brand-blue);
		font-size: 0.78rem;
		font-weight: 950;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1,
	h2 {
		margin: 0;
		color: #0f172a;
	}

	h1 {
		font-size: clamp(1.8rem, 4vw, 3.3rem);
		line-height: 1.02;
		letter-spacing: -0.055em;
	}

	h2 {
		font-size: 1.35rem;
		letter-spacing: -0.025em;
	}

	p {
		margin: 8px 0 0;
		color: #64748b;
		line-height: 1.5;
	}

	.summary-country {
		display: inline-flex;
		gap: 9px;
		align-items: center;
		border: 1px solid #e2e8f0;
		border-radius: 999px;
		background: #f8fafc;
		padding: 9px 13px;
		color: #334155;
		font-weight: 950;
		white-space: nowrap;
	}

	.summary-country span {
		font-size: 1.25rem;
	}

	.summary-grid {
		display: grid;
		grid-template-columns:
			repeat(4, minmax(0, 1fr));
		gap: 12px;
	}

	.summary-card {
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		background: #f8fafc;
		padding: 13px;
		min-width: 0;
	}

	.summary-card.wide {
		grid-column: span 2;
	}

	.summary-card span {
		display: block;
		color: #64748b;
		font-size: 0.78rem;
		font-weight: 900;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.summary-card strong {
		display: block;
		margin-top: 5px;
		color: #0f172a;
		font-size: 1.08rem;
		line-height: 1.25;
	}

	.section-heading {
		padding: 22px 22px 0;
	}

	.graph-panel :global(svg) {
		margin-top: 12px;
	}

	.workings-panel {
		overflow: hidden;
	}

	.workings-panel .section-heading {
		padding-bottom: 18px;
		border-bottom: 1px solid #e2e8f0;
	}

	@media (max-width: 900px) {
		.summary-heading {
			display: grid;
		}

		.summary-grid {
			grid-template-columns:
				repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.summary-grid {
			grid-template-columns: 1fr;
		}

		.summary-card.wide {
			grid-column: auto;
		}
	}
</style>