import type { Election } from '../../types';

export const us2020: Election = {
	id: 'us2020',
	countryId: 'us',
	briefName: '2020',
	fullName: '2020 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 153431405,
	totalSeats: 435,
	results: [
		{
			partyId: 'us-democratic',
			votes: 77122690,
			seatsWon: 222
		},
		{
			partyId: 'us-republican',
			votes: 72466576,
			seatsWon: 213
		},
		{
			partyId: 'us-libertarian',
			votes: 1100639,
			seatsWon: 0
		},
		{
			partyId: 'us-independent',
			votes: 431984,
			seatsWon: 0
		},
		{
			partyId: 'us-green',
			votes: 90121,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 2219395,
			seatsWon: 0
		}
	]
};
