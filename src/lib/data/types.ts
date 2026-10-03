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
	englishName?: string;
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

export type Election = {
	id: string;
	countryId: string;
	briefName: string;
	fullName: string;
	actualSeatAllocation?: string;
	totalVotes: number;
	totalSeats: number;
	results: ElectionPartyResult[];
	sourceNote?: string;
};
