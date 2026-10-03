import type { WebsterRound } from './types';

export type WebsterParty = {
	id: string;
	name: string;
	fractionOfPower: number;
	votes: number;
};

export type WebsterResult = {
	seatCounts: Record<string, number>;
	rounds: WebsterRound[];
};

export function allocateSequentialWebster(parties: WebsterParty[], totalSeats: number): WebsterResult {
	if (!Number.isInteger(totalSeats) || totalSeats <= 0) {
		throw new Error('totalSeats must be a positive integer.');
	}

	if (parties.length === 0) {
		throw new Error('At least one party is required for Webster allocation.');
	}

	const seatCounts: Record<string, number> = Object.fromEntries(
		parties.map((party) => [party.id, 0])
	);

	const rounds: WebsterRound[] = [];

	for (let round = 1; round <= totalSeats; round += 1) {
		const priorities = parties.map((party) => {
			const currentSeats = seatCounts[party.id];

			return {
				party,
				priority: party.fractionOfPower / (currentSeats + 0.5)
			};
		});

		priorities.sort((a, b) => {
			if (b.priority !== a.priority) return b.priority - a.priority;
			if (b.party.fractionOfPower !== a.party.fractionOfPower) {
				return b.party.fractionOfPower - a.party.fractionOfPower;
			}
			if (b.party.votes !== a.party.votes) return b.party.votes - a.party.votes;
			return a.party.name.localeCompare(b.party.name);
		});

		const winner = priorities[0];

		seatCounts[winner.party.id] += 1;

		rounds.push({
			round,
			partyId: winner.party.id,
			partyName: winner.party.name,
			priority: winner.priority,
			newSeatTotal: seatCounts[winner.party.id]
		});
	}

	return {
		seatCounts,
		rounds
	};
}