import type { Election } from '../../types';

export const us1972: Election = {
	id: 'us1972',
	countryId: 'us',
	briefName: '1972',
	fullName: '1972 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 71188405,
	totalSeats: 435,
	results: [
		{
			partyId: 'us-democratic',
			votes: 36780100,
			seatsWon: 242
		},
		{
			partyId: 'us-republican',
			votes: 33064172,
			seatsWon: 192
		},
		{
			partyId: 'us-conservative',
			votes: 376863,
			seatsWon: 0
		},
		{
			partyId: 'us-liberal-ny',
			votes: 251807,
			seatsWon: 0
		},
		{
			partyId: 'us-american-independent',
			votes: 233967,
			seatsWon: 0
		},
		{
			partyId: 'us-independent',
			votes: 137664,
			seatsWon: 1
		},
		{
			partyId: 'us-peace-freedom',
			votes: 63894,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 279938,
			seatsWon: 0
		}
	]
};
