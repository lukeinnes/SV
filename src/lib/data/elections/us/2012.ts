import type { Election } from '../../types';

export const us2012: Election = {
	id: 'us2012',
	countryId: 'us',
	briefName: '2012',
	fullName: '2012 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 122291499,
	totalSeats: 435,
	results: [
		{
			partyId: 'us-democratic',
			votes: 59645531,
			seatsWon: 201
		},
		{
			partyId: 'us-republican',
			votes: 58283314,
			seatsWon: 234
		},
		{
			partyId: 'us-libertarian',
			votes: 1360925,
			seatsWon: 0
		},
		{
			partyId: 'us-independent',
			votes: 1240672,
			seatsWon: 0
		},
		{
			partyId: 'us-green',
			votes: 373455,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 1387602,
			seatsWon: 0
		}
	]
};
