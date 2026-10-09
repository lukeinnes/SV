import type { Election } from '../../types';

export const nl1977: Election = {
	id: 'nl1977',
	countryId: 'nl',
	briefName: '1977',
	fullName: '1977 Dutch general election',
	actualSeatAllocation: 'PR',
	totalVotes: 8317612,
	totalSeats: 150,
	kEquivalent: {
		value: 0.340342,
		status: 'found',
		partyId: 'nl-pvda',
		note: 'Representative k within interval [0.155478, 0.525207]'
	},
	results: [
		{
			partyId: 'nl-pvda',
			votes: 2813793,
			seatsWon: 53
		},
		{
			partyId: 'nl-cda',
			votes: 2652278,
			seatsWon: 49
		},
		{
			partyId: 'nl-vvd',
			votes: 1492689,
			seatsWon: 28
		},
		{
			partyId: 'nl-d66',
			votes: 452423,
			seatsWon: 8
		},
		{
			partyId: 'nl-sgp',
			votes: 177010,
			seatsWon: 3
		},
		{
			partyId: 'nl-cpn',
			votes: 143481,
			seatsWon: 2
		},
		{
			partyId: 'nl-ppr',
			votes: 140910,
			seatsWon: 3
		},
		{
			partyId: 'nl-gpv',
			votes: 79421,
			seatsWon: 1
		},
		{
			partyId: 'nl-psp',
			votes: 77972,
			seatsWon: 1
		},
		{
			partyId: 'nl-boerenpartij',
			votes: 69914,
			seatsWon: 1
		},
		{
			partyId: 'nl-ds70',
			votes: 59487,
			seatsWon: 1
		},
		{
			partyId: 'nl-rpf',
			votes: 53220,
			seatsWon: 0
		},
		{
			partyId: 'nl-rkpn',
			votes: 33227,
			seatsWon: 0
		},
		{
			partyId: 'nl-sp',
			votes: 24420,
			seatsWon: 0
		},
		{
			partyId: 'nl-nederlandse-middenstandspartij',
			votes: 89,
			seatsWon: 0
		},
		{
			partyId: 'nl-other',
			votes: 47278,
			seatsWon: 0
		}
	]
};
