<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import '../app.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const homeHref = resolve('/');
	const electionsHref = resolve('/elections');
	const calculatorHref = resolve('/calculator');
	const dataCheckHref = resolve('/data-check');
	const engineTestHref = resolve('/engine-test');
	const realEngineTestHref = resolve('/real-engine-test');

	function isActive(pathname: string): boolean {
		if (pathname === '/') {
			return page.url.pathname === '/';
		}

		return page.url.pathname === pathname || page.url.pathname.startsWith(`${pathname}/`);
	}

	function activeClass(pathname: string): string {
		return isActive(pathname) ? 'active' : '';
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a class="skip-link" href="#page-content">Skip to content</a>

<header class="dev-site-header">
	<div class="dev-site-header-inner">
		<a class="brand" href={homeHref} aria-label="Strengthened Voting home">
			<span class="brand-mark">SV</span>
			<span>
				<strong>Strengthened Voting</strong>
				<small>Development header</small>
			</span>
		</a>

		<nav class="site-nav" aria-label="Main navigation">
			<a href={homeHref} class={activeClass('/')}>Home</a>
			<a href={electionsHref} class={activeClass('/elections')}>Elections</a>
			<a href={calculatorHref} class={activeClass('/calculator')}>Calculator</a>
		</nav>

		<nav class="dev-nav" aria-label="Developer navigation">
			<span>Dev</span>
			<a href={dataCheckHref} class={activeClass('/data-check')}>Data check</a>
			<a href={engineTestHref} class={activeClass('/engine-test')}>Engine test</a>
			<a href={realEngineTestHref} class={activeClass('/real-engine-test')}>Real engine test</a>
		</nav>
	</div>
</header>

<div id="page-content" class="page-shell">
	{@render children()}
</div>