import type { Election } from '../../types';

export const nl2017: Election = {
	id: 'nl2017',
	countryId: 'nl',
	briefName: '2017',
	fullName: '2017 Dutch general election',
	actualSeatAllocation: 'PR',
	totalVotes: 10516041,
	totalSeats: 150,
	kEquivalent: {
		value: 0.59989,
		status: 'found',
		partyId: 'nl-vvd',
		note: 'Representative k within interval [0.302576, 0.897204]'
	},
	results: [
		{
			partyId: 'nl-vvd',
			votes: 2238351,
			seatsWon: 33
		},
		{
			partyId: 'nl-pvv',
			votes: 1372941,
			seatsWon: 20
		},
		{
			partyId: 'nl-cda',
			votes: 1301796,
			seatsWon: 19
		},
		{
			partyId: 'nl-d66',
			votes: 1285819,
			seatsWon: 19
		},
		{
			partyId: 'nl-groenlinks',
			votes: 959600,
			seatsWon: 14
		},
		{
			partyId: 'nl-sp',
			votes: 955633,
			seatsWon: 14
		},
		{
			partyId: 'nl-pvda',
			votes: 599699,
			seatsWon: 9
		},
		{
			partyId: 'nl-christenunie',
			votes: 356271,
			seatsWon: 5
		},
		{
			partyId: 'nl-partij-voor-de-dieren',
			votes: 335214,
			seatsWon: 5
		},
		{
			partyId: 'nl-50plus',
			votes: 327131,
			seatsWon: 4
		},
		{
			partyId: 'nl-sgp',
			votes: 218950,
			seatsWon: 3
		},
		{
			partyId: 'nl-denk',
			votes: 216147,
			seatsWon: 3
		},
		{
			partyId: 'nl-fvd',
			votes: 187162,
			seatsWon: 2
		},
		{
			partyId: 'nl-other',
			votes: 161327,
			seatsWon: 0
		}
	]
};
