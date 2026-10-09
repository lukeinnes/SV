import type { Election } from '../../types';

export const fi2019: Election = {
	id: 'fi2019',
	countryId: 'fi',
	briefName: '2019',
	fullName: '2019 Finnish parliamentary election',
	actualSeatAllocation: 'PR',
	totalVotes: 3081916,
	totalSeats: 200,
	kEquivalent: {
		value: 4.803261,
		status: 'found',
		partyId: 'fi-sdp',
		note: 'Representative k within interval [4.089851, 5.516671]'
	},
	results: [
		{
			partyId: 'fi-sdp',
			votes: 546471,
			seatsWon: 40
		},
		{
			partyId: 'fi-finns',
			votes: 538805,
			seatsWon: 39
		},
		{
			partyId: 'fi-national-coalition',
			votes: 523957,
			seatsWon: 38
		},
		{
			partyId: 'fi-centre',
			votes: 423920,
			seatsWon: 31
		},
		{
			partyId: 'fi-green',
			votes: 354194,
			seatsWon: 20
		},
		{
			partyId: 'fi-left',
			votes: 251808,
			seatsWon: 16
		},
		{
			partyId: 'fi-swedish-peoples',
			votes: 139640,
			seatsWon: 9
		},
		{
			partyId: 'fi-christian-democrats',
			votes: 120144,
			seatsWon: 5
		},
		{
			partyId: 'fi-movement-now',
			votes: 69427,
			seatsWon: 1
		},
		{
			partyId: 'fi-blue-reform',
			votes: 29943,
			seatsWon: 0
		},
		{
			partyId: 'fi-pirate',
			votes: 19032,
			seatsWon: 0
		},
		{
			partyId: 'fi-for-aland',
			votes: 11640,
			seatsWon: 1
		},
		{
			partyId: 'fi-independent',
			votes: 6612,
			seatsWon: 0
		},
		{
			partyId: 'fi-communist',
			votes: 4305,
			seatsWon: 0
		},
		{
			partyId: 'fi-citizens-union',
			votes: 2444,
			seatsWon: 0
		},
		{
			partyId: 'fi-other',
			votes: 39574,
			seatsWon: 0
		}
	]
};
