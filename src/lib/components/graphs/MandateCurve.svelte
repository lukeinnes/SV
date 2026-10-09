<script lang="ts">
	import { mandateCurveConfig } from '$lib/graphs/graphConfig';
	import { calculateA } from '$lib/sv/parameters';

	type MandatePoint = {
		x: number;
		mandate: number;
		label: string;
		isAnchor: boolean;
	};

	type Props = {
		k: number;
	};

	let { k }: Props = $props();

	const width = mandateCurveConfig.svg.width;
	const height = mandateCurveConfig.svg.height;
	const paddingLeft = mandateCurveConfig.svg.paddingLeft;
	const paddingRight = mandateCurveConfig.svg.paddingRight;
	const paddingTop = mandateCurveConfig.svg.paddingTop;
	const paddingBottom = mandateCurveConfig.svg.paddingBottom;

	const plotWidth = width - paddingLeft - paddingRight;
	const plotHeight = height - paddingTop - paddingBottom;

	const maxVoteShare = mandateCurveConfig.axis.maxVoteShare;
	const maxMandate = mandateCurveConfig.axis.maxMandate;
	const pointStep = mandateCurveConfig.axis.pointStep;
	const pathSteps = mandateCurveConfig.performance.pathSteps;

	let a = $derived(calculateA(k));

	function mandate(x: number): number {
		return a * Math.expm1(k * x);
	}

	function toSvgX(x: number): number {
		return paddingLeft + (x / maxVoteShare) * plotWidth;
	}

	function toSvgY(value: number): number {
		return paddingTop + (1 - value / maxMandate) * plotHeight;
	}

	function percent(value: number): string {
		return `${Math.round(value * 100)}%`;
	}

	function makeCurvePath(): string {
		const commands: string[] = [];

		for (let i = 0; i <= pathSteps; i += 1) {
			const x = (i / pathSteps) * maxVoteShare;
			const y = mandate(x);

			commands.push(`${i === 0 ? 'M' : 'L'} ${toSvgX(x).toFixed(2)} ${toSvgY(y).toFixed(2)}`);
		}

		return commands.join(' ');
	}

	let curvePath = $derived(makeCurvePath());

	let points = $derived(
		Array.from({ length: Math.round(maxVoteShare / pointStep) + 1 }, (_, index): MandatePoint => {
			const x = index * pointStep;
			const earnedMandate = mandate(x);

			return {
				x,
				mandate: earnedMandate,
				label: Math.round(earnedMandate).toLocaleString(),
				isAnchor: Math.abs(x - 0.5) < 0.0000001
			};
		})
	);

	let xGridLines = $derived(
		Array.from({ length: 6 }, (_, index) => {
			const value = index / 10;

			return {
				value,
				x: toSvgX(value),
				label: percent(value)
			};
		})
	);

	let yGridLines = $derived(
		Array.from({ length: 6 }, (_, index) => {
			const value = index * 200;

			return {
				value,
				y: toSvgY(value),
				label: value.toLocaleString()
			};
		})
	);

	let graphStyle = $derived(
		[
			`--mandate-background: ${mandateCurveConfig.colours.background}`,
			`--mandate-grid: ${mandateCurveConfig.colours.grid}`,
			`--mandate-axis: ${mandateCurveConfig.colours.axis}`,
			`--mandate-label: ${mandateCurveConfig.colours.label}`,
			`--mandate-axis-title: ${mandateCurveConfig.colours.axisTitle}`,
			`--mandate-curve: ${mandateCurveConfig.colours.curve}`,
			`--mandate-point: ${mandateCurveConfig.colours.point}`,
			`--mandate-anchor: ${mandateCurveConfig.colours.anchor}`,
			`--mandate-curve-stroke: ${mandateCurveConfig.strokes.curve}`,
			`--mandate-point-stroke: ${mandateCurveConfig.strokes.point}`,
			`--mandate-anchor-stroke: ${mandateCurveConfig.strokes.anchor}`
		].join('; ')
	);
</script>

