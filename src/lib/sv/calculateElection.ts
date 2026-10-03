import { calculateTotalVotes, calculateTau, calculateEligibleVoteTotal } from './election';
import { calculateMandate } from './mandate';
import { calculateA } from './parameters';
import { allocateSequentialWebster } from './webster';
import type { ElectionCalculation, ElectionInput, PartyCalculation } from './types';

export function calculateElection(input: ElectionInput): ElectionCalculation {
	const totalVotes = calculateTotalVotes(input.parties);
	const tau = calculateTau(totalVotes, input.seats);
	const eligibleVoteTotal = calculateEligibleVoteTotal(input.parties, tau);
	const A = calculateA(input.k);

	if (eligibleVoteTotal <= 0) {
		throw new Error('No parties reached the threshold tau.');
	}

	const initialParties: PartyCalculation[] = input.parties.map((party) => {
		const eligible = party.votes >= tau;

		if (!eligible) {
			return {
				...party,
				eligible: false,
				x: 0,
				mandate: 0,
				fractionOfPower: 0,
				svSeats: 0,
				exclusionReason: `Votes below tau (${tau.toFixed(2)})`
			};
		}

		const x = party.votes / eligibleVoteTotal;
		const mandate = calculateMandate(x, input.k);

		return {
			...party,
			eligible: true,
			x,
			mandate,
			fractionOfPower: 0,
			svSeats: 0
		};
	});

	const totalMandate = initialParties.reduce((total, party) => total + party.mandate, 0);

	if (totalMandate <= 0) {
		throw new Error('Total mandate must be positive.');
	}

	const partiesWithPower = initialParties.map((party) => ({
		...party,
		fractionOfPower: party.eligible ? party.mandate / totalMandate : 0
	}));

	const websterInput = partiesWithPower
		.filter((party) => party.eligible)
		.map((party) => ({
			id: party.id,
			name: party.name,
			votes: party.votes,
			fractionOfPower: party.fractionOfPower
		}));

	const websterResult = allocateSequentialWebster(websterInput, input.seats);

	const finalParties = partiesWithPower.map((party) => ({
		...party,
		svSeats: websterResult.seatCounts[party.id] ?? 0
	}));

	return {
		name: input.name,
		seats: input.seats,
		k: input.k,
		A,
		totalVotes,
		tau,
		eligibleVoteTotal,
		totalMandate,
		parties: finalParties,
		websterRounds: websterResult.rounds
	};
}