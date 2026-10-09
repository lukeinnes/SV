<script lang="ts">
	import { consolidationMultiplierConfig } from '$lib/graphs/graphConfig';

	type BarPoint = {
		x: number;
		value: number;
		label: string;
		voteLabel: string;
		isAnchor: boolean;
	};

	type GridLine = {
		value: number;
		y: number;
		label: string;
	};

	type Props = {
		k: number;
	};

	let { k }: Props = $props();

	const width = consolidationMultiplierConfig.svg.width;
	const height = consolidationMultiplierConfig.svg.height;
	const paddingLeft = consolidationMultiplierConfig.svg.paddingLeft;
	const paddingRight = consolidationMultiplierConfig.svg.paddingRight;
	const paddingTop = consolidationMultiplierConfig.svg.paddingTop;
	const paddingBottom = consolidationMultiplierConfig.svg.paddingBottom;

	const plotWidth = width - paddingLeft - paddingRight;
	const plotHeight = height - paddingTop - paddingBottom;

	const maxVoteShare = consolidationMultiplierConfig.axis.maxVoteShare;
	const pointStep = consolidationMultiplierConfig.axis.pointStep;
	const minYAxisMax = consolidationMultiplierConfig.axis.minYAxisMax;
	const yAxisHeadroom = consolidationMultiplierConfig.axis.yAxisHeadroom;

	function multiplier(x: number): number {
		if (x === 0) return 1;
		return Math.expm1(k * x) / (k * x);
	}

    function gridStepForMaximum(maxBarValue: number): number {
        if (maxBarValue <= 4) return 0.5;
        if (maxBarValue <= 8) return 1;
        if (maxBarValue <= 16) return 2;
        if (maxBarValue <= 32) return 4;
        if (maxBarValue <= 64) return 8;
        return 16;
    }

	function formatAxisMultiplier(value: number): string {
		if (Number.isInteger(value)) {
			return `${value.toFixed(0)}×`;
		}

		return `${value.toFixed(1)}×`;
	}

	let bars = $derived(
		Array.from({ length: Math.round(maxVoteShare / pointStep) + 1 }, (_, index): BarPoint => {
			const x = index * pointStep;
			const value = multiplier(x);

			return {
				x,
				value,
				label: `${value.toFixed(2)}×`,
				voteLabel: `${Math.round(x * 100)}%`,
				isAnchor: x === 0
			};
		})
	);

	let highestBarValue = $derived(Math.max(...bars.map((bar) => bar.value)));
	let yAxisMax = $derived(Math.max(minYAxisMax, highestBarValue * yAxisHeadroom));
	let gridStep = $derived(gridStepForMaximum(highestBarValue));

	function toSvgX(index: number, count: number): number {
		const cellWidth = plotWidth / count;
		return paddingLeft + cellWidth * index + cellWidth / 2;
	}

	function toSvgY(value: number): number {
		return paddingTop + (1 - value / yAxisMax) * plotHeight;
	}

	let yGridLines = $derived(
		Array.from({ length: Math.floor(yAxisMax / gridStep) }, (_, index): GridLine => {
			const value = (index + 1) * gridStep;

			return {
				value,
				y: toSvgY(value),
				label: formatAxisMultiplier(value)
			};
		})
	);

	let graphStyle = $derived(
		[
			`--cm-background: ${consolidationMultiplierConfig.colours.background}`,
			`--cm-grid: ${consolidationMultiplierConfig.colours.grid}`,
			`--cm-axis: ${consolidationMultiplierConfig.colours.axis}`,
			`--cm-label: ${consolidationMultiplierConfig.colours.label}`,
			`--cm-axis-title: ${consolidationMultiplierConfig.colours.axisTitle}`,
			`--cm-bar: ${consolidationMultiplierConfig.colours.bar}`,
			`--cm-anchor: ${consolidationMultiplierConfig.colours.anchor}`
		].join('; ')
	);
</script>

<div class="consolidation-multiplier-card" style={graphStyle}>
	<svg
		class="consolidation-multiplier"
		viewBox={`0 0 ${width} ${height}`}
		role="img"
		aria-label="Bar chart showing consolidation multiplier by vote share"
	>
		<rect class="graph-background" x="0" y="0" width={width} height={height} />

		{#each yGridLines as line (line.value)}
			<line class="grid-line" x1={paddingLeft} y1={line.y} x2={width - paddingRight} y2={line.y} />
		{/each}

		{#each bars as bar, index (bar.x)}
			{@const count = bars.length}
			{@const cellWidth = plotWidth / count}
			{@const barWidth = cellWidth * 0.68}
			{@const barX = toSvgX(index, count) - barWidth / 2}
			{@const barY = toSvgY(bar.value)}
			{@const barHeight = height - paddingBottom - barY}

			<rect
				class="bar"
				class:anchor-bar={bar.isAnchor}
				x={barX}
				y={barY}
				width={barWidth}
				height={barHeight}
				rx="6"
			>
				<title>{bar.voteLabel}: {bar.label}</title>
			</rect>

			<text
				class="bar-value"
				class:anchor-label={bar.isAnchor}
				x={toSvgX(index, count)}
				y={barY - 8}
			>
				{bar.label}
			</text>

			<text class="x-label" x={toSvgX(index, count)} y={height - 32}>
				{bar.voteLabel}
			</text>
		{/each}

		<line
			class="axis"
			x1={paddingLeft}
			y1={height - paddingBottom}
			x2={width - paddingRight}
			y2={height - paddingBottom}
		/>
		<line
			class="axis"
			x1={paddingLeft}
			y1={height - paddingBottom}
			x2={paddingLeft}
			y2={paddingTop}
		/>

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
			Consolidation multiplier
		</text>
	</svg>

	<div class="graph-caption">
		<strong>Consolidation multiplier</strong>
		<span>
			Each bar shows how much more mandate a party receives than if the same vote share were
			split into tiny fragments. Gridlines use fixed multiplier intervals and move as the scale
			changes.
		</span>
	</div>
</div>

<style>
	.consolidation-multiplier-card {
		border: 1px solid #cbd5e1;
		border-radius: 20px;
		background: white;
		padding: 18px;
	}

	.consolidation-multiplier {
		display: block;
		width: 100%;
		height: auto;
	}

	.graph-background {
		fill: var(--cm-background);
	}

	.grid-line {
		stroke: var(--cm-grid);
		stroke-width: 1;
	}

	.axis {
		stroke: var(--cm-axis);
		stroke-width: 2;
	}

	.bar {
		fill: var(--cm-bar);
		opacity: 0.82;
	}

	.anchor-bar {
		fill: var(--cm-anchor);
		opacity: 0.9;
	}

	.x-label,
	.y-label {
		fill: var(--cm-label);
		font-size: 13px;
		font-weight: 700;
		text-anchor: middle;
	}

	.y-label {
		text-anchor: end;
	}

	.axis-title {
		fill: var(--cm-axis-title);
		font-size: 15px;
		font-weight: 900;
		text-anchor: middle;
	}

	.bar-value {
		fill: #0f172a;
		font-size: 12px;
		font-weight: 900;
		text-anchor: middle;
	}

	.anchor-label {
		fill: var(--cm-anchor);
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