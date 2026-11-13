
<script lang="ts">
	import { tick } from 'svelte';
	import { countryDatasets } from '$lib/data/registry';
	import CountryFlag from './CountryFlag.svelte';

	type CountryOption = {
		id: string;
		name: string;
	};

	type Props = {
		id: string;
		value?: string;
		allowNone?: boolean;
		onchange?: () => void;
	};

	let {
		id,
		value = $bindable(''),
		allowNone = false,
		onchange
	}: Props = $props();

	// Automatically use every registered country.
	// No list of flag filenames is needed.
	const registeredCountries: CountryOption[] =
		countryDatasets.map((dataset) => ({
			id: dataset.country.id,
			name: dataset.country.name
		}));

	let options = $derived(
		allowNone
			? [{ id: '', name: 'None' }, ...registeredCountries]
			: registeredCountries
	);

	let selectedOption = $derived(
		options.find((option) => option.id === value)
	);

	let isOpen = $state(false);
	let highlightedIndex = $state(0);

	let root: HTMLDivElement;
	let trigger: HTMLButtonElement;
	let menu: HTMLDivElement;

	const menuId = `${id}-options`;

	function currentIndex(): number {
		return options.findIndex(
			(option) => option.id === value
		);
	}

	async function focusHighlighted(): Promise<void> {
		await tick();

		if (!isOpen || !menu) return;

		const buttons = menu.querySelectorAll<HTMLButtonElement>(
			'[data-country-option]'
		);

		buttons[highlightedIndex]?.focus();
	}

	async function openMenu(
		startIndex?: number
	): Promise<void> {
		if (options.length === 0) return;

		highlightedIndex = Math.max(
			0,
			Math.min(
				options.length - 1,
				startIndex ?? Math.max(0, currentIndex())
			)
		);

		isOpen = true;
		await focusHighlighted();
	}

	function closeMenu(
		restoreFocus = true
	): void {
		isOpen = false;

		if (restoreFocus) {
			trigger?.focus();
		}
	}

	function selectCountry(countryId: string): void {
		const hasChanged = countryId !== value;

		value = countryId;
		closeMenu();

		if (hasChanged) {
			onchange?.();
		}
	}

	function handleTriggerKeydown(
		event: KeyboardEvent
	): void {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				void openMenu();
				break;

			case 'ArrowUp':
				event.preventDefault();
				void openMenu(
					currentIndex() >= 0
						? currentIndex()
						: options.length - 1
				);
				break;

			case 'Home':
				event.preventDefault();
				void openMenu(0);
				break;

			case 'End':
				event.preventDefault();
				void openMenu(options.length - 1);
				break;

			case 'Escape':
				if (isOpen) {
					event.preventDefault();
					closeMenu();
				}
				break;
		}
	}

	function handleOptionKeydown(
		event: KeyboardEvent,
		index: number,
		countryId: string
	): void {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();

				highlightedIndex =
					(index + 1) % options.length;

				void focusHighlighted();
				break;

			case 'ArrowUp':
				event.preventDefault();

				highlightedIndex =
					(index - 1 + options.length) %
					options.length;

				void focusHighlighted();
				break;

			case 'Home':
				event.preventDefault();

				highlightedIndex = 0;
				void focusHighlighted();
				break;

			case 'End':
				event.preventDefault();

				highlightedIndex = options.length - 1;
				void focusHighlighted();
				break;

			case 'Enter':
			case ' ':
				event.preventDefault();

				selectCountry(countryId);
				break;

			case 'Escape':
				event.preventDefault();

				closeMenu();
				break;

			case 'Tab':
				isOpen = false;
				break;
		}
	}

	function handleOutsidePointer(
		event: PointerEvent
	): void {
		if (!isOpen) return;

		if (
			event.target instanceof Node &&
			!root.contains(event.target)
		) {
			isOpen = false;
		}
	}

	function handleFocusOut(
		event: FocusEvent
	): void {
		if (!isOpen) return;

		const nextFocus = event.relatedTarget;

		if (
			!(nextFocus instanceof Node) ||
			!root.contains(nextFocus)
		) {
			isOpen = false;
		}
	}
</script>

<svelte:window onpointerdown={handleOutsidePointer} />

<div
	class="country-select"
	bind:this={root}
	onfocusout={handleFocusOut}
