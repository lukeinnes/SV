<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import '../app.css';
	import './layout.css';
	import siteIcon from '$lib/assets/sv-icon.png';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();

	const electionsHref = resolve('/elections');
	const calculatorHref = resolve('/calculator');
	const methodHref = resolve('/method');
	const aboutHref = resolve('/about');

	function isActive(pathname: string): boolean {
		return page.url.pathname === pathname || page.url.pathname.startsWith(`${pathname}/`);
	}
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon} />
	<link rel="apple-touch-icon" href={siteIcon} />
</svelte:head>

<a class="skip-link" href="#page-content">Skip to content</a>

<header class="site-header">
	<div class="site-header-inner">
		<a class="brand" href={electionsHref} aria-label="Strengthened Voting home">
			<span class="brand-mark" aria-hidden="true">
				<img src={siteIcon} alt="" />
			</span>

			<span class="brand-text">
				<strong>Strengthened Voting <span>(SV)</span></strong>
			</span>
		</a>

		<nav class="site-nav" aria-label="Main navigation">
			<a href={electionsHref} class:active={isActive('/elections')}>Elections</a>
			<a href={calculatorHref} class:active={isActive('/calculator')}>Calculator</a>
			<a href={methodHref} class:active={isActive('/method')}>Method</a>
			<a href={aboutHref} class:active={isActive('/about')}>About</a>
		</nav>
	</div>
</header>

<div id="page-content" class="site-content">
	{@render children()}
</div>

<footer class="site-footer">
	<div class="site-footer-inner">
		<p><strong>Strengthened Voting</strong></p>
		<p>Exploring vote share, mandate and representative power.</p>
	</div>
</footer>