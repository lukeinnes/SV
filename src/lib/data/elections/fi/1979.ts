import type { Election } from '../../types';

export const fi1979: Election = {
	id: 'fi1979',
	countryId: 'fi',
	briefName: '1979',
	fullName: '1979 Finnish parliamentary election',
	actualSeatAllocation: 'PR',
	totalVotes: 2894446,
	totalSeats: 200,
	kEquivalent: {
		value: 2.280593,
		status: 'found',
		partyId: 'fi-sdp',
		note: 'Representative k within interval [1.902375, 2.658812]'
	},
	results: [
		{
			partyId: 'fi-sdp',
			votes: 691512,
			seatsWon: 52
		},
		{
			partyId: 'fi-national-coalition',
			votes: 626764,
			seatsWon: 47
		},
		{
			partyId: 'fi-skdl',
			votes: 518045,
			seatsWon: 35
		},
		{
			partyId: 'fi-centre',
			votes: 500478,
			seatsWon: 36
		},
		{
			partyId: 'fi-christian-democrats',
			votes: 138244,
			seatsWon: 9
		},
		{
			partyId: 'fi-rural',
			votes: 132457,
			seatsWon: 7
		},
		{
			partyId: 'fi-swedish-peoples',
			votes: 122418,
			seatsWon: 9
		},
		{
			partyId: 'fi-liberals',
			votes: 106560,
			seatsWon: 4
		},
		{
			partyId: 'fi-constitutional-right',
			votes: 34958,
			seatsWon: 0
		},
		{
			partyId: 'fi-skyp',
			votes: 9316,
			seatsWon: 0
		},
		{
			partyId: 'fi-aland-coalition',
			votes: 9286,
			seatsWon: 1
		},
		{
			partyId: 'fi-other',
			votes: 4408,
			seatsWon: 0
		}
	]
};
