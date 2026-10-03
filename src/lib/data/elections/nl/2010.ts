import type { Election } from '../../types';

export const nl2010: Election = {
	id: 'nl2010',
	countryId: 'nl',
	briefName: '2010',
	fullName: '2010 Dutch general election',
	actualSeatAllocation: 'PR',
	totalVotes: 9416001,
	totalSeats: 150,
	results: [
		{
			partyId: 'nl-vvd',
			votes: 1929575,
			seatsWon: 31
		},
		{
			partyId: 'nl-pvda',
			votes: 1848805,
			seatsWon: 30
		},
		{
			partyId: 'nl-pvv',
			votes: 1454493,
			seatsWon: 24
		},
		{
			partyId: 'nl-cda',
			votes: 1281886,
			seatsWon: 21
		},
		{
			partyId: 'nl-sp',
			votes: 924696,
			seatsWon: 15
		},
		{
			partyId: 'nl-d66',
			votes: 654167,
			seatsWon: 10
		},
		{
			partyId: 'nl-groenlinks',
			votes: 628096,
			seatsWon: 10
		},
		{
			partyId: 'nl-christenunie',
			votes: 305094,
			seatsWon: 5
		},
		{
			partyId: 'nl-sgp',
			votes: 163581,
			seatsWon: 2
		},
		{
			partyId: 'nl-partij-voor-de-dieren',
			votes: 122317,
			seatsWon: 2
		},
		{
			partyId: 'nl-other',
			votes: 103291,
			seatsWon: 0
		}
	]
};
