import type { Election } from '../../types';

export const ca2011: Election = {
	id: 'ca2011',
	countryId: 'ca',
	briefName: '2011',
	fullName: '2011 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 14723980,
	totalSeats: 308,
	results: [
		{
			partyId: 'ca-conservative',
			votes: 5835270,
			seatsWon: 166
		},
		{
			partyId: 'ca-ndp',
			votes: 4512411,
			seatsWon: 103
		},
		{
			partyId: 'ca-liberal',
			votes: 2783076,
			seatsWon: 34
		},
		{
			partyId: 'ca-bloc-quebecois',
			votes: 891425,
			seatsWon: 4
		},
		{
			partyId: 'ca-green',
			votes: 572095,
			seatsWon: 1
		},
		{
			partyId: 'ca-independent',
			votes: 63375,
			seatsWon: 0
		},
		{
			partyId: 'ca-christian-heritage',
			votes: 18910,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 9486,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 6002,
			seatsWon: 0
		},
		{
			partyId: 'ca-rhinoceros',
			votes: 3800,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 2894,
			seatsWon: 0
		},
		{
			partyId: 'ca-marijuana',
			votes: 1756,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 23480,
			seatsWon: 0
		}
	]
};
