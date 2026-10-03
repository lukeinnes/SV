import type { Country, Election, Party } from './types';
import type { CountryDataset } from './registry';

export type DataIssueSeverity = 'error' | 'warning';

export type DataIssue = {
	severity: DataIssueSeverity;
	countryId: string;
	electionId?: string;
	message: string;
};

function sumVotes(election: Election): number {
	return election.results.reduce((total, result) => total + result.votes, 0);
}

function sumSeats(election: Election): number {
	return election.results.reduce((total, result) => total + result.seatsWon, 0);
}

export function validateDataset(dataset: CountryDataset): DataIssue[] {
	const issues: DataIssue[] = [];
	const { country, parties, elections } = dataset;

	const partyById = new Map(parties.map((party) => [party.id, party]));

	validateCountry(country, issues);
	validateParties(country, parties, issues);

	for (const election of elections) {
		validateElection(country, election, partyById, issues);
	}

	return issues;
}

function validateCountry(country: Country, issues: DataIssue[]): void {
	if (!country.id || !country.name || !country.alpha2 || !country.alpha3) {
		issues.push({
			severity: 'error',
			countryId: country.id || 'unknown',
			message: `Country is missing id, name, alpha2, or alpha3.`
		});
	}
}

function validateParties(country: Country, parties: Party[], issues: DataIssue[]): void {
	const seenPartyIds = new Set<string>();

	const otherParties = parties.filter(
		(party) => party.countryId === country.id && party.kind === 'other'
	);

	if (otherParties.length !== 1) {
		issues.push({
			severity: 'error',
			countryId: country.id,
			message: `Expected exactly one Other category for ${country.name}, found ${otherParties.length}.`
		});
	}

	for (const party of parties) {
		if (seenPartyIds.has(party.id)) {
			issues.push({
				severity: 'error',
				countryId: country.id,
				message: `Duplicate party id: ${party.id}.`
			});
		}

		seenPartyIds.add(party.id);

		if (party.countryId !== country.id) {
			issues.push({
				severity: 'error',
				countryId: country.id,
				message: `Party ${party.id} has countryId ${party.countryId}, but is listed in ${country.id}.`
			});
		}

		if (!party.usualName || !party.englishName || !party.shortName || !party.codeName || !party.colour) {
			issues.push({
				severity: 'error',
				countryId: country.id,
				message: `Party ${party.id} is missing name/code/colour metadata.`
			});
		}
	}
}

function validateElection(
	country: Country,
	election: Election,
	partyById: Map<string, Party>,
	issues: DataIssue[]
): void {
	if (election.countryId !== country.id) {
		issues.push({
			severity: 'error',
			countryId: country.id,
			electionId: election.id,
			message: `Election ${election.id} belongs to ${election.countryId}, but is listed under ${country.id}.`
		});
	}

	const seenPartyIds = new Set<string>();

	for (const result of election.results) {
		const party = partyById.get(result.partyId);

		if (seenPartyIds.has(result.partyId)) {
			issues.push({
				severity: 'error',
				countryId: country.id,
				electionId: election.id,
				message: `Duplicate result row for party ${result.partyId}.`
			});
		}

		seenPartyIds.add(result.partyId);

		if (!party) {
			issues.push({
				severity: 'error',
				countryId: country.id,
				electionId: election.id,
				message: `Election references unknown party: ${result.partyId}.`
			});

			continue;
		}

		if (party.countryId !== election.countryId) {
			issues.push({
				severity: 'error',
				countryId: country.id,
				electionId: election.id,
				message: `Election references party ${party.id}, which belongs to ${party.countryId}, not ${election.countryId}.`
			});
		}

		if (result.votes < 0 || result.seatsWon < 0) {
			issues.push({
				severity: 'error',
				countryId: country.id,
				electionId: election.id,
				message: `Party ${result.partyId} has negative votes or seats.`
			});
		}

		if (party.kind === 'other' && result.seatsWon > 0) {
			issues.push({
				severity: 'error',
				countryId: country.id,
				electionId: election.id,
				message: `Other has ${result.seatsWon} seat(s). Seat-winning results must be separately identified.`
			});
		}
	}

	const resultVotes = sumVotes(election);
	const voteDifference = resultVotes - election.totalVotes;

	if (Math.abs(voteDifference) > 0) {
		issues.push({
			severity: 'warning',
			countryId: country.id,
			electionId: election.id,
			message: `Result votes sum to ${resultVotes.toLocaleString()}, but election.totalVotes is ${election.totalVotes.toLocaleString()}. Difference: ${voteDifference.toLocaleString()}.`
		});
	}

	const resultSeats = sumSeats(election);
	const seatDifference = resultSeats - election.totalSeats;

	if (seatDifference !== 0) {
		issues.push({
			severity: 'error',
			countryId: country.id,
			electionId: election.id,
			message: `Result seats sum to ${resultSeats}, but election.totalSeats is ${election.totalSeats}. Difference: ${seatDifference}.`
		});
	}
}

export function validateAllDatasets(datasets: CountryDataset[]): DataIssue[] {
	return datasets.flatMap(validateDataset);
}