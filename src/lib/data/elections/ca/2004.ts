import type { Election } from '../../types';

export const ca2004: Election = {
	id: 'ca2004',
	countryId: 'ca',
	briefName: '2004',
	fullName: '2004 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 13564702,
	totalSeats: 308,
	kEquivalent: {
		value: 3.145445,
		status: 'found',
		partyId: 'ca-liberal',
		note: 'Representative k within interval [3.093490, 3.197399]'
	},
	results: [
		{
			partyId: 'ca-liberal',
			votes: 4982220,
			seatsWon: 135
		},
		{
			partyId: 'ca-conservative',
			votes: 4019498,
			seatsWon: 99
		},
		{
			partyId: 'ca-ndp',
			votes: 2127403,
			seatsWon: 19
		},
		{
			partyId: 'ca-bloc-quebecois',
			votes: 1680109,
			seatsWon: 54
		},
		{
			partyId: 'ca-green',
			votes: 582247,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 47068,
			seatsWon: 1
		},
		{
			partyId: 'ca-christian-heritage',
			votes: 40335,
			seatsWon: 0
		},
		{
			partyId: 'ca-marijuana',
			votes: 33276,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 17796,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 4426,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 1949,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 28375,
			seatsWon: 0
		}
	]
};
