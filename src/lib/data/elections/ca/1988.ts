import type { Election } from '../../types';

export const ca1988: Election = {
	id: 'ca1988',
	countryId: 'ca',
	briefName: '1988',
	fullName: '1988 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 13173499,
	totalSeats: 295,
	kEquivalent: {
		value: 5.217622,
		status: 'found',
		partyId: 'ca-progressive-conservative',
		note: 'Representative k within interval [5.177918, 5.257327]'
	},
	results: [
		{
			partyId: 'ca-progressive-conservative',
			votes: 5666492,
			seatsWon: 169
		},
		{
			partyId: 'ca-liberal',
			votes: 4203767,
			seatsWon: 83
		},
		{
			partyId: 'ca-ndp',
			votes: 2685377,
			seatsWon: 43
		},
		{
			partyId: 'ca-reform',
			votes: 275483,
			seatsWon: 0
		},
		{
			partyId: 'ca-christian-heritage',
			votes: 102568,
			seatsWon: 0
		},
		{
			partyId: 'ca-rhinoceros',
			votes: 52223,
			seatsWon: 0
		},
		{
			partyId: 'ca-green',
			votes: 47401,
			seatsWon: 0
		},
		{
			partyId: 'ca-confederation-regions',
			votes: 41497,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 33118,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 24624,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 22876,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 7183,
			seatsWon: 0
		},
		{
			partyId: 'ca-social-credit',
			votes: 3407,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 7483,
			seatsWon: 0
		}
	]
};
