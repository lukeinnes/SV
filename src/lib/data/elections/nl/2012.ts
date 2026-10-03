import type { Election } from '../../types';

export const nl2012: Election = {
	id: 'nl2012',
	countryId: 'nl',
	briefName: '2012',
	fullName: '2012 Dutch general election',
	actualSeatAllocation: 'PR',
	totalVotes: 9424235,
	totalSeats: 150,
	results: [
		{
			partyId: 'nl-vvd',
			votes: 2504948,
			seatsWon: 41
		},
		{
			partyId: 'nl-pvda',
			votes: 2340750,
			seatsWon: 38
		},
		{
			partyId: 'nl-pvv',
			votes: 950263,
			seatsWon: 15
		},
		{
			partyId: 'nl-sp',
			votes: 909853,
			seatsWon: 15
		},
		{
			partyId: 'nl-cda',
			votes: 801620,
			seatsWon: 13
		},
		{
			partyId: 'nl-d66',
			votes: 757091,
			seatsWon: 12
		},
		{
			partyId: 'nl-christenunie',
			votes: 294586,
			seatsWon: 5
		},
		{
			partyId: 'nl-groenlinks',
			votes: 219896,
			seatsWon: 4
		},
		{
			partyId: 'nl-sgp',
			votes: 196780,
			seatsWon: 3
		},
		{
			partyId: 'nl-partij-voor-de-dieren',
			votes: 182162,
			seatsWon: 2
		},
		{
			partyId: 'nl-50plus',
			votes: 177631,
			seatsWon: 2
		},
		{
			partyId: 'nl-other',
			votes: 88655,
			seatsWon: 0
		}
	]
};
