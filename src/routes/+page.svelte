<script lang="ts">
	import KSlider from '$lib/components/KSlider.svelte';
	import LineSmokeTest from '$lib/components/LineSmokeTest.svelte';
	import HeatmapSmokeTest from '$lib/components/HeatmapSmokeTest.svelte';
	import { LAMBDA } from '$lib/sv/constants';

	let k = $state(LAMBDA);
	let resolution = $state(180);
	let renderMs = $state(0);

	function handleRender(milliseconds: number) {
		renderMs = milliseconds;
	}
</script>

<svelte:head>
	<title>Strengthened Voting — Phase 1 Smoke Test</title>
	<meta
		name="description"
		content="A local smoke test for live Strengthened Voting visualisations."
	/>
</svelte:head>

<main>
	<section class="hero">
		<p class="eyebrow">Strengthened Voting website</p>
		<h1>Phase 1: interactive visual smoke test</h1>
		<p class="intro">
			This page is deliberately rough. Its job is to prove that a slider can live-update both
			a normal curve and a two-dimensional shaded plot.
		</p>
	</section>

	<KSlider bind:k={k} bind:resolution={resolution} {renderMs} />

	<section class="grid">
		<LineSmokeTest {k} />
		<HeatmapSmokeTest {k} {resolution} onRender={handleRender} />
	</section>

	<section class="status">
		<h2>Phase 1 success criteria</h2>
		<ul>
			<li>Dragging <code>k</code> changes the line graph.</li>
			<li>Dragging <code>k</code> changes the shaded 2D plot.</li>
			<li>The render time stays low enough that the interaction feels immediate.</li>
			<li>No real SV maths is required yet; this is only a visual feasibility test.</li>
		</ul>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family:
			Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		background: #0f172a;
		color: #e5e7eb;
	}

	main {
		max-width: 1120px;
		margin: 0 auto;
		padding: 32px 20px 56px;
	}

	.hero {
		margin-bottom: 28px;
	}

	.eyebrow {
		margin: 0 0 8px;
		color: #93c5fd;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.78rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 5vw, 4rem);
		line-height: 1;
	}

	h2 {
		margin: 0 0 10px;
		font-size: 1.15rem;
	}

	.intro {
		max-width: 760px;
		color: #cbd5e1;
		font-size: 1.1rem;
		line-height: 1.6;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px;
		margin-bottom: 20px;
	}

	.status {
		border: 1px solid rgba(148, 163, 184, 0.35);
		border-radius: 20px;
		background: rgba(15, 23, 42, 0.72);
		padding: 20px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
	}

	.status ul {
		margin-bottom: 0;
		color: #cbd5e1;
		line-height: 1.7;
	}

	code {
		color: #facc15;
	}

	@media (max-width: 800px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>