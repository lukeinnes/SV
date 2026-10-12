<script lang="ts">
	import { electionTransformationConfig } from '$lib/graphs/graphConfig';
	import type { RealElectionCalculation } from '$lib/sv/calculateRealElection';

	type PartyKind = RealElectionCalculation['parties'][number]['kind'];

	type Props = {
		calculation: RealElectionCalculation;
		useEnglishNames?: boolean;
	};

	type TransformationRow = {
		id: string;
		arrowId: string;
		name: string;
		shortName: string;
		colour: string;
		kind: PartyKind;
		votes: number;
		voteShare: number;
		seatShare: number;
		seats: number;
	};

	type DonutSlice = {
		id: string;
		row: TransformationRow;
		value: number;
		share: number;
		path: string;
		middleFraction: number;
	};

	type DonutAnnotation = {
		id: string;
		name: string;
		value: string;
		textX: number;
		nameY: number;
		valueY: number;
		linePath: string;
		colour: string;
	};

	type AnnotationCandidate = {
		slice: DonutSlice;
		rimX: number;
		rimY: number;
		lineEndX: number;
		lineEndY: number;
	};

	type AnnotationBox = {
		left: number;
		right: number;
		top: number;
		bottom: number;
	};

	type AnnotationPosition = {
		textX: number;
		nameY: number;
		valueY: number;
		box: AnnotationBox;
		score: number;
	};

	let { calculation, useEnglishNames = false }: Props = $props();

	let smallPartyZoom = $state(false);

	const configuredDumbbellColumnFraction =
		electionTransformationConfig.layout.dumbbellColumnFraction;

	const donutSize = 240;
	const donutCentre = donutSize / 2;
	const donutOuterRadius = 62;
	const donutInnerRadius = 40;
	const donutMinimumAnnotationShare = 0.006;
	const donutLabelPadding = 4;
	const donutLabelMinimumGap = 3;

	const dumbbellWidth = 460;
	const dumbbellTop = 18;
	const dumbbellBottom = 30;
	const dumbbellRowHeight = 24;
	const dumbbellPlotLeft = 78;
	const dumbbellPlotRight = 14;
	const dumbbellPlotWidth = dumbbellWidth - dumbbellPlotLeft - dumbbellPlotRight;

	const smallPartyZoomMaximum = 0.15;

	function clamp(value: number, minimum: number, maximum: number): number {
		return Math.min(maximum, Math.max(minimum, value));
	}

	function visibleColour(colour: string): string {
		return colour.toLowerCase() === '#ffffff' ? '#94a3b8' : colour;
	}

	function safeId(value: string): string {
		return value.replace(/[^a-zA-Z0-9_-]/g, '-');
	}

	function partyName(party: RealElectionCalculation['parties'][number]): string {
		if (useEnglishNames && party.englishName) {
			return party.englishName;
		}

		return party.usualName;
	}

	function annotationName(row: TransformationRow): string {
		const label = row.shortName || row.name;

		if (label.length <= 10) {
			return label;
		}

		return `${label.slice(0, 9)}…`;
	}

	function formatPercent(value: number): string {
		return `${(value * 100).toFixed(1)}%`;
	}

	function formatAxisPercent(value: number): string {
		return `${(value * 100).toFixed(0)}%`;
	}

	function makeRows(): TransformationRow[] {
		const partyRows = [...calculation.parties]
			.sort((left, right) => right.votes - left.votes)
			.map((party): TransformationRow => {
				const id = party.partyId;

				return {
					id,
					arrowId: `sv-arrow-${safeId(id)}`,
					name: partyName(party),
					shortName: party.shortName,
					colour: visibleColour(party.colour),
					kind: party.kind,
					votes: party.votes,
					voteShare: party.voteShare,
					seatShare: party.svSeatShare,
					seats: party.svSeats
				};
			});

		const primaryRows = partyRows.filter((row) => row.kind === 'party' && row.votes > calculation.tau);
		const otherRows = partyRows.filter((row) => !(row.kind === 'party' && row.votes > calculation.tau));

		if (otherRows.length === 0) {
			return primaryRows;
		}

		const otherRow: TransformationRow = {
			id: 'grouped-other',
			arrowId: 'sv-arrow-grouped-other',
			name: 'Other',
			shortName: 'Other',
			colour: '#94a3b8',
			kind: 'other',
			votes: otherRows.reduce((total, row) => total + row.votes, 0),
			voteShare: otherRows.reduce((total, row) => total + row.voteShare, 0),
			seatShare: otherRows.reduce((total, row) => total + row.seatShare, 0),
			seats: otherRows.reduce((total, row) => total + row.seats, 0)
		};

		return [...primaryRows, otherRow];
	}

	function polarPoint(
		centreX: number,
		centreY: number,
		radius: number,
		fraction: number
	): { x: number; y: number } {
		const angle = fraction * Math.PI * 2 - Math.PI / 2;

		return {
			x: centreX + radius * Math.cos(angle),
			y: centreY + radius * Math.sin(angle)
		};
	}

	function describeDonutArc(
		centreX: number,
		centreY: number,
		outerRadius: number,
		innerRadius: number,
		startFraction: number,
		endFraction: number
	): string {
		const adjustedEnd =
			startFraction === 0 && endFraction >= 1 ? 0.999999 : Math.min(endFraction, 0.999999);
		const outerStart = polarPoint(centreX, centreY, outerRadius, startFraction);
		const outerEnd = polarPoint(centreX, centreY, outerRadius, adjustedEnd);
		const innerEnd = polarPoint(centreX, centreY, innerRadius, adjustedEnd);
		const innerStart = polarPoint(centreX, centreY, innerRadius, startFraction);
		const largeArc = adjustedEnd - startFraction > 0.5 ? 1 : 0;

		return [
			`M ${outerStart.x} ${outerStart.y}`,
			`A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
			`L ${innerEnd.x} ${innerEnd.y}`,
			`A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
			'Z'
		].join(' ');
	}

	function makeDonutSlices(rows: TransformationRow[], metric: 'vote' | 'seat'): DonutSlice[] {
		const values = rows.map((row) => (metric === 'vote' ? row.voteShare : row.seatShare));
		const total = values.reduce((sum, value) => sum + Math.max(0, value), 0);

		if (total <= 0) {
			return [];
		}

		const slices: DonutSlice[] = [];
		let cursor = 0;

		for (let index = 0; index < rows.length; index += 1) {
			const row = rows[index];
			const value = Math.max(0, values[index]);

			if (value <= 0) {
				continue;
			}

			const share = value / total;
			const start = cursor;
			const end = cursor + share;
			const middle = start + share / 2;

			slices.push({
				id: `${metric}-${row.id}`,
				row,
				value,
				share,
				middleFraction: middle,
				path: describeDonutArc(
					donutCentre,
					donutCentre,
					donutOuterRadius,
					donutInnerRadius,
					start,
					end
				)
			});

			cursor = end;
		}

		return slices;
	}

	function makeAnnotationCandidates(slices: DonutSlice[]): AnnotationCandidate[] {
		return slices
			.filter((slice) => slice.share >= donutMinimumAnnotationShare)
			.map((slice): AnnotationCandidate => {
				const rim = polarPoint(donutCentre, donutCentre, donutOuterRadius + 1, slice.middleFraction);
				const lineEnd = polarPoint(donutCentre, donutCentre, donutOuterRadius + 15, slice.middleFraction);

				return {
					slice,
					rimX: rim.x,
					rimY: rim.y,
					lineEndX: lineEnd.x,
					lineEndY: lineEnd.y
				};
			})
			.sort((left, right) => right.slice.value - left.slice.value);
	}

	function estimateLabelWidth(name: string, value: string): number {
		return clamp(Math.max(name.length, value.length) * 5.3 + 9, 30, 62);
	}

	function boxesOverlap(left: AnnotationBox, right: AnnotationBox): boolean {
		return !(
			left.right + donutLabelMinimumGap < right.left ||
			right.right + donutLabelMinimumGap < left.left ||
			left.bottom + donutLabelMinimumGap < right.top ||
			right.bottom + donutLabelMinimumGap < left.top
		);
	}

	function hasAnnotationSpace(box: AnnotationBox, placedBoxes: AnnotationBox[]): boolean {
		return placedBoxes.every((placedBox) => !boxesOverlap(box, placedBox));
	}

	function shiftedFraction(fraction: number, offset: number): number {
		const shifted = fraction + offset;

		if (shifted < 0) return shifted + 1;
		if (shifted >= 1) return shifted - 1;

		return shifted;
	}

	function makeAnnotationPositions(candidate: AnnotationCandidate): AnnotationPosition[] {
		const name = annotationName(candidate.slice.row);
		const value = formatPercent(candidate.slice.value);
		const width = estimateLabelWidth(name, value);
		const halfWidth = width / 2;
		const angleOffsets = [0, -0.018, 0.018, -0.036, 0.036, -0.054, 0.054];
		const labelRadii = [88, 100, 112, 124];
		const positions: AnnotationPosition[] = [];

		for (const angleOffset of angleOffsets) {
			for (const labelRadius of labelRadii) {
				const labelPoint = polarPoint(
					donutCentre,
					donutCentre,
					labelRadius,
					shiftedFraction(candidate.slice.middleFraction, angleOffset)
				);

				const textX = clamp(
					labelPoint.x,
					halfWidth + donutLabelPadding,
					donutSize - halfWidth - donutLabelPadding
				);
				const nameY = clamp(labelPoint.y - 4, 11, donutSize - 24);
				const valueY = nameY + 11;

				const box: AnnotationBox = {
					left: textX - halfWidth,
					right: textX + halfWidth,
					top: nameY - 8,
					bottom: valueY + 3
				};

				positions.push({
					textX,
					nameY,
					valueY,
					box,
					score: Math.abs(angleOffset) * 1000 + Math.abs(labelRadius - 100)
				});
			}
		}

		return positions.sort((left, right) => left.score - right.score);
	}

	function makeDonutAnnotations(slices: DonutSlice[]): DonutAnnotation[] {
		const candidates = makeAnnotationCandidates(slices);
		const placedBoxes: AnnotationBox[] = [];
		const annotations: DonutAnnotation[] = [];

		for (const candidate of candidates) {
			const position = makeAnnotationPositions(candidate).find((candidatePosition) =>
				hasAnnotationSpace(candidatePosition.box, placedBoxes)
			);

			if (!position) {
				continue;
			}

			placedBoxes.push(position.box);

			annotations.push({
				id: `annotation-${candidate.slice.id}`,
				name: annotationName(candidate.slice.row),
				value: formatPercent(candidate.slice.value),
				textX: position.textX,
				nameY: position.nameY,
				valueY: position.valueY,
				colour: candidate.slice.row.colour,
				linePath: [`M ${candidate.rimX} ${candidate.rimY}`, `L ${candidate.lineEndX} ${candidate.lineEndY}`].join(
					' '
				)
			});
		}

		return annotations;
	}

	function calculateFullAxisMaximum(rows: TransformationRow[]): number {
		const maximum = Math.max(0.1, ...rows.flatMap((row) => [row.voteShare, row.seatShare]));

		if (maximum <= 0.3) return 0.3;
		if (maximum <= 0.4) return 0.4;
		if (maximum <= 0.5) return 0.5;
		if (maximum <= 0.6) return 0.6;
		if (maximum <= 0.75) return 0.75;

		return 1;
	}

	function makeAxisTicks(maximum: number): number[] {
		if (maximum === smallPartyZoomMaximum) {
			return [0, 0.05, 0.1, 0.15];
		}

		const intervalCount = 5;

		return Array.from({ length: intervalCount + 1 }, (_, index) => (maximum / intervalCount) * index);
	}

	function clippedValue(value: number): number {
		return Math.min(value, axisMaximum);
	}

	function xPosition(value: number): number {
		return dumbbellPlotLeft + (clippedValue(value) / axisMaximum) * dumbbellPlotWidth;
	}

	function rowY(index: number): number {
		return dumbbellTop + index * dumbbellRowHeight + 11;
	}

	function hasVisibleShift(row: TransformationRow): boolean {
		return Math.abs(clippedValue(row.seatShare) - clippedValue(row.voteShare)) >= 0.003;
	}

	function isClipped(value: number): boolean {
		return value > axisMaximum;
	}

	function rowHasClipping(row: TransformationRow): boolean {
		return isClipped(row.voteShare) || isClipped(row.seatShare);
	}

	let transformationRows = $derived(makeRows());
	let voteSlices = $derived(makeDonutSlices(transformationRows, 'vote'));
	let seatSlices = $derived(makeDonutSlices(transformationRows, 'seat'));
	let voteAnnotations = $derived(makeDonutAnnotations(voteSlices));
	let seatAnnotations = $derived(makeDonutAnnotations(seatSlices));
	let fullAxisMaximum = $derived(calculateFullAxisMaximum(transformationRows));
	let axisMaximum = $derived(smallPartyZoom ? smallPartyZoomMaximum : fullAxisMaximum);
	let axisTicks = $derived(makeAxisTicks(axisMaximum));
	let dumbbellHeight = $derived(
		dumbbellTop + Math.max(1, transformationRows.length) * dumbbellRowHeight + dumbbellBottom
	);
	let dumbbellColumnFraction = $derived(clamp(configuredDumbbellColumnFraction, 0.2, 0.8));
	let donutColumnFraction = $derived((1 - dumbbellColumnFraction) / 2);
	let layoutStyle = $derived(
		`--donut-column-fr: ${donutColumnFraction}fr; --dumbbell-column-fr: ${dumbbellColumnFraction}fr;`
	);