>
	<button
		id={id}
		bind:this={trigger}
		type="button"
		class="country-trigger"
		class:expanded={isOpen}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		aria-controls={isOpen ? menuId : undefined}
		onclick={() => {
			if (isOpen) {
				closeMenu();
			} else {
				void openMenu();
			}
		}}
		onkeydown={handleTriggerKeydown}
	>
		<span class="selection-content">
			{#if selectedOption?.id}
				<CountryFlag
					countryId={selectedOption.id}
					width={30}
				/>
			{:else}
				<span class="empty-flag" aria-hidden="true">
					—
				</span>
			{/if}

			<span class="selected-name">
				{selectedOption?.name ?? 'Select country'}
			</span>
		</span>

		<svg
			class="chevron"
			class:rotated={isOpen}
			width="16"
			height="16"
			viewBox="0 0 20 20"
			aria-hidden="true"
		>
			<path
				d="m5 7 5 5 5-5"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>

	{#if isOpen}
		<div
			id={menuId}
			bind:this={menu}
			class="country-menu"
			role="listbox"
			aria-label="Choose a country"
		>
			{#each options as option, index (option.id)}
				<button
					type="button"
					class="country-option"
					class:selected={option.id === value}
					class:highlighted={highlightedIndex === index}
					role="option"
					aria-selected={option.id === value}
					tabindex={highlightedIndex === index ? 0 : -1}
					data-country-option
					onclick={() => selectCountry(option.id)}
					onkeydown={(event) =>
						handleOptionKeydown(
							event,
							index,
							option.id
						)}
					onmouseenter={() => {
						highlightedIndex = index;
					}}
				>
					<span class="option-content">
						{#if option.id}
							<CountryFlag
								countryId={option.id}
								width={30}
							/>
						{:else}
							<span class="empty-flag" aria-hidden="true">
								—
							</span>
						{/if}

						<span class="option-name">
							{option.name}
						</span>
					</span>

					{#if option.id === value}
						<svg
							class="selected-check"
							viewBox="0 0 20 20"
							width="17"
							height="17"
							aria-hidden="true"
						>
							<path
								d="m4 10 4 4 8-9"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.country-select {
		position: relative;
		z-index: 20;
		width: 100%;
		min-width: 0;
	}

	.country-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;

		width: 100%;
		min-width: 0;
		min-height: 40px;
		padding: 6px;

		border: 1px solid #94a3b8;
		border-radius: 7px;
		background: white;
		color: #0f172a;

		font-family: inherit;
		font-size: 0.93rem;
		font-weight: 800;
		text-align: left;
		cursor: pointer;
	}

	.country-trigger:hover {
		border-color: var(--brand-blue, #002a7a);
		background: #f8faff;
	}

	.country-trigger.expanded,
	.country-trigger:focus-visible {
		border-color: var(--brand-blue, #002a7a);
		outline: 2px solid rgba(0, 42, 122, 0.16);
		outline-offset: 1px;
	}

	.selection-content,
	.option-content {
		display: flex;
		align-items: center;
		gap: 7px;
		min-width: 0;
	}

	.selection-content {
		flex: 1;
	}

	.selected-name,
	.option-name {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.empty-flag {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 30px;
		width: 30px;
		height: 23px;
		color: #94a3b8;
	}

	.chevron {
		flex-shrink: 0;
		color: #475569;
		transition: transform 0.15s ease;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	.country-menu {
		position: absolute;
		z-index: 100;
		top: calc(100% + 5px);
		left: 0;

		box-sizing: border-box;
		width: max(100%, 235px);
		max-width: min(348px, calc(100vw - 24px));
		max-height: min(380px, 55vh);
		overflow-y: auto;

		padding: 5px;
		border: 1px solid #b7c7df;
		border-radius: 9px;
		background: #ffffff;
		box-shadow: 0 12px 28px rgba(15, 23, 42, 0.17);
		scrollbar-width: thin;
	}

	.country-option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;

		width: 100%;
		min-height: 42px;
		padding: 7px 9px;

		border: none;
		border-radius: 6px;
		background: transparent;
		color: #0f172a;

		font-family: inherit;
		font-size: 0.94rem;
		font-weight: 750;
		text-align: left;
		cursor: pointer;
	}

	.country-option:hover,
	.country-option.highlighted,
	.country-option:focus-visible {
		background: #e8eefb;
		color: var(--brand-blue, #002a7a);
		outline: none;
	}

	.country-option.selected {
		font-weight: 900;
	}

	.country-option.selected:not(.highlighted) {
		background: #f3f6fc;
	}

	.option-content {
		flex: 1;
	}

	.selected-check {
		flex-shrink: 0;
		color: var(--brand-blue, #002a7a);
	}

	@media (max-width: 760px) {
		.country-trigger {
			min-height: 42px;
		}

		.country-option {
			min-height: 44px;
		}
	}
</style>
