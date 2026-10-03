import type { Election, Party } from './types';
import type { ElectionInput, PartyInput } from '$lib/sv/types';

export type CalculationSourceParty = PartyInput & {
	kind: Party['kind'];
	usualName: string;
	shortName: string;
	codeName: string;
	colour: string;
	seatsWon: number;
};

export type CalculationElectionInput = Omit<ElectionInput, 'parties'> & {
	parties: CalculationSourceParty[];
};

export function buildCalculationInput(
	election: Election,
	parties: Party[],
	k: number
): CalculationElectionInput {
	const partyById = new Map(parties.map((party) => [party.id, party]));

	const calculationParties: CalculationSourceParty[] = election.results.map((result) => {
		const party = partyById.get(result.partyId);

		if (!party) {
			throw new Error(`Election ${election.id} references unknown party: ${result.partyId}`);
		}

		if (party.countryId !== election.countryId) {
			throw new Error(
				`Election ${election.id} references party ${party.id}, which belongs to ${party.countryId}, not ${election.countryId}.`
			);
		}

		return {
			id: party.id,
			name: party.shortName,
			votes: result.votes,
			actualSeats: result.seatsWon,

			kind: party.kind,
			usualName: party.usualName,
			shortName: party.shortName,
			codeName: party.codeName,
			colour: party.colour,
			seatsWon: result.seatsWon
		};
	});

	return {
		name: election.fullName,
		seats: election.totalSeats,
		k,
		parties: calculationParties
	};
}