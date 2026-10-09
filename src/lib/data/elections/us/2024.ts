import type { Election } from '../../types';

export const us2024: Election = {
	id: 'us2024',
	countryId: 'us',
	briefName: '2024',
	fullName: '2024 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 149543421,
	totalSeats: 435,
	kEquivalent: {
		value: null,
		status: 'target_below_proportional',
		partyId: 'us-republican',
		note: 'Vote-leading party has 220 actual seats, below its minimum SV allocation of 222 seats at the proportional limit (k≈0).'
	},
	results: [
		{
			partyId: 'us-republican',
			votes: 74390864,
			seatsWon: 220
		},
		{
			partyId: 'us-democratic',
			votes: 70571380,
			seatsWon: 215
		},
		{
			partyId: 'us-independent',
			votes: 852373,
			seatsWon: 0
		},
		{
			partyId: 'us-libertarian',
			votes: 709405,
			seatsWon: 0
		},
		{
			partyId: 'us-green',
			votes: 182841,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 2836558,
			seatsWon: 0
		}
	]
};
