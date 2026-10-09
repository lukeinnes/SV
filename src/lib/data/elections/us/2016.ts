import type { Election } from '../../types';

export const us2016: Election = {
	id: 'us2016',
	countryId: 'us',
	briefName: '2016',
	fullName: '2016 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 129833250,
	totalSeats: 435,
	kEquivalent: {
		value: 20.231755,
		status: 'found',
		partyId: 'us-republican',
		note: 'Representative k within interval [19.797700, 20.665810]'
	},
	results: [
		{
			partyId: 'us-republican',
			votes: 62772225,
			seatsWon: 241
		},
		{
			partyId: 'us-democratic',
			votes: 61417454,
			seatsWon: 194
		},
		{
			partyId: 'us-libertarian',
			votes: 1660923,
			seatsWon: 0
		},
		{
			partyId: 'us-independent',
			votes: 870167,
			seatsWon: 0
		},
		{
			partyId: 'us-green',
			votes: 501135,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 2611346,
			seatsWon: 0
		}
	]
};
