import type { Election } from '../../types';

export const ca1972: Election = {
	id: 'ca1972',
	countryId: 'ca',
	briefName: '1972',
	fullName: '1972 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 9677463,
	totalSeats: 264,
	kEquivalent: {
		value: 1.64615,
		status: 'found',
		partyId: 'ca-liberal',
		note: 'Representative k within interval [1.520587, 1.771712]'
	},
	results: [
		{
			partyId: 'ca-liberal',
			votes: 3717804,
			seatsWon: 109
		},
		{
			partyId: 'ca-progressive-conservative',
			votes: 3388980,
			seatsWon: 107
		},
		{
			partyId: 'ca-ndp',
			votes: 1725719,
			seatsWon: 31
		},
		{
			partyId: 'ca-social-credit',
			votes: 730759,
			seatsWon: 15
		},
		{
			partyId: 'ca-independent',
			votes: 56685,
			seatsWon: 1
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 23938,
			seatsWon: 1
		},
		{
			partyId: 'ca-rhinoceros',
			votes: 1565,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 32013,
			seatsWon: 0
		}
	]
};
