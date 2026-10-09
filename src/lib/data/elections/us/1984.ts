import type { Election } from '../../types';

export const us1984: Election = {
	id: 'us1984',
	countryId: 'us',
	briefName: '1984',
	fullName: '1984 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 82421838,
	totalSeats: 435,
	kEquivalent: {
		value: 5.896913,
		status: 'found',
		partyId: 'us-democratic',
		note: 'Representative k within interval [5.795678, 5.998148]'
	},
	results: [
		{
			partyId: 'us-democratic',
			votes: 42973494,
			seatsWon: 253
		},
		{
			partyId: 'us-republican',
			votes: 38642646,
			seatsWon: 181
		},
		{
			partyId: 'us-libertarian',
			votes: 275865,
			seatsWon: 0
		},
		{
			partyId: 'us-independent',
			votes: 121187,
			seatsWon: 0
		},
		{
			partyId: 'us-conservative',
			votes: 117872,
			seatsWon: 1
		},
		{
			partyId: 'us-peace-freedom',
			votes: 61543,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 229231,
			seatsWon: 0
		}
	]
};
