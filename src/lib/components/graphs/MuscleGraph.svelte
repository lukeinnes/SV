<script lang="ts">
	import { muscleGraphConfig } from '$lib/graphs/graphConfig';
	import { calculateA } from '$lib/sv/parameters';

	type MuscleGraphPoint = {
		pointId: string;
		label: string;
		x: number;
		f: number;
		colour: string;
	};

	type CandidateLine = {
		totalMandate: number;
		ci: number;
	};

	type RenderedLine = CandidateLine & {
		path: string;
	};

	type Props = {
		k: number;
		highlightTotalMandate?: number;
		points?: MuscleGraphPoint[];
		lineGap?: number;
	};

	let {
		k,
		highlightTotalMandate = 2000,
		points = [],
		lineGap = muscleGraphConfig.spacing.defaultLineGap
	}: Props = $props();

	const width = muscleGraphConfig.svg.width;
	const height = muscleGraphConfig.svg.height;
	const padding = muscleGraphConfig.svg.padding;
	const plotSize = width - padding * 2;

	const EPSILON = 0.0000001;
	const PATH_STEPS = muscleGraphConfig.performance.pathSteps;
	const BOUND_STEPS = muscleGraphConfig.performance.boundSteps;
	const CANDIDATE_COUNT = muscleGraphConfig.performance.candidateCount;
	const SPACING_SAMPLE_STEPS = muscleGraphConfig.performance.spacingSampleSteps;
	const BOUNDARY_SEARCH_STEPS = muscleGraphConfig.performance.boundarySearchSteps;
	const SPACING_F_MARGIN = muscleGraphConfig.spacing.fMargin;
	const MIN_SPACING_SAMPLES = muscleGraphConfig.spacing.minSamples;

	let effectiveLineGap = $derived(Number(lineGap) > 0 ? Number(lineGap) : muscleGraphConfig.spacing.defaultLineGap);

	let a = $derived(calculateA(k));
	let baselineTotalMandate = $derived(a * k);

	function mandate(x: number): number {
		return a * Math.expm1(k * x);
	}

	function xForMandate(targetMandate: number): number {
		if (targetMandate <= 0) return 0;

		const x = Math.log1p(targetMandate / a) / k;
		return Math.max(0, Math.min(1, x));
	}

	function consolidationIndexForTotalMandate(totalMandate: number): number {
		return (100 * (totalMandate - baselineTotalMandate)) / (2000 - baselineTotalMandate);
	}

	function fMin(x: number): number {
		const own = mandate(x);
		const opposition = mandate(1 - x);
		return own / (own + opposition);
	}

	function fMax(x: number): number {
		const own = mandate(x);
		const fragmentedOpposition = a * k * (1 - x);
		return own / (own + fragmentedOpposition);
	}

	function electionLineF(x: number, totalMandate: number): number {
		return mandate(x) / totalMandate;
	}

	function minimumTotalMandateAtX(x: number): number {
		return mandate(x) + a * k * (1 - x);
	}

	function maximumTotalMandateAtX(x: number): number {
		return mandate(x) + mandate(1 - x);
	}

	function lineIsInsideMuscle(x: number, totalMandate: number): boolean {
		return (
			totalMandate >= minimumTotalMandateAtX(x) - EPSILON &&
			totalMandate <= maximumTotalMandateAtX(x) + EPSILON
		);
	}

	function lineVisibleAtX(x: number, totalMandate: number): boolean {
		const f = electionLineF(x, totalMandate);

		return (
			Number.isFinite(f) &&
			f >= -EPSILON &&
			f <= 1 + EPSILON &&
			lineIsInsideMuscle(x, totalMandate)
		);
	}

	function toSvgX(x: number): number {
		return padding + x * plotSize;
	}

	function toSvgY(f: number): number {
		return padding + (1 - f) * plotSize;
	}

	function makePath(fn: (x: number) => number, steps = BOUND_STEPS): string {
		const commands: string[] = [];

		for (let i = 0; i <= steps; i += 1) {
			const x = i / steps;
			const f = Math.max(0, Math.min(1, fn(x)));

			commands.push(`${i === 0 ? 'M' : 'L'} ${toSvgX(x).toFixed(2)} ${toSvgY(f).toFixed(2)}`);
		}

		return commands.join(' ');
	}

	function refineVisibilityBoundary(
		leftX: number,
		rightX: number,
		totalMandate: number,
		leftIsVisible: boolean
	): number {
		let left = leftX;
		let right = rightX;

		for (let i = 0; i < BOUNDARY_SEARCH_STEPS; i += 1) {
			const middle = (left + right) / 2;
			const middleIsVisible = lineVisibleAtX(middle, totalMandate);

			if (middleIsVisible === leftIsVisible) {
				left = middle;
			} else {
				right = middle;
			}
		}

		return leftIsVisible ? left : right;
	}

	function makeElectionLinePath(totalMandate: number, steps = PATH_STEPS): string {
		const commands: string[] = [];

		let previousX = 0;
		let previousIsVisible = lineVisibleAtX(previousX, totalMandate);
		let drawing = false;

		if (previousIsVisible) {
			commands.push(
				`M ${toSvgX(previousX).toFixed(2)} ${toSvgY(electionLineF(previousX, totalMandate)).toFixed(2)}`
			);
			drawing = true;
		}

		for (let i = 1; i <= steps; i += 1) {
			const x = i / steps;
			const isVisible = lineVisibleAtX(x, totalMandate);

			if (isVisible !== previousIsVisible) {
				const boundaryX = refineVisibilityBoundary(previousX, x, totalMandate, previousIsVisible);
				const boundaryF = Math.max(0, Math.min(1, electionLineF(boundaryX, totalMandate)));

				if (previousIsVisible) {
					commands.push(`L ${toSvgX(boundaryX).toFixed(2)} ${toSvgY(boundaryF).toFixed(2)}`);
					drawing = false;
				} else {
					commands.push(`M ${toSvgX(boundaryX).toFixed(2)} ${toSvgY(boundaryF).toFixed(2)}`);
					drawing = true;
				}
			}

			if (isVisible) {
				const f = Math.max(0, Math.min(1, electionLineF(x, totalMandate)));
				commands.push(`${drawing ? 'L' : 'M'} ${toSvgX(x).toFixed(2)} ${toSvgY(f).toFixed(2)}`);
				drawing = true;
			}

			previousX = x;
			previousIsVisible = isVisible;
		}

		return commands.join(' ');
	}

	function makeMuscleAreaPath(steps = BOUND_STEPS): string {
		const upperCommands: string[] = [];
		const lowerCommands: string[] = [];

		for (let i = 0; i <= steps; i += 1) {
			const x = i / steps;
			upperCommands.push(
				`${i === 0 ? 'M' : 'L'} ${toSvgX(x).toFixed(2)} ${toSvgY(fMax(x)).toFixed(2)}`
			);
		}

		for (let i = steps; i >= 0; i -= 1) {
			const x = i / steps;
			lowerCommands.push(`L ${toSvgX(x).toFixed(2)} ${toSvgY(fMin(x)).toFixed(2)}`);
		}

		return `${upperCommands.join(' ')} ${lowerCommands.join(' ')} Z`;
	}

	function median(values: number[]): number {
		if (values.length === 0) return Number.POSITIVE_INFINITY;

		const sorted = [...values].sort((left, right) => left - right);
		const middle = Math.floor(sorted.length / 2);

		if (sorted.length % 2 === 1) {
			return sorted[middle];
		}

		return (sorted[middle - 1] + sorted[middle]) / 2;
	}

	function lineDistancePixels(firstTotalMandate: number, secondTotalMandate: number): number {
		const trimmedDistances: number[] = [];
		const fallbackDistances: number[] = [];

		for (let i = 0; i <= SPACING_SAMPLE_STEPS; i += 1) {
			const f = i / SPACING_SAMPLE_STEPS;

			if (f <= EPSILON || f >= 1 - EPSILON) {
				continue;
			}

			const firstX = xForMandate(f * firstTotalMandate);
			const secondX = xForMandate(f * secondTotalMandate);

			if (!lineVisibleAtX(firstX, firstTotalMandate) || !lineVisibleAtX(secondX, secondTotalMandate)) {
				continue;
			}

			const distance = Math.abs(toSvgX(firstX) - toSvgX(secondX));
			fallbackDistances.push(distance);

			if (f > SPACING_F_MARGIN && f < 1 - SPACING_F_MARGIN) {
				trimmedDistances.push(distance);
			}
		}

		if (trimmedDistances.length >= MIN_SPACING_SAMPLES) {
			return median(trimmedDistances);
		}

		return median(fallbackDistances);
	}

	function makeLowerCandidates(): CandidateLine[] {
		const minimumTotalMandate = baselineTotalMandate;
		const minimumX50 = xForMandate(minimumTotalMandate / 2);
		const candidates: CandidateLine[] = [];

		for (let i = 1; i <= CANDIDATE_COUNT; i += 1) {
			const progress = i / CANDIDATE_COUNT;
			const x50 = 0.5 - (0.5 - minimumX50) * progress;
			const totalMandate = 2 * mandate(x50);

			if (
				Number.isFinite(totalMandate) &&
				totalMandate >= minimumTotalMandate - EPSILON &&
				totalMandate < 2000 - EPSILON
			) {
				candidates.push({
					totalMandate,
					ci: consolidationIndexForTotalMandate(totalMandate)
				});
			}
		}

		return candidates;
	}

	function makeUpperCandidates(): CandidateLine[] {
		const maximumTotalMandate = mandate(1);
		const maximumX50 = xForMandate(maximumTotalMandate / 2);
		const candidates: CandidateLine[] = [];

		for (let i = 1; i <= CANDIDATE_COUNT; i += 1) {
			const progress = i / CANDIDATE_COUNT;
			const x50 = 0.5 + (maximumX50 - 0.5) * progress;
			const totalMandate = 2 * mandate(x50);

			if (
				Number.isFinite(totalMandate) &&
				totalMandate > 2000 + EPSILON &&
				totalMandate <= maximumTotalMandate + EPSILON
			) {
				candidates.push({
					totalMandate,
					ci: consolidationIndexForTotalMandate(totalMandate)
				});
			}
		}

		return candidates;
	}

	function selectAdaptiveLines(candidates: CandidateLine[], startingTotalMandate: number): RenderedLine[] {
		const selected: RenderedLine[] = [];
		let previousTotalMandate = startingTotalMandate;

		for (const candidate of candidates) {
			const distance = lineDistancePixels(previousTotalMandate, candidate.totalMandate);

			if (distance < effectiveLineGap) {
				continue;
			}

			const path = makeElectionLinePath(candidate.totalMandate);

			if (!path) {
				continue;
			}

			selected.push({
				...candidate,
				path
			});

			previousTotalMandate = candidate.totalMandate;
		}

		return selected;
	}

	function percent(value: number): string {
		return `${Math.round(value * 100)}%`;
	}

	let lowerBoundPath = $derived(makePath(fMin));
	let upperBoundPath = $derived(makePath(fMax));
	let muscleAreaPath = $derived(makeMuscleAreaPath());

	let lowerRedLines = $derived(selectAdaptiveLines(makeLowerCandidates(), 2000));
	let centreRedLinePath = $derived(makeElectionLinePath(2000));
	let upperGreenLines = $derived(selectAdaptiveLines(makeUpperCandidates(), 2000));

	let highlightPath = $derived(makeElectionLinePath(highlightTotalMandate));

	let gridLines = $derived(
		Array.from({ length: 11 }, (_, index) => {
			const value = index / 10;

			return {
				value,
				x: toSvgX(value),
				y: toSvgY(value),
				label: percent(value)
			};
		})
	);

	let graphStyle = $derived(
		[
			`--muscle-background: ${muscleGraphConfig.colours.background}`,
			`--muscle-grid: ${muscleGraphConfig.colours.grid}`,
			`--muscle-area: ${muscleGraphConfig.colours.area}`,
			`--muscle-axis: ${muscleGraphConfig.colours.axis}`,
			`--muscle-label: ${muscleGraphConfig.colours.label}`,
			`--muscle-axis-title: ${muscleGraphConfig.colours.axisTitle}`,
			`--muscle-red-line: ${muscleGraphConfig.colours.redLine}`,
			`--muscle-green-line: ${muscleGraphConfig.colours.greenLine}`,
			`--muscle-bound: ${muscleGraphConfig.colours.bound}`,
			`--muscle-highlight: ${muscleGraphConfig.colours.highlight}`,
			`--muscle-area-opacity: ${muscleGraphConfig.opacity.area}`,
			`--muscle-ci-opacity: ${muscleGraphConfig.opacity.ciLine}`,
			`--muscle-centre-opacity: ${muscleGraphConfig.opacity.centreLine}`,
			`--muscle-ci-stroke: ${muscleGraphConfig.strokes.ciLine}`,
			`--muscle-centre-stroke: ${muscleGraphConfig.strokes.centreLine}`,
			`--muscle-bound-stroke: ${muscleGraphConfig.strokes.bound}`,
			`--muscle-highlight-stroke: ${muscleGraphConfig.strokes.highlight}`
		].join('; ')
	);
