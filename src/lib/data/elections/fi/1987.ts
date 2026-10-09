import type { Election } from '../../types';

export const fi1987: Election = {
	id: 'fi1987',
	countryId: 'fi',
	briefName: '1987',
	fullName: '1987 Finnish parliamentary election',
	actualSeatAllocation: 'PR',
	totalVotes: 2880093,
	totalSeats: 200,
	kEquivalent: {
		value: 3.468183,
		status: 'found',
		partyId: 'fi-sdp',
		note: 'Representative k within interval [3.297860, 3.638506]'
	},
	results: [
		{
			partyId: 'fi-sdp',
			votes: 695331,
			seatsWon: 56
		},
		{
			partyId: 'fi-national-coalition',
			votes: 666236,
			seatsWon: 53
		},
		{
			partyId: 'fi-centre',
			votes: 507460,
			seatsWon: 40
		},
		{
			partyId: 'fi-skdl',
			votes: 270433,
			seatsWon: 16
		},
		{
			partyId: 'fi-rural',
			votes: 181938,
			seatsWon: 9
		},
		{
			partyId: 'fi-swedish-peoples',
			votes: 152597,
			seatsWon: 12
		},
		{
			partyId: 'fi-democratic-alternative',
			votes: 122181,
			seatsWon: 4
		},
		{
			partyId: 'fi-green',
			votes: 115988,
			seatsWon: 4
		},
		{
			partyId: 'fi-christian-democrats',
			votes: 74209,
			seatsWon: 5
		},
		{
			partyId: 'fi-pensioners',
			votes: 35100,
			seatsWon: 0
		},
		{
			partyId: 'fi-liberals',
			votes: 27824,
			seatsWon: 0
		},
		{
			partyId: 'fi-list-a-aland-1987',
			votes: 7019,
			seatsWon: 1
		},
		{
			partyId: 'fi-constitutional-right',
			votes: 3096,
			seatsWon: 0
		},
		{
			partyId: 'fi-other',
			votes: 20681,
			seatsWon: 0
		}
	]
};
