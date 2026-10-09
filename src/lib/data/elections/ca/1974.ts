import type { Election } from '../../types';

export const ca1974: Election = {
	id: 'ca1974',
	countryId: 'ca',
	briefName: '1974',
	fullName: '1974 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 9507932,
	totalSeats: 264,
	kEquivalent: {
		value: 4.397498,
		status: 'found',
		partyId: 'ca-liberal',
		note: 'Representative k within interval [4.277747, 4.517249]'
	},
	results: [
		{
			partyId: 'ca-liberal',
			votes: 4102853,
			seatsWon: 141
		},
		{
			partyId: 'ca-progressive-conservative',
			votes: 3371319,
			seatsWon: 95
		},
		{
			partyId: 'ca-ndp',
			votes: 1467748,
			seatsWon: 16
		},
		{
			partyId: 'ca-social-credit',
			votes: 481231,
			seatsWon: 11
		},
		{
			partyId: 'ca-independent',
			votes: 38745,
			seatsWon: 1
		},
		{
			partyId: 'ca-communist',
			votes: 12100,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 551,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 33385,
			seatsWon: 0
		}
	]
};
