import type { Election } from '../../types';

export const fi1991: Election = {
	id: 'fi1991',
	countryId: 'fi',
	briefName: '1991',
	fullName: '1991 Finnish parliamentary election',
	actualSeatAllocation: 'PR',
	totalVotes: 2725918,
	totalSeats: 200,
	kEquivalent: {
		value: 1.841983,
		status: 'found',
		partyId: 'fi-centre',
		note: 'Representative k within interval [1.587315, 2.096651]'
	},
	results: [
		{
			partyId: 'fi-centre',
			votes: 676717,
			seatsWon: 55
		},
		{
			partyId: 'fi-sdp',
			votes: 603080,
			seatsWon: 48
		},
		{
			partyId: 'fi-national-coalition',
			votes: 526487,
			seatsWon: 40
		},
		{
			partyId: 'fi-left',
			votes: 274639,
			seatsWon: 19
		},
		{
			partyId: 'fi-green',
			votes: 185894,
			seatsWon: 10
		},
		{
			partyId: 'fi-swedish-peoples',
			votes: 149476,
			seatsWon: 11
		},
		{
			partyId: 'fi-rural',
			votes: 132133,
			seatsWon: 7
		},
		{
			partyId: 'fi-christian-democrats',
			votes: 83151,
			seatsWon: 8
		},
		{
			partyId: 'fi-liberals',
			votes: 21210,
			seatsWon: 1
		},
		{
			partyId: 'fi-pensioners',
			votes: 10762,
			seatsWon: 0
		},
		{
			partyId: 'fi-constitutional-right',
			votes: 7599,
			seatsWon: 0
		},
		{
			partyId: 'fi-list-c-aland-1991',
			votes: 6546,
			seatsWon: 1
		},
		{
			partyId: 'fi-senior-citizens',
			votes: 5230,
			seatsWon: 0
		},
		{
			partyId: 'fi-ecological-green',
			votes: 3835,
			seatsWon: 0
		},
		{
			partyId: 'fi-other',
			votes: 39159,
			seatsWon: 0
		}
	]
};
