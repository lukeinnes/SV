import type { Election } from '../../types';

export const jp2005: Election = {
	id: 'jp2005',
	countryId: 'jp',
	briefName: '2005',
	fullName: '2005 Japanese general election',
	actualSeatAllocation: 'Parallel',
	totalVotes: 135877362,
	totalSeats: 480,
	kEquivalent: {
		value: 6.43128,
		status: 'found',
		partyId: 'jp-ldp',
		note: 'Representative k within interval [6.410246, 6.452313]'
	},
	results: [
		{
			partyId: 'jp-ldp',
			votes: 58406188,
			seatsWon: 296
		},
		{
			partyId: 'jp-dpj',
			votes: 45841212,
			seatsWon: 113
		},
		{
			partyId: 'jp-komeito',
			votes: 9968725,
			seatsWon: 31
		},
		{
			partyId: 'jp-jcp',
			votes: 9856562,
			seatsWon: 9
		},
		{
			partyId: 'jp-sdp',
			votes: 4715530,
			seatsWon: 7
		},
		{
			partyId: 'jp-independent',
			votes: 3240522,
			seatsWon: 18
		},
		{
			partyId: 'jp-new-party-nippon',
			votes: 1780678,
			seatsWon: 1
		},
		{
			partyId: 'jp-peoples-new',
			votes: 1615752,
			seatsWon: 4
		},
		{
			partyId: 'jp-new-party-daichi',
			votes: 450636,
			seatsWon: 1
		},
		{
			partyId: 'jp-other',
			votes: 1557,
			seatsWon: 0
		}
	]
};
