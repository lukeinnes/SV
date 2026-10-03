import type { Election } from '../../types';

export const fi1975: Election = {
	id: 'fi1975',
	countryId: 'fi',
	briefName: '1975',
	fullName: '1975 Finnish parliamentary election',
	actualSeatAllocation: 'PR',
	totalVotes: 2749818,
	totalSeats: 200,
	results: [
		{
			partyId: 'fi-sdp',
			votes: 683590,
			seatsWon: 54
		},
		{
			partyId: 'fi-skdl',
			votes: 519483,
			seatsWon: 40
		},
		{
			partyId: 'fi-national-coalition',
			votes: 505145,
			seatsWon: 35
		},
		{
			partyId: 'fi-centre',
			votes: 484772,
			seatsWon: 39
		},
		{
			partyId: 'fi-swedish-peoples',
			votes: 128211,
			seatsWon: 9
		},
		{
			partyId: 'fi-liberals',
			votes: 119534,
			seatsWon: 9
		},
		{
			partyId: 'fi-rural',
			votes: 98815,
			seatsWon: 2
		},
		{
			partyId: 'fi-christian-democrats',
			votes: 90599,
			seatsWon: 9
		},
		{
			partyId: 'fi-skyp',
			votes: 45402,
			seatsWon: 1
		},
		{
			partyId: 'fi-constitutional-right',
			votes: 43344,
			seatsWon: 1
		},
		{
			partyId: 'fi-aland-coalition',
			votes: 9482,
			seatsWon: 1
		},
		{
			partyId: 'fi-other',
			votes: 21441,
			seatsWon: 0
		}
	]
};
