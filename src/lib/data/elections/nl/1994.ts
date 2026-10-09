import type { Election } from '../../types';

export const nl1994: Election = {
	id: 'nl1994',
	countryId: 'nl',
	briefName: '1994',
	fullName: '1994 Dutch general election',
	actualSeatAllocation: 'PR',
	totalVotes: 8981556,
	totalSeats: 150,
	kEquivalent: {
		value: 0.449527,
		status: 'found',
		partyId: 'nl-pvda',
		note: 'Representative k within interval [0.057975, 0.841079]'
	},
	results: [
		{
			partyId: 'nl-pvda',
			votes: 2153135,
			seatsWon: 37
		},
		{
			partyId: 'nl-cda',
			votes: 1996418,
			seatsWon: 34
		},
		{
			partyId: 'nl-vvd',
			votes: 1792401,
			seatsWon: 31
		},
		{
			partyId: 'nl-d66',
			votes: 1391202,
			seatsWon: 24
		},
		{
			partyId: 'nl-aov',
			votes: 326401,
			seatsWon: 6
		},
		{
			partyId: 'nl-groenlinks',
			votes: 311399,
			seatsWon: 5
		},
		{
			partyId: 'nl-centrumdemocraten',
			votes: 220734,
			seatsWon: 3
		},
		{
			partyId: 'nl-rpf',
			votes: 158705,
			seatsWon: 3
		},
		{
			partyId: 'nl-sgp',
			votes: 155251,
			seatsWon: 2
		},
		{
			partyId: 'nl-gpv',
			votes: 119158,
			seatsWon: 2
		},
		{
			partyId: 'nl-sp',
			votes: 118768,
			seatsWon: 2
		},
		{
			partyId: 'nl-unie-55',
			votes: 78147,
			seatsWon: 1
		},
		{
			partyId: 'nl-other',
			votes: 159837,
			seatsWon: 0
		}
	]
};
