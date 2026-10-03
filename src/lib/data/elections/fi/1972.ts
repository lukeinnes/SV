import type { Election } from '../../types';

export const fi1972: Election = {
	id: 'fi1972',
	countryId: 'fi',
	briefName: '1972',
	fullName: '1972 Finnish parliamentary election',
	actualSeatAllocation: 'PR',
	totalVotes: 2577949,
	totalSeats: 200,
	results: [
		{
			partyId: 'fi-sdp',
			votes: 664724,
			seatsWon: 55
		},
		{
			partyId: 'fi-national-coalition',
			votes: 453434,
			seatsWon: 34
		},
		{
			partyId: 'fi-skdl',
			votes: 438757,
			seatsWon: 37
		},
		{
			partyId: 'fi-centre',
			votes: 423039,
			seatsWon: 35
		},
		{
			partyId: 'fi-rural',
			votes: 236206,
			seatsWon: 18
		},
		{
			partyId: 'fi-swedish-peoples',
			votes: 135596,
			seatsWon: 10
		},
		{
			partyId: 'fi-liberals',
			votes: 132955,
			seatsWon: 7
		},
		{
			partyId: 'fi-christian-democrats',
			votes: 65228,
			seatsWon: 4
		},
		{
			partyId: 'fi-tpsl',
			votes: 25527,
			seatsWon: 0
		},
		{
			partyId: 'fi-other',
			votes: 2483,
			seatsWon: 0
		}
	]
};
