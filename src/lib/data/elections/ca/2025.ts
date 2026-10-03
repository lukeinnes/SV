import type { Election } from '../../types';

export const ca2025: Election = {
	id: 'ca2025',
	countryId: 'ca',
	briefName: '2025',
	fullName: '2025 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 19641663,
	totalSeats: 343,
	results: [
		{
			partyId: 'ca-liberal',
			votes: 8595488,
			seatsWon: 169
		},
		{
			partyId: 'ca-conservative',
			votes: 8113484,
			seatsWon: 144
		},
		{
			partyId: 'ca-bloc-quebecois',
			votes: 1236349,
			seatsWon: 22
		},
		{
			partyId: 'ca-ndp',
			votes: 1234673,
			seatsWon: 7
		},
		{
			partyId: 'ca-green',
			votes: 238892,
			seatsWon: 1
		},
		{
			partyId: 'ca-peoples-party',
			votes: 136977,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 34289,
			seatsWon: 0
		},
		{
			partyId: 'ca-christian-heritage',
			votes: 10065,
			seatsWon: 0
		},
		{
			partyId: 'ca-rhinoceros',
			votes: 7063,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 5561,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 5209,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 4685,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 18928,
			seatsWon: 0
		}
	]
};
