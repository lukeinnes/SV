import type { Election } from '../../types';

export const ca2008: Election = {
	id: 'ca2008',
	countryId: 'ca',
	briefName: '2008',
	fullName: '2008 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 13834294,
	totalSeats: 308,
	kEquivalent: {
		value: 3.285686,
		status: 'found',
		partyId: 'ca-conservative',
		note: 'Representative k within interval [3.259362, 3.312011]'
	},
	results: [
		{
			partyId: 'ca-conservative',
			votes: 5209069,
			seatsWon: 143
		},
		{
			partyId: 'ca-liberal',
			votes: 3633185,
			seatsWon: 77
		},
		{
			partyId: 'ca-ndp',
			votes: 2515288,
			seatsWon: 37
		},
		{
			partyId: 'ca-bloc-quebecois',
			votes: 1379991,
			seatsWon: 49
		},
		{
			partyId: 'ca-green',
			votes: 937613,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 89387,
			seatsWon: 2
		},
		{
			partyId: 'ca-christian-heritage',
			votes: 26475,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 7300,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 5457,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 3572,
			seatsWon: 0
		},
		{
			partyId: 'ca-marijuana',
			votes: 2298,
			seatsWon: 0
		},
		{
			partyId: 'ca-rhinoceros',
			votes: 2122,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 22537,
			seatsWon: 0
		}
	]
};
