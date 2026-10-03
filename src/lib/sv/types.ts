export type PartyInput = {
	id: string;
	name: string;
	votes: number;
	actualSeats?: number;
};

export type ElectionInput = {
	name: string;
	seats: number;
	parties: PartyInput[];
	k: number;
};

export type PartyCalculation = PartyInput & {
	eligible: boolean;
	x: number;
	mandate: number;
	fractionOfPower: number;
	svSeats: number;
	exclusionReason?: string;
};

export type WebsterRound = {
	round: number;
	partyId: string;
	partyName: string;
	priority: number;
	newSeatTotal: number;
};

export type ElectionCalculation = {
	name: string;
	seats: number;
	k: number;
	A: number;
	totalVotes: number;
	tau: number;
	eligibleVoteTotal: number;
	totalMandate: number;
	parties: PartyCalculation[];
	websterRounds: WebsterRound[];
};