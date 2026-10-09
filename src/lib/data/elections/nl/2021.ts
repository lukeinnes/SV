import type { Election } from '../../types';

export const nl2021: Election = {
	id: 'nl2021',
	countryId: 'nl',
	briefName: '2021',
	fullName: '2021 Dutch general election',
	actualSeatAllocation: 'PR',
	totalVotes: 10422852,
	totalSeats: 150,
	kEquivalent: {
		value: 0.414021,
		status: 'found',
		partyId: 'nl-vvd',
		note: 'Representative k within interval [0.205719, 0.622323]'
	},
	results: [
		{
			partyId: 'nl-vvd',
			votes: 2279130,
			seatsWon: 34
		},
		{
			partyId: 'nl-d66',
			votes: 1565861,
			seatsWon: 24
		},
		{
			partyId: 'nl-pvv',
			votes: 1124482,
			seatsWon: 17
		},
		{
			partyId: 'nl-cda',
			votes: 990601,
			seatsWon: 15
		},
		{
			partyId: 'nl-sp',
			votes: 623371,
			seatsWon: 9
		},
		{
			partyId: 'nl-pvda',
			votes: 597192,
			seatsWon: 9
		},
		{
			partyId: 'nl-groenlinks',
			votes: 537308,
			seatsWon: 8
		},
		{
			partyId: 'nl-fvd',
			votes: 523083,
			seatsWon: 8
		},
		{
			partyId: 'nl-partij-voor-de-dieren',
			votes: 399750,
			seatsWon: 6
		},
		{
			partyId: 'nl-christenunie',
			votes: 351275,
			seatsWon: 5
		},
		{
			partyId: 'nl-volt',
			votes: 252480,
			seatsWon: 3
		},
		{
			partyId: 'nl-ja21',
			votes: 246620,
			seatsWon: 3
		},
		{
			partyId: 'nl-sgp',
			votes: 215249,
			seatsWon: 3
		},
		{
			partyId: 'nl-denk',
			votes: 211237,
			seatsWon: 3
		},
		{
			partyId: 'nl-50plus',
			votes: 106702,
			seatsWon: 1
		},
		{
			partyId: 'nl-bbb',
			votes: 104319,
			seatsWon: 1
		},
		{
			partyId: 'nl-bij1',
			votes: 87238,
			seatsWon: 1
		},
		{
			partyId: 'nl-other',
			votes: 206954,
			seatsWon: 0
		}
	]
};
