<script lang="ts">
	import { LAMBDA } from '$lib/sv/constants';
	import { calculateElection } from '$lib/sv/calculateElection';

	let k = $state(LAMBDA);

const toyElection = {
	name: 'Toy election',
	seats: 10,
	parties: [
		{ id: 'a', name: 'Party A', votes: 45000 },
		{ id: 'b', name: 'Party B', votes: 32000 },
		{ id: 'c', name: 'Party C', votes: 17000 },
		{ id: 'd', name: 'Party D', votes: 6000 }
	]
};

let result = $derived(
	calculateElection({
		...toyElection,
		k
	})
);

function resetToLambda() {
	k = LAMBDA;
}

	function pct(value: number): string {
		return `${(value * 100).toFixed(2)}%`;
	}

	function num(value: number): string {
		return value.toLocaleString(undefined, {
			maximumFractionDigits: 4
		});
	}
</script>

<svelte:head>
	<title>SV Engine Test</title>
</svelte:head>

<main>
	<h1>SV Engine Test</h1>

    <section>
        <h2>Mandate parameter</h2>

        <label for="k-slider">
            <span>k</span>
            <strong>{k.toFixed(4)}</strong>
        </label>

        <input id="k-slider" type="range" min="0.5" max="10" step="0.01" bind:value={k} />

        <div class="slider-helper">
            <span>Lower k</span>
            <span>Λ = {LAMBDA.toFixed(4)}</span>
            <span>Higher k</span>
        </div>

        <button type="button" onclick={resetToLambda}>Reset to Λ</button>
    </section>

	<section>
		<h2>Election summary</h2>

		<dl>
			<div>
				<dt>Election</dt>
				<dd>{result.name}</dd>
			</div>
			<div>
				<dt>Seats</dt>
				<dd>{result.seats}</dd>
			</div>
			<div>
				<dt>k</dt>
				<dd>{num(result.k)}</dd>
			</div>
			<div>
				<dt>A</dt>
				<dd>{num(result.A)}</dd>
			</div>
			<div>
				<dt>Total votes</dt>
				<dd>{num(result.totalVotes)}</dd>
			</div>
			<div>
				<dt>τ</dt>
				<dd>{num(result.tau)}</dd>
			</div>
			<div>
				<dt>Eligible vote total</dt>
				<dd>{num(result.eligibleVoteTotal)}</dd>
			</div>
			<div>
				<dt>Total mandate</dt>
				<dd>{num(result.totalMandate)}</dd>
			</div>
		</dl>
	</section>

	<section>
		<h2>Party calculations</h2>

		<table>
			<thead>
				<tr>
					<th>Party</th>
					<th>Votes</th>
					<th>Eligible?</th>
					<th>x</th>
					<th>M</th>
					<th>f</th>
					<th>SV seats</th>
				</tr>
			</thead>
			<tbody>
				{#each result.parties as party}
					<tr>
						<td>{party.name}</td>
						<td>{num(party.votes)}</td>
						<td>{party.eligible ? 'Yes' : 'No'}</td>
						<td>{pct(party.x)}</td>
						<td>{num(party.mandate)}</td>
						<td>{pct(party.fractionOfPower)}</td>
						<td>{party.svSeats}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<section>
		<h2>Sequential Webster rounds</h2>

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
				{#each result.websterRounds as round}
					<tr>
						<td>{round.round}</td>
						<td>{round.partyName}</td>
						<td>{num(round.priority)}</td>
						<td>{round.newSeatTotal}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family:
			Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		background: #f8fafc;
		color: #0f172a;
	}

	main {
		max-width: 1000px;
		margin: 0 auto;
		padding: 32px 20px 56px;
	}

	h1 {
		font-size: clamp(2rem, 5vw, 3rem);
		margin: 0 0 24px;
	}

	section {
		margin: 0 0 28px;
		padding: 20px;
		border: 1px solid #cbd5e1;
		border-radius: 18px;
		background: white;
	}

	dl {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
	}

	dl div {
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 12px;
		background: #f8fafc;
	}

	dt {
		color: #64748b;
		font-size: 0.9rem;
	}

	dd {
		margin: 4px 0 0;
		font-weight: 700;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 10px;
		border-bottom: 1px solid #e2e8f0;
		text-align: left;
	}

	th {
		color: #475569;
		font-size: 0.9rem;
	}

	@media (max-width: 800px) {
		dl {
			grid-template-columns: 1fr;
		}

		table {
			font-size: 0.9rem;
		}
	}

    label {
	display: flex;
	justify-content: space-between;
	gap: 16px;
	align-items: baseline;
	margin-bottom: 8px;
}

label span {
	color: #475569;
}

label strong {
	font-variant-numeric: tabular-nums;
}

input[type='range'] {
	width: 100%;
}

.slider-helper {
	display: flex;
	justify-content: space-between;
	gap: 12px;
	color: #64748b;
	font-size: 0.9rem;
	margin-top: 8px;
}

button {
	margin-top: 12px;
	border: 0;
	border-radius: 999px;
	background: #0f172a;
	color: white;
	font-weight: 700;
	padding: 10px 16px;
	cursor: pointer;
}

button:hover {
	background: #334155;
}
</style>