import type { Election } from '../../types';

export const ca2006: Election = {
	id: 'ca2006',
	countryId: 'ca',
	briefName: '2006',
	fullName: '2006 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 14817159,
	totalSeats: 308,
	results: [
		{
			partyId: 'ca-conservative',
			votes: 5374071,
			seatsWon: 124
		},
		{
			partyId: 'ca-liberal',
			votes: 4479415,
			seatsWon: 103
		},
		{
			partyId: 'ca-ndp',
			votes: 2589597,
			seatsWon: 29
		},
		{
			partyId: 'ca-bloc-quebecois',
			votes: 1553201,
			seatsWon: 51
		},
		{
			partyId: 'ca-green',
			votes: 664068,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 76696,
			seatsWon: 1
		},
		{
			partyId: 'ca-christian-heritage',
			votes: 28152,
			seatsWon: 0
		},
		{
			partyId: 'ca-marijuana',
			votes: 9171,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 5164,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 3022,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 3002,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 31600,
			seatsWon: 0
		}
	]
};
