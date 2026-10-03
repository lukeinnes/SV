import type { Election } from '../../types';

export const us1976: Election = {
	id: 'us1976',
	countryId: 'us',
	briefName: '1976',
	fullName: '1976 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 74259164,
	totalSeats: 435,
	results: [
		{
			partyId: 'us-democratic',
			votes: 41474890,
			seatsWon: 292
		},
		{
			partyId: 'us-republican',
			votes: 31380535,
			seatsWon: 143
		},
		{
			partyId: 'us-independent',
			votes: 587897,
			seatsWon: 0
		},
		{
			partyId: 'us-conservative',
			votes: 97679,
			seatsWon: 0
		},
		{
			partyId: 'us-american-independent',
			votes: 81864,
			seatsWon: 0
		},
		{
			partyId: 'us-libertarian',
			votes: 71791,
			seatsWon: 0
		},
		{
			partyId: 'us-liberal-ny',
			votes: 42642,
			seatsWon: 0
		},
		{
			partyId: 'us-peace-freedom',
			votes: 34738,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 487128,
			seatsWon: 0
		}
	]
};
