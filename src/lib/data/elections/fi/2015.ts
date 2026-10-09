import type { Election } from '../../types';

export const fi2015: Election = {
	id: 'fi2015',
	countryId: 'fi',
	briefName: '2015',
	fullName: '2015 Finnish parliamentary election',
	actualSeatAllocation: 'PR',
	totalVotes: 2968462,
	totalSeats: 200,
	kEquivalent: {
		value: 4.356358,
		status: 'found',
		partyId: 'fi-centre',
		note: 'Representative k within interval [4.056650, 4.656065]'
	},
	results: [
		{
			partyId: 'fi-centre',
			votes: 626218,
			seatsWon: 49
		},
		{
			partyId: 'fi-national-coalition',
			votes: 540212,
			seatsWon: 37
		},
		{
			partyId: 'fi-finns',
			votes: 524054,
			seatsWon: 38
		},
		{
			partyId: 'fi-sdp',
			votes: 490102,
			seatsWon: 34
		},
		{
			partyId: 'fi-green',
			votes: 253102,
			seatsWon: 15
		},
		{
			partyId: 'fi-left',
			votes: 211702,
			seatsWon: 12
		},
		{
			partyId: 'fi-swedish-peoples',
			votes: 144802,
			seatsWon: 9
		},
		{
			partyId: 'fi-christian-democrats',
			votes: 105134,
			seatsWon: 5
		},
		{
			partyId: 'fi-pirate',
			votes: 25086,
			seatsWon: 0
		},
		{
			partyId: 'fi-citizens-union',
			votes: 13638,
			seatsWon: 0
		},
		{
			partyId: 'fi-aland-coalition-2015',
			votes: 10910,
			seatsWon: 1
		},
		{
			partyId: 'fi-communist',
			votes: 7529,
			seatsWon: 0
		},
		{
			partyId: 'fi-independent',
			votes: 2075,
			seatsWon: 0
		},
		{
			partyId: 'fi-other',
			votes: 13898,
			seatsWon: 0
		}
	]
};
