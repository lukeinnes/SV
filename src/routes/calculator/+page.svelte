<script lang="ts">
	import { LAMBDA } from '$lib/sv/constants';
	import {
		calculateCustomElection,
		type CustomElectionCalculation,
		type CustomPartyInput
	} from '$lib/sv/calculateCustomElection';

	type EditablePartyRow = {
		id: string;
		name: string;
		abbreviation: string;
		colour: string;
		isOther: boolean;
		voteShareText: string;
	};

	type CalculationState = {
		issues: string[];
		calculation: CustomElectionCalculation | null;
		totalVoteShare: number;
		remainingVoteShare: number;
	};

	type SavedScenarioParty = {
		id: string;
		name: string;
		abbreviation: string;
		colour: string;
		isOther: boolean;
		voteShare: number | null;
		voteShareText: string;
	};

	type SavedScenario = {
		version: 1;
		app: 'strengthened-voting-calculator';
		exportedAt: string;
		totalSeats: number | null;
		totalSeatsText: string;
		k: number;
		kPreset: 'lambda' | 'custom';
		parties: SavedScenarioParty[];
	};

	type JsonRecord = Record<string, unknown>;

	const defaultColours = [
		'#2563EB',
		'#DC2626',
		'#16A34A',
		'#CA8A04',
		'#9333EA',
		'#0891B2',
		'#EA580C',
		'#475569'
	];

	let totalSeatsText = $state('');
	let k = $state(LAMBDA);
	let nextPartyNumber = $state(1);
	let parties = $state<EditablePartyRow[]>([]);
	let importFileInput = $state<HTMLInputElement | null>(null);
	let fileMessage = $state('');
	let fileError = $state('');

	let hasOther = $derived(parties.some((party) => party.isOther));
	let calculationState = $derived(buildCalculationState());

	function parseNumberText(value: string): number | undefined {
		const cleaned = value.replaceAll(',', '').trim();

		if (cleaned.length === 0) return undefined;

		const parsed = Number(cleaned);

		if (!Number.isFinite(parsed)) return undefined;

		return parsed;
	}

	function parsePositiveIntegerText(value: string): number | undefined {
		const parsed = parseNumberText(value);

		if (parsed === undefined) return undefined;
		if (!Number.isInteger(parsed)) return undefined;
		if (parsed <= 0) return undefined;

		return parsed;
	}

	function formatVoteInput(value: number): string {
		return value.toFixed(2);
	}

	function parsedVoteShare(party: EditablePartyRow): number {
		return parseNumberText(party.voteShareText) ?? 0;
	}

	function normalParties(): EditablePartyRow[] {
		return parties.filter((party) => !party.isOther);
	}

	function setPartiesWithOtherLast(rows: EditablePartyRow[]): void {
		const other = rows.find((party) => party.isOther);
		const regular = rows.filter((party) => !party.isOther);

		parties = other ? [...regular, other] : regular;
	}

	function addParty(): void {
		const partyNumber = nextPartyNumber;
		nextPartyNumber += 1;

		const newParty: EditablePartyRow = {
			id: `custom-${partyNumber}`,
			name: `Party ${partyNumber}`,
			abbreviation: `P${partyNumber}`,
			colour: defaultColours[(partyNumber - 1) % defaultColours.length],
			isOther: false,
			voteShareText: ''
		};

		setPartiesWithOtherLast([...parties, newParty]);
	}

	function addOther(): void {
		if (hasOther) return;

		parties = [
			...normalParties(),
			{
				id: 'custom-other',
				name: 'Other',
				abbreviation: 'OTH',
				colour: '#CBD5E1',
				isOther: true,
				voteShareText: ''
			}
		];
	}

	function removeParty(id: string): void {
		setPartiesWithOtherLast(parties.filter((party) => party.id !== id));
	}

	function clearParties(): void {
		parties = [];
		nextPartyNumber = 1;
		fileMessage = '';
		fileError = '';
	}

	function loadToyScenario(): void {
		totalSeatsText = '100';
		k = LAMBDA;
		nextPartyNumber = 4;
		fileMessage = '';
		fileError = '';

		parties = [
			{
				id: 'toy-a',
				name: 'Party A',
				abbreviation: 'A',
				colour: '#2563EB',
				isOther: false,
				voteShareText: '42.00'
			},
			{
				id: 'toy-b',
				name: 'Party B',
				abbreviation: 'B',
				colour: '#DC2626',
				isOther: false,
				voteShareText: '33.00'
			},
			{
				id: 'toy-c',
				name: 'Party C',
				abbreviation: 'C',
				colour: '#16A34A',
				isOther: false,
				voteShareText: '15.00'
			},
			{
				id: 'toy-other',
				name: 'Other',
				abbreviation: 'OTH',
				colour: '#CBD5E1',
				isOther: true,
				voteShareText: '10.00'
			}
		];
	}

	function adjustVoteShare(id: string, delta: number): void {
		parties = parties.map((party) => {
			if (party.id !== id) return party;

			const current = parsedVoteShare(party);
			const next = Math.max(0, current + delta);

			return {
				...party,
				voteShareText: formatVoteInput(next)
			};
		});
	}

	function scaleVoteShares(): void {
		const currentTotal = parties.reduce((total, party) => total + parsedVoteShare(party), 0);

		if (currentTotal <= 0) return;

		const scaled = parties.map((party) => {
			const scaledValue = (parsedVoteShare(party) / currentTotal) * 100;

			return {
				...party,
				voteShareText: formatVoteInput(scaledValue)
			};
		});

		const roundedTotal = scaled.reduce((total, party) => total + parsedVoteShare(party), 0);
		const remainder = Number((100 - roundedTotal).toFixed(2));

		if (Math.abs(remainder) >= 0.01 && scaled.length > 0) {
			const targetIndex = scaled.reduce((bestIndex, party, index, rows) => {
				return parsedVoteShare(party) > parsedVoteShare(rows[bestIndex]) ? index : bestIndex;
			}, 0);

			const target = scaled[targetIndex];

			scaled[targetIndex] = {
				...target,
				voteShareText: formatVoteInput(Math.max(0, parsedVoteShare(target) + remainder))
			};
		}

		setPartiesWithOtherLast(scaled);
	}

	function buildCalculationState(): CalculationState {
		const issues: string[] = [];

		const totalSeats = parsePositiveIntegerText(totalSeatsText);

		if (totalSeats === undefined) {
			issues.push('Enter a positive whole number of seats.');
		}

		if (parties.length === 0) {
			issues.push('Add at least one party.');
		}

		const parsedParties: CustomPartyInput[] = parties.map((party, index) => {
			const voteShare = parseNumberText(party.voteShareText);

			if (!party.name.trim()) {
				issues.push(`Row ${index + 1}: enter a party name.`);
			}

			if (!party.abbreviation.trim()) {
				issues.push(`Row ${index + 1}: enter an abbreviation.`);
			}

			if (voteShare === undefined || voteShare < 0) {
				issues.push(`Row ${index + 1}: enter a non-negative vote share.`);
			}

			return {
				id: party.id,
				name: party.name.trim(),
				abbreviation: party.abbreviation.trim(),
				colour: party.colour,
				kind: party.isOther ? 'other' : 'party',
				voteShare: voteShare ?? 0
			};
		});

		const totalVoteShare = parsedParties.reduce((total, party) => total + party.voteShare, 0);
		const remainingVoteShare = 100 - totalVoteShare;

		if (parties.length > 0 && Math.abs(remainingVoteShare) > 0.000001) {
			issues.push(`Vote shares must sum to 100%. Current total is ${totalVoteShare.toFixed(2)}%.`);
		}

		if (issues.length > 0 || totalSeats === undefined) {
			return {
				issues,
				calculation: null,
				totalVoteShare,
				remainingVoteShare
			};
		}

		try {
			const calculation = calculateCustomElection({
				name: 'Custom election',
				totalSeats,
				k,
				parties: parsedParties
			});

			return {
				issues: [],
				calculation,
				totalVoteShare,
				remainingVoteShare
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown calculation error.';

			return {
				issues: [message],
				calculation: null,
				totalVoteShare,
				remainingVoteShare
			};
		}
	}

	function integer(value: number): string {
		return value.toLocaleString(undefined, {
			maximumFractionDigits: 0
		});
	}

	function fixed2(value: number): string {
		return value.toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
	}

	function isLambda(value: number): boolean {
		return Math.abs(value - LAMBDA) < 1e-12;
	}

	function formatK(value: number): string {
		if (isLambda(value)) {
			return `Λ ${LAMBDA.toPrecision(7)}…`;
		}

		return value.toFixed(2);
	}

	function pctFromPercentage(value: number): string {
		return `${fixed2(value)}%`;
	}

	function pctFromFraction(value: number): string {
		return `${fixed2(value * 100)}%`;
	}

	function isRecord(value: unknown): value is JsonRecord {
		return typeof value === 'object' && value !== null && !Array.isArray(value);
	}

	function readString(record: JsonRecord, key: string, fallback = ''): string {
		const value = record[key];

		if (typeof value === 'string') return value;

		return fallback;
	}

	function readNumber(record: JsonRecord, key: string): number | undefined {
		const value = record[key];

		if (typeof value !== 'number') return undefined;
		if (!Number.isFinite(value)) return undefined;

		return value;
	}

	function readBoolean(record: JsonRecord, key: string, fallback = false): boolean {
		const value = record[key];

		if (typeof value === 'boolean') return value;

		return fallback;
	}

	function normaliseColour(value: string, fallback: string): string {
		if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;

		return fallback;
	}

	function makeUniqueId(baseId: string, seenIds: Set<string>): string {
		const cleanBaseId = baseId.trim() || 'imported-party';
		let candidate = cleanBaseId;
		let suffix = 2;

		while (seenIds.has(candidate)) {
			candidate = `${cleanBaseId}-${suffix}`;
			suffix += 1;
		}

		seenIds.add(candidate);

		return candidate;
	}

	function nextPartyNumberAfterImport(rows: EditablePartyRow[]): number {
		const customNumbers = rows
			.map((row) => /^custom-(\d+)$/.exec(row.id)?.[1])
			.filter((value): value is string => value !== undefined)
			.map((value) => Number(value))
			.filter((value) => Number.isInteger(value));

		if (customNumbers.length === 0) {
			return rows.length + 1;
		}

		return Math.max(...customNumbers) + 1;
	}

	function buildSavedScenario(): SavedScenario {
		const parsedSeats = parsePositiveIntegerText(totalSeatsText);

		return {
			version: 1,
			app: 'strengthened-voting-calculator',
			exportedAt: new Date().toISOString(),
			totalSeats: parsedSeats ?? null,
			totalSeatsText,
			k,
			kPreset: isLambda(k) ? 'lambda' : 'custom',
			parties: parties.map((party) => ({
				id: party.id,
				name: party.name,
				abbreviation: party.abbreviation,
				colour: party.colour,
				isOther: party.isOther,
				voteShare: parseNumberText(party.voteShareText) ?? null,
				voteShareText: party.voteShareText
			}))
		};
	}

	function exportScenario(): void {
		fileMessage = '';
		fileError = '';

		try {
			const scenario = buildSavedScenario();
			const json = JSON.stringify(scenario, null, 2);
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			const datePart = new Date().toISOString().slice(0, 10);

			link.href = url;
			link.download = `sv-calculator-${datePart}.json`;

			document.body.appendChild(link);
			link.click();
			link.remove();

			URL.revokeObjectURL(url);

			fileMessage = 'Scenario exported as JSON.';
		} catch (error) {
			fileError = error instanceof Error ? error.message : 'Could not export scenario.';
		}
	}

	function openImportPicker(): void {
		fileMessage = '';
		fileError = '';
		importFileInput?.click();
	}

	function loadSavedScenario(value: unknown): void {
		if (!isRecord(value)) {
			throw new Error('This file is not a valid SV calculator scenario.');
		}

		const version = readNumber(value, 'version');
		const app = readString(value, 'app');

		if (version !== 1 || app !== 'strengthened-voting-calculator') {
			throw new Error('This JSON file is not a recognised SV calculator scenario.');
		}

		const importedK = readNumber(value, 'k');

		if (importedK === undefined || importedK <= 0) {
			throw new Error('The scenario file does not contain a valid k value.');
		}

		const kPreset = readString(value, 'kPreset');
		const rawParties = value.parties;

		if (!Array.isArray(rawParties)) {
			throw new Error('The scenario file does not contain a valid party list.');
		}

		const importedRows: EditablePartyRow[] = [];
		const seenIds = new Set<string>();
		let otherCount = 0;

		for (const [index, rawParty] of rawParties.entries()) {
			if (!isRecord(rawParty)) {
				throw new Error(`Party row ${index + 1} is not valid.`);
			}

			const isOther = readBoolean(rawParty, 'isOther', false);

			if (isOther) {
				otherCount += 1;

				if (otherCount > 1) {
					throw new Error('The scenario file contains more than one Other row.');
				}
			}

			const fallbackColour = defaultColours[index % defaultColours.length];
			const savedVoteShare = readNumber(rawParty, 'voteShare');
			const savedVoteShareText = readString(rawParty, 'voteShareText');
			const voteShareText =
				savedVoteShareText.trim().length > 0
					? savedVoteShareText
					: savedVoteShare !== undefined
						? formatVoteInput(savedVoteShare)
						: '';

			importedRows.push({
				id: makeUniqueId(readString(rawParty, 'id', `imported-${index + 1}`), seenIds),
				name: readString(rawParty, 'name', isOther ? 'Other' : `Party ${index + 1}`),
				abbreviation: readString(rawParty, 'abbreviation', isOther ? 'OTH' : `P${index + 1}`),
				colour: normaliseColour(readString(rawParty, 'colour'), fallbackColour),
				isOther,
				voteShareText
			});
		}

		const savedTotalSeats = readNumber(value, 'totalSeats');
		const savedTotalSeatsText = readString(value, 'totalSeatsText');

		totalSeatsText =
			savedTotalSeats !== undefined && Number.isInteger(savedTotalSeats) && savedTotalSeats > 0
				? String(savedTotalSeats)
				: savedTotalSeatsText;

		k = kPreset === 'lambda' || isLambda(importedK) ? LAMBDA : importedK;
		nextPartyNumber = nextPartyNumberAfterImport(importedRows);

		setPartiesWithOtherLast(importedRows);
	}

	async function importScenarioFromFile(event: Event): Promise<void> {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];

		fileMessage = '';
		fileError = '';

		if (!file) return;

		try {
			const text = await file.text();
			const parsed = JSON.parse(text);

			loadSavedScenario(parsed);

			fileMessage = `Imported ${file.name}.`;
		} catch (error) {
			fileError = error instanceof Error ? error.message : 'Could not import scenario.';
		} finally {
			input.value = '';
		}
	}