</script>

<section class="transformation-card">
	<div class="section-heading">
		<p class="section-kicker">Visual comparison</p>
		<h2>Votes through SV into seats</h2>
		<p>
			The left chart shows the input vote shares. The centre chart shows each party moving from
			vote share to SV seat share. The right chart shows the resulting SV seat distribution.
		</p>
	</div>

	<div class="transformation-layout" style={layoutStyle}>
		<div class="donut-panel">
			<svg
				class="donut-svg"
				viewBox={`0 0 ${donutSize} ${donutSize}`}
				role="img"
				aria-label="Vote share donut chart"
			>
				{#each voteSlices as slice (slice.id)}
					<path
						d={slice.path}
						fill={slice.row.colour}
						stroke="#ffffff"
						stroke-width="0.2"
						vector-effect="non-scaling-stroke"
					>
						<title>{slice.row.name}: {formatPercent(slice.value)} of votes</title>
					</path>
				{/each}

				<circle class="donut-hole" cx={donutCentre} cy={donutCentre} r={donutInnerRadius - 2} />
				<text class="donut-centre-title" x={donutCentre} y={donutCentre - 5}>Input</text>
				<text class="donut-centre-value" x={donutCentre} y={donutCentre + 15}>Votes</text>

				{#each voteAnnotations as annotation (annotation.id)}
					<path class="annotation-line" d={annotation.linePath} stroke={annotation.colour}></path>
					<text class="donut-label" x={annotation.textX} y={annotation.nameY} text-anchor="middle">
						{annotation.name}
					</text>
					<text
						class="donut-label donut-label-value"
						x={annotation.textX}
						y={annotation.valueY}
						text-anchor="middle"
					>
						{annotation.value}
					</text>
				{/each}
			</svg>
		</div>

		<div class="dumbbell-panel">
			<button
				type="button"
				class="zoom-button"
				aria-label={smallPartyZoom ? 'Zoom out to full view' : 'Zoom in to small-party view'}
				aria-pressed={smallPartyZoom}
				title={smallPartyZoom ? 'Zoom out to full view' : 'Zoom in to small-party view'}
				onclick={() => (smallPartyZoom = !smallPartyZoom)}
			>
				<svg viewBox="0 0 32 32" aria-hidden="true">
					<circle class="zoom-lens" cx="13" cy="13" r="7"></circle>
					<line class="zoom-handle" x1="18" y1="18" x2="25" y2="25"></line>
					<line class="zoom-symbol" x1="9.5" y1="13" x2="16.5" y2="13"></line>
					{#if !smallPartyZoom}
						<line class="zoom-symbol" x1="13" y1="9.5" x2="13" y2="16.5"></line>
					{/if}
				</svg>
			</button>

			<svg
				class="dumbbell-svg"
				viewBox={`0 0 ${dumbbellWidth} ${dumbbellHeight}`}
				role="img"
				aria-label="Vote share to SV seat share comparison"
			>
				<defs>
					{#each transformationRows as row (row.id)}
						<marker
							id={row.arrowId}
							viewBox="0 0 10 10"
							refX="8.4"
							refY="5"
							markerWidth="3"
							markerHeight="3"
							orient="auto-start-reverse"
						>
							<path d="M 0 0 L 10 5 L 0 10 z" fill={row.colour}></path>
						</marker>
					{/each}
				</defs>

				{#each axisTicks as tick (tick)}
					<line
						class="grid-line"
						class:zero-grid-line={tick === 0}
						x1={xPosition(tick)}
						x2={xPosition(tick)}
						y1={dumbbellTop - 4}
						y2={dumbbellHeight - dumbbellBottom + 8}
					/>
					<text class="axis-label" x={xPosition(tick)} y={dumbbellHeight - 5} text-anchor="middle">
						{formatAxisPercent(tick)}
					</text>
				{/each}

				{#if smallPartyZoom}
					<text
						class="zoom-note"
						x={dumbbellPlotLeft + dumbbellPlotWidth - 44}
						y={dumbbellTop - 6}
						text-anchor="end"
					>
						Values beyond 15% clipped
					</text>
				{/if}

				{#each transformationRows as row, index (row.id)}
					<g>
						<title>
							{row.name}: {formatPercent(row.voteShare)} vote share to {formatPercent(row.seatShare)}
							SV seat share
						</title>

						<text
							class="party-row-label"
							x={dumbbellPlotLeft - 7}
							y={rowY(index) + 4}
							text-anchor="end"
						>
							{row.shortName}
						</text>

						<line
							class="row-guide"
							x1={dumbbellPlotLeft}
							x2={dumbbellPlotLeft + dumbbellPlotWidth}
							y1={rowY(index)}
							y2={rowY(index)}
						/>

						{#if hasVisibleShift(row)}
							<line
								class="shift-arrow"
								x1={xPosition(row.voteShare)}
								x2={xPosition(row.seatShare)}
								y1={rowY(index)}
								y2={rowY(index)}
								stroke={row.colour}
								marker-end={`url(#${row.arrowId})`}
							/>
						{/if}

						<circle
							class="vote-ring"
							cx={xPosition(row.voteShare)}
							cy={rowY(index)}
							r="4.5"
							stroke={row.colour}
						/>

						<line
							class="seat-marker"
							x1={xPosition(row.seatShare)}
							x2={xPosition(row.seatShare)}
							y1={rowY(index) - 5.5}
							y2={rowY(index) + 5.5}
							stroke={row.colour}
						/>

						{#if smallPartyZoom && rowHasClipping(row)}
							<path
								class="clip-marker"
								d={`M ${dumbbellPlotLeft + dumbbellPlotWidth - 4} ${rowY(index) - 6} L ${
									dumbbellPlotLeft + dumbbellPlotWidth + 4
								} ${rowY(index)} L ${dumbbellPlotLeft + dumbbellPlotWidth - 4} ${
									rowY(index) + 6
								}`}
								stroke={row.colour}
							/>
						{/if}
					</g>
				{/each}
			</svg>
		</div>

		<div class="donut-panel">
			<svg
				class="donut-svg"
				viewBox={`0 0 ${donutSize} ${donutSize}`}
				role="img"
				aria-label="SV seat share donut chart"
			>
				{#each seatSlices as slice (slice.id)}
					<path
						d={slice.path}
						fill={slice.row.colour}
						stroke="#ffffff"
						stroke-width="0.2"
						vector-effect="non-scaling-stroke"
					>
						<title>{slice.row.name}: {formatPercent(slice.value)} of SV seats</title>
					</path>
				{/each}

				<circle class="donut-hole" cx={donutCentre} cy={donutCentre} r={donutInnerRadius - 2} />
				<text class="donut-centre-title" x={donutCentre} y={donutCentre - 5}>Output</text>
				<text class="donut-centre-value" x={donutCentre} y={donutCentre + 15}>Seats</text>

				{#each seatAnnotations as annotation (annotation.id)}
					<path class="annotation-line" d={annotation.linePath} stroke={annotation.colour}></path>
					<text class="donut-label" x={annotation.textX} y={annotation.nameY} text-anchor="middle">
						{annotation.name}
					</text>
					<text
						class="donut-label donut-label-value"
						x={annotation.textX}
						y={annotation.valueY}
						text-anchor="middle"
					>
						{annotation.value}
					</text>
				{/each}
			</svg>
		</div>
	</div>
</section>

<style>
	.transformation-card {
		display: grid;
		gap: 18px;
		overflow: visible;
		border: 1px solid #cbd5e1;
		border-radius: 20px;
		background: white;
		padding: 18px;
	}

	.section-heading {
		display: grid;
		gap: 4px;
		text-align: center;
	}

	.section-kicker {
		margin: 0;
		color: #2563eb;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	h2,
	p {
		margin: 0;
	}

	h2 {
		color: #0f172a;
		font-size: clamp(1.5rem, 2.5vw, 2rem);
		letter-spacing: -0.04em;
	}

	p {
		color: #64748b;
		font-size: 0.92rem;
		line-height: 1.45;
	}

	.transformation-layout {
		display: grid;
		grid-template-columns:
			minmax(0, var(--donut-column-fr, 0.3fr))
			minmax(0, var(--dumbbell-column-fr, 0.4fr))
			minmax(0, var(--donut-column-fr, 0.3fr));
		gap: 18px;
		align-items: center;
	}

	.donut-panel,
	.dumbbell-panel {
		min-width: 0;
		background: transparent;
	}

	.donut-panel {
		display: grid;
		justify-items: center;
		align-items: center;
		overflow: visible;
	}

	.dumbbell-panel {
		position: relative;
		display: grid;
		align-items: center;
	}

	.zoom-button {
		position: absolute;
		right: 8px;
		bottom: 22px;
		z-index: 2;
		display: inline-grid;
		width: 34px;
		height: 34px;
		place-items: center;
		border: 1px solid #94a3b8;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.94);
		color: #334155;
		padding: 0;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
	}

	.zoom-button:hover {
		border-color: #2563eb;
		background: #eff6ff;
		color: #1d4ed8;
	}

	.zoom-button svg {
		width: 22px;
		height: 22px;
	}

	.zoom-lens,
	.zoom-handle,
	.zoom-symbol {
		fill: none;
		stroke: currentColor;
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.donut-svg,
	.dumbbell-svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.donut-hole {
		fill: #ffffff;
		stroke: #e2e8f0;
		stroke-width: 1;
	}

	.donut-centre-title {
		fill: #64748b;
		font-size: 10px;
		font-weight: 950;
		text-anchor: middle;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.donut-centre-value {
		fill: #0f172a;
		font-size: 15px;
		font-weight: 950;
		text-anchor: middle;
	}

	.annotation-line {
		fill: none;
		stroke-width: 0.75;
		stroke-linecap: round;
		stroke-linejoin: round;
		opacity: 0.8;
		vector-effect: non-scaling-stroke;
	}

	.donut-label {
		fill: #0f172a;
		font-size: 8.6px;
		font-weight: 950;
		paint-order: stroke;
		stroke: #ffffff;
		stroke-width: 2.6px;
		stroke-linejoin: round;
	}

	.donut-label-value {
		fill: #475569;
		font-size: 8.2px;
		font-weight: 900;
	}

	.grid-line {
		stroke: #cbd5e1;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.zero-grid-line {
		stroke: #0f172a;
		stroke-width: 1.4;
	}

	.axis-label {
		fill: #64748b;
		font-size: 10px;
		font-weight: 850;
	}

	.zoom-note {
		fill: #64748b;
		font-size: 10px;
		font-weight: 850;
	}

	.party-row-label {
		fill: #0f172a;
		font-size: 10px;
		font-weight: 950;
	}

	.row-guide {
		stroke: #e2e8f0;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.shift-arrow {
		stroke-width: 2.4;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}

	.vote-ring {
		fill: #ffffff;
		stroke-width: 1.9;
		vector-effect: non-scaling-stroke;
	}

	.seat-marker {
		stroke-width: 2.4;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}

	.clip-marker {
		fill: none;
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	@media (max-width: 1100px) {
		.transformation-layout {
			grid-template-columns: 1fr;
		}

		.donut-panel {
			max-width: 420px;
			justify-self: center;
			width: 100%;
		}

		.zoom-button {
			right: 12px;
		}
	}
</style>