import type { Election } from '../../types';

export const jp2024: Election = {
	id: 'jp2024',
	countryId: 'jp',
	briefName: '2024',
	fullName: '2024 Japanese general election',
	actualSeatAllocation: 'Parallel',
	totalVotes: 108811600,
	totalSeats: 465,
	kEquivalent: {
		value: 3.220527,
		status: 'found',
		partyId: 'jp-ldp',
		note: 'Representative k within interval [3.173926, 3.267128]'
	},
	results: [
		{
			partyId: 'jp-ldp',
			votes: 35450452,
			seatsWon: 191
		},
		{
			partyId: 'jp-cdp',
			votes: 27305983,
			seatsWon: 148
		},
		{
			partyId: 'jp-japan-innovation',
			votes: 11153231,
			seatsWon: 38
		},
		{
			partyId: 'jp-dpfp',
			votes: 8521117,
			seatsWon: 28
		},
		{
			partyId: 'jp-jcp',
			votes: 7058773,
			seatsWon: 8
		},
		{
			partyId: 'jp-komeito',
			votes: 6694816,
			seatsWon: 24
		},
		{
			partyId: 'jp-reiwa',
			votes: 4230505,
			seatsWon: 9
		},
		{
			partyId: 'jp-sanseito',
			votes: 3227536,
			seatsWon: 3
		},
		{
			partyId: 'jp-independent',
			votes: 2534571,
			seatsWon: 12
		},
		{
			partyId: 'jp-conservative-party-japan',
			votes: 1301459,
			seatsWon: 3
		},
		{
			partyId: 'jp-sdp',
			votes: 1217885,
			seatsWon: 1
		},
		{
			partyId: 'jp-other',
			votes: 62213,
			seatsWon: 0
		},
		{
			partyId: 'jp-nhk-party',
			votes: 53059,
			seatsWon: 0
		}
	]
};
