<script lang="ts">
	import { countryDatasets } from '$lib/data/registry';
	import { LAMBDA } from '$lib/sv/constants';
	import {
		calculateCustomElection,
		type CustomElectionCalculation,
		type CustomPartyInput
	} from '$lib/sv/calculateCustomElection';

	type EditablePartyRow = {
		id: string;
		sourcePartyId?: string;
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
		sourcePartyId?: string;
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
		countryId: string | null;
		totalSeats: number | null;
		totalSeatsText: string;
		k: number;
		kPreset: 'lambda' | 'custom';
		parties: SavedScenarioParty[];
	};

	type JsonRecord = Record<string, unknown>;

	type CalculatorCountry = {
		id: string;
		name: string;
		usualName?: string;
	};

	type CalculatorParty = {
		id: string;
		countryId: string;
		usualName: string;
		englishName?: string;
		shortName: string;
		codeName: string;
		colour: string;
		kind: 'party' | 'other' | 'independent' | 'special';
	};

	type CalculatorElectionResult = {
		partyId: string;
		votes: number;
		seatsWon?: number;
	};

	type CalculatorElection = {
		id: string;
		name?: string;
		year?: number | string;
		date?: string;
		totalVotes?: number;
		totalSeats: number;
		results: CalculatorElectionResult[];
	};

	type CalculatorCountryDataset = {
		country?: CalculatorCountry;
		countryId?: string;
		parties: CalculatorParty[];
		elections: CalculatorElection[];
	};

	type PartyPickerOption = {
		party: CalculatorParty;
		recentVotes: number;
		recentVoteShare: number;
		alreadySelected: boolean;
	};

	const calculatorDatasets = countryDatasets as unknown as CalculatorCountryDataset[];

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

	let selectedCountryId = $state('');
	let partyPickerOpen = $state(false);
	let partyPickerExpanded = $state(false);
	let partySearch = $state('');

	let totalSeatsText = $state('');
	let k = $state(LAMBDA);
	let nextPartyNumber = $state(1);
	let parties = $state<EditablePartyRow[]>([]);
	let importFileInput = $state<HTMLInputElement | null>(null);
	let fileMessage = $state('');
	let fileError = $state('');

	let selectedCountry = $derived(
		calculatorDatasets.find((dataset) => datasetCountryId(dataset) === selectedCountryId)
	);
	let canImportCountryElection = $derived(
		Boolean(selectedCountry && findMostRecentElection(selectedCountry.elections))
	);
    let currentTotalVoteShare = $derived(
        parties.reduce((total, party) => total + parsedVoteShare(party), 0)
    );
    let nonOtherVoteShare = $derived(
        parties
            .filter((party) => !party.isOther)
            .reduce((total, party) => total + parsedVoteShare(party), 0)
    );
    let remainderToOther = $derived(Number((100 - nonOtherVoteShare).toFixed(2)));
    let canFillRemainderToOther = $derived(
        currentTotalVoteShare < 99.999999 && remainderToOther > 0
    );
	let visibleCountryPartyOptions = $derived(buildVisibleCountryPartyOptions());
	let calculationState = $derived(buildCalculationState());

	function datasetCountryId(dataset: CalculatorCountryDataset): string {
		return dataset.country?.id ?? dataset.countryId ?? dataset.parties[0]?.countryId ?? '';
	}

	function datasetCountryName(dataset: CalculatorCountryDataset): string {
		return (
			dataset.country?.name ??
			dataset.country?.usualName ??
			datasetCountryId(dataset).toUpperCase()
		);
	}

	function electionSortValue(election: CalculatorElection): number {
		const possibleValues = [election.year, election.date, election.id, election.name];

		for (const value of possibleValues) {
			if (value === undefined || value === null) continue;

			const match = String(value).match(/\d{4}/);

			if (match) return Number(match[0]);
		}

		return 0;
	}

	function findMostRecentElection(elections: CalculatorElection[]): CalculatorElection | undefined {
		if (elections.length === 0) return undefined;

		return [...elections].sort((a, b) => electionSortValue(b) - electionSortValue(a))[0];
	}

	function countryPartyName(party: CalculatorParty): string {
		return party.englishName?.trim() || party.usualName || party.shortName || party.id;
	}

	function countryPartyAbbreviation(party: CalculatorParty): string {
		return party.shortName?.trim() || party.codeName?.trim() || party.id;
	}

	function countryPartyOptions(dataset: CalculatorCountryDataset): PartyPickerOption[] {
		const election = findMostRecentElection(dataset.elections);
		const electionResults = election?.results ?? [];
		const recentTotalVotes =
			election?.totalVotes ??
			electionResults.reduce((total, result) => total + result.votes, 0);

		const votesByPartyId: Record<string, number> = {};

		for (const result of electionResults) {
			votesByPartyId[result.partyId] = (votesByPartyId[result.partyId] ?? 0) + result.votes;
		}

		return dataset.parties
			.filter((party) => party.kind === 'party')
			.map((party) => {
				const recentVotes = votesByPartyId[party.id] ?? 0;

				return {
					party,
					recentVotes,
					recentVoteShare: recentTotalVotes > 0 ? (recentVotes / recentTotalVotes) * 100 : 0,
					alreadySelected: parties.some((row) => row.sourcePartyId === party.id)
				};
			})
			.sort((a, b) => {
				if (b.recentVotes !== a.recentVotes) return b.recentVotes - a.recentVotes;

				return countryPartyName(a.party).localeCompare(countryPartyName(b.party));
			});
	}

	function buildVisibleCountryPartyOptions(): PartyPickerOption[] {
		if (!selectedCountry) return [];

		const search = partySearch.trim().toLowerCase();

		const options = countryPartyOptions(selectedCountry).filter((option) => {
			if (!search) return true;

			const name = countryPartyName(option.party).toLowerCase();
			const abbreviation = countryPartyAbbreviation(option.party).toLowerCase();
			const codeName = option.party.codeName?.toLowerCase() ?? '';

			return name.includes(search) || abbreviation.includes(search) || codeName.includes(search);
		});

		if (!partyPickerExpanded) {
			return options.slice(0, 8);
		}

		return options;
	}

	function handleCountrySelect(event: Event): void {
		const nextCountryId = (event.currentTarget as HTMLSelectElement).value;
		selectedCountryId = nextCountryId;
		partyPickerOpen = false;
		partyPickerExpanded = false;
		partySearch = '';
		fileMessage = '';
		fileError = '';

		const dataset = calculatorDatasets.find((item) => datasetCountryId(item) === nextCountryId);

		if (!dataset) return;

		const election = findMostRecentElection(dataset.elections);

		if (election && Number.isInteger(election.totalSeats) && election.totalSeats > 0) {
			totalSeatsText = String(election.totalSeats);
		}
	}

	function openCountryPartyPicker(): void {
		if (!selectedCountry) return;

		partyPickerOpen = !partyPickerOpen;
		partyPickerExpanded = false;
		partySearch = '';
	}

	function createCustomPartyFromPicker(): void {
		addParty();
		partyPickerOpen = false;
		partyPickerExpanded = false;
		partySearch = '';
	}

	function addCountryParty(party: CalculatorParty): void {
		if (parties.some((row) => row.sourcePartyId === party.id)) return;

		const currentIds = new Set(parties.map((row) => row.id));

		const newParty: EditablePartyRow = {
			id: makeUniqueId(`known-${party.id}`, currentIds),
			sourcePartyId: party.id,
			name: countryPartyName(party),
			abbreviation: countryPartyAbbreviation(party),
			colour: normaliseColour(party.colour, defaultColours[parties.length % defaultColours.length]),
			isOther: false,
			voteShareText: ''
		};

		setPartiesWithOtherLast([...parties, newParty]);
	}

	function importLatestCountryElection(): void {
		fileMessage = '';
		fileError = '';

		if (!selectedCountry) {
			fileError = 'Select a country before importing an election.';
			return;
		}

		const election = findMostRecentElection(selectedCountry.elections);

		if (!election) {
			fileError = 'No election was found for the selected country.';
			return;
		}

		if (!Number.isInteger(election.totalSeats) || election.totalSeats <= 0) {
			fileError = 'The selected country election has an invalid seat count.';
			return;
		}

		const totalVotes =
			election.totalVotes ?? election.results.reduce((total, result) => total + result.votes, 0);

		if (!Number.isFinite(totalVotes) || totalVotes <= 0) {
			fileError = 'The selected country election has an invalid vote total.';
			return;
		}

		const partiesById: Record<string, CalculatorParty> = {};

		for (const party of selectedCountry.parties) {
			partiesById[party.id] = party;
		}

		const tauVotes = totalVotes / election.totalSeats;
		const currentIds = new Set<string>();
		const importedRows: EditablePartyRow[] = [];
		let includedVoteTotal = 0;

		const sortedResults = [...election.results].sort((a, b) => b.votes - a.votes);

		for (const result of sortedResults) {
			const party = partiesById[result.partyId];

			if (!party) continue;

			const seatsWon = result.seatsWon ?? 0;
			const shouldImportSeparately = party.kind === 'party' && (result.votes > tauVotes || seatsWon > 0);

			if (!shouldImportSeparately) continue;

			includedVoteTotal += result.votes;

			importedRows.push({
				id: makeUniqueId(`known-${party.id}`, currentIds),
				sourcePartyId: party.id,
				name: countryPartyName(party),
				abbreviation: countryPartyAbbreviation(party),
				colour: normaliseColour(party.colour, defaultColours[importedRows.length % defaultColours.length]),
				isOther: false,
				voteShareText: formatVoteInput((result.votes / totalVotes) * 100)
			});
		}

		const otherVotes = Math.max(0, totalVotes - includedVoteTotal);
		const otherVoteShare = (otherVotes / totalVotes) * 100;

		if (otherVoteShare >= 0.005) {
			importedRows.push({
				id: makeUniqueId('custom-other', currentIds),
				name: 'Other',
				abbreviation: 'OTH',
				colour: '#CBD5E1',
				isOther: true,
				voteShareText: formatVoteInput(otherVoteShare)
			});
		}

		const balancedRows = balanceRowsToOneHundred(importedRows);

		totalSeatsText = String(election.totalSeats);
		nextPartyNumber = nextPartyNumberAfterImport(balancedRows);
		partyPickerOpen = false;
		partyPickerExpanded = false;
		partySearch = '';

		setPartiesWithOtherLast(balancedRows);

		fileMessage = 'Imported latest election for selected country.';
	}

	function balanceRowsToOneHundred(rows: EditablePartyRow[]): EditablePartyRow[] {
		if (rows.length === 0) return rows;

		const currentTotal = rows.reduce(
			(total, row) => total + (parseNumberText(row.voteShareText) ?? 0),
			0
		);
		const remainder = Number((100 - currentTotal).toFixed(2));

		if (Math.abs(remainder) < 0.01) return rows;

		const otherIndex = rows.findIndex((row) => row.isOther);
		const targetIndex =
			otherIndex >= 0
				? otherIndex
				: rows.reduce((bestIndex, row, index, allRows) => {
						const rowVote = parseNumberText(row.voteShareText) ?? 0;
						const bestVote = parseNumberText(allRows[bestIndex].voteShareText) ?? 0;

						return rowVote > bestVote ? index : bestIndex;
					}, 0);

		const target = rows[targetIndex];
		const targetVote = parseNumberText(target.voteShareText) ?? 0;

		return rows.map((row, index) => {
			if (index !== targetIndex) return row;

			return {
				...row,
				voteShareText: formatVoteInput(Math.max(0, targetVote + remainder))
			};
		});
	}

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

	function fillRemainderToOther(): void {
		const remainder = Number((100 - nonOtherVoteShare).toFixed(2));

		if (remainder <= 0) return;

		const existingOther = parties.find((party) => party.isOther);

		if (existingOther) {
			const updatedRows = parties.map((party) => {
				if (!party.isOther) return party;

				return {
					...party,
					voteShareText: formatVoteInput(remainder)
				};
			});

			setPartiesWithOtherLast(updatedRows);
			return;
		}

		const currentIds = new Set(parties.map((party) => party.id));

		setPartiesWithOtherLast([
			...parties,
			{
				id: makeUniqueId('custom-other', currentIds),
				name: 'Other',
				abbreviation: 'OTH',
				colour: '#CBD5E1',
				isOther: true,
				voteShareText: formatVoteInput(remainder)
			}
		]);
	}

	function removeParty(id: string): void {
		setPartiesWithOtherLast(parties.filter((party) => party.id !== id));
	}

	function clearParties(): void {
		parties = [];
		nextPartyNumber = 1;
		partyPickerOpen = false;
		partyPickerExpanded = false;
		partySearch = '';
		fileMessage = '';
		fileError = '';
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
			countryId: selectedCountryId || null,
			totalSeats: parsedSeats ?? null,
			totalSeatsText,
			k,
			kPreset: isLambda(k) ? 'lambda' : 'custom',
			parties: parties.map((party) => ({
				id: party.id,
				sourcePartyId: party.sourcePartyId,
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
				sourcePartyId: readString(rawParty, 'sourcePartyId') || undefined,
				name: readString(rawParty, 'name', isOther ? 'Other' : `Party ${index + 1}`),
				abbreviation: readString(rawParty, 'abbreviation', isOther ? 'OTH' : `P${index + 1}`),
				colour: normaliseColour(readString(rawParty, 'colour'), fallbackColour),
				isOther,
				voteShareText
			});
		}

		const savedCountryId = readString(value, 'countryId');
		const countryExists = calculatorDatasets.some(
			(dataset) => datasetCountryId(dataset) === savedCountryId
		);

		selectedCountryId = countryExists ? savedCountryId : '';
		partyPickerOpen = false;
		partyPickerExpanded = false;
		partySearch = '';

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
			Build a hypothetical election from scratch. Choose a country to speed up party entry, or
			leave the country blank and create every party manually.
		</p>
	</header>

	<section class="panel">
		<div class="top-grid">
			<label>
				<span>Country assistance</span>
				<select bind:value={selectedCountryId} onchange={handleCountrySelect}>
					<option value="">None</option>
					{#each calculatorDatasets as dataset (datasetCountryId(dataset))}
						<option value={datasetCountryId(dataset)}>{datasetCountryName(dataset)}</option>
					{/each}
				</select>
			</label>

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
				<button type="button" onclick={addParty}>Create custom party</button>
				<button type="button" onclick={openCountryPartyPicker} disabled={!selectedCountry}>
					Add country party
				</button>
				<button
					type="button"
					onclick={importLatestCountryElection}
					disabled={!canImportCountryElection}
				>
					Import latest country election
				</button>
				<button
					type="button"
					onclick={fillRemainderToOther}
					disabled={!canFillRemainderToOther}
				>
					Fill remainder to Other ({pctFromPercentage(Math.max(0, remainderToOther))})
				</button>
				<button type="button" onclick={scaleVoteShares}>Scale to 100%</button>
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

		{#if partyPickerOpen && selectedCountry}
			<div class="party-picker">
				<div class="party-picker-header">
					<div>
						<h3>Add party from {datasetCountryName(selectedCountry)}</h3>
						<p>
							The first suggestions are ordered by vote count in the latest election. Selecting
							a party fills its name, abbreviation and colour. You still enter the vote share.
						</p>
					</div>

					<div class="actions">
						<button type="button" onclick={createCustomPartyFromPicker}>Create custom party</button>

						{#if partyPickerExpanded}
							<button
								type="button"
								onclick={() => {
									partyPickerExpanded = false;
									partySearch = '';
								}}
							>
								Collapse
							</button>
						{:else}
							<button type="button" onclick={() => (partyPickerExpanded = true)}>
								Expand
							</button>
						{/if}
					</div>
				</div>

				{#if partyPickerExpanded}
					<label class="party-picker-search">
						<span>Search parties</span>
						<input
							type="text"
							placeholder="Search by name or abbreviation"
							bind:value={partySearch}
						/>
					</label>
				{/if}

				<div class="party-option-grid">
					{#each visibleCountryPartyOptions as option (option.party.id)}
						<button
							type="button"
							class="party-option"
							disabled={option.alreadySelected}
							onclick={() => addCountryParty(option.party)}
						>
							<span
								class="swatch"
								style={`background: ${option.party.colour}`}
								aria-label={`${countryPartyName(option.party)} colour`}
							></span>

							<span>
								<strong>{countryPartyName(option.party)}</strong>
								<small>
									{countryPartyAbbreviation(option.party)}
									{#if option.recentVotes > 0}
										· latest vote share {pctFromPercentage(option.recentVoteShare)}
									{/if}
									{#if option.alreadySelected}
										· already added
									{/if}
								</small>
							</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}

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
				<div class="actions empty-actions">
					<button type="button" onclick={addParty}>Create custom party</button>
					<button type="button" onclick={openCountryPartyPicker} disabled={!selectedCountry}>
						Add country party
					</button>
					<button
						type="button"
						onclick={importLatestCountryElection}
						disabled={!canImportCountryElection}
					>
						Import latest country election
					</button>
				</div>
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
		grid-template-columns: 1fr 1fr 1fr;
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
        box-sizing: border-box;
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
        box-sizing: border-box;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #f8fafc;
        padding: 10px 12px;
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
        box-sizing: border-box;
        width: 100%;
        padding-left: 0;
        padding-right: 0;
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

	.empty-actions {
		justify-content: flex-start;
	}

	.party-picker {
		border: 1px solid #dbeafe;
		border-radius: 18px;
		background: #eff6ff;
		margin-bottom: 16px;
		padding: 16px;
	}

	.party-picker-header {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 14px;
	}

	.party-picker-header p {
		margin: 6px 0 0;
		color: #475569;
		line-height: 1.45;
	}

	.party-picker-search {
		margin-bottom: 14px;
	}

	.party-option-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
	}

	.party-option {
		display: flex;
		align-items: center;
		gap: 10px;
		border-radius: 16px;
		background: white;
		padding: 11px;
		text-align: left;
		white-space: normal;
	}

	.party-option strong,
	.party-option small {
		display: block;
	}

	.party-option small {
		color: #64748b;
		font-size: 0.78rem;
		font-weight: 600;
		line-height: 1.35;
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
		flex: 0 0 auto;
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

	@media (max-width: 1200px) {
		.party-option-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 1100px) {
		.stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 900px) {
		.top-grid,
		.stats,
		.party-option-grid {
			grid-template-columns: 1fr;
		}

		.slider-header,
		.section-heading,
		.party-picker-header {
			align-items: stretch;
			flex-direction: column;
		}

		.actions {
			justify-content: flex-start;
		}
	}
</style>