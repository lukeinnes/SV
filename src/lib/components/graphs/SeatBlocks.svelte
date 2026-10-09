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
		voteShare: number;
		y: number;
		height: number;
	};

	type SeatGrid = {
		columns: number;
		rows: number;
		capacity: number;
	};

	type Props = {
		parties: SeatBlocksParty[];
		totalSeats: number;
	};

    type MajorityLine = {
        path: string;
        labelX: number;
        labelY: number;
    };

	let { parties, totalSeats }: Props = $props();

    const svgWidth = seatBlocksConfig.svg.width;
    const plotTop = seatBlocksConfig.svg.plotTop;
    const plotHeight = seatBlocksConfig.svg.plotHeight;
    const plotBottom = seatBlocksConfig.svg.plotBottom;
    const svgHeight = plotTop + plotHeight + plotBottom;

    const voteWidth = seatBlocksConfig.layout.voteWidth;
    const voteCenterX = svgWidth / 2;

    const resultOffset = seatBlocksConfig.layout.resultOffset;
    const actualCenterX = voteCenterX - resultOffset;
    const svCenterX = voteCenterX + resultOffset;

    const targetSeatAspectRatio = seatBlocksConfig.grid.targetSeatAspectRatio;

	function chooseSeatGrid(seats: number): SeatGrid {
		const safeSeats = Math.max(1, Math.round(seats));
		const idealColumns = Math.sqrt(safeSeats / targetSeatAspectRatio);

		let bestGrid: SeatGrid | null = null;
		let bestScore = Number.POSITIVE_INFINITY;

		const minColumns = Math.max(1, Math.floor(idealColumns) - 8);
		const maxColumns = Math.max(1, Math.ceil(idealColumns) + 8);

		for (let columns = minColumns; columns <= maxColumns; columns += 1) {
			const rows = Math.ceil(safeSeats / columns);
			const capacity = columns * rows;
			const aspectRatio = rows / columns;
			const aspectError = Math.abs(aspectRatio - targetSeatAspectRatio) / targetSeatAspectRatio;
			const spareSeatPenalty = (capacity - safeSeats) / safeSeats;

			const score = aspectError * 10 + spareSeatPenalty;

			if (score < bestScore) {
				bestScore = score;
				bestGrid = {
					columns,
					rows,
					capacity
				};
			}
		}

		return (
			bestGrid ?? {
				columns: 1,
				rows: safeSeats,
				capacity: safeSeats
			}
		);
	}

	let seatGrid = $derived(chooseSeatGrid(totalSeats));
	let rowCount = $derived(seatGrid.rows);
	let columnCount = $derived(seatGrid.columns);
	let seatCapacity = $derived(seatGrid.capacity);
	let circlePitch = $derived(plotHeight / rowCount);
	let circleRadius = $derived(Math.max(1.4, circlePitch * 0.36));
	let seatBlockWidth = $derived(columnCount * circlePitch);

	let actualX = $derived(actualCenterX - seatBlockWidth / 2);
	let voteX = voteCenterX - voteWidth / 2;
	let svX = $derived(svCenterX - seatBlockWidth / 2);

    let majoritySeats = $derived(Math.floor(totalSeats / 2) + 1);
    let majorityLabel = $derived(`${majoritySeats}`);

    const majorityLineOverhang = 7;

    function makeMajorityLine(blockX: number): MajorityLine {
        const fullRows = Math.floor(majoritySeats / columnCount);
        const partialSeats = majoritySeats % columnCount;

        const left = blockX;
        const right = blockX + seatBlockWidth;

        if (partialSeats === 0) {
            const y = plotTop + plotHeight - fullRows * circlePitch;

            return {
                path: `M ${left - majorityLineOverhang} ${y} H ${right + majorityLineOverhang}`,
                labelX: right + majorityLineOverhang + 5,
                labelY: y - 5
            };
        }

        const yTop = plotTop + plotHeight - (fullRows + 1) * circlePitch;
        const yBottom = plotTop + plotHeight - fullRows * circlePitch;
        const stepX = left + partialSeats * circlePitch;

        return {
            path: [
                `M ${left - majorityLineOverhang} ${yTop}`,
                `H ${stepX}`,
                `V ${yBottom}`,
                `H ${right + majorityLineOverhang}`
            ].join(' '),
            labelX: right + majorityLineOverhang + 5,
            labelY: yBottom - 5
        };
    }

    let actualMajorityLine = $derived(makeMajorityLine(actualX));
    let svMajorityLine = $derived(makeMajorityLine(svX));

	function percent(value: number): string {
		return `${(value * 100).toFixed(1)}%`;
	}

	function makeSeatDots(seatKey: 'actualSeats' | 'svSeats'): SeatDot[] {
		const dots: SeatDot[] = [];
		let seatIndex = 0;

		for (const party of parties) {
			const seatCount = Math.max(0, Math.round(party[seatKey]));

			for (let i = 0; i < seatCount; i += 1) {
				const column = seatIndex % columnCount;
				const row = Math.floor(seatIndex / columnCount);

				dots.push({
					index: seatIndex,
					partyId: party.id,
					label: party.label,
					colour: party.colour,
					cx: column * circlePitch + circlePitch / 2,
					cy: plotHeight - (row * circlePitch + circlePitch / 2)
				});

				seatIndex += 1;
			}
		}

		return dots;
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
				voteShare,
				y: plotTop + plotHeight * (1 - next),
				height: plotHeight * voteShare
			});

			cumulative = next;
		}

		return segments;
	}

	let actualDots = $derived(makeSeatDots('actualSeats'));
	let svDots = $derived(makeSeatDots('svSeats'));
	let voteSegments = $derived(makeVoteSegments());

	let actualSeatTotal = $derived(parties.reduce((total, party) => total + party.actualSeats, 0));
	let svSeatTotal = $derived(parties.reduce((total, party) => total + party.svSeats, 0));
