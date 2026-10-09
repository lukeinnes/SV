import type { Election } from '../../types';

export const jp1993: Election = {
	id: 'jp1993',
	countryId: 'jp',
	briefName: '1993',
	fullName: '1993 Japanese general election',
	actualSeatAllocation: 'SNTV',
	totalVotes: 62804145,
	totalSeats: 511,
	kEquivalent: {
		value: 1.179568,
		status: 'found',
		partyId: 'jp-ldp',
		note: 'Representative k within interval [1.161853, 1.197284]'
	},
	results: [
		{
			partyId: 'jp-ldp',
			votes: 22999646,
			seatsWon: 223
		},
		{
			partyId: 'jp-sdp',
			votes: 9687589,
			seatsWon: 70
		},
		{
			partyId: 'jp-japan-renewal',
			votes: 6341365,
			seatsWon: 55
		},
		{
			partyId: 'jp-komeito',
			votes: 5114351,
			seatsWon: 51
		},
		{
			partyId: 'jp-japan-new-party',
			votes: 5053981,
			seatsWon: 35
		},
		{
			partyId: 'jp-jcp',
			votes: 4834588,
			seatsWon: 15
		},
		{
			partyId: 'jp-independent',
			votes: 4304189,
			seatsWon: 30
		},
		{
			partyId: 'jp-democratic-socialist',
			votes: 2205683,
			seatsWon: 15
		},
		{
			partyId: 'jp-sakigake',
			votes: 1658098,
			seatsWon: 13
		},
		{
			partyId: 'jp-socialist-democratic-federation',
			votes: 461169,
			seatsWon: 4
		},
		{
			partyId: 'jp-other',
			votes: 143486,
			seatsWon: 0
		}
	]
};
