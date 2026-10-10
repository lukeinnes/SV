<script lang="ts">
	import { seatBlocksConfig } from '$lib/graphs/graphConfig';

	export type SeatBlocksParty = {
		id: string;
		label: string;
		shortLabel: string;
		colour: string;
		voteShare: number;
		actualSeats: number;
		svSeats: number;
	};

	type SeatSide = 'left' | 'right';
	type MeasureKey = 'actual' | 'vote' | 'sv';

	type SeatDot = {
		index: number;
		partyId: string;
		label: string;
		colour: string;
		cx: number;
		cy: number;
	};

	type VoteSegment = {
		id: string;
		label: string;
		shortLabel: string;
		colour: string;
		labelColour: string;
		voteShare: number;
		voteShareText: string;
		y: number;
		height: number;
	};

	type SeatGrid = {
		columns: number;
		rows: number;
		dotPitch: number;
		gridWidth: number;
		gridX: number;
	};

	type MajorityLine = {
		path: string;
		labelX: number;
		labelY: number;
		labelAnchor: 'start' | 'end';
	};

	type BoundaryLine = {
		id: string;
		path: string;
	};

	type LegendRow = {
		id: string;
		shortLabel: string;
		colour: string;
		seatCount: number;
		seatShareText: string;
		hasMajority: boolean;
		isGrouped: boolean;
		tooltip: string;
	};

	type Props = {
		parties: SeatBlocksParty[];
		totalSeats: number;
	};

	let { parties, totalSeats }: Props = $props();

	const plotTop = seatBlocksConfig.svg.plotTop;
	const plotHeight = seatBlocksConfig.svg.plotHeight;
	const plotBottom = seatBlocksConfig.svg.plotBottom;
	const svgHeight = plotTop + plotHeight + plotBottom;

	const seatBlockToVoteWidthRatio = seatBlocksConfig.layout.seatBlockToVoteWidthRatio;
	const columnGap = seatBlocksConfig.layout.columnGap;
	const minVoteWidth = seatBlocksConfig.layout.minVoteWidth;
	const minSeatBlockWidth = seatBlocksConfig.layout.minSeatBlockWidth;

	const minCircleRadius = seatBlocksConfig.grid.minCircleRadius;
	const circleRadiusRatio = seatBlocksConfig.grid.circleRadiusRatio;

	const majorityLineOverhang = 7;

	// One-line vote labels fit comfortably at this height.
	const minimumVoteLabelHeight = 18;

	// Keep the side legends compact. If too many parties win seats, small seat-winners are grouped.
	const minimumLegendRowHeight = 22;
	const maxLegendRows = Math.max(1, Math.floor(plotHeight / minimumLegendRowHeight));
	const groupedLegendColour = '#94a3b8';

	let measuredWidths = $state<Record<MeasureKey, number>>({
		actual: minSeatBlockWidth,
		vote: minVoteWidth,
		sv: minSeatBlockWidth
	});

	let seatBlockWidth = $derived(
		Math.max(minSeatBlockWidth, Math.min(measuredWidths.actual, measuredWidths.sv))
	);

	let voteWidth = $derived(Math.max(minVoteWidth, measuredWidths.vote));

	let layoutStyle = $derived(
		[
			`grid-template-columns: max-content minmax(${minSeatBlockWidth}px, ${seatBlockToVoteWidthRatio}fr) minmax(${minVoteWidth}px, 1fr) minmax(${minSeatBlockWidth}px, ${seatBlockToVoteWidthRatio}fr) max-content`,
			`column-gap: ${columnGap}px`
		].join('; ')
	);

	function measureColumn(node: HTMLElement, key: MeasureKey) {
		function updateWidth() {
			measuredWidths[key] = node.clientWidth;
		}

		updateWidth();

		if (typeof ResizeObserver === 'undefined') {
			return {
				destroy() {}
			};
		}

		const observer = new ResizeObserver(updateWidth);
		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	function percent(value: number): string {
		return `${(value * 100).toFixed(1)}%`;
	}

	function seatPercent(value: number): string {
		const percentage = value * 100;

		if (Math.abs(percentage - 100) < 0.05) {
			return '100%';
		}

		return `${percentage.toFixed(1)}%`;
	}

	function pluralSeats(count: number): string {
		return count === 1 ? 'seat' : 'seats';
	}

	function labelColourForBackground(hexColour: string): string {
		const cleanHex = hexColour.replace('#', '');

		if (cleanHex.length !== 6) {
			return '#ffffff';
		}

		const red = parseInt(cleanHex.slice(0, 2), 16);
		const green = parseInt(cleanHex.slice(2, 4), 16);
		const blue = parseInt(cleanHex.slice(4, 6), 16);

		const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

		return luminance > 0.58 ? '#0f172a' : '#ffffff';
	}

	function chooseSeatGrid(seats: number): SeatGrid {
		const safeSeats = Math.max(1, Math.round(seats));

		let bestGrid: SeatGrid | null = null;
		let bestPitch = -1;
		let bestUnused = Number.POSITIVE_INFINITY;

		for (let columns = 1; columns <= safeSeats; columns += 1) {
			const rows = Math.ceil(safeSeats / columns);
			const dotPitch = Math.min(seatBlockWidth / columns, plotHeight / rows);
			const gridWidth = columns * dotPitch;
			const unused = (seatBlockWidth - gridWidth) / seatBlockWidth;

			if (dotPitch > bestPitch || (dotPitch === bestPitch && unused < bestUnused)) {
				bestPitch = dotPitch;
				bestUnused = unused;
				bestGrid = {
					columns,
					rows,
					dotPitch,
					gridWidth,
					gridX: (seatBlockWidth - gridWidth) / 2
				};
			}
		}

		return (
			bestGrid ?? {
				columns: 1,
				rows: safeSeats,
				dotPitch: Math.min(seatBlockWidth, plotHeight / safeSeats),
				gridWidth: seatBlockWidth,
				gridX: 0
			}
		);
	}

	let seatGrid = $derived(chooseSeatGrid(totalSeats));
	let columnCount = $derived(seatGrid.columns);
	let dotPitch = $derived(seatGrid.dotPitch);
	let gridWidth = $derived(seatGrid.gridWidth);
	let gridX = $derived(seatGrid.gridX);

	let circleRadius = $derived(Math.max(minCircleRadius, dotPitch * circleRadiusRatio));

	let majoritySeats = $derived(Math.floor(totalSeats / 2) + 1);
	let majorityLabel = $derived(`${majoritySeats}`);

	function makeSeatDots(seatKey: 'actualSeats' | 'svSeats', side: SeatSide): SeatDot[] {
		const dots: SeatDot[] = [];
		let seatIndex = 0;

		for (const party of parties) {
			const seatCount = Math.max(0, Math.round(party[seatKey]));

			for (let i = 0; i < seatCount; i += 1) {
				const rowPosition = seatIndex % columnCount;
				const column = side === 'left' ? columnCount - 1 - rowPosition : rowPosition;
				const row = Math.floor(seatIndex / columnCount);

				dots.push({
					index: seatIndex,
					partyId: party.id,
					label: party.label,
					colour: party.colour,
					cx: gridX + column * dotPitch + dotPitch / 2,
					cy: plotHeight - (row * dotPitch + dotPitch / 2)
				});

				seatIndex += 1;
			}
		}

		return dots;
	}

	function makeBoundaryPath(boundarySeats: number, side: SeatSide): string {
		const fullRows = Math.floor(boundarySeats / columnCount);
		const partialSeats = boundarySeats % columnCount;

		const left = gridX;
		const right = gridX + gridWidth;

		if (partialSeats === 0) {
			const y = plotTop + plotHeight - fullRows * dotPitch;
			return `M ${left} ${y} H ${right}`;
		}

		const yTop = plotTop + plotHeight - (fullRows + 1) * dotPitch;
		const yBottom = plotTop + plotHeight - fullRows * dotPitch;

		if (side === 'right') {
			const stepX = left + partialSeats * dotPitch;
			return [`M ${left} ${yTop}`, `H ${stepX}`, `V ${yBottom}`, `H ${right}`].join(' ');
		}

		const stepX = right - partialSeats * dotPitch;
		return [`M ${left} ${yBottom}`, `H ${stepX}`, `V ${yTop}`, `H ${right}`].join(' ');
	}

	function makeBoundaryLines(seatKey: 'actualSeats' | 'svSeats', side: SeatSide): BoundaryLine[] {
		const boundaries: BoundaryLine[] = [];
		let cumulative = 0;
		const blockSeatTotal = parties.reduce(
			(total, party) => total + Math.max(0, Math.round(party[seatKey])),
			0
		);

		for (const party of parties) {
			const seatCount = Math.max(0, Math.round(party[seatKey]));
			cumulative += seatCount;

			if (seatCount > 0 && cumulative > 0 && cumulative < blockSeatTotal) {
				boundaries.push({
					id: `${seatKey}-${party.id}`,
					path: makeBoundaryPath(cumulative, side)
				});
			}
		}

		return boundaries;
	}

	function makeMajorityLine(side: SeatSide): MajorityLine {
		const fullRows = Math.floor(majoritySeats / columnCount);
		const partialSeats = majoritySeats % columnCount;

		const left = gridX;
		const right = gridX + gridWidth;

		const labelX =
			side === 'left' ? right + majorityLineOverhang + 5 : left - majorityLineOverhang - 5;

		const labelAnchor = side === 'left' ? 'start' : 'end';

		if (partialSeats === 0) {
			const y = plotTop + plotHeight - fullRows * dotPitch;

			return {
				path: `M ${left - majorityLineOverhang} ${y} H ${right + majorityLineOverhang}`,
				labelX,
				labelY: y - 5,
				labelAnchor
			};
		}

		const yTop = plotTop + plotHeight - (fullRows + 1) * dotPitch;
		const yBottom = plotTop + plotHeight - fullRows * dotPitch;

		if (side === 'right') {
			const stepX = left + partialSeats * dotPitch;

			return {
				path: [
					`M ${left - majorityLineOverhang} ${yTop}`,
					`H ${stepX}`,
					`V ${yBottom}`,
					`H ${right + majorityLineOverhang}`
				].join(' '),
				labelX,
				labelY: yBottom - 5,
				labelAnchor
			};
		}

		const stepX = right - partialSeats * dotPitch;

		return {
			path: [
				`M ${left - majorityLineOverhang} ${yBottom}`,
				`H ${stepX}`,
				`V ${yTop}`,
				`H ${right + majorityLineOverhang}`
			].join(' '),
			labelX,
			labelY: yBottom - 5,
			labelAnchor
		};
	}

	function makeVoteSegments(): VoteSegment[] {
		const segments: VoteSegment[] = [];
		let cumulative = 0;

		for (const party of parties) {
			const voteShare = Math.max(0, party.voteShare);
			const next = cumulative + voteShare;

			segments.push({
				id: party.id,
				label: party.label,
				shortLabel: party.shortLabel,
				colour: party.colour,
				labelColour: labelColourForBackground(party.colour),
				voteShare,
				voteShareText: percent(voteShare),
				y: plotTop + plotHeight * (1 - next),
				height: plotHeight * voteShare
			});

			cumulative = next;
		}

		return segments;
	}

	function chooseLegendGroupingThreshold(rows: LegendRow[]): number {
		if (rows.length <= maxLegendRows) {
			return 0;
		}

		const maximumSeatCount = rows.reduce((maximum, row) => Math.max(maximum, row.seatCount), 0);

		for (let threshold = 1; threshold <= maximumSeatCount; threshold += 1) {
			const groupedCount = rows.filter((row) => row.seatCount <= threshold).length;

			if (groupedCount < 2) {
				continue;
			}

			const visibleRowCount = rows.length - groupedCount + 1;

			if (visibleRowCount <= maxLegendRows) {
				return threshold;
			}
		}

		return maximumSeatCount;
	}

	function makeGroupedLegendTooltip(rows: LegendRow[], threshold: number): string {
		const title = `Grouped parties with ${threshold} ${pluralSeats(threshold)} or fewer:`;

		const lines = rows.map(
			(row) => `${row.shortLabel}: ${row.seatCount} ${pluralSeats(row.seatCount)}`
		);

		return [title, ...lines].join('\n');
	}

	function makeLegendRows(seatKey: 'actualSeats' | 'svSeats'): LegendRow[] {
		const rows: LegendRow[] = [...parties]
			.reverse()
			.map((party) => {
				const seatCount = Math.max(0, Math.round(party[seatKey]));

				return {
					id: `${seatKey}-${party.id}`,
					shortLabel: party.shortLabel,
					colour: party.colour,
					seatCount,
					seatShareText: `${seatCount} (${seatPercent(seatCount / totalSeats)})`,
					hasMajority: seatCount >= majoritySeats,
					isGrouped: false,
					tooltip: `${party.label}: ${seatCount} ${pluralSeats(seatCount)}`
				};
			})
			.filter((row) => row.seatCount > 0);

		const threshold = chooseLegendGroupingThreshold(rows);

		if (threshold <= 0) {
			return rows;
		}

		const groupedRows = rows.filter((row) => row.seatCount <= threshold);
		const ungroupedRows = rows.filter((row) => row.seatCount > threshold);

		if (groupedRows.length < 2) {
			return rows;
		}

		const groupedSeatCount = groupedRows.reduce((total, row) => total + row.seatCount, 0);

		const groupedRow: LegendRow = {
			id: `${seatKey}-grouped-other`,
			shortLabel: 'Other',
			colour: groupedLegendColour,
			seatCount: groupedSeatCount,
			seatShareText: `${groupedSeatCount} (${seatPercent(groupedSeatCount / totalSeats)})`,
			hasMajority: false,
			isGrouped: true,
			tooltip: makeGroupedLegendTooltip(groupedRows, threshold)
		};

		return [groupedRow, ...ungroupedRows];
	}

	let actualDots = $derived(makeSeatDots('actualSeats', 'left'));
	let svDots = $derived(makeSeatDots('svSeats', 'right'));
	let voteSegments = $derived(makeVoteSegments());

	let actualBoundaryLines = $derived(makeBoundaryLines('actualSeats', 'left'));
	let svBoundaryLines = $derived(makeBoundaryLines('svSeats', 'right'));

	let actualMajorityLine = $derived(makeMajorityLine('left'));
	let svMajorityLine = $derived(makeMajorityLine('right'));

	let actualLegendRows = $derived(makeLegendRows('actualSeats'));
	let svLegendRows = $derived(makeLegendRows('svSeats'));

	let actualSeatTotal = $derived(parties.reduce((total, party) => total + party.actualSeats, 0));
	let svSeatTotal = $derived(parties.reduce((total, party) => total + party.svSeats, 0));
</script>

<div class="seat-blocks-card">
	<div class="seat-blocks-layout" style={layoutStyle}>
		<div class="legend-column">
			<div class="legend-anchor" style={`margin-top: ${plotTop}px; height: ${plotHeight}px;`}>
				<table class="result-table">
					<tbody>
						{#each actualLegendRows as row (row.id)}
							<tr
								class:majority-row={row.hasMajority}
								class:grouped-row={row.isGrouped}
								title={row.tooltip}
							>
								<td class="abbr-cell">{row.shortLabel}</td>
								<td class="hex-cell">
									<span class="legend-hex" style={`--party-colour: ${row.colour};`}></span>
								</td>
								<td class="result-cell">{row.seatShareText}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<div class="actual-column" use:measureColumn={'actual'}>
			<svg
				class="chart-svg block-svg"
				viewBox={`0 0 ${seatBlockWidth} ${svgHeight}`}
				role="img"
				aria-label="Actual seats"
			>
				<rect class="background" x="0" y="0" width={seatBlockWidth} height={svgHeight} />

				<text class="column-title" x={seatBlockWidth / 2} y="22">Actual seats</text>
				<text class="column-subtitle" x={seatBlockWidth / 2} y="39">{actualSeatTotal} seats</text>

				{#each actualDots as dot (`actual-${dot.index}`)}
					<circle cx={dot.cx} cy={plotTop + dot.cy} r={circleRadius} fill={dot.colour}>
						<title>{dot.label}, actual seat {dot.index + 1}</title>
					</circle>
				{/each}

				{#each actualBoundaryLines as line (line.id)}
					<path class="party-boundary-line" d={line.path} />
				{/each}

				<path class="majority-line" d={actualMajorityLine.path} />
				<text
					class="majority-label"
					x={actualMajorityLine.labelX}
					y={actualMajorityLine.labelY}
					style={`text-anchor: ${actualMajorityLine.labelAnchor};`}
				>
					{majorityLabel}
				</text>
			</svg>
		</div>

		<div class="vote-column" use:measureColumn={'vote'}>
			<svg
				class="chart-svg vote-svg"
				viewBox={`0 0 ${voteWidth} ${svgHeight}`}
				role="img"
				aria-label="Vote share"
			>
				<rect class="background" x="0" y="0" width={voteWidth} height={svgHeight} />

				<text class="column-title" x={voteWidth / 2} y="22">Votes</text>

				<rect
					class="vote-frame"
					x="0"
					y={plotTop}
					width={voteWidth}
					height={plotHeight}
					rx="10"
				/>

				{#each voteSegments as segment (segment.id)}
					<rect x="0" y={segment.y} width={voteWidth} height={segment.height} fill={segment.colour}>
						<title>{segment.label}: {segment.voteShareText} of votes</title>
					</rect>

					{#if segment.height >= minimumVoteLabelHeight}
						<text
							class="vote-label"
							x={voteWidth / 2}
							y={segment.y + segment.height / 2}
							style={`fill: ${segment.labelColour};`}
						>
							{segment.shortLabel} {segment.voteShareText}
						</text>
					{/if}
				{/each}
			</svg>
		</div>

		<div class="sv-column" use:measureColumn={'sv'}>
			<svg
				class="chart-svg block-svg"
				viewBox={`0 0 ${seatBlockWidth} ${svgHeight}`}
				role="img"
				aria-label="Strengthened Voting seats"
			>
				<rect class="background" x="0" y="0" width={seatBlockWidth} height={svgHeight} />

				<text class="column-title" x={seatBlockWidth / 2} y="22">SV seats</text>
				<text class="column-subtitle" x={seatBlockWidth / 2} y="39">{svSeatTotal} seats</text>

				{#each svDots as dot (`sv-${dot.index}`)}
					<circle cx={dot.cx} cy={plotTop + dot.cy} r={circleRadius} fill={dot.colour}>
						<title>{dot.label}, SV seat {dot.index + 1}</title>
					</circle>
				{/each}

				{#each svBoundaryLines as line (line.id)}
					<path class="party-boundary-line" d={line.path} />
				{/each}

				<path class="majority-line" d={svMajorityLine.path} />
				<text
					class="majority-label"
					x={svMajorityLine.labelX}
					y={svMajorityLine.labelY}
					style={`text-anchor: ${svMajorityLine.labelAnchor};`}
				>
					{majorityLabel}
				</text>
			</svg>
		</div>

		<div class="legend-column">
			<div class="legend-anchor" style={`margin-top: ${plotTop}px; height: ${plotHeight}px;`}>
				<table class="result-table">
					<tbody>
						{#each svLegendRows as row (row.id)}
							<tr
								class:majority-row={row.hasMajority}
								class:grouped-row={row.isGrouped}
								title={row.tooltip}
							>
								<td class="abbr-cell">{row.shortLabel}</td>
								<td class="hex-cell">
									<span class="legend-hex" style={`--party-colour: ${row.colour};`}></span>
								</td>
								<td class="result-cell">{row.seatShareText}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<style>
	.seat-blocks-card {
		height: clamp(500px, calc(100vh - 230px), 660px);
		border: 1px solid #cbd5e1;
		border-radius: 20px;
		background: white;
		padding: 18px;
		overflow: auto;
	}

	.seat-blocks-layout {
		display: grid;
		height: 100%;
		align-items: start;
	}

	.legend-column {
		min-width: max-content;
		height: 100%;
	}

	.legend-anchor {
		display: flex;
		align-items: flex-end;
		min-width: max-content;
	}

	.result-table {
		width: max-content;
		border-collapse: collapse;
		color: #0f172a;
		font-size: 0.82rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		line-height: 1.25;
	}

	.result-table td {
		padding-top: 4px;
		padding-bottom: 4px;
		vertical-align: middle;
		white-space: nowrap;
	}

	.abbr-cell {
		min-width: 6ch;
		padding-right: 2px;
		text-align: right;
	}

	.hex-cell {
		width: 16px;
		padding-right: 1px;
		padding-left: 1px;
		text-align: center;
	}

	.result-cell {
		width: 11.5ch;
		min-width: 11.5ch;
		max-width: 11.5ch;
		padding-left: 2px;
		text-align: left;
	}

	.majority-row {
		font-weight: 950;
	}

	.grouped-row {
		color: #475569;
	}

	.legend-hex {
		display: inline-block;
		width: 13px;
		height: 13px;
		background: var(--party-colour);
		clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
		transform: rotate(90deg);
	}

	.actual-column,
	.vote-column,
	.sv-column {
		min-width: 0;
	}

	.chart-svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 100%;
		overflow: visible;
	}

	.background {
		fill: #ffffff;
	}

	.column-title {
		fill: #0f172a;
		font-size: 16px;
		font-weight: 900;
		text-anchor: middle;
	}

	.column-subtitle {
		fill: #64748b;
		font-size: 12px;
		font-weight: 800;
		text-anchor: middle;
	}

	.vote-frame {
		fill: none;
		stroke: #cbd5e1;
		stroke-width: 1.5;
	}

	.vote-label {
		font-size: 11px;
		font-weight: 950;
		font-variant-numeric: tabular-nums;
		text-anchor: middle;
		dominant-baseline: middle;
		pointer-events: none;
	}

	.party-boundary-line {
		fill: none;
		stroke: rgba(255, 255, 255, 0.82);
		stroke-width: 1.4;
		stroke-linecap: round;
		stroke-linejoin: round;
		pointer-events: none;
	}

	.majority-line {
		fill: none;
		stroke: #0f172a;
		stroke-width: 1.3;
		stroke-dasharray: 4 4;
		stroke-linecap: round;
		stroke-linejoin: round;
		pointer-events: none;
	}

	.majority-label {
		fill: #0f172a;
		font-size: 11px;
		font-weight: 900;
		pointer-events: none;
	}
</style>