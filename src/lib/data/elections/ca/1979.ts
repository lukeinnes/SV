import type { Election } from '../../types';

export const ca1979: Election = {
	id: 'ca1979',
	countryId: 'ca',
	briefName: '1979',
	fullName: '1979 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 11457008,
	totalSeats: 282,
	results: [
		{
			partyId: 'ca-liberal',
			votes: 4595319,
			seatsWon: 114
		},
		{
			partyId: 'ca-progressive-conservative',
			votes: 4111606,
			seatsWon: 136
		},
		{
			partyId: 'ca-ndp',
			votes: 2048988,
			seatsWon: 26
		},
		{
			partyId: 'ca-social-credit',
			votes: 527604,
			seatsWon: 6
		},
		{
			partyId: 'ca-rhinoceros',
			votes: 62601,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 30518,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 16042,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 9141,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 176,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 55013,
			seatsWon: 0
		}
	]
};
