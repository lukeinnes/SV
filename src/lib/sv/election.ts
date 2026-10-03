import type { PartyInput } from './types';

export function calculateTotalVotes(parties: PartyInput[]): number {
	return parties.reduce((total, party) => total + party.votes, 0);
}

export function calculateTau(totalVotes: number, seats: number): number {
	if (!Number.isFinite(totalVotes) || totalVotes <= 0) {
		throw new Error('Total votes must be a positive finite number.');
	}

	if (!Number.isInteger(seats) || seats <= 0) {
		throw new Error('Seats must be a positive integer.');
	}

	return totalVotes / seats;
}

export function calculateEligibleVoteTotal(parties: PartyInput[], tau: number): number {
	return parties
		.filter((party) => party.votes >= tau)
		.reduce((total, party) => total + party.votes, 0);
}