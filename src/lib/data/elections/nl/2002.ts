import type { Election } from '../../types';

export const nl2002: Election = {
	id: 'nl2002',
	countryId: 'nl',
	briefName: '2002',
	fullName: '2002 Dutch general election',
	actualSeatAllocation: 'PR',
	totalVotes: 9501152,
	totalSeats: 150,
	kEquivalent: {
		value: 0.388179,
		status: 'found',
		partyId: 'nl-cda',
		note: 'Representative k within interval [0.253187, 0.523170]'
	},
	results: [
		{
			partyId: 'nl-cda',
			votes: 2653723,
			seatsWon: 43
		},
		{
			partyId: 'nl-lpf',
			votes: 1614801,
			seatsWon: 26
		},
		{
			partyId: 'nl-vvd',
			votes: 1466722,
			seatsWon: 24
		},
		{
			partyId: 'nl-pvda',
			votes: 1436023,
			seatsWon: 23
		},
		{
			partyId: 'nl-groenlinks',
			votes: 660692,
			seatsWon: 10
		},
		{
			partyId: 'nl-sp',
			votes: 560447,
			seatsWon: 9
		},
		{
			partyId: 'nl-d66',
			votes: 484317,
			seatsWon: 7
		},
		{
			partyId: 'nl-christenunie',
			votes: 240953,
			seatsWon: 4
		},
		{
			partyId: 'nl-sgp',
			votes: 163562,
			seatsWon: 2
		},
		{
			partyId: 'nl-leefbaar-nederland',
			votes: 153055,
			seatsWon: 2
		},
		{
			partyId: 'nl-other',
			votes: 66857,
			seatsWon: 0
		}
	]
};
