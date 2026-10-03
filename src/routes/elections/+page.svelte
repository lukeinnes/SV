<script lang="ts">
	import { countryDatasets, getCountryDataset } from '$lib/data/registry';
	import { calculateTau, enrichElectionResults } from '$lib/data/lookup';

    let selectedCountryId = $state(countryDatasets[0].country.id);
    let selectedElectionId = $state(countryDatasets[0].elections[0].id);

    let selectedDataset = $derived(getCountryDataset(selectedCountryId));

    let selectedElection = $derived(
        selectedDataset.elections.find((election) => election.id === selectedElectionId) ??
            selectedDataset.elections[0]
    );

    let enrichedResults = $derived(enrichElectionResults(selectedElection, selectedDataset.parties));

    let tau = $derived(calculateTau(selectedElection.totalVotes, selectedElection.totalSeats));

    $effect(() => {
        if (!selectedDataset.elections.some((election) => election.id === selectedElectionId)) {
            selectedElectionId = selectedDataset.elections[0].id;
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
	<section class="hero">
		<p class="eyebrow">Strengthened Voting data browser</p>
		<h1>Election browser</h1>
		<p>
			Select a country and election to inspect the raw vote and seat data before applying
			Strengthened Voting.
		</p>
	</section>

	<section class="controls">
		<label for="country-select">
			<span>Country</span>
			<select id="country-select" bind:value={selectedCountryId}>
				{#each countryDatasets as dataset}
					<option value={dataset.country.id}>
						{dataset.country.name} ({dataset.country.alpha3})
					</option>
				{/each}
			</select>
		</label>

		<label for="election-select">
			<span>Election</span>
			<select id="election-select" bind:value={selectedElectionId}>
				{#each selectedDataset.elections as election}
					<option value={election.id}>{election.briefName}</option>
				{/each}
			</select>
		</label>
	</section>

	<section class="summary">
		<h2>{selectedElection.fullName}</h2>

		<div class="stats">
			<div>
				<span>Total votes</span>
				<strong>{num(selectedElection.totalVotes)}</strong>
			</div>
			
			<div>
				<span>Total seats</span>
				<strong>{num(selectedElection.totalSeats)}</strong>
			</div>

			<div>
				<span>τ = votes ÷ seats</span>
				<strong>{num(tau)}</strong>
			</div>

			<div>
				<span>Listed results</span>
				<strong>{enrichedResults.length}</strong>
					<p>
						<strong>Actual election method:</strong>
						{selectedElection.actualSeatAllocation ?? '...'}
					</p>
			</div>
		</div>
	</section>

	<section class="table-section">
		<h2>Party results</h2>

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
				{#each enrichedResults as result}
					<tr class:other-row={result.isOther}>
						<td>
							<span
								class="colour-dot"
								style={`background: ${result.colour}; border-color: ${
									result.colour.toLowerCase() === '#ffffff' ? '#94a3b8' : result.colour
								}`}
								aria-label={`${result.shortName} colour`}
							></span>
						</td>
						<td>
							<strong>{result.shortName}</strong>
							<span>{result.usualName}</span>
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
	</section>
</main>

<style>
	main {
		max-width: 1180px;
		margin: 0 auto;
		padding: 32px 20px 56px;
	}

	.hero {
		margin-bottom: 24px;
	}

	.eyebrow {
		margin: 0 0 8px;
		color: #2563eb;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.78rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 5vw, 3.6rem);
		line-height: 1;
	}

	h2 {
		margin: 0 0 16px;
	}

	p {
		max-width: 760px;
		color: #475569;
		line-height: 1.6;
	}

	.controls,
	.summary,
	.table-section {
		margin-bottom: 20px;
		padding: 20px;
		border: 1px solid #cbd5e1;
		border-radius: 18px;
		background: white;
	}

	.controls {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	label {
		display: grid;
		gap: 8px;
	}

	label span {
		color: #475569;
		font-weight: 700;
	}

	select {
		width: 100%;
		border: 1px solid #cbd5e1;
		border-radius: 12px;
		background: white;
		color: #0f172a;
		padding: 10px 12px;
		font-size: 1rem;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
	}

	.stats div {
		border: 1px solid #e2e8f0;
		border-radius: 14px;
		background: #f8fafc;
		padding: 14px;
	}

	.stats span {
		display: block;
		color: #64748b;
		font-size: 0.9rem;
	}

	.stats strong {
		display: block;
		margin-top: 4px;
		font-size: 1.35rem;
		font-variant-numeric: tabular-nums;
	}

	.table-section {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		min-width: 900px;
	}

	th,
	td {
		padding: 10px;
		border-bottom: 1px solid #e2e8f0;
		text-align: left;
		vertical-align: middle;
	}

	th {
		color: #475569;
		font-size: 0.86rem;
	}

	td {
		font-variant-numeric: tabular-nums;
	}

	td strong {
		display: block;
	}

	td span {
		display: block;
		color: #64748b;
		font-size: 0.86rem;
	}

	.colour-dot {
		width: 18px;
		height: 18px;
		display: inline-block;
		border: 2px solid;
		border-radius: 999px;
	}

	.badge {
		display: inline-block;
		border-radius: 999px;
		padding: 4px 9px;
		font-size: 0.82rem;
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
		background: #e5e7eb;
		color: #374151;
	}

	.other-row {
		background: #f8fafc;
	}

	@media (max-width: 800px) {
		.controls,
		.stats {
			grid-template-columns: 1fr;
		}
	}
</style>