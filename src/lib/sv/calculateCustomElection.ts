import { calculateMandate } from './mandate';
import { calculateA } from './parameters';

export type CustomPartyKind = 'party' | 'other' | 'independent' | 'special';

export type CustomPartyInput = {
	id: string;
	name: string;
	abbreviation: string;
	colour: string;
	kind: CustomPartyKind;

	/**
	 * Vote share in percentage points.
	 * Example: 42.5 means 42.5%, not 0.425.
	 */
	voteShare: number;
};

export type CustomElectionInput = {
	name: string;
	totalSeats: number;
	k: number;
	parties: CustomPartyInput[];
};

export type CustomPartyCalculation = CustomPartyInput & {
	voteShareFraction: number;
	aboveTau: boolean;
	eligible: boolean;

	x: number;
	mandate: number;
	fractionOfPower: number;

	svSeats: number;
	svSeatShare: number;

	exclusionReason?: string;
};

export type CustomElectionWebsterRound = {
	round: number;
	partyId: string;
	partyName: string;
	priority: number;
	newSeatTotal: number;
};

function calculateConsolidationIndex(totalMandate: number, A: number, k: number): number {
	const minimumMandate = A * k;
	const maximumMandate = 2000;
	const denominator = maximumMandate - minimumMandate;

	if (Math.abs(denominator) < 1e-12) {
		throw new Error('Cannot calculate Consolidation Index because the denominator is too close to zero.');
	}

	return (100 * (totalMandate - minimumMandate)) / denominator;
}

export type CustomElectionCalculation = {
	name: string;
	totalSeats: number;
	k: number;
	A: number;

	totalVoteShare: number;
	tau: number;
	tauPercentage: number;

	eligibleVoteShareTotal: number;
	totalMandate: number;
	consolidationIndex: number;

	parties: CustomPartyCalculation[];
	websterRounds: CustomElectionWebsterRound[];
};

type WebsterInput = {
	partyId: string;
	partyName: string;
	fractionOfPower: number;
};

type WebsterOutput = {
	seatCounts: Record<string, number>;
	rounds: CustomElectionWebsterRound[];
};

const VOTE_TOTAL_TOLERANCE = 0.000001;

function isEligibleForMandate(party: CustomPartyInput, tauPercentage: number): boolean {
	if (party.kind !== 'party') return false;

	return party.voteShare > tauPercentage;
}

function getExclusionReason(
	party: CustomPartyInput,
	tauPercentage: number
): string | undefined {
	if (party.kind === 'other') return 'Other category: mandate always zero.';
	if (party.kind === 'independent') return 'Independent category: mandate set to zero.';
	if (party.kind === 'special') return 'Special/anachronistic category: mandate set to zero.';

	if (party.voteShare <= tauPercentage) {
		return `Votes at or below τ (${tauPercentage.toFixed(4)}%).`;
	}

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

	const rounds: CustomElectionWebsterRound[] = [];

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

export function validateCustomElection(input: CustomElectionInput): string[] {
	const issues: string[] = [];

	if (!Number.isInteger(input.totalSeats) || input.totalSeats <= 0) {
		issues.push('Total seats must be a positive whole number.');
	}

	if (!Number.isFinite(input.k) || input.k <= 0) {
		issues.push('k must be a positive number.');
	}

	if (input.parties.length === 0) {
		issues.push('Add at least one party.');
	}

	const seenIds = new Set<string>();

	for (const party of input.parties) {
		if (!party.id.trim()) {
			issues.push('Every party needs an id.');
		}

		if (seenIds.has(party.id)) {
			issues.push(`Duplicate party id: ${party.id}.`);
		}

		seenIds.add(party.id);

		if (!party.name.trim()) {
			issues.push(`Party ${party.id} needs a name.`);
		}

		if (!party.abbreviation.trim()) {
			issues.push(`Party ${party.name || party.id} needs an abbreviation.`);
		}

		if (!Number.isFinite(party.voteShare) || party.voteShare < 0) {
			issues.push(`Party ${party.name || party.id} has an invalid vote share.`);
		}

		if (!party.colour.startsWith('#')) {
			issues.push(`Party ${party.name || party.id} needs a hex colour such as #2563EB.`);
		}
	}

	const totalVoteShare = input.parties.reduce((total, party) => total + party.voteShare, 0);

	if (Math.abs(totalVoteShare - 100) > VOTE_TOTAL_TOLERANCE) {
		issues.push(`Vote shares must sum to 100%. Current total is ${totalVoteShare.toFixed(4)}%.`);
	}

	return issues;
}

export function calculateCustomElection(
	input: CustomElectionInput
): CustomElectionCalculation {
	const issues = validateCustomElection(input);

	if (issues.length > 0) {
		throw new Error(issues.join(' '));
	}

	const A = calculateA(input.k);
	const tau = 1 / input.totalSeats;
	const tauPercentage = tau * 100;

	const baseRows: CustomPartyCalculation[] = input.parties.map((party) => {
		const aboveTau = party.voteShare > tauPercentage;
		const eligible = isEligibleForMandate(party, tauPercentage);

		return {
			...party,

			voteShareFraction: party.voteShare / 100,
			aboveTau,
			eligible,

			x: 0,
			mandate: 0,
			fractionOfPower: 0,

			svSeats: 0,
			svSeatShare: 0,

			exclusionReason: getExclusionReason(party, tauPercentage)
		};
	});

	const eligibleVoteShareTotal = baseRows
		.filter((party) => party.eligible)
		.reduce((total, party) => total + party.voteShare, 0);

	if (eligibleVoteShareTotal <= 0) {
		throw new Error('There are no mandate-eligible parties.');
	}

	const rowsWithMandate = baseRows.map((party) => {
		if (!party.eligible) return party;

		const x = party.voteShare / eligibleVoteShareTotal;
		const mandate = calculateMandate(x, input.k);

		return {
			...party,
			x,
			mandate
		};
	});

	const totalMandate = rowsWithMandate.reduce((total, party) => total + party.mandate, 0);

	if (totalMandate <= 0) {
		throw new Error('Total mandate is zero.');
	}

	const rowsWithPower = rowsWithMandate.map((party) => ({
		...party,
		fractionOfPower: party.eligible ? party.mandate / totalMandate : 0
	}));

	const websterInput: WebsterInput[] = rowsWithPower
		.filter((party) => party.eligible)
		.map((party) => ({
			partyId: party.id,
			partyName: party.abbreviation,
			fractionOfPower: party.fractionOfPower
		}));

	const websterOutput = allocateSequentialWebsterByPower(websterInput, input.totalSeats);

	const finalRows = rowsWithPower.map((party) => {
		const svSeats = websterOutput.seatCounts[party.id] ?? 0;

		return {
			...party,
			svSeats,
			svSeatShare: svSeats / input.totalSeats
		};
	});

    const consolidationIndex = calculateConsolidationIndex(totalMandate, A, input.k);

	return {
        name: input.name,
        totalSeats: input.totalSeats,
        k: input.k,
        A,

        totalVoteShare: 100,
        tau,
        tauPercentage,

        eligibleVoteShareTotal,
        totalMandate,
        consolidationIndex,

        parties: finalRows,
        websterRounds: websterOutput.rounds
	};
}