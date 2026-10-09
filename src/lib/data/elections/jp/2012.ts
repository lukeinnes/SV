import type { Election } from '../../types';

export const jp2012: Election = {
	id: 'jp2012',
	countryId: 'jp',
	briefName: '2012',
	fullName: '2012 Japanese general election',
	actualSeatAllocation: 'Parallel',
	totalVotes: 119806457,
	totalSeats: 480,
	kEquivalent: {
		value: 7.421236,
		status: 'found',
		partyId: 'jp-ldp',
		note: 'Representative k within interval [7.404261, 7.438212]'
	},
	results: [
		{
			partyId: 'jp-ldp',
			votes: 42267766,
			seatsWon: 294
		},
		{
			partyId: 'jp-dpj',
			votes: 23227427,
			seatsWon: 57
		},
		{
			partyId: 'jp-japan-innovation',
			votes: 19204582,
			seatsWon: 54
		},
		{
			partyId: 'jp-jcp',
			votes: 8389449,
			seatsWon: 8
		},
		{
			partyId: 'jp-your-party',
			votes: 8052831,
			seatsWon: 18
		},
		{
			partyId: 'jp-komeito',
			votes: 8002355,
			seatsWon: 31
		},
		{
			partyId: 'jp-tomorrow-party',
			votes: 6416281,
			seatsWon: 9
		},
		{
			partyId: 'jp-sdp',
			votes: 1872552,
			seatsWon: 2
		},
		{
			partyId: 'jp-independent',
			votes: 1006468,
			seatsWon: 5
		},
		{
			partyId: 'jp-new-party-daichi',
			votes: 662452,
			seatsWon: 1
		},
		{
			partyId: 'jp-happiness-realization',
			votes: 282133,
			seatsWon: 0
		},
		{
			partyId: 'jp-peoples-new',
			votes: 188032,
			seatsWon: 1
		},
		{
			partyId: 'jp-new-renaissance',
			votes: 134781,
			seatsWon: 0
		},
		{
			partyId: 'jp-new-party-nippon',
			votes: 62697,
			seatsWon: 0
		},
		{
			partyId: 'jp-other',
			votes: 36651,
			seatsWon: 0
		}
	]
};
