import type { Election } from '../../types';

export const us1996: Election = {
	id: 'us1996',
	countryId: 'us',
	briefName: '1996',
	fullName: '1996 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 90233467,
	totalSeats: 435,
	kEquivalent: {
		value: null,
		status: 'target_below_proportional',
		partyId: 'us-democratic',
		note: 'Vote-leading party has 207 actual seats, below its minimum SV allocation of 215 seats at the proportional limit (k≈0).'
	},
	results: [
		{
			partyId: 'us-democratic',
			votes: 43507586,
			seatsWon: 207
		},
		{
			partyId: 'us-republican',
			votes: 43447962,
			seatsWon: 226
		},
		{
			partyId: 'us-libertarian',
			votes: 651448,
			seatsWon: 0
		},
		{
			partyId: 'us-independent',
			votes: 572746,
			seatsWon: 2
		},
		{
			partyId: 'us-natural-law',
			votes: 518413,
			seatsWon: 0
		},
		{
			partyId: 'us-peace-freedom',
			votes: 48136,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 1487176,
			seatsWon: 0
		}
	]
};
