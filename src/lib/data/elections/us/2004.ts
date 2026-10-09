import type { Election } from '../../types';

export const us2004: Election = {
	id: 'us2004',
	countryId: 'us',
	briefName: '2004',
	fullName: '2004 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 113192286,
	totalSeats: 435,
	kEquivalent: {
		value: 4.577158,
		status: 'found',
		partyId: 'us-republican',
		note: 'Representative k within interval [4.369278, 4.785037]'
	},
	results: [
		{
			partyId: 'us-republican',
			votes: 55958144,
			seatsWon: 232
		},
		{
			partyId: 'us-democratic',
			votes: 52969786,
			seatsWon: 202
		},
		{
			partyId: 'us-libertarian',
			votes: 1056844,
			seatsWon: 0
		},
		{
			partyId: 'us-independent',
			votes: 674202,
			seatsWon: 1
		},
		{
			partyId: 'us-green',
			votes: 344549,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 2188761,
			seatsWon: 0
		}
	]
};
