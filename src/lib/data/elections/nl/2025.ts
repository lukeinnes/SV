import type { Election } from '../../types';

export const nl2025: Election = {
	id: 'nl2025',
	countryId: 'nl',
	briefName: '2025',
	fullName: '2025 Dutch general election',
	actualSeatAllocation: 'PR',
	totalVotes: 10571990,
	totalSeats: 150,
	kEquivalent: {
		value: 0.6953,
		status: 'found',
		partyId: 'nl-d66',
		note: 'Representative k within interval [0.000000, 1.390600]'
	},
	results: [
		{
			partyId: 'nl-d66',
			votes: 1790634,
			seatsWon: 26
		},
		{
			partyId: 'nl-pvv',
			votes: 1760966,
			seatsWon: 26
		},
		{
			partyId: 'nl-vvd',
			votes: 1505829,
			seatsWon: 22
		},
		{
			partyId: 'nl-groenlinks-pvda',
			votes: 1352163,
			seatsWon: 20
		},
		{
			partyId: 'nl-cda',
			votes: 1246874,
			seatsWon: 18
		},
		{
			partyId: 'nl-ja21',
			votes: 628517,
			seatsWon: 9
		},
		{
			partyId: 'nl-fvd',
			votes: 480393,
			seatsWon: 7
		},
		{
			partyId: 'nl-bbb',
			votes: 279916,
			seatsWon: 4
		},
		{
			partyId: 'nl-denk',
			votes: 250368,
			seatsWon: 3
		},
		{
			partyId: 'nl-sgp',
			votes: 238093,
			seatsWon: 3
		},
		{
			partyId: 'nl-partij-voor-de-dieren',
			votes: 219371,
			seatsWon: 3
		},
		{
			partyId: 'nl-christenunie',
			votes: 201361,
			seatsWon: 3
		},
		{
			partyId: 'nl-sp',
			votes: 199585,
			seatsWon: 3
		},
		{
			partyId: 'nl-50plus',
			votes: 151053,
			seatsWon: 2
		},
		{
			partyId: 'nl-volt',
			votes: 116468,
			seatsWon: 1
		},
		{
			partyId: 'nl-bij1',
			votes: 40360,
			seatsWon: 0
		},
		{
			partyId: 'nl-nsc',
			votes: 39408,
			seatsWon: 0
		},
		{
			partyId: 'nl-other',
			votes: 70631,
			seatsWon: 0
		}
	]
};
