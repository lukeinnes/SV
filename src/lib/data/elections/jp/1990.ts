import type { Election } from '../../types';

export const jp1990: Election = {
	id: 'jp1990',
	countryId: 'jp',
	briefName: '1990',
	fullName: '1990 Japanese general election',
	actualSeatAllocation: 'SNTV',
	totalVotes: 65704311,
	totalSeats: 512,
	kEquivalent: {
		value: 0.909011,
		status: 'found',
		partyId: 'jp-ldp',
		note: 'Representative k within interval [0.874502, 0.943521]'
	},
	results: [
		{
			partyId: 'jp-ldp',
			votes: 30315417,
			seatsWon: 275
		},
		{
			partyId: 'jp-sdp',
			votes: 16025473,
			seatsWon: 136
		},
		{
			partyId: 'jp-komeito',
			votes: 5242675,
			seatsWon: 45
		},
		{
			partyId: 'jp-jcp',
			votes: 5226987,
			seatsWon: 16
		},
		{
			partyId: 'jp-independent',
			votes: 4807524,
			seatsWon: 21
		},
		{
			partyId: 'jp-democratic-socialist',
			votes: 3178949,
			seatsWon: 14
		},
		{
			partyId: 'jp-socialist-democratic-federation',
			votes: 566957,
			seatsWon: 4
		},
		{
			partyId: 'jp-progressive-party',
			votes: 281793,
			seatsWon: 1
		},
		{
			partyId: 'jp-other',
			votes: 58536,
			seatsWon: 0
		}
	]
};
