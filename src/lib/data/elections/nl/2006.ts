import type { Election } from '../../types';

export const nl2006: Election = {
	id: 'nl2006',
	countryId: 'nl',
	briefName: '2006',
	fullName: '2006 Dutch general election',
	actualSeatAllocation: 'PR',
	totalVotes: 9838683,
	totalSeats: 150,
	kEquivalent: {
		value: 0.381032,
		status: 'found',
		partyId: 'nl-cda',
		note: 'Representative k within interval [0.000000, 0.762065]'
	},
	results: [
		{
			partyId: 'nl-cda',
			votes: 2608573,
			seatsWon: 41
		},
		{
			partyId: 'nl-pvda',
			votes: 2085077,
			seatsWon: 33
		},
		{
			partyId: 'nl-sp',
			votes: 1630803,
			seatsWon: 25
		},
		{
			partyId: 'nl-vvd',
			votes: 1443312,
			seatsWon: 22
		},
		{
			partyId: 'nl-pvv',
			votes: 579490,
			seatsWon: 9
		},
		{
			partyId: 'nl-groenlinks',
			votes: 453054,
			seatsWon: 7
		},
		{
			partyId: 'nl-christenunie',
			votes: 390969,
			seatsWon: 6
		},
		{
			partyId: 'nl-d66',
			votes: 193232,
			seatsWon: 3
		},
		{
			partyId: 'nl-partij-voor-de-dieren',
			votes: 179988,
			seatsWon: 2
		},
		{
			partyId: 'nl-sgp',
			votes: 153266,
			seatsWon: 2
		},
		{
			partyId: 'nl-other',
			votes: 120919,
			seatsWon: 0
		}
	]
};
