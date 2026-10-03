import type { Election } from '../../types';

export const ca2015: Election = {
	id: 'ca2015',
	countryId: 'ca',
	briefName: '2015',
	fullName: '2015 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 17591468,
	totalSeats: 338,
	results: [
		{
			partyId: 'ca-liberal',
			votes: 6942937,
			seatsWon: 184
		},
		{
			partyId: 'ca-conservative',
			votes: 5613633,
			seatsWon: 99
		},
		{
			partyId: 'ca-ndp',
			votes: 3469368,
			seatsWon: 44
		},
		{
			partyId: 'ca-bloc-quebecois',
			votes: 821144,
			seatsWon: 10
		},
		{
			partyId: 'ca-green',
			votes: 602933,
			seatsWon: 1
		},
		{
			partyId: 'ca-independent',
			votes: 40609,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 36775,
			seatsWon: 0
		},
		{
			partyId: 'ca-christian-heritage',
			votes: 15232,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 9007,
			seatsWon: 0
		},
		{
			partyId: 'ca-rhinoceros',
			votes: 7263,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 4393,
			seatsWon: 0
		},
		{
			partyId: 'ca-marijuana',
			votes: 1557,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 26617,
			seatsWon: 0
		}
	]
};
