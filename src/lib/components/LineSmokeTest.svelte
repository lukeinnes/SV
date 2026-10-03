<script lang="ts">
	let { k }: { k: number } = $props();

	const chartWidth = 420;
	const chartHeight = 220;
	const margin = {
		left: 42,
		right: 22,
		top: 18,
		bottom: 34
	};

	let kNumber = $derived(Number(k));
	let linePoints = $derived(buildLinePoints(kNumber));

	function lineFunction(x: number, kValue: number) {
		// Placeholder only.
		// Later, this can become your real M(x) or f(x) curve.
		return 1 - Math.exp(-kValue * x);
	}

	function buildLinePoints(kValue: number) {
		const plotWidth = chartWidth - margin.left - margin.right;
		const plotHeight = chartHeight - margin.top - margin.bottom;

		return Array.from({ length: 121 }, (_, i) => {
			const x = i / 120;
			const y = lineFunction(x, kValue);

			const px = margin.left + x * plotWidth;
			const py = margin.top + (1 - y) * plotHeight;

			return `${px},${py}`;
		}).join(' ');
	}
</script>

<article class="panel">
	<h2>1D placeholder curve</h2>
	<p>This stands in for a future curve such as <code>M(x)</code> or <code>f(x)</code>.</p>

	<svg
		viewBox={`0 0 ${chartWidth} ${chartHeight}`}
		role="img"
		aria-label="A placeholder curve that updates when k changes"
	>
		<line
			x1={margin.left}
			y1={chartHeight - margin.bottom}
			x2={chartWidth - margin.right}
			y2={chartHeight - margin.bottom}
			class="axis"
		/>
		<line
			x1={margin.left}
			y1={margin.top}
			x2={margin.left}
			y2={chartHeight - margin.bottom}
			class="axis"
		/>

		<text x={margin.left} y={chartHeight - 8} class="axis-label">x</text>
		<text x="8" y={margin.top + 4} class="axis-label">value</text>

		<polyline points={linePoints} class="curve" />
	</svg>
</article>

<style>
	.panel {
		border: 1px solid rgba(148, 163, 184, 0.35);
		border-radius: 20px;
		background: rgba(15, 23, 42, 0.72);
		padding: 20px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
	}

	h2 {
		margin: 0 0 10px;
		font-size: 1.15rem;
	}

	p {
		color: #cbd5e1;
		line-height: 1.5;
	}

	code {
		color: #facc15;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		margin-top: 12px;
		border-radius: 14px;
		background: #020617;
	}

	.axis {
		stroke: #64748b;
		stroke-width: 1.5;
	}

	.axis-label {
		fill: #94a3b8;
		font-size: 13px;
	}

	.curve {
		fill: none;
		stroke: #facc15;
		stroke-width: 4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>