</script>

<div class="muscle-graph-card" style={graphStyle}>
	<svg
		class="muscle-graph"
		viewBox={`0 0 ${width} ${height}`}
		role="img"
		aria-label="Bounds of power graph showing vote share against fraction of power"
	>
		<rect class="graph-background" x="0" y="0" width={width} height={height} />

		{#each gridLines as line (line.value)}
			<line class="grid-line" x1={line.x} y1={padding} x2={line.x} y2={height - padding} />
			<line class="grid-line" x1={padding} y1={line.y} x2={width - padding} y2={line.y} />
		{/each}

		<path class="muscle-area" d={muscleAreaPath} />

		{#each lowerRedLines as line (`red-${line.ci.toFixed(4)}`)}
			<path class="ci-line ci-line-red" d={line.path}>
				<title>CI {line.ci.toFixed(1)}</title>
			</path>
		{/each}

		{#if centreRedLinePath}
			<path class="ci-line ci-line-centre" d={centreRedLinePath}>
				<title>CI 100</title>
			</path>
		{/if}

		{#each upperGreenLines as line (`green-${line.ci.toFixed(4)}`)}
			<path class="ci-line ci-line-green" d={line.path}>
				<title>CI {line.ci.toFixed(1)}</title>
			</path>
		{/each}

		<path class="bound-line" d={lowerBoundPath} />
		<path class="bound-line" d={upperBoundPath} />

		{#if highlightPath}
			<path class="highlight-line" d={highlightPath} />
		{/if}

		{#each points as point (point.pointId)}
			<circle
				class="party-dot"
				cx={toSvgX(point.x)}
				cy={toSvgY(point.f)}
				r="6"
				style={`--party-colour: ${point.colour};`}
			>
				<title>{point.label}: {percent(point.x)} vote share, {percent(point.f)} power</title>
			</circle>
		{/each}

		<line class="axis" x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />
		<line class="axis" x1={padding} y1={height - padding} x2={padding} y2={padding} />

		{#each gridLines as line (line.value)}
			<text class="x-label" x={line.x} y={height - 22}>{line.label}</text>
			<text class="y-label" x={padding - 12} y={line.y + 4}>{line.label}</text>
		{/each}

		<text class="axis-title x-title" x={width / 2} y={height - 5}>Vote share</text>
		<text class="axis-title y-title" x={18} y={height / 2} transform={`rotate(-90 18 ${height / 2})`}>
			Fraction of power
		</text>
	</svg>

	<div class="graph-caption">
		<strong>Bounds of power</strong>
		<span>
			Blue curves show the lower and upper bounds. Red lines show consolidation up to CI 100.
			Green lines show selected CI values above 100. Line spacing is selected by horizontal
			distance at shared power levels.
		</span>
	</div>
</div>

<style>
	.muscle-graph-card {
		border: 1px solid #cbd5e1;
		border-radius: 20px;
		background: white;
		padding: 18px;
	}

	.muscle-graph {
		display: block;
		width: 100%;
		height: auto;
	}

	.graph-background {
		fill: var(--muscle-background);
	}

	.grid-line {
		stroke: var(--muscle-grid);
		stroke-width: 1;
	}

	.muscle-area {
		fill: var(--muscle-area);
		opacity: var(--muscle-area-opacity);
	}

	.axis {
		stroke: var(--muscle-axis);
		stroke-width: 2;
	}

	.x-label,
	.y-label {
		fill: var(--muscle-label);
		font-size: 13px;
		font-weight: 700;
		text-anchor: middle;
	}

	.y-label {
		text-anchor: end;
	}

	.axis-title {
		fill: var(--muscle-axis-title);
		font-size: 15px;
		font-weight: 900;
		text-anchor: middle;
	}

	.ci-line {
		fill: none;
		stroke-width: var(--muscle-ci-stroke);
		opacity: var(--muscle-ci-opacity);
	}

	.ci-line-red {
		stroke: var(--muscle-red-line);
	}

	.ci-line-centre {
		stroke: var(--muscle-red-line);
		stroke-width: var(--muscle-centre-stroke);
		opacity: var(--muscle-centre-opacity);
	}

	.ci-line-green {
		stroke: var(--muscle-green-line);
	}

	.bound-line {
		fill: none;
		stroke: var(--muscle-bound);
		stroke-width: var(--muscle-bound-stroke);
	}

	.highlight-line {
		fill: none;
		stroke: var(--muscle-highlight);
		stroke-width: var(--muscle-highlight-stroke);
	}

	.party-dot {
		fill: var(--party-colour);
		stroke: white;
		stroke-width: 2;
	}

	.graph-caption {
		display: grid;
		gap: 4px;
		margin-top: 12px;
		color: #334155;
	}

	.graph-caption strong {
		color: #0f172a;
		font-size: 1rem;
	}

	.graph-caption span {
		font-size: 0.92rem;
		line-height: 1.4;
	}
</style>