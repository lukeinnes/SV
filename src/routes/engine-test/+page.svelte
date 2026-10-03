<script lang="ts">
	import { LAMBDA } from '$lib/sv/constants';
	import { calculateElection } from '$lib/sv/calculateElection';

	let k = $state(LAMBDA);

	const toyParties = [
		{
			id: 'red',
			name: 'Red Party',
			votes: 420_000,
			actualSeats: 48
		},
		{
			id: 'blue',
			name: 'Blue Party',
			votes: 330_000,
			actualSeats: 36
		},
		{
			id: 'green',
			name: 'Green Party',
			votes: 160_000,
			actualSeats: 12
		},
		{
			id: 'yellow',
			name: 'Yellow Party',
			votes: 70_000,
			actualSeats: 4
		},
		{
			id: 'grey',
			name: 'Below-threshold Party',
			votes: 20_000,
			actualSeats: 0
		}
	];

	let calculation = $derived(
		calculateElection({
			name: 'Toy election',
			seats: 100,
			k,
			parties: toyParties
		})
	);

	function num(value: number): string {
		return value.toLocaleString(undefined, {
			maximumFractionDigits: 4
		});
	}

	function pct(value: number): string {
		return `${(value * 100).toFixed(2)}%`;
	}

	function signed(value: number): string {
		if (value > 0) return `+${value}`;
		return String(value);
	}
</script>

<svelte:head>
	<title>SV Engine Test — Strengthened Voting</title>
</svelte:head>

<main>
	<header class="hero">
		<p class="eyebrow">Strengthened Voting engine test</p>
		<h1>SV calculation smoke test</h1>
		<p class="lede">
			This page tests the core SV calculation engine using a toy election. It is intentionally
			diagnostic rather than polished.
		</p>
	</header>

	<section class="panel">
		<div class="slider-header">
			<label for="k-slider">
				<span>Mandate parameter k</span>
				<strong>{Number(k).toFixed(4)}</strong>
			</label>

			<button type="button" onclick={() => (k = LAMBDA)}>Reset to Λ</button>
		</div>

		<input id="k-slider" type="range" min="0.5" max="10" step="0.01" bind:value={k} />

		<div class="stats">
			<div>
				<span>A</span>
				<strong>{num(calculation.A)}</strong>
			</div>

			<div>
				<span>Total votes</span>
				<strong>{num(calculation.totalVotes)}</strong>
			</div>

			<div>
				<span>Total seats</span>
				<strong>{num(calculation.seats)}</strong>
			</div>

			<div>
				<span>τ</span>
				<strong>{num(calculation.tau)}</strong>
			</div>

			<div>
				<span>Eligible votes</span>
				<strong>{num(calculation.eligibleVoteTotal)}</strong>
			</div>

			<div>
				<span>Total mandate</span>
				<strong>{num(calculation.totalMandate)}</strong>
			</div>
		</div>
	</section>

	<section class="panel">
		<div class="section-heading">
			<div>
				<h2>Party calculations</h2>
				<p>
					This table checks vote shares, mandate, fraction of power, and the final Webster seat
					allocation.
				</p>
			</div>
		</div>

		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Party</th>
						<th>Votes</th>
						<th>Actual seats</th>
						<th>SV seats</th>
						<th>Δ seats</th>
						<th>Eligible?</th>
						<th>x</th>
						<th>Mandate</th>
						<th>Power share</th>
					</tr>
				</thead>

				<tbody>
					{#each calculation.parties as party (party.id)}
						<tr>
							<td>
								<div class="party-name">{party.name}</div>
								{#if party.exclusionReason}
									<div class="muted">{party.exclusionReason}</div>
								{/if}
							</td>

							<td>{num(party.votes)}</td>
							<td>{party.actualSeats ?? 0}</td>
							<td>{party.svSeats}</td>
							<td>{signed(party.svSeats - (party.actualSeats ?? 0))}</td>
							<td>{party.eligible ? 'Yes' : 'No'}</td>
							<td>{pct(party.x)}</td>
							<td>{num(party.mandate)}</td>
							<td>{pct(party.fractionOfPower)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section class="panel">
		<div class="section-heading">
			<div>
				<h2>Webster allocation rounds</h2>
				<p>
					Each round awards one seat to the party with the highest current Webster priority.
				</p>
			</div>
		</div>

		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Round</th>
						<th>Party</th>
						<th>Priority</th>
						<th>New seat total</th>
					</tr>
				</thead>

				<tbody>
					{#each calculation.websterRounds as round (round.round)}
						<tr>
							<td>{round.round}</td>
							<td>{round.partyName}</td>
							<td>{num(round.priority)}</td>
							<td>{round.newSeatTotal}</td>
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

	.panel {
		margin-bottom: 20px;
		border: 1px solid #cbd5e1;
		border-radius: 22px;
		background: white;
		padding: 22px;
		box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);
	}

	.slider-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 12px;
	}

	label {
		display: grid;
		gap: 4px;
		font-weight: 700;
		color: #334155;
	}

	label strong {
		color: #0f172a;
		font-size: 1.4rem;
	}

	button {
		border: 1px solid #cbd5e1;
		border-radius: 999px;
		background: #f8fafc;
		color: #0f172a;
		padding: 9px 14px;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}

	input[type='range'] {
		width: 100%;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 12px;
		margin-top: 20px;
	}

	.stats div {
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		background: #f8fafc;
		padding: 14px;
	}

	.stats span {
		display: block;
		color: #64748b;
		font-size: 0.85rem;
		font-weight: 700;
	}

	.stats strong {
		display: block;
		margin-top: 5px;
		font-size: 1.15rem;
		line-height: 1.2;
	}

	.section-heading {
		margin-bottom: 16px;
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
		vertical-align: top;
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

	.party-name {
		font-weight: 800;
		color: #0f172a;
	}

	.muted {
		margin-top: 3px;
		color: #64748b;
		font-size: 0.85rem;
		white-space: normal;
	}

	@media (max-width: 1000px) {
		.stats {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 700px) {
		.slider-header {
			align-items: stretch;
			flex-direction: column;
		}

		.stats {
			grid-template-columns: 1fr;
		}
	}
</style>