import type { Election } from '../../types';

export const ca2021: Election = {
	id: 'ca2021',
	countryId: 'ca',
	briefName: '2021',
	fullName: '2021 Canadian federal election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 17034243,
	totalSeats: 338,
	results: [
		{
			partyId: 'ca-conservative',
			votes: 5747410,
			seatsWon: 119
		},
		{
			partyId: 'ca-liberal',
			votes: 5556629,
			seatsWon: 160
		},
		{
			partyId: 'ca-ndp',
			votes: 3036348,
			seatsWon: 25
		},
		{
			partyId: 'ca-bloc-quebecois',
			votes: 1301615,
			seatsWon: 32
		},
		{
			partyId: 'ca-peoples-party',
			votes: 840993,
			seatsWon: 0
		},
		{
			partyId: 'ca-green',
			votes: 396988,
			seatsWon: 2
		},
		{
			partyId: 'ca-maverick',
			votes: 35178,
			seatsWon: 0
		},
		{
			partyId: 'ca-independent',
			votes: 25605,
			seatsWon: 0
		},
		{
			partyId: 'ca-christian-heritage',
			votes: 8985,
			seatsWon: 0
		},
		{
			partyId: 'ca-no-affiliation',
			votes: 6876,
			seatsWon: 0
		},
		{
			partyId: 'ca-rhinoceros',
			votes: 6085,
			seatsWon: 0
		},
		{
			partyId: 'ca-libertarian',
			votes: 4765,
			seatsWon: 0
		},
		{
			partyId: 'ca-communist',
			votes: 4700,
			seatsWon: 0
		},
		{
			partyId: 'ca-marijuana',
			votes: 2031,
			seatsWon: 0
		},
		{
			partyId: 'ca-other',
			votes: 60035,
			seatsWon: 0
		}
	]
};
