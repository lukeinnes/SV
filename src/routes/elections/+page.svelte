<script lang="ts">
	import type { CountryDataset } from '$lib/data/registry';
	import { countryDatasets, getCountryDataset } from '$lib/data/registry';
	import { calculateTau, enrichElectionResults } from '$lib/data/lookup';

	function firstDataset(): CountryDataset {
		const dataset = countryDatasets[0];

		if (!dataset) {
			throw new Error('No country datasets are registered.');
		}

		return dataset;
	}

	function firstElection(dataset: CountryDataset) {
		const election = dataset.elections[0];

		if (!election) {
			throw new Error(`Dataset ${dataset.country.id} has no elections.`);
		}

		return election;
	}

	function selectedOrFirstElection(dataset: CountryDataset, electionId: string) {
		return dataset.elections.find((election) => election.id === electionId) ?? firstElection(dataset);
	}

	const initialDataset = firstDataset();

	let selectedCountryId = $state(initialDataset.country.id);
	let selectedElectionId = $state(firstElection(initialDataset).id);

	let selectedDataset = $derived(getCountryDataset(selectedCountryId));

	let selectedElection = $derived(selectedOrFirstElection(selectedDataset, selectedElectionId));

	let enrichedResults = $derived(enrichElectionResults(selectedElection, selectedDataset.parties));

	let tau = $derived(calculateTau(selectedElection.totalVotes, selectedElection.totalSeats));

	$effect(() => {
		if (!selectedDataset.elections.some((election) => election.id === selectedElectionId)) {
			selectedElectionId = firstElection(selectedDataset).id;
		}
	});

	function num(value: number): string {
		return value.toLocaleString(undefined, {
			maximumFractionDigits: 0
		});
	}

	function pct(value: number): string {
		return `${(value * 100).toFixed(2)}%`;
	}

	function thresholdBadgeText(result: {
		isOther: boolean;
		isIndependentAggregate: boolean;
		aboveTau: boolean;
	}): string {
		if (result.isOther) return 'Other';
		if (result.isIndependentAggregate) return 'Grouped';
		if (result.aboveTau) return 'Yes';
		return 'No';
	}

	function thresholdBadgeClass(result: {
		isOther: boolean;
		isIndependentAggregate: boolean;
		aboveTau: boolean;
	}): string {
		if (result.isOther || result.isIndependentAggregate) return 'muted';
		if (result.aboveTau) return 'yes';
		return 'no';
	}
</script>

<svelte:head>
	<title>Election Browser — Strengthened Voting</title>
</svelte:head>

