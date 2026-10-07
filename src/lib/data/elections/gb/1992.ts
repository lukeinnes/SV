import type { Election } from '../../types';

export const gb1992: Election = {
	id: 'gb1992',
	countryId: 'gb',
	briefName: '1992',
	fullName: '1992 United Kingdom general election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 33614072,
	totalSeats: 651,
	kEquivalent: {
		value: 4.370072,
		status: 'found',
		partyId: 'gb-conservative',
		note: 'Representative k within interval [4.344054, 4.396090]'
	},
	results: [
		{
			partyId: 'gb-conservative',
			votes: 14093007,
			seatsWon: 336
		},
		{
			partyId: 'gb-labour',
			votes: 11560484,
			seatsWon: 271
		},
		{
			partyId: 'gb-liberal-democrats',
			votes: 6010310,
			seatsWon: 20
		},
		{
			partyId: 'gb-snp',
			votes: 629564,
			seatsWon: 3
		},
		{
			partyId: 'gb-uup',
			votes: 271049,
			seatsWon: 9
		},
		{
			partyId: 'gb-sdlp',
			votes: 184445,
			seatsWon: 4
		},
		{
			partyId: 'gb-green',
			votes: 170571,
			seatsWon: 0
		},
		{
			partyId: 'gb-plaid-cymru',
			votes: 150032,
			seatsWon: 4
		},
		{
			partyId: 'gb-dup',
			votes: 103039,
			seatsWon: 3
		},
		{
			partyId: 'gb-sinn-fein',
			votes: 78291,
			seatsWon: 0
		},
		{
			partyId: 'gb-alliance-ni',
			votes: 68665,
			seatsWon: 0
		},
		{
			partyId: 'gb-liberal',
			votes: 64744,
			seatsWon: 0
		},
		{
			partyId: 'gb-natural-law',
			votes: 62888,
			seatsWon: 0
		},
		{
			partyId: 'gb-upup',
			votes: 19305,
			seatsWon: 1
		},
		{
			partyId: 'gb-mrlp',
			votes: 7929,
			seatsWon: 0
		},
		{
			partyId: 'gb-bnp',
			votes: 7631,
			seatsWon: 0
		},
		{
			partyId: 'gb-sdp',
			votes: 6649,
			seatsWon: 0
		},
		{
			partyId: 'gb-national-front',
			votes: 4816,
			seatsWon: 0
		},
		{
			partyId: 'gb-other',
			votes: 120653,
			seatsWon: 0
		}
	]
};