</script>

<div class="seat-blocks-card">
	<div class="seat-blocks-viewport">
		<svg
			class="seat-blocks"
			viewBox={`0 0 ${svgWidth} ${svgHeight}`}
			role="img"
			aria-label="Election comparison showing vote share, actual seats, and Strengthened Voting seats"
		>
			<rect class="background" x="0" y="0" width={svgWidth} height={svgHeight} />

			<text class="column-title" x={actualCenterX} y="22">Actual seats</text>
			<text class="column-title" x={voteCenterX} y="22">Votes</text>
			<text class="column-title" x={svCenterX} y="22">SV seats</text>

			<text class="column-subtitle" x={actualCenterX} y="39">
				{actualSeatTotal} seats
			</text>
			<text class="column-subtitle" x={voteCenterX} y="39">100%</text>
			<text class="column-subtitle" x={svCenterX} y="39">
				{svSeatTotal} seats
			</text>

			<rect
				class="vote-frame"
				x={voteX}
				y={plotTop}
				width={voteWidth}
				height={plotHeight}
				rx="10"
			/>

			{#each actualDots as dot (`actual-${dot.index}`)}
				<circle
					cx={actualX + dot.cx}
					cy={plotTop + dot.cy}
					r={circleRadius}
					fill={dot.colour}
				>
					<title>{dot.label}, actual seat {dot.index + 1}</title>
				</circle>
			{/each}

            <path class="majority-line" d={actualMajorityLine.path} />
            <text class="majority-label" x={actualMajorityLine.labelX} y={actualMajorityLine.labelY}>
                {majorityLabel}
            </text>            

			{#each voteSegments as segment (segment.id)}
				<rect
					x={voteX}
					y={segment.y}
					width={voteWidth}
					height={segment.height}
					fill={segment.colour}
				>
					<title>{segment.label}: {percent(segment.voteShare)} of votes</title>
				</rect>

				{#if segment.height >= 30}
					<text
						class="vote-label"
						x={voteCenterX}
						y={segment.y + segment.height / 2 + 4}
					>
						{segment.shortLabel}
					</text>
				{/if}
			{/each}

			{#each svDots as dot (`sv-${dot.index}`)}
				<circle
					cx={svX + dot.cx}
					cy={plotTop + dot.cy}
					r={circleRadius}
					fill={dot.colour}
				>
					<title>{dot.label}, SV seat {dot.index + 1}</title>
				</circle>
			{/each}

            <path class="majority-line" d={svMajorityLine.path} />
            <text class="majority-label" x={svMajorityLine.labelX} y={svMajorityLine.labelY}>
                {majorityLabel}
            </text>

			<text class="axis-note" x={actualCenterX} y={svgHeight - 26}>
				{columnCount} × {rowCount} grid, capacity {seatCapacity}
			</text>
			<text class="axis-note" x={voteCenterX} y={svgHeight - 26}>
				vote share
			</text>
			<text class="axis-note" x={svCenterX} y={svgHeight - 26}>
				{columnCount} × {rowCount} grid, capacity {seatCapacity}
			</text>
		</svg>
	</div>

	<div class="legend">
		{#each parties as party (party.id)}
			<div class="legend-item">
				<span class="swatch" style={`--party-colour: ${party.colour};`}></span>
				<strong>{party.shortLabel}</strong>
				<span>{percent(party.voteShare)}</span>
				<span>{party.actualSeats} actual</span>
				<span>{party.svSeats} SV</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.seat-blocks-card {
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		gap: 12px;
		height: clamp(420px, calc(100vh - 230px), 620px);
		border: 1px solid #cbd5e1;
		border-radius: 20px;
		background: white;
		padding: 18px;
	}

	.seat-blocks-viewport {
		display: flex;
		justify-content: center;
		min-height: 0;
		overflow: auto;
	}

	.seat-blocks {
		display: block;
		width: auto;
		height: 100%;
		max-width: none;
		flex: 0 0 auto;
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

	.column-subtitle,
	.axis-note {
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
		fill: white;
		font-size: 13px;
		font-weight: 900;
		text-anchor: middle;
		dominant-baseline: middle;
		pointer-events: none;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		overflow: hidden;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 6px;
		border: 1px solid #e2e8f0;
		border-radius: 999px;
		padding: 6px 9px;
		color: #334155;
		font-size: 0.86rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.swatch {
		width: 12px;
		height: 12px;
		border-radius: 999px;
		background: var(--party-colour);
	}

	.legend-item strong {
		color: #0f172a;
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
        text-anchor: start;
        pointer-events: none;
    }    
</style>