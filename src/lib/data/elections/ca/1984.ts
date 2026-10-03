import type { Election } from '../../types';

export const ca1984: Election = {
	id: 'ca1984',
	countryId: 'ca',
	briefName: '1984',
	fullName: '1984 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 12548862,
	totalSeats: 282,
	results: [
		{
			partyId: 'ca-progressive-conservative',
			votes: 6278818,
			seatsWon: 211
		},
		{
			partyId: 'ca-liberal',
			votes: 3516486,
			seatsWon: 40
		},
		{
			partyId: 'ca-ndp',
			votes: 2359915,
			seatsWon: 30
		},
		{
			partyId: 'ca-rhinoceros',
			votes: 99178,
			seatsWon: 0
		},
		{
			partyId: 'ca-parti-nationaliste-quebec',
			votes: 85865,
			seatsWon: 0
		},
		{
			partyId: 'ca-confederation-regions',
			votes: 65655,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 39298,
			seatsWon: 1
		},
		{
			partyId: 'ca-green',
			votes: 26921,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 23514,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 22067,
			seatsWon: 0
		},
		{
			partyId: 'ca-social-credit',
			votes: 16659,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 7479,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 7007,
			seatsWon: 0
		}
	]
};
