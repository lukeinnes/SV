import type { Election } from '../../types';

export const us1988: Election = {
	id: 'us1988',
	countryId: 'us',
	briefName: '1988',
	fullName: '1988 United States House of Representatives election',
	actualSeatAllocation: 'FPTP',
	totalVotes: 81682185,
	totalSeats: 435,
	kEquivalent: {
		value: 4.628873,
		status: 'found',
		partyId: 'us-democratic',
		note: 'Representative k within interval [4.554490, 4.703255]'
	},
	results: [
		{
			partyId: 'us-democratic',
			votes: 43544565,
			seatsWon: 260
		},
		{
			partyId: 'us-republican',
			votes: 37209219,
			seatsWon: 175
		},
		{
			partyId: 'us-libertarian',
			votes: 445708,
			seatsWon: 0
		},
		{
			partyId: 'us-independent',
			votes: 161381,
			seatsWon: 0
		},
		{
			partyId: 'us-peace-freedom',
			votes: 89494,
			seatsWon: 0
		},
		{
			partyId: 'us-conservative',
			votes: 47577,
			seatsWon: 0
		},
		{
			partyId: 'us-other',
			votes: 184241,
			seatsWon: 0
		}
	]
};
