import type { Election } from '../../types';

export const fi2023: Election = {
	id: 'fi2023',
	countryId: 'fi',
	briefName: '2023',
	fullName: '2023 Finnish parliamentary election',
	actualSeatAllocation: 'PR',
	totalVotes: 3095604,
	totalSeats: 200,
	kEquivalent: {
		value: 4.427552,
		status: 'found',
		partyId: 'fi-national-coalition',
		note: 'Representative k within interval [4.262202, 4.592902]'
	},
	results: [
		{
			partyId: 'fi-national-coalition',
			votes: 644555,
			seatsWon: 48
		},
		{
			partyId: 'fi-finns',
			votes: 620981,
			seatsWon: 46
		},
		{
			partyId: 'fi-sdp',
			votes: 617552,
			seatsWon: 43
		},
		{
			partyId: 'fi-centre',
			votes: 349640,
			seatsWon: 23
		},
		{
			partyId: 'fi-left',
			votes: 218430,
			seatsWon: 11
		},
		{
			partyId: 'fi-green',
			votes: 217795,
			seatsWon: 13
		},
		{
			partyId: 'fi-swedish-peoples',
			votes: 133518,
			seatsWon: 9
		},
		{
			partyId: 'fi-christian-democrats',
			votes: 130694,
			seatsWon: 5
		},
		{
			partyId: 'fi-movement-now',
			votes: 74995,
			seatsWon: 1
		},
		{
			partyId: 'fi-freedom-alliance',
			votes: 27558,
			seatsWon: 0
		},
		{
			partyId: 'fi-for-aland',
			votes: 11452,
			seatsWon: 1
		},
		{
			partyId: 'fi-pirate',
			votes: 3058,
			seatsWon: 0
		},
		{
			partyId: 'fi-communist',
			votes: 3044,
			seatsWon: 0
		},
		{
			partyId: 'fi-independent',
			votes: 556,
			seatsWon: 0
		},
		{
			partyId: 'fi-citizens-union',
			votes: 169,
			seatsWon: 0
		},
		{
			partyId: 'fi-other',
			votes: 41607,
			seatsWon: 0
		}
	]
};
