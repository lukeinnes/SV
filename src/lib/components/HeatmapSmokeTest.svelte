<script lang="ts">
	let {
		k,
		resolution,
		onRender = () => {}
	}: {
		k: number;
		resolution: number;
		onRender?: (milliseconds: number) => void;
	} = $props();

	let canvas = $state<HTMLCanvasElement | undefined>();
	let renderMs = $state(0);

	let kNumber = $derived(Number(k));
	let resolutionNumber = $derived(Number(resolution));

	$effect(() => {
		if (canvas) {
			drawHeatmap(kNumber, resolutionNumber);
		}
	});

	function clamp(value: number, min: number, max: number) {
		return Math.max(min, Math.min(max, value));
	}

	function fieldFunction(x: number, y: number, kValue: number) {
		// Placeholder only.
		// This creates a 2D field that visibly changes as k changes.
		const wave =
			0.5 +
			0.5 *
				Math.sin(kValue * Math.PI * x) *
				Math.cos((kValue + 0.8) * Math.PI * y);

		const centrePull = Math.exp(-5 * ((x - 0.65) ** 2 + (y - 0.45) ** 2));

		const diagonal = 0.5 + 0.5 * Math.sin(kValue * Math.PI * (x - y));

		return clamp(0.55 * wave + 0.3 * centrePull + 0.15 * diagonal, 0, 1);
	}

	function valueToRgb(value: number) {
		const v = clamp(value, 0, 1);

		// Low: blue. Middle: turquoise. High: amber.
		if (v < 0.5) {
			const t = v * 2;
			return [
				Math.round(30 + 80 * t),
				Math.round(64 + 160 * t),
				Math.round(175 + 30 * t)
			];
		}

		const t = (v - 0.5) * 2;
		return [
			Math.round(110 + 145 * t),
			Math.round(224 - 70 * t),
			Math.round(205 - 160 * t)
		];
	}

	function drawHeatmap(kValue: number, size: number) {
		if (!canvas) return;

		const start = performance.now();
		const ctx = canvas.getContext('2d');

		if (!ctx) return;

		canvas.width = size;
		canvas.height = size;

		const image = ctx.createImageData(size, size);
		const data = image.data;

		for (let py = 0; py < size; py += 1) {
			for (let px = 0; px < size; px += 1) {
				const x = px / (size - 1);
				const y = 1 - py / (size - 1);

				const value = fieldFunction(x, y, kValue);
				const [r, g, b] = valueToRgb(value);

				const index = (py * size + px) * 4;

				data[index] = r;
				data[index + 1] = g;
				data[index + 2] = b;
				data[index + 3] = 255;
			}
		}

		ctx.putImageData(image, 0, 0);

		const milliseconds = Math.round((performance.now() - start) * 10) / 10;
		renderMs = milliseconds;
		onRender(milliseconds);
	}
</script>

<article class="panel">
	<h2>2D shaded placeholder plot</h2>
	<p>This stands in for a future area plot where colour represents a calculated value.</p>

	<canvas
		bind:this={canvas}
		aria-label="A two-dimensional shaded plot that updates when k changes"
	></canvas>

	<div class="legend">
		<span>Low value</span>
		<div class="legend-bar"></div>
		<span>High value</span>
	</div>

	<p class="render-note">Local render time: {renderMs} ms</p>
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

	canvas {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		margin-top: 12px;
		border-radius: 14px;
		background: #020617;
	}

	.legend {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 10px;
		margin-top: 12px;
		color: #cbd5e1;
		font-size: 0.9rem;
	}

	.legend-bar {
		height: 12px;
		border-radius: 999px;
		background: linear-gradient(90deg, rgb(30, 64, 175), rgb(110, 224, 205), rgb(255, 154, 45));
	}

	.render-note {
		margin-bottom: 0;
		color: #94a3b8;
		font-size: 0.9rem;
	}
</style>