export type PartyKind = 'party' | 'other' | 'independent' | 'special';

export type Country = {
	id: string;
	name: string;
	alpha2: string;
	alpha3: string;
};

export type Party = {
	id: string;
	countryId: string;
	usualName: string;
	englishName: string;
	shortName: string;
	codeName: string;
	colour: string;
	kind: PartyKind;
};

export type ElectionPartyResult = {
	partyId: string;
	votes: number;
	seatsWon: number;
};

export type KEquivalentStatus =
	| 'found'
	| 'target_below_vote_share'
	| 'target_below_proportional'
	| 'target_unreachable'
	| 'no_clear_vote_leader'
	| 'no_vote_leader'
	| 'no_eligible_target'
	| 'not_calculated';

export type KEquivalent = {
	value: number | null;
	status: KEquivalentStatus;
	partyId: string;
	note?: string;
};

export type Election = {
	id: string;
	countryId: string;
	briefName: string;
	fullName: string;
	actualSeatAllocation?: string;
	totalVotes: number;
	totalSeats: number;
	kEquivalent?: KEquivalent;
	results: ElectionPartyResult[];
	sourceNote?: string;
};
