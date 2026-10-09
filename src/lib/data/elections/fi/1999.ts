import type { Election } from '../../types';

export const fi1999: Election = {
	id: 'fi1999',
	countryId: 'fi',
	briefName: '1999',
	fullName: '1999 Finnish parliamentary election',
	actualSeatAllocation: 'PR',
	totalVotes: 2681291,
	totalSeats: 200,
	kEquivalent: {
		value: 3.152936,
		status: 'found',
		partyId: 'fi-sdp',
		note: 'Representative k within interval [2.913441, 3.392431]'
	},
	results: [
		{
			partyId: 'fi-sdp',
			votes: 612963,
			seatsWon: 51
		},
		{
			partyId: 'fi-centre',
			votes: 600592,
			seatsWon: 48
		},
		{
			partyId: 'fi-national-coalition',
			votes: 563835,
			seatsWon: 46
		},
		{
			partyId: 'fi-left',
			votes: 291675,
			seatsWon: 20
		},
		{
			partyId: 'fi-green',
			votes: 194846,
			seatsWon: 11
		},
		{
			partyId: 'fi-swedish-peoples',
			votes: 137330,
			seatsWon: 11
		},
		{
			partyId: 'fi-christian-democrats',
			votes: 111835,
			seatsWon: 10
		},
		{
			partyId: 'fi-reform-group',
			votes: 28549,
			seatsWon: 1
		},
		{
			partyId: 'fi-young-finns',
			votes: 28084,
			seatsWon: 0
		},
		{
			partyId: 'fi-finns',
			votes: 26440,
			seatsWon: 1
		},
		{
			partyId: 'fi-communist',
			votes: 20442,
			seatsWon: 0
		},
		{
			partyId: 'fi-ecological-green',
			votes: 10378,
			seatsWon: 0
		},
		{
			partyId: 'fi-citizens-union',
			votes: 10104,
			seatsWon: 0
		},
		{
			partyId: 'fi-liberals-aland',
			votes: 5870,
			seatsWon: 1
		},
		{
			partyId: 'fi-senior-citizens',
			votes: 5451,
			seatsWon: 0
		},
		{
			partyId: 'fi-liberals',
			votes: 5194,
			seatsWon: 0
		},
		{
			partyId: 'fi-pensioners',
			votes: 4481,
			seatsWon: 0
		},
		{
			partyId: 'fi-other',
			votes: 23222,
			seatsWon: 0
		}
	]
};