</script>

<svelte:head>
	<title>Calculator — Strengthened Voting</title>
</svelte:head>

<main>
	<header class="hero">
		<p class="eyebrow">Strengthened Voting calculator</p>
		<h1>Custom election calculator</h1>
		<p class="lede">
			Build a hypothetical election from scratch. Enter the number of seats, add parties, set vote
			shares, and see the SV result update live.
		</p>
	</header>

	<section class="panel">
		<div class="top-grid">
			<label>
				<span>Total seats</span>
				<input
					type="text"
					inputmode="numeric"
					placeholder="Required"
					bind:value={totalSeatsText}
				/>
			</label>

			<div class="tau-preview">
				<span>τ threshold</span>
				<strong>
					{#if parsePositiveIntegerText(totalSeatsText)}
						{pctFromPercentage(100 / parsePositiveIntegerText(totalSeatsText)!)}
					{:else}
						—
					{/if}
				</strong>
			</div>
		</div>

		<div class="slider-header">
			<label for="k-slider">
				<span>Mandate parameter k</span>
				<strong>{formatK(k)}</strong>
			</label>

			<button type="button" onclick={() => (k = LAMBDA)}>
				Reset to Λ
			</button>
		</div>

		<input id="k-slider" type="range" min="0.5" max="10" step="0.01" bind:value={k} />
	</section>

	<section class="panel">
		<div class="section-heading">
			<div>
				<h2>Party inputs</h2>
				<p>
					Enter vote shares as percentages. Results are shown only when seats are valid and vote
					shares sum to 100%.
				</p>
			</div>

			<div class="actions">
				<button type="button" onclick={addParty}>Add party</button>
				<button type="button" onclick={addOther} disabled={hasOther}>Add Other</button>
				<button type="button" onclick={scaleVoteShares}>Scale to 100%</button>
				<button type="button" onclick={loadToyScenario}>Load toy scenario</button>
				<button type="button" onclick={exportScenario}>Export JSON</button>
				<button type="button" onclick={openImportPicker}>Import JSON</button>
				<button type="button" onclick={clearParties}>Clear</button>

				<input
					class="hidden-file-input"
					type="file"
					accept="application/json,.json"
					bind:this={importFileInput}
					onchange={importScenarioFromFile}
				/>
			</div>
		</div>

		{#if fileError}
			<div class="file-message file-message-error">{fileError}</div>
		{:else if fileMessage}
			<div class="file-message">{fileMessage}</div>
		{/if}

		<div class="vote-total" class:complete={Math.abs(calculationState.remainingVoteShare) <= 0.000001}>
			<span>Current vote total</span>
			<strong>{pctFromPercentage(calculationState.totalVoteShare)}</strong>
			<span>Remaining: {pctFromPercentage(calculationState.remainingVoteShare)}</span>
		</div>

		{#if parties.length === 0}
			<div class="empty-state">
				<p>No parties have been added yet.</p>
				<button type="button" onclick={addParty}>Add first party</button>
			</div>
		{:else}
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>Colour</th>
							<th>Name</th>
							<th>Abbrev.</th>
							<th>Vote share</th>
							<th>Adjust</th>
							<th></th>
						</tr>
					</thead>

					<tbody>
						{#each parties as party, index (party.id)}
							<tr class:other-row={party.isOther}>
								<td>
									<input
										class="colour-input"
										type="color"
										aria-label={`Colour for ${party.name}`}
										bind:value={party.colour}
									/>
								</td>

								<td>
									<input
										type="text"
										aria-label={`Name for row ${index + 1}`}
										bind:value={party.name}
										readonly={party.isOther}
									/>
								</td>

								<td>
									<input
										type="text"
										aria-label={`Abbreviation for row ${index + 1}`}
										bind:value={party.abbreviation}
										readonly={party.isOther}
									/>
								</td>

								<td>
									<input
										type="text"
										inputmode="decimal"
										aria-label={`Vote share for row ${index + 1}`}
										bind:value={party.voteShareText}
									/>
								</td>

								<td>
									<div class="bump-controls" aria-label={`Vote share controls for ${party.name}`}>
										<button type="button" onclick={() => adjustVoteShare(party.id, -1)}>--</button>
										<button type="button" onclick={() => adjustVoteShare(party.id, -0.01)}>-</button>
										<button type="button" onclick={() => adjustVoteShare(party.id, 0.01)}>+</button>
										<button type="button" onclick={() => adjustVoteShare(party.id, 1)}>++</button>
									</div>
								</td>

								<td>
									<button type="button" class="danger" onclick={() => removeParty(party.id)}>
										Remove
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>

	<section class="panel">
		<div class="section-heading">
			<div>
				<h2>SV output</h2>
				<p>
					Rows below τ receive zero mandate and are greyed out. Other is always assigned zero
					mandate and zero SV seats.
				</p>
			</div>
		</div>

		{#if calculationState.issues.length > 0}
			<div class="issues">
				<h3>Cannot calculate yet</h3>

				<ul>
					{#each calculationState.issues as issue (issue)}
						<li>{issue}</li>
					{/each}
				</ul>
			</div>
		{:else if calculationState.calculation}
			<div class="stats">
				<div>
					<span>τ</span>
					<strong>{pctFromPercentage(calculationState.calculation.tauPercentage)}</strong>
				</div>

				<div>
					<span>A</span>
					<strong>{fixed2(calculationState.calculation.A)}</strong>
				</div>

				<div>
					<span>Eligible vote share</span>
					<strong>{pctFromPercentage(calculationState.calculation.eligibleVoteShareTotal)}</strong>
				</div>

				<div>
					<span>Total mandate</span>
					<strong>{integer(calculationState.calculation.totalMandate)}</strong>
				</div>

				<div>
					<span>Consolidation Index</span>
					<strong>{fixed2(calculationState.calculation.consolidationIndex)}</strong>
				</div>
			</div>

			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>Colour</th>
							<th>Party</th>
							<th>Vote share</th>
							<th>x</th>
							<th>Mandate</th>
							<th>Power share</th>
							<th>SV seats</th>
							<th>SV seat share</th>
						</tr>
					</thead>

					<tbody>
						{#each calculationState.calculation.parties as party (party.id)}
							<tr class:excluded={!party.eligible}>
								<td>
									<span
										class="swatch"
										style={`background: ${party.colour}`}
										aria-label={`${party.name} colour`}
									></span>
								</td>

								<td>
									<div class="party-name">{party.name}</div>
									<div class="party-usual">{party.abbreviation}</div>
									{#if party.exclusionReason}
										<div class="party-usual">{party.exclusionReason}</div>
									{/if}
								</td>

								<td>{pctFromPercentage(party.voteShare)}</td>
								<td>{pctFromFraction(party.x)}</td>
								<td>{fixed2(party.mandate)}</td>
								<td>{pctFromFraction(party.fractionOfPower)}</td>
								<td>{integer(party.svSeats)}</td>
								<td>{pctFromFraction(party.svSeatShare)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</main>

<style>
	main {
		max-width: 1320px;
		margin: 0 auto;
		padding: 32px 20px 56px;
	}

	.hero {
		margin-bottom: 28px;
	}

	.eyebrow {
		margin: 0 0 8px;
		color: #2563eb;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.8rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(2.25rem, 6vw, 4.5rem);
		line-height: 1;
		letter-spacing: -0.05em;
	}

	.lede {
		max-width: 820px;
		margin: 16px 0 0;
		color: #475569;
		font-size: 1.1rem;
		line-height: 1.55;
	}

	.panel {
		margin-bottom: 20px;
		border: 1px solid #cbd5e1;
		border-radius: 22px;
		background: white;
		padding: 22px;
		box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);
	}

	.top-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-bottom: 20px;
	}

	label {
		display: grid;
		gap: 8px;
		font-weight: 700;
		color: #334155;
	}

	input,
	select {
		width: 100%;
		border: 1px solid #cbd5e1;
		border-radius: 12px;
		background: white;
		color: #0f172a;
		padding: 10px 12px;
		font: inherit;
		min-width: 0;
	}

	input[readonly] {
		background: #f8fafc;
		color: #475569;
	}

	.colour-input {
		width: 44px;
		height: 38px;
		padding: 3px;
	}

	.hidden-file-input {
		display: none;
	}

	.tau-preview {
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		background: #f8fafc;
		padding: 14px;
	}

	.tau-preview span {
		display: block;
		color: #64748b;
		font-size: 0.85rem;
		font-weight: 700;
	}

	.tau-preview strong {
		display: block;
		margin-top: 5px;
		font-size: 1.25rem;
	}

	.slider-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 12px;
	}

	.slider-header label {
		gap: 4px;
	}

	.slider-header strong {
		color: #0f172a;
		font-size: 1.4rem;
	}

	input[type='range'] {
		width: 100%;
	}

	button {
		border: 1px solid #cbd5e1;
		border-radius: 999px;
		background: #f8fafc;
		color: #0f172a;
		padding: 9px 14px;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
		white-space: nowrap;
	}

	button:hover:not(:disabled) {
		background: #eef2ff;
		border-color: #93c5fd;
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	button.danger {
		color: #991b1b;
	}

	.section-heading {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 16px;
	}

	h2,
	h3 {
		margin: 0;
	}

	h2 {
		font-size: 1.35rem;
	}

	h3 {
		font-size: 1.05rem;
	}

	.section-heading p {
		margin: 8px 0 0;
		color: #64748b;
		line-height: 1.5;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: flex-start;
		justify-content: flex-end;
	}

	.file-message {
		border: 1px solid #bbf7d0;
		border-radius: 14px;
		background: #f0fdf4;
		color: #166534;
		font-weight: 700;
		margin-bottom: 16px;
		padding: 11px 13px;
	}

	.file-message-error {
		border-color: #fecaca;
		background: #fef2f2;
		color: #991b1b;
	}

	.vote-total {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		align-items: center;
		justify-content: space-between;
		border: 1px solid #fecaca;
		border-radius: 16px;
		background: #fef2f2;
		color: #991b1b;
		padding: 12px 14px;
		margin-bottom: 16px;
	}

	.vote-total.complete {
		border-color: #bbf7d0;
		background: #f0fdf4;
		color: #166534;
	}

	.vote-total strong {
		font-size: 1.2rem;
	}

	.empty-state,
	.issues {
		border: 1px dashed #cbd5e1;
		border-radius: 18px;
		background: #f8fafc;
		padding: 20px;
	}

	.empty-state p {
		margin-top: 0;
		color: #64748b;
	}

	.issues {
		border-color: #fecaca;
		background: #fef2f2;
		color: #991b1b;
	}

	.issues ul {
		margin-bottom: 0;
		padding-left: 22px;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 12px;
		margin-bottom: 18px;
	}

	.stats div {
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		background: #f8fafc;
		padding: 14px;
	}

	.stats span {
		display: block;
		color: #64748b;
		font-size: 0.85rem;
		font-weight: 700;
	}

	.stats strong {
		display: block;
		margin-top: 5px;
		font-size: 1.05rem;
		line-height: 1.25;
	}

	code {
		border-radius: 6px;
		background: #f1f5f9;
		padding: 2px 5px;
		font-size: 0.92em;
	}

	.table-wrap {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.92rem;
	}

	th,
	td {
		padding: 11px 12px;
		border-bottom: 1px solid #e2e8f0;
		text-align: left;
		vertical-align: middle;
		white-space: nowrap;
	}

	th {
		background: #f8fafc;
		color: #475569;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	tr:last-child td {
		border-bottom: 0;
	}

	td input,
	td select {
		min-width: 110px;
	}

	.other-row {
		background: #f8fafc;
	}

	.excluded {
		background: #f8fafc;
		color: #94a3b8;
	}

	.excluded .party-name {
		color: #64748b;
	}

	.bump-controls {
		display: flex;
		gap: 5px;
	}

	.bump-controls button {
		min-width: 42px;
		padding: 7px 9px;
		border-radius: 10px;
	}

	.locked {
		color: #64748b;
		font-size: 0.85rem;
		font-weight: 700;
	}

	.swatch {
		display: inline-block;
		width: 22px;
		height: 22px;
		border: 1px solid #94a3b8;
		border-radius: 999px;
		vertical-align: middle;
	}

	.party-name {
		font-weight: 800;
		color: #0f172a;
	}

	.party-usual {
		margin-top: 3px;
		color: #64748b;
		font-size: 0.84rem;
		white-space: normal;
	}

	@media (max-width: 1100px) {
		.stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 900px) {
		.top-grid,
		.stats {
			grid-template-columns: 1fr;
		}

		.slider-header,
		.section-heading {
			align-items: stretch;
			flex-direction: column;
		}

		.actions {
			justify-content: flex-start;
		}
	}
</style>