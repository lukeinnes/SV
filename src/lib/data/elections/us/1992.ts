import type { Election } from '../../types';

export const us1992: Election = {
	id: 'us1992',
	countryId: 'us',
	briefName: '1992',
	fullName: '1992 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 97198316,
	totalSeats: 435,
	results: [
		{
			partyId: 'us-democratic',
			votes: 48654189,
			seatsWon: 258
		},
		{
			partyId: 'us-republican',
			votes: 43812063,
			seatsWon: 176
		},
		{
			partyId: 'us-independent',
			votes: 1255726,
			seatsWon: 1
		},
		{
			partyId: 'us-libertarian',
			votes: 848614,
			seatsWon: 0
		},
		{
			partyId: 'us-peace-freedom',
			votes: 267827,
			seatsWon: 0
		},
		{
			partyId: 'us-green',
			votes: 134072,
			seatsWon: 0
		},
		{
			partyId: 'us-natural-law',
			votes: 100782,
			seatsWon: 0
		},
		{
			partyId: 'us-conservative',
			votes: 74387,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 2050656,
			seatsWon: 0
		}
	]
};
