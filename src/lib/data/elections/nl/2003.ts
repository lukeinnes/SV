import type { Election } from '../../types';

export const nl2003: Election = {
	id: 'nl2003',
	countryId: 'nl',
	briefName: '2003',
	fullName: '2003 Dutch general election',
	actualSeatAllocation: 'PR',
	totalVotes: 9654475,
	totalSeats: 150,
	kEquivalent: {
		value: 0.174914,
		status: 'found',
		partyId: 'nl-cda',
		note: 'Representative k within interval [0.000000, 0.349827]'
	},
	results: [
		{
			partyId: 'nl-cda',
			votes: 2763480,
			seatsWon: 44
		},
		{
			partyId: 'nl-pvda',
			votes: 2631363,
			seatsWon: 42
		},
		{
			partyId: 'nl-vvd',
			votes: 1728707,
			seatsWon: 28
		},
		{
			partyId: 'nl-sp',
			votes: 609723,
			seatsWon: 9
		},
		{
			partyId: 'nl-lpf',
			votes: 549975,
			seatsWon: 8
		},
		{
			partyId: 'nl-groenlinks',
			votes: 495802,
			seatsWon: 8
		},
		{
			partyId: 'nl-d66',
			votes: 393333,
			seatsWon: 6
		},
		{
			partyId: 'nl-christenunie',
			votes: 204694,
			seatsWon: 3
		},
		{
			partyId: 'nl-sgp',
			votes: 150305,
			seatsWon: 2
		},
		{
			partyId: 'nl-partij-voor-de-dieren',
			votes: 47754,
			seatsWon: 0
		},
		{
			partyId: 'nl-leefbaar-nederland',
			votes: 38894,
			seatsWon: 0
		},
		{
			partyId: 'nl-other',
			votes: 40445,
			seatsWon: 0
		}
	]
};
