<script lang="ts">
	import { countryDatasets } from '$lib/data/registry';
	import { validateAllDatasets } from '$lib/data/validation';

	const issues = validateAllDatasets(countryDatasets);

	const errors = issues.filter((issue) => issue.severity === 'error');
	const warnings = issues.filter((issue) => issue.severity === 'warning');
	const electionCount = countryDatasets.reduce(
		(total, dataset) => total + dataset.elections.length,
		0
	);

	function issueKey(issue: (typeof issues)[number], index: number): string {
		return `${issue.severity}-${issue.countryId}-${issue.electionId ?? 'country'}-${index}`;
	}
</script>

<svelte:head>
	<title>Data Check — Strengthened Voting</title>
</svelte:head>

<main>
	<h1>Data check</h1>

	<section class="summary">
		<div>
			<span>Errors</span>
			<strong>{errors.length}</strong>
		</div>

		<div>
			<span>Warnings</span>
			<strong>{warnings.length}</strong>
		</div>

		<div>
			<span>Countries</span>
			<strong>{countryDatasets.length}</strong>
		</div>

		<div>
			<span>Elections</span>
			<strong>{electionCount}</strong>
		</div>
	</section>

	{#if issues.length === 0}
		<section class="ok">
			<h2>All checks passed</h2>
			<p>No data issues were found.</p>
		</section>
	{:else}
		<section>
			<h2>Issues</h2>

			<table>
				<thead>
					<tr>
						<th>Severity</th>
						<th>Country</th>
						<th>Election</th>
						<th>Message</th>
					</tr>
				</thead>

				<tbody>
					{#each issues as issue, index (issueKey(issue, index))}
						<tr class:error-row={issue.severity === 'error'}>
							<td>{issue.severity}</td>
							<td>{issue.countryId}</td>
							<td>{issue.electionId ?? '—'}</td>
							<td>{issue.message}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/if}
</main>

<style>
	main {
		max-width: 1100px;
		margin: 0 auto;
		padding: 32px 20px 56px;
	}

	h1 {
		margin: 0 0 24px;
		font-size: clamp(2rem, 5vw, 3.4rem);
	}

	.summary {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
		margin-bottom: 20px;
	}

	.summary div,
	section {
		border: 1px solid #cbd5e1;
		border-radius: 18px;
		background: white;
		padding: 20px;
	}

	.summary span {
		display: block;
		color: #64748b;
	}

	.summary strong {
		display: block;
		margin-top: 4px;
		font-size: 2rem;
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
		vertical-align: top;
	}

	th {
		color: #475569;
	}

	.error-row {
		background: #fef2f2;
	}

	.ok {
		background: #f0fdf4;
		border-color: #bbf7d0;
	}

	@media (max-width: 800px) {
		.summary {
			grid-template-columns: 1fr;
		}
	}
</style>
