import type { Election } from '../../types';

export const fi1970: Election = {
	id: 'fi1970',
	countryId: 'fi',
	briefName: '1970',
	fullName: '1970 Finnish parliamentary election',
	actualSeatAllocation: 'PR',
	totalVotes: 2535782,
	totalSeats: 200,
	results: [
		{
			partyId: 'fi-sdp',
			votes: 594185,
			seatsWon: 52
		},
		{
			partyId: 'fi-national-coalition',
			votes: 457582,
			seatsWon: 37
		},
		{
			partyId: 'fi-centre',
			votes: 434150,
			seatsWon: 36
		},
		{
			partyId: 'fi-skdl',
			votes: 420701,
			seatsWon: 36
		},
		{
			partyId: 'fi-rural',
			votes: 265939,
			seatsWon: 18
		},
		{
			partyId: 'fi-liberals',
			votes: 150823,
			seatsWon: 8
		},
		{
			partyId: 'fi-swedish-peoples',
			votes: 142322,
			seatsWon: 12
		},
		{
			partyId: 'fi-tpsl',
			votes: 35453,
			seatsWon: 0
		},
		{
			partyId: 'fi-christian-democrats',
			votes: 28547,
			seatsWon: 1
		},
		{
			partyId: 'fi-independent',
			votes: 890,
			seatsWon: 0
		},
		{
			partyId: 'fi-other',
			votes: 5190,
			seatsWon: 0
		}
	]
};