<div class="mandate-curve-card" style={graphStyle}>
	<svg
		class="mandate-curve"
		viewBox={`0 0 ${width} ${height}`}
		role="img"
		aria-label="Mandate equation graph showing vote share against mandate points"
	>
		<rect class="graph-background" x="0" y="0" width={width} height={height} />

		{#each xGridLines as line (line.value)}
			<line class="grid-line" x1={line.x} y1={paddingTop} x2={line.x} y2={height - paddingBottom} />
		{/each}

		{#each yGridLines as line (line.value)}
			<line class="grid-line" x1={paddingLeft} y1={line.y} x2={width - paddingRight} y2={line.y} />
		{/each}

		<path class="curve-line" d={curvePath} />

		{#each points as point (point.x)}
			<g>
				<line
					class:anchor-cross={point.isAnchor}
					class="point-cross"
					x1={toSvgX(point.x) - 5}
					y1={toSvgY(point.mandate) - 5}
					x2={toSvgX(point.x) + 5}
					y2={toSvgY(point.mandate) + 5}
				/>
				<line
					class:anchor-cross={point.isAnchor}
					class="point-cross"
					x1={toSvgX(point.x) - 5}
					y1={toSvgY(point.mandate) + 5}
					x2={toSvgX(point.x) + 5}
					y2={toSvgY(point.mandate) - 5}
				/>
				<text
					class:anchor-label={point.isAnchor}
					class="point-label"
					x={toSvgX(point.x)}
					y={toSvgY(point.mandate) - 12}
				>
					{point.label}
				</text>
			</g>
		{/each}

		<line class="axis" x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} />
		<line class="axis" x1={paddingLeft} y1={height - paddingBottom} x2={paddingLeft} y2={paddingTop} />

		{#each xGridLines as line (line.value)}
			<text class="x-label" x={line.x} y={height - 32}>{line.label}</text>
		{/each}

		{#each yGridLines as line (line.value)}
			<text class="y-label" x={paddingLeft - 12} y={line.y + 4}>{line.label}</text>
		{/each}

		<text class="axis-title x-title" x={paddingLeft + plotWidth / 2} y={height - 8}>Vote share</text>
		<text
			class="axis-title y-title"
			x={18}
			y={paddingTop + plotHeight / 2}
			transform={`rotate(-90 18 ${paddingTop + plotHeight / 2})`}
		>
			Mandate points
		</text>
	</svg>

	<div class="graph-caption">
		<strong>Mandate equation</strong>
		<span>
			Each cross shows the mandate earned at 5-point vote-share intervals. The 50% anchor is
			always fixed at 1,000 mandate points.
		</span>
	</div>
</div>

<style>
	.mandate-curve-card {
		border: 1px solid #cbd5e1;
		border-radius: 20px;
		background: white;
		padding: 18px;
	}

	.mandate-curve {
		display: block;
		width: 100%;
		height: auto;
	}

	.graph-background {
		fill: var(--mandate-background);
	}

	.grid-line {
		stroke: var(--mandate-grid);
		stroke-width: 1;
	}

	.axis {
		stroke: var(--mandate-axis);
		stroke-width: 2;
	}

	.curve-line {
		fill: none;
		stroke: var(--mandate-curve);
		stroke-width: var(--mandate-curve-stroke);
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.point-cross {
		stroke: var(--mandate-point);
		stroke-width: var(--mandate-point-stroke);
		stroke-linecap: round;
	}

	.anchor-cross {
		stroke: var(--mandate-anchor);
		stroke-width: var(--mandate-anchor-stroke);
	}

	.x-label,
	.y-label {
		fill: var(--mandate-label);
		font-size: 13px;
		font-weight: 700;
		text-anchor: middle;
	}

	.y-label {
		text-anchor: end;
	}

	.axis-title {
		fill: var(--mandate-axis-title);
		font-size: 15px;
		font-weight: 900;
		text-anchor: middle;
	}

	.point-label {
		fill: var(--mandate-point);
		font-size: 12px;
		font-weight: 900;
		text-anchor: middle;
	}

	.anchor-label {
		fill: var(--mandate-anchor);
		font-size: 13px;
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