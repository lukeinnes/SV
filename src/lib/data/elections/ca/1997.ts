import type { Election } from '../../types';

export const ca1997: Election = {
	id: 'ca1997',
	countryId: 'ca',
	briefName: '1997',
	fullName: '1997 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 12985874,
	totalSeats: 301,
	kEquivalent: {
		value: 3.890635,
		status: 'found',
		partyId: 'ca-liberal',
		note: 'Representative k within interval [3.800235, 3.981035]'
	},
	results: [
		{
			partyId: 'ca-liberal',
			votes: 4994277,
			seatsWon: 155
		},
		{
			partyId: 'ca-reform',
			votes: 2513080,
			seatsWon: 60
		},
		{
			partyId: 'ca-progressive-conservative',
			votes: 2446705,
			seatsWon: 20
		},
		{
			partyId: 'ca-ndp',
			votes: 1434509,
			seatsWon: 21
		},
		{
			partyId: 'ca-bloc-quebecois',
			votes: 1385821,
			seatsWon: 44
		},
		{
			partyId: 'ca-green',
			votes: 55583,
			seatsWon: 0
		},
		{
			partyId: 'ca-natural-law',
			votes: 37085,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 34507,
			seatsWon: 1
		},
		{
			partyId: 'ca-christian-heritage',
			votes: 29085,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 26252,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 28970,
			seatsWon: 0
		}
	]
};
