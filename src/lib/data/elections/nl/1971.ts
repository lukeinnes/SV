import type { Election } from '../../types';

export const nl1971: Election = {
	id: 'nl1971',
	countryId: 'nl',
	briefName: '1971',
	fullName: '1971 Dutch general election',
	actualSeatAllocation: 'PR',
	totalVotes: 6318152,
	totalSeats: 150,
	kEquivalent: {
		value: 0.665152,
		status: 'found',
		partyId: 'nl-pvda',
		note: 'Representative k within interval [0.413626, 0.916678]'
	},
	results: [
		{
			partyId: 'nl-pvda',
			votes: 1554280,
			seatsWon: 39
		},
		{
			partyId: 'nl-kvp',
			votes: 1379672,
			seatsWon: 35
		},
		{
			partyId: 'nl-vvd',
			votes: 653370,
			seatsWon: 16
		},
		{
			partyId: 'nl-arp',
			votes: 542742,
			seatsWon: 13
		},
		{
			partyId: 'nl-d66',
			votes: 428067,
			seatsWon: 11
		},
		{
			partyId: 'nl-chu',
			votes: 399106,
			seatsWon: 10
		},
		{
			partyId: 'nl-ds70',
			votes: 336719,
			seatsWon: 8
		},
		{
			partyId: 'nl-cpn',
			votes: 246569,
			seatsWon: 6
		},
		{
			partyId: 'nl-sgp',
			votes: 148192,
			seatsWon: 3
		},
		{
			partyId: 'nl-ppr',
			votes: 116049,
			seatsWon: 2
		},
		{
			partyId: 'nl-gpv',
			votes: 101790,
			seatsWon: 2
		},
		{
			partyId: 'nl-nederlandse-middenstandspartij',
			votes: 95706,
			seatsWon: 2
		},
		{
			partyId: 'nl-psp',
			votes: 90738,
			seatsWon: 2
		},
		{
			partyId: 'nl-boerenpartij',
			votes: 69656,
			seatsWon: 1
		},
		{
			partyId: 'nl-other',
			votes: 155496,
			seatsWon: 0
		}
	]
};
