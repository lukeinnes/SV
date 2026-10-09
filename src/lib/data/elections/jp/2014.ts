import type { Election } from '../../types';

export const jp2014: Election = {
	id: 'jp2014',
	countryId: 'jp',
	briefName: '2014',
	fullName: '2014 Japanese general election',
	actualSeatAllocation: 'Parallel',
	totalVotes: 106274237,
	totalSeats: 475,
	kEquivalent: {
		value: 4.896394,
		status: 'found',
		partyId: 'jp-ldp',
		note: 'Representative k within interval [4.872588, 4.920201]'
	},
	results: [
		{
			partyId: 'jp-ldp',
			votes: 43120365,
			seatsWon: 290
		},
		{
			partyId: 'jp-dpj',
			votes: 21692840,
			seatsWon: 73
		},
		{
			partyId: 'jp-jcp',
			votes: 13103132,
			seatsWon: 21
		},
		{
			partyId: 'jp-japan-innovation',
			votes: 12702345,
			seatsWon: 41
		},
		{
			partyId: 'jp-komeito',
			votes: 8079626,
			seatsWon: 35
		},
		{
			partyId: 'jp-japanese-kokoro',
			votes: 2362315,
			seatsWon: 2
		},
		{
			partyId: 'jp-sdp',
			votes: 1733788,
			seatsWon: 2
		},
		{
			partyId: 'jp-peoples-life',
			votes: 1543296,
			seatsWon: 2
		},
		{
			partyId: 'jp-independent',
			votes: 1511242,
			seatsWon: 9
		},
		{
			partyId: 'jp-happiness-realization',
			votes: 260111,
			seatsWon: 0
		},
		{
			partyId: 'jp-shiji-seito-nashi',
			votes: 104854,
			seatsWon: 0
		},
		{
			partyId: 'jp-other',
			votes: 43726,
			seatsWon: 0
		},
		{
			partyId: 'jp-new-renaissance',
			votes: 16597,
			seatsWon: 0
		}
	]
};
