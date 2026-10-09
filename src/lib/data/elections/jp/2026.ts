import type { Election } from '../../types';

export const jp2026: Election = {
	id: 'jp2026',
	countryId: 'jp',
	briefName: '2026',
	fullName: '2026 Japanese general election',
	actualSeatAllocation: 'Parallel',
	totalVotes: 113706675,
	totalSeats: 465,
	kEquivalent: {
		value: 5.223833,
		status: 'found',
		partyId: 'jp-ldp',
		note: 'Representative k within interval [5.176784, 5.270882]'
	},
	results: [
		{
			partyId: 'jp-ldp',
			votes: 48736632,
			seatsWon: 315
		},
		{
			partyId: 'jp-centrist-reform-alliance',
			votes: 22648443,
			seatsWon: 49
		},
		{
			partyId: 'jp-dpfp',
			votes: 9816233,
			seatsWon: 28
		},
		{
			partyId: 'jp-japan-innovation',
			votes: 8685491,
			seatsWon: 36
		},
		{
			partyId: 'jp-sanseito',
			votes: 8184844,
			seatsWon: 15
		},
		{
			partyId: 'jp-jcp',
			votes: 4803692,
			seatsWon: 4
		},
		{
			partyId: 'jp-team-mirai',
			votes: 3970602,
			seatsWon: 11
		},
		{
			partyId: 'jp-reiwa',
			votes: 1927995,
			seatsWon: 1
		},
		{
			partyId: 'jp-conservative-party-japan',
			votes: 1553316,
			seatsWon: 0
		},
		{
			partyId: 'jp-independent',
			votes: 1253346,
			seatsWon: 5
		},
		{
			partyId: 'jp-tax-cuts-yukoku',
			votes: 1169491,
			seatsWon: 1
		},
		{
			partyId: 'jp-sdp',
			votes: 877268,
			seatsWon: 0
		},
		{
			partyId: 'jp-other',
			votes: 79322,
			seatsWon: 0
		}
	]
};
