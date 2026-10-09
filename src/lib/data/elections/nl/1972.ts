import type { Election } from '../../types';

export const nl1972: Election = {
	id: 'nl1972',
	countryId: 'nl',
	briefName: '1972',
	fullName: '1972 Dutch general election',
	actualSeatAllocation: 'PR',
	totalVotes: 7394045,
	totalSeats: 150,
	kEquivalent: {
		value: 0.47471,
		status: 'found',
		partyId: 'nl-pvda',
		note: 'Representative k within interval [0.188823, 0.760597]'
	},
	results: [
		{
			partyId: 'nl-pvda',
			votes: 2021454,
			seatsWon: 43
		},
		{
			partyId: 'nl-kvp',
			votes: 1305401,
			seatsWon: 27
		},
		{
			partyId: 'nl-vvd',
			votes: 1068375,
			seatsWon: 22
		},
		{
			partyId: 'nl-arp',
			votes: 653609,
			seatsWon: 14
		},
		{
			partyId: 'nl-ppr',
			votes: 354829,
			seatsWon: 7
		},
		{
			partyId: 'nl-chu',
			votes: 354463,
			seatsWon: 7
		},
		{
			partyId: 'nl-cpn',
			votes: 330398,
			seatsWon: 7
		},
		{
			partyId: 'nl-d66',
			votes: 307048,
			seatsWon: 6
		},
		{
			partyId: 'nl-ds70',
			votes: 304714,
			seatsWon: 6
		},
		{
			partyId: 'nl-sgp',
			votes: 163114,
			seatsWon: 3
		},
		{
			partyId: 'nl-boerenpartij',
			votes: 143239,
			seatsWon: 3
		},
		{
			partyId: 'nl-gpv',
			votes: 131236,
			seatsWon: 2
		},
		{
			partyId: 'nl-psp',
			votes: 111262,
			seatsWon: 2
		},
		{
			partyId: 'nl-rkpn',
			votes: 67658,
			seatsWon: 1
		},
		{
			partyId: 'nl-nederlandse-middenstandspartij',
			votes: 32970,
			seatsWon: 0
		},
		{
			partyId: 'nl-other',
			votes: 44275,
			seatsWon: 0
		}
	]
};
