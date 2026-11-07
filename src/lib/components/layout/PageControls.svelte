
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		ariaLabel?: string;
		children: Snippet;
	};

	let {
		ariaLabel = 'Page controls',
		children
	}: Props = $props();
</script>

<section class="page-controls" aria-label={ariaLabel}>
	<div class="page-controls-inner">
		{@render children()}
	</div>
</section>

<style>
	.page-controls {
		position: sticky;
		top: var(--site-header-height, 71px);
		z-index: 45;
		background: transparent;
		pointer-events: none;
	}

	.page-controls-inner {
		box-sizing: border-box;
		width: var(--page-width);
		margin: 0 auto;

		border-right: 1px solid #cbd5e1;
		border-bottom: 1px solid #cbd5e1;
		border-left: 1px solid #cbd5e1;
		border-radius: 0 0 22px 22px;

		background: #ffffff;

		/* More space available to the control columns */
		padding: 14px 10px 15px 18px;

		box-shadow: 0 18px 34px rgba(15, 23, 42, 0.1);
		pointer-events: auto;
	}

	@media (max-width: 760px) {
		.page-controls {
			position: static;
		}

		.page-controls-inner {
			width: 100%;
			border-right: 0;
			border-left: 0;
			border-radius: 0;
			padding: 12px 14px;
		}
	}
</style>
