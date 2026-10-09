import type { Election } from '../../types';

export const jp1996: Election = {
	id: 'jp1996',
	countryId: 'jp',
	briefName: '1996',
	fullName: '1996 Japanese general election',
	actualSeatAllocation: 'Parallel',
	totalVotes: 112097617,
	totalSeats: 500,
	kEquivalent: {
		value: 4.713078,
		status: 'found',
		partyId: 'jp-ldp',
		note: 'Representative k within interval [4.677240, 4.748916]'
	},
	results: [
		{
			partyId: 'jp-ldp',
			votes: 40042051,
			seatsWon: 239
		},
		{
			partyId: 'jp-new-frontier',
			votes: 31392379,
			seatsWon: 156
		},
		{
			partyId: 'jp-dpj',
			votes: 14950856,
			seatsWon: 52
		},
		{
			partyId: 'jp-jcp',
			votes: 14365509,
			seatsWon: 26
		},
		{
			partyId: 'jp-sdp',
			votes: 4787889,
			seatsWon: 15
		},
		{
			partyId: 'jp-independent',
			votes: 2508810,
			seatsWon: 9
		},
		{
			partyId: 'jp-new-socialist',
			votes: 1339807,
			seatsWon: 0
		},
		{
			partyId: 'jp-sakigake',
			votes: 1309737,
			seatsWon: 2
		},
		{
			partyId: 'jp-liberal-league',
			votes: 1125934,
			seatsWon: 0
		},
		{
			partyId: 'jp-democratic-reform',
			votes: 168201,
			seatsWon: 1
		},
		{
			partyId: 'jp-other',
			votes: 54755,
			seatsWon: 0
		},
		{
			partyId: 'jp-okinawa-social-mass',
			votes: 51689,
			seatsWon: 0
		}
	]
};
