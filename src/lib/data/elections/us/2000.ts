import type { Election } from '../../types';

export const us2000: Election = {
	id: 'us2000',
	countryId: 'us',
	briefName: '2000',
	fullName: '2000 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 98799963,
	totalSeats: 435,
	results: [
		{
			partyId: 'us-republican',
			votes: 46992383,
			seatsWon: 221
		},
		{
			partyId: 'us-democratic',
			votes: 46582167,
			seatsWon: 212
		},
		{
			partyId: 'us-libertarian',
			votes: 1610292,
			seatsWon: 0
		},
		{
			partyId: 'us-independent',
			votes: 683098,
			seatsWon: 2
		},
		{
			partyId: 'us-natural-law',
			votes: 443896,
			seatsWon: 0
		},
		{
			partyId: 'us-green',
			votes: 260087,
			seatsWon: 0
		},
		{
			partyId: 'us-conservative',
			votes: 52335,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 2175705,
			seatsWon: 0
		}
	]
};
