<script lang="ts">
	import { LAMBDA } from '$lib/sv/constants';

	let {
		k = $bindable(LAMBDA),
		resolution = $bindable(180),
		renderMs = 0
	}: {
		k?: number;
		resolution?: number;
		renderMs?: number;
	} = $props();

	let kNumber = $derived(Number(k));
	let resolutionNumber = $derived(Number(resolution));

	function resetToLambda() {
		k = LAMBDA;
	}
</script>

<section class="controls">
	<div class="control-row">
		<label for="k-slider">
			<span>Mandate parameter k</span>
			<strong>{kNumber.toFixed(3)}</strong>
		</label>

		<input id="k-slider" type="range" min="0.1" max="10" step="0.1" bind:value={k} />

		<div class="helper">
			<span>Lower k</span>
			<span class="lambda">Λ = {LAMBDA.toFixed(3)}</span>
			<span>Higher k</span>
		</div>
	</div>

	<div class="control-row">
		<label for="resolution-slider">
			<span>2D plot resolution</span>
			<strong>{resolutionNumber} × {resolutionNumber}</strong>
		</label>

		<input
			id="resolution-slider"
			type="range"
			min="80"
			max="320"
			step="10"
			bind:value={resolution}
		/>

		<div class="helper">
			<span>Faster</span>
			<span>Render time: {renderMs} ms</span>
			<span>Sharper</span>
		</div>
	</div>

	<button type="button" onclick={resetToLambda}>Reset k to Λ</button>
</section>

<style>
	.controls {
		display: grid;
		gap: 18px;
		margin-bottom: 20px;
		border: 1px solid rgba(148, 163, 184, 0.35);
		border-radius: 20px;
		background: rgba(15, 23, 42, 0.72);
		padding: 20px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
	}

	.control-row {
		display: grid;
		gap: 8px;
	}

	label {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		align-items: baseline;
	}

	label span {
		color: #cbd5e1;
	}

	label strong {
		font-variant-numeric: tabular-nums;
	}

	input[type="range"] {
		width: 100%;
	}

	.helper {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		color: #94a3b8;
		font-size: 0.9rem;
	}

	.lambda {
		color: #facc15;
	}

	button {
		justify-self: start;
		border: 0;
		border-radius: 999px;
		background: #facc15;
		color: #1e293b;
		font-weight: 800;
		padding: 10px 16px;
		cursor: pointer;
	}

	button:hover {
		background: #fde047;
	}

	@media (max-width: 800px) {
		label,
		.helper {
			flex-direction: column;
		}
	}
</style>