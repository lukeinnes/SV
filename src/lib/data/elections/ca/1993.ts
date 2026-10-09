import type { Election } from '../../types';

export const ca1993: Election = {
	id: 'ca1993',
	countryId: 'ca',
	briefName: '1993',
	fullName: '1993 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 13667671,
	totalSeats: 295,
	kEquivalent: {
		value: 4.535924,
		status: 'found',
		partyId: 'ca-liberal',
		note: 'Representative k within interval [4.508408, 4.563441]'
	},
	results: [
		{
			partyId: 'ca-liberal',
			votes: 5647952,
			seatsWon: 177
		},
		{
			partyId: 'ca-reform',
			votes: 2559245,
			seatsWon: 52
		},
		{
			partyId: 'ca-progressive-conservative',
			votes: 2186422,
			seatsWon: 2
		},
		{
			partyId: 'ca-bloc-quebecois',
			votes: 1846024,
			seatsWon: 54
		},
		{
			partyId: 'ca-ndp',
			votes: 939575,
			seatsWon: 9
		},
		{
			partyId: 'ca-national',
			votes: 187251,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 97731,
			seatsWon: 1
		},
		{
			partyId: 'ca-natural-law',
			votes: 84743,
			seatsWon: 0
		},
		{
			partyId: 'ca-green',
			votes: 32979,
			seatsWon: 0
		},
		{
			partyId: 'ca-christian-heritage',
			votes: 30358,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 14630,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 11662,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 29099,
			seatsWon: 0
		}
	]
};
