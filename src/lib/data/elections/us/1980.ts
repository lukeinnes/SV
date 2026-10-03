import type { Election } from '../../types';

export const us1980: Election = {
	id: 'us1980',
	countryId: 'us',
	briefName: '1980',
	fullName: '1980 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 77873917,
	totalSeats: 435,
	results: [
		{
			partyId: 'us-democratic',
			votes: 39347947,
			seatsWon: 242
		},
		{
			partyId: 'us-republican',
			votes: 37222588,
			seatsWon: 191
		},
		{
			partyId: 'us-libertarian',
			votes: 568131,
			seatsWon: 0
		},
		{
			partyId: 'us-independent',
			votes: 216403,
			seatsWon: 1
		},
		{
			partyId: 'us-conservative',
			votes: 136967,
			seatsWon: 1
		},
		{
			partyId: 'us-peace-freedom',
			votes: 45281,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 336600,
			seatsWon: 0
		}
	]
};
