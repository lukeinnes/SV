import type { Election, Party } from './types';

export type EnrichedElectionResult = {
	partyId: string;

	usualName: string;
	shortName: string;
	codeName: string;
	colour: string;
	kind: Party['kind'];

	votes: number;
	seatsWon: number;

	voteShare: number;
	seatShare: number;

	aboveTau: boolean;
	isOther: boolean;
	isSpeaker: boolean;
	isIndependentAggregate: boolean;
};

export function calculateTau(totalVotes: number, totalSeats: number): number {
	if (!Number.isFinite(totalVotes) || totalVotes <= 0) {
		throw new Error('Total votes must be a positive finite number.');
	}

	if (!Number.isInteger(totalSeats) || totalSeats <= 0) {
		throw new Error('Total seats must be a positive integer.');
	}

	return totalVotes / totalSeats;
}

function isSpeakerLike(party: Party): boolean {
	return (
		party.kind === 'special' &&
		(party.codeName.toLowerCase() === 'spk' ||
			party.shortName.toLowerCase().includes('speaker') ||
			party.usualName.toLowerCase().includes('speaker'))
	);
}

function makeOtherRow(
	election: Election,
	otherParty: Party,
	votes: number,
	seatsWon: number,
	tau: number
): EnrichedElectionResult {
	return {
		partyId: otherParty.id,

		usualName: otherParty.usualName,
		shortName: otherParty.shortName,
		codeName: otherParty.codeName,
		colour: otherParty.colour,
		kind: otherParty.kind,

		votes,
		seatsWon,

		voteShare: votes / election.totalVotes,
		seatShare: seatsWon / election.totalSeats,

		aboveTau: votes > tau,
		isOther: true,
		isSpeaker: false,
		isIndependentAggregate: false
	};
}

function makeIndependentAggregateRow(
	election: Election,
	votes: number,
	seatsWon: number,
	tau: number
): EnrichedElectionResult {
	return {
		partyId: `${election.countryId}-independents-aggregate`,

		usualName: 'Independents',
		shortName: 'Independents',
		codeName: 'IND',
		colour: '#ffffff',
		kind: 'independent',

		votes,
		seatsWon,

		voteShare: votes / election.totalVotes,
		seatShare: seatsWon / election.totalSeats,

		aboveTau: votes > tau,
		isOther: false,
		isSpeaker: false,
		isIndependentAggregate: true
	};
}

export function enrichElectionResults(election: Election, parties: Party[]): EnrichedElectionResult[] {
	const partyById = new Map(parties.map((party) => [party.id, party]));
	const tau = calculateTau(election.totalVotes, election.totalSeats);

	const otherParty = parties.find(
		(party) => party.countryId === election.countryId && party.kind === 'other'
	);

	if (!otherParty) {
		throw new Error(`No Other party/category found for country: ${election.countryId}`);
	}

	const ordinaryRows: EnrichedElectionResult[] = [];
	const speakerRows: EnrichedElectionResult[] = [];

	let otherVotes = 0;
	let otherSeats = 0;

	let independentVotes = 0;
	let independentSeats = 0;

	for (const result of election.results) {
		const party = partyById.get(result.partyId);

		if (!party) {
			throw new Error(`Election ${election.id} references unknown party: ${result.partyId}`);
		}

		if (party.countryId !== election.countryId) {
			throw new Error(
				`Election ${election.id} references party ${party.id}, which belongs to ${party.countryId}, not ${election.countryId}.`
			);
		}

		const aboveTau = result.votes > tau;
		const shouldDisplaySeparately = aboveTau || result.seatsWon > 0;

		// Existing Other rows are always folded into the final Other category.
		if (party.kind === 'other') {
			otherVotes += result.votes;
			otherSeats += result.seatsWon;
			continue;
		}

		// Below-threshold zero-seat parties belong in Other.
		if (!shouldDisplaySeparately) {
			otherVotes += result.votes;
			otherSeats += result.seatsWon;
			continue;
		}

		// Independents are display-aggregated.
		if (party.kind === 'independent') {
			independentVotes += result.votes;
			independentSeats += result.seatsWon;
			continue;
		}

		const row: EnrichedElectionResult = {
			partyId: party.id,

			usualName: party.usualName,
			shortName: party.shortName,
			codeName: party.codeName,
			colour: party.colour,
			kind: party.kind,

			votes: result.votes,
			seatsWon: result.seatsWon,

			voteShare: result.votes / election.totalVotes,
			seatShare: result.seatsWon / election.totalSeats,

			aboveTau,
			isOther: false,
			isSpeaker: isSpeakerLike(party),
			isIndependentAggregate: false
		};

		if (row.isSpeaker) {
			speakerRows.push(row);
		} else {
			ordinaryRows.push(row);
		}
	}

	ordinaryRows.sort((a, b) => b.votes - a.votes);
	speakerRows.sort((a, b) => b.votes - a.votes);

	const finalRows = [...ordinaryRows];

	if (independentVotes > 0 || independentSeats > 0) {
		finalRows.push(makeIndependentAggregateRow(election, independentVotes, independentSeats, tau));
	}

	finalRows.push(...speakerRows);

	if (otherVotes > 0 || otherSeats > 0) {
		finalRows.push(makeOtherRow(election, otherParty, otherVotes, otherSeats, tau));
	}

	return finalRows;
}