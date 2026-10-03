import type { Election } from '../../types';

export const us2008: Election = {
	id: 'us2008',
	countryId: 'us',
	briefName: '2008',
	fullName: '2008 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 122547880,
	totalSeats: 435,
	results: [
		{
			partyId: 'us-democratic',
			votes: 65237840,
			seatsWon: 257
		},
		{
			partyId: 'us-republican',
			votes: 52249491,
			seatsWon: 178
		},
		{
			partyId: 'us-libertarian',
			votes: 1083096,
			seatsWon: 0
		},
		{
			partyId: 'us-independent',
			votes: 982761,
			seatsWon: 0
		},
		{
			partyId: 'us-green',
			votes: 580263,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 2414429,
			seatsWon: 0
		}
	]
};
