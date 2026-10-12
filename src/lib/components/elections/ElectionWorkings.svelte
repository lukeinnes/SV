<script lang="ts">
	import type { RealElectionCalculation } from '$lib/sv/calculateRealElection';

	type PartyKind = RealElectionCalculation['parties'][number]['kind'];

	type Props = {
		calculation: RealElectionCalculation;
		useEnglishNames?: boolean;
		stickyTop?: number;
	};

	type WorkingsRow = {
		id: string;
		name: string;
		shortName: string;
		colour: string;
		kind: PartyKind;
		votes: number;
		voteShare: number;
		mandate: number;
		mandateShare: number;
		actualSeats: number;
		seats: number;
		seatShare: number;
		deltaSeats: number;
		exclusionReason?: string;
	};

	let { calculation, useEnglishNames = false, stickyTop = 0 }: Props = $props();

	let otherExpanded = $state(false);

	function visibleColour(colour: string): string {
		return colour.toLowerCase() === '#ffffff' ? '#94a3b8' : colour;
	}

	function isZero(value: number): boolean {
		return Math.abs(value) < 1e-9;
	}

	function formatInteger(value: number): string {
		return Math.round(value).toLocaleString();
	}

	function formatVotes(value: number): string {
		return value.toLocaleString(undefined, {
			maximumFractionDigits: 0
		});
	}

	function formatPercent(value: number): string {
		return `${(value * 100).toFixed(2)}%`;
	}

	function formatTotalPercent(value: number): string {
		return `${(value * 100).toFixed(0)}%`;
	}

	function formatPoints(value: number): string {
		return value.toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
	}

	function formatMandate(value: number): string {
		if (isZero(value)) return '0';

		return formatPoints(value);
	}

	function formatMandateShare(row: WorkingsRow): string {
		if (isZero(row.mandate)) return '-';

		return formatPercent(row.mandateShare);
	}

	function formatDelta(value: number, useDashForZero: boolean): string {
		if (value > 0) return `+${value}`;
		if (value < 0) return `${value}`;
		if (useDashForZero) return '-';

		return '0';
	}

	function shouldDashDelta(row: WorkingsRow): boolean {
		return row.deltaSeats === 0 && row.actualSeats === 0 && row.seats === 0;
	}

	function partyName(party: RealElectionCalculation['parties'][number]): string {
		if (useEnglishNames && party.englishName) {
			return party.englishName;
		}

		return party.usualName;
	}

	function makeRows(): WorkingsRow[] {
		return [...calculation.parties]
			.sort((left, right) => right.votes - left.votes)
			.map((party) => ({
				id: party.partyId,
				name: partyName(party),
				shortName: party.shortName,
				colour: visibleColour(party.colour),
				kind: party.kind,
				votes: party.votes,
				voteShare: party.voteShare,
				mandate: party.mandate,
				mandateShare: party.fractionOfPower,
				actualSeats: party.actualSeats,
				seats: party.svSeats,
				seatShare: party.svSeatShare,
				deltaSeats: party.seatDelta,
				exclusionReason: party.exclusionReason
			}));
	}

	function isPrimaryRow(row: WorkingsRow): boolean {
		return row.kind === 'party' && row.votes > calculation.tau;
	}

	function otherKindRank(kind: PartyKind): number {
		if (kind === 'party') return 0;
		if (kind === 'independent') return 1;
		if (kind === 'special') return 2;
		if (kind === 'other') return 3;

		return 4;
	}

	function makeOtherDetailRows(rows: WorkingsRow[]): WorkingsRow[] {
		return [...rows].sort((left, right) => {
			const rankDifference = otherKindRank(left.kind) - otherKindRank(right.kind);

			if (rankDifference !== 0) {
				return rankDifference;
			}

			return right.votes - left.votes;
		});
	}

	function sumRows(rows: WorkingsRow[]): WorkingsRow | undefined {
		if (rows.length === 0) {
			return undefined;
		}

		return {
			id: 'grouped-other',
			name: 'Other',
			shortName: 'Other',
			colour: '#94a3b8',
			kind: 'other',
			votes: rows.reduce((total, row) => total + row.votes, 0),
			voteShare: rows.reduce((total, row) => total + row.voteShare, 0),
			mandate: rows.reduce((total, row) => total + row.mandate, 0),
			mandateShare: rows.reduce((total, row) => total + row.mandateShare, 0),
			actualSeats: rows.reduce((total, row) => total + row.actualSeats, 0),
			seats: rows.reduce((total, row) => total + row.seats, 0),
			seatShare: rows.reduce((total, row) => total + row.seatShare, 0),
			deltaSeats: rows.reduce((total, row) => total + row.deltaSeats, 0),
			exclusionReason: `${rows.length} grouped ${
				rows.length === 1 ? 'row' : 'rows'
			}: non-party rows, Other, and parties at or below the threshold.`
		};
	}

	let rows = $derived(makeRows());
	let primaryRows = $derived(rows.filter(isPrimaryRow));
	let groupedOtherRows = $derived(rows.filter((row) => !isPrimaryRow(row)));
	let otherDetailRows = $derived(makeOtherDetailRows(groupedOtherRows));
	let otherRow = $derived(sumRows(groupedOtherRows));

	let totals = $derived({
		votes: rows.reduce((total, row) => total + row.votes, 0),
		voteShare: rows.reduce((total, row) => total + row.voteShare, 0),
		mandate: rows.reduce((total, row) => total + row.mandate, 0),
		mandateShare: rows.reduce((total, row) => total + row.mandateShare, 0),
		seats: rows.reduce((total, row) => total + row.seats, 0),
		seatShare: rows.reduce((total, row) => total + row.seatShare, 0)
	});

	let thresholdVoteShare = $derived(calculation.tau / calculation.totalVotes);
