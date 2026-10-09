<script lang="ts">
	import { mandatePerVoteConfig } from '$lib/graphs/graphConfig';
	import { calculateA } from '$lib/sv/parameters';

	type BarPoint = {
		x: number;
		value: number;
		label: string;
		voteLabel: string;
		isAnchor: boolean;
	};

	type Props = {
		k: number;
	};

	let { k }: Props = $props();

	const width = mandatePerVoteConfig.svg.width;
	const height = mandatePerVoteConfig.svg.height;
	const paddingLeft = mandatePerVoteConfig.svg.paddingLeft;
	const paddingRight = mandatePerVoteConfig.svg.paddingRight;
	const paddingTop = mandatePerVoteConfig.svg.paddingTop;
	const paddingBottom = mandatePerVoteConfig.svg.paddingBottom;

	const plotWidth = width - paddingLeft - paddingRight;
	const plotHeight = height - paddingTop - paddingBottom;

	const maxVoteShare = mandatePerVoteConfig.axis.maxVoteShare;
	const maxMandatePerPercent = mandatePerVoteConfig.axis.maxMandatePerPercent;
	const pointStep = mandatePerVoteConfig.axis.pointStep;

	let a = $derived(calculateA(k));

	function mandate(x: number): number {
		return a * Math.expm1(k * x);
	}

	function mandatePerPercent(x: number): number {
		return mandate(x) / (x * 100);
	}

	function toSvgX(index: number, count: number): number {
		const cellWidth = plotWidth / count;
		return paddingLeft + cellWidth * index + cellWidth / 2;
	}

	function toSvgY(value: number): number {
		return paddingTop + (1 - value / maxMandatePerPercent) * plotHeight;
	}

	function percent(value: number): string {
		return `${Math.round(value * 100)}%`;
	}

	let bars = $derived(
		Array.from({ length: Math.round(maxVoteShare / pointStep) }, (_, index): BarPoint => {
			const x = (index + 1) * pointStep;
			const value = mandatePerPercent(x);

			return {
				x,
				value,
				label: value.toFixed(1),
				voteLabel: percent(x),
				isAnchor: Math.abs(x - 0.5) < 0.0000001
			};
		})
	);

	let yGridLines = $derived(
		Array.from({ length: 5 }, (_, index) => {
			const value = index * 5;

			return {
				value,
				y: toSvgY(value),
				label: value.toLocaleString()
			};
		})
	);

	let graphStyle = $derived(
		[
			`--mpv-background: ${mandatePerVoteConfig.colours.background}`,
			`--mpv-grid: ${mandatePerVoteConfig.colours.grid}`,
			`--mpv-axis: ${mandatePerVoteConfig.colours.axis}`,
			`--mpv-label: ${mandatePerVoteConfig.colours.label}`,
			`--mpv-axis-title: ${mandatePerVoteConfig.colours.axisTitle}`,
			`--mpv-bar: ${mandatePerVoteConfig.colours.bar}`,
			`--mpv-anchor: ${mandatePerVoteConfig.colours.anchor}`
		].join('; ')
	);
</script>

<div class="mandate-per-vote-card" style={graphStyle}>
	<svg
		class="mandate-per-vote"
		viewBox={`0 0 ${width} ${height}`}
		role="img"
		aria-label="Bar chart showing mandate points earned per percentage point of vote share"
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
				<title>{bar.voteLabel}: {bar.label} mandate points per 1% vote</title>
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

		<line class="axis" x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} />
		<line class="axis" x1={paddingLeft} y1={height - paddingBottom} x2={paddingLeft} y2={paddingTop} />

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
			Mandate per 1% vote
		</text>
	</svg>

	<div class="graph-caption">
		<strong>Mandate per vote share</strong>
		<span>
			Each bar shows how many mandate points are earned per percentage point of vote share.
			At 50%, this is always 20 because 50% is fixed at 1,000 mandate points.
		</span>
	</div>
</div>

<style>
	.mandate-per-vote-card {
		border: 1px solid #cbd5e1;
		border-radius: 20px;
		background: white;
		padding: 18px;
	}

	.mandate-per-vote {
		display: block;
		width: 100%;
		height: auto;
	}

	.graph-background {
		fill: var(--mpv-background);
	}

	.grid-line {
		stroke: var(--mpv-grid);
		stroke-width: 1;
	}

	.axis {
		stroke: var(--mpv-axis);
		stroke-width: 2;
	}

	.bar {
		fill: var(--mpv-bar);
		opacity: 0.82;
	}

	.anchor-bar {
		fill: var(--mpv-anchor);
		opacity: 0.9;
	}

	.x-label,
	.y-label {
		fill: var(--mpv-label);
		font-size: 13px;
		font-weight: 700;
		text-anchor: middle;
	}

	.y-label {
		text-anchor: end;
	}

	.axis-title {
		fill: var(--mpv-axis-title);
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
		fill: var(--mpv-anchor);
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