<main>
	<header class="hero">
		<p class="eyebrow">Strengthened Voting data browser</p>
		<h1>Election data</h1>
		<p class="lede">
			Browse imported election results, check party metadata, and inspect which parties sit above the
			current election threshold τ.
		</p>
	</header>

	<section class="controls" aria-label="Election controls">
		<div class="control">
			<label for="country-select">Country</label>

			<select id="country-select" bind:value={selectedCountryId}>
				{#each countryDatasets as dataset (dataset.country.id)}
					<option value={dataset.country.id}>{dataset.country.name}</option>
				{/each}
			</select>
		</div>

		<div class="control">
			<label for="election-select">Election</label>

			<select id="election-select" bind:value={selectedElectionId}>
				{#each selectedDataset.elections as election (election.id)}
					<option value={election.id}>{election.briefName}</option>
				{/each}
			</select>
		</div>
	</section>

	<section class="summary" aria-label="Election summary">
		<div class="summary-card wide">
			<span>Election</span>
			<strong>{selectedElection.fullName}</strong>
		</div>

		<div class="summary-card">
			<span>Total votes</span>
			<strong>{num(selectedElection.totalVotes)}</strong>
		</div>

		<div class="summary-card">
			<span>Total seats</span>
			<strong>{num(selectedElection.totalSeats)}</strong>
		</div>

		<div class="summary-card">
			<span>τ</span>
			<strong>{num(tau)}</strong>
		</div>
	</section>

	<section class="table-section">
		<div class="section-heading">
			<div>
				<h2>Raw result display</h2>
				<p>
					Parties are displayed separately if they exceed τ or won seats. Below-threshold
					zero-seat rows are folded into Other. Independent rows are grouped for display.
				</p>
			</div>
		</div>

		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Colour</th>
						<th>Party</th>
						<th>Code</th>
						<th>Kind</th>
						<th>Votes</th>
						<th>Vote share</th>
						<th>Seats won</th>
						<th>Seat share</th>
						<th>Above τ?</th>
					</tr>
				</thead>

				<tbody>
					{#each enrichedResults as result (result.partyId)}
						<tr>
							<td>
								<span
									class="swatch"
									style={`background: ${result.colour}`}
									aria-label={`${result.shortName} colour`}
								></span>
							</td>

							<td>
								<div class="party-name">{result.shortName}</div>
								<div class="party-usual">{result.usualName}</div>
							</td>

							<td>{result.codeName}</td>
							<td>{result.kind}</td>
							<td>{num(result.votes)}</td>
							<td>{pct(result.voteShare)}</td>
							<td>{num(result.seatsWon)}</td>
							<td>{pct(result.seatShare)}</td>

							<td>
								<span class={`badge ${thresholdBadgeClass(result)}`}>
									{thresholdBadgeText(result)}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</main>

<style>
	main {
		max-width: 1180px;
		margin: 0 auto;
		padding: 32px 20px 56px;
	}

	.hero {
		margin-bottom: 28px;
	}

	.eyebrow {
		margin: 0 0 8px;
		color: #2563eb;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.8rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(2.25rem, 6vw, 4.5rem);
		line-height: 1;
		letter-spacing: -0.05em;
	}

	.lede {
		max-width: 760px;
		margin: 16px 0 0;
		color: #475569;
		font-size: 1.1rem;
		line-height: 1.55;
	}

	.controls {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
		margin-bottom: 18px;
	}

	.control {
		display: grid;
		gap: 8px;
	}

	label {
		font-weight: 700;
		color: #334155;
	}

	select {
		width: 100%;
		border: 1px solid #cbd5e1;
		border-radius: 14px;
		background: white;
		color: #0f172a;
		padding: 12px 14px;
		font: inherit;
	}

	.summary {
		display: grid;
		grid-template-columns: 2fr repeat(3, 1fr);
		gap: 14px;
		margin-bottom: 18px;
	}

	.summary-card {
		border: 1px solid #cbd5e1;
		border-radius: 18px;
		background: white;
		padding: 18px;
		box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);
	}

	.summary-card span {
		display: block;
		color: #64748b;
		font-size: 0.9rem;
		font-weight: 700;
	}

	.summary-card strong {
		display: block;
		margin-top: 6px;
		font-size: 1.35rem;
		line-height: 1.2;
	}

	.summary-card.wide strong {
		font-size: 1.1rem;
	}

	.table-section {
		border: 1px solid #cbd5e1;
		border-radius: 22px;
		background: white;
		overflow: hidden;
		box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);
	}

	.section-heading {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 22px;
		border-bottom: 1px solid #e2e8f0;
	}

	h2 {
		margin: 0;
		font-size: 1.35rem;
	}

	.section-heading p {
		margin: 8px 0 0;
		color: #64748b;
		line-height: 1.5;
	}

	.table-wrap {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
	}

	th,
	td {
		padding: 12px 14px;
		border-bottom: 1px solid #e2e8f0;
		text-align: left;
		vertical-align: middle;
		white-space: nowrap;
	}

	th {
		background: #f8fafc;
		color: #475569;
		font-size: 0.82rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	tr:last-child td {
		border-bottom: 0;
	}

	.swatch {
		display: inline-block;
		width: 22px;
		height: 22px;
		border: 1px solid #94a3b8;
		border-radius: 999px;
		vertical-align: middle;
	}

	.party-name {
		font-weight: 800;
		color: #0f172a;
	}

	.party-usual {
		margin-top: 3px;
		color: #64748b;
		font-size: 0.85rem;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		border-radius: 999px;
		padding: 4px 9px;
		font-size: 0.78rem;
		font-weight: 800;
	}

	.badge.yes {
		background: #dcfce7;
		color: #166534;
	}

	.badge.no {
		background: #fee2e2;
		color: #991b1b;
	}

	.badge.muted {
		background: #e2e8f0;
		color: #475569;
	}

	@media (max-width: 900px) {
		.controls,
		.summary {
			grid-template-columns: 1fr;
		}
	}
</style>