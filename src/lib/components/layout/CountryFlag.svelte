
<script lang="ts">
	import { base } from '$app/paths';

	type Props = {
		countryId: string;
		width?: number;
	};

	let {
		countryId,
		width = 30
	}: Props = $props();

	let flagUrl = $derived(
		`${base}/flags/${countryId.toLowerCase()}.svg`
	);
</script>

<span
	class="country-flag"
	style={`width: ${width}px`}
	aria-hidden="true"
>
	<span class="fallback">
		{countryId.toUpperCase()}
	</span>

	{#key countryId}
		<img
			src={flagUrl}
			alt=""
			onerror={(event) => event.currentTarget.remove()}
		/>
	{/key}
</span>

<style>
	.country-flag {
		position: relative;
		display: inline-flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		aspect-ratio: 4 / 3;
		overflow: hidden;

		border: 1px solid rgba(15, 23, 42, 0.14);
		border-radius: 2px;
		background: #f1f5f9;
		vertical-align: middle;
	}

	.country-flag img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		background: white;
	}

	.fallback {
		color: #64748b;
		font-size: 0.65em;
		font-weight: 850;
		letter-spacing: -0.02em;
	}
</style>