</script>

<section class="workings-card">
	<div class="workings-heading">
		<p class="section-kicker">SV workings</p>

		<div class="threshold-summary">
			<div>
				<span>Total votes received</span>
				<strong>{formatVotes(calculation.totalVotes)}</strong>
			</div>

			<div>
				<span>Threshold</span>
				<strong>{formatVotes(calculation.tau)} votes ({formatPercent(thresholdVoteShare)})</strong>
			</div>
		</div>
	</div>

	<div class="table-frame" style={`--sticky-table-top: ${stickyTop}px;`}>
		<table>
			<thead>
				<tr>
					<th class="party-heading">Party</th>
					<th>Votes</th>
					<th>Vote share</th>
					<th>Mandate</th>
					<th>Mandate share</th>
					<th>Seats</th>
					<th>Δ</th>
				</tr>
			</thead>

			<tbody>
				{#each primaryRows as row (row.id)}
					<tr title={row.exclusionReason ?? ''}>
						<th class="party-cell">
							<span class="party-main">
								<span class="party-hex" style={`--party-colour: ${row.colour};`}></span>
								<span class="party-name">{row.name}</span>
							</span>
							<span class="party-abbreviation">({row.shortName})</span>
						</th>
						<td>{formatInteger(row.votes)}</td>
						<td>{formatPercent(row.voteShare)}</td>
						<td>{formatMandate(row.mandate)}</td>
						<td class:empty-value={isZero(row.mandate)}>{formatMandateShare(row)}</td>
						<td class="seats-cell" class:empty-value={row.seats === 0}>
							{#if row.seats > 0}
								<strong>{row.seats}</strong>
								<span>({formatPercent(row.seatShare)})</span>
							{:else}
								<span class="dash-value">-</span>
							{/if}
						</td>
						<td
							class="delta-cell"
							class:positive-delta={row.deltaSeats > 0}
							class:negative-delta={row.deltaSeats < 0}
							class:zero-delta={row.deltaSeats === 0 && !shouldDashDelta(row)}
							class:empty-value={shouldDashDelta(row)}
						>
							{formatDelta(row.deltaSeats, shouldDashDelta(row))}
						</td>
					</tr>
				{/each}

				{#if otherRow}
					<tr class="other-summary-row" title={otherRow.exclusionReason ?? ''}>
						<th class="party-cell">
							<span class="party-main">
								<button
									class="expand-button"
									type="button"
									aria-expanded={otherExpanded}
									aria-label={otherExpanded ? 'Collapse Other rows' : 'Expand Other rows'}
									onclick={() => (otherExpanded = !otherExpanded)}
								>
									<span>{otherExpanded ? '−' : '+'}</span>
								</button>
								<span class="party-name">{otherRow.name}</span>
							</span>
							<span class="party-abbreviation">({otherRow.shortName})</span>
						</th>
						<td>{formatInteger(otherRow.votes)}</td>
						<td>{formatPercent(otherRow.voteShare)}</td>
						<td>{formatMandate(otherRow.mandate)}</td>
						<td class:empty-value={isZero(otherRow.mandate)}>{formatMandateShare(otherRow)}</td>
						<td class="seats-cell" class:empty-value={otherRow.seats === 0}>
							{#if otherRow.seats > 0}
								<strong>{otherRow.seats}</strong>
								<span>({formatPercent(otherRow.seatShare)})</span>
							{:else}
								<span class="dash-value">-</span>
							{/if}
						</td>
						<td
							class="delta-cell"
							class:positive-delta={otherRow.deltaSeats > 0}
							class:negative-delta={otherRow.deltaSeats < 0}
							class:zero-delta={otherRow.deltaSeats === 0 && !shouldDashDelta(otherRow)}
							class:empty-value={shouldDashDelta(otherRow)}
						>
							{formatDelta(otherRow.deltaSeats, shouldDashDelta(otherRow))}
						</td>
					</tr>

					{#if otherExpanded}
						{#each otherDetailRows as row (row.id)}
							<tr class="detail-row" title={row.exclusionReason ?? ''}>
								<th class="party-cell detail-party-cell">
									<span class="party-main">
										<span class="detail-indent"></span>
										<span class="party-hex" style={`--party-colour: ${row.colour};`}></span>
										<span class="party-name">{row.name}</span>
									</span>
									<span class="party-abbreviation">({row.shortName})</span>
								</th>
								<td>{formatInteger(row.votes)}</td>
								<td>{formatPercent(row.voteShare)}</td>
								<td>{formatMandate(row.mandate)}</td>
								<td class:empty-value={isZero(row.mandate)}>{formatMandateShare(row)}</td>
								<td class="seats-cell" class:empty-value={row.seats === 0}>
									{#if row.seats > 0}
										<strong>{row.seats}</strong>
										<span>({formatPercent(row.seatShare)})</span>
									{:else}
										<span class="dash-value">-</span>
									{/if}
								</td>
								<td
									class="delta-cell"
									class:positive-delta={row.deltaSeats > 0}
									class:negative-delta={row.deltaSeats < 0}
									class:zero-delta={row.deltaSeats === 0 && !shouldDashDelta(row)}
									class:empty-value={shouldDashDelta(row)}
								>
									{formatDelta(row.deltaSeats, shouldDashDelta(row))}
								</td>
							</tr>
						{/each}
					{/if}
				{/if}
			</tbody>

			<tfoot>
				<tr>
					<th class="party-cell total-cell">
						<span class="party-main">Total</span>
					</th>
					<td>{formatInteger(totals.votes)}</td>
					<td>{formatTotalPercent(totals.voteShare)}</td>
					<td>{formatPoints(totals.mandate)}</td>
					<td>{formatTotalPercent(totals.mandateShare)}</td>
					<td class="seats-cell">
						<strong>{totals.seats}</strong>
						<span>({formatTotalPercent(totals.seatShare)})</span>
					</td>
					<td class="delta-cell empty-value">-</td>
				</tr>
			</tfoot>
		</table>
	</div>
</section>

<style>
	.workings-card {
		display: grid;
		gap: 18px;
		overflow: visible;
		border: 1px solid #cbd5e1;
		border-radius: 20px;
		background: white;
		padding: 18px;
	}

	.workings-heading {
		display: grid;
		gap: 12px;
		text-align: center;
	}

	.section-kicker {
		margin: 0;
		color: #2563eb;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.threshold-summary {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 14px 28px;
	}

	.threshold-summary div {
		display: grid;
		gap: 3px;
	}

	.threshold-summary span {
		color: #64748b;
		font-size: 0.78rem;
		font-weight: 950;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.threshold-summary strong {
		color: #0f172a;
		font-size: clamp(1.1rem, 2vw, 1.5rem);
		font-weight: 950;
		letter-spacing: -0.02em;
	}

	.table-frame {
		overflow: visible;
		border: 1px solid #0f172a;
	}

	table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		color: #0f172a;
		font-size: 0.88rem;
		font-variant-numeric: tabular-nums;
	}

	th,
	td {
		border-bottom: 1px solid #e2e8f0;
		padding: 9px 10px;
		text-align: center;
		white-space: nowrap;
	}

	thead th {
		position: sticky;
		top: var(--sticky-table-top, 0px);
		z-index: 10;
		border-bottom: 1px solid #0f172a;
		background: #f8fafc;
		color: #0f172a;
		font-size: 0.78rem;
		font-weight: 950;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		box-shadow: none;
	}

	tbody th {
		font-weight: 850;
	}

	tbody tr:last-child th,
	tbody tr:last-child td {
		border-bottom: 0;
	}

	tfoot th,
	tfoot td {
		border-top: 1px solid #0f172a;
		border-bottom: 0;
		background: #f8fafc;
		font-weight: 950;
		box-shadow: none;
	}

	.party-heading,
	.party-cell {
		text-align: left;
	}

	.party-cell {
		display: flex;
		align-items: center;
		gap: 14px;
		min-width: 280px;
		white-space: normal;
	}

	.party-main {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	.party-name {
		min-width: 0;
	}

	.party-abbreviation {
		margin-left: auto;
		color: #64748b;
		font-weight: 850;
		white-space: nowrap;
	}

	.total-cell {
		min-width: 280px;
	}

	.party-heading,
	tbody .party-cell,
	tfoot .total-cell,
	thead th:nth-child(3),
	tbody td:nth-child(3),
	tfoot td:nth-child(3),
	thead th:nth-child(5),
	tbody td:nth-child(5),
	tfoot td:nth-child(5) {
		border-right: 1px solid #94a3b8;
	}

	.party-hex {
		display: inline-block;
		flex: 0 0 auto;
		width: 13px;
		height: 13px;
		background: var(--party-colour);
		clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
		transform: rotate(90deg);
	}

	.expand-button {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		margin: 0;
		border: 1.5px solid #64748b;
		border-radius: 4px;
		background: #ffffff;
		color: #334155;
		padding: 0;
		font: inherit;
		font-size: 14px;
		font-weight: 950;
		line-height: 1;
		cursor: pointer;
	}

	.expand-button span {
		display: block;
		line-height: 1;
		transform: translateY(-0.5px);
	}

	.expand-button:hover {
		border-color: #2563eb;
		color: #1d4ed8;
		background: #eff6ff;
	}

	.other-summary-row {
		background: #f8fafc;
		font-weight: 900;
	}

	.detail-row {
		color: #475569;
		background: #ffffff;
	}

	.detail-row td,
	.detail-row th {
		font-size: 0.84rem;
	}

	.detail-party-cell {
		padding-left: 28px;
	}

	.detail-indent {
		display: inline-block;
		flex: 0 0 auto;
		width: 18px;
		height: 1px;
	}

	.seats-cell strong {
		font-weight: 950;
	}

	.seats-cell span {
		color: #64748b;
		font-weight: 750;
	}

	.delta-cell {
		font-weight: 950;
	}

	.positive-delta {
		color: #15803d;
	}

	.negative-delta {
		color: #b91c1c;
	}

	.zero-delta {
		color: #334155;
	}

	.empty-value,
	.dash-value {
		color: #94a3b8;
		font-weight: 850;
	}

	@media (max-width: 700px) {
		th,
		td {
			padding: 8px;
		}

		.party-cell,
		.total-cell {
			min-width: 230px;
		}
	}
</style>