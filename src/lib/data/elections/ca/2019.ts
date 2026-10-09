import type { Election } from '../../types';

export const ca2019: Election = {
	id: 'ca2019',
	countryId: 'ca',
	briefName: '2019',
	fullName: '2019 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 18170880,
	totalSeats: 338,
	kEquivalent: {
		value: 0.881718,
		status: 'found',
		partyId: 'ca-conservative',
		note: 'Representative k within interval [0.792585, 0.970850]'
	},
	results: [
		{
			partyId: 'ca-conservative',
			votes: 6239227,
			seatsWon: 121
		},
		{
			partyId: 'ca-liberal',
			votes: 6018728,
			seatsWon: 157
		},
		{
			partyId: 'ca-ndp',
			votes: 2903722,
			seatsWon: 24
		},
		{
			partyId: 'ca-bloc-quebecois',
			votes: 1387030,
			seatsWon: 32
		},
		{
			partyId: 'ca-green',
			votes: 1189607,
			seatsWon: 3
		},
		{
			partyId: 'ca-peoples-party',
			votes: 294092,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 72546,
			seatsWon: 1
		},
		{
			partyId: 'ca-christian-heritage',
			votes: 18901,
			seatsWon: 0
		},
		{
			partyId: 'ca-rhinoceros',
			votes: 9538,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 8367,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 3905,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 1745,
			seatsWon: 0
		},
		{
			partyId: 'ca-marijuana',
			votes: 920,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 22552,
			seatsWon: 0
		}
	]
};
