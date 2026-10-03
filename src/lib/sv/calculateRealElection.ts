import type { Election, Party } from '$lib/data/types';
import { calculateA } from './parameters';
import { calculateMandate } from './mandate';

export type RealElectionWebsterRound = {
	round: number;
	partyId: string;
	partyName: string;
	priority: number;
	newSeatTotal: number;
};

export type RealPartyCalculation = {
	partyId: string;

	usualName: string;
	englishName: string;
	shortName: string;
	codeName: string;
	colour: string;
	kind: Party['kind'];

	votes: number;
	actualSeats: number;
	svSeats: number;
	seatDelta: number;

	voteShare: number;
	actualSeatShare: number;
	svSeatShare: number;

	aboveTau: boolean;
	eligible: boolean;
	x: number;
	mandate: number;
	fractionOfPower: number;

	exclusionReason?: string;
};

export type RealElectionCalculation = {
	electionId: string;
	electionName: string;
	countryId: string;

	totalVotes: number;
	totalSeats: number;

	k: number;
	A: number;
	tau: number;

	eligibleVoteTotal: number;
	totalMandate: number;

	parties: RealPartyCalculation[];
	websterRounds: RealElectionWebsterRound[];
};

type WebsterInput = {
	partyId: string;
	partyName: string;
	fractionOfPower: number;
};

type WebsterOutput = {
	seatCounts: Record<string, number>;
	rounds: RealElectionWebsterRound[];
};

function isEligibleForMandate(party: Party, votes: number, tau: number): boolean {
	if (party.kind !== 'party') return false;

	return votes > tau;
}

function getExclusionReason(party: Party, votes: number, tau: number): string | undefined {
	if (party.kind === 'other') return 'Other category: mandate always zero.';
	if (party.kind === 'independent') return 'Independent category: mandate set to zero.';
	if (party.kind === 'special') return 'Special/anachronistic category: mandate set to zero.';
	if (votes <= tau) return `Votes at or below τ (${tau.toFixed(2)}).`;

	return undefined;
}

function allocateSequentialWebsterByPower(
	parties: WebsterInput[],
	totalSeats: number
): WebsterOutput {
	if (!Number.isInteger(totalSeats) || totalSeats <= 0) {
		throw new Error('totalSeats must be a positive integer.');
	}

	if (parties.length === 0) {
		throw new Error('Cannot allocate seats because there are no eligible parties.');
	}

	const seatCounts: Record<string, number> = Object.fromEntries(
		parties.map((party) => [party.partyId, 0])
	);

	const rounds: RealElectionWebsterRound[] = [];

	for (let round = 1; round <= totalSeats; round += 1) {
		let winner: WebsterInput | undefined;
		let winningPriority = -Infinity;

		for (const party of parties) {
			const currentSeats = seatCounts[party.partyId] ?? 0;
			const priority = party.fractionOfPower / (currentSeats + 0.5);

			if (priority > winningPriority) {
				winner = party;
				winningPriority = priority;
			}
		}

		if (!winner) {
			throw new Error(`Could not identify a Webster winner in round ${round}.`);
		}

		seatCounts[winner.partyId] = (seatCounts[winner.partyId] ?? 0) + 1;

		rounds.push({
			round,
			partyId: winner.partyId,
			partyName: winner.partyName,
			priority: winningPriority,
			newSeatTotal: seatCounts[winner.partyId]
		});
	}

	return {
		seatCounts,
		rounds
	};
}

function requireParty(
	partyById: Map<string, Party>,
	election: Election,
	partyId: string
): Party {
	const party = partyById.get(partyId);

	if (!party) {
		throw new Error(`Election ${election.id} references unknown party: ${partyId}.`);
	}

	if (party.countryId !== election.countryId) {
		throw new Error(
			`Election ${election.id} references party ${party.id}, which belongs to ${party.countryId}, not ${election.countryId}.`
		);
	}

	return party;
}

export function calculateRealElection(
	election: Election,
	parties: Party[],
	k: number
): RealElectionCalculation {
	const partyById = new Map(parties.map((party) => [party.id, party]));

	if (!Number.isFinite(election.totalVotes) || election.totalVotes <= 0) {
		throw new Error(`Election ${election.id} has invalid totalVotes.`);
	}

	if (!Number.isInteger(election.totalSeats) || election.totalSeats <= 0) {
		throw new Error(`Election ${election.id} has invalid totalSeats.`);
	}

	const tau = election.totalVotes / election.totalSeats;
	const A = calculateA(k);

	const baseRows: RealPartyCalculation[] = election.results.map((result) => {
		const party = requireParty(partyById, election, result.partyId);

		const aboveTau = result.votes > tau;
		const eligible = isEligibleForMandate(party, result.votes, tau);

		return {
			partyId: party.id,

			usualName: party.usualName,
			englishName: party.englishName ?? party.usualName,
			shortName: party.shortName,
			codeName: party.codeName,
			colour: party.colour,
			kind: party.kind,

			votes: result.votes,
			actualSeats: result.seatsWon,
			svSeats: 0,
			seatDelta: 0,

			voteShare: result.votes / election.totalVotes,
			actualSeatShare: result.seatsWon / election.totalSeats,
			svSeatShare: 0,

			aboveTau,
			eligible,
			x: 0,
			mandate: 0,
			fractionOfPower: 0,

			exclusionReason: getExclusionReason(party, result.votes, tau)
		};
	});

	const eligibleVoteTotal = baseRows
		.filter((party) => party.eligible)
		.reduce((total, party) => total + party.votes, 0);

	if (eligibleVoteTotal <= 0) {
		throw new Error(`Election ${election.id} has no mandate-eligible parties.`);
	}

	const rowsWithMandate = baseRows.map((party) => {
		if (!party.eligible) return party;

		const x = party.votes / eligibleVoteTotal;
		const mandate = calculateMandate(x, k);

		return {
			...party,
			x,
			mandate
		};
	});

	const totalMandate = rowsWithMandate.reduce((total, party) => total + party.mandate, 0);

	if (totalMandate <= 0) {
		throw new Error(`Election ${election.id} has zero total mandate.`);
	}

	const rowsWithPower = rowsWithMandate.map((party) => ({
		...party,
		fractionOfPower: party.eligible ? party.mandate / totalMandate : 0
	}));

	const websterInput: WebsterInput[] = rowsWithPower
		.filter((party) => party.eligible)
		.map((party) => ({
			partyId: party.partyId,
			partyName: party.shortName,
			fractionOfPower: party.fractionOfPower
		}));

	const websterOutput = allocateSequentialWebsterByPower(websterInput, election.totalSeats);

	const finalRows = rowsWithPower.map((party) => {
		const svSeats = websterOutput.seatCounts[party.partyId] ?? 0;

		return {
			...party,
			svSeats,
			seatDelta: svSeats - party.actualSeats,
			svSeatShare: svSeats / election.totalSeats
		};
	});

	return {
		electionId: election.id,
		electionName: election.fullName,
		countryId: election.countryId,

		totalVotes: election.totalVotes,
		totalSeats: election.totalSeats,

		k,
		A,
		tau,

		eligibleVoteTotal,
		totalMandate,

		parties: finalRows,
		websterRounds: websterOutput.rounds
	};
}